/**
 * 「聆听雪夜」：脚步、挂钟、然后骤然的静。
 * 不用粒子风噪；由 Web Audio 合成。
 */
export function createSnowNightListening(audioContext) {
  const master = audioContext.createGain();
  master.gain.value = 0.0001;
  master.connect(audioContext.destination);

  const footsteps = [];
  const scheduleFootstep = (time, intensity = 1) => {
    const thump = audioContext.createOscillator();
    const noise = audioContext.createBufferSource();
    const duration = 0.09;
    const buffer = audioContext.createBuffer(1, Math.floor(audioContext.sampleRate * duration), audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    noise.buffer = buffer;
    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 180;
    const noiseGain = audioContext.createGain();
    noiseGain.gain.value = 0.0001;
    thump.type = 'sine';
    thump.frequency.setValueAtTime(62, time);
    thump.frequency.exponentialRampToValueAtTime(28, time + 0.08);
    const thumpGain = audioContext.createGain();
    thumpGain.gain.setValueAtTime(0.0001, time);
    thumpGain.gain.exponentialRampToValueAtTime(0.11 * intensity, time + 0.012);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.1);
    thump.connect(thumpGain).connect(master);
    noise.connect(noiseFilter).connect(noiseGain).connect(master);
    noiseGain.gain.setValueAtTime(0.0001, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.04 * intensity, time + 0.008);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.07);
    thump.start(time);
    thump.stop(time + 0.12);
    noise.start(time);
    noise.stop(time + 0.1);
    footsteps.push(thump, noise);
  };

  const startAt = audioContext.currentTime + 0.15;
  master.gain.exponentialRampToValueAtTime(0.85, startAt + 0.4);

  let t = startAt;
  const walkPattern = [0, 0.52, 1.05, 1.58, 2.12, 2.65, 3.18, 3.72, 4.25, 4.78, 5.3];
  walkPattern.forEach((offset, index) => {
    scheduleFootstep(t + offset, 0.85 + (index % 3) * 0.08);
  });

  const tickOsc = audioContext.createOscillator();
  const tickGain = audioContext.createGain();
  tickOsc.type = 'square';
  tickGain.gain.value = 0.0001;
  tickOsc.connect(tickGain).connect(master);
  tickOsc.start(startAt);
  const tickStart = t + 5.8;
  for (let i = 0; i < 6; i += 1) {
    const tickTime = tickStart + i * 0.95;
    tickOsc.frequency.setValueAtTime(880, tickTime);
    tickGain.gain.setValueAtTime(0.0001, tickTime);
    tickGain.gain.exponentialRampToValueAtTime(0.035, tickTime + 0.004);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, tickTime + 0.06);
    tickOsc.frequency.setValueAtTime(440, tickTime + 0.08);
    tickGain.gain.exponentialRampToValueAtTime(0.02, tickTime + 0.084);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, tickTime + 0.14);
  }

  const silenceAt = tickStart + 5.9;
  master.gain.setValueAtTime(master.gain.value, silenceAt - 0.02);
  master.gain.exponentialRampToValueAtTime(0.0001, silenceAt + 0.35);

  const loopFoot = () => {
    let loopT = silenceAt + 2.2;
    const id = window.setInterval(() => {
      if (audioContext.state === 'closed') {
        window.clearInterval(id);
        return;
      }
      scheduleFootstep(loopT, 0.5);
      loopT += 1.1;
    }, 2200);
    return id;
  };

  let loopId = null;
  const loopDelay = window.setTimeout(() => {
    loopId = loopFoot();
  }, (silenceAt - audioContext.currentTime + 2.2) * 1000);

  return {
    context: audioContext,
    master,
    stop() {
      window.clearTimeout(loopDelay);
      if (loopId) window.clearInterval(loopId);
      const now = audioContext.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      window.setTimeout(() => {
        try {
          tickOsc.stop();
        } catch {
          /* already stopped */
        }
        audioContext.close();
      }, 500);
    },
    /** 谢苗诺夫校场：瞬间切断 */
    cutImmediate() {
      const now = audioContext.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(0.0001, now);
    },
    /** 赦免后：比刚才更响 */
    surge(volume = 1.35) {
      const now = audioContext.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(volume, now + 0.12);
    },
  };
}
