/* 俄国大雪 - 共享雪景组件 */
const SNOWFLAKES = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  left: (i * 13.7 + i * 0.3) % 100,
  size: 2.5 + (i % 6),
  duration: 8 + (i % 12),
  delay: (i * 0.3) % 8,
}));

export default function Snowfall() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]" aria-hidden="true">
      {SNOWFLAKES.slice(0, 40).map((s) => (
        <div
          key={`far-${s.id}`}
          className="snowflake"
          style={{
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: 'rgba(212, 228, 247, 0.5)',
            boxShadow: '0 0 4px rgba(255,255,255,0.3)',
            animation: `snowfall-slow ${s.duration + 4}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
      {SNOWFLAKES.slice(40, 85).map((s) => (
        <div
          key={s.id}
          className="snowflake"
          style={{
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: 'rgba(212, 228, 247, 0.88)',
            boxShadow: '0 0 8px rgba(255,255,255,0.5)',
            animation: `snowfall ${s.duration}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
      {SNOWFLAKES.slice(85).map((s) => (
        <div
          key={`bliz-${s.id}`}
          className="snowflake"
          style={{
            left: `${(s.left + 10) % 100}%`,
            width: `${s.size + 2}px`,
            height: `${s.size + 2}px`,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 0 10px rgba(255,255,255,0.6)',
            animation: `snowfall-blizzard ${s.duration - 2}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
