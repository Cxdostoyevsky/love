import fs from 'node:fs';
import path from 'node:path';
import { loadEnv, requireEnv } from './lib/env.mjs';

loadEnv();

const INPUT_PATH = path.join(process.cwd(), 'data/research/dostoevsky_mentions.json');
const OUTPUT_PATH = path.join(process.cwd(), 'data/research/dostoevsky_topics.json');

const MAX_COUNTRIES = Number(process.argv[2] || 30);
const SAMPLE_PER_COUNTRY = Number(process.argv[3] || 60);
const TOPICS_PER_COUNTRY = Number(process.argv[4] || 6);

function parseJsonLoose(text) {
  const direct = tryParse(text);
  if (direct) return direct;

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  return tryParse(match[0]);
}

function tryParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function sampleArticles(articles, maxCount) {
  if (articles.length <= maxCount) {
    return articles;
  }

  const step = articles.length / maxCount;
  const picked = [];
  for (let i = 0; i < maxCount; i += 1) {
    picked.push(articles[Math.floor(i * step)]);
  }
  return picked;
}

function fallbackTopics(items, topN = 6) {
  const rules = [
    ['Books & Works', /crime and punishment|brothers karamazov|idiot|demons|notes from underground|小说|作品|book|novel/i],
    ['Philosophy & Religion', /faith|god|religion|ethics|morality|存在|信仰|哲学|orthodox|christian/i],
    ['Politics & Society', /politic|war|nation|state|sanction|社会|政治|идеолог/i],
    ['Education & Academia', /university|course|student|lecture|education|教学|课堂|学者|academic/i],
    ['Adaptations & Culture', /film|series|theater|adaptation|festival|戏剧|电影|改编|文化/i],
  ];

  const counts = new Map();
  for (const item of items) {
    const text = `${item.title || ''}`;
    let matched = false;
    for (const [label, pattern] of rules) {
      if (pattern.test(text)) {
        counts.set(label, (counts.get(label) || 0) + 1);
        matched = true;
      }
    }
    if (!matched) {
      counts.set('General Mentions', (counts.get('General Mentions') || 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([topic, mentions]) => ({ topic, mentions, summary: 'Heuristic topic classification.' }));
}

async function deepseekTopics(client, country, articles, topicN) {
  const itemLines = articles
    .map((item, idx) => `${idx + 1}. [${item.language || 'unknown'}] ${item.title}`)
    .join('\n');

  const prompt = [
    `You are analyzing media discussions about Fyodor Dostoevsky in ${country}.`,
    `Cluster these headlines into ${topicN} major topics.`,
    'Return strict JSON with this schema:',
    '{"topics":[{"topic":"string","mentions":number,"summary":"string"}]}',
    'Constraints:',
    '- topic names must be short English labels.',
    '- mentions must sum to less than or equal to total items.',
    '- summaries must be 1 sentence each.',
    '',
    itemLines,
  ].join('\n');

  const payload = {
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are a precise multilingual media analyst that always outputs valid JSON only.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  };

  const response = await fetch(`${client.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${client.apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('DeepSeek response did not contain message content.');
  }

  const parsed = parseJsonLoose(content);
  if (!parsed || !Array.isArray(parsed.topics)) {
    throw new Error('DeepSeek response JSON parse failed.');
  }

  return parsed.topics
    .filter((x) => x && typeof x.topic === 'string' && Number.isFinite(Number(x.mentions)))
    .map((x) => ({
      topic: x.topic.trim(),
      mentions: Number(x.mentions),
      summary: typeof x.summary === 'string' ? x.summary.trim() : '',
    }))
    .filter((x) => x.topic);
}

async function main() {
  if (!fs.existsSync(INPUT_PATH)) {
    throw new Error(`Input not found: ${INPUT_PATH}. Run collect script first.`);
  }

  const input = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf8'));
  const allArticles = Array.isArray(input.articles) ? input.articles : [];

  const byCountry = new Map();
  for (const article of allArticles) {
    const country = article.country || 'Unknown';
    const list = byCountry.get(country) || [];
    list.push(article);
    byCountry.set(country, list);
  }

  const topCountries = [...byCountry.entries()]
    .filter(([country]) => country !== 'Unknown')
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, MAX_COUNTRIES);

  const useDeepSeek = !!process.env.DEEPSEEK_API_KEY;
  const client = useDeepSeek
    ? {
        apiKey: requireEnv('DEEPSEEK_API_KEY'),
        baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
      }
    : null;

  const countryTopics = [];

  for (const [country, articles] of topCountries) {
    const sampled = sampleArticles(articles, SAMPLE_PER_COUNTRY);

    let topics;
    if (client) {
      try {
        topics = await deepseekTopics(client, country, sampled, TOPICS_PER_COUNTRY);
      } catch (err) {
        console.warn(`DeepSeek failed for ${country}, fallback used: ${err.message || err}`);
        topics = fallbackTopics(sampled, TOPICS_PER_COUNTRY);
      }
    } else {
      topics = fallbackTopics(sampled, TOPICS_PER_COUNTRY);
    }

    countryTopics.push({
      country,
      mentions: articles.length,
      sampleSize: sampled.length,
      topics,
    });
  }

  const output = {
    meta: {
      generatedAt: new Date().toISOString(),
      maxCountries: MAX_COUNTRIES,
      samplePerCountry: SAMPLE_PER_COUNTRY,
      topicsPerCountry: TOPICS_PER_COUNTRY,
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      usedDeepSeek: useDeepSeek,
    },
    countryTopics,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');

  console.log(`Saved topic analysis -> ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
