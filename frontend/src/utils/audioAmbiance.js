/**
 * Synthesized Arctic Twilight Ambient Soundscape
 * Pure Web Audio API — No external audio files required.
 * Creates an ethereal, serene, soft wind and crystalline chime ambiance on demand.
 */

class ArcticAmbiance {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.gainNode = null;
    this.intervalId = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);
    }
  }

  play() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.gainNode.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 2);

    // Play subtle soft crystalline chime notes periodically (pentatonic arctic scale)
    const frequencies = [587.33, 659.25, 880.0, 987.77, 1174.66, 1318.51]; // D5, E5, A5, B5, D6, E6

    const playChime = () => {
      if (!this.isPlaying || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.04, now + 0.4);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + 4.6);
    };

    // Play first chime immediately
    playChime();
    this.intervalId = setInterval(playChime, 3800);
  }

  pause() {
    if (!this.ctx || !this.isPlaying) return;
    this.isPlaying = false;
    if (this.gainNode) {
      this.gainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }
}

export const arcticAudio = new ArcticAmbiance();
