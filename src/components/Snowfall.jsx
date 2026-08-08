import { useEffect, useMemo } from 'react';

const SNOWFLAKES = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  left: (i * 13.7 + i * 0.3) % 100,
  restY: (i * 37.7 + 11) % 100,
  size: 1.2 + ((i * 17) % 42) / 10,
  duration: 9 + ((i * 19) % 110) / 10,
  delay: -((i * 29) % 130) / 10,
  sway: 22 + ((i * 31) % 82),
  rotation: (i * 47) % 360,
  opacity: 0.38 + ((i * 23) % 50) / 100,
}));

export default function Snowfall({ reducedMotion = false }) {
  const layers = useMemo(() => {
    const farCount = reducedMotion ? 18 : 42;
    const midCount = reducedMotion ? 14 : 32;
    const nearCount = reducedMotion ? 0 : 14;

    return {
      far: SNOWFLAKES.slice(0, farCount),
      mid: SNOWFLAKES.slice(farCount, farCount + midCount),
      near: SNOWFLAKES.slice(farCount + midCount, farCount + midCount + nearCount),
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
    <div
      className="snowfield absolute inset-0 overflow-hidden pointer-events-none z-[5]"
      data-reduced-motion={reducedMotion}
      aria-hidden="true"
    >
      {layers.far.map((s) => (
        <div
          key={`far-${s.id}`}
          className="snowflake snowflake-far"
          style={{
            left: `${s.left}%`,
            '--flake-size': `${Math.max(s.size * 0.48, 0.7)}px`,
            '--flake-duration': `${s.duration + 5}s`,
            '--flake-delay': `${s.delay}s`,
            '--flake-sway': `${s.sway * 0.55}px`,
            '--flake-rotation': `${s.rotation}deg`,
            '--flake-opacity': s.opacity * 0.58,
            '--rest-y': `${s.restY}vh`,
          }}
        ><span /></div>
      ))}
      {layers.mid.map((s) => (
        <div
          key={s.id}
          className="snowflake snowflake-mid"
          style={{
            left: `${s.left}%`,
            '--flake-size': `${s.size}px`,
            '--flake-duration': `${s.duration}s`,
            '--flake-delay': `${s.delay}s`,
            '--flake-sway': `${s.sway}px`,
            '--flake-rotation': `${s.rotation}deg`,
            '--flake-opacity': s.opacity,
            '--rest-y': `${s.restY}vh`,
          }}
        ><span /></div>
      ))}
      {layers.near.map((s) => (
        <div
          key={`near-${s.id}`}
          className="snowflake snowflake-near"
          style={{
            left: `${(s.left + 10) % 100}%`,
            '--flake-size': `${s.size + 1.8}px`,
            '--flake-duration': `${Math.max(s.duration - 3.2, 5.2)}s`,
            '--flake-delay': `${s.delay}s`,
            '--flake-sway': `${s.sway * 1.45}px`,
            '--flake-rotation': `${s.rotation}deg`,
            '--flake-opacity': Math.min(s.opacity + 0.08, 0.92),
            '--rest-y': `${s.restY}vh`,
          }}
        ><span /></div>
      ))}
    </div>
  );
}
