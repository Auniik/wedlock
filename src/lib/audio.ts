// Everything audible is synthesised in the browser: a tanpura drone, a bansuri-like
// voice wandering through Raag Bhupali, a shankh (conch) call and temple-bell chimes.

const SA = 277.18; // C#4
const ratio: Record<string, number> = {
  S: 1, R: 9 / 8, G: 5 / 4, P: 3 / 2, D: 5 / 3,
  "S'": 2, "R'": 9 / 4, "G'": 5 / 2, ".D": 5 / 6, ".P": 3 / 4,
};

// Phrases built only from Bhupali swaras (S R G P D), each [note, beats].
const phrases: [string, number][][] = [
  [["G", 1], ["R", 1], ["S", 1], ["R", 0.5], ["G", 2.5]],
  [["P", 1], ["G", 1], ["R", 0.5], ["G", 0.5], ["P", 1], ["D", 3]],
  [["S'", 1.5], ["D", 0.5], ["P", 1], ["G", 1], ["R", 1], ["S", 3]],
  [[".D", 1], ["S", 1], ["R", 1], ["G", 3]],
  [["G", 0.5], ["P", 0.5], ["D", 1], ["S'", 2], ["D", 0.5], ["P", 2.5]],
  [["P", 1], ["D", 0.5], ["S'", 0.5], ["R'", 1], ["S'", 1], ["D", 1], ["P", 3]],
  [["G", 1], ["P", 1], ["G", 0.5], ["R", 0.5], ["S", 1], [".D", 1], ["S", 3]],
];

class WeddingAudio {
  ctx: AudioContext | null = null;
  master!: GainNode;
  music!: GainNode;
  reverb!: ConvolverNode;
  private timers: number[] = [];
  playing = false;

  private ensure() {
    if (this.ctx) return this.ctx;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(ctx.destination);

    this.reverb = ctx.createConvolver();
    const len = ctx.sampleRate * 3.2;
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    this.reverb.buffer = ir;
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    this.reverb.connect(wet).connect(this.master);

    this.music = ctx.createGain();
    this.music.gain.value = 0;
    this.music.connect(this.master);
    this.music.connect(this.reverb);
    return ctx;
  }

  async resume() {
    const ctx = this.ensure();
    if (ctx.state === "suspended") await ctx.resume();
    return ctx;
  }

  /** The shankh call that opens the invitation. */
  async conch() {
    const ctx = await this.resume();
    const t = ctx.currentTime + 0.05;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, t);
    out.gain.linearRampToValueAtTime(0.5, t + 0.35);
    out.gain.setValueAtTime(0.5, t + 1.6);
    out.gain.linearRampToValueAtTime(0.62, t + 2.1);
    out.gain.exponentialRampToValueAtTime(0.0001, t + 3.4);
    const body = ctx.createBiquadFilter();
    body.type = "bandpass";
    body.frequency.value = 900;
    body.Q.value = 0.9;
    out.connect(body).connect(this.master);
    body.connect(this.reverb);

