import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Quote, Feather, ArrowLeft, BookOpen, Volume2, VolumeX } from 'lucide-react';

const IDIOT_COVER_SRC = `${import.meta.env.BASE_URL}idiot-cover.png`;
const IDIOT_NIGHT_SRC = `${import.meta.env.BASE_URL}gallery/petersburg-snow-night.png`;
import { Link } from 'react-router-dom';
import notes from '../data/notes.json';
import bookManifest from '../../book/manifest.json';
import idiotMarkdown from '../../book/白痴（陀思妥耶夫斯基文集2015）.md?raw';
import ManifestTOC from '../components/ManifestTOC';
import BookMarkdown from '../components/BookMarkdown';
import Snowfall from '../components/Snowfall';

function createWind(audioContext) {
  const duration = 3;
  const buffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * duration,
    audioContext.sampleRate
  );
  const samples = buffer.getChannelData(0);
  let last = 0;

  for (let i = 0; i < samples.length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = last * 0.985 + white * 0.015;
    samples[i] = last * 3.2;
  }

  const source = audioContext.createBufferSource();
  const lowPass = audioContext.createBiquadFilter();
  const highPass = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  const gust = audioContext.createOscillator();
  const gustDepth = audioContext.createGain();

  source.buffer = buffer;
  source.loop = true;
  lowPass.type = 'lowpass';
  lowPass.frequency.value = 1250;
  highPass.type = 'highpass';
  highPass.frequency.value = 85;
  gain.gain.value = 0.0001;
  gust.type = 'sine';
  gust.frequency.value = 0.085;
  gustDepth.gain.value = 0.035;

  source.connect(lowPass);
  lowPass.connect(highPass);
  highPass.connect(gain);
  gain.connect(audioContext.destination);
  gust.connect(gustDepth);
  gustDepth.connect(gain.gain);
  source.start();
  gust.start();
  gain.gain.exponentialRampToValueAtTime(0.055, audioContext.currentTime + 1.8);

  return {
    context: audioContext,
    stop() {
      const now = audioContext.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      window.setTimeout(() => {
        source.stop();
        gust.stop();
        audioContext.close();
      }, 800);
    },
  };
}

