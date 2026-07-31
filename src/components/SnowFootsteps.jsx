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

function createSoftSnowBuffer(audioContext) {
  const duration = 0.52;
  const buffer = audioContext.createBuffer(
    1,
    Math.floor(audioContext.sampleRate * duration),
    audioContext.sampleRate
  );
  const samples = buffer.getChannelData(0);

  for (let index = 0; index < samples.length; index += 1) {
    const progress = index / samples.length;
    const attack = Math.min(progress / 0.16, 1);
    const release = Math.pow(1 - progress, 1.8);
    const breath = Math.sin(progress * Math.PI);
    const white = Math.random() * 2 - 1;
    const fineGrain = Math.random() * 2 - 1;
    samples[index] = (white * 0.7 + fineGrain * 0.3) * attack * release * breath;
  }

  return buffer;
}

function playSnowStep(audioContext, buffer, side, intensity) {
  const now = audioContext.currentTime;
  const source = audioContext.createBufferSource();
  const softHighPass = audioContext.createBiquadFilter();
  const snowBody = audioContext.createBiquadFilter();
  const snowAir = audioContext.createBiquadFilter();
  const stepGain = audioContext.createGain();
  const panner = audioContext.createStereoPanner?.();

  source.buffer = buffer;
  source.playbackRate.value = 0.82 + Math.random() * 0.16;
  softHighPass.type = 'highpass';
  softHighPass.frequency.value = 105 + Math.random() * 35;
  snowBody.type = 'lowpass';
  snowBody.frequency.setValueAtTime(1450 + Math.random() * 260, now);
  snowBody.frequency.exponentialRampToValueAtTime(720, now + 0.44);
  snowBody.Q.value = 0.35;
  snowAir.type = 'peaking';
  snowAir.frequency.value = 920 + Math.random() * 180;
  snowAir.Q.value = 0.5;
  snowAir.gain.value = 2.2;
  stepGain.gain.setValueAtTime(0.0001, now);
  stepGain.gain.exponentialRampToValueAtTime(
    0.017 + intensity * 0.007,
    now + 0.075
  );
  stepGain.gain.exponentialRampToValueAtTime(0.011, now + 0.19);
  stepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

  source
    .connect(softHighPass)
    .connect(snowBody)
    .connect(snowAir)
    .connect(stepGain);
  if (panner) {
    panner.pan.value = side * (0.1 + Math.random() * 0.06);
    stepGain.connect(panner).connect(audioContext.destination);
  } else {
    stepGain.connect(audioContext.destination);
  }

  source.start(now);
  source.stop(now + 0.54);
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
        bufferRef.current = createSoftSnowBuffer(context);
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
      const distancePerStep = delta > 90 ? 76 : 58;
      const minimumInterval = delta > 90 ? 170 : 225;
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
