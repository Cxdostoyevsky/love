import { useEffect, useRef, useState } from 'react';

const name = '陀思妥耶夫斯基';

export default function OpeningSequence({ onFinish }) {
  const [leaving, setLeaving] = useState(false);
  const skipRef = useRef(null);

  useEffect(() => {
    skipRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const leaveTimer = window.setTimeout(() => setLeaving(true), 4100);
    const finishTimer = window.setTimeout(onFinish, 4900);
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onFinish();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(finishTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onFinish]);

  return (
    <div
      className={`opening-sequence${leaving ? ' is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="陀思妥耶夫斯基开场"
      style={{ '--opening-scene-image': `url('${import.meta.env.BASE_URL}gallery/petersburg-snow-night.png')` }}
    >
      <div className="opening-scene" aria-hidden="true" />
      <div className="opening-light" aria-hidden="true" />
      <div className="opening-grain" aria-hidden="true" />
      <div className="opening-content">
        <p className="opening-overline">Санкт-Петербург · 一八六六年</p>
        <h2 aria-label={name}>
          {Array.from(name, (character, index) => (
            <span key={`${character}-${index}`} aria-hidden="true" style={{ '--letter-index': index }}>{character}</span>
          ))}
        </h2>
        <p className="opening-subtitle">每一条昏暗的街，都通向一个人的内心。</p>
      </div>
      <span className="opening-rule" aria-hidden="true" />
      <button ref={skipRef} type="button" className="opening-skip" onClick={onFinish}>进入街道 <span aria-hidden="true">↗</span></button>
    </div>
  );
}
