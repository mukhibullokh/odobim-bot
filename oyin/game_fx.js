/* Odobim o'yini — musiqa, ovoz effektlari va vizual effektlar.
   Hammasi kod bilan yaratiladi (Web Audio), tashqi fayl kerak emas.
   Sozlamalar app.js dan beriladi: window.GFX_CFG = () => ({music:"on"|"nature"|"off", sfx:true|false}) */
(function(){
const AC = window.AudioContext || window.webkitAudioContext;
let ctx = null, master = null, musBus = null, sfxBus = null, noiseBuf = null;
const cfg = () => { try { return (window.GFX_CFG && window.GFX_CFG()) || {music:"on", sfx:true}; } catch(e){ return {music:"on", sfx:true}; } };
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

function A(){
  if (!AC) return null;
  if (!ctx){
    try { ctx = new AC(); } catch(e){ return null; }
    master = ctx.createDynamicsCompressor(); master.threshold.value = -12; master.ratio.value = 3.5; master.connect(ctx.destination);
    musBus = ctx.createGain(); musBus.gain.value = .42; musBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = .9; sfxBus.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") ctx.resume().catch(()=>{});
  return ctx;
}
/* ---------- tovush bloklari ---------- */
function env(g, t, a, peak, d){ g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(.0002, peak), t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + d); }
function tone(dest, f, t, d, o = {}){
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.type = o.type || "triangle"; osc.frequency.setValueAtTime(f, t);
  if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, t + (o.glide || d));
  if (o.det) osc.detune.value = o.det;
  let n = osc;
  if (o.lp){ const fl = ctx.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = o.lp; fl.Q.value = o.q || .7; osc.connect(fl); n = fl; }
  if (o.vib){ const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = o.vib; lg.gain.value = o.vibD || f * .012; l.connect(lg); lg.connect(osc.frequency); l.start(t); l.stop(t + (o.a || .005) + d + .1); }
  n.connect(g); g.connect(dest); env(g, t, o.a || .005, o.vol == null ? .2 : o.vol, d);
  osc.start(t); osc.stop(t + (o.a || .005) + d + .1);
}
function noise(dest, t, d, o = {}){
  const s = ctx.createBufferSource(); s.buffer = noiseBuf;
  const fl = ctx.createBiquadFilter(); fl.type = o.type || "highpass"; fl.frequency.setValueAtTime(o.f || 6000, t);
  if (o.f2) fl.frequency.exponentialRampToValueAtTime(o.f2, t + d); fl.Q.value = o.q || 1;
  const g = ctx.createGain(); s.connect(fl); fl.connect(g); g.connect(dest); env(g, t, o.a || .003, o.vol == null ? .2 : o.vol, d);
  s.start(t, Math.random() * .5); s.stop(t + (o.a || .003) + d + .1);
}
const INS = {
  marimba(d, f, t, v){ tone(d, f, t, .42, {type:"sine", vol:v}); tone(d, f * 4, t, .07, {type:"sine", vol:v * .22}); tone(d, f * 2, t, .16, {type:"triangle", vol:v * .18}); },
  glock(d, f, t, v){ tone(d, f * 2, t, .9, {type:"sine", vol:v * .8}); tone(d, f * 5.4, t, .25, {type:"sine", vol:v * .14}); },
  pluck(d, f, t, v){ tone(d, f, t, .5, {type:"sawtooth", vol:v * .55, lp:1700, q:2}); tone(d, f * 2, t, .14, {type:"triangle", vol:v * .3}); },
  ney(d, f, t, v, dur){ tone(d, f, t, dur || .7, {type:"sine", vol:v, a:.09, vib:5.2, vibD:f * .01}); tone(d, f * 2, t, dur || .7, {type:"triangle", vol:v * .12, a:.12, lp:2400}); noise(d, t, (dur||.7) * .6, {type:"bandpass", f:f * 2, q:6, vol:v * .1, a:.08}); },
  flute(d, f, t, v, dur){ tone(d, f, t, dur || .5, {type:"sine", vol:v, a:.04, vib:5.5, vibD:f * .007}); tone(d, f * 3, t, (dur||.5) * .7, {type:"sine", vol:v * .08, a:.06}); },
  bass(d, f, t, v){ tone(d, f, t, .32, {type:"sine", vol:v}); tone(d, f, t, .2, {type:"triangle", vol:v * .35, lp:500}); },
  pad(d, f, t, v, dur){ [-7, 7].forEach(det=>tone(d, f, t, dur, {type:"sawtooth", vol:v * .5, a:.5, lp:900, det})); },
  kick(d, t, v){ tone(d, 150, t, .2, {type:"sine", vol:v, f2:45, glide:.16}); },
  shaker(d, t, v){ noise(d, t, .045, {f:7500, vol:v}); },
  clap(d, t, v){ noise(d, t, .12, {type:"bandpass", f:1600, q:1.2, vol:v}); },
  dum(d, t, v){ tone(d, 120, t, .28, {type:"sine", vol:v, f2:62, glide:.2}); noise(d, t, .09, {type:"lowpass", f:380, vol:v * .5}); },
  tak(d, t, v){ noise(d, t, .06, {type:"bandpass", f:2600, q:2.5, vol:v}); tone(d, 820, t, .035, {type:"triangle", vol:v * .4}); },
  keys(d, f, t, v, dur){ const L = Math.max(.6, dur || 1); tone(d, f, t, L, {type:"sine", vol:v, a:.012}); tone(d, f * 2, t, L * .5, {type:"triangle", vol:v * .16, a:.01, lp:1800}); tone(d, f * 3, t, .18, {type:"sine", vol:v * .05}); },
  softpad(d, f, t, v, dur){ [-4, 4].forEach(det=>tone(d, f, t, dur, {type:"sine", vol:v * .5, a:.9, det})); tone(d, f * 2, t, dur, {type:"triangle", vol:v * .12, a:1.1, lp:900}); },
  bell(d, f, t, v){ tone(d, f, t, 1.4, {type:"sine", vol:v}); tone(d, f * 2.76, t, .5, {type:"sine", vol:v * .3}); tone(d, f * 5.4, t, .2, {type:"sine", vol:v * .12}); }
};

/* ---------- MUSIQA ---------- */
const MAJ = [0,2,4,5,7,9,11], PENTA = [0,2,4,7,9], HIJAZ = [0,1,4,5,7,8,10];
const chord = (root, minor) => [root, root + (minor ? 3 : 4), root + 7];
/* Tinch, takrorlanmaydigan kuylar: oldindan yozilgan ohanglar, sekin temp, yumshoq «pianino».
   Har 3-aylanishda kuy dam oladi (faqat yumshoq fon) — quloq charchamaydi. */
/* v10: GENERATIV kuy — har safar yangi ohang tug'iladi, bir xil takrorlanmaydi.
   Kuy 2 taktli motivdan quriladi (A A' B A''), har 8 taktda yangi motiv, har 16 taktda 4 takt dam. */
const TRACKS = {
  yugur:  {bpm:96, lead:"kalimba", leadV:.085, padV:.032, bassV:.075, drums:"brush", scale:PENTA, keys:[0,2,-3,5],
           progs:[[[0,0],[9,1],[5,0],[7,0]],[[0,0],[5,0],[9,1],[7,0]],[[5,0],[7,0],[0,0],[0,0]]]},
  menu:   {bpm:90, lead:"kalimba", leadV:.07, padV:.03, bassV:.065, drums:"brush", scale:PENTA, keys:[5,0,3],
           progs:[[[0,0],[5,0],[9,1],[7,0]],[[0,0],[4,1],[5,0],[7,0]]]},
  shahar: {bpm:84, lead:"dutar", leadV:.07, padV:.03, bassV:.07, drums:"doira", scale:[0,2,3,5,7,8,10], keys:[2,0,-2],
           progs:[[[0,1],[10,0],[8,0],[7,0]],[[0,1],[5,1],[10,0],[0,1]]]}
};
const ALIAS = {vodiy:"yugur", bog:"yugur", map:"menu", karvon:"shahar", shahar:"shahar"};
let seed = 1; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const RHY = [[1,0,1,0,1,1,0,0],[1,0,0,1,0,0,1,0],[1,1,0,1,0,0,0,0],[1,0,1,1,0,1,0,0],[0,0,1,0,1,0,1,1],[1,0,0,0,1,0,1,0]];
INS.kalimba = (d, f, t, v) => { tone(d, f, t, .55, {type:"sine", vol:v}); tone(d, f * 2.01, t, .12, {type:"sine", vol:v * .25}); tone(d, f * 5.9, t, .03, {type:"sine", vol:v * .12}); };
INS.musicbox = (d, f, t, v) => { tone(d, f * 2, t, 1.1, {type:"sine", vol:v * .8}); tone(d, f * 6, t, .18, {type:"sine", vol:v * .1}); };
INS.dutar = (d, f, t, v) => { tone(d, f, t, .6, {type:"sawtooth", vol:v * .45, lp:1400, q:1.5}); tone(d, f * 1.5, t, .35, {type:"triangle", vol:v * .12, lp:1800}); };
/* --- quvnoq «beat» asboblari --- */
INS.lead = (d, f, t, v, dur) => { tone(d, f, t, dur || .16, {type:"square", vol:v * .55, lp:2600, q:1.2}); tone(d, f * 2, t, (dur || .16) * .6, {type:"triangle", vol:v * .25}); };
INS.sbass = (d, f, t, v, dur) => { tone(d, f, t, dur || .18, {type:"sawtooth", vol:v, lp:420, q:4}); tone(d, f / 2, t, dur || .18, {type:"sine", vol:v * .9}); };
INS.stab = (d, fs, t, v) => fs.forEach(f => { tone(d, f, t, .12, {type:"sawtooth", vol:v, lp:2200, q:.8, det:-6}); tone(d, f, t, .12, {type:"sawtooth", vol:v, lp:2200, det:6}); });
INS.snare = (d, t, v) => { noise(d, t, .14, {type:"bandpass", f:1900, q:.7, vol:v}); tone(d, 210, t, .08, {type:"triangle", vol:v * .5, f2:150}); };
INS.hat = (d, t, v, open) => noise(d, t, open ? .16 : .035, {f:8500, vol:v});
INS.bkick = (d, t, v) => tone(d, 160, t, .26, {type:"sine", vol:v, f2:42, glide:.14});
/* Ohang naqshlari (16-lik): 1 = nota, 0 = jim. Sinkopali, «sakrovchi» */
const HOOKR = [[1,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0],[1,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0],[0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0],[1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,1]];
const BASSR = [[1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0],[1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0],[1,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0]];
const BEATS = {
  run:  {bpm:108, scale:[0,3,5,7,10], keys:[0,2,-2,5], prog:[[0,1],[8,0],[3,0],[10,0]], leadV:.07, bassV:.11, drumV:1},
  silk: {bpm:102, scale:[0,1,4,5,7,8,10], keys:[2,0], prog:[[0,0],[1,0],[0,0],[10,1]], leadV:.065, bassV:.1, drumV:.9}
};
const BEAT_ALIAS = {yugur:"run", vodiy:"run", bog:"run", shahar:"silk", karvon:"silk"};
const MUS = {
  cur:null, want:null, timer:null, tg:null, step:0, nt:0, amb:null, motif:null, key:0, prog:null,
  play(name){
    this.want = name;
    const c = cfg(); if (c.music === "off" || !name){ this.stop(); return; }
    if (this.cur === name + c.music && this.timer) return;
    if (!A()) return;
    this.stop(true);
    this.cur = name + c.music;
    const tg = this.tg = ctx.createGain(); tg.gain.setValueAtTime(.0001, ctx.currentTime); tg.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 1.5); tg.connect(musBus);
    this.step = 0; this.nt = ctx.currentTime + .1; seed = (Date.now() % 100000) + 17; this.motif = null;
    if (c.music === "nature"){ this.ambience(name, tg); return; }
    const B = BEATS[BEAT_ALIAS[name]];
    if (B){ this.key = B.keys[Math.floor(rnd() * B.keys.length)]; this.timer = setInterval(()=>this.schedB(B, tg), 25); return; }
    const T = TRACKS[ALIAS[name] || name] || TRACKS.menu;
    this.key = T.keys[Math.floor(rnd() * T.keys.length)]; this.prog = T.progs[Math.floor(rnd() * T.progs.length)];
    this.timer = setInterval(()=>this.sched(T, tg), 30);
    if (name === "vodiy" || name === "bog" || name === "map") this.ambience(name, tg, .3);
  },
  stop(fast){
    clearInterval(this.timer); this.timer = null; clearTimeout(this.amb); this.amb = null;
    if (this.tg && ctx){ const g = this.tg; try { g.gain.cancelScheduledValues(ctx.currentTime); g.gain.setValueAtTime(Math.max(.0001, g.gain.value), ctx.currentTime); g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + (fast ? .4 : .8)); } catch(e){} setTimeout(()=>{ try { g.disconnect(); } catch(e){} }, 1200); }
    this.tg = null; this.cur = null;
  },
  refresh(){ const w = this.want; this.cur = null; this.play(w); },
  duck(sec = 1.5){ if (!ctx || !musBus) return; const t = ctx.currentTime; musBus.gain.cancelScheduledValues(t); musBus.gain.setValueAtTime(musBus.gain.value, t); musBus.gain.linearRampToValueAtTime(.12, t + .08); musBus.gain.linearRampToValueAtTime(.42, t + sec); },
  sched(T, d){
    if (!ctx || ctx.state !== "running") { if (ctx) this.nt = ctx.currentTime + .05; return; }
    const sp = 60 / T.bpm / 2;
    while (this.nt < ctx.currentTime + .14){ this.note(T, d, this.step, this.nt, sp); this.nt += sp; this.step++; }
  },
  schedB(B, d){
    if (!ctx || ctx.state !== "running") { if (ctx) this.nt = ctx.currentTime + .05; return; }
    const sp = 60 / B.bpm / 4;
    while (this.nt < ctx.currentTime + .12){ this.beat(B, d, this.step, this.nt, sp); this.nt += sp; this.step++; }
  },
  bdeg(B, idx){ const L = B.scale.length, o = Math.floor(idx / L), i = ((idx % L) + L) % L; return 72 + this.key + o * 12 + B.scale[i]; },
  hook(){ const r = HOOKR[Math.floor(rnd() * HOOKR.length)]; let c = 2 + Math.floor(rnd() * 3);
    return r.map((on, i) => { if (!on) return null; c = Math.max(0, Math.min(7, c + [-2,-1,1,2,0,1,-1][Math.floor(rnd() * 7)])); return c; }); },
  /* bo'limlar (8 taktli aylanish ichida): 0-1 kirish (baraban+bas), 2-5 asosiy kuy, 6 «break», 7 avj */
  beat(B, d, s, t, sp){
    const bar = Math.floor(s / 16), p = s % 16, cyc = bar % 8, [ch, minor] = B.prog[bar % 4], root = 48 + this.key + ch;
    if (p === 0 && cyc === 0){ this.hk = this.hook(); this.hk2 = this.hook(); this.br = BASSR[Math.floor(rnd() * BASSR.length)]; if (bar > 0 && rnd() < .35) this.key = B.keys[Math.floor(rnd() * B.keys.length)]; }
    if (!this.hk){ this.hk = this.hook(); this.hk2 = this.hook(); this.br = BASSR[0]; }
    const brk = cyc === 6, V = B.drumV;
    /* barabanlar */
    if (!brk){
      if (p === 0 || p === 8 || (p === 10 && cyc % 2) || (p === 14 && cyc === 7)) INS.bkick(d, t, .16 * V);
      if (p === 4 || p === 12) { INS.snare(d, t, .07 * V); INS.clap(d, t, .05 * V); }
      if (p % 2 === 0) INS.hat(d, t, (p % 4 === 2 ? .035 : .022) * V, p === 14);
      if (cyc === 7 && p >= 12) INS.snare(d, t, .03 + (p - 12) * .015);   /* avjga «drob» */
    } else { if (p % 4 === 2) INS.hat(d, t, .03, true); }
    /* bas */
    if (this.br[p]) INS.sbass(d, mtof(root - 12 + (p === 6 || p === 14 ? 12 : 0)), t, B.bassV, sp * 1.6);
    /* «brass» akkord zarbalari */
    if (cyc >= 2 && (p === 0 || p === 3 || (p === 10 && cyc % 2))) INS.stab(d, chord(root + 12, minor).map(mtof), t, .018);
    /* kuy (hook) */
    if (cyc >= 2 && !brk){ const hk = (cyc === 4 || cyc === 5) ? this.hk2 : this.hk; let n = hk[p];
      if (n != null){ if (cyc === 7) n += 2; INS.lead(d, mtof(this.bdeg(B, n)), t, B.leadV * (p % 4 === 0 ? 1 : .8), sp * 1.7); } }
    if (brk && p % 4 === 0) INS.musicbox(d, mtof(this.bdeg(B, [4,3,2,1][p / 4])), t, .045);
  },
  /* shkala bo'yicha nota: idx — shkala pog'onasi (manfiy ham bo'ladi) */
  deg(T, idx){ const L = T.scale.length, o = Math.floor(idx / L), i = ((idx % L) + L) % L; return 72 + this.key + o * 12 + T.scale[i]; },
  newMotif(T){
    const r = RHY[Math.floor(rnd() * RHY.length)], r2 = RHY[Math.floor(rnd() * RHY.length)];
    let cur = Math.floor(rnd() * 3); const notes = [];
    for (let i = 0; i < 16; i++){ const on = (i < 8 ? r[i] : r2[i - 8]); if (!on){ notes.push(null); continue; }
      const stepv = [-2,-1,-1,1,1,2,0][Math.floor(rnd() * 7)]; cur = Math.max(-2, Math.min(6, cur + stepv)); notes.push(cur); }
    if (notes[15] != null) notes[15] = null; notes[14] = notes[14] != null ? 0 : notes[14];
    return notes;
  },
  note(T, d, s, t, sp){
    const bar = Math.floor(s / 8), p = s % 8, P = this.prog, [ch, minor] = P[bar % P.length];
    const sec = bar % 20, rest = sec >= 16;                     /* 16 takt kuy, 4 takt dam */
    if (bar % 20 === 0 && p === 0 && bar > 0){ if (rnd() < .5) this.prog = T.progs[Math.floor(rnd() * T.progs.length)]; if (rnd() < .4) this.key = T.keys[Math.floor(rnd() * T.keys.length)]; }
    if (!this.motif || (sec % 8 === 0 && p === 0)) this.motif = this.newMotif(T);
    const root = 48 + this.key + ch;
    if (p === 0){ chord(root, minor).forEach(n => INS.softpad(d, mtof(n + 12), t, T.padV * (rest ? 1.3 : 1), sp * 8)); INS.bass(d, mtof(root - 12), t, T.bassV); }
    if (p === 4 && !rest) INS.bass(d, mtof(root - 5), t, T.bassV * .6);
    if (!rest){
      if (T.drums === "brush"){ if (p === 0 || p === 4) INS.kick(d, t, .06); if (p % 2 === 1) INS.shaker(d, t, .018); }
      if (T.drums === "doira"){ if (p === 0) INS.dum(d, t, .09); if (p === 3 || p === 6) INS.tak(d, t, .03); }
      const half = (sec % 8) >= 4, idx = (sec % 2) * 8 + p; let n = this.motif[idx];
      if (n != null){ if (half && sec % 8 === 6) n += 2; if (sec % 4 === 3 && idx > 11) n = (idx === 12 ? 2 : 0);
        const m = this.deg(T, n) - (T.lead === "dutar" ? 12 : 0);
        INS[T.lead](d, mtof(m), t, T.leadV * (p % 2 ? .75 : 1), sp * 2); }
      if (T.lead === "kalimba" && p === 6 && rnd() < .25) INS.musicbox(d, mtof(this.deg(T, 4) - 12), t, .025);
    }
  },
  /* tabiat ovozlari: qushlar, shamol */
  ambience(name, d, vol = 1){
    const desert = name === "karvon" || name === "shahar";
    const wind = () => { if (!this.tg) return; const t = ctx.currentTime; noise(d, t, 4, {type:"bandpass", f:desert?420:650, f2:desert?260:420, q:.8, vol:(desert?.06:.025) * vol, a:1.6}); };
    const bird = () => { const t = ctx.currentTime, b = 2200 + Math.random() * 1600, n = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) tone(d, b, t + i * .11, .06, {type:"sine", vol:.035 * vol, f2:b * (1.25 + Math.random() * .3), glide:.05}); };
    const camelBell = () => { INS.bell(d, 880, ctx.currentTime, .025 * vol); INS.bell(d, 1175, ctx.currentTime + .35, .02 * vol); };
    const loop = () => { if (!this.tg) return;
      if (desert){ if (Math.random() < .5) wind(); if (Math.random() < .35) camelBell(); }
      else { if (Math.random() < .75) bird(); if (Math.random() < .2) wind(); }
      this.amb = setTimeout(loop, 1400 + Math.random() * 2600); };
    wind(); this.amb = setTimeout(loop, 600);
  }
};

