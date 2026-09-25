import { BgmTheme } from '../types';

class BgmSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private gainNode: GainNode | null = null;
  private currentTheme: BgmTheme = 'none';
  private masterVolume = 0.25;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  public duck(ducking = true) {
    if (!this.gainNode || !this.ctx) return;
    const target = ducking ? this.masterVolume * 0.4 : this.masterVolume;
    this.gainNode.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
  }

  public play(theme: BgmTheme) {
    this.currentTheme = theme;
    if (theme === 'none') {
      this.stop();
      return;
    }

    this.initContext();
    if (!this.ctx || !this.gainNode) return;

    this.stopPattern();
    this.isPlaying = true;

    if (theme === 'cyberpunk') {
      this.startCyberpunkLoop();
    } else if (theme === 'lofi') {
      this.startLofiLoop();
    } else if (theme === 'tension') {
      this.startTensionLoop();
    }
  }

  public stop() {
    this.stopPattern();
    this.isPlaying = false;
  }

  private stopPattern() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private startCyberpunkLoop() {
    if (!this.ctx || !this.gainNode) return;

    const baseFreqs = [55, 55, 65.4, 73.4, 82.4, 65.4, 55, 49]; // A1, C2, D2, E2...
    let step = 0;

    const intervalMs = 125; // 120 BPM 16th notes / 8th notes
    this.timerId = window.setInterval(() => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;

      const now = this.ctx.currentTime;
      const freq = baseFreqs[step % baseFreqs.length];

      // Bass synth
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + 0.18);

      noteGain.gain.setValueAtTime(0.35, now);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + 0.22);

      // Cyber hi-hat tick every other step
      if (step % 2 === 1) {
        this.playNoiseTick(now, 0.05, 0.08);
      }

      step++;
    }, intervalMs);
  }

  private startLofiLoop() {
    if (!this.ctx || !this.gainNode) return;

    const chords = [
      [220, 261.6, 329.6, 392], // Am7
      [174.6, 220, 261.6, 329.6], // Fmaj7
      [261.6, 329.6, 392, 493.8], // Cmaj7
      [196, 246.9, 293.6, 349.2], // G7
    ];
    let chordIndex = 0;

    const intervalMs = 1400; // Gentle slow progression
    this.timerId = window.setInterval(() => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;

      const now = this.ctx.currentTime;
      const chord = chords[chordIndex % chords.length];

      chord.forEach((freq, i) => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.12, now + 0.3);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 1.7);
      });

      chordIndex++;
    }, intervalMs);
  }

  private startTensionLoop() {
    if (!this.ctx || !this.gainNode) return;

    // Sub-bass drone
    const droneOsc = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(43.65, this.ctx.currentTime); // F1
    droneGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    droneOsc.connect(droneGain);
    droneGain.connect(this.gainNode);
    droneOsc.start();

    // Periodic heartbeat clock tick
    let beat = 0;
    this.timerId = window.setInterval(() => {
      if (!this.ctx || !this.gainNode || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      this.playNoiseTick(now, 0.08, 0.15);
      beat++;
    }, 500);
  }

  private playNoiseTick(time: number, duration: number, gain: number) {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3000, time);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(gain, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.gainNode);

    noise.start(time);
  }
}

export const bgmSynth = new BgmSynthesizer();
