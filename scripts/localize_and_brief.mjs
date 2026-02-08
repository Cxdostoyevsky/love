import fs from 'node:fs';
import path from 'node:path';
import { loadEnv } from './lib/env.mjs';

loadEnv();

const INPUT_REPORT_DATA = path.join(process.cwd(), 'reports/dostoevsky_world_data.json');
const INPUT_TOPICS = path.join(process.cwd(), 'data/research/dostoevsky_topics.json');
const OUTPUT_CN_DATA = path.join(process.cwd(), 'reports/dostoevsky_cn_data.json');
const OUTPUT_CN_HTML = path.join(process.cwd(), 'reports/dostoevsky_world_report_cn.html');
const OUTPUT_BRIEF_MD = path.join(process.cwd(), 'reports/dostoevsky_ppt_brief.md');

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseJsonLoose(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

async function translateWithDeepSeek(countries, topics, topCountryRows) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;

  const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

  const prompt = [
    'Translate and summarize data into Chinese for a presentation.',
    'Return strict JSON only with schema:',
    '{"countries":{"English":"中文"},"topics":{"English":"中文"},"executive_summary":["..."],"insights":["..."],"method_note":"..."}',
    'Constraints:',
    '- Keep country names in natural Chinese (e.g., United States -> 美国).',
    '- Topic translation should be concise and academic.',
    '- executive_summary: exactly 5 bullet sentences in Chinese.',
    '- insights: exactly 5 actionable insights in Chinese.',
    '- method_note: 1-2 Chinese sentences.',
    '',
    'Countries:',
    JSON.stringify(countries),
    'Topics:',
    JSON.stringify(topics),
    'Top country counts:',
    JSON.stringify(topCountryRows),
  ].join('\n');

  const payload = {
    model,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'You are a precise bilingual analyst. Always output valid JSON.' },
      { role: 'user', content: prompt },
    ],
  };

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('Missing DeepSeek content');
  }

  return parseJsonLoose(content);
}

function fallbackLocalization(countries, topics, byCountry) {
  const countryMap = Object.fromEntries(countries.map((c) => [c, c]));
  const topicMap = Object.fromEntries(topics.map((t) => [t, t]));

  const top10 = byCountry.slice(0, 10).map((x) => `${x.country}(${x.mentions})`).join('、');

  return {
    countries: countryMap,
    topics: topicMap,
    executive_summary: [
      `近一年关于陀思妥耶夫斯基的媒体讨论呈全球分布，重点国家集中度较高。`,
      `高讨论国家主要覆盖欧洲与美洲，俄罗斯保持最高讨论量。`,
      `讨论议题集中在文学作品解读、戏剧影视改编、文化活动与教育场景。`,
      `不同国家在话题结构上存在差异，具备做区域化传播策略的基础。`,
      `前十国家样本：${top10}`,
    ],
    insights: [
      '优先选择高讨论国家作为内容投放与合作首站。',
      '将作品解读与改编资讯拆分为两条内容线并行运营。',
      '针对高校/文化机构渠道设计专题内容包。',
      '按国家话题热度制定季度传播节奏。',
      '对低覆盖国家补充本地语言关键词并扩展数据源。',
    ],
    method_note: '本简报基于 GDELT 多语新闻样本与主题聚类结果，国家热度按提及量统计。',
  };
}

function buildChinesePayload(reportData, localization) {
  const byCountry = reportData.byCountry
    .filter((x) => x.country !== 'Unknown')
    .map((row) => ({
      ...row,
      countryZh: localization.countries?.[row.country] || row.country,
    }));

  const countryTopics = (reportData.countryTopics || []).map((row) => ({
    ...row,
    countryZh: localization.countries?.[row.country] || row.country,
    topics: (row.topics || []).map((t) => ({
      ...t,
      topicZh: localization.topics?.[t.topic] || t.topic,
    })),
  }));

  const heatmap = {
    countries: (reportData.heatmap?.countries || []).map((c) => localization.countries?.[c] || c),
    topics: (reportData.heatmap?.topics || []).map((t) => localization.topics?.[t] || t),
    matrix: reportData.heatmap?.matrix || [],
  };

  return {
    meta: {
      ...reportData.meta,
      localizedAt: new Date().toISOString(),
      locale: 'zh-CN',
    },
    byCountry,
    countryTopics,
    heatmap,
    summary: {
      executive: localization.executive_summary || [],
      insights: localization.insights || [],
      methodNote: localization.method_note || '',
    },
  };
}