    [1, 2, 3, 4.02].forEach((h, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? "sawtooth" : "triangle";
      o.frequency.setValueAtTime(330 * h * 0.94, t);
      o.frequency.linearRampToValueAtTime(330 * h, t + 0.45);
      o.frequency.setValueAtTime(330 * h, t + 1.7);
      o.frequency.linearRampToValueAtTime(330 * h * 1.06, t + 2.3);
      const vib = ctx.createOscillator();
      vib.frequency.value = 5.2;
      const vibAmt = ctx.createGain();
      vibAmt.gain.value = 2.2 * h;
      vib.connect(vibAmt).connect(o.frequency);
      const g = ctx.createGain();
      g.gain.value = [0.5, 0.22, 0.12, 0.06][i];
      o.connect(g).connect(out);
      o.start(t); vib.start(t);
      o.stop(t + 3.5); vib.stop(t + 3.5);
    });
  }

  /** A small cluster of temple bells, for the Shubho Drishti moment. */
  async bells() {
    const ctx = await this.resume();
    [0, 0.18, 0.42].forEach((delay, k) => {
      const t = ctx.currentTime + delay;
      const f = [1320, 1760, 1568][k];
      [1, 2.76, 5.4].forEach((p, i) => {
        const o = ctx.createOscillator();
        o.frequency.value = f * p;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime([0.12, 0.05, 0.02][i], t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4 / p);
        o.connect(g).connect(this.master);
        g.connect(this.reverb);
        o.start(t);
        o.stop(t + 2.6);
      });
    });
  }

  private pluck(freq: number, t: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.11, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 4.2);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(2600, t);
    lp.frequency.exponentialRampToValueAtTime(500, t + 3.5);
    g.connect(lp).connect(this.music);
    [0, 3].forEach((cents) => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = freq;
      o.detune.value = cents;
      o.connect(g);
      o.start(t);
      o.stop(t + 4.3);
    });
  }

  private flute(phrase: [string, number][], start: number, beat: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = "sine";
    const o2 = ctx.createOscillator();
    o2.type = "triangle";
    const g = ctx.createGain();
    const g2 = ctx.createGain();
    g2.gain.value = 0.18;
    const vib = ctx.createOscillator();
    vib.frequency.value = 5;
    const vibAmt = ctx.createGain();
    vibAmt.gain.value = 0;
    vib.connect(vibAmt);
    vibAmt.connect(o.frequency);
    vibAmt.connect(o2.frequency);

    let t = start;
    g.gain.setValueAtTime(0, t);
    phrase.forEach(([note, beats], i) => {
      const f = SA * 2 * ratio[note];
      if (i === 0) {
        o.frequency.setValueAtTime(f, t);
        o2.frequency.setValueAtTime(f * 2, t);
        g.gain.linearRampToValueAtTime(0.085, t + 0.25);
      } else {
        // meend: a short glide into each new swara
        o.frequency.setTargetAtTime(f, t, 0.045);
        o2.frequency.setTargetAtTime(f * 2, t, 0.045);
      }
      const dur = beats * beat;
      vibAmt.gain.setValueAtTime(0, t);
      if (dur > beat * 1.4) vibAmt.gain.linearRampToValueAtTime(f * 0.012, t + dur * 0.8);
      t += dur;
    });
    g.gain.setValueAtTime(0.085, t - 0.35);
    g.gain.linearRampToValueAtTime(0, t + 0.2);

    o.connect(g);
    o2.connect(g2).connect(g);
    g.connect(this.music);
    [o, o2, vib].forEach((n) => { n.start(start); n.stop(t + 0.3); });
    return t;
  }

  async start() {
    const ctx = await this.resume();
    if (this.playing) return;
    this.playing = true;
    this.music.gain.cancelScheduledValues(ctx.currentTime);
    this.music.gain.setTargetAtTime(1, ctx.currentTime, 1.2);

    // tanpura: Pa, Sa', Sa', Sa
    const tanpura = [SA * 0.75, SA, SA, SA * 0.5];
    let i = 0;
    const pluckLoop = () => {
      if (!this.playing) return;
      this.pluck(tanpura[i % 4], ctx.currentTime + 0.05);
      i++;
      this.timers.push(window.setTimeout(pluckLoop, i % 4 === 0 ? 1500 : 1100));
    };
    pluckLoop();

    let last = -1;
    const melodyLoop = () => {
      if (!this.playing) return;
      let k = Math.floor(Math.random() * phrases.length);
      if (k === last) k = (k + 1) % phrases.length;
      last = k;
      const end = this.flute(phrases[k], ctx.currentTime + 0.1, 0.62);
      const rest = 2200 + Math.random() * 2600;
      this.timers.push(window.setTimeout(melodyLoop, (end - ctx.currentTime) * 1000 + rest));
    };
    this.timers.push(window.setTimeout(melodyLoop, 3200));
  }

  stop() {
    this.playing = false;
    this.timers.forEach(clearTimeout);
    this.timers = [];
    if (this.ctx) this.music.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
  }
}

let instance: WeddingAudio | null = null;
export const weddingAudio = () => (instance ??= new WeddingAudio());
