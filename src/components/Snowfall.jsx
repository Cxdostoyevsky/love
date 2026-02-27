import { useEffect, useMemo } from 'react';

/* 俄国大雪 - 共享雪景组件 */
const SNOWFLAKES = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  left: (i * 13.7 + i * 0.3) % 100,
  size: 2.5 + (i % 6),
  duration: 8 + (i % 12),
  delay: (i * 0.3) % 8,
}));

export default function Snowfall({ reducedMotion = false }) {
  const layers = useMemo(() => {
    const farCount = reducedMotion ? 14 : 28;
    const midCount = reducedMotion ? 18 : 28;
    const blizzardCount = reducedMotion ? 10 : 20;

    return {
      far: SNOWFLAKES.slice(0, farCount),
      mid: SNOWFLAKES.slice(farCount, farCount + midCount),
      blizzard: SNOWFLAKES.slice(farCount + midCount, farCount + midCount + blizzardCount),
    };
  }, [reducedMotion]);

  useEffect(() => {
    const root = document.documentElement;
    let rafId = null;
    let pendingDrift = false;
    let pendingParallax = false;
    let latestMouseX = 0;
    let latestMouseY = 0;

    const applySnowDrift = () => {
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = window.scrollY / scrollable;
      const driftX = Math.round(progress * 80 - 40);
      root.style.setProperty('--snow-drift-x', `${driftX}px`);
      pendingDrift = false;
    };

    const applyParallax = () => {
      const offsetX = (latestMouseX / window.innerWidth - 0.5) * 12;
      const offsetY = (latestMouseY / window.innerHeight - 0.5) * 8;
      root.style.setProperty('--parallax-x', `${offsetX.toFixed(2)}px`);
      root.style.setProperty('--parallax-y', `${offsetY.toFixed(2)}px`);
      pendingParallax = false;
    };

    const scheduleFrame = () => {
      if (rafId !== null) {
        return;
      }
      rafId = window.requestAnimationFrame(() => {
        if (pendingDrift) {
          applySnowDrift();
        }
        if (pendingParallax) {
          applyParallax();
        }
        rafId = null;
      });
    };

    const updateSnowDrift = () => {
      pendingDrift = true;
      scheduleFrame();
    };

    const updateParallax = (event) => {
      latestMouseX = event.clientX;
      latestMouseY = event.clientY;
      pendingParallax = true;
      scheduleFrame();
    };

    const resetParallax = () => {
      root.style.setProperty('--parallax-x', '0px');
      root.style.setProperty('--parallax-y', '0px');
    };

    applySnowDrift();
    window.addEventListener('scroll', updateSnowDrift, { passive: true });

    if (!reducedMotion) {
      window.addEventListener('mousemove', updateParallax, { passive: true });
      window.addEventListener('mouseleave', resetParallax);
    }

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', updateSnowDrift);
      window.removeEventListener('mousemove', updateParallax);
      window.removeEventListener('mouseleave', resetParallax);
      root.style.setProperty('--snow-drift-x', '24px');
      root.style.setProperty('--parallax-x', '0px');
      root.style.setProperty('--parallax-y', '0px');
    };
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]" aria-hidden="true">
      {layers.far.map((s) => (
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
      {layers.mid.map((s) => (
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
      {layers.blizzard.map((s) => (
        <div
          key={`bliz-${s.id}`}
          className="snowflake"
          style={{
            left: `${(s.left + 10) % 100}%`,
            width: `${s.size + 2}px`,
            height: `${s.size + 2}px`,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 0 8px rgba(255,255,255,0.5)',
            animation: `snowfall-blizzard ${Math.max(s.duration - 2, 6)}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