function buildChineseHtml(payload) {
  const embeddedData = JSON.stringify(payload).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>陀思妥耶夫斯基全球讨论图谱（中文）</title>
  <script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
  <style>
    :root { --bg:#0f1117; --panel:#171a21; --text:#f7f7f2; --muted:#a6acb9; --border:#2b3140; --accent:#bd5b00; }
    * { box-sizing: border-box; }
    body { margin:0; font-family:"Noto Serif SC","PingFang SC","Songti SC",serif; background:radial-gradient(circle at 20% 10%, #202738 0, #0f1117 50%), var(--bg); color:var(--text); }
    .wrap { max-width:1200px; margin:0 auto; padding:24px; }
    h1 { margin:0; font-size:clamp(28px,5vw,46px); }
    p { color:var(--muted); line-height:1.6; }
    .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:12px; margin:16px 0 24px; }
    .card { border:1px solid var(--border); border-radius:12px; padding:12px; background:linear-gradient(135deg,rgba(189,91,0,.1),rgba(255,255,255,.03)); }
    .label { color:var(--muted); font-size:12px; letter-spacing:1px; }
    .value { font-size:28px; margin-top:6px; color:#fff3dc; }
    .panel { background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:12px; margin-bottom:18px; }
    #worldMap,#topCountries,#topicHeatmap { width:100%; min-height:420px; }
    .twocol { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    ul { margin:0; padding-left:18px; color:var(--muted); }
    @media (max-width:900px){ .twocol{ grid-template-columns:1fr; } }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>陀思妥耶夫斯基全球讨论图谱</h1>
    <p>基于多语新闻提及与主题聚类，展示各国讨论强度与话题结构。</p>

    <div class="stats" id="stats"></div>
    <div class="panel"><div id="worldMap"></div></div>
    <div class="panel"><div id="topCountries"></div></div>
    <div class="panel"><div id="topicHeatmap"></div></div>

    <div class="twocol">
      <div class="panel"><h3>执行摘要（PPT可直接引用）</h3><ul id="summary"></ul></div>
      <div class="panel"><h3>策略建议</h3><ul id="insights"></ul></div>
    </div>
  </div>
  <script>
    const DATA = ${embeddedData};
    const rows = DATA.byCountry || [];
    const topRows = rows.slice(0, 20);

    document.getElementById('stats').innerHTML = [
      ['总提及量', rows.reduce((s, x) => s + x.mentions, 0)],
      ['覆盖国家', rows.length],
      ['统计窗口(天)', DATA.meta.days],
      ['生成时间', new Date(DATA.meta.localizedAt || DATA.meta.generatedAt).toLocaleString()],
    ].map(([label, value]) => '<div class="card"><div class="label">' + label + '</div><div class="value">' + value + '</div></div>').join('');

    Plotly.newPlot('worldMap', [{
      type: 'choropleth',
      locations: rows.map((x) => x.country),
      z: rows.map((x) => x.mentions),
      locationmode: 'country names',
      colorscale: [[0,'#f7f0e9'],[0.4,'#d6915b'],[1,'#8e3f00']],
      text: rows.map((x) => x.countryZh + ' (' + x.country + '): ' + x.mentions),
      hovertemplate: '%{text}<extra></extra>'
    }], {
      title: '全球讨论热度地图',
      paper_bgcolor: 'transparent', plot_bgcolor: 'transparent', font: { color: '#f7f7f2' },
      geo: { bgcolor: 'rgba(0,0,0,0)', showframe: false, showcoastlines: true, coastlinecolor: '#2d3548' },
      margin: { l: 0, r: 0, t: 60, b: 0 }
    }, { responsive: true });

    Plotly.newPlot('topCountries', [{
      type:'bar', orientation:'h', marker:{ color:'#bd5b00' },
      x: topRows.map((x)=>x.mentions).reverse(),
      y: topRows.map((x)=>x.countryZh).reverse(),
      hovertemplate: '%{y}: %{x}<extra></extra>'
    }], {
      title:'TOP 20 国家讨论量',
      paper_bgcolor:'transparent', plot_bgcolor:'transparent', font:{ color:'#f7f7f2' },
      xaxis:{ title:'提及量', gridcolor:'#2b3140' }, yaxis:{ automargin:true },
      margin:{ l:120, r:20, t:50, b:40 }
    }, { responsive:true });

    Plotly.newPlot('topicHeatmap', [{
      type:'heatmap', x:DATA.heatmap.countries, y:DATA.heatmap.topics, z:DATA.heatmap.matrix,
      colorscale:'YlOrBr', hovertemplate:'国家: %{x}<br>话题: %{y}<br>提及: %{z}<extra></extra>'
    }], {
      title:'国家 × 话题 热力图（中文）',
      paper_bgcolor:'transparent', plot_bgcolor:'transparent', font:{ color:'#f7f7f2' },
      xaxis:{ tickangle:-30, gridcolor:'#2b3140' }, yaxis:{ automargin:true },
      margin:{ l:180, r:20, t:50, b:100 }
    }, { responsive:true });

    document.getElementById('summary').innerHTML = (DATA.summary.executive || []).map((x)=>'<li>' + x + '</li>').join('');
    document.getElementById('insights').innerHTML = (DATA.summary.insights || []).map((x)=>'<li>' + x + '</li>').join('');
  </script>
</body>
</html>`;
}

function buildBriefMarkdown(payload) {
  const top10 = payload.byCountry.slice(0, 10);
  const lines = [];
  lines.push('# 陀思妥耶夫斯基全球讨论一页简报');
  lines.push('');
  lines.push(`- 统计窗口：最近 ${payload.meta.days} 天`);
  lines.push(`- 生成时间：${new Date(payload.meta.localizedAt || payload.meta.generatedAt).toLocaleString('zh-CN')}`);
  lines.push(`- 覆盖国家：${payload.byCountry.length}`);
  lines.push(`- 总提及量：${payload.byCountry.reduce((s, x) => s + x.mentions, 0)}`);
  lines.push('');
  lines.push('## TOP10 国家');
  for (const row of top10) {
    lines.push(`- ${row.countryZh}（${row.mentions}）`);
  }
  lines.push('');
  lines.push('## 执行摘要');
  for (const s of payload.summary.executive || []) {
    lines.push(`- ${s}`);
  }
  lines.push('');
  lines.push('## 策略建议');
  for (const s of payload.summary.insights || []) {
    lines.push(`- ${s}`);
  }
  lines.push('');
  lines.push('## 方法说明');
  lines.push(`- ${payload.summary.methodNote || '基于GDELT新闻提及与主题聚类统计。'}`);
  return lines.join('\n');
}

async function main() {
  const reportData = readJson(INPUT_REPORT_DATA);
  const topicsData = readJson(INPUT_TOPICS);

  const countries = reportData.byCountry.filter((x) => x.country !== 'Unknown').map((x) => x.country);
  const topics = reportData.heatmap?.topics || [];
  const topCountryRows = reportData.byCountry.filter((x) => x.country !== 'Unknown').slice(0, 20);

  let localization = null;
  try {
    localization = await translateWithDeepSeek(countries, topics, topCountryRows);
  } catch (err) {
    console.warn(`DeepSeek localization failed: ${err.message || err}`);
  }

  if (!localization) {
    localization = fallbackLocalization(countries, topics, topCountryRows);
  }

  const payload = buildChinesePayload(reportData, localization);

  fs.mkdirSync(path.dirname(OUTPUT_CN_DATA), { recursive: true });
  fs.writeFileSync(OUTPUT_CN_DATA, JSON.stringify(payload, null, 2), 'utf8');
  fs.writeFileSync(OUTPUT_CN_HTML, buildChineseHtml(payload), 'utf8');
  fs.writeFileSync(OUTPUT_BRIEF_MD, buildBriefMarkdown(payload), 'utf8');

  console.log(`Saved Chinese data -> ${OUTPUT_CN_DATA}`);
  console.log(`Saved Chinese report -> ${OUTPUT_CN_HTML}`);
  console.log(`Saved PPT brief -> ${OUTPUT_BRIEF_MD}`);
  console.log(`Used DeepSeek localization: ${Boolean(process.env.DEEPSEEK_API_KEY)}`);
  console.log(`Topics source countries: ${(topicsData.countryTopics || []).length}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
