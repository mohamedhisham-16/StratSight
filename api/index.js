const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const RSSParser = require('rss-parser');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const app = express();
const parser = new RSSParser();
const PORT = process.env.PORT || 5000;

// Scoring Configurations
const SCORING_CONFIG_LISTED = {
  DOMAIN_OVERLAP: { CATEGORY: 0.2, SUB_CATEGORY: 0.15, ADJACENT: 0.08 },
  FINANCIAL: { POSITIVE: 0.1, IMPROVING: 0.08, DEEP_LOSS: -0.06, REVENUE: 0.09, FUNDRAISE: 0.07, PROFITABILITY: 0.06 },
  PROXIMITY: { SAME_CITY: 0.07, SAME_REGION: 0.04 },
  CONFIDENCE: { COMPLETENESS: 0.06, SPARSE: -0.04 }
};

const SCORING_CONFIG_NON_LISTED = {
  DOMAIN_OVERLAP: { CATEGORY: 0.18, ADJACENT: 0.07 },
  ANNUAL: { STRONG_POS: 0.14, MOD_POS: 0.1, NEAR_BE: 0.06, DEEP_LOSS: -0.07 },
  QUARTERLY: { POSITIVE: 0.1, IMPROVING: 0.07, DECLINING: -0.04 },
  NEWS_MOMENTUM: { GROWTH: 0.09, FUNDRAISE: 0.08, CASHFLOW: 0.06, NARROWING: 0.05 },
  CONFIDENCE: { FULL: 0.05, SPARSE: -0.03 }
};

const ADJACENCY_MAP = {
  'EV Mobility': ['EV Infra'],
  'EV Infra': ['EV Mobility'],
  'Aerospace': ['Defense'],
  'Defense': ['Aerospace'],
  'Logistics': ['E-commerce'],
  'E-commerce': ['Logistics'],
  'HealthTech': ['InsurTech'],
  'InsurTech': ['HealthTech'],
  'FinTech': ['SaaS'],
  'SaaS': ['FinTech']
};

const METRO_CLUSTERS = {
  'NCR': ['Gurugram', 'Noida', 'Delhi', 'New Delhi', 'Greater Noida'],
  'Mumbai': ['Mumbai', 'Navi Mumbai', 'Thane'],
  'Bangalore': ['Bangalore', 'Bengaluru'],
  'Hyderabad': ['Hyderabad'],
  'Chennai': ['Chennai'],
  'Pune': ['Pune']
};

// Helper: Get metro cluster
function getMetroRegion(locationStr) {
  if (!locationStr) return null;
  const city = locationStr.split(',')[0].trim();
  for (const [region, cities] of Object.entries(METRO_CLUSTERS)) {
    if (cities.some(c => c.toLowerCase() === city.toLowerCase())) return region;
  }
  return city;
}

// Helper: Parse profit percentage
function parseProfit(str) {
  if (!str || str === 'N/A') return null;
  const match = str.match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}

// Helper: Keyword matching
function hasKeywords(text, keywords) {
  if (!text) return false;
  return keywords.some(k => text.toLowerCase().includes(k.toLowerCase()));
}

// Fallback Function: Basic scoring if performance data is missing
function calculateFallbackScore(competitor, targetDomain, targetRegion) {
  let score = 0;
  // Domain Match (using source fields)
  if (getSimilarity(targetDomain, competitor[1] || '') >= 0.8) score += 0.3;
  if (getSimilarity(targetDomain, competitor[2] || '') >= 0.8) score += 0.2;

  // Region Match
  if (targetRegion && getSimilarity(targetRegion, competitor[3] || '') >= 0.8) score += 0.1;

  // Rating influence
  const rating = parseFloat(competitor[4]) || 0;
  score += (rating / 10) * 0.2;

  return Math.min(score, 1).toFixed(2);
}

