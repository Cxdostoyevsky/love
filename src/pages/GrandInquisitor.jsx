import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, BookOpen, Flame, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createTribunalAmbience } from '../lib/ambientWind';

const PDF_SRC = `${import.meta.env.BASE_URL}research/grand-inquisitor.pdf`;

const trials = [
  {
    numeral: 'I',
    name: '面包',
    question: '如果你正在饥饿，你还要自由吗？',
    excerpt: '“你想走向世界，但是两手空空，只有一项自由的许诺……对于人和人类社会来说，从来没有任何东西比自由更无法忍受。”',
    choices: ['我仍要自己决定', '先给我面包'],
  },
  {
    numeral: 'II',
    name: '奇迹',
    question: '如果没有证据，你还愿意相信吗？',
    excerpt: '“你没有从十字架上走下来，因为你又不愿用奇迹奴役人。你渴望自由的爱，而不是奴隶在强权前的惊恐。”',
    choices: ['相信不需要证明', '让我亲眼看见'],
  },
  {
    numeral: 'III',
    name: '权力',
    question: '如果有人替你决定一切，你会不会更幸福？',
    excerpt: '“谁掌握着人们的良心和人们的面包，就该由谁来统治他们。”',
    choices: ['把痛苦还给我', '替我承担选择'],
  },
];

function GrandInquisitor() {
  const [soundOn, setSoundOn] = useState(false);
  const [choices, setChoices] = useState({});
  const [endingOpen, setEndingOpen] = useState(false);
  const ambienceRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => ambienceRef.current?.stop();
  }, []);

  const toggleSound = async () => {
    if (ambienceRef.current) {
      ambienceRef.current.stop();
      ambienceRef.current = null;
      setSoundOn(false);
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    await context.resume();
    ambienceRef.current = createTribunalAmbience(context);
    setSoundOn(true);
  };

  const answerTrial = (trialIndex, answerIndex) => {
    setChoices((current) => ({ ...current, [trialIndex]: answerIndex }));
  };

  return (
    <main className={`inquisitor-page verdict-weight-${Object.values(choices).filter(Boolean).length}`}>
      <nav className="inquisitor-nav">
        <Link to="/" aria-label="返回雪夜街道">
          <ArrowLeft size={17} />
          <span>返回雪夜</span>
        </Link>
        <p>伊万·卡拉马佐夫的诗剧</p>
        <button type="button" onClick={toggleSound} aria-pressed={soundOn}>
          {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
          <span>{soundOn ? '正在旁听' : '旁听审判'}</span>
        </button>
      </nav>

      <header className="inquisitor-hero">
        <div className="inquisitor-arches" aria-hidden="true">
          <i /><i /><i />
        </div>
        <div className="inquisitor-embers" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
        </div>
        <motion.div
          className="inquisitor-hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
        >
          <p>塞维利亚 · 十六世纪 · 火刑之后</p>
          <h1>宗教<br />大法官</h1>
          <blockquote>
            你在人群中认出了他。<br />
            大法官也认出了他。
          </blockquote>
        </motion.div>
        <a className="inquisitor-descend" href="#square">
          跟随他们进入监牢
          <span aria-hidden="true">↓</span>
        </a>
      </header>

      <section id="square" className="inquisitor-square">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 1.2 }}
        >
          <p className="inquisitor-marker">第一幕 · 广场</p>
          <h2>所有人都认出了他，<br />然后所有人都让开了。</h2>
          <p>
            昨日，近百名异端在这里被烧死。今日，他让盲者复明，让白色童棺中的女孩重新坐起。
            大法官只伸出一根手指，卫兵便将他带走；刚刚亲吻他脚下土地的人群，转身伏倒在老人面前。
          </p>
        </motion.div>
      </section>

      <section className="inquisitor-cell">
        <div className="inquisitor-cell-scene" aria-hidden="true">
          <div className="inquisitor-candle"><i /></div>
          <div className="inquisitor-silence"><span /></div>
          <div className="inquisitor-old-man"><span /></div>
        </div>

        <div className="inquisitor-testimony">
          <p className="inquisitor-marker">第二幕 · 拱顶监牢</p>
          <h2>他说了九十年。<br />你一言不发。</h2>
          <blockquote>
            “是你吗？你？不要回答，别开口。你为什么要来妨碍我们？”
          </blockquote>
          <p>
            炎热的夜里，大法官把灯放在桌上。他说，明日自己只要一挥手，
            今日亲吻囚徒双脚的人们，就会争先恐后地为焚烧他的火堆添煤。
          </p>
        </div>
      </section>

      <section className="inquisitor-trials" aria-labelledby="trials-title">
        <header>
          <p className="inquisitor-marker">第三幕 · 旷野中的三个问题</p>
          <h2 id="trials-title">现在，问题转向你。</h2>
          <p>你的选择不会得到评判。它只会留在这间牢房里。</p>
        </header>

        {trials.map((trial, trialIndex) => (
          <motion.article
            key={trial.name}
            className={`inquisitor-trial ${choices[trialIndex] !== undefined ? 'is-answered' : ''}`}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.9 }}
          >
            <div className="trial-number">{trial.numeral}</div>
            <div className="trial-copy">
              <p>{trial.name}</p>
              <blockquote>{trial.excerpt}</blockquote>
              <h3>{trial.question}</h3>
              <div className="trial-choices">
                {trial.choices.map((choice, answerIndex) => (
                  <button
                    key={choice}
                    type="button"
                    className={choices[trialIndex] === answerIndex ? 'is-chosen' : ''}
                    onClick={() => answerTrial(trialIndex, answerIndex)}
                    aria-pressed={choices[trialIndex] === answerIndex}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="inquisitor-last-word">
        <p className="inquisitor-marker">第四幕 · 回答</p>
        <h2>大法官说完了。<br />他等待一句反驳。</h2>
        <button type="button" onClick={() => setEndingOpen(true)}>
          让沉默回答
        </button>
      </section>

      <section className="inquisitor-echo">
        <div>
          <p className="inquisitor-marker">尾声 · 酒店桌边</p>
          <blockquote>
            “那个吻往他心中注入一股暖流，<br />但老人原来的思想没有改变。”
          </blockquote>
          <p>
            伊万讲完诗剧。阿辽沙没有争辩，只走到哥哥面前，在他的嘴唇上轻轻吻了一下。
          </p>
        </div>
        <a href={PDF_SRC} target="_blank" rel="noreferrer">
          <BookOpen size={17} />
          阅读完整篇章
        </a>
      </section>

      <footer className="inquisitor-footer">
        <p>如果爱不能驳倒一种思想，它还能回答这种思想吗？</p>
      </footer>

      <AnimatePresence>
        {endingOpen && (
          <motion.div
            className="inquisitor-ending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.9 }}
            role="dialog"
            aria-modal="true"
            aria-label="沉默的回答"
          >
            <button type="button" onClick={() => setEndingOpen(false)} aria-label="离开沉默">
              ×
            </button>
            <motion.div
              className="ending-figures"
              initial={{ gap: '22vw' }}
              animate={{ gap: reducedMotion ? '0vw' : ['22vw', '22vw', '0vw'] }}
              transition={{ duration: reducedMotion ? 0.2 : 4.6, times: [0, 0.48, 1] }}
              aria-hidden="true"
            >
              <i /><i />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reducedMotion ? 0 : 4.8, duration: 1.4 }}
            >
              一个吻。<br />
              <span>这便是全部回答。</span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default GrandInquisitor;
