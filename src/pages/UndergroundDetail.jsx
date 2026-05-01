import React, { useEffect, useMemo } from 'react';
import { Quote, Lightbulb, MessageSquare, ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import notes from '../data/notes.json';
import bookManifest from '../../book/manifest.json';
import undergroundMarkdown from '../../book/地下室手记（果麦经典）.md?raw';
import ManifestTOC from '../components/ManifestTOC';
import BookMarkdown from '../components/BookMarkdown';

function UndergroundDetail() {
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

  return (
    <div className="min-h-screen text-[#f5f5dc] font-serif overflow-x-hidden relative bg-[#0a0e14]">
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
