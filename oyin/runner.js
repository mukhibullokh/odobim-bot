/* «Odob yo'li» — 3 yo'lakli yugurish o'yini (Subway Surfers uslubida).
   Yo'lda savol darvozalari bor: bola to'g'ri javob yozilgan yo'lakka yugurib o'tadi.
   Savollar faqat «Bola – odobi bilan aziz» kitobidan (book_data.js).
   Ishlatish: RUNNER.start({host, unit, qs, gender, skin, age:"kids"|"teens", sfx, onEnd}) */
(function(){
const LW = 2.4, CAMH = 3.4, CAMD = 6.4, FAR = 200;
const THEMES = [
  {sky:["#3FA9F5","#BFE6FF"], hor:"#D7F0FF", grass:"#7CCB5E", grass2:"#6CBE50", road:"#EBD5A8", road2:"#E2C995", curb:"#C99A5E", curb2:"#DDBA84", props:["house2","poplar","tree","lamp","bush","poplar"], ridge:["hill","#A6D98A","#86C770"]},
  {sky:["#5AB8FF","#FFE3F0"], hor:"#FFEAF3", grass:"#88D66C", grass2:"#79C95E", road:"#F3DFB8", road2:"#EBD4A6", curb:"#D19E66", curb2:"#E6BE8A", props:["blossom","flowerbed","sunflower","tree","blossom","bush"], ridge:["hill","#9ADB8C","#7CCB72"]},
  {sky:["#FF9A55","#FFE0AE"], hor:"#FFE9C8", grass:"#D9BE84", grass2:"#CFB277", road:"#ECD0A2", road2:"#E2C391", curb:"#B5843F", curb2:"#CC9E5C", props:["minaret","house2","palm","lamp","city","palm"], ridge:["dune","#E9B872","#D9A25E"]},
  {sky:["#5E7CFF","#DCE5FF"], hor:"#E8EEFF", grass:"#72C076", grass2:"#64B368", road:"#DCD5C6", road2:"#D1C9B8", curb:"#9A8F7A", curb2:"#B3A893", props:["pine","rock","poplar","pine","bush","pine"], ridge:["mount","#9DB7E6","#fff"]}
];
const PROPHI = {house2:6, poplar:9, tree:5.5, lamp:4.6, bush:1.7, blossom:5.5, flowerbed:1.3, sunflower:1.5, minaret:8.5, palm:7, city:8, pine:7.5, rock:1.4};
const PROPH = {house2:6.5, poplar:9, tree:6.5, lamp:4.5, bush:1.6, blossom:6, flowerbed:1.2, sunflower:2.4, minaret:11, palm:6.5, city:6, pine:7.5, rock:1.6};
const PALM = `<svg viewBox="0 0 60 80"><path d="M30 80 Q33 50 30 26" stroke="#8A5A34" stroke-width="5" fill="none"/><path d="M30 26 Q10 18 4 32 M30 26 Q50 18 56 32 M30 26 Q16 6 6 10 M30 26 Q44 6 54 10 M30 26 Q30 4 34 0" stroke="#2F9A4A" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
const LANEC = ["#2F80ED","#F2994A","#9B51E0"], LETTER = ["A","B","C"];

/* ---- SVG → rasm (bir marta chiziladi) ---- */
const SPR = {};
/* kichraytirilgan nusxalar (mip): uzoqdagi narsa kichik nusxadan chiziladi — tez ishlaydi */
function mips(c){
  const out = [c]; let cur = c;
  while (cur.height > 40){ const n = document.createElement("canvas"); n.width = Math.max(2, cur.width >> 1); n.height = Math.max(2, cur.height >> 1);
    const g = n.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(cur, 0, 0, n.width, n.height); out.push(n); cur = n; }
  return out;
}
function pick(s, hpx){
  const m = s.mips; if (!m) return s.img;
  for (let i = m.length - 1; i >= 0; i--) if (m[i].height >= hpx) return m[i];
  return m[0];
}
function sprite(key, svg, hpx = 256){
  if (SPR[key]) return SPR[key];
  const s = SPR[key] = {img:null, ar:1, ok:false};
  const m = /viewBox="([-\d. ]+)"/.exec(svg); const vb = m ? m[1].trim().split(/\s+/).map(Number) : [0,0,100,100];
  s.ar = vb[2] / vb[3]; const W = Math.max(8, Math.round(hpx * s.ar));
  const src = svg.replace(/<svg([^>]*)>/, (a, attrs) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${hpx}"${attrs.replace(/\s(width|height)="[^"]*"/g, "")}>`);
  const img = new Image();
  img.onload = () => { const c = document.createElement("canvas"); c.width = W; c.height = hpx; c.getContext("2d").drawImage(img, 0, 0, W, hpx); s.img = c; s.mips = mips(c); s.ok = true; };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(src);
  return s;
}
/* rasm yuklash: avval CORS bilan (qirqish uchun), bo'lmasa — oddiy */
function loadImg(url, ok, bad){
  const im = new Image(); let tried = false; im.crossOrigin = "anonymous";
  im.onload = () => ok(im);
  im.onerror = () => { if (!tried){ tried = true; const j = new Image(); j.onload = () => ok(j); j.onerror = bad; j.src = url + (url.includes("?") ? "&" : "?") + "nc=1"; } else bad(); };
  im.src = url;
}
/* tashqi rasm (PNG/WebP) → sprite; shaffof chetlarini qirqib oladi */
function imgSprite(key, url){
  if (SPR[key]) return SPR[key];
  const s = SPR[key] = {img:null, ar:.6, ok:false, fail:false};
  if (!url){ s.fail = true; return s; }
  loadImg(url, im => {
    let sx = 0, sy = 0, sw = im.naturalWidth, sh = im.naturalHeight;
    try { const c = document.createElement("canvas"), W = 160, H = Math.round(160 * sh / sw); c.width = W; c.height = H; const g = c.getContext("2d"); g.drawImage(im, 0, 0, W, H);
      const d = g.getImageData(0, 0, W, H).data; let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] > 24){ if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (x1 > x0 && y1 > y0){ const k = sw / W; sx = x0 * k; sy = y0 * k; sw = (x1 - x0 + 1) * k; sh = (y1 - y0 + 1) * k; }
    } catch(e){ /* boshqa domendan — qirqmasdan */ }
    const c2 = document.createElement("canvas"), HH = 420, WW = Math.round(HH * sw / sh); c2.width = WW; c2.height = HH;
    c2.getContext("2d").drawImage(im, sx, sy, sw, sh, 0, 0, WW, HH); s.img = c2; s.mips = mips(c2); s.ar = WW / HH; s.ok = true;
  }, () => { s.fail = true; });
  return s;
}
/* yugurish kadrlari: bitta rasmdagi 4 ta kadrni avtomatik ajratadi (shaffof oraliqlar bo'yicha) */
function sheetSprite(key, url, nWant = 4){
  if (SPR[key]) return SPR[key];
  const s = SPR[key] = {frames:[], ok:false, fail:false};
  if (!url){ s.fail = true; return s; }
  loadImg(url, im => {
    const IW = im.naturalWidth, IH = im.naturalHeight; let boxes = null;
    try {
      const W = 420, H = Math.round(W * IH / IW), c = document.createElement("canvas"); c.width = W; c.height = H;
      const g = c.getContext("2d"); g.drawImage(im, 0, 0, W, H); const d = g.getImageData(0, 0, W, H).data;
      const col = new Array(W).fill(0); for (let x = 0; x < W; x++){ let n = 0; for (let y = 0; y < H; y++) if (d[(y * W + x) * 4 + 3] > 30) n++; col[x] = n; }
      let segs = [], st = -1; for (let x = 0; x <= W; x++){ const on = x < W && col[x] > 1; if (on && st < 0) st = x; if (!on && st >= 0){ if (x - st > W * .04) segs.push([st, x]); st = -1; } }
      if (segs.length > nWant) segs = segs.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0])).slice(0, nWant).sort((a, b) => a[0] - b[0]);
      if (segs.length >= 2){
        const k = IW / W; boxes = segs.map(([x0, x1]) => { let y0 = H, y1 = 0; for (let y = 0; y < H; y++) for (let x = x0; x < x1; x++) if (d[(y * W + x) * 4 + 3] > 30){ if (y < y0) y0 = y; if (y > y1) y1 = y; } return [x0 * k, y0 * k, (x1 - x0) * k, (y1 - y0 + 1) * k]; });
      }
    } catch(e){}
    if (!boxes) boxes = [...Array(nWant)].map((_, i) => [IW / nWant * i, 0, IW / nWant, IH]);
    const maxH = Math.max(...boxes.map(b => b[3]));
    s.frames = boxes.map(([x, y, w, h]) => { const HH = 380, sc = HH / maxH, c = document.createElement("canvas"); c.width = Math.max(4, Math.round(w * sc)); c.height = Math.max(4, Math.round(h * sc));
      c.getContext("2d").drawImage(im, x, y, w, h, 0, 0, c.width, c.height); return {img:c, mips:mips(c), ar:c.width / c.height, hr:h / maxH}; });
    s.ok = s.frames.length >= 2;
  }, () => { s.fail = true; });
  return s;
}
/* tashqi rasmli bezak/to'siq (bo'lmasa — chizilgan SVG) */
const PROPIMG = {house2:"p_house", poplar:"p_poplar", tree:"p_apple", blossom:"p_blossom", bush:"p_bush", flowerbed:"p_bush", sunflower:"p_bush", rock:"p_rock", lamp:"p_lamp", minaret:"p_mosque", city:"p_mosque", pine:"p_pine", palm:"p_palm"};
const pimg = key => window.imgURL ? imgSprite("pi_" + key, imgURL(key, true)) : null;
function propSprite(kind, v){
  const key = kind + v;
  if (kind === "palm") return sprite(key, PALM);
  if (kind === "city") return sprite(key, cityIcon([{dome:"#2E9BD6", wall:"#E9D2A6"},{dome:"#3BA3A0", wall:"#D9B98A"},{dome:"#2FB37E", wall:"#FFF1D6"}][v % 3]));
  if (["lamp","minaret","pine"].includes(kind)) return sprite(key, runObjSVG(kind));
  const o = {};
  if (kind === "house2"){ o.roof = ["#E5604D","#3D7FD6","#2FB37E","#F5A623","#9B5DE5"][v % 5]; o.wall = ["#F6E2B8","#FFF1D6","#FCE3EC","#E6F4FF"][v % 4]; }
  if (kind === "blossom") o.c = ["#FFB3D1","#FFFFFF","#FFC7E0","#F8A5C2"][v % 4];
  if (kind === "tree" && v % 2) o.fruit = 1;
  if (kind === "bush") o.berry = v % 2 ? 1 : 0;
  return sprite(key, objSVG(kind, o));
}
const hash = (n) => { n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3); n = n ^ (n >>> 4); n = Math.imul(n, 0x27d4eb2d); n = n ^ (n >>> 15); return (n >>> 0) / 4294967296; };

