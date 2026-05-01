/** Manifest headings ↔ Markdown 正文锚点（hash / DOM id） */

export function anchorToDomId(anchor) {
  return `bk-${encodeURIComponent(String(anchor))}`;
}

export function stripFrontmatter(md) {
  const trimmed = md.trimStart();
  if (!trimmed.startsWith("---")) return md;
  const lines = trimmed.split("\n");
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      return lines.slice(i + 1).join("\n").trimStart();
    }
  }
  return md;
}

/** 按行文顺序抽取 Markdown 标题（跳过 YAML frontmatter 后计算）。 */
export function extractMarkdownHeadings(md) {
  const body = stripFrontmatter(md);
  const lines = body.split("\n");
  const out = [];
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (m) out.push({ level: m[1].length, title: m[2].trim() });
  }
  return out;
}

/** 与 manifest.json headings 逐行对齐生成稳定 DOM id（索引与正文标题顺序一致）。 */
export function zipHeadingDomIds(mdHeadings, manifestHeadings) {
  const ids = [];
  for (let i = 0; i < mdHeadings.length; i++) {
    const mh = mdHeadings[i];
    const man = manifestHeadings[i];
    if (man && man.level === mh.level) {
      ids.push(anchorToDomId(man.anchor));
    } else {
      ids.push(`bk-fallback-${i}-${mh.level}`);
    }
  }
  return ids;
}
