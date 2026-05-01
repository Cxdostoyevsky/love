/** 首页侧边「Dostoevsky Mini」插图（public/dostoevsky-desk-lineart.png） */
export default function DostoevskyMascot() {
  return (
    <div className="w-[220px] md:w-[260px] border border-[#4a6fa5]/35 bg-[#0d1117]/85 p-3 shadow-[0_10px_30px_rgba(2,8,18,0.45)]">
      <div className="overflow-hidden rounded-lg bg-white ring-1 ring-white/10">
        <img
          src={`${import.meta.env.BASE_URL}dostoevsky-desk-lineart.png`}
          alt="陀思妥耶夫斯基伏案执笔写作的线描插画，桌上有稿纸、红色墨水瓶与书堆。"
          width={480}
          height={640}
          className="w-full h-auto object-cover object-top"
          decoding="async"
          loading="lazy"
        />
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#4a6fa5]/80 font-sans">
        Dostoevsky Mini
      </p>
    </div>
  );
}
