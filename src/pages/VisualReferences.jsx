import React, { useEffect } from 'react';
import { ArrowLeft, Camera, Film, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const visualWall = [
  { src: `${import.meta.env.BASE_URL}gallery/dosto-1.png`, title: '纪念雕像夜景', type: 'Memorial' },
  { src: `${import.meta.env.BASE_URL}gallery/dosto-2.png`, title: '手绘海报风格', type: 'Poster' },
  { src: `${import.meta.env.BASE_URL}gallery/dosto-3.png`, title: '经典肖像', type: 'Portrait' },
  { src: `${import.meta.env.BASE_URL}gallery/dosto-4.png`, title: '影视片段', type: 'Cinema' },
  { src: `${import.meta.env.BASE_URL}gallery/dosto-5.png`, title: '改编角色群像', type: 'Adaptation' },
  { src: `${import.meta.env.BASE_URL}gallery/dosto-6.png`, title: '中文书封设计', type: 'Cover' },
  { src: `${import.meta.env.BASE_URL}gallery/karamazov-brothers.png`, title: '卡拉马佐夫三兄弟', type: 'Adaptation' },
];

function VisualReferences() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-[#f5f5dc] font-serif overflow-x-hidden relative bg-[#0a0e14]">
      <nav className="sticky top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-[#0d1117]/95 border-b border-[#4a6fa5]/20 backdrop-blur">
        <Link to="/" className="flex items-center gap-2 text-[#d4e4f7]/80 hover:text-[#d4e4f7] transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-widest">返回首页</span>
        </Link>
        <div className="text-xs font-sans text-[#4a6fa5]/70 uppercase tracking-widest">Visual Archive</div>
      </nav>

      <header className="relative min-h-[72vh] flex items-end border-b border-[#4a6fa5]/20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: `url('${import.meta.env.BASE_URL}gallery/dosto-3.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-[#0a0e14]/75 to-[#0a0e14]/20" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 pb-20">
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 border border-[#4a6fa5]/35 bg-[#0d1117]/60 text-[#d4e4f7]/75 font-sans text-xs uppercase tracking-[0.3em]">
            <Camera size={16} />
            Dostoevsky Visual References
          </div>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 text-stone-100">陀氏影像参考墙</h1>
          <p className="max-w-3xl text-lg md:text-xl leading-relaxed text-[#d4e4f7]/72">
            从肖像、雕像、影视化片段到中文书封，把陀思妥耶夫斯基的视觉线索整理成一个可进入、可浏览的影像档案。
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex items-center gap-4 mb-14">
          <Film className="text-[#4a6fa5]" size={26} />
          <h2 className="text-3xl font-bold tracking-tight text-stone-100">影像索引</h2>
          <div className="flex-grow h-px bg-gradient-to-r from-[#4a6fa5]/40 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visualWall.map((item, idx) => (
            <article
              key={item.src}
              className={`group border border-[#4a6fa5]/20 bg-[#0d1117] overflow-hidden ${idx === 0 ? 'md:col-span-2' : ''}`}
            >
              <div className={idx === 0 ? 'h-[420px] md:h-[560px]' : 'h-[340px]'}>
                <img
                  src={item.src}
                  alt={item.title}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex items-center justify-between gap-4 border-t border-[#4a6fa5]/20">
                <div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.32em] text-[#4a6fa5]/75 mb-2">{item.type}</p>
                  <h3 className="text-2xl font-bold text-stone-100">{item.title}</h3>
                </div>
                <ImageIcon className="text-[#4a6fa5]/50 group-hover:text-[#d4e4f7] transition-colors" size={22} />
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default VisualReferences;