function IdiotDetail() {
  const [introOpen, setIntroOpen] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const windRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // 页面跳转后滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => () => {
    windRef.current?.stop();
  }, []);

  const toggleWind = async () => {
    if (windRef.current) {
      windRef.current.stop();
      windRef.current = null;
      setSoundOn(false);
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    await context.resume();
    windRef.current = createWind(context);
    setSoundOn(true);
  };

  const idiotNotes = notes.find(n => n.book === "白痴")?.quotes || [];
  const idiotManifestBook = bookManifest.books.find(
    (b) => b.slug === 'idiot-fywg-2015'
  );
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-[#050814] text-[#e2e8f0] font-serif overflow-x-hidden selection:bg-blue-900/50 selection:text-white">
      <AnimatePresence>
        {introOpen && (
          <motion.section
            className="idiot-threshold"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.2 : 1.35, ease: [0.76, 0, 0.24, 1] }}
            aria-label="进入《白痴》的雪夜"
          >
            <div
              className="idiot-threshold-sky"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(4, 6, 8, .96) 0%, rgba(7, 10, 14, .88) 52%, rgba(6, 8, 11, .55) 100%), radial-gradient(ellipse at 78% 42%, rgba(88, 112, 137, .22), transparent 42%), url(${IDIOT_NIGHT_SRC})`,
              }}
              aria-hidden="true"
            />
            <Snowfall reducedMotion={reducedMotion} />
            <motion.div
              className="idiot-door-light"
              initial={{ scaleX: 0.12, opacity: 0.35 }}
              animate={{ scaleX: [0.12, 0.18, 0.12], opacity: [0.35, 0.62, 0.35] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            <div className="idiot-threshold-grain" aria-hidden="true" />

            <div className="idiot-threshold-copy">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 1.2 }}
              >
                圣彼得堡 · 一八六九
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 1.25 }}
              >
                你在风雪中，
                <span>看见一颗没有防备的心。</span>
              </motion.h1>
              <motion.blockquote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 1.4 }}
              >
                “难道一个人，仅仅因为善良，就注定被世界称作白痴？”
              </motion.blockquote>

              <motion.div
                className="idiot-threshold-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
              >
                <button type="button" onClick={() => setIntroOpen(false)}>
                  <span>走进灯下</span>
                  <i aria-hidden="true">→</i>
                </button>
                <button
                  type="button"
                  className="idiot-sound-button"
                  onClick={toggleWind}
                  aria-pressed={soundOn}
                >
                  {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  {soundOn ? '风雪正在窗外' : '聆听风雪'}
                </button>
              </motion.div>
            </div>

            <p className="idiot-threshold-foot">向前一步，不保证你仍相信天真是一种美德</p>
          </motion.section>
        )}
      </AnimatePresence>

      {!introOpen && (
        <button
          type="button"
          className="idiot-reading-sound"
          onClick={toggleWind}
          aria-label={soundOn ? '关闭风雪声' : '播放风雪声'}
          aria-pressed={soundOn}
        >
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>{soundOn ? '风雪中' : '聆听风雪'}</span>
        </button>
      )}

      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center backdrop-blur-xl bg-[#050814]/40 border-b border-blue-900/20">
        <Link to="/" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest font-sans">返回首页</span>
        </Link>
        <div className="text-xs font-sans text-blue-400/60 uppercase tracking-widest">Dostoevsky Research Society</div>
      </nav>

      {/* Hero Header — 封面肖像 + 标题 */}
      <header className="relative pt-36 pb-24 md:pt-44 md:pb-32 px-4 text-center border-b border-blue-900/20 overflow-hidden">
        <motion.div
          style={{ y, opacity }}
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden
        >
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-[0.18] blur-2xl"
            style={{ backgroundImage: `url(${IDIOT_COVER_SRC})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050814]/80 via-[#050814]/90 to-[#050814] z-10" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-screen z-20" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="relative z-30 mx-auto max-w-4xl"
        >
          <motion.figure
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="mx-auto mb-10 w-[min(100%,18rem)] md:w-[min(100%,22rem)]"
          >
            <div className="relative rounded-2xl border border-blue-400/25 bg-gradient-to-b from-blue-950/40 to-[#050814] p-2 shadow-[0_0_60px_-12px_rgba(96,165,250,0.45)]">
              <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
                <img
                  src={IDIOT_COVER_SRC}
                  alt="费奥多尔·米哈伊洛维奇·陀思妥耶夫斯基肖像"
                  width={128}
                  height={128}
                  className="aspect-square w-full object-cover [image-rendering:auto]"
                  decoding="async"
                />
              </div>
            </div>
            <figcaption className="mt-4 font-sans text-[11px] uppercase tracking-[0.35em] text-blue-400/70">
              Fyodor Dostoevsky · 《白痴》
            </figcaption>
          </motion.figure>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-5 text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-300 drop-shadow-lg">
            白痴的纯洁
          </h1>
          <p className="text-blue-400 uppercase tracking-[0.5em] text-sm font-sans mb-10">
            The Idiot&apos;s Purity
          </p>
          <div className="mx-auto max-w-xs h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </motion.div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-32 relative z-20">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-24 text-blue-300/50"
        >
          <div className="w-12 h-[1px] bg-blue-900/50"></div>
          <Feather size={20} />
          <div className="w-12 h-[1px] bg-blue-900/50"></div>
        </motion.div>

        <div className="space-y-32">
          {idiotNotes.map((note, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative group"
            >
              <div className="absolute -left-8 top-0 text-6xl text-blue-900/20 font-serif leading-none select-none group-hover:text-blue-500/20 transition-colors duration-700">"</div>
              
              <div className="text-[10px] text-blue-400/80 font-sans mb-6 tracking-[0.3em] uppercase flex items-center gap-3">
                <span className="w-4 h-[1px] bg-blue-500/50"></span>
                {note.context}
              </div>
              
              <blockquote className="text-2xl md:text-3xl leading-[1.8] text-blue-50/90 mb-8 whitespace-pre-line font-light">
                {note.text}
              </blockquote>
              
              <div className="flex justify-end items-center gap-2">
                <div className="w-8 h-[1px] bg-blue-900/30"></div>
                <span className="text-[10px] text-blue-500/60 font-sans tracking-[0.2em] uppercase">— X_maker's Insight</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* book/manifest.json + 导出正文 */}
        {idiotManifestBook && (
          <section className="mt-32 border-t border-blue-900/20 pt-20 -mx-4 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-12 text-blue-300/80">
                <BookOpen size={22} />
                <h2 className="font-sans text-[11px] md:text-xs uppercase tracking-[0.35em]">
                  微信读书导出 · 正文目录（book/manifest.json）
                </h2>
              </div>
              <div className="lg:grid lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-12">
                <aside className="hidden lg:block sticky top-28 self-start">
                  <ManifestTOC headings={idiotManifestBook.headings} tone="blue" />
                </aside>
                <div className="min-w-0">
                  <details className="lg:hidden mb-8 border border-blue-900/30 rounded-lg bg-blue-950/20 p-4">
                    <summary className="cursor-pointer text-sm text-blue-200">
                      展开目录
                    </summary>
                    <div className="mt-4">
                      <ManifestTOC headings={idiotManifestBook.headings} tone="blue" />
                    </div>
                  </details>
                  <BookMarkdown
                    markdownText={idiotMarkdown}
                    manifestHeadings={idiotManifestBook.headings}
                    tone="blue"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="mt-40 p-16 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-900/5 border border-blue-900/20 rounded-3xl transition-colors duration-700 group-hover:bg-blue-900/10"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
          
          <div className="relative z-10 text-center">
            <Quote className="mx-auto mb-10 text-blue-500/30" size={48} />
            <p className="text-2xl text-blue-200/80 italic mb-12 leading-relaxed max-w-2xl mx-auto">
              “美将拯救世界。”<br/>
              <span className="text-lg text-blue-400/60 mt-4 block">哪怕这美在世人眼中形同白痴。</span>
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <a 
                href="https://weread.qq.com/web/reader/3be3244071e55adf3be703a"
                target="_blank"
                rel="noreferrer"
                className="px-10 py-4 bg-blue-900/20 border border-blue-500/30 text-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-400 transition-all duration-500 text-xs uppercase tracking-widest flex items-center justify-center gap-3 rounded-full"
              >
                在微信读书查看全文 <BookOpen size={16} />
              </a>
              <Link 
                to="/"
                className="px-10 py-4 border border-blue-900/30 text-blue-400/60 hover:text-blue-200 hover:border-blue-500/50 transition-all duration-500 text-xs uppercase tracking-widest flex items-center justify-center gap-3 rounded-full"
              >
                返回探索其他作品
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-blue-900/20 bg-[#03050a] text-center relative z-20">
        <p className="text-blue-500/40 text-xs font-sans tracking-[0.3em] uppercase">© {new Date().getFullYear()} Dostoevsky X_maker | 美将拯救世界</p>
      </footer>
    </div>
  );
}

export default IdiotDetail;
