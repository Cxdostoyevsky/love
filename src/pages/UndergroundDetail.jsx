import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Quote, Lightbulb, MessageSquare, ArrowLeft, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import notes from '../data/notes.json';
import bookManifest from '../../book/manifest.json';
import undergroundMarkdown from '../../book/地下室手记（果麦经典）.md?raw';
import ManifestTOC from '../components/ManifestTOC';
import BookMarkdown from '../components/BookMarkdown';
import Snowfall from '../components/Snowfall';
import { createAmbientWind } from '../lib/ambientWind';

const UNDERGROUND_NIGHT_SRC = `${import.meta.env.BASE_URL}gallery/petersburg-snow-night.png`;

function UndergroundDetail() {
  const [introOpen, setIntroOpen] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const windRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const bookNotes = useMemo(
    () => notes.find((n) => n.book === '地下室手记')?.quotes ?? [],
    []
  );

  const undergroundManifestBook = bookManifest.books.find(
    (b) => b.slug === 'notes-from-underground-guomai'
  );

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
    windRef.current = createAmbientWind(context, { volume: 0.045, cutoff: 820 });
    setSoundOn(true);
  };

  return (
    <div className="min-h-screen text-[#f5f5dc] font-serif overflow-x-hidden relative bg-[#0a0e14]">
      <AnimatePresence>
        {introOpen && (
          <motion.section
            className="underground-threshold"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -32 }}
            transition={{ duration: reducedMotion ? 0.2 : 1.2, ease: [0.76, 0, 0.24, 1] }}
            aria-label="进入《地下室手记》的地下室"
          >
            <div
              className="underground-threshold-street"
              style={{ backgroundImage: `url(${UNDERGROUND_NIGHT_SRC})` }}
              aria-hidden="true"
            />
            <Snowfall reducedMotion={reducedMotion} />
            <div className="underground-stairs" aria-hidden="true">
              {Array.from({ length: 7 }, (_, index) => (
                <motion.i
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 + index * 0.13, duration: 0.7 }}
                />
              ))}
            </div>
            <div className="underground-threshold-grain" aria-hidden="true" />

            <div className="underground-threshold-copy">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                地面以下 · 四十年
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65, duration: 1.1 }}
              >
                你以为自己
                <span>只是来躲一场雪。</span>
              </motion.h1>
              <motion.blockquote
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.25, duration: 1.2 }}
              >
                “我是一个有病的人……我是一个心怀恶意的人。”
              </motion.blockquote>
              <motion.div
                className="underground-threshold-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7, duration: 1 }}
              >
                <button type="button" onClick={() => setIntroOpen(false)}>
                  <span>向下走</span>
                  <i aria-hidden="true">↓</i>
                </button>
                <button
                  type="button"
                  className="underground-sound-button"
                  onClick={toggleWind}
                  aria-pressed={soundOn}
                >
                  {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  {soundOn ? '风雪留在门外' : '听见门外风雪'}
                </button>
              </motion.div>
            </div>

            <p className="underground-threshold-foot">地下室没有门锁，因为真正的出口从不在门外</p>
          </motion.section>
        )}
      </AnimatePresence>

      {!introOpen && (
        <button
          type="button"
          className="underground-reading-sound"
          onClick={toggleWind}
          aria-label={soundOn ? '关闭门外风雪声' : '播放门外风雪声'}
          aria-pressed={soundOn}
        >
          {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>{soundOn ? '门外有雪' : '听见风雪'}</span>
        </button>
      )}

      <nav className="sticky top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-[#0d1117] border-b border-[#4a6fa5]/20">
        <Link to="/" className="flex items-center gap-2 text-[#d4e4f7]/80 hover:text-[#d4e4f7] transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest">返回首页</span>
        </Link>
        <div className="text-xs font-sans text-[#4a6fa5]/70 uppercase tracking-widest">Dostoevsky Research Society</div>
      </nav>

      {/* Hero Header */}
      <header className="pt-24 pb-16 px-4 text-center border-b border-[#4a6fa5]/20">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-stone-100">地下室的回响</h1>
          <p className="text-red-900 uppercase tracking-[0.4em] text-sm font-bold mb-8">Echoes from the Underground</p>
          <div className="max-w-2xl mx-auto h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent"></div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-24">
        <div className="flex items-center gap-4 mb-16">
          <Lightbulb className="text-red-900" size={28} />
          <h2 className="text-2xl font-bold tracking-tight text-stone-200">深度读书笔记 & 随感</h2>
        </div>

        <div className="space-y-24">
          {bookNotes.map((note, idx) => (
            <div
              key={idx}
              className="relative pl-12 border-l border-stone-800 group"
            >
              <div className="absolute -left-[1px] top-0 w-[2px] h-0 group-hover:h-full bg-red-900 transition-all duration-700"></div>
              <div className="text-xs text-red-800 font-bold mb-4 tracking-widest uppercase flex items-center gap-2">
                <span className="w-8 h-px bg-red-900/30"></span>
                {note.context}
              </div>
              <blockquote className="text-2xl md:text-3xl italic leading-relaxed text-stone-300 mb-8 whitespace-pre-line">
                “{note.text}”
              </blockquote>
              <div className="flex justify-end">
                <span className="text-[10px] text-stone-600 font-sans tracking-[0.3em] uppercase">— X_maker's Insight</span>
              </div>
            </div>
          ))}
        </div>

        {/* book/manifest.json + 导出正文 */}
        {undergroundManifestBook && (
          <section className="mt-24 border-t border-stone-800 pt-16 -mx-4 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-3 mb-10 text-stone-400">
                <BookOpen size={22} />
                <h2 className="font-sans text-[11px] md:text-xs uppercase tracking-[0.35em]">
                  微信读书导出 · 正文目录（book/manifest.json）
                </h2>
              </div>
              <div className="lg:grid lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-12">
                <aside className="hidden lg:block sticky top-24 self-start">
                  <ManifestTOC
                    headings={undergroundManifestBook.headings}
                    tone="stone"
                  />
                </aside>
                <div className="min-w-0">
                  <details className="lg:hidden mb-8 border border-stone-800 rounded-lg bg-[#0d1117] p-4">
                    <summary className="cursor-pointer text-sm text-stone-300">
                      展开目录
                    </summary>
                    <div className="mt-4">
                      <ManifestTOC
                        headings={undergroundManifestBook.headings}
                        tone="stone"
                      />
                    </div>
                  </details>
                  <BookMarkdown
                    markdownText={undergroundMarkdown}
                    manifestHeadings={undergroundManifestBook.headings}
                    tone="stone"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="mt-32 p-12 bg-[#0d1117] border border-stone-800 text-center">
          <Quote className="mx-auto mb-8 text-stone-800" size={40} />
          <p className="text-xl text-stone-400 italic mb-10 leading-relaxed">
            “正如陀氏所言，他在深渊中依然歌颂生命。地下室不是终点，而是认清现实后重新出发的起点。”
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="https://weread.qq.com/web/reader/a623278071e0b2e0a622468"
              target="_blank"
              className="px-8 py-3 bg-red-900/10 border border-red-900/30 text-red-900 hover:bg-red-900 hover:text-white transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              在微信读书查看全文 <MessageSquare size={14} />
            </a>
            <Link
              to="/"
              className="px-8 py-3 border border-stone-800 text-stone-500 hover:text-white hover:border-white transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              返回探索其他作品
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-stone-900 bg-[#080a0d] text-center">
        <p className="text-stone-600 text-sm tracking-widest">© {new Date().getFullYear()} Dostoevsky X_maker | 痛苦是人类进化的阶梯</p>
      </footer>
    </div>
  );
}

export default UndergroundDetail;