/* ---- tanga (yulduz) rasmi ---- */
let STAR = null;
function starImg(){
  if (STAR) return STAR; const c = document.createElement("canvas"); c.width = c.height = 96; const g = c.getContext("2d");
  const gr = g.createRadialGradient(36, 30, 6, 48, 48, 48); gr.addColorStop(0, "#FFF7C2"); gr.addColorStop(.5, "#FFD23F"); gr.addColorStop(1, "#E89A00");
  g.beginPath(); for (let i = 0; i < 10; i++){ const a = -Math.PI/2 + i * Math.PI / 5, r = i % 2 ? 20 : 44; g.lineTo(48 + Math.cos(a) * r, 50 + Math.sin(a) * r); } g.closePath();
  g.fillStyle = gr; g.fill(); g.lineWidth = 5; g.strokeStyle = "#C27C00"; g.stroke(); return STAR = c;
}

window.RUNNER = { start(o){ return new Run(o); } };

function Run(o){
  this.o = o; const host = this.host = o.host;
  const kids = o.age !== "teens";
  this.cfg = kids ? {v0:9, vmax:13.5, acc:.06, read:9, gap:8, slide:false} : {v0:11, vmax:17, acc:.08, read:7.5, gap:6.5, slide:true};
  this.T = THEMES[(o.unit.id - 1) % THEMES.length];
  host.innerHTML = `<canvas class="rcv"></canvas>
    <div class="rhud"><button class="rbtn" data-r="pause" aria-label="Pauza">❚❚</button>
      <span class="rhearts"></span><div class="rprog"><i></i><b></b></div><span class="rcoin">🪙 <b>0</b></span></div>
    <div class="rpow"></div>
    <div class="rask" hidden></div>
    <div class="rtoast" hidden></div><div class="rmodal" hidden></div>
    <div class="rhelp">${kids ? "👆 Chap / o'ng bosing · ⬆️ suring — sakrash" : "👆 Chap / o'ng · ⬆️ sakrash · ⬇️ egilish"}</div>`;
  this.cv = host.querySelector(".rcv"); this.ctx = this.cv.getContext("2d");
  this.$ = s => host.querySelector(s);
  /* qahramon rasmlari */
  this.hero = [0,1,2,3,"jump","slide"].map(p => sprite(`hero_${o.skin.id}_${p}`, heroBackSVG(o.gender, o.skin, p), 300));
  this.heroImg = window.imgURL ? imgSprite("himg_" + o.skin.id, imgURL(o.skin.id + "_back", true)) : null;
  this.heroRun = window.imgURL ? sheetSprite("hrun_" + o.skin.id, imgURL("run_" + o.skin.id, true)) : null;
  this.bgImg = window.imgURL ? imgSprite("bg_" + ((o.unit.id - 1) % 4), imgURL("bg_" + ((o.unit.id - 1) % 4), true)) : null;
  ["o_barrier","o_cart","o_bar","coin"].forEach(pimg); Object.values(PROPIMG).forEach(pimg);
  this.parts = []; this.lastDust = 0;
  this.objS = {barrier:sprite("ob_barrier", runObjSVG("barrier")), bar:sprite("ob_bar", runObjSVG("bar")), cart:sprite("ob_cart", runObjSVG("cart")),
    shield:sprite("pw_book", `<svg viewBox="0 0 40 40"><rect x="6" y="5" width="28" height="30" rx="3" fill="#2E8B57"/><rect x="9" y="8" width="22" height="24" rx="2" fill="none" stroke="#F2D16B" stroke-width="2"/><path d="M20 12 l2.2 4.4 4.8.6-3.5 3.3.9 4.8-4.4-2.3-4.4 2.3.9-4.8-3.5-3.3 4.8-.6z" fill="#F2D16B"/></svg>`),
    magnet:sprite("pw_mag", `<svg viewBox="0 0 40 40"><path d="M8 6 H16 V22 A4 4 0 0 0 24 22 V6 H32 V22 A12 12 0 0 1 8 22Z" fill="#E5484D"/><rect x="8" y="6" width="8" height="6" fill="#DDE3EA"/><rect x="24" y="6" width="8" height="6" fill="#DDE3EA"/></svg>`)};
  Object.values(this.T.props).forEach((k, i) => { for (let v = 0; v < 4; v++) propSprite(k, v); });
  /* holat */
  this.queue = o.qs.map(q => ({q, tries:0}));
  this.total = this.queue.length;
  this.p = {lane:0, x:0, y:0, vy:0, slide:0, z:0, v:this.cfg.v0, hearts:3, inv:0, mag:0, shield:false, coins:0, combo:0, frame:0, runT:0};
  this.stats = {correct:0, wrong:0, first:0, jumps:0, gates:0, coins:0, wrongQs:[], revived:false, crashes:0};
  this.objs = []; this.genZ = 30; this.curGate = null; this.paused = false; this.over = false; this.t0 = performance.now(); this.lastT = this.t0;
  this.shake = 0; this.flash = 0; this.camX = 0;
  this.fit(); this.bind(); this.drawHearts(); this.updProg();
  this.hold = true; this.last = performance.now(); this.loop = this.loop.bind(this); requestAnimationFrame(this.loop);
  this.countdown(() => { this.hold = false; this.last = performance.now(); });
  try { const tg = window.Telegram && Telegram.WebApp; tg && tg.disableVerticalSwipes && tg.disableVerticalSwipes(); } catch(e){}
}
const R = Run.prototype;
R.fit = function(){
  const r = this.host.getBoundingClientRect(), dpr = Math.min(this.dprMax || 1.5, devicePixelRatio || 1); this.dpr = dpr; this.bg = null;
  this.W = r.width; this.H = r.height; this.cv.width = r.width * dpr; this.cv.height = r.height * dpr; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  this.hy = this.H * .36; this.F = (this.H * .84 - this.hy) * CAMD / CAMH; this.cx = this.W / 2;
};
R.mkBg = function(){
  const W = this.W, H = this.H, T = this.T, c = document.createElement("canvas"), sc = Math.min(1.5, devicePixelRatio || 1); c.width = W * sc; c.height = H * sc;
  const g = c.getContext("2d"); g.scale(sc, sc);
  const sk = g.createLinearGradient(0, 0, 0, this.hy); sk.addColorStop(0, T.sky[0]); sk.addColorStop(1, T.sky[1]); g.fillStyle = sk; g.fillRect(0, 0, W, this.hy + 2);
  const sx = W * .78, sy = this.hy * .38, sg = g.createRadialGradient(sx, sy, 4, sx, sy, 70); sg.addColorStop(0, "rgba(255,250,210,1)"); sg.addColorStop(.35, "rgba(255,225,90,.95)"); sg.addColorStop(1, "rgba(255,225,90,0)");
  g.fillStyle = sg; g.beginPath(); g.arc(sx, sy, 70, 0, 7); g.fill();
  const BI = this.bgImg; this.bgHas = !!(BI && BI.ok);
  if (this.bgHas){ const bh = this.hy * 1.22, bw = Math.max(W * 1.15, bh * BI.ar); g.drawImage(BI.img, (W - bw) / 2, this.hy * 1.12 - bh, bw, bh); }
  const gg = g.createLinearGradient(0, this.hy, 0, H); gg.addColorStop(0, T.hor); gg.addColorStop(.12, T.grass); gg.addColorStop(1, T.grass2); g.fillStyle = gg; g.fillRect(0, this.hy, W, H - this.hy);
  this.bg = {c, w:W};
};
R.sfx = function(k){ try { this.o.sfx && this.o.sfx(k); } catch(e){} };
R.bind = function(){
  const h = this.host; let sx = 0, sy = 0, st = 0, moved = false;
  this.onKey = e => { if (this.over) return;
    if (e.key === "ArrowLeft" || e.key === "a") this.move(-1); else if (e.key === "ArrowRight" || e.key === "d") this.move(1);
    else if (e.key === "ArrowUp" || e.key === " " || e.key === "w") { e.preventDefault(); this.jump(); } else if (e.key === "ArrowDown" || e.key === "s") this.duck();
    else if (e.key === "Escape" || e.key === "p") this.pause(); };
  document.addEventListener("keydown", this.onKey);
  const cvs = this.cv;
  cvs.addEventListener("pointerdown", e => { sx = e.clientX; sy = e.clientY; st = performance.now(); moved = false; });
  cvs.addEventListener("pointermove", e => { if (moved || !st) return; const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 28 || Math.abs(dy) > 28){ moved = true; if (Math.abs(dx) > Math.abs(dy)) this.move(dx > 0 ? 1 : -1); else if (dy < 0) this.jump(); else this.duck(); } });
  cvs.addEventListener("pointerup", e => { if (!moved && st && performance.now() - st < 350){ if (e.clientY < this.H * .3) return; this.move(e.clientX < this.W / 2 ? -1 : 1); } st = 0; });
  h.querySelector('[data-r="pause"]').onclick = () => this.pause();
  this.onVis = () => { if (document.hidden && !this.paused && !this.over) this.pause(); };
  document.addEventListener("visibilitychange", this.onVis);
  this.onResize = () => this.fit(); addEventListener("resize", this.onResize);
};
R.destroy = function(){
  this.over = true; document.removeEventListener("keydown", this.onKey); document.removeEventListener("visibilitychange", this.onVis); removeEventListener("resize", this.onResize);
  try { const tg = window.Telegram && Telegram.WebApp; tg && tg.enableVerticalSwipes && tg.enableVerticalSwipes(); } catch(e){}
};
R.move = function(d){ if (this.paused || this.over || this.asking || this.lockLane) return; const n = Math.max(-1, Math.min(1, this.p.lane + d)); if (n !== this.p.lane){ this.p.lane = n; this.sfx("whoosh"); } };
R.jump = function(){ if (this.paused || this.over) return; const p = this.p; if (p.y <= .01){ p.vy = 9.6; p.slide = 0; this.stats.jumps++; this.sfx("jump"); const jq = this.P(p.x, 0, p.z); if (jq) this.burst(jq.x, jq.y, 10, {c:["rgba(240,225,195,.9)"], v:120, up:20, g:0, r:5, sq:false, dec:2}); } };
R.duck = function(){ if (this.paused || this.over) return; const p = this.p; if (p.y > .3) p.vy = -14; p.slide = .75; this.sfx("pop"); };
R.drawHearts = function(){ this.$(".rhearts").innerHTML = [0,1,2].map(i => `<i class="${i < this.p.hearts ? "on" : ""}">❤</i>`).join(""); };
R.updProg = function(){ const d = this.stats.correct; this.$(".rprog i").style.width = (d / this.total * 100) + "%"; this.$(".rprog b").textContent = `${d}/${this.total}`; };
R.toast = function(html, cls = "", ms = 2600){ const t = this.$(".rtoast"); t.className = "rtoast " + cls; t.innerHTML = html; t.hidden = false; clearTimeout(this._tt); this._tt = setTimeout(() => t.hidden = true, ms); };
R.countdown = function(cb){
  const m = this.$(".rmodal"); let n = 3; m.hidden = false; m.className = "rmodal cd";
  const tick = () => { if (this.over) return; if (n === 0){ m.innerHTML = `<b class="go">YUGUR!</b>`; this.sfx("fanfare"); setTimeout(() => { m.hidden = true; cb(); }, 450); return; }
    m.innerHTML = `<b>${n}</b>`; this.sfx("tap"); n--; setTimeout(tick, 650); };
  tick();
};
R.pause = function(){
  if (this.paused || this.over || this.hold || this.asking) return; this.paused = true;
  const m = this.$(".rmodal"); m.hidden = false; m.className = "rmodal";
  m.innerHTML = `<div class="rcard"><h3>Pauza</h3><p>${this.o.unit.icon} ${this.o.unit.title}</p><button class="gbtn go big" data-a="go">Davom etish</button><button class="gbtn big" data-a="quit">Chiqish</button></div>`;
  m.querySelector('[data-a="go"]').onclick = () => { m.hidden = true; this.hold = true; this.paused = false; this.countdown(() => this.resume()); };
  m.querySelector('[data-a="quit"]').onclick = () => { m.hidden = true; this.end(false, true); };
};
R.resume = function(){ this.paused = false; this.hold = false; this.last = performance.now(); };

