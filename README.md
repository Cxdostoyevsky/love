# 陀思妥耶夫斯基研究社 (Dostoevsky Research Society)

这是一个致敬俄罗斯文学巨匠费奥多尔·米哈伊洛维奇·陀思妥耶夫斯基的网页项目。

## 🌟 特性
- **深邃设计**：采用符合陀氏风格的视觉设计（深色模式、经典排版）。
- **动效体验**：使用 Framer Motion 实现优雅的页面过渡。
- **作品导览**：精选四大名著的深度简介。

## 🛠️ 技术栈
- **React + Vite**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide Icons**

## 🚀 快速开始
1. 安装依赖：`bun install`
2. 启动开发服务器：`bun dev`
3. 打包项目：`bun run build`

## 📖 待办事项
- [ ] 搭建在线阅读器模块
- [ ] 增加生平交互式时间轴
- [ ] 完善移动端适配优化

## 🌍 全球讨论研究（Dostoevsky Atlas）
新增了一个可独立运行的数据研究管线，用于回答：
- 哪些国家在讨论陀思妥耶夫斯基？
- 各国主要在讨论什么话题？

### 1) 准备环境变量
复制 `.env.example` 为 `.env`，填写（可选）：
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_BASE_URL`（默认 `https://api.deepseek.com`）
- `DEEPSEEK_MODEL`（默认 `deepseek-chat`）

不填 key 也能跑，会自动使用规则分类器。

### 2) 一键运行
```bash
npm run research:run
```

### 3) 分步运行
```bash
# 抓取最近 365 天、每个关键词最多 250 条新闻
npm run research:collect

# 对前 30 个国家做主题分析（每国抽样 60 条，产出 6 个主题）
npm run research:topics

# 生成可视化报告
npm run research:report
```

### 4) 输出文件
- `data/research/dostoevsky_mentions.json`
- `data/research/dostoevsky_topics.json`
- `reports/dostoevsky_world_data.json`
- `reports/dostoevsky_world_report.html`

### 5) 可调参数
```bash
# collect: days max_per_query
bun scripts/collect_mentions.mjs 180 300

# topics: max_countries sample_per_country topics_per_country
bun scripts/analyze_topics.mjs 40 80 7
```
