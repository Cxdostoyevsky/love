import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Images,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import works from '../data/works.json';
import Snowfall from '../components/Snowfall';

const timeline = [
  ['1821', '莫斯科', '你还不知道，一个在医院庭院里长大的孩子，将会替无数人说出痛苦。'],
  ['1849', '谢苗诺夫校场', '枪口已经举起，赦免却在最后一刻抵达。从此，每一分钟都带着死而复生的重量。'],
  ['1864', '地下室', '一个无名者开始说话。他越想证明自由，越暴露出自己的囚笼。'],
  ['1880', '最后的长夜', '《卡拉马佐夫兄弟》把信仰、罪与宽恕留在桌上，等待后来的人继续争辩。'],
];

const visualWall = [
  { src: `${import.meta.env.BASE_URL}gallery/dosto-3.png`, title: '凝视' },
  { src: `${import.meta.env.BASE_URL}gallery/dosto-1.png`, title: '纪念' },
  { src: `${import.meta.env.BASE_URL}gallery/karamazov-brothers.png`, title: '兄弟' },
];

const encounters = [
  {
    name: '地下人',
    work: '《地下室手记》',
    voice: '“我既渴望被看见，又憎恨每一道落在我身上的目光。”',
    position: 'underground',
  },
  {
    name: '拉斯柯尔尼科夫',
    work: '《罪与罚》',
    voice: '“你以为自己越过的是一条界线，其实是把自己留在了界线那边。”',
    position: 'raskolnikov',
  },
  {
    name: '伊万·卡拉马佐夫',
    work: '《卡拉马佐夫兄弟》',
    voice: '“若世界的和谐以一个孩子的眼泪为代价，我拒绝接受这张入场券。”',
    position: 'ivan',
  },
  {
    name: '涅莉',
    work: '《被侮辱与被损害的人》',
    voice: '“不要因为我可怜，就以为我会低下头。”',
    position: 'nelly',
  },
  {
    name: '梅诗金公爵',
    work: '《白痴》',
    voice: '“有时，一个人需要的不是答案，只是有人不躲开他的痛苦。”',
    position: 'myshkin',
  },
];

