const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const app = express();
const PORT = process.env.PORT || 5000;

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
app.get('/find-competitors', (req, res) => {
  const { domain, region } = req.query;
  
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

    res.json({
      count: matches.length,
      results: matches.map(row => ({
        name: row[0],
        domain: row[1],
        industry: row[2],
        region: row[3],
        rating: row[4]
      }))
    });
  } catch (error) {
    console.error('Error processing competitors:', error);
    res.status(500).json({ error: 'Internal server error' });
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
