import fs from 'node:fs';
import path from 'node:path';

const OUTPUT_PATH = path.join(process.cwd(), 'data/research/dostoevsky_mentions.json');
const DAYS = Number(process.argv[2] || 365);
const MAX_PER_QUERY = Number(process.argv[3] || 250);

const KEYWORD_QUERIES = [
  '"dostoevsky"',
  '"fyodor dostoevsky"',
  '"достоевский"',
  '"陀思妥耶夫斯基"',
  '"dostoievski"',
  '"dostoïevski"',
  '"dostoyevsky"',
];

function toGdeltDate(date) {
  const yyyy = String(date.getUTCFullYear());
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const mi = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}${hh}${mi}${ss}`;
}

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function normalizeCountry(rawCountryCode) {
  if (!rawCountryCode || typeof rawCountryCode !== 'string') {
    return null;
  }

  const raw = rawCountryCode.trim();
  const code = raw.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) {
    // GDELT may return country names directly (e.g., "Turkey").
    // Accept readable names and normalize spacing/casing minimally.
    if (/^[\p{L}\s.'-]{2,60}$/u.test(raw)) {
      return raw
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    return null;
  }

  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const countryName = regionNames.of(code);
  if (!countryName || countryName.toLowerCase() === code.toLowerCase()) {
    return null;
  }
  return countryName;
}

function getCountry(article) {
  const candidates = [
    article.sourcecountry,
    article.sourceCountry,
    article.source_country,
    article.country,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeCountry(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return 'Unknown';
}

function trimText(value, maxLen = 500) {
  if (!value || typeof value !== 'string') {
    return '';
  }
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLen);
}

async function fetchGdeltArticles(query, startDate, endDate, maxRecords) {
  const params = new URLSearchParams({
    query,
    mode: 'ArtList',
    format: 'json',
    maxrecords: String(maxRecords),
    sort: 'datedesc',
    startdatetime: toGdeltDate(startDate),
    enddatetime: toGdeltDate(endDate),
  });

  const url = `https://api.gdeltproject.org/api/v2/doc/doc?${params.toString()}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'dostoevsky-country-research/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`GDELT request failed: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  const payload = safeParseJson(text);
  if (!payload || !Array.isArray(payload.articles)) {
    return [];
  }

  return payload.articles;
}

function aggregateCountryStats(articles) {
  const stats = new Map();
  for (const article of articles) {
    const country = getCountry(article);
    const prev = stats.get(country) || 0;
    stats.set(country, prev + 1);
  }

  const total = articles.length || 1;
  return [...stats.entries()]
    .map(([country, mentions]) => ({
      country,
      mentions,
      share: Number((mentions / total).toFixed(4)),
    }))
    .sort((a, b) => b.mentions - a.mentions);
}

async function main() {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - DAYS * 24 * 60 * 60 * 1000);

  const dedup = new Map();

  for (const query of KEYWORD_QUERIES) {
    const articles = await fetchGdeltArticles(query, startDate, endDate, MAX_PER_QUERY);
    for (const article of articles) {
      const url = article.url || article.URL;
      if (!url || dedup.has(url)) {
        continue;
      }

      dedup.set(url, {
        url,
        title: trimText(article.title, 280),
        seendate: article.seendate || null,
        language: article.language || null,
        sourcecountry: article.sourcecountry || article.sourceCountry || null,
        country: getCountry(article),
        domain: article.domain || null,
      });
    }
  }

  const articles = [...dedup.values()];
  const byCountry = aggregateCountryStats(articles);

  const output = {
    meta: {
      generatedAt: new Date().toISOString(),
      days: DAYS,
      maxPerQuery: MAX_PER_QUERY,
      totalArticles: articles.length,
      queryList: KEYWORD_QUERIES,
    },
    byCountry,
    articles,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');

  console.log(`Saved ${articles.length} articles -> ${OUTPUT_PATH}`);
  console.log(`Top countries: ${byCountry.slice(0, 10).map((x) => `${x.country}:${x.mentions}`).join(', ')}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