function Home() {
  const { scrollYProgress } = useScroll();
  const streetScale = useTransform(scrollYProgress, [0, 0.28], [1, 1.16]);
  const streetY = useTransform(scrollYProgress, [0, 0.28], ['0%', '5%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.13, 0.22], [1, 0.9, 0]);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef(null);
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => () => {
    audioRef.current?.close();
  }, []);

  const toggleNightSound = async () => {
    if (soundOn) {
      await audioRef.current?.close();
      audioRef.current = null;
      setSoundOn(false);
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    const seconds = 3;
    const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let index = 0; index < data.length; index += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.018 * white) / 1.018;
      data[index] = last * 2.8;
    }

    const wind = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    wind.buffer = buffer;
    wind.loop = true;
    filter.type = 'lowpass';
    filter.frequency.value = 520;
    gain.gain.value = 0.026;
    wind.connect(filter).connect(gain).connect(context.destination);
    wind.start();
    audioRef.current = context;
    setSoundOn(true);
  };

  return (
    <main className="dosto-street-page selection:bg-[#9a7a45] selection:text-[#090b0d]">
      <div className="street-fixed-scene" aria-hidden="true">
        <motion.div
          className="street-image"
          style={{
            scale: streetScale,
            y: streetY,
            backgroundImage: `url('${import.meta.env.BASE_URL}gallery/petersburg-snow-night.png')`,
          }}
        />
        <div className="street-ink" />
        <div className="street-watchful-windows" />
        <Snowfall />
      </div>

      <nav className="street-nav" aria-label="主导航">
        <button type="button" className="street-monogram" aria-label="返回页首" onClick={() => scrollToSection('top')}>Д</button>
        <div className="street-nav-links">
          <button type="button" onClick={() => scrollToSection('life')}>生平</button>
          <button type="button" onClick={() => scrollToSection('works')}>作品</button>
          <Link to="/visuals">影像</Link>
        </div>
      </nav>

      <button
        type="button"
        className="night-sound"
        onClick={toggleNightSound}
        aria-pressed={soundOn}
      >
        {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
        <span>{soundOn ? '雪夜正在低语' : '聆听雪夜'}</span>
      </button>

      <section id="top" className="street-hero">
        <motion.div className="street-hero-copy" style={{ opacity: heroOpacity }}>
          <p className="street-kicker">Санкт-Петербург · 1866 · 雪夜</p>
          <h1>
            今夜，<br />
            <span>你走进彼得堡。</span>
          </h1>
          <p className="street-opening">
            你只是出来走一走。<br />
            至少，你是这样告诉自己的。
          </p>
        </motion.div>
        <button type="button" className="street-scroll-cue" onClick={() => scrollToSection('inner-voice')}>
          <span>继续走</span>
          <ArrowDown size={16} />
        </button>
      </section>

      <section id="inner-voice" className="street-passage street-passage-right">
        <motion.div
          className="passage-copy"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-25%' }}
          transition={{ duration: 1 }}
        >
          <p className="passage-marker">第一盏灯 · 城市</p>
          <h2>你告诉自己，<br />没有人在看。</h2>
          <p>可为什么每一扇窗，都像知道你做过什么？雪落下来，抹去脚印，却没有替你抹去念头。</p>
        </motion.div>
      </section>

      <section className="encounter-chapter" aria-labelledby="encounter-title">
        <header className="encounter-heading">
          <p className="passage-marker">十字路口 · 五个灵魂</p>
          <h2 id="encounter-title">这一夜，<br />他们彼此经过。</h2>
          <p>
            他们来自不同的书，却共享同一座城市。靠近一个名字，
            听见那个人没有说出口的话。
          </p>
        </header>

        <div className="encounter-scene">
          <img
            src={`${import.meta.env.BASE_URL}gallery/petersburg-character-encounter-v3.png`}
            alt="圣彼得堡雪夜中，地下人、拉斯柯尔尼科夫、伊万·卡拉马佐夫、涅莉与梅诗金公爵在街道上偶然相遇；陀思妥耶夫斯基从二楼窗内望着他们。"
          />
          <div className="encounter-vignette" aria-hidden="true" />
          <aside className="author-presence" tabIndex={0} aria-label="陀思妥耶夫斯基在二楼窗内">
            <span className="author-dot" aria-hidden="true" />
            <div className="author-label">
              <span>作者在窗内</span>
              <strong>陀思妥耶夫斯基</strong>
            </div>
            <p>他看着自己的“孩子们”，却没有替任何人结束苦难。</p>
          </aside>
          {encounters.map((character) => (
            <motion.article
              key={character.name}
              className={`character-voice character-${character.position}`}
              tabIndex={0}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.65 }}
            >
              <span className="character-dot" aria-hidden="true" />
              <div className="character-label">
                <strong>{character.name}</strong>
                <span>{character.work}</span>
              </div>
              <blockquote>{character.voice}</blockquote>
            </motion.article>
          ))}
        </div>

        <p className="encounter-afterword">
          他们没有真正见过彼此。可在陀思妥耶夫斯基的世界里，
          每一种孤独都认得另一种孤独。
        </p>
      </section>

      <section id="life" className="street-chapter">
        <header className="chapter-heading">
          <p className="passage-marker">第二盏灯 · 一生</p>
          <h2>在你之前，<br />有人走过更深的黑夜。</h2>
        </header>
        <div className="life-windows">
          {timeline.map(([year, place, detail], index) => (
            <motion.article
              key={year}
              className="life-window"
              initial={{ opacity: 0, x: index % 2 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.75 }}
            >
              <span className="window-year">{year}</span>
              <div>
                <h3>{place}</h3>
                <p>{detail}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="works" className="street-chapter works-chapter">
        <header className="chapter-heading chapter-heading-right">
          <p className="passage-marker">第三盏灯 · 书页</p>
          <h2>你的困境，<br />早已在这里发生。</h2>
          <p>靠近那些亮着的窗。每一本书，都是一个尚未结束的房间。</p>
        </header>

        <div className="work-buildings">
          {works.map((work, index) => {
            const route = work.title === '地下室手记'
              ? '/underground'
              : work.title === '白痴'
                ? '/idiot'
                : null;

            const content = (
              <>
                <span className="work-index">{String(index + 1).padStart(2, '0')} / {work.year}</span>
                <h3>{work.title}</h3>
                <p className="work-original">{work.original}</p>
                <p>{work.desc}</p>
                <span className="work-action">
                  {route ? '走进这个房间' : '书页仍在整理'}
                  {route && <ArrowUpRight size={15} />}
                </span>
              </>
            );

            return route ? (
              <Link key={work.title} to={route} className="work-window">
                {content}
              </Link>
            ) : (
              <article key={work.title} className="work-window work-window-muted">
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <section className="street-passage street-passage-center">
        <motion.blockquote
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 1 }}
        >
          <p>“最重要的是，首先我们要善良，<br />其次要诚实，最后要永不相忘。”</p>
          <cite>《卡拉马佐夫兄弟》</cite>
        </motion.blockquote>
      </section>

      <section className="street-archive">
        <div className="archive-copy">
          <p className="passage-marker">街道尽头 · 档案室</p>
          <h2>天还没有亮。<br />但你已不再无人知晓。</h2>
          <p>进入肖像、书封与改编影像留下的房间，看看后来的人如何继续凝视他。</p>
          <Link to="/visuals" className="archive-link">
            <Images size={17} />
            进入影像档案
          </Link>
        </div>
        <Link to="/visuals" className="archive-window" aria-label="进入影像档案">
          {visualWall.map((item) => (
            <img key={item.src} src={item.src} alt={item.title} loading="lazy" />
          ))}
        </Link>
      </section>

      <footer className="street-footer">
        <div>
          <span>Ф. М. Достоевский</span>
          <p>你可以离开这条街。但它会跟着你。</p>
        </div>
        <button type="button" onClick={() => scrollToSection('top')}>回到雪夜 <BookOpen size={15} /></button>
      </footer>
    </main>
  );
}

export default Home;