// Algorithm: Listed Company Competitor Scoring
function calculateListedScore(comp, perfData, targetDomain, targetRegion) {
  let score = 0;
  const perfSector = perfData.Sector || '';
  const perfSubsector = perfData.Subsector || '';

  if (perfSector.toLowerCase() === targetDomain.toLowerCase()) {
    score += SCORING_CONFIG_LISTED.DOMAIN_OVERLAP.CATEGORY;
  } else if (ADJACENCY_MAP[targetDomain] && ADJACENCY_MAP[targetDomain].includes(perfSector)) {
    score += SCORING_CONFIG_LISTED.DOMAIN_OVERLAP.ADJACENT;
  }

  if (perfSubsector && getSimilarity(targetDomain, perfSubsector) >= 0.8) {
    score += SCORING_CONFIG_LISTED.DOMAIN_OVERLAP.SUB_CATEGORY;
  }

  const annualProfit = parseProfit(perfData['Last Annual Profit %']);
  const monthNews = perfData['Last Month News/Profit'] || '';

  if (annualProfit !== null) {
    if (annualProfit > 0) score += SCORING_CONFIG_LISTED.FINANCIAL.POSITIVE;
    if (annualProfit < -80) score += SCORING_CONFIG_LISTED.FINANCIAL.DEEP_LOSS;
  }

  if (hasKeywords(monthNews, ['narrowed', 'improved', 'reduced loss'])) score += SCORING_CONFIG_LISTED.FINANCIAL.IMPROVING;
  if (hasKeywords(monthNews, ['Rs 50 Cr', 'USD 10M', '$10M', 'revenue jumped'])) score += SCORING_CONFIG_LISTED.FINANCIAL.REVENUE;
  if (hasKeywords(monthNews, ['raised', 'funding', 'Series', 'million', '$', 'round'])) score += SCORING_CONFIG_LISTED.FINANCIAL.FUNDRAISE;
  if (hasKeywords(monthNews, ['profitable', 'EBITDA positive', 'cash flow positive'])) score += SCORING_CONFIG_LISTED.FINANCIAL.PROFITABILITY;

  if (targetRegion) {
    const compLocation = perfData.Location || comp[3] || '';
    const compCity = compLocation.split(',')[0].trim();
    const targetCity = targetRegion.split(',')[0].trim();

    if (compCity.toLowerCase() === targetCity.toLowerCase()) {
      score += SCORING_CONFIG_LISTED.PROXIMITY.SAME_CITY;
    } else {
      const compReg = getMetroRegion(compLocation);
      const targetRegCluster = getMetroRegion(targetRegion);
      if (compReg && targetRegCluster && compReg === targetRegCluster) {
        score += SCORING_CONFIG_LISTED.PROXIMITY.SAME_REGION;
      }
    }
  }

  const fields = [perfData['Last Quarter Profit %'], perfData['Last Annual Profit %'], monthNews];
  const nonNullCount = fields.filter(f => f && f !== 'N/A').length;
  if (nonNullCount === 3) score += SCORING_CONFIG_LISTED.CONFIDENCE.COMPLETENESS;
  if (nonNullCount === 1) score += SCORING_CONFIG_LISTED.CONFIDENCE.SPARSE;

  return Math.max(0, Math.min(1, score)).toFixed(2);
}

