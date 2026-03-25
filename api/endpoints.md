# Endpoints

## Find Competitors

```
POST /find-competitors
```

Body:

```
{
    "domain": "EV Mobility",
    "region": "Bangalore"
}
```

---

## Market Trends (AI)

```
POST /dashboard/market-trends
```

Body:

```json
{
  "id": 1,
  "companyName": "Optional"
}
```

Returns AI-generated market trends based on the competitor's domain and region.

---

## Get Competitors

```
GET /get-competitors
```

Returns the stored competitors from the last search.

---

## Health

```
GET /health
```

---

## Root

```
GET /
```
