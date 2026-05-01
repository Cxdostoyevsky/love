import { anchorToDomId } from "../lib/bookReading";

/** 侧栏 / 折叠目录：链接 hash 与 BookMarkdown 注入的 id 一致 */
export default function ManifestTOC({ headings, tone = "blue" }) {
  const labelTone =
    tone === "stone" ? "text-stone-600" : "text-blue-500/50";
  const linkTone =
    tone === "stone"
      ? "text-stone-400 hover:text-stone-100"
      : "text-blue-300/70 hover:text-blue-100";

  return (
    <nav aria-label="正文目录" className="space-y-2">
      <div
        className={`text-[10px] uppercase tracking-[0.35em] mb-4 ${labelTone}`}
      >
        正文目录
      </div>
      <ul className="space-y-1 max-h-[min(70vh,36rem)] overflow-y-auto pr-1">
        {headings.map((h, idx) => (
          <li
            key={`${idx}-${h.anchor}`}
            style={{ paddingLeft: `${Math.max(0, h.level - 1) * 10}px` }}
          >
            <a
              href={`#${anchorToDomId(h.anchor)}`}
              className={`block py-1 text-sm leading-snug transition-colors ${linkTone}`}
            >
              {h.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