// Algorithm: Non-Listed Company Competitor Scoring
function calculateNonListedScore(comp, perfData, targetDomain) {
  let score = 0;
  const perfCategory = perfData.Category || '';

  // Domain Overlap
  if (perfCategory.toLowerCase() === targetDomain.toLowerCase()) {
    score += SCORING_CONFIG_NON_LISTED.DOMAIN_OVERLAP.CATEGORY;
  } else if (ADJACENCY_MAP[targetDomain] && ADJACENCY_MAP[targetDomain].includes(perfCategory)) {
    score += SCORING_CONFIG_NON_LISTED.DOMAIN_OVERLAP.ADJACENT;
  }

  // Annual Health
  const annualProfit = parseProfit(perfData['Last Annual Profit %']);
  if (annualProfit !== null) {
    if (annualProfit > 20) score += SCORING_CONFIG_NON_LISTED.ANNUAL.STRONG_POS;
    else if (annualProfit >= 0) score += SCORING_CONFIG_NON_LISTED.ANNUAL.MOD_POS;
    else if (annualProfit >= -5) score += SCORING_CONFIG_NON_LISTED.ANNUAL.NEAR_BE;
    else if (annualProfit < -40) score += SCORING_CONFIG_NON_LISTED.ANNUAL.DEEP_LOSS;
  }

  // Quarterly Momentum
  const quarterProfit = parseProfit(perfData['Last Quarter Profit %']);
  const monthNews = perfData['Last Month Profit (News/Notes)'] || '';

  if (quarterProfit !== null) {
    if (quarterProfit > 0) score += SCORING_CONFIG_NON_LISTED.QUARTERLY.POSITIVE;
    if (quarterProfit > (annualProfit || -Infinity) || hasKeywords(monthNews, ['narrowed', 'improved', 'reduced'])) {
      score += SCORING_CONFIG_NON_LISTED.QUARTERLY.IMPROVING;
    } else if (annualProfit !== null && quarterProfit < annualProfit && !hasKeywords(monthNews, ['narrowed', 'improved', 'reduced'])) {
      score += SCORING_CONFIG_NON_LISTED.QUARTERLY.DECLINING;
    }
  }

  // News Momentum
  if (hasKeywords(monthNews, ['record', '5x growth', 'jumped', 'quarterly profit', 'highest ever'])) score += SCORING_CONFIG_NON_LISTED.NEWS_MOMENTUM.GROWTH;
  if (hasKeywords(monthNews, ['raised', 'funding', 'Series', 'IPO', 'listed', '$'])) score += SCORING_CONFIG_NON_LISTED.NEWS_MOMENTUM.FUNDRAISE;
  if (hasKeywords(monthNews, ['cash flow positive', 'operating profit', 'EBITDA positive'])) score += SCORING_CONFIG_NON_LISTED.NEWS_MOMENTUM.CASHFLOW;
  if (hasKeywords(monthNews, ['loss narrowed', 'loss reduced', 'loss declined'])) score += SCORING_CONFIG_NON_LISTED.NEWS_MOMENTUM.NARROWING;

  // Confidence
  const fields = [perfData['Last Quarter Profit %'], perfData['Last Annual Profit %'], monthNews];
  const nonNullCount = fields.filter(f => f && f !== 'N/A').length;
  if (nonNullCount === 3) score += SCORING_CONFIG_NON_LISTED.CONFIDENCE.FULL;
  if (nonNullCount === 1) score += SCORING_CONFIG_NON_LISTED.CONFIDENCE.SPARSE;

  return Math.max(0, Math.min(1, score)).toFixed(2);
}

// Fuzzy matching: Dice's Coefficient
function getSimilarity(s1, s2) {
  if (!s1 || !s2) return 0;
  s1 = s1.toLowerCase().trim();
  s2 = s2.toLowerCase().trim();
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.9; // Partial match bonus

  const bigrams1 = new Set();
  for (let i = 0; i < s1.length - 1; i++) bigrams1.add(s1.slice(i, i + 2));
  const bigrams2 = new Set();
  for (let i = 0; i < s2.length - 1; i++) bigrams2.add(s2.slice(i, i + 2));

  let intersect = 0;
  for (const b of bigrams1) if (bigrams2.has(b)) intersect++;

  return (2 * intersect) / (bigrams1.size + bigrams2.size);
}

