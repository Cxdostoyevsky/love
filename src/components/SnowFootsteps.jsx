import { useEffect, useRef } from 'react';

const SCROLL_KEYS = new Set([
  'ArrowDown',
  'ArrowUp',
  'PageDown',
  'PageUp',
  'Home',
  'End',
  ' ',
]);

function createSnowCrunchBuffer(audioContext) {
  const duration = 0.24;
  const buffer = audioContext.createBuffer(
    1,
    Math.floor(audioContext.sampleRate * duration),
    audioContext.sampleRate
  );
  const samples = buffer.getChannelData(0);

  for (let index = 0; index < samples.length; index += 1) {
    const progress = index / samples.length;
    const envelope = Math.pow(1 - progress, 3.2);
    const grit = Math.random() * 2 - 1;
    const crust = Math.random() > 0.93 ? (Math.random() * 2 - 1) * 1.8 : 0;
    samples[index] = (grit * 0.72 + crust) * envelope;
  }

  return buffer;
}

function playSnowStep(audioContext, buffer, side, intensity) {
  const now = audioContext.currentTime;
  const source = audioContext.createBufferSource();
  const highPass = audioContext.createBiquadFilter();
  const bandPass = audioContext.createBiquadFilter();
  const crunchGain = audioContext.createGain();
  const panner = audioContext.createStereoPanner?.();
  const thump = audioContext.createOscillator();
  const thumpGain = audioContext.createGain();

  source.buffer = buffer;
  source.playbackRate.value = 0.88 + Math.random() * 0.22;
  highPass.type = 'highpass';
  highPass.frequency.value = 150 + Math.random() * 70;
  bandPass.type = 'bandpass';
  bandPass.frequency.value = 760 + Math.random() * 420;
  bandPass.Q.value = 0.55;
  crunchGain.gain.setValueAtTime(0.0001, now);
  crunchGain.gain.exponentialRampToValueAtTime(0.026 + intensity * 0.015, now + 0.008);
  crunchGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  source.connect(highPass).connect(bandPass).connect(crunchGain);
  if (panner) {
    panner.pan.value = side * (0.16 + Math.random() * 0.08);
    crunchGain.connect(panner).connect(audioContext.destination);
  } else {
    crunchGain.connect(audioContext.destination);
  }

  thump.type = 'sine';
  thump.frequency.setValueAtTime(92 + Math.random() * 14, now);
  thump.frequency.exponentialRampToValueAtTime(54, now + 0.11);
  thumpGain.gain.setValueAtTime(0.0001, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.012 + intensity * 0.006, now + 0.012);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  thump.connect(thumpGain).connect(audioContext.destination);

  source.start(now);
  source.stop(now + 0.25);
  thump.start(now);
  thump.stop(now + 0.15);
}

export default function SnowFootsteps() {
  const audioRef = useRef(null);
  const bufferRef = useRef(null);
  const lastScrollRef = useRef(0);
  const distanceRef = useRef(0);
  const lastStepRef = useRef(0);
  const sideRef = useRef(-1);

  useEffect(() => {
    lastScrollRef.current = window.scrollY;

    const ensureAudio = () => {
      if (!audioRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const context = new AudioContext();
        audioRef.current = context;
        bufferRef.current = createSnowCrunchBuffer(context);
      }

      if (audioRef.current.state === 'suspended') {
        audioRef.current.resume();
      }
    };

    const handleKeydown = (event) => {
      if (SCROLL_KEYS.has(event.key)) ensureAudio();
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - lastScrollRef.current);
      lastScrollRef.current = currentY;
      distanceRef.current += delta;

      const context = audioRef.current;
      const buffer = bufferRef.current;
      if (!context || !buffer || context.state !== 'running') return;

      const now = performance.now();
      const distancePerStep = delta > 90 ? 62 : 46;
      const minimumInterval = delta > 90 ? 105 : 145;
      if (
        distanceRef.current >= distancePerStep &&
        now - lastStepRef.current >= minimumInterval
      ) {
        const intensity = Math.min(delta / 160, 1);
        playSnowStep(context, buffer, sideRef.current, intensity);
        sideRef.current *= -1;
        lastStepRef.current = now;
        distanceRef.current %= distancePerStep;
      }
    };

    const handleVisibility = () => {
      if (document.hidden && audioRef.current?.state === 'running') {
        audioRef.current.suspend();
      }
    };

    window.addEventListener('wheel', ensureAudio, { passive: true });
    window.addEventListener('touchstart', ensureAudio, { passive: true });
    window.addEventListener('pointerdown', ensureAudio, { passive: true });
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('wheel', ensureAudio);
      window.removeEventListener('touchstart', ensureAudio);
      window.removeEventListener('pointerdown', ensureAudio);
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      audioRef.current?.close();
      audioRef.current = null;
      bufferRef.current = null;
    };
  }, []);

  return null;
}
