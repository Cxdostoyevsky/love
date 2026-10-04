import { useEffect, useRef, useState } from 'react';

const name = '陀思妥耶夫斯基';

export default function OpeningSequence({ onFinish }) {
  const [leaving, setLeaving] = useState(false);
  const skipRef = useRef(null);

  useEffect(() => {
    skipRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!leaving) return undefined;
    const finishTimer = window.setTimeout(onFinish, 850);
    return () => window.clearTimeout(finishTimer);
  }, [leaving, onFinish]);

  return (
    <div
      className={`opening-sequence${leaving ? ' is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="陀思妥耶夫斯基开场"
      style={{ '--opening-scene-image': `url('${import.meta.env.BASE_URL}gallery/petersburg-garden-opening.png')` }}
    >
      <div className="opening-scene" aria-hidden="true" />
      <div className="opening-light" aria-hidden="true" />
      <div className="opening-grain" aria-hidden="true" />
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
              >{character}</span>
            );
          })}
        </h2>
        <p className="opening-subtitle">在鲜花和孩子的笑声里，故事暂时还是明亮的。</p>
      </div>
      <span className="opening-rule" aria-hidden="true" />
      <button ref={skipRef} type="button" className="opening-skip" onClick={() => setLeaving(true)} disabled={leaving}>进入街道 <span aria-hidden="true">↗</span></button>
    </div>
  );
}
