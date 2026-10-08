import { useEffect, useRef, useState } from 'react';

const name = '陀思妥耶夫斯基';

export default function OpeningSequence({ onFinish }) {
  const [phase, setPhase] = useState('garden');
  const skipRef = useRef(null);
  const laughterAudioRef = useRef(null);

  useEffect(() => {
    skipRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const dropTimer = window.setTimeout(() => setPhase('petition'), 2200);
    return () => window.clearTimeout(dropTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'petition') return undefined;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0.08;
      gain.connect(ctx.destination);
      const bursts = [0, 0.18, 0.42, 0.7, 1.05];
      bursts.forEach((start, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520 + i * 40, ctx.currentTime + start);
        osc.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + start + 0.14);
        g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
        g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + 0.16);
        osc.connect(g).connect(gain);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + 0.18);
      });
      laughterAudioRef.current = ctx;
    }
    const snowTimer = window.setTimeout(() => setPhase('snow'), 400);
    return () => window.clearTimeout(snowTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'snow') return undefined;
    laughterAudioRef.current?.close?.();
    laughterAudioRef.current = null;
    const endTimer = window.setTimeout(onFinish, 1400);
    return () => window.clearTimeout(endTimer);
  }, [phase, onFinish]);

  useEffect(() => () => {
    laughterAudioRef.current?.close?.();
  }, []);

  const enterStreet = () => {
    if (phase === 'snow') return;
    setPhase('petition');
    window.setTimeout(() => setPhase('snow'), 120);
  };

  return (
    <div
      className={`opening-sequence opening-phase-${phase}`}
      role="dialog"
      aria-modal="true"
      aria-label="陀思妥耶夫斯基开场"
    >
      <img
        className="opening-scene"
        src={`${import.meta.env.BASE_URL}gallery/petersburg-garden-opening.png`}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
      />
      <div className="opening-light" aria-hidden="true" />
      <div className="opening-grain" aria-hidden="true" />
      <div className="opening-snow-veil" aria-hidden="true" />

      <motionlessPetition phase={phase} />

      <div className="opening-content">
        <p className="opening-overline">Санкт-Петербург · 在故事开始以前</p>
        <h2 aria-label={name}>
          {Array.from(name, (character, index) => {
            const angle = (index / name.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <span
                key={`${character}-${index}`}
                aria-hidden="true"
                style={{
                  '--letter-index': index,
                  '--orbit-x': `${Math.cos(angle) * 42}vw`,
                  '--orbit-y': `${Math.sin(angle) * 42}vh`,
                  '--orbit-rotation': `${index % 2 ? 630 : -630}deg`,
                }}
              ><span className="opening-letter-float">{character}</span></span>
            );
          })}
        </h2>
        <p className="opening-subtitle">在鲜花和孩子的笑声里，故事暂时还是明亮的。</p>
      </div>
      <span className="opening-rule" aria-hidden="true" />
      <button
        ref={skipRef}
        type="button"
        className="opening-skip"
        onClick={enterStreet}
        disabled={phase === 'snow'}
      >
        进入街道 <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}

function motionlessPetition({ phase }) {
  if (phase === 'garden') return null;
  return (
    <div className={`opening-petition${phase === 'snow' ? ' is-buried' : ' is-dropping'}`} aria-hidden="true">
      <span>第九品文官 · 私人档案</span>
      <strong>请愿书已退回</strong>
      <small>Причина отказа не указана</small>
    </div>
  );
}
