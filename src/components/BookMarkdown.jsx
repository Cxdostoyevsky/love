import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  extractMarkdownHeadings,
  stripFrontmatter,
  zipHeadingDomIds,
} from "../lib/bookReading";

/**
 * 渲染 book/*.md（?raw），并按 manifest headings 顺序写入 id，供 ManifestTOC 的 hash 跳转。
 */
export default function BookMarkdown({
  markdownText,
  manifestHeadings,
  tone = "blue",
}) {
  const body = useMemo(() => stripFrontmatter(markdownText), [markdownText]);

  const ids = useMemo(() => {
    const hs = extractMarkdownHeadings(markdownText);
    if (hs.length !== manifestHeadings.length) {
      console.warn(
        `[BookMarkdown] Markdown 标题 ${hs.length} 条，manifest ${manifestHeadings.length} 条，hash 可能对不齐`
      );
    }
    return zipHeadingDomIds(hs, manifestHeadings);
  }, [markdownText, manifestHeadings]);

  /** 每次渲染重建：避免缓存导致标题序号计数错位 */
  let headingIdx = 0;
  const scrollMt = "scroll-mt-28";

  const mk = (Tag, extraClass) => (props) => {
    const id = ids[headingIdx++];
    const { node: _n, className, ...rest } = props;
    return React.createElement(Tag, {
      ...rest,
      id,
      className: [scrollMt, extraClass, className].filter(Boolean).join(" "),
    });
  };

  const hcBlue =
    "font-bold text-blue-100/95 border-b border-blue-900/30 pb-2 mt-10 mb-6";
  const hcStone =
    "font-bold text-stone-100 border-b border-stone-800 pb-2 mt-10 mb-6";

  const hc = tone === "stone" ? hcStone : hcBlue;
  const hcTight = hc.replace("mt-10", "mt-8");

  const components = {
    h1: mk("h1", `text-2xl md:text-3xl ${hc}`),
    h2: mk("h2", `text-xl md:text-2xl ${hc}`),
    h3: mk("h3", `text-lg md:text-xl ${hcTight}`),
    h4: mk("h4", `text-base md:text-lg mt-6 mb-3 font-semibold opacity-90`),
    h5: mk("h5", `text-sm mt-4 mb-2 uppercase tracking-widest opacity-70`),
    h6: mk("h6", `text-xs mt-4 mb-2 uppercase tracking-widest opacity-60`),
    p: (props) => {
      const { node: _n, className, ...rest } = props;
      return (
        <p
          {...rest}
          className={`leading-relaxed mb-4 opacity-90 ${className ?? ""}`}
        />
      );
    },
    blockquote: (props) => {
      const { node: _n, className, ...rest } = props;
      const b = tone === "stone" ? "border-red-900/50" : "border-blue-500/40";
      return (
        <blockquote
          {...rest}
          className={`border-l-2 pl-4 my-4 italic opacity-80 ${b} ${className ?? ""}`}
        />
      );
    },
    ul: (props) => {
      const { node: _n, className, ...rest } = props;
      return (
        <ul
          {...rest}
          className={`list-disc pl-6 space-y-2 my-4 ${className ?? ""}`}
        />
      );
    },
    ol: (props) => {
      const { node: _n, className, ...rest } = props;
      return (
        <ol
          {...rest}
          className={`list-decimal pl-6 space-y-2 my-4 ${className ?? ""}`}
        />
      );
    },
    li: (props) => {
      const { node: _n, className, ...rest } = props;
      return (
        <li {...rest} className={`marker:text-current ${className ?? ""}`} />
      );
    },
    hr: (props) => {
      const { node: _n, className, ...rest } = props;
      return (
        <hr
          {...rest}
          className={`my-10 border-current/10 ${className ?? ""}`}
        />
      );
    },
    a: (props) => {
      const { node: _n, className, ...rest } = props;
      return (
        <a
          {...rest}
          className={`underline underline-offset-4 decoration-current/40 hover:opacity-100 ${className ?? ""}`}
        />
      );
    },
  };

  const articleTone =
    tone === "stone" ? "text-stone-300" : "text-blue-50/90";

  return (
    <article className={`book-md max-w-none ${articleTone}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {body}
      </ReactMarkdown>
    </article>
  );
}
