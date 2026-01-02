import React from 'react';
import { motion } from 'framer-motion';
import { Book, Quote, Feather, ChevronDown } from 'lucide-react';

const works = [
  {
    title: "罪与罚",
    original: "Преступление и наказание",
    year: "1866",
    desc: "关于道德困境与自我救赎的永恒探讨。",
    color: "bg-red-900/40"
  },
  {
    title: "卡拉马佐夫兄弟",
    original: "Братья Карамазовы",
    year: "1880",
    desc: "陀氏最后的巅峰之作，深入探讨上帝、自由与邪恶。",
    color: "bg-stone-800/60"
  },
  {
    title: "白痴",
    original: "Идиот",
    year: "1869",
    desc: "一个纯洁灵魂在虚伪社会中的毁灭。",
    color: "bg-blue-900/30"
  },
  {
    title: "地下室手记",
    original: "Записки из подполья",
    year: "1864",
    desc: "存在主义的先声，对现代文明的深刻反思。",
    color: "bg-gray-900/80"
  }
];

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5dc] selection:bg-red-900 selection:text-white font-serif">
      
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden border-b border-stone-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070')] bg-cover bg-center opacity-10 grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-4 opacity-90">
            DOSTOEVSKY
          </h1>
          <p className="text-xl md:text-2xl text-stone-400 italic mb-8 max-w-2xl mx-auto">
            "我只担心一件事，我怕我配不上我所受的苦难。"
          </p>
          <div className="flex gap-6 justify-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-red-900/80 hover:bg-red-800 text-white rounded-sm transition-colors"
            >
              探索作品
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-stone-600 hover:border-stone-400 transition-colors rounded-sm"
            >
              生平简介
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-stone-500"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Intro Section */}
      <section className="py-24 px-4 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Feather className="mx-auto mb-6 text-red-900" size={40} />
          <h2 className="text-4xl font-bold mb-12">人类灵魂的伟大的审问者</h2>
          <div className="grid md:grid-cols-2 gap-12 text-left leading-relaxed text-stone-300">
            <p>
              费奥多尔·米哈伊洛维奇·陀思妥耶夫斯基（1821-1881），不仅是伟大的俄罗斯文学巨匠，更是深入人类灵魂最深处的探险家。
              他的作品充满了极端的张力，探讨了自由意志、上帝存在与虚无主义等永恒的命题。
            </p>
            <p>
              从死屋的磨难到流放后的爆发，他笔下的每一个人物都在痛苦与狂热中挣扎，试图在黑暗中寻找那一抹神圣的微光。
              正如他所言，他在深渊中依然歌颂生命。
            </p>
          </div>
        </motion.div>
      </section>

      {/* Major Works Section */}
      <section className="py-24 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-16">
            <Book className="text-red-900" />
            <h2 className="text-3xl font-bold">主要作品</h2>
            <div className="flex-grow h-px bg-stone-800"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {works.map((work, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className={`p-6 rounded-lg ${work.color} backdrop-blur-sm border border-stone-800 flex flex-col h-full`}
              >
                <span className="text-xs text-stone-500 mb-2">{work.year}</span>
                <h3 className="text-2xl font-bold mb-1">{work.title}</h3>
                <p className="text-xs text-stone-400 italic mb-4 font-sans">{work.original}</p>
                <p className="text-stone-300 text-sm flex-grow">{work.desc}</p>
                <button className="mt-6 text-xs uppercase tracking-widest text-red-800 font-bold hover:text-red-700 transition-colors">
                  了解更多 &rarr;
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none overflow-hidden whitespace-nowrap text-[20rem] font-bold">
          RUSSIA LITERARY MASTERPIECE
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <Quote className="mx-auto mb-8 text-stone-700" size={60} />
          <blockquote className="text-3xl md:text-4xl italic leading-snug text-stone-200">
            “最要紧的是，我们首先应该善良，其次要诚实，再其次是以后永远不要相互遗忘。”
          </blockquote>
          <cite className="block mt-8 text-stone-500 font-sans not-italic">— 《卡拉马佐夫兄弟》</cite>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-stone-900 text-center text-stone-600 text-sm">
        <p>&copy; {new Date().getFullYear()} 陀思妥耶夫斯基研究社 | 痛苦是人类进化的阶梯</p>
      </footer>
    </div>
  );
}

export default App;
