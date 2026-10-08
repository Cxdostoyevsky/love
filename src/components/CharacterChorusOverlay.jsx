import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const REBUTTAL_POOL = {
  underground: [
    { name: '伊万·卡拉马佐夫', text: '你若真自由，为何仍躲在——' },
    { name: '拉斯柯尔尼科夫', text: '别把我当成你的镜子，我还没——' },
    { name: '梅诗金公爵', text: '我看见你了。你别假装——' },
  ],
  raskolnikov: [
    { name: '地下人', text: '你杀的不是人，是你还剩下的——' },
    { name: '涅莉', text: '别把流血叫作正义，你——' },
    { name: '伊万·卡拉马佐夫', text: '你以为上帝会替你签字？不会——' },
  ],
  ivan: [
    { name: '地下人', text: '你拒绝入场券，却仍坐在观众席——' },
    { name: '梅诗金公爵', text: '孩子的眼泪，你也流不完——' },
    { name: '拉斯柯尔尼科夫', text: '你的理性比我的斧头更——' },
  ],
  nelly: [
    { name: '地下人', text: '别用骄傲挡住眼泪，你——' },
    { name: '拉斯柯尔尼科夫', text: '你比我更清楚何谓侮辱，可你——' },
    { name: '伊万·卡拉马佐夫', text: '沉默不是软弱，但你仍——' },
  ],
  myshkin: [
    { name: '地下人', text: '善良若只是表演，比恶意更——' },
    { name: '涅莉', text: '你走近我，却不敢碰——' },
    { name: '伊万·卡拉马佐夫', text: '你以为宽恕能抵消审判？不能——' },
  ],
};

function pickRebuttals(position) {
  const pool = REBUTTAL_POOL[position] ?? REBUTTAL_POOL.underground;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

export default function CharacterChorusOverlay({ burst, onDone }) {
  const navigate = useNavigate();

  const rebuttals = useMemo(
    () => (burst ? pickRebuttals(burst.position) : []),
    [burst]
  );

  useEffect(() => {
    if (!burst) return undefined;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => {
      navigate(burst.route);
      onDone?.();
    }, 3200);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [burst, navigate, onDone]);

  const fragment = burst?.fragment ?? '';

  return (
    <AnimatePresence>
      {burst && (
        <motion.div
          className="character-chorus-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${burst.name}打断街道`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.p
            className="character-chorus-primary"
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="character-chorus-speaker">{burst.name}</span>
            <q>{fragment}</q>
            <span className="character-chorus-cut" aria-hidden="true">……</span>
          </motion.p>

          {rebuttals.map((reb, index) => (
            <motion.p
              key={reb.name}
              className={`character-chorus-rebuttal character-chorus-rebuttal-${index === 0 ? 'a' : 'b'}`}
              initial={{ opacity: 0, x: index === 0 ? -40 : 40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.35 + index * 0.18, duration: 0.5 }}
            >
              <span>{reb.name}</span>
              <q>{reb.text}</q>
            </motion.p>
          ))}

          <motion.div
            className="character-chorus-scratch"
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 1.4, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
