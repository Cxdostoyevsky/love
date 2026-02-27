export default function DostoevskyMascot() {
  return (
    <div className="w-[220px] md:w-[260px] border border-[#4a6fa5]/35 bg-[#0d1117]/85 p-3 shadow-[0_10px_30px_rgba(2,8,18,0.45)]">
      <svg viewBox="0 0 240 240" className="w-full h-auto" role="img" aria-label="Dostoevsky cartoon mascot">
        <defs>
          <linearGradient id="coat" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1f2a40" />
            <stop offset="100%" stopColor="#101722" />
          </linearGradient>
          <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f4dcc2" />
            <stop offset="100%" stopColor="#e3bf95" />
          </linearGradient>
        </defs>

        <rect x="10" y="10" width="220" height="220" rx="18" fill="#0a0f17" />
        <ellipse cx="120" cy="194" rx="64" ry="16" fill="#05080f" opacity="0.65" />

        <path d="M70 188c10-26 22-39 50-39s40 13 50 39v24H70z" fill="url(#coat)" />
        <path d="M116 153h8v50h-8z" fill="#b48a54" opacity="0.6" />

        <circle cx="120" cy="106" r="48" fill="url(#skin)" />
        <path d="M73 107c2-33 22-53 47-53 30 0 47 22 47 49-10-17-23-25-40-25-19 0-35 9-54 29z" fill="#3a2a1e" />
        <path d="M77 117c11 9 29 14 44 14s34-5 42-13c-2 30-18 54-42 54-26 0-42-24-44-55z" fill="#8a5f3a" />
        <path d="M100 104c7 0 13 3 18 9-8-1-15-1-22 0 1-5 2-9 4-9zm30 0c7 0 12 4 14 9-7-1-13-1-20 0 1-6 3-9 6-9z" fill="#2b1d14" />

        <ellipse cx="105" cy="118" rx="4" ry="5" fill="#1f1a17" />
        <ellipse cx="136" cy="118" rx="4" ry="5" fill="#1f1a17" />
        <path d="M116 129c2 3 6 3 8 0" stroke="#8f5e3b" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M108 141c8 5 16 5 24 0" stroke="#5a3b27" strokeWidth="3" fill="none" strokeLinecap="round" />

        <path d="M84 108c6-7 14-11 22-10" stroke="#2b1d14" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M136 98c8 0 16 4 22 10" stroke="#2b1d14" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
      <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#4a6fa5]/80 font-sans">Dostoevsky Mini</p>
    </div>
  );
}
