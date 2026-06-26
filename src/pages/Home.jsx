import { useMemo, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Book, Quote, Feather, ChevronDown, BookOpen, Heart, MessageSquare, Globe2, CalendarDays, RefreshCw, Images } from 'lucide-react';
import { Link } from 'react-router-dom';
import works from '../data/works.json';
import Snowfall from '../components/Snowfall';
import DostoevskyMascot from '../components/DostoevskyMascot';

function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const quotePool = [
    {
      text: '我只担心一件事，我怕我配不上我所受的苦难。',
      source: '《卡拉马佐夫兄弟》',
    },
    {
      text: '人需要的只不过是一种独立的意愿。',
      source: '《地下室手记》',
    },
    {
      text: '要爱生活，不要爱生活的意义。',
      source: '读书札记',
    },
    {
      text: '二二得四已经并非生活，而是死亡的开始。',
      source: '《地下室手记》',
    },
  ];
  const timeline = [
    {
      year: '1821',
      title: '诞生于莫斯科',
      detail: '在医院庭院中成长，早年即接触苦难与信仰。',
    },
    {
      year: '1849',
      title: '彼得堡“死刑”与流放',
      detail: '临刑赦免，随后西伯利亚服苦役，精神世界剧变。',
    },
    {
      year: '1864 - 1869',
      title: '创作转折期',
      detail: '以《地下室手记》为节点，写出更锋利的人性审问。',
    },
    {
      year: '1880 - 1881',
      title: '巅峰与终章',
      detail: '《卡拉马佐夫兄弟》发表后声望达到顶峰，翌年离世。',
    },
  ];
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * quotePool.length));
  const featuredQuote = useMemo(() => quotePool[quoteIndex], [quoteIndex]);
  const visualWall = [
    { src: `${import.meta.env.BASE_URL}gallery/dosto-1.png`, title: '纪念雕像夜景' },
    { src: `${import.meta.env.BASE_URL}gallery/dosto-2.png`, title: '手绘海报风格' },
    { src: `${import.meta.env.BASE_URL}gallery/dosto-3.png`, title: '经典肖像' },
    { src: `${import.meta.env.BASE_URL}gallery/dosto-4.png`, title: '影视片段' },
    { src: `${import.meta.env.BASE_URL}gallery/dosto-5.png`, title: '改编角色群像' },
    { src: `${import.meta.env.BASE_URL}gallery/dosto-6.png`, title: '中文书封设计' },
  ];

  const pickAnotherQuote = () => {
    if (quotePool.length <= 1) {
      return;
    }
    let next = quoteIndex;
    while (next === quoteIndex) {
      next = Math.floor(Math.random() * quotePool.length);
    }
    setQuoteIndex(next);
  };

  return (
    <div className="min-h-screen russian-night-bg text-[#f5f5dc] selection:bg-red-900 selection:text-white font-[family-name:var(--font-display)] overflow-x-hidden">
      {/* 全局雪景噪点 */}
      <div className="fixed inset-0 z-[100] pointer-events-none snow-noise" aria-hidden="true" />
      
      {/* Hero Section - 俄国大雪冬夜 */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <Snowfall />
        <div className="aurora-layer z-[1]" />
        <div className="blizzard-vignette z-[5]" />
        {/* 背景：深邃冬夜 + 冰蓝雪光 + 暖窗剪影 */}
        <motion.div 
          style={{ scale }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="absolute inset-0 z-[1]"
            style={{
              background: 'linear-gradient(180deg, #060810 0%, #0d1117 15%, #1a2238 35%, #0f1419 60%, #060810 100%)',
            }}
          />
          <div className="absolute inset-0 bg-[#4a6fa5]/8 z-[2] mix-blend-overlay" />
          <div className="absolute inset-0 frost-overlay z-[2]" />
          {/* 暖窗光晕 - 俄国冬夜经典对比 */}
          <div 
            className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] z-[2] opacity-30"
            style={{ background: 'radial-gradient(circle, rgba(201,162,39,0.4) 0%, transparent 70%)' }}
          />
          <div 
            className="w-full h-full bg-cover bg-center grayscale-[0.6] brightness-[0.6] opacity-35 z-[3]"
            style={{ backgroundImage: `url('${import.meta.env.BASE_URL}dostoevsky-writing.svg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0e14] z-[4]" />
        </motion.div>
        
        <motion.div 
          style={{ opacity }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-30 text-center px-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="inline-block mb-6 px-4 py-1 border border-[#4a6fa5]/60 rounded-full text-xs tracking-[0.3em] text-[#d4e4f7]/90 font-sans uppercase"
          >
            1821 — 1881 · 俄国冬夜
          </motion.div>
          <h1 className="title-shimmer text-6xl md:text-9xl font-bold tracking-tighter mb-6 opacity-95 drop-shadow-[0_0_30px_rgba(212,228,247,0.15)]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            DOSTOEVSKY
          </h1>
          <p className="text-xl md:text-2xl text-[#d4e4f7]/80 italic mb-12 max-w-2xl mx-auto leading-relaxed">
            “{featuredQuote.text}”
          </p>
          <p className="text-xs tracking-[0.35em] uppercase text-[#4a6fa5]/80 mb-10">{featuredQuote.source}</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <motion.button 
              onClick={() => document.getElementById('works').scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-[#4a6fa5] text-white rounded-sm transition-all duration-300 shadow-lg shadow-[#4a6fa5]/30 group hover:bg-[#5a7fb5] glass-panel"
            >
              <span className="flex items-center gap-2 uppercase tracking-widest text-sm">
                探索灵魂深处 <BookOpen size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
            <a
              href={`${import.meta.env.BASE_URL}research/dostoevsky_world_report_cn.html`}
              className="px-10 py-4 border border-[#4a6fa5]/50 text-[#d4e4f7] rounded-sm transition-all duration-300 hover:border-[#4a6fa5] hover:bg-[#4a6fa5]/10 glass-panel"
            >
              <span className="flex items-center gap-2 uppercase tracking-widest text-sm">
                全球讨论图谱 <Globe2 size={18} />
              </span>
            </a>
            <motion.button
              onClick={pickAnotherQuote}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 text-xs tracking-[0.25em] uppercase border border-[#4a6fa5]/40 text-[#d4e4f7]/70 hover:text-white hover:border-[#4a6fa5] transition-all flex items-center gap-2 glass-panel"
            >
              换一句 <RefreshCw size={14} />
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#4a6fa5]/70 z-30"
        >
          <ChevronDown size={32} />
        </motion.div>

        <div className="absolute right-4 bottom-6 md:right-10 md:bottom-10 z-30 opacity-95">
          <DostoevskyMascot />
        </div>
      </section>

      {/* Intro Section - 带动效的文本 */}
      <section className="py-32 px-4 max-w-5xl mx-auto relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[15rem] font-bold text-[#4a6fa5]/5 select-none pointer-events-none">
          SOUL
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <Feather className="mx-auto mb-8 text-[#4a6fa5] animate-pulse" size={48} />
          <h2 className="text-4xl md:text-5xl font-bold mb-16 tracking-tight">人类灵魂的伟大的审问者</h2>
          <div className="grid md:grid-cols-2 gap-16 text-left leading-loose text-[#d4e4f7]/70 text-lg">
            <p className="first-letter:text-5xl first-letter:text-[#4a6fa5] first-letter:float-left first-letter:mr-3 first-letter:font-bold">
              费奥多尔·米哈伊洛维奇·陀思妥耶夫斯基，不仅是伟大的俄罗斯文学巨匠，更是深入人类灵魂最深处的探险家。
              他的作品充满了极端的张力，探讨了自由意志、上帝存在与虚无主义等永恒的命题。
            </p>
            <p className="border-l border-[#4a6fa5]/40 pl-8 italic bg-[#4a6fa5]/5 p-6">
              从死屋的磨难到流放后的爆发，他笔下的每一个人物都在痛苦与狂热中挣扎，试图在黑暗中寻找那一抹神圣的微光。
              正如他所言，他在深渊中依然歌颂生命。
            </p>
          </div>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-14">
          <CalendarDays className="text-[#4a6fa5]" size={24} />
          <h2 className="text-4xl font-bold tracking-tight">生平时间轴</h2>
          <div className="flex-grow h-px bg-gradient-to-r from-[#4a6fa5]/40 to-transparent"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {timeline.map((item, idx) => (
            <motion.article
              key={item.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.7 }}
              className="p-6 border border-[#4a6fa5]/30 bg-[#4a6fa5]/5 hover:border-[#4a6fa5]/60 transition-colors frost-overlay frost-card"
            >
              <p className="text-xs font-sans tracking-[0.35em] text-[#4a6fa5] uppercase mb-3">{item.year}</p>
              <h3 className="text-2xl mb-3 text-stone-100">{item.title}</h3>
              <p className="text-stone-400 leading-relaxed">{item.detail}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Major Works Section */}
      <section id="works" className="py-32 bg-[#0d1117] relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-baseline gap-4 mb-20">
            <h2 className="text-5xl font-bold tracking-tighter">经典杰作</h2>
            <p className="text-[#4a6fa5]/70 font-sans tracking-widest uppercase text-sm">Selected Works</p>
            <div className="flex-grow h-px bg-gradient-to-r from-[#4a6fa5]/40 to-transparent"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {works.map((work, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                whileHover={{ y: -15 }}
                className="group relative p-8 rounded-none border border-[#4a6fa5]/25 bg-[#0d1117] overflow-hidden transition-all duration-500 frost-overlay frost-card"
              >
                <div className="absolute bottom-0 right-0 w-32 h-32 -mr-10 -mb-10 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-opacity duration-500 bg-[#4a6fa5]/30"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <span className="text-xs text-[#4a6fa5] font-bold tracking-[0.2em] mb-4 uppercase">{work.year}</span>
                  <h3 className="text-3xl font-bold mb-2 group-hover:text-[#d4e4f7] transition-colors">{work.title}</h3>
                  <p className="text-xs text-stone-600 italic mb-6 font-sans">{work.original}</p>
                  <p className="text-stone-400 leading-relaxed mb-10 flex-grow">{work.desc}</p>
                  
                  {work.title === "地下室手记" ? (
                    <Link 
                      to="/underground"
                      className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4e4f7] font-bold border-b border-[#4a6fa5]/40 pb-2 self-start hover:border-[#4a6fa5] transition-all"
                    >
                      查看读书笔记 <BookOpen size={14} />
                    </Link>
                  ) : work.title === "白痴" ? (
                    <Link 
                      to="/idiot"
                      className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-200 font-bold border-b border-stone-800 pb-2 self-start hover:border-blue-900 transition-all"
                    >
                      查看读书笔记 <BookOpen size={14} />
                    </Link>
                  ) : (
                    <button className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 font-bold border-b border-stone-700 pb-2 self-start cursor-not-allowed opacity-50">
                      翻开此书 <Book size={14} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Wall */}
      <section className="py-28 bg-[#0a0e14]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-14">
            <h2 className="text-4xl font-bold tracking-tight">陀氏影像参考墙</h2>
            <p className="text-[#4a6fa5]/70 font-sans tracking-widest uppercase text-xs">Visual References</p>
            <div className="flex-grow h-px bg-gradient-to-r from-[#4a6fa5]/40 to-transparent"></div>
          </div>
          <Link
            to="/visuals"
            className="group block relative overflow-hidden border border-[#4a6fa5]/25 bg-[#0d1117] frost-overlay frost-card"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 h-[420px] md:h-[520px]">
              {visualWall.map((item) => (
                <div key={item.src} className="relative overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.04] transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-[#0a0e14]/20 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-[#0a0e14]/45 to-transparent" />
            <div className="absolute left-6 right-6 bottom-6 md:left-10 md:bottom-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-xs font-sans tracking-[0.35em] uppercase text-[#4a6fa5] mb-3">Enter The Archive</p>
                <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-stone-100 mb-3">进入影像参考墙</h3>
                <p className="max-w-2xl text-[#d4e4f7]/70 leading-relaxed">
                  浏览肖像、雕像、影视片段与书封设计，像进入“经典杰作”一样进入独立页面。
                </p>
              </div>
              <span className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 border border-[#4a6fa5]/45 text-[#d4e4f7] text-xs uppercase tracking-widest font-sans group-hover:border-[#d4e4f7] transition-colors">
                查看影像 <Images size={16} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Interactive Quote Section */}
      <section className="py-40 bg-[#0a0e14] relative flex items-center justify-center frost-overlay">
        <div className="candle-glow top-[18%] left-[20%]" />
        <div className="candle-glow bottom-[12%] right-[18%]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.04]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <Quote className="mx-auto mb-12 text-[#4a6fa5] opacity-60" size={80} />
          </motion.div>
          <blockquote className="text-3xl md:text-5xl italic leading-tight text-[#d4e4f7] mb-12 font-medium">
          “最重要的是，首先我们要善良，<br />
          其次要诚实，最后要永不相忘。”
          </blockquote>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            className="h-1 bg-[#4a6fa5] mx-auto mb-8"
          ></motion.div>
          <cite className="block text-stone-500 font-sans not-italic tracking-[0.2em] uppercase text-sm">— 《卡拉马佐夫兄弟》</cite>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-[#4a6fa5]/20 bg-[#060810] relative overflow-hidden frost-overlay">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-left">
            <h4 className="text-2xl font-bold mb-2 tracking-tighter">陀思妥耶夫斯基 X_maker</h4>
            <p className="text-[#4a6fa5]/60 text-sm">痛苦是人类进化的阶梯</p>
          </div>
          <div className="flex gap-8">
             <Heart size={20} className="text-[#4a6fa5]/50 hover:text-[#4a6fa5] cursor-pointer transition-colors" />
             <MessageSquare size={20} className="text-[#4a6fa5]/50 hover:text-[#4a6fa5] cursor-pointer transition-colors" />
          </div>
        </div>
        <div className="mt-16 text-center text-stone-800 text-[10px] uppercase tracking-[0.5em]">
          &copy; {new Date().getFullYear()} Dostoevsky Society | Designed for the Soul
        </div>
      </footer>
    </div>
  );
}

export default Home;
