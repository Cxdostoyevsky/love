import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Book, Quote, Feather, ChevronDown, BookOpen, Heart, MessageSquare } from 'lucide-react';
import works from './data/works.json';

function App() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5dc] selection:bg-red-900 selection:text-white font-serif overflow-x-hidden">
      
      {/* Hero Section - 沉浸式背景 */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* 背景图片层 */}
        <motion.div 
          style={{ scale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-black/60 z-10"></div> {/* 遮罩层，让文字更清晰 */}
          <div 
            className="w-full h-full bg-cover bg-center grayscale-[0.3] brightness-[0.7]"
            style={{ backgroundImage: "url('dosto-bg.jpg')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] z-20"></div>
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
            className="inline-block mb-6 px-4 py-1 border border-red-900/50 rounded-full text-xs tracking-[0.3em] text-red-700 font-sans uppercase"
          >
            1821 - 1881
          </motion.div>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-6 opacity-90 drop-shadow-2xl">
            DOSTOEVSKY
          </h1>
          <p className="text-xl md:text-2xl text-stone-400 italic mb-12 max-w-2xl mx-auto leading-relaxed">
            “我只担心一件事，我怕我配不上我所受的苦难。”
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: '#a51d1d' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-red-900 text-white rounded-sm transition-all duration-300 shadow-lg shadow-red-900/20 group"
            >
              <span className="flex items-center gap-2 uppercase tracking-widest text-sm">
                探索灵魂深处 <BookOpen size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-stone-500 z-30"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Intro Section - 带动效的文本 */}
      <section className="py-32 px-4 max-w-5xl mx-auto relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[15rem] font-bold text-white/[0.02] select-none pointer-events-none">
          SOUL
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <Feather className="mx-auto mb-8 text-red-900 animate-pulse" size={48} />
          <h2 className="text-4xl md:text-5xl font-bold mb-16 tracking-tight">人类灵魂的伟大的审问者</h2>
          <div className="grid md:grid-cols-2 gap-16 text-left leading-loose text-stone-400 text-lg">
            <p className="first-letter:text-5xl first-letter:text-red-900 first-letter:float-left first-letter:mr-3 first-letter:font-bold">
              费奥多尔·米哈伊洛维奇·陀思妥耶夫斯基，不仅是伟大的俄罗斯文学巨匠，更是深入人类灵魂最深处的探险家。
              他的作品充满了极端的张力，探讨了自由意志、上帝存在与虚无主义等永恒的命题。
            </p>
            <p className="border-l border-stone-800 pl-8 italic bg-white/[0.01] p-6">
              从死屋的磨难到流放后的爆发，他笔下的每一个人物都在痛苦与狂热中挣扎，试图在黑暗中寻找那一抹神圣的微光。
              正如他所言，他在深渊中依然歌颂生命。
            </p>
          </div>
        </motion.div>
      </section>

      {/* Major Works Section - 卡片升级 */}
      <section className="py-32 bg-[#0d0d0d] relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-baseline gap-4 mb-20">
            <h2 className="text-5xl font-bold tracking-tighter">经典杰作</h2>
            <p className="text-stone-500 font-sans tracking-widest uppercase text-sm">Selected Works</p>
            <div className="flex-grow h-px bg-gradient-to-r from-stone-800 to-transparent"></div>
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
                className={`group relative p-8 rounded-none border border-stone-800 bg-[#111] overflow-hidden transition-all duration-500`}
              >
                {/* 悬停时的背景装饰 */}
                <div className={`absolute bottom-0 right-0 w-32 h-32 -mr-10 -mb-10 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${work.color}`}></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <span className="text-xs text-red-900 font-bold tracking-[0.2em] mb-4 uppercase">{work.year}</span>
                  <h3 className="text-3xl font-bold mb-2 group-hover:text-red-700 transition-colors">{work.title}</h3>
                  <p className="text-xs text-stone-600 italic mb-6 font-sans">{work.original}</p>
                  <p className="text-stone-400 leading-relaxed mb-10 flex-grow">{work.desc}</p>
                  
                  <motion.button 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-200 font-bold border-b border-stone-800 pb-2 self-start hover:border-red-900 transition-all"
                  >
                    翻开此书 <Book size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Quote Section - 互动名言 */}
      <section className="py-40 bg-[#0a0a0a] relative flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <Quote className="mx-auto mb-12 text-red-900 opacity-50" size={80} />
          </motion.div>
          <blockquote className="text-3xl md:text-5xl italic leading-tight text-stone-200 mb-12 font-medium">
          “最重要的是，首先我们要善良，<br />
          其次要诚实，最后要永不相忘。”
          </blockquote>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            className="h-1 bg-red-900 mx-auto mb-8"
          ></motion.div>
          <cite className="block text-stone-500 font-sans not-italic tracking-[0.2em] uppercase text-sm">— 《卡拉马佐夫兄弟》</cite>
        </div>
      </section>

      {/* Footer - 简洁而庄重 */}
      <footer className="py-20 border-t border-stone-900 bg-[#080808] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-left">
            <h4 className="text-2xl font-bold mb-2 tracking-tighter">陀思妥耶夫斯基 X_maker</h4>
            <p className="text-stone-600 text-sm">痛苦是人类进化的阶梯</p>
          </div>
          <div className="flex gap-8">
             <Heart size={20} className="text-stone-700 hover:text-red-900 cursor-pointer transition-colors" />
             <MessageSquare size={20} className="text-stone-700 hover:text-red-900 cursor-pointer transition-colors" />
          </div>
        </div>
        <div className="mt-16 text-center text-stone-800 text-[10px] uppercase tracking-[0.5em]">
          &copy; {new Date().getFullYear()} Dostoevsky Society | Designed for the Soul
        </div>
      </footer>
    </div>
  );
}

export default App;