/* ---- yo'l mazmunini yaratish ---- */
R.gen = function(){
  const p = this.p, c = this.cfg;
  while (this.genZ < p.z + FAR){
    if (this.pendingFinish) break;
    if (!this.queue.length){ if (!this.objs.some(o => o.t === "gate") && !this.pendingFinish){ this.objs.push({t:"finish", z:this.genZ + 25, lane:0}); this.pendingFinish = true; } break; }
    /* oddiy qism: to'siqlar va tangalar */
    const segLen = p.v * c.gap, start = this.genZ, end = start + segLen;
    let z = start + 14;
    while (z < end - 10){
      const r = Math.random();
      if (r < .55){ /* to'siq */
        const kinds = c.slide ? ["barrier","barrier","bar","cart"] : ["barrier","barrier","cart"];
        const t = kinds[Math.floor(Math.random() * kinds.length)];
        const lanes = [-1,0,1].sort(() => Math.random() - .5).slice(0, Math.random() < .4 ? 2 : 1);
        lanes.forEach(l => this.objs.push({t, lane:l, z}));
        const free = [-1,0,1].find(l => !lanes.includes(l));
        if (Math.random() < .7) for (let i = 0; i < 5; i++) this.objs.push({t:"coin", lane:free, z:z - 6 + i * 3, y:0});
        if (t === "barrier" && Math.random() < .5) for (let i = 0; i < 5; i++) this.objs.push({t:"coin", lane:lanes[0], z:z - 4 + i * 2, y:Math.sin(i / 4 * Math.PI) * 1.6 + .4});
        z += 16 + Math.random() * 12;
      } else if (r < .85){ /* tanga qatori */
        const l = Math.floor(Math.random() * 3) - 1; for (let i = 0; i < 8; i++) this.objs.push({t:"coin", lane:l, z:z + i * 2.6, y:0}); z += 26;
      } else { /* kuchaytirgich */
        this.objs.push({t:Math.random() < .5 ? "magnet" : "shield", lane:Math.floor(Math.random() * 3) - 1, z, y:.6}); z += 14;
      }
    }
    /* savol darvozasi: oldidan bo'sh yo'l (o'qish uchun) */
    const item = this.queue.shift();
    for (let i = 0; i < 6; i++) this.objs.push({t:"coin", lane:Math.floor(i / 2) - 1, z:end + 6 + i * 3, y:0});
    const g = {t:"gate", z:end + 40, item, lane:0};
    g.opts = this.buildOpts(item.q);
    this.objs.push(g);
    this.genZ = g.z + 6;
  }
};
const SQ = q => q.s || q;             /* bolalar uchun qisqa variant */
const icon = t => { const m = /^(\S+)\s/.exec(t || ""); return m && !/[A-Za-z0-9]/.test(m[1]) ? m[1] : ""; };
R.buildOpts = function(q){
  if (q.t === "tf") return [{t:"To'g'ri", ok:q.a === true, c:"#27AE60", L:"✓"}, null, {t:"Noto'g'ri", ok:q.a === false, c:"#EB5757", L:"✗"}];
  const O = SQ(q).o || q.o;
  const wrong = O.map((t, i) => ({t, ok:i === q.a})).filter(x => !x.ok).sort(() => Math.random() - .5).slice(0, 2);
  return [{t:O[q.a], ok:true}, ...wrong].sort(() => Math.random() - .5).map((x, i) => Object.assign(x, {c:LANEC[i], L:LETTER[i], t:icon(x.t) ? x.t.replace(/^\S+\s+/, "") : x.t}));
};
/* savol: qahramon to'xtaydi, bola bemalol o'qiydi va katta tugmani bosadi */
R.ask = function(g){
  this.asking = g; const q = g.item.q, S2 = SQ(q), box = this.$(".rask");
  const n = this.stats.correct + 1;
  box.innerHTML = `<div class="rsheet"><small class="eb">❓ Savol ${Math.min(n, this.total)}/${this.total}</small><h3>${S2.q}</h3>
    <div class="rbtns ${q.t === "tf" ? "tf" : ""}">${g.opts.map((x, i) => x ? `<button style="--c:${x.c}" data-i="${i}"><span class="ri">${x.L}</span><span>${x.t}</span></button>` : "").join("")}</div>
    <p class="rtip">Javobni bosing — qahramon o'sha darvozadan yugurib o'tadi</p></div>`;
  box.hidden = false; box.classList.remove("out"); void box.offsetWidth; box.classList.add("in");
  this.sfx("open");
  box.querySelectorAll("button[data-i]").forEach(b => b.onclick = e => {
    e.stopPropagation(); if (this.asking !== g) return;
    const i = +b.dataset.i; b.classList.add("pick"); this.sfx("tap"); window.FX && FX.burst(b, {n:16, r:80});
    g.answered = true; this.lockLane = g; this.p.lane = i - 1;
    setTimeout(() => { box.classList.add("out"); setTimeout(() => box.hidden = true, 250); this.asking = null; this.p.v = 7; this.last = performance.now(); }, 280);
  });
};
/* ---- asosiy sikl ---- */
R.loop = function(now){
  if (this.over) return;
  if (!document.body.contains(this.host)){ this.destroy(); return; }
  const dt = Math.min(.05, (now - this.last) / 1000); this.last = now;
  if (!this.paused && !this.hold && !this.asking){ const n = window.__RUNSPEED || 1; for (let i = 0; i < n && !this.asking && !this.paused; i++) this.step(dt); }
  const t0 = performance.now(); this.draw(now / 1000);
  /* sekin telefonda tasvir aniqligini avtomatik pasaytirish (kadrlar oralig'i bo'yicha) */
  if (!this.paused && !this.hold && document.hasFocus !== undefined){ this.fi = (this.fi || 16) * .94 + Math.min(80, dt * 1000) * .06; this.fc = (this.fc || 0) + 1; }
  if (this.fc > 24 && this.fi > 20 && this.dpr > 1){ this.dprMax = Math.max(1, this.dpr - .5); this.fit(); this.fc = 0; this.fi = 16; }
  else if (this.fc > 70 && this.fi > 26 && this.dpr <= 1 && !this.lowQ){ this.lowQ = true; this.dprMax = .85; this.fit(); this.fc = 0; }
  requestAnimationFrame(this.loop);
};
R.step = function(dt){
  const p = this.p, c = this.cfg;
  p.runT += dt;
  let vT = Math.min(c.vmax, c.v0 + p.runT * c.acc);
  /* oldindagi darvoza: sekinlashib, undan 7 m oldin to'xtaymiz */
  const gate = this.objs.find(o => o.t === "gate" && !o.answered && !o.passed);
  let stopNow = false;
  if (gate){ const dist = gate.z - 15 - p.z; this.curGate = dist < 45 ? gate : null;
    /* to'liq tezlikda yugurib, faqat oxirgi ~3 m da tez tormoz (uzoq «sudralish» yo'q) */
    if (dist < 45){ const vb = Math.sqrt(2 * 11 * Math.max(0, dist)); if (vb < vT){ vT = vb; p.v = Math.min(p.v, vb + .5); } if (dist <= .35){ stopNow = true; } } }
  p.v += (vT - p.v) * Math.min(1, dt * 2);
  if (stopNow){ p.v = 0; p.vy = Math.min(0, p.vy); this.ask(gate); }
  p.z += p.v * dt;
  p.x += (p.lane * LW - p.x) * Math.min(1, dt * 14);
  p.vy -= 26 * dt; p.y = Math.max(0, p.y + p.vy * dt); if (p.y === 0 && p.vy < 0) p.vy = 0;
  p.slide = Math.max(0, p.slide - dt); p.inv = Math.max(0, p.inv - dt); p.mag = Math.max(0, p.mag - dt);
  p.frame += dt * p.v * .9;
  this.shake = Math.max(0, this.shake - dt * 3); this.flash = Math.max(0, this.flash - dt * 2.5);
  this.camX += (p.x * .65 - this.camX) * Math.min(1, dt * 6);
  this.gen();
  this.updPow();
  const pz = p.z;
  for (let i = this.objs.length - 1; i >= 0; i--){
    const o = this.objs[i];
    if (o.dead){ continue; }
    const dz = o.z - pz;
    if (o.t === "coin" && p.mag > 0 && dz < 12 && dz > -1 && o.mx == null){ o.mx = (o.lane || 0) * LW; o.lane = null; }
    if (dz < -8){ this.objs.splice(i, 1); continue; }
    if (Math.abs(dz) > .7 && !(o.t === "gate" || o.t === "finish")) continue;
    const sameLane = o.lane === null || Math.abs((o.lane * LW) - p.x) < LW * .55;
    switch (o.t){
      case "coin": if (Math.abs(dz) < .9 && (sameLane || p.mag > 0) && Math.abs(p.y - (o.y || 0)) < 1.4){ o.dead = true; p.coins++; this.stats.coins++; { const cq = this.P(p.x, 1.1, p.z + .5); if (cq) this.burst(cq.x, cq.y - 30, 5, {c:["#FFE066","#FFF6C2","#FFB800"], v:140, up:160, r:3.5, sq:false}); } this.$(".rcoin b").textContent = p.coins; if (p.coins % 3 === 0) this.sfx("coin"); } break;
      case "shield": case "magnet": if (Math.abs(dz) < .9 && sameLane){ o.dead = true; if (o.t === "shield"){ p.shield = true; this.toast("📗 <b>Ilm qalqoni!</b> Bir marta to'siqdan saqlaydi", "good", 1800); } else { p.mag = 10; this.toast("🧲 <b>Magnit!</b> Tangalar o'zi keladi", "good", 1800); } this.sfx("star"); } break;
      case "barrier": if (sameLane && p.y < .9) this.hit(o); break;
      case "bar": if (sameLane && p.slide <= 0) this.hit(o); break;
      case "cart": if (sameLane) this.hit(o); break;
      case "gate": if (dz <= 0 && !o.passed){ o.passed = true; this.passGate(o); } break;
      case "finish": if (dz <= 0 && !o.passed){ o.passed = true; this.end(true); } break;
    }
  }
};
R.hit = function(o){
  const p = this.p; if (p.inv > 0 || o.dead) return;
  o.dead = true; this.shake = 1;
  if (p.shield){ p.shield = false; p.inv = 1; this.sfx("pop"); this.toast("📗 Qalqon seni saqladi!", "good", 1400); return; }
  { const hq = this.P(p.x, 1, p.z); if (hq) this.burst(hq.x, hq.y - 40, 18, {c:["#FF4D6D","#FFD23F","#fff"], v:260, up:80}); }
  p.hearts--; p.inv = 1.6; this.flash = 1; this.stats.crashes++; this.drawHearts(); this.sfx("bad");
  try { navigator.vibrate && navigator.vibrate(120); } catch(e){}
  if (p.hearts <= 0) this.fall();
};
R.passGate = function(g){
  const p = this.p, opt = g.opts[p.lane + 1], q = g.item.q, S2 = SQ(q); this.curGate = null; this.lockLane = null;
  this.stats.gates++;
  if (opt && opt.ok){
    this.stats.correct++; if (g.item.tries === 0) this.stats.first++; p.combo++;
    const bonus = 5 + Math.min(5, p.combo - 1); p.coins += bonus; this.stats.coins += bonus; this.$(".rcoin b").textContent = p.coins;
    this.sfx("ok"); setTimeout(() => this.sfx("star"), 150); this.updProg();
    { const gq = this.P(p.lane * LW, 2.6, p.z + 1.2) || {x:this.W / 2, y:this.H * .4}; this.burst(gq.x, gq.y, 46, {v:380, up:220}); this.ring(gq.x, gq.y); this.ring(this.W / 2, this.H * .7, "#7CF29A"); }
    this.toast(`<b>${p.combo >= 2 ? `Zo'r! ×${p.combo}` : ["Barakalla!","Ofarin!","To'g'ri!","Mashaalloh!"][Math.floor(Math.random()*4)]} +${bonus} 🪙</b><small>${S2.e}</small>`, "good", 2600);
  } else {
    this.stats.wrong++; p.combo = 0; g.item.tries++;
    if (!this.stats.wrongQs.includes(q)) this.stats.wrongQs.push(q);
    this.queue.push(g.item);
    if (!opt){ this.hit({}); if (this.p.hearts <= 0) return; }
    else this.sfx("bad");
    const right = q.t === "tf" ? (q.a ? "✅ To'g'ri" : "❌ Noto'g'ri") : (S2.o || q.o)[q.a];
    this.paused = true;
    const m = this.$(".rmodal"); m.hidden = false; m.className = "rmodal";
    m.innerHTML = `<div class="rcard wrong center"><div class="rbig">🤔</div><h3>${S2.q}</h3>
      <small class="eb" style="color:#1D8A54">To'g'ri javob</small><p class="rans rbigans">${right}</p><p class="rex">${S2.e}</p>
      ${q.k ? `<details class="kitob"><summary>📖 Kitobdan o'qish</summary><blockquote>«${q.k}»<cite>«${BOOK.meta.title}», ${q.p}-bet</cite></blockquote></details>` : ""}
      <button class="gbtn go big" data-a="go">Tushundim 👍</button><small class="muted">Bu savol yana chiqadi</small></div>`;
    m.querySelector('[data-a="go"]').onclick = () => { m.hidden = true; this.hold = true; this.paused = false; this.countdown(() => this.resume()); };
  }
};
R.fall = function(){
  this.paused = true; this.flash = 0; this.shake = 0; const p = this.p, can = !this.stats.revived && (this.o.coins || 0) + p.coins >= 20;
  const m = this.$(".rmodal"); m.hidden = false; m.className = "rmodal";
  m.innerHTML = `<div class="rcard"><div class="rbig">💫</div><h3>Yiqildingiz!</h3><p>To'g'ri javoblar: <b>${this.stats.correct}/${this.total}</b></p>
    ${can ? `<button class="gbtn go big" data-a="rev">Davom etish — 20 🪙</button>` : ""}<button class="gbtn big" data-a="end">Natijani ko'rish</button></div>`;
  const rv = m.querySelector('[data-a="rev"]');
  if (rv) rv.onclick = () => { this.stats.revived = true; this.stats.reviveCost = 20; p.hearts = 3; p.inv = 2.5; this.drawHearts(); m.hidden = true; this.sfx("star"); this.hold = true; this.paused = false; this.countdown(() => this.resume()); };
  m.querySelector('[data-a="end"]').onclick = () => { m.hidden = true; this.end(false); };
};
R.end = function(done, quit){
  if (this.over) return; this.destroy();
  this.sfx(done ? "levelup" : "pop");
  const s = this.stats; s.done = done; s.quit = !!quit; s.coinsRun = this.p.coins; s.total = this.total;
  setTimeout(() => this.o.onEnd && this.o.onEnd(s), done ? 700 : 100);
};
R.updPow = function(){
  const p = this.p, el = this.$(".rpow");
  const html = (p.shield ? `<span>📗</span>` : "") + (p.mag > 0 ? `<span>🧲 ${Math.ceil(p.mag)}</span>` : "");
  if (el._h !== html){ el._h = html; el.innerHTML = html; }
};

/* ---- chizish ---- */
R.P = function(x, y, z){ const zc = z - (this.p.z - CAMD); if (zc < .6) return null; const s = this.F / zc; return {x:this.cx + (x - this.camX) * s, y:this.hy + (CAMH - y) * s, s, zc}; };
R.draw = function(t){
  const g = this.ctx, W = this.W, H = this.H, T = this.T, p = this.p;
  g.save();
  if (this.shake > 0) g.translate((Math.random() - .5) * 14 * this.shake, (Math.random() - .5) * 10 * this.shake);
  /* osmon va yer (oldindan chizilgan fon) */
  if (!this.bg || this.bg.w !== W || (!this.bgHas && this.bgImg && this.bgImg.ok)) this.mkBg();
  g.drawImage(this.bg.c, 0, 0, W, H);
  if (!this.bgHas){
  /* bulutlar */
  g.fillStyle = "rgba(255,255,255,.9)"; g.beginPath();
  for (let i = 0; i < 4; i++){ const cx = ((i * 260 + t * 8 - this.camX * 4) % (W + 300) + W + 300) % (W + 300) - 150, cy = this.hy * (.15 + i % 2 * .18);
    g.moveTo(cx + 52, cy + 10); g.ellipse(cx, cy + 10, 52, 15, 0, 0, 7); g.moveTo(cx + 2, cy + 2); g.arc(cx - 16, cy + 2, 18, 0, 7); g.moveTo(cx + 36, cy - 4); g.arc(cx + 12, cy - 4, 24, 0, 7); }
  g.fill();
  /* uzoq tog'lar/adirlar */
  const rd = T.ridge; g.fillStyle = rd[1];
  g.beginPath(); g.moveTo(-10, this.hy + 2);
  for (let x = -10; x <= W + 10; x += 24){ const xx = x + this.camX * 3; g.lineTo(x, this.hy - (rd[0] === "mount" ? 36 + Math.abs(Math.sin(xx * .011)) * 46 : 18 + Math.sin(xx * .013) * 12 + Math.sin(xx * .031) * 6)); }
  g.lineTo(W + 10, this.hy + 2); g.closePath(); g.fill();
  }
  /* yo'l: asosiy shakl bitta, chiziqlar esa bir yo'l (path) ichida */
  const camZ = p.z - CAMD, SEG = 3, z0 = Math.floor(camZ / SEG) * SEG, RW = LW * 1.5, cw = .45, zn = camZ + .7;
  const quad = (x1, x2, za, zb) => { const a = this.P(x1, 0, zb), b = this.P(x2, 0, zb), c = this.P(x2, 0, za), d = this.P(x1, 0, za); if (!a || !c) return; g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(c.x, c.y); g.lineTo(d.x, d.y); g.closePath(); };
  const zf = camZ + FAR;
  g.fillStyle = T.curb2 || "#E8D9BF"; g.beginPath(); quad(-RW - cw, RW + cw, zn, zf); g.fill();
  g.fillStyle = T.road2; g.beginPath(); quad(-RW, RW, zn, zf); g.fill();
  const odds = []; for (let z = z0 + SEG * 2; z > zn; z -= SEG){ if (Math.floor(z / SEG) % 2 === 0) odds.push(z); }
  for (let z = z0 + 120; z > z0 + SEG * 2; z -= SEG){ if (Math.floor(z / SEG) % 2 === 0) odds.push(z); }
  /* o't chiziqlari (yaqinda) */
  g.fillStyle = "rgba(0,60,0,.07)"; g.beginPath(); for (const z of odds) if (z - camZ < 80){ quad(-40, -RW - cw, Math.max(z - SEG, zn), z); quad(RW + cw, 40, Math.max(z - SEG, zn), z); } g.fill();
  g.fillStyle = T.curb; g.beginPath(); for (const z of odds){ quad(-RW - cw, -RW, Math.max(z - SEG, zn), z); quad(RW, RW + cw, Math.max(z - SEG, zn), z); } g.fill();
  g.fillStyle = T.road; g.beginPath(); for (const z of odds) quad(-RW, RW, Math.max(z - SEG, zn), z); g.fill();
  g.fillStyle = "rgba(255,255,255,.75)"; g.beginPath(); for (const z of odds) if (z - camZ < 100) for (const lx of [-LW/2, LW/2]) quad(lx - .08, lx + .08, Math.max(z - SEG * .6, zn), z); g.fill();
  /* ufqdagi tuman */
  const fg = g.createLinearGradient(0, this.hy, 0, this.hy + 26); fg.addColorStop(0, "rgba(255,255,255,.75)"); fg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = fg; g.fillRect(0, this.hy - 2, W, 28);
  /* sahna obyektlari: bezaklar + yo'ldagilar, uzoqdan yaqinga */
  const list = [];
  const PS = 10, pi0 = Math.floor(camZ / PS);
  for (let i = pi0 + Math.floor(FAR / PS); i >= pi0; i--){
    for (const side of [-1, 1]){
      const h1 = hash(i * 7 + (side > 0 ? 3 : 0) + this.o.unit.id * 1000);
      if (h1 < .15) continue;
      const kind = T.props[Math.floor(h1 * 997) % T.props.length], v = Math.floor(h1 * 53) % 4;
      const x = side * (RW + 2.6 + (hash(i * 13 + side) * 9)), z = i * PS + hash(i * 31 + side) * 6;
      list.push({k:"prop", kind, v, x, z});
      if (hash(i * 17 + side) > .55){ const k2 = ["bush","flowerbed","rock"][Math.floor(hash(i * 5 + side) * 3)]; list.push({k:"prop", kind:T.props.includes("pine") && k2 === "flowerbed" ? "rock" : k2, v, x:side * (RW + 1.4 + hash(i * 3) * 1.2), z:z + 4}); }
    }
  }
  for (const o of this.objs) if (!o.dead || o.t === "gate" || o.t === "finish") list.push({k:"obj", o, z:o.z});
  list.push({k:"hero", z:p.z});
  list.sort((a, b) => b.z - a.z);
  for (const it of list){
    if (it.k === "prop"){ const pi = PROPIMG[it.kind] && pimg(PROPIMG[it.kind]); this.drawSprite(pi && pi.ok ? pi : propSprite(it.kind, it.v), it.x, 0, it.z, (pi && pi.ok ? PROPHI[it.kind] : PROPH[it.kind]) || 4); }
    else if (it.k === "hero") this.drawHero(t);
    else this.drawObj(it.o, t);
  }
  g.restore();
  /* tezlik chiziqlari */
  if (p.v > 11.5 && !this.asking){ g.strokeStyle = "rgba(255,255,255,.45)"; g.lineWidth = 2; const n = Math.floor((p.v - 11) * 1.4);
    for (let i = 0; i < n; i++){ const a = hash(Math.floor(t * 20) * 31 + i) * Math.PI * 2, r0 = Math.max(W, H) * (.45 + hash(i * 7 + Math.floor(t * 20)) * .2);
      g.beginPath(); g.moveTo(W / 2 + Math.cos(a) * r0, this.hy + Math.sin(a) * r0); g.lineTo(W / 2 + Math.cos(a) * (r0 + 60), this.hy + Math.sin(a) * (r0 + 60)); g.stroke(); } }
  /* oyoq ostidan chang */
  const fq = this.P(p.x, 0, p.z);
  if (fq && p.v > 3 && p.y <= .05 && t - this.lastDust > .09){ this.lastDust = t; this.parts.push({dust:true, x:fq.x + (Math.random() - .5) * 20, y:fq.y - 4, vx:(Math.random() - .5) * 40, vy:30 + Math.random() * 30, g:0, life:.8, dec:1.6, r:5 + Math.random() * 4, c:"rgba(240,225,195,.8)"}); }
  this.drawParts(Math.min(.05, t - (this._pt || t))); this._pt = t;
  if (this.flash > 0){ g.fillStyle = `rgba(255,60,60,${this.flash * .35})`; g.fillRect(0, 0, W, H); }
  if (p.mag > 0){ g.strokeStyle = `rgba(255,80,80,${.25 + Math.sin(t * 8) * .1})`; g.lineWidth = 6; g.strokeRect(3, 3, W - 6, H - 6); }
};
R.fog = function(zc){ return Math.max(0, Math.min(1, (FAR - zc) / 45)); };
/* kameraga juda yaqinlashgan katta narsa (darvoza, marra) ekranni to'sib qolmasin — sekin yo'qoladi */
R.near = function(zc, a = 5.8, b = 3.4){ return Math.max(0, Math.min(1, (zc - a) / b)); };
R.drawSprite = function(s, x, y, z, hm, extra){
  if (!s || !s.ok) return; const q = this.P(x, y, z); if (!q || q.zc > FAR) return;
  const h = hm * q.s, w = h * s.ar; if (q.x + w < -50 || q.x - w > this.W + 50) return;
  const g = this.ctx, al = this.fog(q.zc) * this.near(q.zc, 1.4, 1.6); if (al <= .02) return q; g.globalAlpha = al;
  g.drawImage(pick(s, h * this.dpr), q.x - w / 2, q.y - h, w, h); g.globalAlpha = 1; return q;
};
R.shadow = function(x, z, r){ const q = this.P(x, 0, z); if (!q) return; const g = this.ctx; g.fillStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.ellipse(q.x, q.y, r * q.s, r * q.s * .3, 0, 0, 7); g.fill(); };
R.drawObj = function(o, t){
  const g = this.ctx, x = (o.mx != null ? o.mx : (o.lane || 0) * LW);
  switch (o.t){
    case "coin": {
      if (o.mx != null){ o.mx += (this.p.x - o.mx) * .25; o.z += (this.p.z + .2 - o.z) * .25; }
      const q = this.P(x, (o.y || 0) + .9, o.z); if (!q) return; const r = .45 * q.s, sc = Math.abs(Math.cos(t * 5 + o.z * .3));
      const ci = pimg("coin"), cimg = ci && ci.ok ? pick(ci, r * 2 * this.dpr) : starImg();
      g.globalAlpha = this.fog(q.zc); g.drawImage(cimg, q.x - r * Math.max(.25, sc), q.y - r, r * 2 * Math.max(.25, sc), r * 2); g.globalAlpha = 1; break; }
    case "barrier": { this.shadow(x, o.z, 1.1); const im = pimg("o_barrier"); this.drawSprite(im && im.ok ? im : this.objS.barrier, x, 0, o.z, im && im.ok ? 1.1 : 1.15); break; }
    case "bar": { const im = pimg("o_bar"); this.drawSprite(im && im.ok ? im : this.objS.bar, x, 0, o.z, 2.7); break; }
    case "cart": { this.shadow(x, o.z, 1.2); const im = pimg("o_cart"); this.drawSprite(im && im.ok ? im : this.objS.cart, x, 0, o.z, im && im.ok ? 1.9 : 2.0); break; }
    case "shield": case "magnet": { const bob = Math.sin(t * 4) * .15; this.shadow(x, o.z, .5);
      const q = this.P(x, 1.1 + bob, o.z); if (q){ g.fillStyle = "rgba(255,255,200,.55)"; g.beginPath(); g.arc(q.x, q.y, .75 * q.s, 0, 7); g.fill(); }
      this.drawSprite(this.objS[o.t], x, .7 + bob, o.z, .9); break; }
    case "gate": this.drawGate(o, t); break;
    case "finish": this.drawFinish(o, t); break;
  }
};
R.drawGate = function(o, t){
  const g = this.ctx;
  for (let i = 0; i < 3; i++){
    const opt = o.opts[i], cx = (i - 1) * LW, L = this.P(cx - LW * .48, 0, o.z), Rr = this.P(cx + LW * .48, 0, o.z), top = this.P(cx, 3.1, o.z);
    if (!L || !top) continue; const al = this.fog(L.zc) * this.near(L.zc); if (al <= .02) continue; g.globalAlpha = al;
    const pw = .16 * L.s, w = Rr.x - L.x, ph = .95 * L.s;
    if (!opt){ /* devor */
      const wt = this.P(cx, 2.2, o.z); g.fillStyle = "#B5653A"; g.fillRect(L.x, wt.y, w, L.y - wt.y);
      g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = Math.max(1, .04 * L.s);
      for (let r = 0; r < 4; r++){ const yy = wt.y + (L.y - wt.y) * r / 4; g.beginPath(); g.moveTo(L.x, yy); g.lineTo(Rr.x, yy); g.stroke(); }
      g.globalAlpha = 1; continue; }
    const passed = o.passed, sel = !passed && this.p.lane === i - 1 && this.curGate === o;
    g.fillStyle = "#5A3A22"; g.fillRect(L.x, top.y, pw, L.y - top.y); g.fillRect(Rr.x - pw, top.y, pw, L.y - top.y);
    g.fillStyle = opt.c; const r8 = .2 * L.s;
    g.beginPath(); g.roundRect ? g.roundRect(L.x - pw * .4, top.y - ph * .2, w + pw * .8, ph, r8) : g.rect(L.x - pw * .4, top.y - ph * .2, w + pw * .8, ph); g.fill();
    if (sel){ g.strokeStyle = "#FFF6A8"; g.lineWidth = Math.max(2, .09 * L.s); g.stroke(); }
    g.fillStyle = "#fff"; g.font = `900 ${Math.max(9, .72 * L.s)}px "Baloo 2",system-ui,sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(opt.L, L.x + w / 2, top.y - ph * .2 + ph / 2);
    /* nur pardasi */
    g.fillStyle = passed ? "rgba(255,255,255,.08)" : `rgba(255,255,255,${.16 + Math.sin(t * 5 + i) * .06})`; g.fillRect(L.x + pw, top.y + ph * .8, w - pw * 2, L.y - top.y - ph * .8);
    g.globalAlpha = 1;
  }
};
R.drawFinish = function(o, t){
  const g = this.ctx, L = this.P(-LW * 1.6, 0, o.z), Rr = this.P(LW * 1.6, 0, o.z), top = this.P(0, 4.4, o.z); if (!L || !top) return;
  { const al = this.fog(L.zc) * this.near(L.zc); if (al <= .02) return; g.globalAlpha = al; } const pw = .3 * L.s;
  g.fillStyle = "#E5484D"; g.fillRect(L.x, top.y, pw, L.y - top.y); g.fillRect(Rr.x - pw, top.y, pw, L.y - top.y);
  const bh = 1.1 * L.s; for (let i = 0; i < 16; i++){ g.fillStyle = (i % 2) ? "#111" : "#fff"; g.fillRect(L.x + (Rr.x - L.x) * i / 16, top.y, (Rr.x - L.x) / 16 + 1, bh / 2); g.fillStyle = (i % 2) ? "#fff" : "#111"; g.fillRect(L.x + (Rr.x - L.x) * i / 16, top.y + bh / 2, (Rr.x - L.x) / 16 + 1, bh / 2); }
  g.fillStyle = "#FFD23F"; g.font = `900 ${Math.max(10, .9 * L.s)}px system-ui,sans-serif`; g.textAlign = "center"; g.textBaseline = "top"; g.fillText("MARRA", (L.x + Rr.x) / 2, top.y + bh + .1 * L.s);
  g.globalAlpha = 1;
};
R.drawHero = function(t){
  const p = this.p, g = this.ctx;
  if (p.inv > 0 && p.inv < 2.6 && Math.floor(t * 12) % 2) return;
  this.shadow(p.x, p.z, .65 - Math.min(.3, p.y * .12));
  const q = this.P(p.x, p.y, p.z); if (!q) return;
  const tilt = (p.lane * LW - p.x) * -.05;
  const HI = this.heroImg, RS = this.heroRun;
  if (RS && RS.ok){
    const run = p.v > .6 && p.y <= .05 && p.slide <= 0, n = RS.frames.length;
    const fr = RS.frames[run ? Math.floor(p.frame * 1.6) % n : (p.y > .05 ? 1 % n : 0)];
    let sx = 1, sy = 1, rot = tilt;
    if (p.y > .05){ rot += p.vy > 0 ? -.05 : .04; sy = 1.03; }
    if (p.slide > 0){ sy = .58; sx = 1.15; }
    if (!run && p.y <= .05 && p.slide <= 0){ sy = 1 + Math.sin(t * 3) * .015; }
    const h = 1.9 * fr.hr * q.s, w = h * fr.ar, bob = run ? Math.abs(Math.sin(p.frame * 1.6 * Math.PI / 2)) * .06 * q.s : 0;
    g.save(); g.translate(q.x, q.y - bob); g.rotate(rot); g.scale(sx, sy);
    if (p.shield){ g.strokeStyle = `rgba(80,200,120,${.5 + Math.sin(t * 6) * .2})`; g.lineWidth = 4; g.beginPath(); g.ellipse(0, -h * .5, w * .7, h * .58, 0, 0, 7); g.stroke(); }
    g.drawImage(pick(fr, h * this.dpr), -w / 2, -h, w, h); g.restore();
    return;
  }
  if (HI && HI.ok){
    /* rasmli qahramon: qadam sayin ko'zgu (oyoqlar almashadi), sakrash, egilish */
    const run = p.v > .6 && p.y <= .05 && p.slide <= 0, ph = p.frame * Math.PI;
    const bob = run ? Math.abs(Math.sin(ph)) * .1 : 0, flip = run && Math.floor(p.frame) % 2 ? -1 : 1;
    let sx = 1, sy = 1, rot = tilt + (run ? Math.sin(ph) * .04 : 0);
    if (p.y > .05){ sy = 1.05; sx = .96; rot += p.vy > 0 ? -.06 : .04; }
    if (p.slide > 0){ sy = .58; sx = 1.15; }
    if (!run && p.y <= .05 && p.slide <= 0){ sy = 1 + Math.sin(t * 3) * .015; }
    const h = 1.85 * q.s, w = h * HI.ar;
    g.save(); g.translate(q.x, q.y - bob * q.s); g.rotate(rot); g.scale(sx * flip, sy);
    if (p.shield){ g.strokeStyle = `rgba(80,200,120,${.5 + Math.sin(t * 6) * .2})`; g.lineWidth = 4; g.beginPath(); g.ellipse(0, -h * .5, w * .7, h * .58, 0, 0, 7); g.stroke(); }
    g.drawImage(HI.img, -w / 2, -h, w, h); g.restore();
    return;
  }
  const pose = p.slide > 0 ? 5 : p.y > .05 ? 4 : p.v < .6 ? 0 : Math.floor(p.frame) % 4;
  const s = this.hero[pose]; if (!s.ok) return;
  const h = 1.75 * q.s, w = h * s.ar;
  g.save(); g.translate(q.x, q.y); g.rotate(tilt);
  if (p.shield){ g.strokeStyle = `rgba(80,200,120,${.5 + Math.sin(t * 6) * .2})`; g.lineWidth = 4; g.beginPath(); g.ellipse(0, -h * .5, w * .62, h * .58, 0, 0, 7); g.stroke(); }
  g.drawImage(s.img, -w / 2, -h, w, h); g.restore();
};
/* ---- effektlar: zarrachalar (ekran koordinatasida) ---- */
R.burst = function(x, y, n, o = {}){
  const cols = o.c || ["#FFD23F","#FF6B9A","#5BD1FF","#7CF29A","#B388FF","#FF9F43","#fff"];
  if (this.parts.length > 260) return;
  for (let i = 0; i < n; i++){ const a = Math.random() * Math.PI * 2, v = (o.v || 260) * (.3 + Math.random() * .8);
    this.parts.push({x, y, vx:Math.cos(a) * v, vy:Math.sin(a) * v - (o.up || 120), g:o.g == null ? 520 : o.g, life:1, dec:o.dec || (1.1 + Math.random() * .6), r:(o.r || 5) * (.6 + Math.random() * .8), c:cols[i % cols.length], sq:o.sq !== false && Math.random() < .5, rot:Math.random() * 6}); }
};
R.ring = function(x, y, c = "#FFF6A8"){ this.parts.push({ring:true, x, y, life:1, dec:1.6, r:10, c}); };
R.drawParts = function(dt){
  const g = this.ctx;
  for (let i = this.parts.length - 1; i >= 0; i--){ const q = this.parts[i];
    q.life -= dt * q.dec; if (q.life <= 0){ this.parts.splice(i, 1); continue; }
    if (q.ring){ q.r += dt * 520; g.globalAlpha = q.life * .8; g.strokeStyle = q.c; g.lineWidth = 6 * q.life; g.beginPath(); g.arc(q.x, q.y, q.r, 0, 7); g.stroke(); continue; }
    q.vy += q.g * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.rot += dt * 8;
    g.globalAlpha = Math.min(1, q.life * 1.5); g.fillStyle = q.c;
    if (q.dust){ g.beginPath(); g.arc(q.x, q.y, q.r * (2 - q.life), 0, 7); g.fill(); continue; }
    if (q.sq){ g.save(); g.translate(q.x, q.y); g.rotate(q.rot); g.fillRect(-q.r, -q.r * .5, q.r * 2, q.r); g.restore(); }
    else { g.beginPath(); g.arc(q.x, q.y, q.r, 0, 7); g.fill(); }
  }
  g.globalAlpha = 1;
};
})();
