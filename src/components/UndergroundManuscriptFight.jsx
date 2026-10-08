import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { externalLinkProps } from '../lib/externalLink';

const DOUBAN_TRANSLATION_TOPIC_URL = 'https://www.douban.com/group/topic/193707969/';

const PASSAGES = [
  {
    body: '我是个病人……我是个凶狠的人。我是个不招人喜欢的人。',
    footnote: '不。你只是个害怕被揭穿的人，凶狠是你最后的台词。',
  },
  {
    body: '我也十分明白，我不去医生那里看病，决不会使他们受损害。',
    footnote: '你损害的是你自己——而你正为此得意，仿佛那是自由。',
  },
  {
    body: '意识太过丰富——这是一种病，一种千真万确、不折不扣的病。',
    footnote: '丰富？那是你反复咀嚼屈辱时，给自己起的漂亮名字。',
  },
];

const PHASES = ['body', 'footnote', 'strike'];

export default function UndergroundManuscriptFight() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState('body');

  useEffect(() => {
    const cycle = window.setInterval(() => {
      setPhase((current) => {
        const idx = PHASES.indexOf(current);
        if (idx < PHASES.length - 1) return PHASES[idx + 1];
        setActiveIndex((i) => (i + 1) % PASSAGES.length);
        return 'body';
      });
    }, 2800);
    return () => window.clearInterval(cycle);
  }, []);

  const passage = PASSAGES[activeIndex];

  return (
    <section className="underground-manuscript-fight" aria-label="正文与脚注的争执">
      <header>
        <p className="underground-manuscript-kicker">原稿边栏 · 脚注不肯闭嘴</p>
        <h2>地下人写字，脚注反驳，正文再划掉脚注。</h2>
      </header>

      <motion.div
        className="underground-manuscript-sheet"
        key={activeIndex}
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
      >
        <p
          className={`underground-manuscript-body${phase === 'footnote' ? ' is-negated' : ''}${phase === 'strike' ? ' is-striking' : ''}`}
        >
          {passage.body}
        </p>
        <p
          className={`underground-manuscript-footnote${phase === 'footnote' ? ' is-visible' : ''}${phase === 'strike' ? ' is-struck' : ''}`}
          aria-hidden={phase === 'body'}
        >
          <sup>※</sup>
          {passage.footnote}
        </p>
      </motion.div>

      <aside className="underground-manuscript-rival" aria-label="译句被另一只手划掉">
        <p className="underground-manuscript-polish is-struck">
          是那种精雕细琢、优雅美丽的独白——
        </p>
        <p className="underground-manuscript-tang">
          汤武森读陀氏原文：「并非是那种精雕细琢、优雅美丽的，倒是混乱、杂糅，恍如呓语」
        </p>
        <p className="underground-manuscript-douban">
          同一句在中文里并不相同：
          <a href={DOUBAN_TRANSLATION_TOPIC_URL} className="street-source-link" {...externalLinkProps}>
            豆瓣帖对照汝龙、韦丛芜、朱海观与王汶
          </a>
          。
        </p>
      </aside>
    </section>
  );
}
