import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import Snowfall from '../components/Snowfall';

const rooms = {
  raskolnikov: {
    kicker: '圣彼得堡 · 一八六六 · 一间闷热的阁楼',
    name: '拉斯柯尔尼科夫',
    work: '《罪与罚》',
    original: 'Преступление и наказание',
    thesis: '他想证明自己可以越过界线，最后却发现，审判一直发生在自己心里。',
    whisper: '你以为自己越过的是一条界线，其实是把自己留在了界线那边。',
    question: '一个人若把自己变成观念的工具，还能靠什么重新回到人群中？',
    coda: '先来到他身边的不是法律，而是无法沉默的良知。',
    tone: 'copper',
  },
  nelly: {
    kicker: '圣彼得堡 · 雪水正在屋檐下结冰',
    name: '涅莉',
    work: '《被侮辱与被损害的人》',
    original: 'Униженные и оскорблённые',
    thesis: '她低着头，并不是因为顺从。一个受伤太久的孩子，也会把骄傲当成最后的住所。',
    whisper: '不要因为我可怜，就以为我会低下头。',
    question: '当怜悯来得太迟，接受爱为什么也会变成一种疼痛？',
    coda: '她需要的从来不是被观看的苦难，而是不附带条件的靠近。',
    tone: 'violet',
  },
};

export default function CharacterRoom({ room }) {
  const content = rooms[room];
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main
      className={`character-room character-room-${content.tone}`}
      style={{ '--room-night-image': `url('${import.meta.env.BASE_URL}gallery/petersburg-snow-night.png')` }}
    >
      <div className="character-room-night" aria-hidden="true" />
      <Snowfall reducedMotion={reducedMotion} />
      <nav className="character-room-nav">
        <Link to="/" aria-label="返回雪夜街道"><ArrowLeft size={16} /> 返回雪夜</Link>
        <span>{content.work}</span>
      </nav>

      <section className="character-room-hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 1.25 }}
        >
          <p className="character-room-kicker">{content.kicker}</p>
          <h1>{content.name}</h1>
          <p className="character-room-original">{content.original}</p>
          <p className="character-room-thesis">{content.thesis}</p>
        </motion.div>
      </section>

      <section className="character-room-confession">
        <p>人物独白 · 策展改写</p>
        <blockquote>“{content.whisper}”</blockquote>
      </section>

      <section className="character-room-question">
        <div>
          <p>问题留给你</p>
          <h2>{content.question}</h2>
          <span>{content.coda}</span>
        </div>
      </section>

      <footer className="character-room-footer">
        <Link to="/">
          <BookOpen size={16} /> 回到人物相遇的街道 <ArrowRight size={16} />
        </Link>
      </footer>
    </main>
  );
}