// Allow requests from any URL and IP
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Find competitors endpoint
app.post('/find-competitors', (req, res) => {
  const { domain, region } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  const csvPath = path.join(__dirname, 'db', 'scrap', 'competitors.csv');

  try {
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ error: 'Competitors data not found' });
    }

    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records = parse(fileContent, {
      columns: false,
      skip_empty_lines: true,
      relax_column_count: true
    });

    // Load performance data
    const listedPath = path.join(__dirname, 'db', 'scrap', 'listed_companies_performance.csv');
    const nonListedPath = path.join(__dirname, 'db', 'scrap', 'nonlisted_major_companies.csv');

    let listedData = [];
    let nonListedData = [];

    if (fs.existsSync(listedPath)) {
      listedData = parse(fs.readFileSync(listedPath, 'utf8'), { columns: true, skip_empty_lines: true });
    }
    if (fs.existsSync(nonListedPath)) {
      nonListedData = parse(fs.readFileSync(nonListedPath, 'utf8'), { columns: true, skip_empty_lines: true });
    }

    const threshold = 0.8;
    const matches = records.filter(row => {
      // Row structure: [Name, Domain/Service, Industry, Region/Location, Rating]
      const rowDomain = row[1] || '';
      const rowIndustry = row[2] || '';
      const rowRegion = row[3] || '';

      const domainMatch = getSimilarity(domain, rowDomain) >= threshold ||
        getSimilarity(domain, rowIndustry) >= threshold;

      if (!region) return domainMatch;

      const regionMatch = getSimilarity(region, rowRegion) >= threshold;
      return domainMatch && regionMatch;
    });

    // Enrich results with scores
    const enrichedMatches = matches.map((row, index) => {
      const companyName = row[0];
      let score = null;
      let source = 'fallback';

      // 1. Try Listed
      const listedMatch = listedData.find(d => (d.Company || '').toLowerCase() === companyName.toLowerCase());
      if (listedMatch) {
        score = calculateListedScore(row, listedMatch, domain, region);
        source = 'listed';
      } else {
        // 2. Try Non-Listed
        const nonListedMatch = nonListedData.find(d => (d['Company Name'] || '').toLowerCase() === companyName.toLowerCase());
        if (nonListedMatch) {
          score = calculateNonListedScore(row, nonListedMatch, domain);
          source = 'non-listed';
        } else {
          // 3. Fallback
          score = calculateFallbackScore(row, domain, region);
        }
      }

      return {
        id: index + 1,
        data: row,
        score: score,
        source: source
      };
    });

    // Sort by score descending and re-assign IDs
    enrichedMatches.sort((a, b) => parseFloat(b.score || 0) - parseFloat(a.score || 0));
    enrichedMatches.forEach((item, index) => {
      item.id = index + 1;
    });

    // Store results in db/current/competitors.csv
    const currentDirPath = path.join(__dirname, 'db', 'current');
    if (!fs.existsSync(currentDirPath)) {
      fs.mkdirSync(currentDirPath, { recursive: true });
    }

    const resultsCsvPath = path.join(currentDirPath, 'competitors.csv');
    const csvContent = enrichedMatches.map(item => {
      const finalRow = [item.id, ...item.data, item.score, item.source];
      return finalRow.map(field => `"${(field || '').toString().replace(/"/g, '""')}"`).join(',');
    }).join('\n');

    fs.writeFileSync(resultsCsvPath, csvContent, 'utf8');

    res.json({
      count: enrichedMatches.length,
      results: enrichedMatches.map(item => ({
        id: item.id,
        name: item.data[0],
        domain: item.data[1],
        industry: item.data[2],
        region: item.data[3],
        rating: item.data[4],
        score: item.score,
        source: item.source
      }))
    });
  } catch (error) {
    console.error('Error processing competitors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get competitors from current session
app.get('/get-competitors', (req, res) => {
  const csvPath = path.join(__dirname, 'db', 'current', 'competitors.csv');

  try {
    if (!fs.existsSync(csvPath)) {
      return res.json({ count: 0, results: [] });
    }

    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records = parse(fileContent, {
      columns: false,
      skip_empty_lines: true,
      relax_column_count: true
    });

    res.json({
      count: records.length,
      results: records.map(row => ({
        id: row[0],
        name: row[1],
        domain: row[2],
        industry: row[3],
        region: row[4],
        rating: row[5],
        score: row[6],
        source: row[7] || 'unknown'
      }))
    });
  } catch (error) {
    console.error('Error reading current competitors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Market Trends AI Endpoint
app.post('/dashboard/market-trends', async (req, res) => {
  const { id, companyName } = req.body;
  const csvPath = path.join(__dirname, 'db', 'current', 'competitors.csv');

  try {
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ error: 'No search results found to analyze.' });
    }

    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records = parse(fileContent, {
      columns: false,
      skip_empty_lines: true,
      relax_column_count: true
    });

    let targetRow = null;
    if (id) {
      targetRow = records.find(row => row[0] == id);
    } else if (companyName) {
      targetRow = records.find(row => (row[1] || '').toLowerCase() === companyName.toLowerCase());
    } else {
      targetRow = records[0]; // Fallback to first row
    }

    if (!targetRow) {
      return res.status(404).json({ error: 'Competitor not found in current session.' });
    }

    const domain = targetRow[2] || 'General';
    const industry = targetRow[3] || 'Market';
    const region = targetRow[4] || 'India';

    const prompt = `
      As a market research analyst, generate a realistic market trend JSON for the "${domain}" sector in the "${region}" region.
      Target Industry: ${industry}.
      
      The JSON must strictly follow this structure:
      {
        "trendDirection": "BULLISH" | "BEARISH" | "NEUTRAL",
        "percentageChange": number (e.g., 12.5),
        "series": [
          { "date": "YYYY-MM-DD", "volume": number, "isPredictive": boolean }
        ]
      }
      
      Generate a series of 37 data points: 
      - The first 30 points are historical (isPredictive: false) for the last 30 days ending today (${new Date().toISOString().split('T')[0]}).
      - The next 7 points are predictive (isPredictive: true) for the next 7 days.
      
      Ensure the numbers are realistic for this sector. Return ONLY the JSON.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean JSON from code blocks if any
    const cleanJson = responseText.replace(/```json|```/g, '').trim();
    const trendData = JSON.parse(cleanJson);

    res.json(trendData);
  } catch (error) {
    console.error('Error generating market trends:', error);
    res.status(500).json({
      error: 'Failed to generate AI trends.',
      details: error.message,
      fallback: {
        trendDirection: "NEUTRAL",
        percentageChange: 0,
        series: []
      }
    });
  }
});

// Market Share Metrics AI Endpoint
app.get('/metrics/market-share', async (req, res) => {
  const csvPath = path.join(__dirname, 'db', 'current', 'competitors.csv');

  try {
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ error: 'No search results found to analyze.' });
    }

    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const records = parse(fileContent, {
      columns: false,
      skip_empty_lines: true,
      relax_column_count: true
    });

    if (records.length === 0) {
      return res.status(404).json({ error: 'No competitors found in current session.' });
    }

    // Extract names (Field 2) and sector info (Field 3 and 4)
    const brandNames = records.map(row => row[1]);
    const domain = records[0][2] || 'General';
    const industry = records[0][3] || 'Market';

    const prompt = `
      As a market analyst, provide the estimated market share for these brands: ${brandNames.join(', ')} in the "${domain}" (${industry}) sector.
      Include an 'Others' category for the remaining market share.
      Ensure the total sharePercentage across all brands plus 'Others' sums exactly to 100.
      
      Return ONLY a JSON array of objects:
      [
        { "brand": "string", "sharePercentage": number }
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleanJson = responseText.replace(/```json|```/g, '').trim();
    const marketShareData = JSON.parse(cleanJson);

    res.json(marketShareData);
  } catch (error) {
    console.error('Error generating market share:', error);
    res.status(500).json({ 
      error: 'Failed to generate market share metrics.',
      details: error.message
    });
  }
});

// Signals RSS & AI Endpoint
app.post('/signals', async (req, res) => {
  const company_name = req.query.company_name || (req.body && req.body.company_name);

  if (!company_name) {
    return res.status(400).json({ error: 'company_name query parameter is required.' });
  }

  try {
    // 1. Fetch Google News RSS for the past 3 months
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(company_name)}+when:3m&hl=en-IN&gl=IN&ceid=IN:en`;
    const feed = await parser.parseURL(rssUrl);

    // 2. Limit to top 10 items
    const newsItems = feed.items.slice(0, 10).map(item => ({
      title: item.title,
      pubDate: item.pubDate,
      link: item.link
    }));

    if (newsItems.length === 0) {
      return res.json([]);
    }

    // 3. Use Gemini to structure and classify signals
    const prompt = `
      As a business intelligence analyst, analyze these recent news headlines for the brand "${company_name}".
      Convert them into a structured "signals" JSON array.
      
      For each news item, provide:
      - id: "sig_" followed by a short hash or number
      - title: A concise, cleaned version of the headline
      - timestamp: The RFC3339 timestamp (e.g. 2026-03-25T15:30:00Z)
      - importance: "High", "Medium", or "Low"
      - type: A category like "pricing", "expansion", "funding", "product", "legal", or "partnership"
      
      News Headlines:
      ${newsItems.map(ni => `- ${ni.title} (Published: ${ni.pubDate})`).join('\n')}
      
      Return ONLY the JSON array.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleanJson = responseText.replace(/```json|```/g, '').trim();
    const signals = JSON.parse(cleanJson);

    res.json(signals);
  } catch (error) {
    console.error('Error generating news signals:', error);
    res.status(500).json({ 
      error: 'Failed to fetch or analyze news signals.',
      details: error.message,
      fallback: []
    });
  }
});

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('StratSight API is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('CORS is enabled for all origins.');
});