/* ---------- OVOZ EFFEKTLARI ---------- */
function GS(kind){
  const c = cfg(); if (!c.sfx || !A()) return;
  const d = sfxBus, t = ctx.currentTime + .01;
  switch(kind){
    case "tap": tone(d, 620, t, .05, {type:"sine", vol:.12, f2:880, glide:.04}); break;
    case "type": tone(d, 900 + Math.random() * 300, t, .025, {type:"square", vol:.018, lp:2500}); break;
    case "open": tone(d, 380, t, .12, {type:"sine", vol:.12, f2:760, glide:.1}); tone(d, 760, t + .06, .1, {type:"sine", vol:.08}); break;
    case "step": noise(d, t, .04, {type:"lowpass", f:700, vol:.06}); break;
    case "jump": tone(d, 300, t, .18, {type:"sine", vol:.14, f2:900, glide:.16}); break;
    case "pop": tone(d, 900, t, .1, {type:"sine", vol:.16, f2:300, glide:.08}); break;
    case "pick": case "pair": [0, 4, 7].forEach((n,i)=>INS.marimba(d, mtof(76 + n), t + i * .06, .14)); break;
    case "coin": tone(d, 1319, t, .07, {type:"sine", vol:.07}); tone(d, 1976, t + .06, .25, {type:"sine", vol:.06}); break;
    case "star": [0, 4, 7, 12, 16].forEach((n,i)=>INS.glock(d, mtof(72 + n), t + i * .05, .1)); break;
    case "ok": INS.marimba(d, mtof(76), t, .18); INS.marimba(d, mtof(83), t + .09, .18); INS.glock(d, mtof(88), t + .18, .08); break;
    case "bad": tone(d, 330, t, .16, {type:"triangle", vol:.14, f2:220, glide:.15}); tone(d, 220, t + .16, .25, {type:"triangle", vol:.12, f2:150, glide:.22}); break;
    case "whoosh": noise(d, t, .3, {type:"bandpass", f:500, f2:2400, q:1.2, vol:.05, a:.08}); break;
    case "chest": tone(d, 110, t, .35, {type:"sawtooth", vol:.06, f2:180, lp:700}); noise(d, t, .3, {type:"bandpass", f:900, q:4, vol:.05}); break;
    case "treasure": MUS.duck(1.6); noise(d, t, .5, {type:"highpass", f:5000, vol:.06, a:.1}); [0, 4, 7, 12, 16, 19, 24].forEach((n,i)=>INS.glock(d, mtof(76 + n), t + i * .055, .1)); break;
    case "gate": MUS.duck(2); INS.kick(d, t, .4); noise(d, t, 1, {type:"bandpass", f:200, f2:2000, q:1, vol:.1, a:.2}); [0, 7, 12].forEach((n,i)=>INS.bell(d, mtof(67 + n), t + .2 + i * .15, .08)); break;
    case "fanfare": case "win": MUS.duck(1.8); [[0,0],[4,.1],[7,.2],[12,.3]].forEach(([n,dt])=>{ INS.marimba(d, mtof(72 + n), t + dt, .2); INS.pluck(d, mtof(60 + n), t + dt, .1); }); INS.glock(d, mtof(84), t + .42, .12); INS.kick(d, t, .25); break;
    case "levelup": MUS.duck(3.2); [0, 4, 7, 12, 7, 12, 16, 19, 24].forEach((n,i)=>INS.marimba(d, mtof(67 + n), t + i * .09, .18));
      [0, 1.0].forEach(dt=>{ chord(55, 0).forEach(n=>INS.pad(d, mtof(n + 12), t + .9 + dt * 0, .08, 1.6)); }); INS.kick(d, t, .35); INS.kick(d, t + .45, .3); INS.clap(d, t + .9, .15); INS.bell(d, mtof(91), t + .9, .1); break;
    case "good": INS.marimba(d, mtof(72), t, .16); INS.marimba(d, mtof(79), t + .08, .16); INS.marimba(d, mtof(84), t + .16, .2); break;
    default: tone(d, 600, t, .06, {type:"sine", vol:.1});
  }
}
document.addEventListener("visibilitychange", ()=>{ if (!ctx) return; if (document.hidden) ctx.suspend().catch(()=>{}); else if (MUS.timer || MUS.amb) ctx.resume().catch(()=>{}); });
["pointerdown","keydown","touchstart"].forEach(ev=>addEventListener(ev, ()=>{ if (MUS.want && !MUS.cur) MUS.play(MUS.want); else if (ctx && ctx.state === "suspended" && !document.hidden) ctx.resume().catch(()=>{}); }, {passive:true, capture:true}));

