/* Odobim o'yinlari — rasmlar (SVG). Keyinchalik rassom chizgan rasmlarga almashtirish uchun
   faqat shu fayldagi funksiyalarni o'zgartirish kifoya: heroSVG, npcSVG, objSVG, sceneSVG. */
(function(){
let uid = 0;
/* ---------- HAJM (3D) BERISH: tekis rangni yorug'-soya gradientiga aylantiradi ---------- */
const hx = c => { c = c.replace("#",""); if (c.length === 3) c = c.split("").map(x=>x+x).join(""); return [0,2,4].map(i=>parseInt(c.substr(i,2),16)); };
const mixc = (c, w, a) => { const A = hx(c), B = hx(w); return "#" + A.map((v,i)=>Math.round(v + (B[i]-v)*a).toString(16).padStart(2,"0")).join(""); };
window.VOL_ON = true;
const vol = svg => {
  if (!window.VOL_ON) return svg;
  const id = "v" + (++uid), map = {}; let n = 0;
  const out = svg.replace(/fill="(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})"/g, (m, c) => { c = c.toLowerCase(); if (!map[c]) map[c] = id + "_" + (n++); return `fill="url(#${map[c]})"`; });
  if (!n) return svg;
  const defs = Object.entries(map).map(([c,g])=>`<radialGradient id="${g}" cx=".32" cy=".26" r=".95"><stop offset="0" stop-color="${mixc(c,"#ffffff",.42)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${mixc(c,"#1a0a2a",.34)}"/></radialGradient>`).join("");
  return out.replace(/(<svg[^>]*>)/, `$1<defs>${defs}</defs>`);
};
window.volSVG = vol;
const SK = "#F3C9A3", CH = "#F29E9E", HAIR = "#3A2A20", EYE = "#2A1E16";
const face = (cx=50, cy=40) => `
  <circle cx="${cx-9}" cy="${cy+2}" r="3.6" fill="${EYE}"/><circle cx="${cx+9}" cy="${cy+2}" r="3.6" fill="${EYE}"/>
  <circle cx="${cx-7.8}" cy="${cy+0.8}" r="1.2" fill="#fff"/><circle cx="${cx+10.2}" cy="${cy+0.8}" r="1.2" fill="#fff"/>
  <circle cx="${cx-16}" cy="${cy+10}" r="4" fill="${CH}" opacity=".6"/><circle cx="${cx+16}" cy="${cy+10}" r="4" fill="${CH}" opacity=".6"/>
  <path class="mouth" d="M${cx-8} ${cy+12} Q${cx} ${cy+18} ${cx+8} ${cy+12}" stroke="${EYE}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;

/* ---------- QAHRAMON: g = "m" | "f", s = 0..6 (kiyim bosqichi) ---------- */
window.heroSVG = function(g, s, cls=""){
  const id = "h" + (++uid);
  const defs = `<defs>
    <pattern id="${id}c" width="6" height="8" patternUnits="userSpaceOnUse"><rect width="6" height="8" fill="#2F6E9E"/><rect width="2" height="8" fill="#4FA36B"/><rect x="4" width="1" height="8" fill="#F2D16B"/></pattern>
    <pattern id="${id}a" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#E5484D"/><path d="M0 7 L3.5 0 L7 7 L3.5 14Z" fill="#F5B83D"/><path d="M7 7 L10.5 0 L14 7 L10.5 14Z" fill="#2F6FDB"/><path d="M5 7 L7 3 L9 7 L7 11Z" fill="#fff" opacity=".7"/></pattern>
    <pattern id="${id}r" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#E86FA6"/><circle cx="3" cy="3" r="1.6" fill="#fff" opacity=".85"/><circle cx="8" cy="8" r="1.2" fill="#FFE07A"/></pattern>
    <linearGradient id="${id}g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FFF6D8"/><stop offset="1" stop-color="#F3D27A"/></linearGradient>
  </defs>`;
  let p = `<ellipse cx="50" cy="146" rx="24" ry="4" fill="rgba(0,0,0,.18)"/>`;
  const shoes = `<ellipse cx="42" cy="141" rx="8" ry="4" fill="#5A3A22"/><ellipse cx="58" cy="141" rx="8" ry="4" fill="#5A3A22"/>`;
  const hands = (l=1, r=1) => (l?`<circle cx="26" cy="106" r="5" fill="${SK}"/>`:"") + (r?`<circle cx="74" cy="106" r="5" fill="${SK}"/>`:"");
  const book = `<g><rect x="66" y="94" width="16" height="20" rx="2" fill="#2E8B57"/><rect x="68" y="96" width="12" height="16" rx="1" fill="none" stroke="#F2D16B" stroke-width="1.2"/><path d="M74 99 l1.5 3 3 .4-2.2 2 .6 3-2.9-1.5-2.9 1.5.6-3-2.2-2 3-.4z" fill="#F2D16B"/></g>`;
  const beads = `<g fill="#B5651D">${[0,1,2,3,4,5,6].map(i=>{const a=Math.PI*(.15+i*.12); return `<circle cx="${26+Math.cos(a)*7}" cy="${104+Math.sin(a)*9}" r="1.8"/>`;}).join("")}<circle cx="24" cy="116" r="2.2" fill="#E0B54A"/></g>`;
  if (g === "m"){
    const long = s >= 4;
    if (!long) p += `<rect x="38" y="110" width="10" height="30" rx="4" fill="#3E5C8A"/><rect x="52" y="110" width="10" height="30" rx="4" fill="#3E5C8A"/>`;
    p += shoes;
    if (long){ // oq jubba
      p += `<path d="M30 70 Q50 63 70 70 L75 140 L25 140Z" fill="#FBFBF6" stroke="#E3E3D6"/><path d="M50 72 L50 100" stroke="#E3E3D6"/>`;
      p += `<rect x="20" y="73" width="12" height="34" rx="6" fill="#FBFBF6" stroke="#E3E3D6"/><rect x="68" y="73" width="12" height="34" rx="6" fill="#FBFBF6" stroke="#E3E3D6"/>`;
    } else {
      p += `<rect x="30" y="70" width="40" height="46" rx="12" fill="#7FB7E6"/>`;
      if (s >= 2) p += `<path d="M28 71 Q50 63 72 71 L77 130 L23 130Z" fill="url(#${id}c)"/><rect x="45" y="70" width="10" height="58" fill="#F4F1E8"/>
                        <rect x="20" y="73" width="12" height="34" rx="6" fill="url(#${id}c)"/><rect x="68" y="73" width="12" height="34" rx="6" fill="url(#${id}c)"/>`;
      else p += `<rect x="22" y="74" width="11" height="32" rx="5" fill="#7FB7E6"/><rect x="67" y="74" width="11" height="32" rx="5" fill="#7FB7E6"/>`;
      if (s >= 3) p += `<rect x="25" y="96" width="50" height="7" rx="2" fill="#C8402F"/><path d="M50 99 l-5 10 4 0 1-6 1 6 4 0z" fill="#A8301F"/>`;
    }
    if (s >= 6){ // zarrin bisht
      p += `<path d="M29 69 L16 141 L41 141 L45 72Z" fill="#4A2E1C" stroke="#E0B54A" stroke-width="2.6" stroke-linejoin="round"/>
            <path d="M71 69 L84 141 L59 141 L55 72Z" fill="#4A2E1C" stroke="#E0B54A" stroke-width="2.6" stroke-linejoin="round"/>
            <path d="M18 74 L10 108 L22 110 L30 76Z" fill="#4A2E1C" stroke="#E0B54A" stroke-width="2"/><path d="M82 74 L90 108 L78 110 L70 76Z" fill="#4A2E1C" stroke="#E0B54A" stroke-width="2"/>`;
    }
    p += hands(1, 1);
    p += `<rect x="45" y="60" width="10" height="12" fill="${SK}"/>`;
    if (s < 5) p += `<circle cx="23" cy="42" r="5" fill="${SK}"/><circle cx="77" cy="42" r="5" fill="${SK}"/>`;
    if (s >= 5) p += `<path d="M18 40 Q20 8 50 8 Q80 8 82 40 L88 82 Q72 74 68 62 L32 62 Q28 74 12 82Z" fill="#fff" stroke="#E6E6DC"/>`;
    p += `<circle cx="50" cy="40" r="27" fill="${SK}"/>` + face();
    if (s < 1) p += `<path d="M23 38 Q24 12 50 12 Q76 12 77 38 Q70 25 50 25 Q30 25 23 38Z" fill="${HAIR}"/>`;
    else if (s < 5) p += `<path d="M25 31 Q27 12 50 12 Q73 12 75 31 L75 34 L25 34Z" fill="#1E1E24"/><rect x="25" y="31" width="50" height="3" fill="#fff" opacity=".85"/>
                          ${[33,44,56,67].map(x=>`<ellipse cx="${x}" cy="23" rx="2.6" ry="5" fill="#fff" transform="rotate(${x<50?-20:20} ${x} 23)"/>`).join("")}`;
    else p += `<path d="M22 32 Q24 10 50 10 Q76 10 78 32 Q66 22 50 22 Q34 22 22 32Z" fill="#fff" stroke="#E6E6DC"/>
               <ellipse cx="50" cy="19" rx="26" ry="5.5" fill="none" stroke="#151515" stroke-width="3.2"/><ellipse cx="50" cy="15" rx="23" ry="4.5" fill="none" stroke="#151515" stroke-width="2.6"/>`;
    if (s >= 3) p += book;
    if (s >= 6) p += beads;
  } else {
    p += shoes;
    const dress = s >= 2 ? `url(#${id}a)` : "#F49AC1";
    if (s >= 6) p += `<path d="M31 69 Q50 62 69 69 L80 142 L20 142Z" fill="#3B2350"/><path d="M50 70 L50 142" stroke="#E0B54A" stroke-width="2.4"/>
                      <path d="M31 69 L20 142 M69 69 L80 142" stroke="#E0B54A" stroke-width="2.6"/><path d="M22 136 L78 136" stroke="#E0B54A" stroke-width="2"/>
                      <rect x="19" y="73" width="13" height="35" rx="6" fill="#3B2350" stroke="#E0B54A" stroke-width="1.6"/><rect x="68" y="73" width="13" height="35" rx="6" fill="#3B2350" stroke="#E0B54A" stroke-width="1.6"/>`;
    else {
      p += `<path d="M32 70 Q50 63 68 70 L76 134 L24 134Z" fill="${dress}"/>`;
      p += `<rect x="21" y="74" width="12" height="33" rx="6" fill="${dress}"/><rect x="67" y="74" width="12" height="33" rx="6" fill="${dress}"/>`;
      if (s >= 3) p += `<path d="M31 71 Q50 65 69 71 L68 102 L56 102 L50 80 L44 102 L32 102Z" fill="#7A1F3D" stroke="#E0B54A" stroke-width="2"/>
                        <circle cx="40" cy="88" r="2" fill="#E0B54A"/><circle cx="60" cy="88" r="2" fill="#E0B54A"/>`;
    }
    p += hands(1, 1);
    p += `<rect x="45" y="60" width="10" height="12" fill="${SK}"/>`;
    if (s < 1){ // sochlar va kokillar
      p += `<path d="M24 36 Q20 60 26 92 L32 92 Q28 62 30 40Z" fill="${HAIR}"/><path d="M76 36 Q80 60 74 92 L68 92 Q72 62 70 40Z" fill="${HAIR}"/>
            <circle cx="29" cy="94" r="3.5" fill="#E5484D"/><circle cx="71" cy="94" r="3.5" fill="#E5484D"/>`;
      p += `<circle cx="50" cy="40" r="27" fill="${SK}"/>` + face();
      p += `<path d="M23 40 Q22 12 50 12 Q78 12 77 40 Q72 24 50 24 Q34 24 28 36 Q26 30 23 40Z" fill="${HAIR}"/>`;
    } else if (s < 5){ // ro'mol
      p += `<path d="M19 42 Q18 9 50 9 Q82 9 81 42 Q82 62 72 74 L28 74 Q18 62 19 42Z" fill="url(#${id}r)"/>`;
      p += `<circle cx="50" cy="42" r="24" fill="${SK}"/>` + face(50, 41);
      p += `<path d="M25 36 Q27 14 50 14 Q73 14 75 36 Q63 26 50 26 Q37 26 25 36Z" fill="url(#${id}r)"/><path d="M42 72 L50 84 L58 72Z" fill="#D45A8E"/>`;
    } else { // oq-zarrin hijob
      p += `<path d="M17 42 Q16 7 50 7 Q84 7 83 42 Q85 70 76 96 L24 96 Q15 70 17 42Z" fill="#FFFDF7" stroke="#E0B54A" stroke-width="2.4"/>`;
      p += `<circle cx="50" cy="42" r="24" fill="${SK}"/>` + face(50, 41);
      p += `<path d="M25 36 Q27 13 50 13 Q73 13 75 36 Q63 25 50 25 Q37 25 25 36Z" fill="#FFFDF7" stroke="#E0B54A" stroke-width="1.6"/>`;
      if (s >= 6) p += `<circle cx="50" cy="16" r="3" fill="#E0B54A"/>`;
    }
    if (s >= 4) p += book + beads;
  }
  if (s >= 6) p += `<g class="spark" fill="#F2D16B"><path d="M86 18 l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M12 56 l1.4 3.4 3.4 1.4-3.4 1.4-1.4 3.4-1.4-3.4-3.4-1.4 3.4-1.4z"/></g>`;
  return vol(`<svg class="hero ${cls}" viewBox="0 0 100 150" aria-hidden="true">${defs}${p}</svg>`);
};

/* ---------- PERSONAJLAR ---------- */
function person(o){
  const sk = o.skin || SK, sh = o.shirt || "#8FBF7A", sc = o.scale || 1;
  let p = `<ellipse cx="50" cy="146" rx="22" ry="4" fill="rgba(0,0,0,.16)"/>`;
  if (o.dress) p += `<path d="M31 70 Q50 63 69 70 L76 140 L24 140Z" fill="${o.dress}"/>`;
  else p += `<rect x="38" y="110" width="10" height="30" rx="4" fill="${o.pants||"#4A4A5A"}"/><rect x="52" y="110" width="10" height="30" rx="4" fill="${o.pants||"#4A4A5A"}"/>`;
  p += `<ellipse cx="42" cy="141" rx="8" ry="4" fill="#4A3020"/><ellipse cx="58" cy="141" rx="8" ry="4" fill="#4A3020"/>`;
  if (!o.dress) p += `<rect x="30" y="70" width="40" height="46" rx="12" fill="${sh}"/>`;
  if (o.robe) p += `<path d="M28 71 Q50 63 72 71 L77 132 L23 132Z" fill="${o.robe}"/><rect x="45" y="71" width="10" height="58" fill="${sh}"/>`;
  if (o.apron) p += `<rect x="36" y="88" width="28" height="36" rx="4" fill="${o.apron}"/>`;
  p += `<rect x="21" y="74" width="12" height="32" rx="6" fill="${o.robe||o.dress||sh}"/><rect x="67" y="74" width="12" height="32" rx="6" fill="${o.robe||o.dress||sh}"/>`;
  p += `<circle cx="27" cy="106" r="5" fill="${sk}"/><circle cx="73" cy="106" r="5" fill="${sk}"/><rect x="45" y="60" width="10" height="12" fill="${sk}"/>`;
  if (o.cane) p += `<path d="M78 104 L84 142" stroke="#7A4E2A" stroke-width="3.5" stroke-linecap="round"/><path d="M78 104 Q80 96 86 99" stroke="#7A4E2A" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  if (o.book) p += `<rect x="64" y="94" width="16" height="20" rx="2" fill="#2E6B8B"/>`;
  if (o.bag) p += `<path d="M72 100 L88 100 L92 128 L68 128Z" fill="#B88A4E"/><path d="M74 100 Q80 90 86 100" stroke="#7A5A2E" stroke-width="2.5" fill="none"/>`;
  if (o.scarf) p += `<path d="M19 42 Q18 9 50 9 Q82 9 81 42 Q82 62 72 74 L28 74 Q18 62 19 42Z" fill="${o.scarf}"/>`;
  else p += `<circle cx="23" cy="42" r="5" fill="${sk}"/><circle cx="77" cy="42" r="5" fill="${sk}"/>`;
  p += `<circle cx="50" cy="${o.scarf?42:40}" r="${o.scarf?24:27}" fill="${sk}"/>` + face(50, o.scarf?41:40);
  if (o.beard) p += `<path d="M30 46 Q32 ${o.beardLong?86:74} 50 ${o.beardLong?92:78} Q68 ${o.beardLong?86:74} 70 46 Q64 58 50 58 Q36 58 30 46Z" fill="${o.beard}"/><path d="M42 54 Q50 59 58 54" stroke="${EYE}" stroke-width="2" fill="none"/>`;
  if (o.mustache) p += `<path d="M41 50 Q50 46 59 50 Q50 54 41 50Z" fill="${o.mustache}"/>`;
  if (o.scarf) p += `<path d="M25 36 Q27 14 50 14 Q73 14 75 36 Q63 26 50 26 Q37 26 25 36Z" fill="${o.scarf}"/>`;
  else if (o.hat==="doppi") p += `<path d="M25 31 Q27 12 50 12 Q73 12 75 31 L75 34 L25 34Z" fill="#1E1E24"/>${[33,44,56,67].map(x=>`<ellipse cx="${x}" cy="23" rx="2.6" ry="5" fill="#fff"/>`).join("")}`;
  else if (o.hat==="salla") p += `<path d="M20 34 Q20 6 50 6 Q80 6 80 34 Q66 26 50 26 Q34 26 20 34Z" fill="${o.sallaC||"#fff"}" stroke="#DDD" /><path d="M24 24 Q50 14 76 24 M22 30 Q50 20 78 30" stroke="#DDD" fill="none"/>`;
  else if (o.hat==="straw") p += `<ellipse cx="50" cy="22" rx="38" ry="7" fill="#E8C66A"/><path d="M30 22 Q32 4 50 4 Q68 4 70 22Z" fill="#E8C66A"/><rect x="30" y="17" width="40" height="4" fill="#B5462E"/>`;
  else if (o.hair) p += `<path d="M23 38 Q24 12 50 12 Q76 12 77 38 Q70 25 50 25 Q30 25 23 38Z" fill="${o.hair}"/>`;
  return `<g transform="translate(${50-50*sc} ${150-150*sc}) scale(${sc})">${p}</g>`;
}
const svgWrap = (inner, vb="0 0 100 150", cls="") => vol(`<svg class="${cls}" viewBox="${vb}" aria-hidden="true">${inner}</svg>`);
window.npcSVG = function(kind){
  switch(kind){
    case "bird": return svgWrap(`<ellipse cx="50" cy="146" rx="16" ry="3" fill="rgba(0,0,0,.15)"/><path d="M36 140 l-3 6 M44 140 l1 6" stroke="#C47A2C" stroke-width="2.4" stroke-linecap="round"/>
      <ellipse cx="44" cy="124" rx="22" ry="17" fill="#A9784E"/><ellipse cx="40" cy="128" rx="14" ry="10" fill="#F1DDBF"/><path d="M50 118 Q72 110 74 128 Q62 124 50 128Z" fill="#7E5634"/>
      <circle cx="60" cy="106" r="13" fill="#A9784E"/><circle cx="64" cy="104" r="3" fill="${EYE}"/><circle cx="65" cy="103" r="1" fill="#fff"/><path d="M72 106 L82 109 L72 112Z" fill="#E8A33C"/>
      <path d="M22 120 L8 114 L14 126Z" fill="#7E5634"/>`);
    case "elder": return svgWrap(person({hat:"doppi", robe:"#7A5A3A", shirt:"#F4F1E8", beard:"#F2F2F2", beardLong:1, cane:1, pants:"#3A3A3A"}));
    case "neighbor": return svgWrap(person({hat:"doppi", shirt:"#5FA36B", mustache:"#3A2A20", pants:"#2F4A6E"}));
    case "gardener": return svgWrap(person({hat:"straw", shirt:"#7FB36A", apron:"#8A6440", mustache:"#3A2A20"}));
    case "guard": return svgWrap(person({hat:"salla", robe:"#2E7D5B", shirt:"#F4F1E8", beard:"#3A2A20"}));
    case "kids": return svgWrap(`<g transform="translate(-22 0)">${person({hair:HAIR, shirt:"#E5704D", scale:.72})}</g><g transform="translate(22 0)">${person({hair:"#5A3A22", shirt:"#4A8FD9", scale:.72})}</g>
      <circle cx="50" cy="128" r="9" fill="#fff" stroke="#E5484D" stroke-width="2"/><path d="M41 128 Q50 122 59 128 M41 128 Q50 134 59 128" stroke="#E5484D" fill="none" stroke-width="1.5"/>`, "0 0 100 150");
    case "appletree": return objSVG("tree", {fruit:1, sign:1});
    case "merchant": return svgWrap(person({hat:"salla", sallaC:"#F2E6C8", robe:"#8C3B2E", shirt:"#F4F1E8", beard:"#4A3020", bag:1}));
    case "buyer": return svgWrap(person({hat:"doppi", robe:"#3B6E8F", shirt:"#F4F1E8", mustache:"#3A2A20"}));
    case "woman": return svgWrap(person({scarf:"#9A6FB0", dress:"#6E4C8A"}));
    case "traveler": return svgWrap(person({hat:"salla", sallaC:"#E2D3B0", robe:"#9C8456", shirt:"#E8E0CC", beard:"#6B5A4A", cane:1}));
    case "scholar": return svgWrap(person({hat:"salla", robe:"#FBFBF6", shirt:"#FBFBF6", beard:"#BFBFBF", beardLong:1, book:1}));
    case "camel": return svgWrap(`<ellipse cx="60" cy="96" rx="40" ry="4" fill="rgba(0,0,0,.15)"/>
      <path d="M30 60 Q34 34 50 44 Q58 26 72 44 Q86 48 86 66 L84 92 L78 92 L78 70 L46 70 L44 92 L38 92 L36 70 Q24 70 22 56 Q20 40 12 38 Q6 28 14 24 Q22 26 24 36 Q28 46 30 60Z" fill="#C99A5B"/>
      <circle cx="13" cy="28" r="1.6" fill="${EYE}"/><rect x="44" y="40" width="22" height="10" rx="3" fill="#B5462E"/><path d="M44 44 L66 44" stroke="#F2D16B" stroke-width="2"/>`, "0 0 100 100");
    default: return svgWrap(person({}));
  }
};

/* ---------- OBYEKTLAR ---------- */
window.objSVG = function(t, o={}){
  switch(t){
    case "house": return svgWrap(`<rect x="10" y="50" width="160" height="96" fill="#EBD3A8"/><rect x="4" y="40" width="172" height="14" rx="2" fill="#B98552"/><rect x="0" y="36" width="180" height="6" fill="#8C5F38"/>
      <rect x="70" y="84" width="40" height="62" rx="3" fill="#2F6E9E"/><path d="M90 84 L90 146" stroke="#245A82" stroke-width="2"/><circle cx="84" cy="116" r="2.5" fill="#F2D16B"/><circle cx="96" cy="116" r="2.5" fill="#F2D16B"/>
      <rect x="24" y="70" width="30" height="28" rx="2" fill="#7EC4E8" stroke="#8C5F38" stroke-width="4"/><rect x="126" y="70" width="30" height="28" rx="2" fill="#7EC4E8" stroke="#8C5F38" stroke-width="4"/>
      <path d="M24 84 L54 84 M39 70 L39 98 M126 84 L156 84 M141 70 L141 98" stroke="#8C5F38" stroke-width="2"/>`, "0 0 180 150");
    case "tree": return svgWrap(`<rect x="52" y="90" width="16" height="78" rx="4" fill="#8A5A34"/><path d="M60 120 L40 100 M60 110 L80 92" stroke="#8A5A34" stroke-width="7" stroke-linecap="round"/>
      <circle cx="60" cy="66" r="44" fill="#4FA35A"/><circle cx="30" cy="86" r="26" fill="#5BB065"/><circle cx="90" cy="84" r="28" fill="#469A52"/><circle cx="60" cy="40" r="28" fill="#62B86C"/>
      ${o.fruit?[[36,70],[74,56],[88,92],[52,96],[60,30],[28,96]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6" fill="#E5484D"/><path d="M${x} ${y-6} l2 -4" stroke="#5A3A22" stroke-width="1.5"/>`).join(""):""}
      ${o.sign?`<rect x="76" y="132" width="40" height="22" rx="3" fill="#E8D2A6" stroke="#8A5A34" stroke-width="2"/><path d="M96 154 L96 170" stroke="#8A5A34" stroke-width="3"/><text x="96" y="147" font-size="9" text-anchor="middle" fill="#5A3A22" font-family="sans-serif" font-weight="700">Bog'</text>`:""}`, "0 0 120 170");
    case "flowers": return svgWrap(`${[10,28,46,64].map((x,i)=>`<path d="M${x+6} 40 L${x+6} 20" stroke="#3E8E4A" stroke-width="2.5"/><circle cx="${x+6}" cy="16" r="7" fill="${["#F25F8B","#F5B83D","#9B6BE0","#F2785C"][i]}"/><circle cx="${x+6}" cy="16" r="2.8" fill="#FFF3B0"/>`).join("")}`, "0 0 80 40");
    case "fence": return svgWrap(`${[0,1,2,3,4,5,6].map(i=>`<path d="M${6+i*20} 50 L${6+i*20} 10 L${12+i*20} 2 L${18+i*20} 10 L${18+i*20} 50Z" fill="#D9B07A" stroke="#A97D48" stroke-width="1.5"/>`).join("")}<rect x="0" y="18" width="140" height="6" fill="#B98A52"/><rect x="0" y="36" width="140" height="6" fill="#B98A52"/>`, "0 0 140 50");
    case "well": return svgWrap(`<path d="M12 40 L45 14 L78 40Z" fill="#B5462E"/><rect x="16" y="40" width="5" height="30" fill="#7A4E2A"/><rect x="69" y="40" width="5" height="30" fill="#7A4E2A"/>
      <path d="M45 40 L45 58" stroke="#5A3A22" stroke-width="1.5"/>${o.empty?"":`<path d="M38 58 L52 58 L50 70 L40 70Z" fill="#3D8BD9"/>`}
      <rect x="8" y="70" width="74" height="40" rx="6" fill="#A9A49B"/><path d="M8 82 H82 M8 96 H82 M30 70 V82 M58 70 V82 M20 82 V96 M46 82 V96 M70 82 V96 M32 96 V110 M60 96 V110" stroke="#8D887F" stroke-width="2"/>`, "0 0 90 110");
    case "bucket": return svgWrap(`<path d="M6 10 L34 10 L30 38 L10 38Z" fill="#3D8BD9"/><ellipse cx="20" cy="10" rx="14" ry="4" fill="#7EC4E8"/><path d="M6 10 Q20 -6 34 10" stroke="#555" stroke-width="2" fill="none"/>`, "0 -4 40 44");
    case "trash": return svgWrap(o.v ? `<rect x="10" y="6" width="12" height="26" rx="4" fill="#7FC8A9" opacity=".9"/><rect x="13" y="2" width="6" height="6" fill="#3E8E6A"/>` : `<path d="M4 20 Q2 8 14 6 Q26 2 28 14 Q32 26 18 28 Q6 30 4 20Z" fill="#EDEDE6" stroke="#B8B8AC" stroke-width="1.5"/><path d="M10 12 L20 22 M22 10 L12 24" stroke="#C8C8BC" stroke-width="1.5"/>`, "0 0 32 34");
    case "bread": return svgWrap(`<path d="M2 16 Q4 4 16 4 Q28 4 30 16 Q30 22 16 22 Q2 22 2 16Z" fill="#D9A25B"/><path d="M8 10 L12 14 M15 8 L19 12 M22 10 L26 14" stroke="#B5803F" stroke-width="1.8" stroke-linecap="round"/>`, "0 0 32 24");
    case "bin": return svgWrap(`<rect x="6" y="14" width="40" height="46" rx="5" fill="#3E9B5E"/><rect x="2" y="8" width="48" height="9" rx="3" fill="#2F7D4A"/><rect x="20" y="2" width="12" height="7" rx="2" fill="#2F7D4A"/>
      <path d="M17 26 V52 M26 26 V52 M35 26 V52" stroke="#2F7D4A" stroke-width="3" stroke-linecap="round"/>${o.full?`<path d="M10 12 Q26 0 42 12" fill="#EDEDE6"/>`:""}`, "0 0 52 62");
    case "feeder": return svgWrap(`<rect x="28" y="40" width="5" height="52" fill="#8A5A34"/><path d="M4 26 L31 8 L58 26Z" fill="#B5462E"/><rect x="8" y="26" width="46" height="18" rx="3" fill="#D9B07A" stroke="#A97D48" stroke-width="2"/>
      ${o.full?[14,22,30,38,46].map(x=>`<ellipse cx="${x}" cy="30" rx="4" ry="2.4" fill="#D9A25B"/>`).join(""):""}`, "0 0 62 92");
    case "pot": return svgWrap(o.empty?`<path d="M8 30 L36 30 L32 52 L12 52Z" fill="#C1683C"/><rect x="6" y="26" width="32" height="6" rx="2" fill="#A9552E"/>`:
      `<path d="M22 28 L22 8" stroke="#3E8E4A" stroke-width="3"/><path d="M22 16 Q10 8 8 0 Q20 2 22 12 M22 12 Q32 2 40 2 Q36 12 22 18" fill="#5BB065"/><path d="M8 30 L36 30 L32 52 L12 52Z" fill="#C1683C"/><rect x="6" y="26" width="32" height="6" rx="2" fill="#A9552E"/>`, "0 0 44 54");
    case "sapling": return svgWrap(`<path d="M22 28 L22 8" stroke="#3E8E4A" stroke-width="3"/><path d="M22 16 Q10 8 8 0 Q20 2 22 12 M22 12 Q32 2 40 2 Q36 12 22 18" fill="#5BB065"/><path d="M8 30 L36 30 L32 52 L12 52Z" fill="#C1683C"/>`, "0 0 44 54");
    case "chest": return svgWrap(o.open
      ? `<ellipse cx="34" cy="58" rx="30" ry="4" fill="rgba(0,0,0,.18)"/><path d="M6 22 L62 22 L58 2 L10 2Z" fill="#9A5A2C" stroke="#6B3C1A" stroke-width="2"/><rect x="6" y="24" width="56" height="32" rx="4" fill="#B56B34" stroke="#6B3C1A" stroke-width="2"/>
         <circle cx="34" cy="22" r="10" fill="#FFE07A" opacity=".85"/><path d="M26 18 l3 4 M42 18 l-3 4 M34 12 v5" stroke="#FFF6C8" stroke-width="2"/><rect x="6" y="36" width="56" height="5" fill="#E0B54A"/>`
      : `<ellipse cx="34" cy="58" rx="30" ry="4" fill="rgba(0,0,0,.18)"/><path d="M6 26 Q6 8 34 8 Q62 8 62 26Z" fill="#9A5A2C" stroke="#6B3C1A" stroke-width="2"/><rect x="6" y="26" width="56" height="30" rx="4" fill="#B56B34" stroke="#6B3C1A" stroke-width="2"/>
         <rect x="6" y="24" width="56" height="5" fill="#E0B54A"/><rect x="18" y="8" width="5" height="48" fill="#E0B54A"/><rect x="45" y="8" width="5" height="48" fill="#E0B54A"/><rect x="28" y="28" width="12" height="14" rx="2" fill="#F2D16B" stroke="#8C6A1C"/><circle cx="34" cy="34" r="2" fill="#6B3C1A"/>`, "0 0 68 62");
    case "gate": return svgWrap(`<rect x="0" y="40" width="34" height="170" fill="#C9965E"/><rect x="146" y="40" width="34" height="170" fill="#C9965E"/>
      <path d="M0 40 Q90 -24 180 40 L180 64 Q90 4 0 64Z" fill="#2D8BBA"/><path d="M8 46 Q90 -10 172 46" stroke="#F2D16B" stroke-width="3" fill="none"/>
      ${[0,1,2,3,4,5,6,7].map(i=>`<rect x="${i%2?4:0}" y="${70+i*18}" width="30" height="8" fill="#B07C46"/><rect x="${i%2?150:146}" y="${70+i*18}" width="30" height="8" fill="#B07C46"/>`).join("")}
      ${o.open ? `<path d="M34 210 L34 64 Q50 56 52 70 L52 200Z" fill="#7A4E2A"/><path d="M146 210 L146 64 Q130 56 128 70 L128 200Z" fill="#7A4E2A"/><path d="M52 210 L128 210 L128 70 Q90 40 52 70Z" fill="#FFE9A8" opacity=".55"/>`
               : `<path d="M34 210 L34 64 Q90 30 146 64 L146 210Z" fill="#8C5A32"/><path d="M90 46 L90 210" stroke="#6B3C1A" stroke-width="3"/>${[90,120,150,180].map(y=>`<path d="M34 ${y} H146" stroke="#6B3C1A" stroke-width="2"/>`).join("")}
                  <circle cx="82" cy="140" r="4" fill="#F2D16B"/><circle cx="98" cy="140" r="4" fill="#F2D16B"/><rect x="80" y="150" width="20" height="16" rx="3" fill="#E0B54A"/>`}`, "0 0 180 210");
    /* ---- bezak (manzara) ---- */
    case "house2": { const wl = o.wall || "#F6E2B8", rf = o.roof || "#E5604D", dr = o.door || "#3D7FD6";
      return svgWrap(`<rect x="14" y="62" width="132" height="84" fill="${wl}"/><path d="M4 66 L80 14 L156 66Z" fill="${rf}"/><rect x="0" y="62" width="160" height="7" rx="2" fill="${mixc(rf,"#000000",.25)}"/>
      <rect x="64" y="92" width="32" height="54" rx="14" fill="${dr}"/><circle cx="90" cy="120" r="2.5" fill="#FFD84A"/>
      <rect x="24" y="84" width="28" height="26" rx="3" fill="#9EDCFF" stroke="#fff" stroke-width="3"/><rect x="108" y="84" width="28" height="26" rx="3" fill="#9EDCFF" stroke="#fff" stroke-width="3"/>
      <rect x="22" y="110" width="32" height="8" rx="3" fill="#B5703A"/><rect x="106" y="110" width="32" height="8" rx="3" fill="#B5703A"/>
      ${[26,34,42,50,110,118,126,134].map((x,i)=>`<circle cx="${x}" cy="108" r="3.6" fill="${["#FF5C8A","#FFD23F","#B388FF","#FF9F43"][i%4]}"/>`).join("")}
      <rect x="112" y="22" width="14" height="26" fill="#C9824A"/>`, "0 0 160 146"); }
    case "poplar": return svgWrap(`<rect x="27" y="150" width="8" height="40" fill="#8A5A34"/><ellipse cx="31" cy="90" rx="20" ry="72" fill="${o.c||"#3FAE5A"}"/><ellipse cx="25" cy="70" rx="9" ry="40" fill="${mixc(o.c||"#3FAE5A","#ffffff",.25)}" opacity=".6"/>`, "0 0 62 190");
    case "blossom": { const c = o.c || "#FFB3D1";
      return svgWrap(`<rect x="54" y="96" width="14" height="74" rx="4" fill="#8A5A34"/><path d="M61 124 L40 104 M61 112 L84 96" stroke="#8A5A34" stroke-width="7" stroke-linecap="round"/>
      <circle cx="60" cy="66" r="42" fill="${c}"/><circle cx="30" cy="86" r="24" fill="${mixc(c,"#ffffff",.3)}"/><circle cx="92" cy="84" r="26" fill="${mixc(c,"#e0306a",.15)}"/><circle cx="60" cy="38" r="26" fill="${mixc(c,"#ffffff",.4)}"/>
      ${[[38,52],[78,48],[52,82],[86,70],[30,74],[64,24],[96,96]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4" fill="#ffffff"/>`).join("")}`, "0 0 120 170"); }
    case "bush": { const c = o.c || "#4FB35E";
      return svgWrap(`<circle cx="22" cy="40" r="20" fill="${c}"/><circle cx="50" cy="30" r="26" fill="${mixc(c,"#ffffff",.15)}"/><circle cx="78" cy="42" r="19" fill="${mixc(c,"#003300",.12)}"/><rect x="4" y="44" width="92" height="16" rx="8" fill="${c}"/>
      ${o.berry?[[30,30],[56,20],[70,40],[44,44],[18,46]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="4.5" fill="${o.berry===1?["#FF4D6D","#FFD23F","#FF4D6D","#FFFFFF","#FF9F43"][i]:o.berry}"/>`).join(""):""}`, "0 0 100 60"); }
    case "rock": return svgWrap(`<path d="M6 44 Q2 26 18 18 Q30 6 46 14 Q62 12 66 30 Q72 44 60 46Z" fill="${o.c||"#A7A9B8"}"/><path d="M18 22 Q28 14 40 18" stroke="#ffffff" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>`, "0 0 72 48");
    case "tuft": return svgWrap(`<g class="sway">${[[10,-14],[18,-4],[26,8],[34,-8],[42,12],[50,0]].map(([x,a])=>`<path d="M${x} 40 Q${x+a*.3} 18 ${x+a} ${4+Math.abs(a)}" stroke="${o.c||"#3E9A4A"}" stroke-width="4" fill="none" stroke-linecap="round"/>`).join("")}</g>`, "0 0 60 40");
    case "flowerbed": return svgWrap(`<rect x="0" y="34" width="120" height="14" rx="7" fill="#4FAF55"/>${[...Array(9)].map((_,i)=>{ const x = 8 + i*13, y = 12 + (i%3)*5, c = ["#FF4D6D","#FFD23F","#B388FF","#FF9F43","#5BD1FF","#FF6BD6"][i%6];
      return `<path d="M${x} 40 L${x} ${y+6}" stroke="#3E8E4A" stroke-width="2.5"/>${[0,72,144,216,288].map(a=>`<circle cx="${x+Math.cos(a*Math.PI/180)*5}" cy="${y+Math.sin(a*Math.PI/180)*5}" r="4" fill="${c}"/>`).join("")}<circle cx="${x}" cy="${y}" r="3" fill="#FFF3B0"/>`; }).join("")}`, "0 0 120 48");
    case "sunflower": return svgWrap(`<path d="M20 120 Q22 70 20 40" stroke="#3E8E4A" stroke-width="5" fill="none"/><path d="M21 84 Q36 72 44 80 Q32 92 21 88Z M20 100 Q4 90 0 98 Q10 108 20 104Z" fill="#4FAF55"/>
      ${[...Array(12)].map((_,i)=>{ const a = i/12*Math.PI*2; return `<ellipse cx="${20+Math.cos(a)*13}" cy="${32+Math.sin(a)*13}" rx="7" ry="4" transform="rotate(${a*180/Math.PI} ${20+Math.cos(a)*13} ${32+Math.sin(a)*13})" fill="#FFC81E"/>`; }).join("")}<circle cx="20" cy="32" r="10" fill="#7A4A1E"/>`, "-4 14 50 108");
    case "butterfly": { const c = o.c || "#FF6BD6";
      return svgWrap(`<g class="flap"><path d="M20 20 Q4 0 2 14 Q0 28 20 24Z" fill="${c}"/><path d="M20 22 Q6 34 8 40 Q16 42 20 26Z" fill="${mixc(c,"#ffffff",.35)}"/></g>
      <g class="flap r"><path d="M20 20 Q36 0 38 14 Q40 28 20 24Z" fill="${c}"/><path d="M20 22 Q34 34 32 40 Q24 42 20 26Z" fill="${mixc(c,"#ffffff",.35)}"/></g><rect x="18.5" y="14" width="3" height="18" rx="1.5" fill="#3A2A20"/>`, "0 0 40 44"); }
    case "lantern": return svgWrap(`<path d="M20 0 V10" stroke="#7A4E2A" stroke-width="2"/><rect x="10" y="10" width="20" height="26" rx="8" fill="#FFB020"/><rect x="13" y="14" width="14" height="18" rx="6" fill="#FFF0A8"/><rect x="12" y="36" width="16" height="4" fill="#B5462E"/>`, "0 0 40 40");
    default: return "";
  }
};
/* xarita uchun kichik shahar belgisi */
window.cityIcon = function(c){
  const d = c.dome || "#2E9BD6", w = c.wall || "#E9D2A6";
  return svgWrap(`<ellipse cx="40" cy="74" rx="34" ry="5" fill="rgba(0,0,0,.18)"/><rect x="12" y="40" width="56" height="34" fill="${w}"/><rect x="32" y="50" width="16" height="24" rx="8" fill="#2B6FA0"/>
    <ellipse cx="40" cy="38" rx="17" ry="16" fill="${d}"/><rect x="38" y="16" width="4" height="8" fill="#F2D16B"/><rect x="62" y="22" width="8" height="52" fill="${w}"/><rect x="60" y="18" width="12" height="6" fill="${d}"/>
    <rect x="10" y="30" width="7" height="44" fill="${w}"/><rect x="9" y="26" width="9" height="5" fill="${d}"/>`, "0 0 80 80");
};
/* tog' va adir chiziqlari (fon uchun takrorlanadigan rasm) */
window.ridgeURI = function(kind, c1, c2){
  let p = "";
  if (kind === "mount") p = `<path d="M0 220 L90 70 L150 130 L240 30 L330 140 L400 90 L480 160 L560 50 L650 140 L720 80 L800 220Z" fill="${c1}"/><path d="M240 30 L270 60 L250 58 L232 70 L210 62Z M560 50 L590 82 L568 78 L548 90 L530 84Z M90 70 L112 100 L94 96 L78 104Z" fill="#ffffff" opacity=".9"/>`;
  else if (kind === "hill") p = `<path d="M0 220 L0 150 Q100 70 200 130 Q300 80 400 120 Q520 60 640 130 Q720 100 800 150 L800 220Z" fill="${c1}"/><path d="M0 220 L0 190 Q120 140 260 180 Q420 150 560 185 Q700 160 800 190 L800 220Z" fill="${c2}"/>`;
  else if (kind === "dune") p = `<path d="M0 220 L0 140 Q140 90 280 140 Q420 180 560 120 Q700 90 800 140 L800 220Z" fill="${c1}"/><path d="M0 220 L0 180 Q200 150 400 185 Q600 160 800 180 L800 220Z" fill="${c2}"/>`;
  else if (kind === "cloud") p = [[80,60,1],[330,40,.8],[560,80,1.1],[720,50,.7]].map(([x,y,s])=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="20" rx="56" ry="18" fill="#fff"/><circle cx="-18" cy="10" r="22" fill="#fff"/><circle cx="14" cy="4" r="28" fill="#fff"/></g>`).join("");
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='220' viewBox='0 0 800 220'>${p}</svg>`)}")`;
};

/* ---------- KARVON SHAHRI SAHNASI (qatlamlarga bo'lingan — 3D chuqurlik uchun) ---------- */
window.citySVG = function(c, layer){
  const d = c.dome, w = c.wall, sv = inner => vol(`<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${inner}</svg>`);
  const haze = mixc(w, "#ffffff", .45), hazeD = mixc(d, "#ffffff", .5);
  if (layer === "back") return sv(`
    ${[[10,150,40],[70,135,30],[300,140,36],[352,128,28],[230,150,26]].map(([x,y,r])=>`<rect x="${x}" y="${y}" width="${r*1.6}" height="${210-y}" fill="${haze}"/><ellipse cx="${x+r*.8}" cy="${y}" rx="${r*.7}" ry="${r*.65}" fill="${hazeD}"/>`).join("")}
    ${[[56,96],[288,104],[386,110]].map(([x,y])=>`<rect x="${x}" y="${y}" width="9" height="${210-y}" fill="${haze}"/><rect x="${x-2}" y="${y-6}" width="13" height="7" fill="${hazeD}"/>`).join("")}
    <path d="M0 210 Q100 190 200 205 Q300 220 400 200 L400 300 L0 300Z" fill="#E7C998"/>`);
  if (layer === "front") return sv(`
    ${[[18,262],[384,258]].map(([x,y])=>`<path d="M${x} ${y} Q${x+4} ${y-30} ${x} ${y-62}" stroke="#7A5A34" stroke-width="7" fill="none"/><path d="M${x} ${y-62} Q${x-30} ${y-74} ${x-36} ${y-50} M${x} ${y-62} Q${x+30} ${y-74} ${x+36} ${y-50} M${x} ${y-62} Q${x-16} ${y-90} ${x-30} ${y-86} M${x} ${y-62} Q${x+16} ${y-90} ${x+30} ${y-86} M${x} ${y-62} Q${x} ${y-92} ${x+4} ${y-96}" stroke="#2F9A4A" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="${x-4}" cy="${y-58}" r="4" fill="#8A4A1E"/><circle cx="${x+5}" cy="${y-56}" r="4" fill="#8A4A1E"/>`).join("")}
    <path d="M52 300 Q54 276 70 274 Q86 276 88 300Z" fill="#C1683C"/><rect x="60" y="268" width="20" height="8" rx="3" fill="#A9552E"/>
    <path d="M318 300 Q320 282 332 280 Q344 282 346 300Z" fill="#2E86C1"/><path d="M322 290 H342" stroke="#F2D16B" stroke-width="2"/>`);
  /* asosiy qatlam: binolar (default) */
  return sv(`${layer ? "" : `<defs><linearGradient id="sky${c.id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${c.sky[0]}"/><stop offset="1" stop-color="${c.sky[1]}"/></linearGradient></defs><rect width="400" height="300" fill="url(#sky${c.id})"/><circle cx="330" cy="60" r="26" fill="#FFF2C2" opacity=".9"/><path d="M0 210 Q100 190 200 205 Q300 220 400 200 L400 300 L0 300Z" fill="#E7C998"/>`}
   ${c.id===1 ? `
    <rect x="40" y="110" width="90" height="110" fill="${w}"/><rect x="62" y="130" width="46" height="90" rx="23" fill="#2B6FA0"/><path d="M62 150 Q85 110 108 150" fill="none" stroke="#F2D16B" stroke-width="3"/>
    <rect x="270" y="110" width="90" height="110" fill="${w}"/><rect x="292" y="130" width="46" height="90" rx="23" fill="#2B6FA0"/>
    <rect x="150" y="80" width="100" height="140" fill="${w}"/><rect x="172" y="104" width="56" height="116" rx="28" fill="#2B6FA0"/><path d="M172 130 Q200 84 228 130" fill="none" stroke="#F2D16B" stroke-width="3"/>
    ${[[48,118],[98,118],[278,118],[328,118]].map(([x,y])=>`<path d="M${x} ${y} h24 M${x} ${y+6} h24" stroke="#3FB8C9" stroke-width="3"/>`).join("")}
    <ellipse cx="200" cy="72" rx="34" ry="36" fill="${d}"/><path d="M166 72 Q200 60 234 72" stroke="#7FD0EA" stroke-width="3" fill="none"/><rect x="196" y="28" width="8" height="12" fill="#F2D16B"/>
    ${[36,126,266,356].map(x=>`<rect x="${x}" y="70" width="12" height="150" fill="${w}"/><rect x="${x-2}" y="64" width="16" height="10" fill="${d}"/><path d="M${x} 100 h12 M${x} 140 h12" stroke="#3FB8C9" stroke-width="3"/>`).join("")}
    ${[70,100,300,330].map(x=>`<ellipse cx="${x}" cy="108" rx="16" ry="14" fill="${d}"/>`).join("")}` :
   `<rect x="60" y="120" width="80" height="100" fill="${w}"/><ellipse cx="100" cy="116" rx="30" ry="26" fill="${d}"/><rect x="84" y="150" width="32" height="70" rx="16" fill="#2B6FA0"/>
    <rect x="250" y="130" width="110" height="90" fill="${w}"/><ellipse cx="305" cy="126" rx="34" ry="24" fill="${d}"/><rect x="288" y="160" width="34" height="60" rx="17" fill="#2B6FA0"/>
    <rect x="180" y="40" width="26" height="180" fill="#C79A63"/><rect x="176" y="36" width="34" height="12" fill="#B58550"/>${[70,100,130,160].map(y=>`<path d="M180 ${y} H206" stroke="#3FB8C9" stroke-width="3"/>`).join("")}
    <path d="M150 230 Q200 210 250 230 L250 240 L150 240Z" fill="#69B7D9"/>`}
   ${[[150,200,"#E5484D"],[226,196,"#2E86C1"],[120,204,"#F5B83D"]].map(([x,y,cc])=>`<path d="M${x} ${y} l14 -14 l14 14Z" fill="${cc}"/><rect x="${x+2}" y="${y}" width="24" height="18" fill="${mixc(cc,"#ffffff",.5)}"/>`).join("")}
   <path d="M0 238 Q120 226 220 236 Q320 246 400 232 L400 300 L0 300Z" fill="#D8B47E"/>`);
};

/* ---------- YUGURUVCHI QAHRAMON (orqadan ko'rinish) ----------
   g: "m" | "f"; k: libos (SKINS ichidan obyekt); pose: 0..3 yugurish, "jump", "slide" */
window.SKINS = {
  m: [
    {id:"m0", name:"Oddiy kiyim", top:"#4A90E2", pants:"#2F3E5C", hat:"hair", rare:"oddiy"},
    {id:"m1", name:"Chust do'ppi", top:"#4A90E2", pants:"#2F3E5C", hat:"doppi", rare:"oddiy"},
    {id:"m2", name:"Yo'l-yo'l chopon", top:"chopon", pants:"#2F3E5C", hat:"doppi", rare:"noyob"},
    {id:"m3", name:"Sport kiyimi", top:"#E5484D", pants:"#E5484D", stripe:"#fff", hat:"cap", capC:"#1F2937", rare:"noyob"},
    {id:"m4", name:"Oq jubba", top:"#FBFBF6", pants:"#FBFBF6", hat:"doppi", long:1, rare:"epik"},
    {id:"m5", name:"Zarrin bisht", top:"#FBFBF6", pants:"#FBFBF6", hat:"gutra", long:1, cape:"#4A2E1C", trim:"#E0B54A", rare:"afsonaviy"}
  ],
  f: [
    {id:"f0", name:"Oddiy ko'ylak", top:"#F49AC1", pants:"#F49AC1", hat:"braid", long:1, rare:"oddiy"},
    {id:"f1", name:"Gulli ro'mol", top:"#F49AC1", pants:"#F49AC1", hat:"scarf", scarfC:"#E86FA6", long:1, rare:"oddiy"},
    {id:"f2", name:"Atlas ko'ylak", top:"atlas", pants:"atlas", hat:"scarf", scarfC:"#E86FA6", long:1, rare:"noyob"},
    {id:"f3", name:"Sport kiyimi", top:"#8B5CF6", pants:"#8B5CF6", stripe:"#fff", hat:"scarf", scarfC:"#C4B5FD", rare:"noyob"},
    {id:"f4", name:"Oq hijob", top:"#FFFDF7", pants:"#FFFDF7", hat:"hijab", scarfC:"#FFFDF7", long:1, rare:"epik"},
    {id:"f5", name:"Zarrin libos", top:"#3B2350", pants:"#3B2350", hat:"hijab", scarfC:"#FFFDF7", trim:"#E0B54A", long:1, rare:"afsonaviy"}
  ]
};
window.heroBackSVG = function(g, k, pose){
  const id = "hb" + (++uid);
  const sw = typeof pose === "number" ? [0, 1, 0, -1][pose % 4] : 0, jump = pose === "jump", slide = pose === "slide";
  const pat = k.top === "chopon" ? `url(#${id}c)` : k.top === "atlas" ? `url(#${id}a)` : k.top;
  const pc = k.pants === "atlas" ? `url(#${id}a)` : k.pants;
  const defs = `<defs><pattern id="${id}c" width="6" height="8" patternUnits="userSpaceOnUse"><rect width="6" height="8" fill="#2F6E9E"/><rect width="2" height="8" fill="#4FA36B"/><rect x="4" width="1" height="8" fill="#F2D16B"/></pattern>
    <pattern id="${id}a" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#E5484D"/><path d="M0 7 L3.5 0 L7 7 L3.5 14Z" fill="#F5B83D"/><path d="M7 7 L10.5 0 L14 7 L10.5 14Z" fill="#2F6FDB"/></pattern>
    <pattern id="${id}r" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="${k.scarfC||"#E86FA6"}"/><circle cx="3" cy="3" r="1.6" fill="#fff" opacity=".85"/><circle cx="8" cy="8" r="1.2" fill="#FFE07A"/></pattern></defs>`;
  let p = "";
  /* oyoqlar */
  const lg = (x, a) => `<g transform="rotate(${a} ${x} 104)"><rect x="${x-5.5}" y="102" width="11" height="34" rx="5" fill="${pc}"/><ellipse cx="${x}" cy="138" rx="7.5" ry="5" fill="#3A2A20"/></g>`;
  if (slide) p += `<g transform="translate(0 30)">`;
  if (jump) p += lg(41, -18) + lg(59, 18);
  else if (slide) p += `<rect x="30" y="96" width="40" height="12" rx="6" fill="${pc}"/>`;
  else p += lg(41, sw * 22) + lg(59, -sw * 22);
  /* tana */
  const body = k.long ? `<path d="M29 66 Q50 58 71 66 L76 ${slide?110:124} L24 ${slide?110:124}Z" fill="${pat}"/>` : `<rect x="29" y="64" width="42" height="46" rx="12" fill="${pat}"/>`;
  /* qo'llar */
  const arm = (x, a) => `<g transform="rotate(${a} ${x} 70)"><rect x="${x-6}" y="68" width="12" height="32" rx="6" fill="${pat}"/><circle cx="${x}" cy="102" r="5.5" fill="${SK}"/></g>`;
  if (k.cape) p += `<path d="M30 64 L18 128 L82 128 L70 64 Q50 56 30 64Z" fill="${k.cape}" stroke="${k.trim}" stroke-width="3"/>`;
  p += arm(24, jump ? 150 : -sw * 30 + 8) + arm(76, jump ? -150 : sw * 30 - 8);
  p += body;
  if (k.stripe) p += `<path d="M50 64 V110" stroke="${k.stripe}" stroke-width="3"/><path d="M29 72 H71" stroke="${k.stripe}" stroke-width="2.5" opacity=".7"/>`;
  if (k.trim) p += `<path d="M30 66 Q50 58 70 66" stroke="${k.trim}" stroke-width="3" fill="none"/>`;
  /* bosh (orqadan) */
  p += `<rect x="44" y="52" width="12" height="14" fill="${SK}"/>`;
  const H = k.hat;
  if (H === "scarf" || H === "hijab"){
    const sc = H === "hijab" ? (k.scarfC || "#FFFDF7") : `url(#${id}r)`;
    p += `<path d="M20 40 Q19 7 50 7 Q81 7 80 40 Q83 66 ${H==="hijab"?"78 92 L22 92 Q17 66":"72 76 L28 76 Q17 64"} 20 40Z" fill="${sc}" ${k.trim?`stroke="${k.trim}" stroke-width="2.4"`:""}/>`;
    if (H === "scarf") p += `<path d="M42 70 L50 84 L58 70Z" fill="#D45A8E"/>`;
  } else {
    p += `<circle cx="23" cy="40" r="5" fill="${SK}"/><circle cx="77" cy="40" r="5" fill="${SK}"/>`;
    p += `<circle cx="50" cy="38" r="27" fill="${HAIR}"/><path d="M28 52 Q50 64 72 52 L70 46 Q50 54 30 46Z" fill="#2A1C14"/>`;
    if (H === "braid") p += `<path d="M46 60 Q44 80 48 96 L52 96 Q56 80 54 60Z" fill="${HAIR}"/><circle cx="50" cy="98" r="4" fill="#E5484D"/>`;
    if (H === "doppi") p += `<path d="M24 28 Q26 9 50 9 Q74 9 76 28 L76 31 L24 31Z" fill="#1E1E24"/><rect x="24" y="28" width="52" height="3" fill="#fff" opacity=".85"/>${[32,44,56,68].map(x=>`<ellipse cx="${x}" cy="20" rx="2.6" ry="5" fill="#fff" transform="rotate(${x<50?-20:20} ${x} 20)"/>`).join("")}`;
    if (H === "cap") p += `<path d="M23 30 Q25 8 50 8 Q75 8 77 30Z" fill="${k.capC||"#1F2937"}"/><rect x="40" y="26" width="20" height="5" rx="2" fill="#fff" opacity=".6"/>`;
    if (H === "gutra") p += `<path d="M19 38 Q21 6 50 6 Q79 6 81 38 L86 86 Q70 76 66 62 L34 62 Q30 76 14 86Z" fill="#fff" stroke="#E6E6DC"/><ellipse cx="50" cy="16" rx="27" ry="5.5" fill="none" stroke="#151515" stroke-width="3.2"/><ellipse cx="50" cy="12" rx="24" ry="4.5" fill="none" stroke="#151515" stroke-width="2.6"/>`;
  }
  if (slide) p += `</g>`;
  return vol(`<svg viewBox="0 0 100 150" aria-hidden="true">${defs}${p}</svg>`);
};
/* old tomondan (kiyim tanlash oynasi uchun) */
window.heroFrontSkin = function(g, k){
  const map = {m0:0, m1:1, m2:2, m3:1, m4:4, m5:6, f0:0, f1:1, f2:2, f3:1, f4:5, f5:6};
  if (k.id !== "m3" && k.id !== "f3") return heroSVG(g, map[k.id] || 0, "idle");
  window.VOL_ON = false; let s = heroSVG(g, 1, "idle"); window.VOL_ON = true;
  s = g === "m" ? s.replace(/#7FB7E6/g, "#E5484D").replace(/#3E5C8A/g, "#E5484D").replace(/<rect x="25" y="31" width="50" height="3"[^>]*>/, "") : s.replace(/#F49AC1/g, "#8B5CF6");
  return vol(s);
};
/* yugurish yo'lidagi to'siqlar */
window.runObjSVG = function(t){
  switch(t){
    case "barrier": return svgWrap(`<rect x="8" y="30" width="8" height="40" fill="#8A5A34"/><rect x="104" y="30" width="8" height="40" fill="#8A5A34"/>
      <rect x="2" y="22" width="116" height="22" rx="4" fill="#FFFFFF"/>${[0,1,2,3,4,5].map(i=>`<path d="M${6+i*20} 22 L${18+i*20} 22 L${8+i*20} 44 L${-4+i*20} 44Z" fill="#E5484D"/>`).join("")}<rect x="2" y="22" width="116" height="22" rx="4" fill="none" stroke="#B22C30" stroke-width="2"/>`, "0 0 120 72");
    case "bar": return svgWrap(`<rect x="6" y="0" width="10" height="120" fill="#6B4A2E"/><rect x="104" y="0" width="10" height="120" fill="#6B4A2E"/>
      <rect x="0" y="10" width="120" height="30" rx="6" fill="#2F80ED"/><text x="60" y="31" font-size="16" font-weight="800" text-anchor="middle" fill="#fff" font-family="sans-serif">EGIL!</text><path d="M14 46 Q60 58 106 46" stroke="#F2D16B" stroke-width="3" fill="none"/>`, "0 0 120 120");
    case "cart": return svgWrap(`<path d="M8 40 L112 40 L104 86 L16 86Z" fill="#C9824A"/><path d="M8 40 L112 40" stroke="#8A5A34" stroke-width="5"/>${[30,52,74,96].map(x=>`<path d="M${x} 44 V84" stroke="#A86A36" stroke-width="3"/>`).join("")}
      ${[[30,30,"#E5484D"],[52,24,"#FFB020"],[74,30,"#4FB35E"],[92,26,"#E5484D"],[42,18,"#FFB020"],[64,16,"#E5484D"]].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="11" fill="${c}"/>`).join("")}
      <circle cx="30" cy="94" r="12" fill="#3A2A20"/><circle cx="90" cy="94" r="12" fill="#3A2A20"/><circle cx="30" cy="94" r="4" fill="#C9C9C9"/><circle cx="90" cy="94" r="4" fill="#C9C9C9"/>`, "0 0 120 108");
    case "lamp": return svgWrap(`<rect x="18" y="20" width="5" height="120" fill="#3E4A5C"/><path d="M20 22 Q20 8 34 8" stroke="#3E4A5C" stroke-width="4" fill="none"/><rect x="28" y="6" width="14" height="10" rx="3" fill="#FFE08A"/><rect x="12" y="136" width="17" height="6" rx="2" fill="#3E4A5C"/>`, "0 0 44 144");
    case "minaret": return svgWrap(`<rect x="14" y="30" width="22" height="150" fill="#E9D2A6"/>${[60,100,140].map(y=>`<path d="M14 ${y} H36" stroke="#2E9BD6" stroke-width="5"/>`).join("")}<rect x="10" y="24" width="30" height="10" fill="#2E9BD6"/><path d="M14 24 Q25 0 36 24Z" fill="#2E9BD6"/><rect x="24" y="0" width="2" height="8" fill="#F2D16B"/>`, "0 0 50 180");
    case "pine": return svgWrap(`<rect x="27" y="110" width="8" height="30" fill="#7A4E2A"/><path d="M31 6 L56 52 L44 52 L62 86 L46 86 L64 118 L-2 118 L16 86 L0 86 L18 52 L6 52Z" fill="#2E8B57"/>`, "0 0 62 140");
    default: return "";
  }
};
})();
