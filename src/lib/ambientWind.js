export function createAmbientWind(audioContext, { volume = 0.055, cutoff = 1250 } = {}) {
  const duration = 3;
  const buffer = audioContext.createBuffer(
    1,
    audioContext.sampleRate * duration,
    audioContext.sampleRate
  );
  const samples = buffer.getChannelData(0);
  let last = 0;

  for (let i = 0; i < samples.length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = last * 0.985 + white * 0.015;
    samples[i] = last * 3.2;
  }

  const source = audioContext.createBufferSource();
  const lowPass = audioContext.createBiquadFilter();
  const highPass = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  const gust = audioContext.createOscillator();
  const gustDepth = audioContext.createGain();

  source.buffer = buffer;
  source.loop = true;
  lowPass.type = 'lowpass';
  lowPass.frequency.value = cutoff;
  highPass.type = 'highpass';
  highPass.frequency.value = 85;
  gain.gain.value = 0.0001;
  gust.type = 'sine';
  gust.frequency.value = 0.085;
  gustDepth.gain.value = volume * 0.64;

  source.connect(lowPass);
  lowPass.connect(highPass);
  highPass.connect(gain);
  gain.connect(audioContext.destination);
  gust.connect(gustDepth);
  gustDepth.connect(gain.gain);
  source.start();
  gust.start();
  gain.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + 1.8);

  return {
    stop() {
      const now = audioContext.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      window.setTimeout(() => {
        source.stop();
        gust.stop();
        audioContext.close();
      }, 800);
    },
  };
}

export function createTribunalAmbience(audioContext) {
  const wind = createAmbientWind(audioContext, { volume: 0.028, cutoff: 560 });
  const hum = audioContext.createOscillator();
  const humGain = audioContext.createGain();
  const pulse = audioContext.createOscillator();
  const pulseDepth = audioContext.createGain();

  hum.type = 'sine';
  hum.frequency.value = 52;
  humGain.gain.value = 0.0001;
  pulse.type = 'sine';
  pulse.frequency.value = 0.12;
  pulseDepth.gain.value = 0.006;
  hum.connect(humGain).connect(audioContext.destination);
  pulse.connect(pulseDepth).connect(humGain.gain);
  hum.start();
  pulse.start();
  humGain.gain.exponentialRampToValueAtTime(0.014, audioContext.currentTime + 2.4);

  return {
    stop() {
      const now = audioContext.currentTime;
      humGain.gain.cancelScheduledValues(now);
      humGain.gain.setValueAtTime(Math.max(humGain.gain.value, 0.0001), now);
      humGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      window.setTimeout(() => {
        hum.stop();
        pulse.stop();
      }, 800);
      wind.stop();
    },
  };
}
