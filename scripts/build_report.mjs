import fs from 'node:fs';
import path from 'node:path';

const MENTIONS_PATH = path.join(process.cwd(), 'data/research/dostoevsky_mentions.json');
const TOPICS_PATH = path.join(process.cwd(), 'data/research/dostoevsky_topics.json');
const REPORT_PATH = path.join(process.cwd(), 'reports/dostoevsky_world_report.html');
const DATA_EXPORT_PATH = path.join(process.cwd(), 'reports/dostoevsky_world_data.json');

function mustReadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing file: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function buildHeatmap(countryTopics) {
  const topicSet = new Set();
  for (const item of countryTopics) {
    for (const topic of item.topics || []) {
      topicSet.add(topic.topic);
    }
  }

  const countries = countryTopics.map((x) => x.country);
  const topics = [...topicSet];

  const matrix = topics.map((topicName) =>
    countries.map((countryName) => {
      const row = countryTopics.find((x) => x.country === countryName);
      const topic = row?.topics?.find((t) => t.topic === topicName);
      return topic ? topic.mentions : 0;
    }),
  );

  return { countries, topics, matrix };
}

function htmlTemplate(payload) {
  const embeddedData = JSON.stringify(payload).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dostoevsky Global Discussion Report</title>
  <script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
  <style>
    :root {
      --bg: #0f1117;
      --panel: #171a21;
      --text: #f7f7f2;
      --muted: #a6acb9;
      --accent: #bd5b00;
      --border: #2b3140;
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Source Serif 4", "Noto Serif SC", Georgia, serif;
      background: radial-gradient(circle at 20% 10%, #202738 0, #0f1117 50%), var(--bg);
      color: var(--text);
    }

    .wrap {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    h1 {
      margin: 0;
      font-size: clamp(28px, 5vw, 46px);
      letter-spacing: 0.5px;
    }

    p {
      color: var(--muted);
      line-height: 1.6;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 12px;
      margin: 16px 0 24px;
    }

    .card {
      background: linear-gradient(135deg, rgba(189, 91, 0, 0.1), rgba(255, 255, 255, 0.03));
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px;
    }

    .label {
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1.2px;
    }

    .value {
      font-size: 28px;
      margin-top: 6px;
      color: #fff3dc;
    }

    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 18px;
    }

    #worldMap, #topicHeatmap, #topCountries {
      width: 100%;
      min-height: 420px;
    }

    .topics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 10px;
    }

    .topic-card {
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 10px;
      background: rgba(255,255,255,0.02);
    }

    .topic-card h3 {
      margin: 0 0 6px;
      font-size: 16px;
    }

    .topic-card ul {
      margin: 0;
      padding-left: 18px;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Dostoevsky Global Discussion Atlas</h1>
    <p>Coverage combines multilingual GDELT media mentions and topic clustering per country.</p>

    <div class="stats" id="stats"></div>

    <div class="panel">
      <div id="worldMap"></div>
    </div>
    <div class="panel">
      <div id="topCountries"></div>
    </div>
    <div class="panel">
      <div id="topicHeatmap"></div>
    </div>

    <div class="panel">
      <h2>Topic Highlights By Country</h2>
      <div id="topicCards" class="topics-grid"></div>
    </div>
  </div>

  <script>
    const DATA = ${embeddedData};

    const countryStats = DATA.byCountry.filter((x) => x.country !== 'Unknown');
    const topCountries = countryStats.slice(0, 20);

    const totalMentions = countryStats.reduce((sum, x) => sum + x.mentions, 0);
    const uniqueCountries = countryStats.length;

    const statsEl = document.getElementById('stats');
    statsEl.innerHTML = [
      ['Total Mentions', totalMentions],
      ['Countries', uniqueCountries],
      ['Window (days)', DATA.meta.days],
      ['Generated', new Date(DATA.meta.generatedAt).toLocaleString()],
    ].map(([label, value]) =>
      '<div class=\"card\">' +
        '<div class=\"label\">' + label + '</div>' +
        '<div class=\"value\">' + value + '</div>' +
      '</div>',
    ).join('');

    Plotly.newPlot('worldMap', [{
      type: 'choropleth',
      locations: countryStats.map((x) => x.country),
      z: countryStats.map((x) => x.mentions),
      locationmode: 'country names',
      colorscale: [
        [0, '#f7f0e9'],
        [0.4, '#d6915b'],
        [1, '#8e3f00']
      ],
      marker: { line: { color: '#1f2533', width: 0.5 } },
      colorbar: { title: 'Mentions' },
      text: countryStats.map((x) => x.country + ': ' + x.mentions),
      hovertemplate: '%{text}<extra></extra>',
    }], {
      title: 'Global Media Mentions of Dostoevsky',
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      geo: {
        bgcolor: 'rgba(0,0,0,0)',
        showframe: false,
        showcoastlines: true,
        coastlinecolor: '#2d3548',
        projection: { type: 'natural earth' }
      },
      font: { color: '#f7f7f2' },
      margin: { l: 0, r: 0, t: 60, b: 0 }
    }, { responsive: true });

    Plotly.newPlot('topCountries', [{
      type: 'bar',
      x: topCountries.map((x) => x.mentions).reverse(),
      y: topCountries.map((x) => x.country).reverse(),
      orientation: 'h',
      marker: { color: '#bd5b00' },
      hovertemplate: '%{y}: %{x}<extra></extra>'
    }], {
      title: 'Top 20 Countries by Mention Count',
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      xaxis: { title: 'Mentions', gridcolor: '#2b3140' },
      yaxis: { automargin: true },
      font: { color: '#f7f7f2' },
      margin: { l: 120, r: 20, t: 50, b: 40 }
    }, { responsive: true });

    Plotly.newPlot('topicHeatmap', [{
      type: 'heatmap',
      x: DATA.heatmap.countries,
      y: DATA.heatmap.topics,
      z: DATA.heatmap.matrix,
      colorscale: 'YlOrBr',
      hovertemplate: 'Country: %{x}<br>Topic: %{y}<br>Mentions: %{z}<extra></extra>'
    }], {
      title: 'Country × Topic Heatmap',
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: '#f7f7f2' },
      xaxis: { tickangle: -30, gridcolor: '#2b3140' },
      yaxis: { automargin: true },
      margin: { l: 180, r: 20, t: 50, b: 100 }
    }, { responsive: true });

    const cardsEl = document.getElementById('topicCards');
    cardsEl.innerHTML = DATA.countryTopics.slice(0, 12).map((row) => {
      const topics = (row.topics || []).slice(0, 5).map((t) => '<li>' + t.topic + ' (' + t.mentions + ')</li>').join('');
      return (
        '<section class=\"topic-card\">' +
          '<h3>' + row.country + '</h3>' +
          '<ul>' + topics + '</ul>' +
        '</section>'
      );
    }).join('');
  </script>
</body>
</html>`;
}

function main() {
  const mentions = mustReadJson(MENTIONS_PATH);
  const topics = mustReadJson(TOPICS_PATH);

  const payload = {
    meta: mentions.meta,
    byCountry: mentions.byCountry,
    countryTopics: topics.countryTopics,
    heatmap: buildHeatmap(topics.countryTopics),
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(DATA_EXPORT_PATH, JSON.stringify(payload, null, 2), 'utf8');
  fs.writeFileSync(REPORT_PATH, htmlTemplate(payload), 'utf8');

  console.log(`Saved report html -> ${REPORT_PATH}`);
  console.log(`Saved report data -> ${DATA_EXPORT_PATH}`);
}

main();
