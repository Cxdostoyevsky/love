/**
 * 本地 Cursor Agent：围绕 book/*.md 做工程化（生成 manifest、目录等）。
 *
 * 用法：
 *   在 .env 中设置 CURSOR_API_KEY（Cursor Dashboard → Integrations）
 *   bun run book:agent
 *
 * 可选：CURSOR_AGENT_MODEL（默认 composer-2）
 */
import { Agent } from "@cursor/sdk";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiKey = process.env.CURSOR_API_KEY;
const modelId = process.env.CURSOR_AGENT_MODEL ?? "composer-2";

const TASK_PROMPT = `你是本仓库的维护助手。当前工作区根目录即项目根。

目标：为 book/ 目录下的长篇小说 Markdown 做轻量「工程化」，便于前端后续做目录跳转或分页。

请执行：
1. 列出 book/*.md，逐个读取并识别章节标题结构（优先识别 Markdown 标题行 # / ## / ###）。
2. 在 book/manifest.json 写入结构化清单（JSON）。格式示例：
{
  "version": 1,
  "generatedBy": "cursor-sdk-book-agent",
  "books": [
    {
      "file": "相对于 book/ 的文件名",
      "slug": "英文或拼音短 id，用于路由",
      "headings": [{ "level": 2, "title": "章节标题", "anchor": "可选的稳定锚点" }]
    }
  ]
}
3. 不要修改原著正文（*.md 书籍文件本身）；仅新增或更新 book/manifest.json。
4. 若 manifest 已存在，合并保留合理字段并更新 headings。
5. 完成后用简短中文总结你写了什么、books 数量与各文件标题数量。`;

function streamRun(run) {
  return (async () => {
    for await (const event of run.stream()) {
      switch (event.type) {
        case "assistant":
          for (const block of event.message.content) {
            if (block.type === "text") process.stdout.write(block.text);
          }
          break;
        case "thinking":
          process.stdout.write(event.text);
          break;
        case "tool_call":
          process.stderr.write(`\n[tool] ${event.name}: ${event.status}\n`);
          break;
        case "status":
          process.stderr.write(`\n[status] ${event.status}\n`);
          break;
        default:
          break;
      }
    }
  })();
}

async function main() {
  if (!apiKey) {
    console.error(
      "缺少 CURSOR_API_KEY。请到 https://cursor.com/dashboard/integrations 创建密钥，写入本仓库 .env 后执行：bun run book:agent"
    );
    process.exit(1);
  }

  const agent = await Agent.create({
    apiKey,
    model: { id: modelId },
    local: { cwd: root },
  });

  try {
    const run = await agent.send(TASK_PROMPT);
    await streamRun(run);
    const result = await run.wait();
    console.log("\n\n--- run ---");
    console.log("status:", result.status);
    if (result.result) console.log("result:", result.result);
    if (result.status === "error") process.exitCode = 1;
  } finally {
    agent.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
