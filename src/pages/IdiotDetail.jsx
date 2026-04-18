import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Quote, Feather, ArrowLeft, BookOpen } from 'lucide-react';

const IDIOT_COVER_SRC = `${import.meta.env.BASE_URL}idiot-cover.png`;
import { Link } from 'react-router-dom';
import notes from '../data/notes.json';

function IdiotDetail() {
  // 页面跳转后滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const idiotNotes = notes.find(n => n.book === "白痴")?.quotes || [];
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-[#050814] text-[#e2e8f0] font-serif overflow-x-hidden selection:bg-blue-900/50 selection:text-white">
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