/* ---------- VIZUAL EFFEKTLAR ---------- */
const RM = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const ptOf = a => { if (!a) return {x:innerWidth/2, y:innerHeight/2}; if (a.getBoundingClientRect){ const r = a.getBoundingClientRect(); return {x:r.left + r.width/2, y:r.top + r.height/2}; } return a; };
const layer = () => { let l = document.getElementById("fxl"); if (!l){ l = document.createElement("div"); l.id = "fxl"; document.body.appendChild(l); } return l; };
const COLORS = ["#FFD23F","#FF6B9A","#5BD1FF","#7CF29A","#B388FF","#FF9F43","#FFFFFF"];
const FX = {
  /* zarrachalar portlashi */
  burst(at, o = {}){
    if (RM()) return; const p = ptOf(at), L = layer(), n = o.n || 18;
    for (let i = 0; i < n; i++){
      const s = document.createElement("i"); s.className = "fxp " + (o.shape || (i % 3 ? "dot" : "star"));
      const a = Math.random() * Math.PI * 2, r = (o.r || 90) * (.4 + Math.random() * .8);
      s.style.left = p.x + "px"; s.style.top = p.y + "px";
      s.style.setProperty("--dx", Math.cos(a) * r + "px"); s.style.setProperty("--dy", Math.sin(a) * r - (o.up || 30) + "px");
      s.style.setProperty("--c", (o.colors || COLORS)[i % (o.colors || COLORS).length]); s.style.setProperty("--s", (o.size || 10) * (.6 + Math.random() * .8) + "px");
      s.style.animationDuration = (.6 + Math.random() * .5) + "s";
      if (o.emoji) s.textContent = o.emoji;
      L.appendChild(s); setTimeout(()=>s.remove(), 1300);
    }
  },
  /* narsa uchib boradi (masalan yulduz hisoblagichga) */
  fly(from, to, html, o = {}){
    const a = ptOf(from), tEl = typeof to === "string" ? document.querySelector(to) : to, b = ptOf(tEl);
    if (RM() || !tEl){ o.done && o.done(); return; }
    const n = o.n || 1;
    for (let i = 0; i < n; i++){
      const s = document.createElement("span"); s.className = "fxfly"; s.innerHTML = html; layer().appendChild(s);
      const mx = (a.x + b.x) / 2 + (Math.random() - .5) * 120, my = Math.min(a.y, b.y) - 80 - Math.random() * 60;
      const anim = s.animate([
        {transform:`translate(${a.x}px,${a.y}px) translate(-50%,-50%) scale(.4)`, opacity:0},
        {transform:`translate(${a.x}px,${a.y - 20}px) translate(-50%,-50%) scale(1.3)`, opacity:1, offset:.15},
        {transform:`translate(${mx}px,${my}px) translate(-50%,-50%) scale(1.1)`, offset:.55},
        {transform:`translate(${b.x}px,${b.y}px) translate(-50%,-50%) scale(.6)`, opacity:.9}
      ], {duration:(o.ms || 800) + i * 90, delay:i * 70, easing:"cubic-bezier(.45,.05,.55,.95)", fill:"forwards"});
      anim.onfinish = () => { s.remove(); tEl.classList.remove("fxbump"); void tEl.offsetWidth; tEl.classList.add("fxbump"); if (o.sound) GS(o.sound); if (i === n - 1) o.done && o.done(); };
    }
  },
  /* katta lenta: "Vazifa bajarildi!" */
  banner(title, sub, o = {}){
    const b = document.createElement("div"); b.className = "fxban " + (o.cls || "");
    b.innerHTML = `<div class="fxribbon"><b></b><small></small></div>`; b.querySelector("b").textContent = title; b.querySelector("small").textContent = sub || "";
    if (!sub) b.querySelector("small").remove();
    layer().appendChild(b); setTimeout(()=>FX.burst(b.querySelector(".fxribbon"), {n:26, r:160}), 250); setTimeout(()=>b.remove(), o.ms || 1900);
  },
  /* nur sochish (sandiq, darvoza) */
  rays(at, o = {}){ if (RM()) return; const p = ptOf(at), r = document.createElement("div"); r.className = "fxrays"; r.style.left = p.x + "px"; r.style.top = p.y + "px"; if (o.size) r.style.setProperty("--sz", o.size + "px"); layer().appendChild(r); setTimeout(()=>r.remove(), o.ms || 1600); },
  flash(color = "#fff"){ if (RM()) return; const f = document.createElement("div"); f.className = "fxflash"; f.style.background = color; layer().appendChild(f); setTimeout(()=>f.remove(), 500); },
  shake(el, cls = "fxshake"){ if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(()=>el.classList.remove(cls), 600); },
  text(txt, at, cls = ""){ const p = ptOf(at), s = document.createElement("div"); s.className = "fxtext " + cls; s.textContent = txt; s.style.left = p.x + "px"; s.style.top = p.y + "px"; layer().appendChild(s); setTimeout(()=>s.remove(), 1400); },
  /* matn harfma-harf yoziladi */
  type(el, text, o = {}){
    if (RM() || !text){ el.textContent = text; o.done && o.done(); return {skip(){}, busy:()=>false}; }
    let i = 0, stop = false; el.textContent = ""; el.classList.add("typing");
    const full = String(text), speed = o.cps || 46, t0 = performance.now();
    const st = { busy:()=>!stop && i < full.length, skip(){ if (stop) return; i = full.length; el.textContent = full; fin(); } };
    const fin = () => { if (stop) return; stop = true; el.classList.remove("typing"); o.done && o.done(); };
    const step = now => { if (stop) return; const want = Math.min(full.length, Math.floor((now - t0) / 1000 * speed));
      if (want > i){ if (Math.floor(want / 3) > Math.floor(i / 3)) GS("type"); i = want; el.textContent = full.slice(0, i); }
      if (i >= full.length) return fin(); requestAnimationFrame(step); };
    requestAnimationFrame(step); return st;
  },
  /* mushak (salyut) */
  fireworks(ms = 2600){
    if (RM()) return; const cv = document.createElement("canvas"); cv.className = "fxcanvas"; const dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; layer().appendChild(cv); const g = cv.getContext("2d"); g.scale(dpr, dpr);
    const P = [], R = []; let t0 = performance.now(), last = t0, nextL = 0;
    const launch = () => R.push({x:innerWidth * (.15 + Math.random() * .7), y:innerHeight, vy:-(innerHeight * (.9 + Math.random() * .35)), ty:innerHeight * (.18 + Math.random() * .3), c:COLORS[Math.floor(Math.random() * 6)]});
    const boom = r => { const n = 46; for (let i = 0; i < n; i++){ const a = i / n * Math.PI * 2, sp = 120 + Math.random() * 150; P.push({x:r.x, y:r.y, vx:Math.cos(a) * sp, vy:Math.sin(a) * sp, l:1, c:Math.random() < .3 ? "#fff" : r.c}); } GS("pop"); };
    const fr = now => { const dt = Math.min(.05, (now - last) / 1000); last = now; g.clearRect(0, 0, innerWidth, innerHeight);
      if (now - t0 < ms && now > nextL){ launch(); nextL = now + 260 + Math.random() * 300; }
      for (let i = R.length - 1; i >= 0; i--){ const r = R[i]; r.y += r.vy * dt; r.vy *= .985; g.fillStyle = "#FFF3C4"; g.beginPath(); g.arc(r.x, r.y, 2.5, 0, 7); g.fill(); if (r.y <= r.ty){ boom(r); R.splice(i, 1); } }
      for (let i = P.length - 1; i >= 0; i--){ const p = P[i]; p.vy += 160 * dt; p.vx *= .98; p.vy *= .98; p.x += p.vx * dt; p.y += p.vy * dt; p.l -= dt * .75;
        if (p.l <= 0){ P.splice(i, 1); continue; } g.globalAlpha = p.l; g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, 2.6, 0, 7); g.fill(); g.globalAlpha = 1; }
      if (now - t0 < ms + 2200 && (R.length || P.length || now - t0 < ms)) requestAnimationFrame(fr); else cv.remove(); };
    requestAnimationFrame(fr);
  },
  /* sahifaga kirishda doira ochilishi */
  iris(){ if (RM()) return; const d = document.createElement("div"); d.className = "fxiris"; layer().appendChild(d); setTimeout(()=>d.remove(), 900); },
  combo(n){ FX.text(n >= 5 ? `Ajoyib! ×${n}` : `Zo'r! ×${n}`, {x:innerWidth/2, y:innerHeight * .28}, "combo"); }
};
window.MUS = MUS; window.__TRACKS = TRACKS; window.__BEATS = BEATS; window.GS = GS; window.FX = FX; window.__gfxAudio = () => ({ctx, master});
})();
