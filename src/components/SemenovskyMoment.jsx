import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COUNT_FROM = 8;

export default function SemenovskyMoment({
  children,
  onFreeze,
  onRelease,
  yearLabel = '1849',
}) {
  const ref = useRef(null);
  const [phase, setPhase] = useState('idle');
  const [count, setCount] = useState(COUNT_FROM);
  const firedRef = useRef(false);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node || firedRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.55) return;
        if (firedRef.current) return;
        firedRef.current = true;
        scrollYRef.current = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollYRef.current}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';
        setCount(COUNT_FROM);
        setPhase('frozen');
        onFreeze?.();
      },
      { threshold: [0.55, 0.7] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onFreeze]);

  useEffect(() => {
    if (phase !== 'frozen') return undefined;
    let n = COUNT_FROM;
    const tick = window.setInterval(() => {
      n -= 1;
      if (n >= 1) {
        setCount(n);
        return;
      }
      window.clearInterval(tick);
      setPhase('pardon');
      window.setTimeout(() => {
        setPhase('release');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollYRef.current);
        onRelease?.();
        window.setTimeout(() => setPhase('done'), 600);
      }, 900);
    }, 1000);
    return () => window.clearInterval(tick);
  }, [phase, onRelease]);

  return (
    <motion.article
      ref={ref}
      className={`life-window life-window-semenovsky${phase !== 'idle' && phase !== 'done' ? ' is-semenovsky-active' : ''}`}
      data-semenovsky-phase={phase}
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.75 }}
    >
      {children}
      <AnimatePresence>
        {(phase === 'frozen' || phase === 'pardon') && (
          <motion.div
            className="semenovsky-freeze"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-live="assertive"
          >
            <p className="semenovsky-place">谢苗诺夫校场 · {yearLabel}</p>
            {phase === 'frozen' && (
              <motion.span
                key={count}
                className="semenovsky-count"
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {count}
              </motion.span>
            )}
            {phase === 'pardon' && (
              <motion.p
                className="semenovsky-pardon"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                赦免
              </motion.p>
            )}
            <p className="semenovsky-caption">枪口已经举起。雪与声音一同停住。</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
