/* Odobim — Telegram Mini App */
(function(){
"use strict";
const tg = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData !== undefined ? window.Telegram.WebApp : null;
const CFG = Object.assign({api:"", bot:"odobimbot"}, window.MUHIBZIYO_CONFIG || {});
if (tg) { try { tg.ready(); tg.expand(); } catch(e){} }
const TGU = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || null;

/* ---------- yordamchilar ---------- */
const $ = (s,r=document) => r.querySelector(s);
const $$ = (s,r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s==null?"":s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ic = (n,c="") => `<svg class="ico ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const pad = n => String(n).padStart(2,"0");
const dayKey = (d=new Date()) => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const yKey = () => dayKey(new Date(Date.now()-864e5));
const weekKey = (d=new Date()) => { const x=new Date(d); x.setDate(x.getDate()-((x.getDay()+6)%7)); return dayKey(x); };
const haptic = (k,t) => { try { if(!tg) return; k==="n" ? tg.HapticFeedback.notificationOccurred(t) : tg.HapticFeedback.impactOccurred(t||"light"); } catch(e){} };

/* ---------- holat ---------- */
/* Alohida o'yin rejimi: config.js da window.ODOBIM_ONLY = true bo'lsa, ilova to'g'ridan-to'g'ri Odobim'dan ochiladi */
const OD_ONLY = !!window.ODOBIM_ONLY;
const KEY = window.ODOBIM_KEY || (OD_ONLY ? "odobim_game_v1" : "muhibziyo_v1");
const defState = () => ({
  onboarded:false, registered:false, lang:"uz", theme:"auto", sound:true, notify:true,
  user:{nick:"", name:"", surname:"", gender:"", age:""}, regDate:"", sysId:null, invitedBy:null, phone:false,
  stars:0, hilol:0, weekKey:weekKey(), earn:{day:"",dayN:0,week:"",weekN:0,all:0},
  streak:{n:0,last:""}, rnd:{day:"",left:5}, cool:{}, pins:[], loc:null, pn:{on:false, asked:false, mask:["fajr","dhuhr","asr","maghrib","isha"], before:0},
  tas:{day:"",n:0,stars:0,mode:"zikr",zi:0,zc:0,free:33,fc:0,ni:0,full:0,streak:{n:0,last:""}},
  gifts:[], contact:{}, friends:[], refWeek:{week:"",n:0},
  od:{group:null,xp:0,hearts:5,heartTs:Date.now(),done:{kids:[],teens:[]},lastDay:null,streak:0}, kids:[], kidId:null, parent:{pin:"",tts:true,sfx:true,report:true}
});
let S = (() => { try { const r = localStorage.getItem(KEY); if (r) { const o = JSON.parse(r), d = defState();
  return Object.assign(d, o, {user:Object.assign(d.user,o.user||{}), tas:Object.assign(d.tas,o.tas||{}), pn:Object.assign(d.pn,o.pn||{}), od:Object.assign(d.od,o.od||{}), earn:Object.assign(d.earn,o.earn||{})}); } } catch(e){} return defState(); })();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} };
function rollover(){
  const wk = weekKey();
  S.weekKey = wk;
  if (S.streak.last && S.streak.last !== dayKey() && S.streak.last !== yKey()) S.streak.n = 0;
  if (S.tas.day !== dayKey()) { S.tas.day = dayKey(); S.tas.n = 0; S.tas.stars = 0; }
  if (S.rnd.day !== dayKey()) { S.rnd.day = dayKey(); S.rnd.left = 5; }
  save();
}
function addStars(n){
  if (n<=0) return;
  S.stars += n;
  const e = S.earn, d = dayKey(), w = weekKey();
  if (e.day!==d){ e.day=d; e.dayN=0; } if (e.week!==w){ e.week=w; e.weekN=0; }
  e.dayN += n; e.weekN += n; e.all += n; save(); paintCounters();
}
function markStreak(){
  if (S.streak.last === dayKey()) return 0;
  S.streak.n = S.streak.last === yKey() ? S.streak.n+1 : 1;
  S.streak.last = dayKey();
  let bonus = 0;
  if (S.streak.n % 7 === 0) { addStars(21); bonus = 1; }
  save(); return bonus;
}

/* ---------- server (ixtiyoriy) ---------- */
const API = {
  on: !!CFG.api,
  async call(path, body){
    if (!this.on) return null;
    try {
      const r = await fetch(CFG.api.replace(/\/$/,"")+path, {method: body?"POST":"GET",
        headers: {"Content-Type":"application/json","X-Init-Data": tg ? tg.initData : ""}, body: body?JSON.stringify(body):undefined});
      if (!r.ok) return null; return await r.json();
    } catch(e){ return null; }
  },
  event(kind, data){ return this.call("/api/event", Object.assign({kind}, data||{})).then(syncUser); }
};
function syncUser(res){
  if (!res || !res.user) return res;
  const u = res.user; S.stars = u.stars; S.sysId = u.id; if (u.invited_by) S.invitedBy = u.invited_by;
  if (u.friends!=null) S.friendsN = u.friends; save(); paintCounters(); return res;
}

/* ---------- til ---------- */
const UI = {
 uz:{home:"Asosiy", quiz:"Quiz", gifts:"Sovg'alar", profile:"Profil", next:"Keyingi", start:"Boshlash", skip:"O'tkazib yuborish", close:"Yopish", save:"Saqlash", back:"Orqaga", more:"Yana",
  name:"Ismingiz", gender:"Jins", male:"Erkak", female:"Ayol", age:"Yoshingiz", lang:"Til", look:"Ko'rinish", auto:"Avto", light:"Yorug'", dark:"Tungi",
  streak:"Ketma-ketlik", left:"qoldi", tasbeh:"Tasbeh", qibla:"Qibla", fx:"Valyuta", odobim:"Odobim", near:"Eng yaqin", nearSub:"Masjid · Restoran · Ziyoratgoh",
  share:"Do'stlaringizga ulashing!", shareSub:"Har do'st uchun", shareSub2:"do'stingizga esa", send:"Yuborish", details:"Batafsil", places:"Ziyoratgohlar", unis:"Universitetlar",
  prayer:"Namoz vaqtlari", nextP:"Keyingi", makkah:"Makka", madinah:"Madina", fajr:"Bomdod", sunrise:"Quyosh", dhuhr:"Peshin", asr:"Asr", maghrib:"Shom", isha:"Xufton",
  rndQuiz:"Tasodifiy quiz", rndSub:"10 savol · har to'g'ri javob 2 yulduz", todayLeft:"Bugun qoldi", all:"Hammasi", pinned:"Pin qilingan", unpinned:"Pin qilinmagan", pin:"Pin", qs:"savol",
  exitQuiz:"Quizdan chiqasizmi? Natija saqlanmaydi.", exit:"Chiqish", cancel:"Bekor qilish", board:"Reyting", today:"Bugun", week:"Hafta", allTime:"Butun davr",
  notRanked:"Reytingda hali yo'qsiz", invite:"Do'stlarni taklif qilish", guide:"Qo'llanma", personal:"Shaxsiy ma'lumotlar", settings:"Sozlamalar", account:"Hisob ma'lumotlari",
  nick:"Taxallus", firstName:"Ism", surname:"Familiya", sound:"Ovoz effektlari", notifs:"Bildirishnomalar", phone:"Telefon raqam", connect:"Ulash", invitedBy:"Taklif qilgan", registered:"Ro'yxatdan o'tgan", sysId:"Tizim ID",
  friends:"Do'stlar", weekStars:"Bu hafta yulduz", weekBonus:"Bu haftalik bonus", invitedList:"Taklif qilinganlar", noFriends:"Hali hech kim qo'shilmagan",
  restart:"Boshdan", todayStars:"Bugun", zstreak:"Zikr streak", fullRead:"To'liq o'qildi", zikr:"Zikr", free:"Erkin", names99:"99 ism",
  locate:"Joylashuvni aniqlash", needLoc:"Yaqin joylarni ko'rish uchun joylashuvingizni ulang", mosques:"Masjidlar", restaurants:"Restoranlar",
  openMap:"Xaritada ochish", history:"Tarixi", visit:"Borish va vaqtlar", sources:"Manbalar", freeEntry:"Bepul", ticket:"Biletli",
  edu:"Ta'lim", faculties:"Fakultetlar", admission:"Qabul va stipendiya", site:"Rasmiy sayt", portal:"Qabul portali", grant:"Grant",
  rates:"Kurslar", approx:"taxminiy kurs", exchange:"Almashtirish", correct:"To'g'ri!", wrong:"Noto'g'ri", timeUp:"Vaqt tugadi",
  resultTitle:"Quiz yakunlandi", earned:"Yig'ildi", accuracy:"Aniqlik", again:"Yana", toHome:"Bosh sahifa", practice:"Mashq rejimi",
  get:"Olish", feed:"Lenta", tips:"Maslahatlar", rules:"Qoidalar", myHist:"Tarix", noPermit:"Hozircha ruxsatnoma olmagansiz",
  continue:"Davom etish", copied:"Havola nusxalandi"},
 ru:{home:"Главная", quiz:"Квиз", gifts:"Подарки", profile:"Профиль", next:"Далее", start:"Начать", skip:"Пропустить", close:"Закрыть", save:"Сохранить", back:"Назад", more:"Ещё",
  name:"Ваше имя", gender:"Пол", male:"Мужской", female:"Женский", age:"Возраст", lang:"Язык", look:"Тема", auto:"Авто", light:"Светлая", dark:"Тёмная",
  streak:"Серия", left:"осталось", tasbeh:"Тасбих", qibla:"Кибла", fx:"Валюта", odobim:"Одобим", near:"Рядом", nearSub:"Мечеть · Ресторан · Места зиярата",
  share:"Поделитесь с друзьями!", shareSub:"За каждого друга", shareSub2:"другу", send:"Отправить", details:"Подробнее", places:"Места зиярата", unis:"Университеты",
  prayer:"Время намаза", nextP:"Следующий", makkah:"Мекка", madinah:"Медина", fajr:"Фаджр", sunrise:"Восход", dhuhr:"Зухр", asr:"Аср", maghrib:"Магриб", isha:"Иша",
  rndQuiz:"Случайный квиз", rndSub:"10 вопросов · 2 звезды за ответ", todayLeft:"Осталось сегодня", all:"Все", pinned:"Закреплённые", unpinned:"Остальные", pin:"Закрепить", qs:"вопросов",
  exitQuiz:"Выйти из квиза? Результат не сохранится.", exit:"Выйти", cancel:"Отмена", board:"Рейтинг", today:"Сегодня", week:"Неделя", allTime:"Всё время",
  notRanked:"Вас пока нет в рейтинге", invite:"Пригласить друзей", guide:"Руководство", personal:"Личные данные", settings:"Настройки", account:"Данные аккаунта",
  nick:"Никнейм", firstName:"Имя", surname:"Фамилия", sound:"Звуки", notifs:"Уведомления", phone:"Телефон", connect:"Привязать", invitedBy:"Пригласил", registered:"Регистрация", sysId:"ID в системе",
  friends:"Друзья", weekStars:"Звёзд за неделю", weekBonus:"Бонус недели", invitedList:"Приглашённые", noFriends:"Пока никто не присоединился",
  restart:"Сначала", todayStars:"Сегодня", zstreak:"Серия зикра", fullRead:"Прочитано", zikr:"Зикр", free:"Свободный", names99:"99 имён",
  locate:"Определить местоположение", needLoc:"Чтобы увидеть места рядом, включите геолокацию", mosques:"Мечети", restaurants:"Рестораны",
  openMap:"Открыть на карте", history:"История", visit:"Как добраться", sources:"Источники", freeEntry:"Бесплатно", ticket:"Платно",
  edu:"Обучение", faculties:"Факультеты", admission:"Поступление и стипендия", site:"Официальный сайт", portal:"Портал приёма", grant:"Грант",
  rates:"Курсы", approx:"примерный курс", exchange:"Обменять", correct:"Верно!", wrong:"Неверно", timeUp:"Время вышло",
  resultTitle:"Квиз завершён", earned:"Получено", accuracy:"Точность", again:"Ещё раз", toHome:"На главную", practice:"Режим практики",
  get:"Получить", feed:"Лента", tips:"Советы", rules:"Правила", myHist:"История", noPermit:"У вас пока нет разрешений",
  continue:"Продолжить", copied:"Ссылка скопирована"}
};
function cyr(s){
  const M={a:"а",b:"б",d:"д",e:"е",f:"ф",g:"г",h:"ҳ",i:"и",j:"ж",k:"к",l:"л",m:"м",n:"н",o:"о",p:"п",q:"қ",r:"р",s:"с",t:"т",u:"у",v:"в",x:"х",y:"й",z:"з",c:"с",w:"в"};
  const D={"o'":"ў","g'":"ғ",sh:"ш",ch:"ч",yo:"ё",yu:"ю",ya:"я",ye:"е"};
  return String(s).replace(/([OoGg])[ʻ'‘’`]|[Ss][Hh]|[Cc][Hh]|[Yy][OoUuAaEe]|[ʻ'‘’`]|[A-Za-z]/g, (...a)=>{
    const m=a[0], off=a[a.length-2], str=a[a.length-1], l=m.toLowerCase().replace(/[ʻ‘’`]/,"'");
    let out;
    if (D[l]) out=D[l];
    else if (l==="'") return "ъ";
    else if (l==="e") out = /[A-Za-zʻ'‘’]/.test(off>0?str[off-1]:"") ? "е" : "э";
    else out = M[l] || m;
    return m[0]!==m[0].toLowerCase() ? out[0].toUpperCase()+out.slice(1) : out;
  });
}
const L = () => S.lang;
const t = k => { const v = (L()==="ru" ? UI.ru[k] : UI.uz[k]) || UI.uz[k] || k; return L()==="uzc" ? cyr(v) : v; };
const tx = s => L()==="uzc" ? cyr(s) : s;   // mazmun matni (o'zbekcha)

/* ---------- mavzu ---------- */
function applyTheme(){
  const th = S.theme==="auto" ? ((tg && tg.colorScheme) || (matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")) : S.theme;
  document.documentElement.setAttribute("data-theme", th);
  try { if (tg) { const bg = getComputedStyle(document.body).getPropertyValue("--bg").trim(); tg.setHeaderColor(bg); tg.setBackgroundColor(bg); } } catch(e){}
}

/* ---------- ovoz ---------- */
let actx = null;
function tick(f=880){ if(!S.sound) return; try{ actx = actx || new (window.AudioContext||window.webkitAudioContext)(); const o=actx.createOscillator(), g=actx.createGain(); o.frequency.value=f; g.gain.value=.04; o.connect(g); g.connect(actx.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime+.08); o.stop(actx.currentTime+.09);}catch(e){} }

/* ---------- namoz vaqtlari (istalgan shahar / joylashuv) ---------- */
const deviceTz = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch(e){ return "UTC"; } };
function tzOffsetH(tz, date){ // shu kun uchun soat mintaqasi farqi (soatlarda)
  try { const p = new Intl.DateTimeFormat("en-US",{timeZone:tz, hour12:false, year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric"}).formatToParts(date);
    const g=k=>+p.find(x=>x.type===k).value; const asUTC = Date.UTC(g("year"),g("month")-1,g("day"),g("hour")%24,g("minute")); return Math.round((asUTC - Math.floor(date.getTime()/6e4)*6e4)/6e4)/60; }
  catch(e){ return -date.getTimezoneOffset()/60; } }
function localYMD(tz, date){ try { const p=new Intl.DateTimeFormat("en-CA",{timeZone:tz,year:"numeric",month:"2-digit",day:"2-digit"}).format(date).split("-"); return [+p[0],+p[1],+p[2]]; } catch(e){ return [date.getFullYear(),date.getMonth()+1,date.getDate()]; } }
function methodFor(loc){ return loc.method || PT_COUNTRY_METHOD[loc.cc] || ({"Asia/Tashkent":"uzb","Asia/Samarkand":"uzb","Asia/Riyadh":"umm","Europe/Istanbul":"diyanet","Asia/Dubai":"dubai","Africa/Cairo":"egypt","Asia/Karachi":"karachi","Europe/Moscow":"rus","Asia/Dushanbe":"uzb","Asia/Bishkek":"uzb"}[loc.tz]) || (/^America\//.test(loc.tz)?"isna":"mwl"); }
function asrFor(loc){ return loc.asr || PT_METHODS[methodFor(loc)].a; }
function defaultLoc(){ const tz = deviceTz(); const c = PT_CITIES.find(x=>x.tz===tz) || PT_CITIES[0]; return Object.assign({}, c, {seenTz: tz}); }
const curLoc = () => { if (!S.loc || !S.loc.tz) { S.loc = defaultLoc(); save(); } return S.loc; };
const PT = (()=>{const D=Math.PI/180, sn=d=>Math.sin(d*D), cs=d=>Math.cos(d*D), tn=d=>Math.tan(d*D), asn=x=>Math.asin(x)/D, acs=x=>Math.acos(x)/D, at2=(y,x)=>Math.atan2(y,x)/D, acot=x=>Math.atan(1/x)/D, fA=a=>a-360*Math.floor(a/360), fH=a=>a-24*Math.floor(a/24);
  const jul=(y,m,d)=>{if(m<=2){y--;m+=12;}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5;};
  const sun=jd=>{const d=jd-2451545,g=fA(357.529+.98560028*d),q=fA(280.459+.98564736*d),Lm=fA(q+1.915*sn(g)+.02*sn(2*g)),e=23.439-.00000036*d,RA=at2(cs(e)*sn(Lm),cs(Lm))/15;return{decl:asn(sn(e)*sn(Lm)),eqt:q/15-fH(RA)};};
  return (date, loc)=>{ loc = loc || curLoc(); const M = PT_METHODS[methodFor(loc)], {lat,lng,tz} = loc;
    const [y,m,d] = localYMD(tz, date), off = tzOffsetH(tz, new Date(Date.UTC(y,m-1,d,12))), jd = jul(y,m,d)-lng/360;
    const mid=x=>fH(12-sun(jd+x).eqt), ang=(a,x,ccw)=>{const s=sun(jd+x),c=(-sn(a)-sn(s.decl)*sn(lat))/(cs(s.decl)*cs(lat)); if (c<-1||c>1) return NaN; const T=acs(c)/15; return mid(x)+(ccw?-T:T);},
      asr=(f,x)=>{const s=sun(jd+x);return ang(-acot(f+tn(Math.abs(lat-s.decl))),x);}, adj=h=>h+off-lng/15;
    const r={sunrise:adj(ang(.833,6/24,true)), dhuhr:adj(mid(.5)), asr:adj((a0=>{ let a = asr(asrFor(loc), 13/24); for (let i=0;i<2 && !isNaN(a);i++) a = asr(asrFor(loc), a/24); return a; })()), maghrib:adj(ang(.833,.75))};
    r.fajr = adj(ang(M.f,5/24,true));
    r.isha = M.im ? r.maghrib + (M.im + (M.ram && hijri(date).m===9 ? M.ram : 0))/60 : adj(ang(M.i,.75));
    // shimoliy kengliklarda (yozda) burchak yetmasa: tunning 1/7 qismi qoidasi
    const night = 24 - (r.maghrib - r.sunrise);
    if (isNaN(r.fajr) || r.sunrise - r.fajr > night/2) r.fajr = r.sunrise - night/7;
    if (isNaN(r.isha) || r.isha - r.maghrib > night/2) r.isha = r.maghrib + night/7;
    const A = M.adj || {}; for (const k in A) r[k] += A[k]/60;
    const base = Date.UTC(y,m-1,d) - off*36e5, out = {};
    for (const k in r) out[k] = base + Math.round(r[k]*60)*6e4;
    return out; };
})();
const HM = ["Muharram","Safar","Rabi'ul avval","Rabi'ul oxir","Jumodul avval","Jumodul oxir","Rajab","Sha'bon","Ramazon","Shavvol","Zulqa'da","Zulhijja"];
function hijri(date){ try { const p = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn",{day:"numeric",month:"numeric",year:"numeric",timeZone:"Asia/Riyadh"}).formatToParts(date); const g=k=>+(p.find(x=>x.type===k)||{}).value; return {d:g("day"),m:g("month"),y:parseInt(g("year"))}; } catch(e){ return {d:0,m:0,y:0}; } }
const fmtT = (ms, loc) => { try { return new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:(loc||curLoc()).tz}).format(new Date(ms)); } catch(e){ return "--:--"; } };
const PKEYS = ["fajr","sunrise","dhuhr","asr","maghrib","isha"];
function nextPrayer(loc){
  loc = loc || curLoc(); const n = Date.now(), td = PT(new Date(), loc);
  for (const k of PKEYS) { if (k==="sunrise") continue; if (td[k] > n) return {k, at:td[k], all:td}; }
  const tm = PT(new Date(n+864e5), loc); return {k:"fajr", at:tm.fajr, all:td};
}
const locName = loc => loc.id==="gps" ? (loc.near ? tx(loc.near)+" " + tx(L()==="ru"?"(рядом)":"(yaqin)") : tx(L()==="ru"?"Моё место":"Mening joyim")) : tx(loc.name);
function setLoc(loc){ S.loc = Object.assign({seenTz: deviceTz()}, loc); save(); syncPrayer(); }
function syncPrayer(){ if (!API.on) return; const l = curLoc();
  API.call("/api/prayer", {loc:{lat:l.lat, lng:l.lng, tz:l.tz, method:methodFor(l), asr:l.asr||null, name:locName(l)}, on:!!S.pn.on, mask:S.pn.mask, before:S.pn.before}); }
function enablePrayerNotify(on, done){
  const fin = ok => { S.pn.on = ok; S.pn.asked = true; save(); syncPrayer(); haptic("n", ok?"success":"warning");
    toast(ok ? (API.on ? tx(L()==="ru"?"Напоминания включены — сообщение придёт от бота":"Eslatmalar yoqildi — har namoz vaqtida bot xabar yuboradi") : tx(L()==="ru"?"Сохранено. Напоминания заработают после подключения сервера бота.":"Saqlandi. Eslatmalar bot serveri ulanganda ishlaydi.")) : tx(L()==="ru"?"Напоминания выключены":"Eslatmalar o'chirildi")); done && done(); };
  if (!on) return fin(false);
  try { if (tg && tg.requestWriteAccess) return tg.requestWriteAccess(ok => fin(!!ok)); } catch(e){}
  fin(true);
}
function locateMe(done){
  getLoc(pos=>{ let best=null, bd=1e9; for (const c of PT_CITIES){ const d=dist(pos,c); if (d<bd){ bd=d; best=c; } }
    const tz = deviceTz();
    setLoc({id:"gps", name:"", lat:+pos.lat.toFixed(4), lng:+pos.lng.toFixed(4), tz, cc: bd<150 ? best.cc : "", near: bd<60 ? best.name : "", method: S.loc && S.loc.id==="gps" ? S.loc.method : undefined, asr: S.loc && S.loc.asr});
    toast(tx(L()==="ru"?"Время намаза обновлено по вашему местоположению":"Namoz vaqtlari joylashuvingiz bo'yicha yangilandi")); done && done(); });
}
const dur = ms => { ms=Math.max(0,ms); const h=Math.floor(ms/36e5), m=Math.floor(ms%36e5/6e4); return (h?h+(L()==="ru"?"ч ":"s "):"")+m+(L()==="ru"?"м":"m"); };

/* ---------- ilova qobig'i ---------- */
const app = $("#app"), nav = $("#nav");
let tab = "home", stack = [], quizTimer = null, clockTimer = null;
function go(name, p){ stack.push({name, p}); render(true); }
function back(){ if (overlay()) return; if (OD_ONLY && stack.length <= 1){ try { if (window.parent !== window) window.parent.postMessage({odobim:"back"}, "*"); else location.href = "../?v=" + Date.now(); } catch(e){} return; } if (stack.length){ const top = stack[stack.length-1]; if (top.name==="run" && !top.p.done){ confirmExit(); return; } stack.pop(); render(true);} }
function setTab(tb){ tab = tb; stack = []; render(true); }
function overlay(){ const m = $(".modal"); if (m){ m.remove(); return true; } return false; }
nav.addEventListener("click", e=>{ const b=e.target.closest("button[data-tab]"); if(b){ tick(660); haptic("i","light"); setTab(b.dataset.tab); } });
if (tg) try { tg.BackButton.onClick(back); } catch(e){}

function render(scroll){
  clearInterval(clockTimer); clearInterval(quizTimer); rollover(); applyTheme();
  if (OD_ONLY){ if (!S.onboarded || !S.registered){ S.onboarded = S.registered = true; save(); } if (!stack.length) stack = [{name:"odobim", p:{}}]; }
  if (!S.onboarded) { nav.hidden = true; return renderOnboard(); }
  if (!S.registered) { nav.hidden = true; return renderRegister(); }
  const top = stack[stack.length-1];
  if (tg) try { (OD_ONLY || stack.length > 0) ? tg.BackButton.show() : tg.BackButton.hide(); } catch(e){}
  const full = OD_ONLY || (top && PAGES[top.name].full);
  nav.hidden = !!full; document.body.classList.toggle("has-nav", !full); document.body.classList.toggle("odroot", OD_ONLY && stack.length <= 1);
  $$("button[data-tab]", nav).forEach(b=>{ b.classList.toggle("on", b.dataset.tab===tab); b.querySelector("span").textContent = t(b.dataset.tab); });
  if (window.MUS && !(top && (GAME_PAGES.includes(top.name) || top.name==="odobim"))) MUS.stop();
  if (top) PAGES[top.name].fn(top.p||{}); else TABS[tab]();
  if (scroll) window.scrollTo(0,0);
}

function header(){
  return `<header class="hdr"><div class="brand">${LOGO}<b>MuhibZiyo</b></div></header>`;
}
function bindHeader(){ $$(".ctr").forEach(b=>b.onclick=()=>{ const c=b.dataset.c; c==="star" ? go("board") : streakSheet(); }); }
function paintCounters(){ const f=$("#c-fire"), s=$("#c-star"); if(f) f.textContent=S.streak.n; if(s) s.textContent=S.stars; }
function pageHead(title, sub){ return `<div class="phead"><button class="bk" data-back aria-label="${t("back")}">${ic("back")}</button><div><h1>${title}</h1>${sub?`<p>${sub}</p>`:""}</div></div>`; }
function bindBack(){ $$("[data-back]").forEach(b=>b.onclick=back); }
function toast(msg){ const d=document.createElement("div"); d.className="toast"; d.textContent=msg; document.body.appendChild(d); setTimeout(()=>d.remove(),2300); }
function sheet(html, bind){ overlay(); const m=document.createElement("div"); m.className="modal"; m.innerHTML=`<div class="sheet"><i class="grab"></i>${html}</div>`;
  m.addEventListener("click", e=>{ if(e.target===m || e.target.closest("[data-close]")) m.remove(); }); document.body.appendChild(m); bind && bind(m); return m; }
function openLink(u){ try { if (tg) { /^https:\/\/t\.me\//.test(u) ? tg.openTelegramLink(u) : tg.openLink(u); return; } } catch(e){} window.open(u, "_blank", "noopener"); }

const LOGO = `<svg class="logo" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="12" fill="var(--accent)"/><path d="M24.5 9.5a11 11 0 1 0 6 19.6A9 9 0 1 1 24.5 9.5z" fill="var(--on-accent)"/><path d="M27.6 13.2l1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2.1 1.1.4-2.3-1.7-1.6 2.3-.3z" fill="var(--gold)"/></svg>`;

/* ---------- onboarding ---------- */
const ONB = {
 uz:[["sparkle","Assalomu alaykum!","MuhibZiyo — oila uchun kundalik islomiy yordamchi.","Namoz vaqtlari, qibla, tasbeh, eng yaqin masjid va bolalar uchun Odobim o'yini — hammasi bir joyda.",""],
  ["clock","Namoz vaqtlari","Qayerda bo'lsangiz ham, o'sha joyning namoz vaqtlari.","Har namoz vaqtida bot sizga eslatma yuboradi.",""],
  ["compass","Qibla va masjid","Qibla yo'nalishini toping.","Eng yaqin masjidlarni xaritada ko'ring.",""],
  ["beads","Tasbeh","Zikrlaringizni sanab boring.","Tanlangan zikr va sonini o'zingiz belgilaysiz.",""],
  ["kid","Odobim — bolalar uchun","7–11 va 12–15 yosh: «Bola – odobi bilan aziz» kitobi asosida odob o'yini.","Do'stlarini taklif qilib, reytingda bellashadi.",""]],
 ru:[["sparkle","Ассаляму алейкум!","MuhibZiyo — ежедневный исламский помощник для семьи.","Время намаза, кибла, тасбих, ближайшая мечеть и игра Одобим для детей — всё в одном месте.",""],
  ["clock","Время намаза","Время намаза там, где вы находитесь.","Бот напоминает о каждом намазе.",""],
  ["compass","Кибла и мечеть","Найдите направление киблы.","Ближайшие мечети на карте.",""],
  ["beads","Тасбих","Считайте свои зикры.","Зикр и количество выбираете сами.",""],
  ["kid","Одобим — для детей","7–11 и 12–15 лет: игра об адабе по книге «Бола – одоби билан азиз».","Приглашают друзей и соревнуются в рейтинге.",""]]
};
let onbI = 0;
function langPills(){ return `<div class="pills">${[["uzc","Ўзбекча"],["uz","O'zbekcha"],["ru","Русский"]].map(([k,n])=>`<button class="pill ${S.lang===k?"on":""}" data-lang="${k}">${n}</button>`).join("")}</div>`; }
function bindLang(cb){ $$("[data-lang]").forEach(b=>b.onclick=()=>{ S.lang=b.dataset.lang; save(); cb(); }); }
function renderOnboard(){
  const set = L()==="ru" ? ONB.ru : ONB.uz, s = set[onbI], last = onbI===set.length-1;
  app.innerHTML = `<div class="onb">${langPills()}
    <div class="onb-card"><div class="onb-ic">${ic(s[0])}</div><h2>${tx(s[1])}</h2>${s.slice(2).filter(Boolean).map(p=>`<p>${tx(p)}</p>`).join("")}
      ${last?`<button class="btn gold wide" id="ob-go">${t("start")}</button>`:`<button class="fab" id="ob-next" aria-label="${t("next")}">${ic("arrow")}</button>`}</div>
    <div class="dots">${set.map((_,i)=>`<i class="${i===onbI?"on":""}"></i>`).join("")}</div>
    ${last?"":`<button class="btn ghost sm" id="ob-skip">${t("skip")}</button>`}</div>`;
  bindLang(renderOnboard);
  const done = ()=>{ S.onboarded = true; save(); render(true); };
  if ($("#ob-next")) $("#ob-next").onclick = ()=>{ onbI++; tick(); renderOnboard(); };
  if ($("#ob-skip")) $("#ob-skip").onclick = done;
  if ($("#ob-go")) $("#ob-go").onclick = done;
}
function renderRegister(){
  const u = S.user; if (!u.name) u.name = (TGU && (TGU.first_name||"")) || "";
  const seg = (k, opts) => `<div class="seg s${opts.length}">${opts.map(([v,n,i])=>`<button class="opt ${u[k]===v||S[k]===v?"on":""}" data-k="${k}" data-v="${v}">${i?ic(i):""}${n}</button>`).join("")}</div>`;
  app.innerHTML = `<div class="reg"><div class="reg-top">${LOGO}</div>
    <label class="lbl" for="r-name">${t("name")}</label><input id="r-name" class="inp" value="${esc(u.name)}" maxlength="40" autocomplete="given-name">
    <span class="lbl">${t("gender")}</span>${seg("gender",[["m",t("male")],["f",t("female")]])}
    <span class="lbl">${t("age")}</span>${seg("age",[["7-11","7-11"],["12-15","12-15"],["16-30","16-30"],["30+","30+"]])}
    <span class="lbl">${t("lang")}</span><div class="seg s3">${[["uzc","Ўзбекча"],["uz","O'zbekcha"],["ru","Русский"]].map(([k,n])=>`<button class="opt ${S.lang===k?"on":""}" data-lang="${k}">${n}</button>`).join("")}</div>
    <span class="lbl">${t("look")}</span>${seg("theme",[["auto",t("auto"),"auto"],["light",t("light"),"sun"],["dark",t("dark"),"moonf"]])}
    <button class="btn gold wide" id="r-go" disabled>${t("start")}</button></div>`;
  const check = ()=>{ $("#r-go").disabled = !(u.name.trim() && u.gender && u.age); };
  $("#r-name").oninput = e=>{ u.name = e.target.value; check(); };
  $$(".opt[data-k]").forEach(b=>b.onclick=()=>{ const k=b.dataset.k; if (k==="theme"){ S.theme=b.dataset.v; applyTheme(); } else u[k]=b.dataset.v; save(); $$(`.opt[data-k="${k}"]`).forEach(x=>x.classList.toggle("on",x===b)); check(); });
  bindLang(renderRegister); check();
  $("#r-go").onclick = ()=>{ S.registered = true; S.regDate = S.regDate || dayKey(); u.nick = u.nick || (TGU && TGU.username) || u.name; save();
    API.call("/api/register",{user:u, lang:S.lang}).then(syncUser); render(true); };
}

/* ---------- ASOSIY ---------- */
const TABS = {};
TABS.home = function(){
  const loc = curLoc(), np = nextPrayer(loc), all = PT(new Date(), loc), h = hijri(new Date());
  const tiles = [["tasbeh","beads",t("tasbeh")],["qibla","compass",t("qibla")],["nearM","mosque",tx(L()==="ru"?"Ближайшая мечеть":"Eng yaqin masjid")]];
  app.innerHTML = header() + `<div class="pbar"><button class="pnow" id="pbar">${ic("clock")}<b>${t(np.k)}</b><span class="tnum">${fmtT(np.at)}</span><span class="muted">· <span id="cd">${dur(np.at-Date.now())}</span></span></button>
      <button class="locchip" id="locbtn">${ic(loc.id==="gps"?"target":"pin")}<span>${esc(locName(loc))}</span>${ic("chev")}</button></div>
    ${loc.seenTz && loc.seenTz!==deviceTz() ? `<div class="travel"><span>${ic("nav")}</span><p>${tx(L()==="ru"?"Похоже, вы в другом месте. Обновить время намаза?":"Boshqa joydasiz shekilli. Namoz vaqtlarini yangilaymi?")}</p><button class="btn gold sm" id="tr-yes">${tx(L()==="ru"?"Обновить":"Yangilash")}</button><button class="icb" id="tr-no" aria-label="${t("close")}">${ic("x")}</button></div>` : ""}
    ${!S.pn.asked && !(loc.seenTz && loc.seenTz!==deviceTz()) ? `<div class="travel ask"><span>${ic("bell")}</span><p>${tx(L()==="ru"?"Получать напоминание в каждое время намаза?":"Har namoz vaqtida eslatma olasizmi?")}</p><button class="btn gold sm" id="pn-yes">${tx(L()==="ru"?"Включить":"Yoqish")}</button><button class="icb" id="pn-no" aria-label="${t("close")}">${ic("x")}</button></div>` : ""}
    <main class="wrap">
    <section class="card ptoday" id="ptoday"><div class="row"><span class="ib">${ic("clock")}</span><div><b>${t("prayer")}</b><small class="muted">${esc(tx(fmtDate(new Date(), loc.tz)))} · ${h.d} ${tx(HM[h.m-1]||"")} ${h.y}</small></div><span class="sp"></span>${ic("chev","chev")}</div>
      <div class="pgrid">${PKEYS.map(k=>`<div class="pg ${k===np.k?"on":""}"><span>${t(k)}</span><b class="tnum">${fmtT(all[k],loc)}</b></div>`).join("")}</div></section>
    <section class="card odb odbx" data-go="odobim"><div class="odb-art">${logoImg()}</div><div><b>${t("odobim")}</b><small>${tx(L()==="ru"?"Адаб для детей 7–15 лет — игра и соревнование с друзьями":"Bolalar uchun odob o'yini, 7–15 yosh — do'stlar bilan bellashuv")}</small><button class="btn sm teal" data-go="odobim">${ic("play")}${t("start")}</button></div></section>
    <nav class="tiles t3">${tiles.map(([k,i,n])=>`<button class="tile" data-go="${k}"><span>${ic(i)}</span>${n}</button>`).join("")}</nav>
    </main>`;
  bindHeader();
  $("#pbar").onclick = prayerSheet; $("#ptoday").onclick = prayerSheet;
  $("#locbtn").onclick = ()=>citySheet(()=>TABS.home());
  if ($("#pn-yes")){ $("#pn-yes").onclick = ()=>enablePrayerNotify(true, ()=>TABS.home()); $("#pn-no").onclick = ()=>{ S.pn.asked = true; save(); TABS.home(); }; }
  if ($("#tr-yes")){ $("#tr-yes").onclick = ()=>locateMe(()=>TABS.home()); $("#tr-no").onclick = ()=>{ S.loc.seenTz = deviceTz(); save(); TABS.home(); }; }
  bindGo();
  clockTimer = setInterval(()=>{ const cd=$("#cd"); if(!cd) return; const n2=nextPrayer(); if (n2.k!==np.k) return TABS.home(); cd.textContent=dur(n2.at-Date.now()); }, 20000);
};
function bindGo(){ $$("[data-go]").forEach(b=>b.onclick=e=>{ e.stopPropagation(); const k=b.dataset.go; tick(); if (k==="nearM") return go("nearList",{k:"mosques", q:"mosque"}); go(k, b.dataset.id?{id:b.dataset.id}:{}); }); }

function prayerSheet(){
  const draw = m => { const loc = curLoc(), all = PT(new Date(), loc), np = nextPrayer(loc), h = hijri(new Date()), mk = methodFor(loc), asr = asrFor(loc);
    const today = fmtDate(new Date(), loc.tz);
    m.querySelector(".sheet").innerHTML = `<i class="grab"></i><div class="row"><span class="ib">${ic("clock")}</span><div><b>${t("prayer")}</b><small class="muted">${esc(tx(today))} · ${h.d} ${tx(HM[h.m-1]||"")} ${h.y}</small></div></div>
      <button class="locrow" id="ps-loc">${ic(loc.id==="gps"?"target":"pin")}<span><b>${esc(locName(loc))}</b><small>${esc(loc.tz)} · UTC${(o=>(o>=0?"+":"")+o)(tzOffsetH(loc.tz,new Date()))}</small></span><em>${tx(L()==="ru"?"Сменить":"O'zgartirish")}</em></button>
      <div class="nextp"><span>${t("nextP")}: <b>${t(np.k)}</b></span><b class="tnum">${dur(np.at-Date.now())} ${t("left")}</b></div>
      <div class="plist">${PKEYS.map(k=>`<div class="prow ${k===np.k?"on":""}"><span>${t(k)}</span><b class="tnum">${fmtT(all[k],loc)}</b></div>`).join("")}</div>
      <div class="pset"><label for="ps-m">${tx(L()==="ru"?"Метод расчёта":"Hisob usuli")}</label><select id="ps-m">${Object.entries(PT_METHODS).map(([k,v])=>`<option value="${k}" ${k===mk?"selected":""}>${esc(tx(v.name))}</option>`).join("")}</select></div>
      <div class="seg s2">${[[2,tx(L()==="ru"?"Аср: ханафи":"Asr: Hanafiy")],[1,tx(L()==="ru"?"Аср: шафии":"Asr: Shofeiy")]].map(([v,n])=>`<button class="opt ${asr===v?"on":""}" data-asr="${v}">${n}</button>`).join("")}</div>
      <div class="notif"><label class="tgl"><span>${ic("bell")}<b>${tx(L()==="ru"?"Напоминания о намазе":"Namoz eslatmalari")}</b></span><input type="checkbox" id="pn-on" ${S.pn.on?"checked":""}></label>
        ${S.pn.on?`<div class="pills">${PKEYS.filter(k=>k!=="sunrise").map(k=>`<button class="pill ${S.pn.mask.includes(k)?"on":""}" data-pk="${k}">${t(k)}</button>`).join("")}</div>
        <span class="lbl">${tx(L()==="ru"?"Напомнить заранее":"Oldindan eslatish")}</span><div class="seg s4">${[0,5,10,15].map(n=>`<button class="opt ${S.pn.before===n?"on":""}" data-pb="${n}">${n?n+(L()==="ru"?" мин":" daq"):tx(L()==="ru"?"Нет":"Yo'q")}</button>`).join("")}</div>`:""}
        <small class="muted">${tx(L()==="ru"?"Сообщение придёт от бота в момент наступления времени.":"Namoz vaqti kirganda bot sizga xabar yuboradi.")}</small></div>
      <p class="note">${tx(L()==="ru"?"Время показано по местному времени выбранного города. Сверяйте с расписанием местной мечети.":"Vaqtlar tanlangan joyning mahalliy vaqtida. Mahalliy masjid taqvimi bilan solishtirib turing.")}</p>
      <button class="btn ghost wide" data-close>${t("close")}</button>`;
    $("#ps-loc",m).onclick = ()=>{ m.remove(); citySheet(()=>{ prayerSheet(); if (!stack.length && tab==="home") TABS.home(); }); };
    $("#pn-on",m).onchange = e=>enablePrayerNotify(e.target.checked, ()=>draw(m));
    $$("[data-pk]",m).forEach(b=>b.onclick=()=>{ const k=b.dataset.pk; S.pn.mask = S.pn.mask.includes(k) ? S.pn.mask.filter(x=>x!==k) : PKEYS.filter(x=>x===k||S.pn.mask.includes(x)); save(); syncPrayer(); draw(m); });
    $$("[data-pb]",m).forEach(b=>b.onclick=()=>{ S.pn.before = +b.dataset.pb; save(); syncPrayer(); draw(m); });
    $("#ps-m",m).onchange = e=>{ S.loc.method = e.target.value; delete S.loc.asr; save(); syncPrayer(); draw(m); if (!stack.length && tab==="home") TABS.home(); };
    $$("[data-asr]",m).forEach(b=>b.onclick=()=>{ S.loc.asr = +b.dataset.asr; save(); syncPrayer(); draw(m); if (!stack.length && tab==="home") TABS.home(); }); };
  sheet("", draw);
}
function fmtDate(date, tz){
  const [y,mo,d] = localYMD(tz, date), wd = new Date(Date.UTC(y,mo-1,d)).getUTCDay();
  const W = L()==="ru" ? ["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"] : ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
  const M = L()==="ru" ? ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"] : ["yanvar","fevral","mart","aprel","may","iyun","iyul","avgust","sentabr","oktabr","noyabr","dekabr"];
  return W[wd]+", "+d+(L()==="ru"?" ":"-")+M[mo-1];
}
function citySheet(after){
  const groups = [["uz",tx(L()==="ru"?"Узбекистан":"O'zbekiston")],["sa",tx(L()==="ru"?"Харамайн и Саудия":"Haramayn va Saudiya")],["*",tx(L()==="ru"?"Другие страны":"Boshqa davlatlar")]];
  const draw = (m, qv="") => { const cur = curLoc(), ql = qv.trim().toLowerCase();
    const list = c => `<button class="lrow ${cur.id===c.id?"on":""}" data-cid="${c.id}"><span>${esc(tx(c.name))}</span>${cur.id===c.id?ic("check"):`<small class="muted tnum">${fmtT(nextPrayer(c).at,c)}</small>`}</button>`;
    const match = c => !ql || c.name.toLowerCase().includes(ql) || cyr(c.name).toLowerCase().includes(ql) || c.id.includes(ql);
    m.querySelector(".sheet").innerHTML = `<i class="grab"></i><h2 class="center">${tx(L()==="ru"?"Выберите город":"Shaharni tanlang")}</h2>
      <button class="btn gold wide" id="cs-gps">${ic("target")}${tx(L()==="ru"?"По моему местоположению":"Joylashuvim bo'yicha aniqlash")}</button>
      <input class="inp" id="cs-q" placeholder="${tx(L()==="ru"?"Поиск города…":"Shahar izlash…")}" value="${esc(qv)}" aria-label="search">
      <div class="clist">${groups.map(([cc,n])=>{ const arr = PT_CITIES.filter(c=>(cc==="*"?!["uz","sa"].includes(c.cc):c.cc===cc) && match(c)); return arr.length?`<small class="eb">${n}</small><div class="langs">${arr.map(list).join("")}</div>`:""; }).join("") || `<p class="empty">${tx(L()==="ru"?"Не найдено. Используйте геолокацию.":"Topilmadi. Joylashuv bo'yicha aniqlang.")}</p>`}</div>`;
    $("#cs-gps",m).onclick = ()=>{ m.remove(); locateMe(after); };
    const q = $("#cs-q",m); q.oninput = e=>{ const v=e.target.value, pos=e.target.selectionStart; draw(m, v); const q2=$("#cs-q",m); q2.focus(); try{ q2.setSelectionRange(pos,pos); }catch(_){} };
    $$("[data-cid]",m).forEach(b=>b.onclick=()=>{ const c = PT_CITIES.find(x=>x.id===b.dataset.cid); setLoc(Object.assign({}, c)); m.remove(); haptic("n","success"); after && after(); }); };
  sheet("", m=>draw(m));
}
function streakSheet(){
  sheet(`<div class="center"><span class="big fire">${ic("flame")}</span><h2>${S.streak.n} ${tx(L()==="ru"?"дней подряд":"kunlik seriya")}</h2>
    <p class="muted">${tx(L()==="ru"?"Решайте хотя бы один квиз в день. За каждые 7 дней подряд: +21 ⭐.":"Har kuni kamida bitta quiz yeching. Har 7 kunlik seriya uchun +21 ⭐.")}</p>
    <button class="btn gold wide" id="ss-go">${t("start")}</button></div>`, m=>{ m.querySelector("#ss-go").onclick=()=>{ m.remove(); startQuiz({mode:"rnd"}); }; });
}
/* ---------- QUIZ ---------- */
const BOOKS = (()=>{ const K=ODOBIM.kids.units, Tn=ODOBIM.teens.units, qs = us => us.flatMap(u=>u.lessons.flatMap(l=>l.qs)).filter(q=>q.t==="mc"||q.t==="tf");
  return [
   {id:"haj", title:"Haj va Umra", author:"MuhibZiyo", color:"#C8962E", qs:HAJ_QS},
   {id:"odob", title:"Odob va axloq", author:"Odobim", color:"#2F9E8F", qs:qs([K[0],K[1],Tn[2]])},
   {id:"iymon", title:"Iymon va aqida", author:"Odobim", color:"#4A7BD0", qs:qs([K[2],Tn[0]])},
   {id:"ibodat", title:"Ibodat asoslari", author:"Odobim", color:"#8B5CC9", qs:qs([K[3],Tn[1]])},
   {id:"sira", title:"Sira va allomalar", author:"Odobim", color:"#C9603B", qs:qs([Tn[3]])}
  ]; })();
function toMC(q){ if (q.t==="tf") return {q:q.q, opts:shuffle([{t:"To'g'ri",ok:q.a},{t:"Noto'g'ri",ok:!q.a}]), e:q.e};
  return {q:q.q, opts:shuffle(q.o.map((x,i)=>({t:x, ok:i===q.a}))), e:q.e}; }
let filt = "all";
TABS.quiz = function(){
  const banners = [
    {k:"rnd", eb:tx(L()==="ru"?"СМЕШАННЫЕ ВОПРОСЫ":"ARALASH SAVOLLAR"), h:t("rndQuiz"), s:t("rndSub"), btn:t("start"), extra:`${t("todayLeft")}: ${S.rnd.left}`},
    {k:"tas", eb:tx(L()==="ru"?"СЧЁТЧИК ЗИКРА":"ZIKR SANAGICH"), h:t("tasbeh"), s:tx(L()==="ru"?"Считайте зикр, собирайте звёзды":"Zikr sanang, yulduz yig'ing"), btn:t("start"), extra:""},
    {k:"odb", eb:tx(L()==="ru"?"ДЛЯ ДЕТЕЙ":"BOLALAR UCHUN"), h:t("odobim"), s:tx(L()==="ru"?"Уроки адаба в игровой форме":"O'yin shaklida odob darslari"), btn:t("start"), extra:""}];
  const list = BOOKS.filter(b => filt==="all" ? true : filt==="pin" ? S.pins.includes(b.id) : !S.pins.includes(b.id));
  app.innerHTML = header() + `<main class="wrap">
    <div class="banners" id="bn">${banners.map(b=>`<section class="banner"><div><small class="eb">${b.eb}</small><h2>${b.h}</h2><p>${b.s}</p>
      <div class="row"><button class="btn gold" data-b="${b.k}">${ic("play")}${b.btn}</button>${b.extra?`<span class="muted sm">${b.extra}</span>`:""}</div></div>
      <button class="trophy" data-board aria-label="${t("board")}">${ic("trophy")}</button></section>`).join("")}</div>
    <div class="bdots" id="bd">${banners.map((_,i)=>`<i class="${i?"":"on"}"></i>`).join("")}</div>
    <div class="tabs3">${[["all",t("all")],["pin",t("pinned")],["unpin",t("unpinned")]].map(([k,n])=>`<button class="${filt===k?"on":""}" data-f="${k}">${n}</button>`).join("")}</div>
    <div class="books">${list.length?list.map(bookRow).join(""):`<p class="empty">${tx(L()==="ru"?"Пусто":"Bo'sh")}</p>`}</div></main>`;
  bindHeader();
  $$("[data-b]").forEach(b=>b.onclick=()=>{ const k=b.dataset.b; k==="rnd"?startQuiz({mode:"rnd"}):k==="tas"?go("tasbeh"):go("odobim"); });
  $$("[data-board]").forEach(b=>b.onclick=()=>go("board"));
  $$("[data-f]").forEach(b=>b.onclick=()=>{ filt=b.dataset.f; TABS.quiz(); });
  $$("[data-pin]").forEach(b=>b.onclick=()=>{ const id=b.dataset.pin; S.pins = S.pins.includes(id) ? S.pins.filter(x=>x!==id) : [...S.pins,id]; save(); TABS.quiz(); });
  $$("[data-run]").forEach(b=>b.onclick=()=>{ const id=b.dataset.run, pr=b.dataset.pr==="1"; const cd=(S.cool[id]||0)-Date.now();
    if (!pr && cd>0) return toast(tx(L()==="ru"?"Повторить можно через ":"Qayta yechish: ")+dur(cd)+" "+t("left")); startQuiz({mode: pr?"practice":"book", book:id}); });
  const bn=$("#bn"); bn.onscroll=()=>{ const i=Math.round(bn.scrollLeft/bn.clientWidth); $$("#bd i").forEach((d,j)=>d.classList.toggle("on",i===j)); };
};
function bookRow(b){ const pinned=S.pins.includes(b.id), cd=(S.cool[b.id]||0)-Date.now();
  return `<article class="book"><div class="cover" style="--c:${b.color}"><span>${esc(tx(b.title))}</span></div><div class="bi"><b>${esc(tx(b.title))}</b><small>${esc(b.author)}</small><small class="muted">${b.qs.length} ${t("qs")}</small>
    <div class="row"><button class="chip ${pinned?"on":""}" data-pin="${b.id}">${ic("pin2")}${t("pin")}</button><span class="sp"></span>
    <button class="icb" data-run="${b.id}" data-pr="1" aria-label="${t("practice")}" title="${t("practice")}">${ic("cap")}</button>
    <button class="btn dark sm" data-run="${b.id}">${cd>0?ic("clock")+dur(cd):ic("play")+t("start")}</button></div></div></article>`; }

function startQuiz(o){
  let pool;
  if (o.mode==="rnd"){ if (S.rnd.left<=0) return toast(tx(L()==="ru"?"Лимит случайных квизов на сегодня исчерпан":"Bugungi tasodifiy quizlar tugadi. Ertaga qayting!")); pool = shuffle(BOOKS.flatMap(b=>b.qs)).slice(0,10); }
  else { const b = BOOKS.find(x=>x.id===o.book); pool = shuffle(b.qs).slice(0, o.mode==="practice" ? b.qs.length : 15); }
  if (o.mode==="rnd"){ S.rnd.left--; save(); }
  if (o.mode==="book"){ S.cool[o.book] = Date.now()+60*6e4; save(); }
  go("run", {mode:o.mode, book:o.book, qs:pool.map(toMC), i:0, right:0, wrong:0, stars:0, done:false});
}
function confirmExit(){ sheet(`<p class="center">${t("exitQuiz")}</p><button class="btn red wide" id="qx">${t("exit")}</button><button class="btn ghost wide" data-close>${t("cancel")}</button>`,
  m=>{ $("#qx",m).onclick=()=>{ m.remove(); clearInterval(quizTimer); stack.pop(); render(true); }; }); }
const PAGES = {};
PAGES.run = {full:true, fn(p){
  if (p.done) return quizResult(p);
  const q = p.qs[p.i]; let left = 20, locked = false;
  const per = p.mode==="rnd" ? 2 : p.mode==="book" ? 1 : 0;
  app.innerHTML = `<div class="qz"><div class="qtop"><button class="icb" id="qclose" aria-label="${t("exit")}">${ic("x")}</button><div class="bar"><i style="width:${p.i/p.qs.length*100}%"></i></div><b class="tnum">${p.i+1}/${p.qs.length}</b></div>
    <div class="qtime"><div class="bar thin"><i id="tb" style="width:100%"></i></div><b class="tnum" id="tl">20</b></div>
    <div class="qhead">${p.mode==="practice"?`<span class="tag">${ic("cap")}${t("practice")}</span>`:`<span class="lives">${[0,1,2].map(i=>ic("heart", i<3-p.wrong?"on":"")).join("")}</span><span class="tag gold">+${p.stars} ${ic("star")}</span>`}</div>
    <h2 class="qq">${esc(tx(q.q))}</h2>
    <div class="qopts">${q.opts.map((o,i)=>`<button class="qo" data-i="${i}"><kbd>${"ABCD"[i]}</kbd><span>${esc(tx(o.t))}</span></button>`).join("")}</div>
    <div id="qfb"></div></div>`;
  $("#qclose").onclick = confirmExit;
  const answer = i => {
    if (locked) return; locked = true; clearInterval(quizTimer);
    const ok = i>=0 && q.opts[i].ok, ci = q.opts.findIndex(o=>o.ok);
    $$(".qo").forEach((b,j)=>{ b.disabled=true; if (j===ci) b.classList.add("ok"); else if (j===i) b.classList.add("bad"); });
    if (ok){ p.right++; if (per){ p.stars+=per; addStars(per); } tick(990); haptic("n","success"); } else { p.wrong++; tick(220); haptic("n","error"); }
    const fin = () => { p.i++; if (p.i>=p.qs.length || (p.mode!=="practice" && p.wrong>=3)) p.done = true; render(true); };
    if (p.mode==="practice" || !ok){
      $("#qfb").innerHTML = `<div class="fb ${ok?"ok":"bad"}"><b>${i<0?t("timeUp"):ok?t("correct"):t("wrong")}</b><p>${esc(tx(q.e||""))}</p><button class="btn ${ok?"teal":"red"} wide" id="qn">${t("continue")}</button></div>`;
      $("#qn").onclick = fin; $("#qn").focus();
    } else setTimeout(fin, 650);
  };
  $$(".qo").forEach(b=>b.onclick=()=>answer(+b.dataset.i));
  quizTimer = setInterval(()=>{ left--; const tb=$("#tb"), tl=$("#tl"); if(!tb){ clearInterval(quizTimer); return; } tb.style.width=(left/20*100)+"%"; tl.textContent=left; if (left<=5) tb.parentNode.classList.add("warn"); if (left<=0) answer(-1); }, 1000);
}};
function quizResult(p){
  let bonus = 0, firstQuiz = false;
  if (!p.saved){ p.saved = true;
    if (p.mode!=="practice"){ firstQuiz = !S.quizzed; S.quizzed = true; bonus = markStreak(); save();
      API.event("quiz",{mode:p.mode, book:p.book||null, right:p.right, wrong:p.wrong, total:p.qs.length}); } }
  const acc = Math.round(p.right/Math.max(1,p.right+p.wrong)*100);
  app.innerHTML = `<div class="res">${MASCOT}<h1>${p.wrong>=3&&p.mode!=="practice"?tx(L()==="ru"?"3 ошибки — тест окончен":"3 ta xato — test yakunlandi"):t("resultTitle")}</h1>
    <div class="stats"><div style="--c:var(--gold)"><span>${t("earned")}</span><b>${ic("star")}${p.stars}</b></div><div style="--c:var(--accent)"><span>${t("accuracy")}</span><b>${acc}%</b></div><div style="--c:var(--fire)"><span>${t("streak")}</span><b>${ic("flame")}${S.streak.n}</b></div></div>
    ${bonus?`<p class="bonus">${tx("7 kunlik seriya! +21 ⭐")}</p>`:""}
    ${firstQuiz && S.invitedBy?`<p class="bonus">${tx("Birinchi test! Siz va do'stingizga +5 ⭐")}</p>`:""}
    <button class="btn gold wide" id="r-again">${t("again")}</button><button class="btn ghost wide" id="r-home">${t("toHome")}</button></div>`;
  $("#r-again").onclick = ()=>{ stack.pop(); startQuiz({mode:p.mode, book:p.book}); };
  $("#r-home").onclick = ()=>{ stack.pop(); render(true); };
}

/* ---------- REYTING ---------- */
let bPer = "week";
PAGES.board = {fn(){
  const end = new Date(weekKey()); end.setDate(end.getDate()+7); const me = {n:(S.user.nick||S.user.name||"Siz"), v: bPer==="today"? (S.earn.day===dayKey()?S.earn.dayN:0) : bPer==="week" ? (S.earn.week===weekKey()?S.earn.weekN:0) : S.earn.all, me:true};
  app.innerHTML = header() + `<main class="wrap">${pageHead(t("board"), tx(L()==="ru"?"Звёзды квиза, тасбиха и Одобим вместе":"Quiz, tasbeh va Odobim yulduzlari birga"))}
    <section class="card prize"><div class="row"><span class="ib">${ic("trophy")}</span><div><b>${tx(L()==="ru"?"Приз победителям недели":"Hafta g'oliblari sovrini")}</b><small class="muted">${ic("clock")} ${tx(L()==="ru"?"Обновится через":"Yangilanishga")} ${dur(end-Date.now())}</small></div></div>
      <div class="podium"><div class="p1">${ic("trophy")} 50 ${ic("star")}</div><div class="p2">${ic("trophy")} 30 ${ic("star")}</div><div class="p3">${ic("trophy")} 10 ${ic("star")}</div></div>
      <p class="note">${tx(L()==="ru"?"Каждый понедельник начинается новая неделя — TOP-3 получают приз.":"Har dushanba yangi hafta boshlanadi — TOP-3 sovrin oladi.")}</p></section>
    <div class="tabs3">${[["today",t("today")],["week",t("week")],["all",t("allTime")]].map(([k,n])=>`<button class="${bPer===k?"on":""}" data-p="${k}">${n}</button>`).join("")}</div>
    <div id="rows" class="rows"><p class="empty">…</p></div></main>`;
  bindHeader(); bindBack();
  $$("[data-p]").forEach(b=>b.onclick=()=>{ bPer=b.dataset.p; PAGES.board.fn(); });
  const draw = (rows, myRank) => {
    $("#rows").innerHTML = rows.map((r,i)=>`<div class="rk ${r.me?"me":""}"><span class="n ${i<3?"top":""}">${i+1}</span><span class="av">${esc((r.n||"?")[0])}</span><span class="nm">${esc(r.n)}</span><b class="tnum">${r.v} ${ic("star","gold")}</b></div>`).join("")
      + (API.on ? "" : `<p class="note">${tx("Namuna ro'yxat — server ulangach haqiqiy reyting chiqadi.")}</p>`)
      + `<div class="mybar">${me.v>0?`${tx(L()==="ru"?"Ваше место":"Sizning o'rningiz")}: <b>${myRank}</b> · ${me.v} ${ic("star","gold")}`:t("notRanked")}</div>`; };
  if (API.on) API.call("/api/leaderboard?period="+bPer).then(r=>{ if(!r) return draw([me],1); draw(r.rows.map(x=>({n:x.name,v:x.stars,me:x.me})), r.my_rank||"—"); });
  else { const k = bPer==="today"?.25:bPer==="week"?1:4.2; const rows = SAMPLE_BOARD.map(([n,v])=>({n,v:Math.round(v*k)})); if (me.v>0) rows.push(me); rows.sort((a,b)=>b.v-a.v); draw(rows.slice(0,20), rows.indexOf(me)+1); }
}};

/* ---------- TASBEH ---------- */
PAGES.tasbeh = {fn(){
  const T = S.tas, mode = T.mode;
  let title="", sub="", cnt=0, target=33, ar="";
  if (mode==="zikr"){ const z = ADHKAR[T.zi]; ar=z.ar; title=z.tr; sub=`${T.zi+1} / ${ADHKAR.length} · ${tx(z.uz)}`; cnt=T.zc; target=z.n; }
  else if (mode==="free"){ title=tx(L()==="ru"?"Свободный счёт":"Erkin sanash"); cnt=T.fc; target=T.free; }
  else { const nm = NAMES99[T.ni]; ar=nm.ar; title=nm.tr; sub=tx(nm.uz); cnt=T.ni+1; target=99; }
  const pct = Math.min(1, cnt/target), r=94, C=2*Math.PI*r;
  app.innerHTML = `<main class="wrap tas">${pageHead(t("tasbeh"))}
    <div class="tabs3">${[["zikr",t("zikr")],["free",t("free")],["n99",t("names99")]].map(([k,n])=>`<button class="${mode===k?"on":""}" data-m="${k}">${n}</button>`).join("")}</div>
    ${mode==="free"?`<div class="pills">${[33,99,100].map(n=>`<button class="pill ${T.free===n?"on":""}" data-t="${n}">${n}</button>`).join("")}</div>`:""}
    <div class="zk">${ar?`<p class="ar" lang="ar" dir="rtl">${ar}</p>`:""}<h2>${esc(title)}</h2>${sub?`<small>${esc(sub)}</small>`:""}</div>
    <button class="ring" id="tap" aria-label="+1"><svg viewBox="0 0 220 220"><circle cx="110" cy="110" r="${r}" class="rt"/><circle cx="110" cy="110" r="${r}" class="rp" style="stroke-dasharray:${C};stroke-dashoffset:${C*(1-pct)}"/></svg>
      <span><b class="tnum" id="tc">${mode==="n99"?T.ni+1:cnt}</b><small class="tnum">${mode==="n99"?`${T.ni+1} / 99`:`${cnt} / ${target}`}</small></span></button>
    <div class="tstats">${mode==="n99"?`<span>${t("fullRead")}: <b>${T.full}</b></span>`:""}<span>${t("todayStars")}: <b>${T.stars}/9</b> ${ic("star","gold")}</span><span>${ic("flame","fire")} ${t("zstreak")}: <b>${T.streak.n%7||(T.streak.n?7:0)}/7</b></span><span class="muted">${tx("Bugungi zikr")}: <b>${T.n}</b></span></div>
    <p class="note">${tx(L()==="ru"?"Зикр — ради довольства Аллаха; звёзды лишь поощрение.":"Zikr — Alloh rizosi uchun; yulduz shunchaki rag'bat.")}</p>
    <button class="btn ghost wide" id="treset">${ic("reset")}${t("restart")}</button></main>`;
  bindBack();
  $$("[data-m]").forEach(b=>b.onclick=()=>{ T.mode=b.dataset.m; save(); PAGES.tasbeh.fn(); });
  $$("[data-t]").forEach(b=>b.onclick=()=>{ T.free=+b.dataset.t; T.fc=0; save(); PAGES.tasbeh.fn(); });
  $("#treset").onclick = ()=>{ if (mode==="zikr") T.zc=0; else if (mode==="free") T.fc=0; else T.ni=0; save(); PAGES.tasbeh.fn(); };
  $("#tap").onclick = ()=>{
    haptic("i","light"); tick(740); T.n++;
    if (T.n % 100 === 0){ if (T.stars < 9){ T.stars++; addStars(1); toast("+1 ⭐"); API.event("tasbeh",{n:100}); }
      if (T.streak.last!==dayKey()){ T.streak.n = T.streak.last===yKey()?T.streak.n+1:1; T.streak.last=dayKey(); } }
    if (mode==="zikr"){ T.zc++; if (T.zc>=ADHKAR[T.zi].n){ T.zc=0; T.zi=(T.zi+1)%ADHKAR.length; haptic("n","success"); } }
    else if (mode==="free"){ T.fc++; if (T.fc>=T.free){ T.fc=0; haptic("n","success"); toast(T.free+" ✓"); } }
    else { T.ni++; if (T.ni>=99){ T.ni=0; T.full++; haptic("n","success"); } }
    save(); PAGES.tasbeh.fn();
  };
}};

/* ---------- QIBLA ---------- */
PAGES.qibla = {fn(){
  app.innerHTML = header() + `<main class="wrap">${pageHead(t("qibla"))}
    <div class="center qb" id="qb"><span class="big">${ic("compass")}</span><p class="muted">${tx(L()==="ru"?"Для кибла нужны геолокация и компас.":"Qibla yo'nalishini aniqlash uchun joylashuv va kompas kerak.")}</p>
    <button class="btn gold" id="qgo">${ic("target")}${t("start")}</button><p class="note">${tx(L()==="ru"?"Интернет не нужен — работает по GPS и компасу.":"Internet shart emas — GPS va kompas bilan ishlaydi.")}</p></div></main>`;
  bindHeader(); bindBack();
  $("#qgo").onclick = ()=>getLoc(pos=>{
    const K={lat:21.4225,lng:39.8262}, d2r=Math.PI/180, f1=pos.lat*d2r, f2=K.lat*d2r, dl=(K.lng-pos.lng)*d2r;
    const brg = (Math.atan2(Math.sin(dl)*Math.cos(f2), Math.cos(f1)*Math.sin(f2)-Math.sin(f1)*Math.cos(f2)*Math.cos(dl))/d2r+360)%360;
    const km = Math.round(dist(pos, K));
    $("#qb").innerHTML = `<div class="compass"><div class="dial" id="dial"><i class="n">N</i><i class="e">E</i><i class="s">S</i><i class="w">W</i><div class="needle" style="transform:rotate(${brg}deg)"><span>${ic("kaaba")}</span></div></div></div>
      <h2 class="tnum">${Math.round(brg)}°</h2><p class="muted">${tx(L()==="ru"?"От севера по часовой стрелке":"Shimoldan soat mili bo'yicha")} · ${km.toLocaleString()} km</p><p class="note" id="qhint">${tx("Telefonni tekis tuting. Kompas mavjud bo'lsa, siferblat o'zi buriladi.")}</p>`;
    const onOri = e => { const h = e.webkitCompassHeading!=null ? e.webkitCompassHeading : (e.absolute && e.alpha!=null ? 360-e.alpha : null); if (h==null) return; const d=$("#dial"); if(!d){ window.removeEventListener("deviceorientationabsolute",onOri); window.removeEventListener("deviceorientation",onOri); return; } d.style.transform=`rotate(${-h}deg)`; const diff=Math.abs(((brg-h+540)%360)-180); if (diff<4) haptic("i","soft"); };
    try { if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission==="function") DeviceOrientationEvent.requestPermission().catch(()=>{}); } catch(e){}
    window.addEventListener("deviceorientationabsolute", onOri); window.addEventListener("deviceorientation", onOri);
  });
}};
function getLoc(ok){
  const fail = ()=>toast(tx(L()==="ru"?"Не удалось определить местоположение. Разрешите доступ к геолокации.":"Joylashuvni aniqlab bo'lmadi. Joylashuvga ruxsat bering."));
  const viaTg = ()=>{ try { const lm = tg && tg.LocationManager; if (!lm) return fail(); lm.init(()=>{ if(!lm.isLocationAvailable) return fail(); lm.getLocation(d=>d?ok({lat:d.latitude,lng:d.longitude}):fail()); }); } catch(e){ fail(); } };
  if (!navigator.geolocation) return viaTg();
  navigator.geolocation.getCurrentPosition(p=>ok({lat:p.coords.latitude,lng:p.coords.longitude}), viaTg, {enableHighAccuracy:true, timeout:10000});
}
function dist(a,b){ const R=6371, d2r=Math.PI/180, dLa=(b.lat-a.lat)*d2r, dLo=(b.lng-a.lng)*d2r; const x=Math.sin(dLa/2)**2+Math.cos(a.lat*d2r)*Math.cos(b.lat*d2r)*Math.sin(dLo/2)**2; return 2*R*Math.asin(Math.sqrt(x)); }

/* ---------- ENG YAQIN ---------- */
PAGES.near = {fn(){
  app.innerHTML = header() + `<main class="wrap">${pageHead(t("near"))}
    ${[["mosques","mosque","mosque"],["restaurants","food","halal restaurant"]].map(([k,i,q])=>`<button class="card link" data-n="${k}" data-q="${q}">${ic(i,"ib")}<div><b>${t(k)}</b></div>${ic("chev","chev")}</button>`).join("")}</main>`;
  bindHeader(); bindBack();
  $$("[data-n]").forEach(b=>b.onclick=()=>go("nearList",{k:b.dataset.n, q:b.dataset.q}));
}};
PAGES.nearList = {fn(p){
  const draw = pos => {
    let body = "";
    if (!pos) body = `<div class="center"><span class="big">${ic("pin")}</span><p class="muted">${t("needLoc")}</p><button class="btn gold" id="nl">${ic("target")}${t("locate")}</button></div>`;
    else {
      const maps = q => `https://www.google.com/maps/search/${encodeURIComponent(q)}/@${pos.lat},${pos.lng},15z`;
      body = `<div class="center"><span class="big">${ic(p.k==="mosques"?"mosque":"food")}</span><p class="muted">${tx(L()==="ru"?"Откроем карту с результатами вокруг вас.":"Atrofingizdagi natijalarni xarita ilovasida ochamiz.")}</p>
        <button class="btn gold" id="nm">${ic("map")}${t("openMap")}</button>
        <p class="note">Google Maps · Apple Maps · Waze · Yandex</p>
        <div class="maps">${[["Apple",`https://maps.apple.com/?q=${encodeURIComponent(p.q)}&sll=${pos.lat},${pos.lng}`],["Yandex",`https://yandex.uz/maps/?ll=${pos.lng},${pos.lat}&z=15&text=${encodeURIComponent(p.q)}`]].map(([n,u])=>`<button class="chip" data-u="${esc(u)}">${n}</button>`).join("")}</div></div>`;
      setTimeout(()=>{ const nm=$("#nm"); if (nm) nm.onclick=()=>openLink(maps(p.q)); $$("[data-u]").forEach(b=>b.onclick=()=>openLink(b.dataset.u)); bindGo(); });
    }
    app.innerHTML = header() + `<main class="wrap">${pageHead(t(p.k))}${body}</main>`; bindHeader(); bindBack();
    const nl = $("#nl"); if (nl) nl.onclick = ()=>getLoc(ps=>{ p.pos=ps; draw(ps); });
  };
  draw(p.pos);
}};

/* ---------- SOVG'ALAR ---------- */
const GIFTS_ON = false; /* sovg'alar vaqtincha o'chirilgan — qaytarish uchun true qiling */
let gsub = "books", gkid = null;
const activeGift = (id, kid) => S.gifts.find(x=>x.item===id && x.status!=="rejected" && (!kid || x.kid===kid));
const pickTaken = (g, list, kid) => g.pick && list.some(x=>x.pick===g.pick && x.id!==g.id && activeGift(x.id, kid));
const cheapest = () => Math.min(...GIFTS.books.map(b=>b.stars));
function giftsTeaser(){
  const need = Math.max(0, cheapest()-S.stars), pct = Math.min(100, Math.round(S.stars/cheapest()*100));
  return `<section class="card gteaser"><div class="row"><span class="ib gold">${ic("gift")}</span><div><b>${tx(L()==="ru"?"Книги за звёзды":"Yulduzlarga kitob sovg'a")}</b><small class="muted">${need?tx(L()==="ru"?`До первой книги: ${need} ⭐`:`Birinchi kitobgacha yana ${need} ⭐`):tx(L()==="ru"?"Вам уже доступна книга!":"Sizga kitob olish mumkin!")}</small></div></div>
    <div class="gbar"><i style="width:${pct}%"></i></div>
    <div class="gcovers">${GIFTS.books.slice(0,4).map(b=>`<span class="cover sm" style="--c:${b.color}"><span>${esc(tx(b.title))}</span></span>`).join("")}<button class="btn gold sm" data-go="gifts">${t("gifts")} ${ic("chev")}</button></div></section>`;
}
TABS.gifts = function(){
  kidsInit(); if (!kidById(gkid)) gkid = (curKid()||S.kids[0]||{}).id;
  const subs = [["books",tx(L()==="ru"?"Книги":"Kitoblar")],["odobim",tx(L()==="ru"?"Одобим":"Odobim")],["mine",tx(L()==="ru"?"Мои":"Mening")]];
  let body = "";
  if (gsub==="books") body = `<div class="glist">${GIFTS.books.map(b=>{ const ok=S.stars>=b.stars, pct=Math.min(100,Math.round(S.stars/b.stars*100));
    return `<article class="gift"><div class="cover" style="--c:${b.color}"><span>${esc(tx(b.title))}</span></div><div class="gi"><b>${esc(tx(b.title))}</b><small class="muted">${esc(tx(b.desc))}</small>
      <div class="row"><span class="price">${b.stars} ${ic("star","gold")}</span><span class="sp"></span>${ok?`<button class="btn gold sm" data-gb="${b.id}">${tx(L()==="ru"?"Получить":"Olish")}</button>`:`<small class="muted">${tx(L()==="ru"?"ещё":"yana")} ${b.stars-S.stars} ⭐</small>`}</div>
      ${ok?"":`<div class="gbar thin"><i style="width:${pct}%"></i></div>`}</div></article>`; }).join("")}</div>
    <p class="note">${tx(L()==="ru"?"Звёзды не сгорают. Собирайте их в квизах, тасбихе и Одобим.":"Yulduzlar yo'qolmaydi. Ularni quiz, tasbeh va Odobimda yig'asiz.")}</p>`;
  if (gsub==="odobim"){ const k = kidById(gkid);
    if (!k) body = `<section class="card center">${MASCOT}<b>${tx("Avval farzandingizni qo'shing")}</b><p class="muted">${tx("Har bir farzand Odobimda o'z yo'lini o'tadi va yoshiga mos sovg'a oladi.")}</p><button class="btn teal wide" data-go="odobim">${ic("users")}${tx("Odobimga o'tish")}</button></section>`;
    else { const list = GIFTS.odobim[k.group], done = odUnitsDone(k), total = ODOBIM[k.group].units.length;
    body = `${S.kids.length>1?`<div class="kidtabs">${S.kids.map(x=>`<button class="${x.id===k.id?"on":""}" data-gk="${x.id}"><span>${x.av}</span>${esc(x.name)}</button>`).join("")}</div>`:""}
      <section class="card odprog"><div class="row"><span class="kav big">${k.av}</span><div><b>${esc(k.name)} · ${ODOBIM[k.group].age} ${tx("yosh")}</b><small class="muted">${tx(L()==="ru"?"Пройдено разделов":"Tugatilgan bo'limlar")}: <b>${done} / ${total}</b></small>
        <div class="steps">${ODOBIM[k.group].units.map((_,i)=>`<i class="${i<done?"on":""}"></i>`).join("")}</div></div></div>
        <button class="btn teal wide" id="gplay">${ic("play")}${tx(L()==="ru"?"Продолжить Одобим":"Odobimni davom ettirish")}</button></section>
      <div class="glist">${list.map(g=>{ const claimed=activeGift(g.id,k.id), taken=pickTaken(g,list,k.id), open=done>=g.units;
        const state = claimed ? `<span class="st ${claimed.status}">${tx({pending:"Kutilmoqda",sent:"Yuborildi",done:"Topshirildi"}[claimed.status]||"Olindi")}</span>`
          : taken ? `<small class="muted">${tx(L()==="ru"?"Выбран другой подарок":"Boshqa sovg'a tanlangan")}</small>`
          : open ? `<button class="btn gold sm" data-go2="${g.id}">${tx(L()==="ru"?"Получить":"Olish")}</button>`
          : `<small class="muted">${ic("lock")} ${g.units} ${tx(L()==="ru"?"раздел(а)":"ta bo'lim")}</small>`;
        return `<article class="gift ${open?"":"locked"}"><div class="gico ${g.type}">${ic(g.type==="toy"?"toy":"book")}</div><div class="gi"><b>${esc(tx(g.title))}</b><small class="muted">${esc(tx(g.desc))}</small>
          <div class="row"><span class="req">${ic("kid")} ${g.units}/${total} ${tx(L()==="ru"?"разд.":"bo'lim")}</span><span class="sp"></span>${state}</div>${g.pick?`<small class="eb">${tx(L()==="ru"?"Один на выбор":"Bittasini tanlang")}</small>`:""}</div></article>`; }).join("")}</div>
      <p class="note">${tx(L()==="ru"?"Подарок зависит от возраста ребёнка. Каждый подарок можно получить один раз.":"Sovg'a har bir farzandga yoshiga qarab beriladi. Har bir sovg'ani bir marta olish mumkin.")}</p>`; } }
  if (gsub==="mine") body = S.gifts.length ? S.gifts.slice().reverse().map(r=>`<section class="card req2"><div class="row"><b>${esc(tx(r.title))}</b><span class="sp"></span><span class="st ${r.status}">${tx({pending:"Kutilmoqda",sent:"Yuborildi",done:"Topshirildi",rejected:"Rad etildi"}[r.status]||r.status)}</span></div>
      <small class="muted">${r.date} · ${r.kind==="book"?r.cost+" ⭐":"Odobim"} · ${esc(r.contact.city||"")}</small>${r.note?`<small>${esc(r.note)}</small>`:""}</section>`).join("") : `<p class="empty">${tx(L()==="ru"?"У вас пока нет подарков":"Hozircha sovg'a so'ramagansiz")}</p>`;
  app.innerHTML = header() + `<main class="wrap"><section class="gbal"><div><small>${tx(L()==="ru"?"Ваши звёзды":"Sizning yulduzlaringiz")}</small><b class="tnum">${ic("star")}${S.stars}</b></div><button class="chip" data-go="guide">${ic("info")}${tx(L()==="ru"?"Как собрать":"Qanday yig'iladi")}</button></section>
    <div class="tabs3">${subs.map(([k,n])=>`<button class="${gsub===k?"on":""}" data-gs="${k}">${n}</button>`).join("")}</div>${body}</main>`;
  bindHeader(); bindGo();
  $$("[data-gs]").forEach(b=>b.onclick=()=>{ gsub=b.dataset.gs; TABS.gifts(); });
  $$("[data-gk]").forEach(b=>b.onclick=()=>{ gkid=b.dataset.gk; TABS.gifts(); });
  if ($("#gplay")) $("#gplay").onclick = ()=>{ S.kidId = gkid; kidChosen = true; save(); go("odobim"); };
  $$("[data-gb]").forEach(b=>b.onclick=()=>giftForm(GIFTS.books.find(x=>x.id===b.dataset.gb), "book"));
  $$("[data-go2]").forEach(b=>b.onclick=()=>giftForm(GIFTS.odobim[kidById(gkid).group].find(x=>x.id===b.dataset.go2), "odobim", kidById(gkid)));
  if (gsub==="mine" && API.on) API.call("/api/gifts/mine").then(r=>{ if (!r || gsub!=="mine" || tab!=="gifts" || stack.length) return; let ch=false;
    r.rows.forEach(x=>{ const l=S.gifts.find(g=>g.sid===x.id); if (l && (l.status!==x.status || l.note!==x.note)){ l.status=x.status; l.note=x.note||""; ch=true; } }); if (ch){ save(); TABS.gifts(); } });
};
function giftForm(item, kind, child){
  const c = S.contact || {}, kid = kind==="odobim";
  sheet(`<h2 class="center">${esc(tx(item.title))}</h2>
    <p class="center muted sm">${kid?tx(L()==="ru"?"Подарок за Одобим":"Odobim sovg'asi"):`${item.stars} ⭐ ${tx(L()==="ru"?"будет списано":"yechiladi")}`}</p>
    <label class="lbl" for="g1">${tx(L()==="ru"?"Получатель (Ф.И.О.)":"Qabul qiluvchi (F.I.Sh.)")}</label><input id="g1" class="inp" maxlength="60" autocomplete="name" value="${esc(c.name||((S.user.name+" "+(S.user.surname||"")).trim()))}">
    <label class="lbl" for="g2">${tx(L()==="ru"?"Телефон":"Telefon")}</label><input id="g2" class="inp" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="+998 90 123 45 67" value="${esc(c.phone||"")}">
    <label class="lbl" for="g3">${tx(L()==="ru"?"Город / район":"Shahar / tuman")}</label><input id="g3" class="inp" maxlength="60" value="${esc(c.city||locName(curLoc()))}">
    <label class="lbl" for="g4">${tx(L()==="ru"?"Адрес":"Manzil")}</label><input id="g4" class="inp" maxlength="120" autocomplete="street-address" value="${esc(c.address||"")}">
    ${kid?`<label class="lbl" for="g5">${tx(L()==="ru"?"Имя и возраст ребёнка":"Bolaning ismi va yoshi")}</label><input id="g5" class="inp" maxlength="60" value="${esc(child?child.name+", ":"")}" placeholder="${tx("Masalan: Aisha, 8 yosh")}">`:""}
    <p class="note">${tx(L()==="ru"?"Данные нужны только для доставки подарка.":"Ma'lumotlar faqat sovg'ani yetkazish uchun ishlatiladi.")}</p>
    <button class="btn gold wide" id="gok">${tx(L()==="ru"?"Отправить заявку":"So'rov yuborish")}</button><button class="btn ghost wide" data-close>${t("cancel")}</button>`, m=>{
    $("#gok",m).onclick = ()=>{
      const v = id => ($("#"+id,m)||{value:""}).value.trim();
      const contact = {name:v("g1"), phone:v("g2"), city:v("g3"), address:v("g4"), child:v("g5")};
      if (contact.name.length<3) return toast(tx("Ismni to'liq yozing"));
      if (contact.phone.replace(/\D/g,"").length<9) return toast(tx("Telefon raqamini to'g'ri yozing"));
      if (contact.city.length<2 || contact.address.length<3) return toast(tx("Shahar va manzilni yozing"));
      if (kid && contact.child.length<2) return toast(tx("Bolaning ismi va yoshini yozing"));
      if (!kid && S.stars < item.stars) return toast(tx("Yulduz yetarli emas"));
      if (kid && (activeGift(item.id, child.id) || pickTaken(item, GIFTS.odobim[child.group], child.id) || odUnitsDone(child) < item.units)) return toast(tx("Bu sovg'a hozir mavjud emas"));
      m.remove();
      if (!kid){ S.stars -= item.stars; }
      S.contact = {name:contact.name, phone:contact.phone, city:contact.city, address:contact.address};
      const r = {id:Date.now(), item:item.id, title:item.title, kind, group: kid?child.group:null, kid: kid?child.id:null, cost: kid?0:item.stars, contact, status:"pending", date:new Date().toLocaleDateString("ru-RU")};
      S.gifts.push(r); save(); paintCounters(); haptic("n","success");
      API.call("/api/gifts/request",{item:item.id, kind, group:r.group, kid:r.kid, kidName: kid?child.name:null, contact}).then(res=>{ if (res && res.request){ r.sid=res.request.id; save(); } else if (res && res.ok===false){ r.status="rejected"; r.note=res.msg; if (!kid) S.stars += item.stars; save(); TABS.gifts(); } syncUser(res); });
      toast(tx(L()==="ru"?"Заявка принята! Мы свяжемся с вами.":"So'rov qabul qilindi! Siz bilan bog'lanamiz.")); gsub="mine"; TABS.gifts();
    };
  });
}

/* ---------- PROFIL ---------- */
TABS.profile = function(){
  const u = S.user, photo = TGU && TGU.photo_url;
  app.innerHTML = header() + `<main class="wrap"><section class="prof"><div class="ava">${photo?`<img src="${esc(photo)}" alt="">`:`<span>${esc((u.name||"?")[0])}</span>`}</div><h1>${esc(u.nick||u.name)}</h1>${TGU&&TGU.username?`<small>@${esc(TGU.username)}</small>`:""}</section>
    ${[["guide","lifebuoy"],["personal","user"],["settings","gear"]].map(([k,i])=>`<button class="card link" data-pm="${k}">${ic(i,"ib")}<div><b>${t(k)}</b></div>${ic("chev","chev")}</button>`).join("")}
    <h3 class="sec">${t("account")}</h3><section class="card kv">
      <div><span>Telegram</span><b>${TGU&&TGU.username?"@"+esc(TGU.username):"—"}</b></div>
      <div><span>${t("sysId")}</span><b class="tnum">${S.sysId||"—"}</b></div>
      <div><span>Telegram ID</span><b class="tnum">${TGU?TGU.id:"—"}</b></div>
      <div><span>${t("phone")}</span>${S.phone?`<b>✓</b>`:`<button class="chip teal" id="ph">${ic("phone")}${t("connect")}</button>`}</div>
      <div><span>${t("invitedBy")}</span><b>${S.invitedBy?esc(String(S.invitedBy)):"—"}</b></div>
      <div><span>${t("registered")}</span><b class="tnum">${S.regDate?S.regDate.split("-").reverse().join("."):"—"}</b></div></section>
    <p class="note center">MuhibZiyo · v1.0</p></main>`;
  bindHeader();
  $$("[data-pm]").forEach(b=>b.onclick=()=>{ const k=b.dataset.pm; k==="invite"?go("invite"):k==="guide"?go("guide"):k==="personal"?personalSheet():settingsSheet(); });
  const ph=$("#ph"); if (ph) ph.onclick=()=>{ try { if (!tg || !tg.requestContact) return toast(tx("Bu funksiya Telegram ichida ishlaydi")); tg.requestContact(ok=>{ if(ok){ S.phone=true; save(); TABS.profile(); } }); } catch(e){ toast(tx("Bu funksiya Telegram ichida ishlaydi")); } };
};
function personalSheet(){
  const u=S.user;
  sheet(`<h2 class="center">${t("personal")}</h2>
    <label class="lbl" for="p1">${t("nick")}</label><input id="p1" class="inp" maxlength="30" value="${esc(u.nick)}">
    <label class="lbl" for="p2">${t("firstName")}</label><input id="p2" class="inp" maxlength="40" value="${esc(u.name)}">
    <label class="lbl" for="p3">${t("surname")}</label><input id="p3" class="inp" maxlength="40" value="${esc(u.surname)}" placeholder="${t("surname")}">
    <span class="lbl">${t("age")}</span><div class="seg s4">${["7-11","12-15","16-30","30+"].map(a=>`<button class="opt ${u.age===a?"on":""}" data-a="${a}">${a}</button>`).join("")}</div>
    <button class="btn gold wide" id="psave">${t("save")}</button>`, m=>{
    let age=u.age; $$("[data-a]",m).forEach(b=>b.onclick=()=>{ age=b.dataset.a; $$("[data-a]",m).forEach(x=>x.classList.toggle("on",x===b)); });
    $("#psave",m).onclick=()=>{ u.nick=$("#p1",m).value.trim()||u.nick; u.name=$("#p2",m).value.trim()||u.name; u.surname=$("#p3",m).value.trim(); u.age=age; save(); API.call("/api/register",{user:u, lang:S.lang}); m.remove(); TABS.profile(); toast(tx("Saqlandi")); }; });
}
function settingsSheet(){
  const draw = m => { m.querySelector(".sheet").innerHTML = `<i class="grab"></i><h2 class="center">${t("settings")}</h2>
    <span class="lbl">${t("lang")}</span><div class="langs">${[["uzc","Ўзбекча","uz"],["uz","O'zbekcha","uz"],["ru","Русский","ru"]].map(([k,n])=>`<button class="lrow ${S.lang===k?"on":""}" data-lang="${k}"><span>${n}</span>${S.lang===k?ic("check"):""}</button>`).join("")}</div>
    <span class="lbl">${t("look")}</span><div class="seg s3">${[["auto","auto"],["light","sun"],["dark","moonf"]].map(([k,i])=>`<button class="opt ${S.theme===k?"on":""}" data-th="${k}">${ic(i)}${t(k)}</button>`).join("")}</div>
    <div class="toggles"><label><span>${ic("sound")}${t("sound")}</span><input type="checkbox" id="tsnd" ${S.sound?"checked":""}></label><label><span>${ic("bell")}${t("notifs")}</span><input type="checkbox" id="tntf" ${S.notify?"checked":""}></label></div>
    <button class="btn ghost wide" data-close>${t("close")}</button>`;
    $$("[data-lang]",m).forEach(b=>b.onclick=()=>{ S.lang=b.dataset.lang; save(); API.call("/api/register",{user:S.user, lang:S.lang}); render(); draw(m); });
    $$("[data-th]",m).forEach(b=>b.onclick=()=>{ S.theme=b.dataset.th; save(); applyTheme(); draw(m); });
    $("#tsnd",m).onchange=e=>{ S.sound=e.target.checked; save(); }; $("#tntf",m).onchange=e=>{ S.notify=e.target.checked; save(); }; };
  sheet("", draw);
}
const refLink = () => `https://t.me/${CFG.bot}?start=ref_${S.sysId || (TGU?TGU.id:"0")}`;
function shareInvite(){ const url = refLink(), txt = tx("MuhibZiyo — bilimingizni sinang, yulduz yig'ing va farzandlaringiz bilan Odobim o'ynang!");
  openLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(txt)}`); }
PAGES.invite = {fn(){
  const wk = S.refWeek.week===weekKey()?S.refWeek.n:0;
  app.innerHTML = header() + `<main class="wrap">${pageHead(t("invite"))}<div class="center inv"><span class="gift">${ic("gift")}</span><h2>${tx(L()==="ru"?"Пригласите друзей":"Do'stlarni taklif qiling")}</h2>
    <p class="muted">${t("shareSub")} <b class="gold">+5</b> ${ic("star","gold")}, ${t("shareSub2")} <b class="gold">+5</b> ${ic("star","gold")}</p></div>
    <div class="reflink"><span class="tnum">${esc(refLink())}</span><button class="icb" id="cp" aria-label="copy">${ic("copy")}</button></div>
    <button class="btn teal wide" id="snd">${ic("send")}${t("send")}</button>
    <div class="two"><div><b class="tnum" id="fn">${S.friendsN||S.friends.length||0}</b><small>${t("friends")}</small></div><div><b class="tnum">+${wk*5}</b><small>${t("weekStars")}</small></div></div>
    <p class="center muted sm">${t("weekBonus")}: ${wk*5} / 25</p>
    <p class="note">${tx("Havolani ochishning o'zi yetarli emas — do'stingiz birinchi testni yechishi kerak.")}</p>
    <h3 class="sec">${ic("users")} ${t("invitedList")}</h3><div id="fl"><p class="empty">${t("noFriends")}</p></div></main>`;
  bindHeader(); bindBack();
  $("#snd").onclick = shareInvite;
  $("#cp").onclick = ()=>{ const v = refLink(); (navigator.clipboard ? navigator.clipboard.writeText(v) : Promise.reject()).then(()=>toast(t("copied"))).catch(()=>{ const r=document.createRange(); r.selectNodeContents($(".reflink span")); const s=getSelection(); s.removeAllRanges(); s.addRange(r); }); };
  if (API.on) API.call("/api/referrals").then(r=>{ if (!r) return; $("#fn").textContent=r.rows.length; if (r.rows.length) $("#fl").innerHTML = r.rows.map(x=>`<div class="rk"><span class="av">${esc(x.name[0]||"?")}</span><span class="nm">${esc(x.name)}</span><small class="muted">${x.active?"✓ +5 ⭐":tx("test yechmagan")}</small></div>`).join(""); });
}};
PAGES.guide = {fn(){
  app.innerHTML = header() + `<main class="wrap">${pageHead(t("guide"))}${GUIDE.map(g=>`<section class="card guide"><h3>${tx(g.h)}</h3>${(g.p||[]).map(x=>`<p>${tx(x)}</p>`).join("")}${g.list?`<ul class="dots2">${g.list.map(x=>`<li>${tx(x)}</li>`).join("")}</ul>`:""}${g.note?`<p class="quote">${tx(g.note)}</p>`:""}</section>`).join("")}</main>`;
  bindHeader(); bindBack();
}};

/* ===================== ODOBIM moduli ===================== */
const MASCOT = `<svg class="mascot" viewBox="0 0 80 100" aria-hidden="true"><path d="M40 4a7 7 0 017 7h-4a3 3 0 00-6 0h-4a7 7 0 017-7z" fill="var(--gold)"/><path d="M18 22c0-6 10-10 22-10s22 4 22 10v4H18z" fill="var(--gold)"/><rect x="14" y="24" width="52" height="56" rx="20" fill="var(--accent)"/><rect x="21" y="31" width="38" height="40" rx="15" fill="#FFF6DC"/><ellipse cx="40" cy="58" rx="9" ry="11" fill="var(--gold)" opacity=".35"/><g class="eyes"><circle cx="32" cy="46" r="4.2" fill="#16302B"/><circle cx="48" cy="46" r="4.2" fill="#16302B"/><circle cx="33.4" cy="44.6" r="1.4" fill="#fff"/><circle cx="49.4" cy="44.6" r="1.4" fill="#fff"/></g><path class="mouth" d="M34 55q6 5 12 0" stroke="#16302B" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="26" cy="53" r="3" fill="#F2A0A0" opacity=".7"/><circle cx="54" cy="53" r="3" fill="#F2A0A0" opacity=".7"/><rect x="22" y="78" width="36" height="9" rx="4.5" fill="var(--gold)"/></svg>`; window.__MASCOT = MASCOT;
const AVATARS = ["🦁","🐼","🐰","🦊","🐻","🐨","🐤","🐢","🦄","🐬"];
const LIMITS = [0,10,15,20,30,45,60];

/* ---- farzandlar profili ---- */
function kidsInit(){
  if (!Array.isArray(S.kids)) S.kids = [];
  S.parent = Object.assign({pin:"", tts:false, sfx:true, report:true, music:"on"}, S.parent||{}); S.parent.tts = false;
  window.GFX_CFG = () => ({music: S.parent.music || "on", sfx: !!(S.sound && S.parent.sfx)});
  if (!S.kids.length && S.od && S.od.group){        // eski bitta profilni ko'chirish
    S.kids.push(newKid({id:"k1", name:tx("Farzandim"), group:S.od.group, xp:S.od.xp||0, hearts:S.od.hearts==null?5:S.od.hearts, heartTs:S.od.heartTs||Date.now(),
      done:(S.od.done&&S.od.done[S.od.group])||[], streak:S.od.streak||0, lastDay:S.od.lastDay||null}));
    (S.gifts||[]).forEach(g=>{ if (g.kind==="odobim" && !g.kid) g.kid = "k1"; });
    S.kidId = "k1"; S.od.group = null; save();
  }
}
function newKid(o){ return Object.assign({id:"k"+Date.now().toString(36), name:"", group:"kids", av:AVATARS[S.kids.length%AVATARS.length], xp:0, hearts:5, heartTs:Date.now(),
  done:[], streak:0, lastDay:null, limit:0, gender:"", game:{}, time:{day:"",sec:0,extra:0}, log:{}, miss:{}, right:0, wrong:0}, o||{}); }
const kidById = id => (S.kids||[]).find(k=>k.id===id);
const curKid = () => kidById(S.kidId) || null;
let kidChosen = false;     // shu safar kim o'ynashi tanlandimi
function kidTick(k){
  if (k.hearts < 5){ const n = Math.floor((Date.now()-k.heartTs)/(20*6e4)); if (n>0){ k.hearts=Math.min(5,k.hearts+n); k.heartTs+=n*20*6e4; } }
  if (k.time.day !== dayKey()){ k.time = {day:dayKey(), sec:0, extra:0}; }
}
const kidLog = k => { const d=dayKey(); k.log[d] = k.log[d] || {sec:0, lessons:0, right:0, wrong:0};
  const keys = Object.keys(k.log).sort(); while (keys.length>35) delete k.log[keys.shift()]; return k.log[d]; };
const timeLeft = k => k.limit ? k.limit*60 + (k.time.extra||0) - k.time.sec : Infinity;
const odUnitsDone = k => { if (!k || !k.ob || !k.ob.les) return 0; return BOOK.units.filter(u=>(k.ob.les[u.id]||{}).st).length; };
const totalLessons = g => BOOK.units.length;
function syncKids(){ if (!API.on) return; clearTimeout(syncKids.t); syncKids.t = setTimeout(()=>{
  API.call("/api/children", {report:!!S.parent.report, kids:S.kids.map(k=>{ const w = Object.entries(k.log).filter(([d])=>d>=dayKey(new Date(Date.now()-6*864e5)));
    return {id:k.id, name:k.name, group:k.group, units:odUnitsDone(k), lessons:odUnitsDone(k), total:totalLessons(k.group), right:k.right, wrong:k.wrong,
      week:{sec:w.reduce((a,[,v])=>a+v.sec,0), lessons:w.reduce((a,[,v])=>a+v.lessons,0)}, limit:k.limit}; })}); }, 1500); }

/* vaqt hisoblagich: bola Odobimda bo'lgan har 5 soniya */
setInterval(()=>{
  const top = stack[stack.length-1], k = curKid();
  if (!k || !top || !["odobim","odl",...GAME_PAGES].includes(top.name) || document.hidden) return;
  kidTick(k); k.time.sec += 5; kidLog(k).sec += 5;
  if (timeLeft(k) <= 0 && top.name !== "odobim"){ save(); document.querySelectorAll(".gdlg").forEach(x=>x.remove()); stack = stack.filter(x=>x.name!=="odl" && !GAME_PAGES.includes(x.name)); return render(true); }
  if (k.time.sec % 60 === 0) save();
}, 5000);

/* ---- PIN (bolalardan himoya uchun oddiy qulf) ---- */
const pinHash = p => { let h = 5381; for (const c of "muhibziyo:"+p) h = ((h<<5)+h+c.charCodeAt(0))|0; return String(h>>>0); };
function pinGate(title, ok){
  if (!S.parent.pin) return ok();
  let v = "";
  const draw = m => { m.querySelector(".sheet").innerHTML = `<i class="grab"></i><div class="center"><span class="big">${ic("lock")}</span><h2>${title}</h2><p class="muted">${tx("Ota-ona PIN-kodini kiriting")}</p>
    <div class="pindots">${[0,1,2,3].map(i=>`<i class="${i<v.length?"on":""}"></i>`).join("")}</div>
    <div class="pinpad">${[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map(n=>n===""?"<span></span>":`<button data-n="${n}">${n}</button>`).join("")}</div>
    <button class="btn ghost wide" data-close>${t("cancel")}</button></div>`;
    $$("[data-n]",m).forEach(b=>b.onclick=()=>{ const n=b.dataset.n; if (n==="⌫") v=v.slice(0,-1); else if (v.length<4) v+=n; draw(m);
      if (v.length===4){ if (pinHash(v)===S.parent.pin){ m.remove(); ok(); } else { haptic("n","error"); v=""; setTimeout(()=>{ draw(m); const d=$(".pindots",m); d&&d.classList.add("shake"); },120); } } }); };
  sheet("", draw);
}
function pinSet(done){
  let v = "", first = "";
  const draw = m => { m.querySelector(".sheet").innerHTML = `<i class="grab"></i><div class="center"><span class="big">${ic("lock")}</span><h2>${first?tx("PIN-kodni takrorlang"):tx("Yangi PIN-kod (4 raqam)")}</h2>
    <p class="muted">${tx("Bolalar ota-ona bo'limiga va vaqt chegarasiga tegolmasligi uchun.")}</p>
    <div class="pindots">${[0,1,2,3].map(i=>`<i class="${i<v.length?"on":""}"></i>`).join("")}</div>
    <div class="pinpad">${[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map(n=>n===""?"<span></span>":`<button data-n="${n}">${n}</button>`).join("")}</div>
    <button class="btn ghost wide" data-close>${t("cancel")}</button></div>`;
    $$("[data-n]",m).forEach(b=>b.onclick=()=>{ const n=b.dataset.n; if (n==="⌫") v=v.slice(0,-1); else if (v.length<4) v+=n;
      if (v.length===4){ if (!first){ first=v; v=""; } else if (first===v){ S.parent.pin = pinHash(v); save(); m.remove(); toast(tx("PIN-kod o'rnatildi")); done&&done(); return; } else { first=""; v=""; toast(tx("Mos kelmadi, qaytadan kiriting")); } }
      draw(m); }); };
  sheet("", draw);
}

/* ---- ovoz: telefon TTS yoki audio fayl ---- */
const TTS = { ok:false, voice:null,
  init(){ try { if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance==="undefined") return;
    const pick = () => { const vs = speechSynthesis.getVoices(); if (!vs.length) return;
      const pref = L()==="ru" ? ["ru"] : ["uz","tr","kk","az","ru"];
      for (const p of pref){ const v = vs.find(x=>(x.lang||"").toLowerCase().startsWith(p)); if (v){ this.voice=v; break; } }
      this.ok = true; };
    pick(); speechSynthesis.onvoiceschanged = pick; } catch(e){} },
  speak(text, el){ try {
    if (!this.ok) return false; speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/[«»"]/g,"").replace(/\(.*?\)/g,""));
    if (this.voice){ u.voice = this.voice; u.lang = this.voice.lang; } u.rate = .9;
    if (el){ el.classList.add("talk"); u.onend = u.onerror = ()=>el.classList.remove("talk"); }
    speechSynthesis.speak(u); return true; } catch(e){ return false; } },
  stop(){ try { speechSynthesis.cancel(); } catch(e){} }
};
/* ovozli o'qish o'chirilgan (ota-onalar so'rovi bilan) — yoqish uchun: TTS.init(); */
let curAudio = null;
function playVoice(q, text, el){
  if (q.audio){ try { curAudio && curAudio.pause(); curAudio = new Audio(q.audio); if (el){ el.classList.add("talk"); curAudio.onended=()=>el.classList.remove("talk"); } curAudio.play(); return true; } catch(e){} }
  return TTS.speak(text, el);
}
const canVoice = q => !!(q.audio || TTS.ok);

/* ---- ovoz effektlari va animatsiya ---- */
function sfx(kind){
  if (!S.sound || !S.parent.sfx) return;
  if (window.GS) return GS(kind);
  const N = {ok:[[660,.09],[880,.14]], bad:[[240,.12],[180,.18]], tap:[[520,.05]], win:[[523,.12],[659,.12],[784,.12],[1047,.3]], pair:[[700,.06],[940,.1]]}[kind];
  try { actx = actx || new (window.AudioContext||window.webkitAudioContext)(); let at = actx.currentTime;
    for (const [f,d] of N){ const o=actx.createOscillator(), g=actx.createGain(); o.type="triangle"; o.frequency.value=f; g.gain.setValueAtTime(.0001,at); g.gain.exponentialRampToValueAtTime(.09,at+.015); g.gain.exponentialRampToValueAtTime(.0001,at+d);
      o.connect(g); g.connect(actx.destination); o.start(at); o.stop(at+d+.02); at += d*.85; } } catch(e){}
}
function confetti(n=40){
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = document.createElement("div"); box.className = "confetti";
  const C = ["var(--gold)","var(--accent)","var(--o1)","var(--o2)","var(--o3)","var(--red)"];
  for (let i=0;i<n;i++){ const s=document.createElement("i"); s.style.left=Math.random()*100+"%"; s.style.background=C[i%C.length];
    s.style.animationDelay=(Math.random()*.3)+"s"; s.style.animationDuration=(1+Math.random()*.9)+"s"; s.style.setProperty("--dx",(Math.random()*120-60)+"px"); s.style.setProperty("--r",(Math.random()*720-360)+"deg"); box.appendChild(s); }
  document.body.appendChild(box); setTimeout(()=>box.remove(), 2300);
}
function mascotMood(mood){ const m = $(".lesson .qrow .mascot"); if (!m) return; m.classList.remove("happy","sad"); void m.offsetWidth; m.classList.add(mood); }

function odCourse(g){ return ODOBIM[g].units.map((u,ui)=>{ const ls=u.lessons.map((l,li)=>({id:ui+"-"+li,title:l.title,qs:l.qs,ui})); ls.push({id:ui+"-r",title:"Takrorlash",review:true,qs:u.lessons.flatMap(l=>l.qs),ui}); return Object.assign({},u,{ls}); }); }

/* ---- kirish: kim o'ynaydi / vaqt tugadi ---- */
let odTab = "path";
PAGES.odobim = {fn(){
  kidsInit();
  if (!S.kids.length) return odWelcome();
  if (!curKid() || (!kidChosen && S.kids.length>1)) return odWho();
  const k = curKid(); kidTick(k);
  if (timeLeft(k) <= 0) return odTimeUp(k);
  return gameHub(k);
  const C = odCourse(k.group), done = k.done, flat = C.flatMap(u=>u.ls), cur = flat.find(l=>!done.includes(l.id));
  const offs = [0,46,70,46,0,-46,-70,-46]; let n = 0;
  const pathHtml = C.map((u,ui)=>`<section class="unit"><div class="ubanner" style="--c:var(--o${ui%4})"><small>${ui+1}-${tx("bo'lim")}</small><h3>${tx(u.title)}</h3><p>${tx(u.desc)}</p></div>
    <div class="path">${u.ls.map(l=>{ const st = done.includes(l.id)?"done":(cur&&cur.id===l.id?"cur":"locked"); const icon = st==="done"?ic("check"):st==="locked"?ic("lock"):l.review?ic("trophy"):ic("star");
      return `<div class="nodebox" style="transform:translateX(${offs[n++%8]}px)"><button class="node ${st} ${l.review?"review":""}" style="${st==="cur"?`--c:var(--o${ui%4})`:""}" data-l="${l.id}" aria-label="${esc(tx(l.title))}">${st==="cur"?`<span class="ntip">${t("start")}</span>`:""}${icon}</button><span class="nlabel">${tx(l.title)}</span></div>`; }).join("")}</div></section>`).join("");
  const qaHtml = (ODOBIM_QA[k.group]||[]).map(([q,a,s])=>`<details class="qa"><summary>${tx(q)}</summary><div>${tx(a)}${s?`<cite>${tx(s)}</cite>`:""}</div></details>`).join("");
  const d = odUnitsDone(k), nx = GIFTS.odobim[k.group].find(g=>g.units>d), tl = timeLeft(k);
  app.innerHTML = `<main class="wrap od"><div class="phead"><button class="bk" data-back aria-label="${t("back")}">${ic("back")}</button>
      <button class="kidchip" id="odwho"><span class="kav">${k.av}</span><span><b>${esc(k.name)}</b><small>${tx(ODOBIM[k.group].name)} · ${ODOBIM[k.group].age}</small></span>${S.kids.length>1?ic("chev"):""}</button>
      <button class="icb parent" id="odpar" aria-label="${tx("Ota-ona")}">${ic("users")}</button></div>
    <div class="odbar"><span class="fire">${ic("flame")}${k.streak}</span><span class="gold">${ic("star")}${k.xp} XP</span><span class="red">${ic("heart")}${k.hearts}</span>${tl!==Infinity?`<span class="tleft">${ic("clock")}${Math.max(0,Math.ceil(tl/60))} ${tx("daq")}</span>`:""}</div>
    
    <div class="tabs3 t2"><button class="${odTab==="path"?"on":""}" data-ot="path">${tx("Yo'l")}</button><button class="${odTab==="qa"?"on":""}" data-ot="qa">${tx("Savol-javob")}</button></div>
    ${odTab==="path"?pathHtml:`<div class="qas">${qaHtml}</div><p class="note">${tx("Savolingiz bo'lsa, botga yozing — ustoz javob beradi.")}</p>`}</main>`;
  bindBack();
  $("#odwho").onclick = ()=>{ if (S.kids.length>1){ kidChosen=false; PAGES.odobim.fn(); } };
  $("#odpar").onclick = ()=>pinGate(tx("Ota-ona bo'limi"), ()=>go("odParent"));
  $$("[data-ot]").forEach(b=>b.onclick=()=>{ odTab=b.dataset.ot; PAGES.odobim.fn(); });
  $$("[data-l]").forEach(b=>b.onclick=()=>{ if (b.classList.contains("locked")){ toast(tx("Avval oldingi darsni tugating")); sfx("bad"); b.classList.add("shake"); setTimeout(()=>b.classList.remove("shake"),400); return; }
    kidTick(k); if (k.hearts<=0) return toast(tx("Yuraklar tugadi. Har 20 daqiqada bittasi tiklanadi."));
    if (timeLeft(k)<=0) return PAGES.odobim.fn();
    const l = flat.find(x=>x.id===b.dataset.l); const qs = l.review ? shuffle(l.qs).slice(0,7) : l.qs;
    sfx("tap"); go("odl",{l, kid:k.id, queue:qs.map(odPrep), total:qs.length, done:0, miss:0, combo:0}); });
  const c = $(".node.cur"); if (c && done.length) c.scrollIntoView({block:"center"});
}};
function odWelcome(){
  app.innerHTML = `<main class="wrap">${pageHead(t("odobim"))}<div class="center odonb"><div class="odwl">${logoImg()}</div><h2>${tx("Assalomu alaykum!")}</h2>
    <p class="muted">${tx("Odobim bilan odob va axloqni kuniga 5 daqiqada o'rganamiz. Avval farzandingizni qo'shing — har bir bolaning o'z qahramoni va yo'li bo'ladi.")}</p>
    <button class="btn gold wide" id="odadd">${ic("users")}${tx("Farzandni qo'shish")}</button></div></main>`;
  bindBack(); $("#odadd").onclick = ()=>go("odKid",{});
}
function odWho(){
  app.innerHTML = `<main class="wrap">${pageHead(t("odobim"))}<div class="center"><h2 class="who">${tx("Kim o'ynaydi?")}</h2></div>
    <div class="kidgrid">${S.kids.map(k=>{ kidTick(k); return `<button class="kidcard" data-k="${k.id}"><span class="kav big">${k.av}</span><b>${esc(k.name)}</b><small>${ODOBIM[k.group].age} · ${odUnitsDone(k)}/${BOOK.units.length} ${tx("dars")}</small>${timeLeft(k)<=0?`<em>${tx("Bugun yetarli")}</em>`:""}</button>`; }).join("")}
      <button class="kidcard add" id="odadd"><span class="kav big">＋</span><b>${tx("Qo'shish")}</b><small>${tx("ota-ona uchun")}</small></button></div>
    <button class="btn ghost wide" id="odpar">${ic("users")}${tx("Ota-ona bo'limi")}</button></main>`;
  bindBack();
  $$("[data-k]").forEach(b=>b.onclick=()=>{ S.kidId=b.dataset.k; kidChosen=true; save(); sfx("tap"); PAGES.odobim.fn(); });
  $("#odadd").onclick = ()=>pinGate(tx("Farzand qo'shish"), ()=>go("odKid",{}));
  $("#odpar").onclick = ()=>pinGate(tx("Ota-ona bo'limi"), ()=>go("odParent"));
}
function odTimeUp(k){
  app.innerHTML = `<main class="wrap"><div class="phead"><button class="bk" data-back aria-label="${t("back")}">${ic("back")}</button></div>
    <div class="center timeup"><div class="odwl sm">${mascotImg()}</div><h2>${tx("Bugungi o'yin vaqti tugadi")} 🌙</h2>
    <p class="muted">${esc(k.name)}, ${tx("bugun yaxshi o'qiding! Ko'zlaring dam olsin, ertaga davom etamiz.")}</p>
    <div class="tustat"><span>${ic("clock")} ${Math.round(k.time.sec/60)} ${tx("daqiqa")}</span><span>${ic("star")} ${kidLog(k).lessons} ${tx("dars")}</span></div>
    <button class="btn ghost wide" id="tuext">${ic("lock")}${tx("Ota-ona: yana 15 daqiqa")}</button>${S.kids.length>1?`<button class="btn ghost wide" id="tuwho">${tx("Boshqa farzand")}</button>`:""}</div></main>`;
  bindBack();
  $("#tuext").onclick = ()=>pinGate(tx("Vaqtni uzaytirish"), ()=>{ k.time.extra = (k.time.extra||0) + 15*60; save(); toast(tx("+15 daqiqa qo'shildi")); PAGES.odobim.fn(); });
  if ($("#tuwho")) $("#tuwho").onclick = ()=>{ kidChosen=false; PAGES.odobim.fn(); };
}

PAGES.odPath = {fn(){ PAGES.odobim.fn(); }};
/* ---- farzand qo'shish / tahrirlash ---- */
PAGES.odKid = {fn(p){
  const k = p.id ? kidById(p.id) : null, f = p.f = p.f || {name:k?k.name:"", group:k?k.group:"kids", gender:k?(k.gender||""):"", av:k?k.av:AVATARS[S.kids.length%AVATARS.length], limit:k?k.limit:20};
  app.innerHTML = `<main class="wrap">${pageHead(k?tx("Profilni tahrirlash"):tx("Farzandni qo'shish"))}
    <label class="lbl" for="kn">${tx("Ismi")}</label><input id="kn" class="inp" maxlength="24" value="${esc(f.name)}" placeholder="${tx("Masalan: Aisha")}">
    <span class="lbl">${tx("Yoshi")}</span><div class="seg s2">${["kids","teens"].map(g=>`<button class="opt ${f.group===g?"on":""}" data-g="${g}">${ODOBIM[g].age} ${tx("yosh")}</button>`).join("")}</div>
    ${k && f.group!==k.group ? `<p class="note">${tx("Yosh guruhi o'zgarsa, yo'l boshidan boshlanadi (avvalgi natijalar saqlanadi).")}</p>`:""}
    <span class="lbl">${tx("Qahramon")}</span><div class="seg s2">${[["m",tx("O'g'il bola")],["f",tx("Qiz bola")]].map(([v,n])=>`<button class="opt ${f.gender===v?"on":""}" data-gd="${v}">${n}</button>`).join("")}</div>
    <p class="note">${tx("Savollar va qahramon shunga qarab tanlanadi. Bo'sh qoldirsangiz, bola o'yin boshida o'zi tanlaydi.")}</p>
    <span class="lbl">${tx("Belgisi")}</span><div class="avs">${AVATARS.map(a=>`<button class="${f.av===a?"on":""}" data-a="${a}">${a}</button>`).join("")}</div>
    <span class="lbl">${tx("Kunlik o'yin vaqti")}</span><div class="pills left">${LIMITS.map(m=>`<button class="pill ${f.limit===m?"on":""}" data-m="${m}">${m?m+" "+tx("daq"):tx("Cheklovsiz")}</button>`).join("")}</div>
    <button class="btn gold wide" id="ksave">${t("save")}</button>
    ${k?`<button class="btn ghost wide del" id="kdel">${ic("x")}${tx("Profilni o'chirish")}</button>`:""}</main>`;
  bindBack();
  $("#kn").oninput = e=>{ f.name = e.target.value; };
  $$("[data-g]").forEach(b=>b.onclick=()=>{ f.group=b.dataset.g; PAGES.odKid.fn(p); });
  $$("[data-a]").forEach(b=>b.onclick=()=>{ f.av=b.dataset.a; sfx("tap"); PAGES.odKid.fn(p); });
  $$("[data-gd]").forEach(b=>b.onclick=()=>{ f.gender = f.gender===b.dataset.gd ? "" : b.dataset.gd; PAGES.odKid.fn(p); });
  $$("[data-m]").forEach(b=>b.onclick=()=>{ f.limit=+b.dataset.m; PAGES.odKid.fn(p); });
  $("#ksave").onclick = ()=>{ const name = f.name.trim(); if (name.length<2) return toast(tx("Ismni yozing"));
    if (k){ if (k.group!==f.group){ k.doneBy = k.doneBy||{}; k.doneBy[k.group]=k.done; k.done=(k.doneBy[f.group]||[]); } Object.assign(k,{name, group:f.group, gender:f.gender, av:f.av, limit:f.limit}); }
    else { const nk = newKid({name, group:f.group, gender:f.gender, av:f.av, limit:f.limit}); S.kids.push(nk); S.kidId = nk.id; kidChosen = true; }
    save(); syncKids(); haptic("n","success"); stack.pop(); render(true); };
  if ($("#kdel")) $("#kdel").onclick = ()=>sheet(`<div class="center"><h2>${esc(k.name)}</h2><p class="muted">${tx("Profil va uning natijalari o'chiriladi.")}</p>
      <button class="btn red wide" id="kdy">${tx("O'chirish")}</button><button class="btn ghost wide" data-close>${t("cancel")}</button></div>`, m=>{
    $("#kdy",m).onclick=()=>{ S.kids = S.kids.filter(x=>x.id!==k.id); if (S.kidId===k.id) S.kidId = S.kids[0]&&S.kids[0].id; save(); syncKids(); m.remove(); stack.pop(); render(true); }; });
}};

/* ---- ota-ona bo'limi ---- */
PAGES.odParent = {fn(){
  const P = S.parent;
  app.innerHTML = `<main class="wrap">${pageHead(tx("Ota-ona bo'limi"), tx("Farzandlar, vaqt va hisobotlar"))}
    <h3 class="sec">${ic("users")} ${tx("Farzandlarim")}</h3>
    ${S.kids.map(k=>{ kidTick(k); const lg = kidLog(k), acc = k.right+k.wrong ? Math.round(k.right/(k.right+k.wrong)*100) : 0;
      return `<section class="card kidrow"><div class="row"><span class="kav">${k.av}</span><div><b>${esc(k.name)}</b><small class="muted">${ODOBIM[k.group].age} ${tx("yosh")} · ${odUnitsDone(k)}/${BOOK.units.length} ${tx("dars")} · ${acc}% ${tx("aniqlik")}</small></div><span class="sp"></span><button class="icb" data-ed="${k.id}" aria-label="edit">${ic("gear")}</button></div>
        <div class="tbar"><div><i style="width:${k.limit?Math.min(100,k.time.sec/(k.limit*60+(k.time.extra||0))*100):Math.min(100,k.time.sec/36)}%"></i></div><small class="muted">${tx("Bugun")}: ${Math.round(k.time.sec/60)} ${tx("daq")}${k.limit?` / ${k.limit+Math.round((k.time.extra||0)/60)} ${tx("daq")}`:""} · ${lg.lessons} ${tx("dars")}</small></div>
        <button class="btn dark sm" data-rep="${k.id}">${ic("history")}${tx("Batafsil hisobot")}</button></section>`; }).join("")}
    <button class="btn gold wide" id="padd">${ic("users")}${tx("Farzand qo'shish")}</button>
    <h3 class="sec">${ic("gear")} ${tx("Sozlamalar")}</h3>
    <section class="card toggles plain">
      <label><span>${ic("lock")}${tx("PIN-kod")}</span><button class="chip ${P.pin?"teal":""}" id="ppin">${P.pin?tx("O'zgartirish"):tx("O'rnatish")}</button></label>
      <label><span>${ic("sound")}${tx("O'yin musiqasi")}</span><select id="pmus" class="sel">${[["on",tx("Musiqa")],["nature",tx("Faqat tabiat ovozlari")],["off",tx("O'chiq")]].map(([v,n])=>`<option value="${v}" ${(P.music||"on")===v?"selected":""}>${n}</option>`).join("")}</select></label>
      <label><span>${ic("bell")}${tx("O'yin ovozlari")}</span><input type="checkbox" id="psfx" ${P.sfx?"checked":""}></label>
      <label><span>${ic("send")}${tx("Haftalik hisobot botga")}</span><input type="checkbox" id="prep" ${P.report?"checked":""}></label>
    </section>
    ${P.pin?"":`<p class="note">${tx("Maslahat: PIN-kod qo'ysangiz, bolalar vaqt chegarasini o'zgartira olmaydi.")}</p>`}</main>`;
  bindBack();
  $$("[data-ed]").forEach(b=>b.onclick=()=>go("odKid",{id:b.dataset.ed}));
  $$("[data-rep]").forEach(b=>b.onclick=()=>go("odReport",{id:b.dataset.rep}));
  $("#padd").onclick = ()=>go("odKid",{});
  $("#ppin").onclick = e=>{ e.preventDefault(); pinSet(()=>PAGES.odParent.fn()); };
  $("#pmus").onchange = e=>{ P.music = e.target.value; save(); if (window.MUS) MUS.refresh(); toast(P.music==="off"?tx("Musiqa o'chirildi"):P.music==="nature"?tx("Faqat tabiat ovozlari"):tx("Musiqa yoqildi")); };
  $("#psfx").onchange = e=>{ P.sfx = e.target.checked; save(); };
  $("#prep").onchange = e=>{ P.report = e.target.checked; save(); syncKids(); toast(P.report?(API.on?tx("Har yakshanba hisobot keladi"):tx("Bot serveri ulanganda ishlaydi")):tx("Hisobot o'chirildi")); };
}};
PAGES.odReport = {fn(p){
  const k = kidById(p.id); if (!k){ stack.pop(); return render(true); }
  const d = obData(k);
  const days = [...Array(7)].map((_,i)=>{ const dd=new Date(Date.now()-(6-i)*864e5); return {k:dayKey(dd), l:["Ya","Du","Se","Ch","Pa","Ju","Sh"][dd.getDay()]}; });
  const mins = days.map(x=>Math.round(((k.log[x.k]||{}).sec||0)/60)), mx = Math.max(10, ...mins), wl = days.reduce((a,x)=>a+((k.log[x.k]||{}).lessons||0),0);
  const acc = k.right+k.wrong ? Math.round(k.right/(k.right+k.wrong)*100) : 0;
  const hard = Object.entries(d.miss||{}).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([id,n])=>({u:BOOK.units.find(x=>x.id===+id), n})).filter(x=>x.u);
  app.innerHTML = `<main class="wrap">${pageHead(esc(k.name), tx(ODOBIM[k.group].name)+" · "+ODOBIM[k.group].age)}
    <div class="rtiles"><div><b class="tnum">${odUnitsDone(k)}/${BOOK.units.length}</b><small>${tx("dars")}</small></div><div><b class="tnum">${acc}%</b><small>${tx("aniqlik")}</small></div><div><b class="tnum">${d.tr}</b><small>${tx("kubok")}</small></div><div><b class="tnum">${k.streak}</b><small>${tx("kun ketma-ket")}</small></div></div>
    <section class="card"><h3>${ic("clock")}${tx("So'nggi 7 kun")} · ${mins.reduce((a,b)=>a+b,0)} ${tx("daq")} · ${wl} ${tx("dars")}</h3>
      <div class="wchart">${days.map((x,i)=>`<div><span class="tnum">${mins[i]||""}</span><i style="height:${Math.max(3,mins[i]/mx*100)}%" class="${i===6?"today":""}"></i><small>${x.l}</small></div>`).join("")}</div>
      ${k.limit?`<p class="note">${tx("Kunlik chegara")}: ${k.limit} ${tx("daqiqa")}</p>`:""}</section>
    <section class="card"><h3>${ic("book")}${tx("Darslar")}</h3>${BOOK.units.map(u=>{ const st=(d.les[u.id]||{}).st||0; return `<div class="hrow"><span>${u.icon} ${esc(tx(u.title))}</span><b class="${st?"":"muted"}">${st?"★".repeat(st):"—"}</b></div>`; }).join("")}</section>
    <section class="card"><h3>${ic("target")}${tx("Qiyin bo'lgan darslar")}</h3>${hard.length?hard.map(h=>`<div class="hrow"><span>${h.u.icon} ${esc(tx(h.u.title))} <small class="muted">(${h.u.pages[0]}–${h.u.pages[1]}-${tx("betlar")})</small></span><b class="red">${h.n} ${tx("xato")}</b></div>`).join(""):`<p class="muted">${tx("Hozircha qiyinchilik yo'q — barakalloh!")}</p>`}
      ${hard.length?`<p class="note">${tx("Bu mavzularni kitobning ko'rsatilgan betlaridan farzandingiz bilan birga o'qing.")}</p>`:""}</section>
    ${srcBox()}</main>`;
  bindBack();
}};

/* ---- dars: savollarni tayyorlash ---- */
const odPrep = q0 => { const q = Object.assign({}, q0);
  if (q.t==="mc" || q.t==="listen") q.opts = shuffle(q.o.map((x,i)=>({t:x,ok:i===q.a})));
  else if (q.t==="pic") q.opts = shuffle(q.o.map((x,i)=>({t:x, lab:(q.ol||[])[i]||"", ok:i===q.a})));
  else if (q.t==="tf") q.opts = [{t:"To'g'ri",ok:q.a===true,big:"✓"},{t:"Noto'g'ri",ok:q.a===false,big:"✗"}];
  else if (q.t==="order"){ let b; do { b=shuffle(q.items.map((x,i)=>({t:x,i}))); } while(b.length>1 && b.every((x,i)=>x.i===i)); q.bank=b; q.ans=[]; }
  else if (q.t==="word"){ const w = q.ans.split(/\s+/); q.words = w; q.bank = shuffle([...w.map((x,i)=>({t:x,i})), ...(q.extra||[]).map(x=>({t:x,i:-1}))]); q.ans2 = []; }
  else if (q.t==="match"){ q.left = shuffle(q.pairs.map((p,i)=>({t:p[0],i}))); q.right = shuffle(q.pairs.map((p,i)=>({t:p[1],i}))); q.got = []; q.mist = 0; q.pick = null; }
  return q; };
const KINDS = {mc:"To'g'ri javobni tanlang", tf:"To'g'rimi yoki noto'g'rimi?", order:"Tartib bilan joylashtiring", match:"Juftini toping", pic:"Rasmni tanlang", word:"So'zlardan gap tuzing", listen:"Eshiting va tanlang"};
const PRAISE = ["Barakalloh!","Ofarin!","Mashaalloh, to'g'ri!","Zo'r!","Juda yaxshi!"];
PAGES.odl = {full:true, fn(L0){
  const k = kidById(L0.kid) || curKid();
  if (L0.fin) return odFinish(L0, k);
  const q = L0.queue[0]; let sel = null, checked = false;
  const speakText = q.t==="listen" ? q.say : q.q;
  let body = "";
  if (q.t==="mc" || q.t==="listen") body = `<div class="opts">${q.opts.map((o,i)=>`<button class="opt2" data-i="${i}"><kbd>${i+1}</kbd><span>${esc(tx(o.t))}</span></button>`).join("")}</div>`;
  if (q.t==="tf") body = `<div class="opts tf">${q.opts.map((o,i)=>`<button class="opt2" data-i="${i}"><span class="bigs">${o.big}</span>${tx(o.t)}</button>`).join("")}</div>`;
  if (q.t==="pic") body = `<div class="opts pic">${q.opts.map((o,i)=>`<button class="opt2" data-i="${i}"><span class="emo">${o.t}</span>${o.lab?`<small>${esc(tx(o.lab))}</small>`:""}</button>`).join("")}</div>`;
  if (q.t==="order") body = `<div class="ans" id="ans"></div><p class="note">${tx("Pastdagilarni birinchisidan boshlab bosing")}</p><div class="bank" id="bank"></div>`;
  if (q.t==="word") body = `<div class="wline" id="ans"></div><div class="wbank" id="bank"></div>`;
  if (q.t==="match") body = `<div class="mgrid"><div id="ml"></div><div id="mr"></div></div>`;
  const listenBox = q.t==="listen" ? `<div class="listen"><button class="lbtn" id="lplay" aria-label="${tx("Eshitish")}">${ic("sound")}</button>
      ${canVoice(q)?`<small class="muted">${tx("Bosing va eshiting")}</small>`:`<span class="lsay" id="lsay">«${esc(tx(q.say))}»</span>`}</div>` : "";
  app.innerHTML = `<div class="lesson"><div class="qtop"><button class="icb" id="oq" aria-label="${t("exit")}">${ic("x")}</button><div class="bar"><i style="width:${Math.max(4,L0.done/L0.total*100)}%"></i></div><span class="red">${ic("heart")}${k.hearts}</span></div>
    <div class="lw"><small class="eb ${q.again?"fire":""}">${tx(q.again?"Oldingi xato — yana urinib ko'ring":KINDS[q.t])}</small>
    <div class="qrow">${MASCOT}<div class="bubble"><h2>${esc(tx(q.q))}</h2>${canVoice(q)&&q.t!=="listen"?`<button class="spk" id="spk" aria-label="${tx("O'qib berish")}">${ic("sound")}</button>`:""}</div></div>
    ${L0.combo>=3?`<div class="combo">🔥 ${L0.combo} ${tx("ketma-ket to'g'ri!")}</div>`:""}${listenBox}${body}</div>
    <div class="lfoot" id="foot">${q.t==="match"?`<p class="center muted sm">${tx("Chapdan bittasini, keyin o'ngdan juftini bosing")}</p>`:`<button class="btn teal wide" id="chk" disabled>${tx("Tekshirish")}</button>`}</div></div>`;
  const mascotEl = $(".qrow .mascot");
  $("#oq").onclick = ()=>sheet(`<p class="center">${tx("Darsni tark etasizmi? Natija saqlanmaydi.")}</p><button class="btn teal wide" data-close>${t("continue")}</button><button class="btn ghost wide" id="ol">${t("exit")}</button>`, m=>{ $("#ol",m).onclick=()=>{ m.remove(); TTS.stop(); stack.pop(); render(true); }; });
  if ($("#spk")) $("#spk").onclick = ()=>playVoice(q, tx(speakText), mascotEl);
  if ($("#lplay")) $("#lplay").onclick = ()=>{ if (!playVoice(q, tx(q.say), mascotEl)){ const s=$("#lsay"); if (s) s.hidden=false; } $("#lplay").classList.add("pulse"); setTimeout(()=>$("#lplay")&&$("#lplay").classList.remove("pulse"),600); };
  if ($("#lshow")) $("#lshow").onclick = ()=>{ $("#lsay").hidden=false; $("#lshow").remove(); };
  if (S.parent.tts && canVoice(q) && !q.again) setTimeout(()=>{ if (stack[stack.length-1] && stack[stack.length-1].p===L0) playVoice(q, tx(speakText), mascotEl); }, 350);

  const enable = on => { const c=$("#chk"); if (c) c.disabled = !on; };
  if (["mc","listen","tf","pic"].includes(q.t)) $$(".opt2").forEach(b=>b.onclick=()=>{ if (checked) return; sfx("tap"); $$(".opt2").forEach(x=>x.classList.remove("sel")); b.classList.add("sel"); sel=+b.dataset.i; enable(true); });
  const drawOrder = () => { $("#ans").innerHTML = q.ans.map((x,i)=>`<button class="tok" data-k="${i}"><b>${i+1}</b>${esc(tx(x.t))}</button>`).join("");
    $("#bank").innerHTML = q.bank.map((x,i)=>`<button class="tok ${q.ans.includes(x)?"gone":""}" data-b="${i}">${esc(tx(x.t))}</button>`).join("");
    if (checked) return;
    $$("#ans .tok").forEach(b=>b.onclick=()=>{ q.ans.splice(+b.dataset.k,1); drawOrder(); });
    $$("#bank .tok").forEach(b=>b.onclick=()=>{ const x=q.bank[+b.dataset.b]; if(!q.ans.includes(x)){ sfx("tap"); q.ans.push(x); drawOrder(); } });
    enable(q.ans.length===q.items.length); };
  const drawWord = () => { $("#ans").innerHTML = q.ans2.length ? q.ans2.map((x,i)=>`<button class="wtok" data-k="${i}">${esc(tx(x.t))}</button>`).join("") : `<span class="wph">${tx("So'zlarni bosing…")}</span>`;
    $("#bank").innerHTML = q.bank.map((x,i)=>`<button class="wtok ${q.ans2.includes(x)?"gone":""}" data-b="${i}">${esc(tx(x.t))}</button>`).join("");
    if (checked) return;
    $$("#ans .wtok").forEach(b=>b.onclick=()=>{ q.ans2.splice(+b.dataset.k,1); drawWord(); });
    $$("#bank .wtok").forEach(b=>b.onclick=()=>{ const x=q.bank[+b.dataset.b]; if(!q.ans2.includes(x)){ sfx("tap"); q.ans2.push(x); drawWord(); } });
    enable(q.ans2.length===q.words.length); };
  const drawMatch = () => {
    const cell = (side, x) => { const done=q.got.includes(x.i), on=q.pick&&q.pick.side===side&&q.pick.i===x.i; return `<button class="mt ${done?"ok":""} ${on?"sel":""}" data-s="${side}" data-i="${x.i}" ${done?"disabled":""}>${esc(tx(x.t))}</button>`; };
    $("#ml").innerHTML = q.left.map(x=>cell("l",x)).join(""); $("#mr").innerHTML = q.right.map(x=>cell("r",x)).join("");
    $$(".mt").forEach(b=>b.onclick=()=>{ if (checked) return; const side=b.dataset.s, i=+b.dataset.i;
      if (!q.pick || q.pick.side===side){ q.pick={side,i}; sfx("tap"); return drawMatch(); }
      if (q.pick.i===i){ q.got.push(i); q.pick=null; sfx("pair"); haptic("i","light"); drawMatch(); if (q.got.length===q.pairs.length) finish(q.mist<=1, true); }
      else { q.mist++; sfx("bad"); haptic("n","warning"); const a=$(`.mt[data-s="${q.pick.side}"][data-i="${q.pick.i}"]`); [a,b].forEach(x=>x&&x.classList.add("shake","bad")); q.pick=null; setTimeout(drawMatch, 450); } }); };
  if (q.t==="order") drawOrder();
  if (q.t==="word") drawWord();
  if (q.t==="match") drawMatch();

  function finish(ok, isMatch){
    if (checked) return; checked = true; TTS.stop();
    let right = "";
    if (q.t==="order") right = q.items.map((x,i)=>(i+1)+". "+tx(x)).join(" → ");
    else if (q.t==="word") right = tx(q.ans);
    else if (q.t==="match") right = q.pairs.map(p=>tx(p[0])+" — "+tx(p[1])).join(", ");
    else if (q.opts) { const o=q.opts.find(o=>o.ok); right = q.t==="pic" ? o.t+(o.lab?" "+tx(o.lab):"") : tx(o.t); }
    const lg = kidLog(k);
    if (ok){ L0.done++; L0.combo++; k.right++; lg.right++; haptic("n","success"); sfx("ok"); mascotMood("happy"); if (L0.combo===3 || L0.combo===6) confetti(24); }
    else { L0.miss++; L0.combo=0; k.wrong++; lg.wrong++; k.miss[L0.l.id]=(k.miss[L0.l.id]||0)+1; k.hearts=Math.max(0,k.hearts-1); if (k.hearts===4) k.heartTs=Date.now();
      haptic("n","error"); sfx("bad"); mascotMood("sad"); $(".lw").classList.add("shake");
      const ag = odPrep(q0Of(q)); ag.again=true; L0.queue.push(ag); }
    save();
    const out = !ok && k.hearts===0, f = $("#foot"); f.className = "lfoot "+(ok?"ok":"bad");
    f.innerHTML = `<div class="fb2"><span class="badge">${ok?ic("check"):ic("x")}</span><div><h3>${ok?tx(isMatch&&q.mist?"Yaxshi! Barcha juftlar topildi":PRAISE[Math.floor(Math.random()*PRAISE.length)]):tx(isMatch?"Juftlar topildi, lekin xatolar ko'p bo'ldi":"To'g'ri javob:")}</h3>${ok?"":`<p class="right">${esc(right)}</p>`}<p>${esc(tx(q.e||""))}</p></div></div>
      <button class="btn ${ok?"teal":"red"} wide" id="onx">${out?tx("Darsni yakunlash"):t("continue")}</button>`;
    $(".lesson .bar i").style.width = Math.max(4,L0.done/L0.total*100)+"%";
    $("#onx").onclick = ()=>{ if (out){ stack.pop(); render(true); toast(tx("Yuraklar tugadi. Har 20 daqiqada bittasi tiklanadi.")); return; } L0.queue.shift(); if (!L0.queue.length) L0.fin=true; render(true); };
    $("#onx").focus();
  }
  if ($("#chk")) $("#chk").onclick = ()=>{
    let ok;
    if (q.t==="order") ok = q.ans.every((x,i)=>x.i===i);
    else if (q.t==="word") ok = q.ans2.map(x=>x.t).join(" ") === q.words.join(" ");
    else ok = q.opts[sel].ok;
    finish(ok);
  };
}};
function q0Of(q){ const c = Object.assign({}, q); ["opts","bank","ans2","words","left","right","got","mist","pick","again"].forEach(x=>delete c[x]); if (c.t==="order") c.ans=undefined; if (c.t==="word") c.ans = q.ans; return c; }
function odFinish(L0, k){
  const l = L0.l;
  if (!L0.saved){ L0.saved = true;
    const xp = 10 + (L0.miss===0?5:0) + (l.review?5:0); L0.xp = xp; k.xp += xp;
    const before = odUnitsDone(k);
    const first = !k.done.includes(l.id);
    if (first){ k.done.push(l.id); addStars(3); API.event("odobim",{lesson:k.id+"/"+k.group+":"+l.id}); }
    L0.stars = first?3:0; kidLog(k).lessons++;
    const after = odUnitsDone(k); L0.unlocked = GIFTS.odobim[k.group].filter(g=>g.units>before && g.units<=after);
    if (k.lastDay!==dayKey()){ k.streak = k.lastDay===yKey()?k.streak+1:1; k.lastDay=dayKey(); }
    save(); syncKids(); haptic("n","success"); setTimeout(()=>{ sfx("win"); confetti(L0.unlocked.length?90:50); }, 150); }
  const acc = Math.round(L0.total/(L0.total+L0.miss)*100);
  const tl = timeLeft(k);
  app.innerHTML = `<div class="res">${MASCOT.replace('class="mascot"','class="mascot happy jump"')}<h1>${tx(L0.miss===0?"Mukammal dars!":"Dars tugadi!")}</h1><p class="muted">${esc(k.name)}, «${esc(tx(l.title))}» ${tx("darsini tugatding!")}</p>
    <div class="stats"><div style="--c:var(--gold)"><span>XP</span><b>+${L0.xp}</b></div><div style="--c:var(--accent)"><span>${t("accuracy")}</span><b>${acc}%</b></div><div style="--c:var(--gold)"><span>${tx("Yulduz")}</span><b>${ic("star")}${L0.stars}</b></div></div>
    ${GIFTS_ON && L0.unlocked && L0.unlocked.length ? `<p class="bonus big">${ic("gift")} ${tx("Yangi sovg'a ochildi")}: ${L0.unlocked.map(g=>esc(tx(g.title))).join(", ")}</p><button class="btn gold wide" id="og">${tx("Sovg'ani ko'rish")}</button>` : ""}
    ${tl<=0?`<p class="note">${tx("Bugungi o'yin vaqti tugadi. Ertaga davom etamiz!")}</p>`:""}
    <button class="btn teal wide" id="oc">${t("continue")}</button></div>`;
  if ($("#og")) $("#og").onclick = ()=>{ stack=[]; gsub="odobim"; gkid=k.id; setTab("gifts"); };
  $("#oc").onclick = ()=>{ stack.pop(); render(true); };
}

/* ===================== ODOBIM O'YINLARI ===================== */
/* ===================== ODOB YO'LI — «Bola – odobi bilan aziz» kitobi asosidagi o'yin ===================== */
const GAME_PAGES = ["obMap","obFriends","obLesson","obRun","obSkins","obCards","obRoad","obQuests"];
const musBtn = () => `<button class="gico gmus ${(S.parent.music||"on")==="off"?"off":""}" id="gmus" aria-label="${tx("Musiqa")}">${ic("sound")}</button>`;
function bindMus(){ const b = $("#gmus"); if (!b) return; b.onclick = ()=>{ const P = S.parent; if ((P.music||"on")==="off"){ P.music = P._lastMusic || "on"; } else { P._lastMusic = P.music || "on"; P.music = "off"; } save(); b.classList.toggle("off", P.music==="off"); if (window.MUS) MUS.refresh(); sfx("tap"); }; }
const playMus = name => { if (window.MUS) MUS.play(name); };
const LEAGUES = [[0,"Yangi boshlovchi","🌱"],[50,"Bronza liga","🥉"],[120,"Kumush liga","🥈"],[220,"Oltin liga","🥇"],[350,"Olmos liga","💎"],[500,"Odob ustozi","👑"]];
const ROAD = [{t:10,r:"chest",rare:"oddiy"},{t:25,r:"skin",i:1},{t:45,r:"coins",n:50},{t:70,r:"skin",i:2},{t:100,r:"chest",rare:"epik"},{t:140,r:"skin",i:3},{t:190,r:"coins",n:100},{t:250,r:"skin",i:4},{t:320,r:"chest",rare:"afsonaviy"},{t:400,r:"skin",i:5},{t:500,r:"coins",n:200}];
const RARE = {oddiy:{n:"Oddiy",c:"#6FA8DC"}, noyob:{n:"Noyob",c:"#2FB37E"}, epik:{n:"Epik",c:"#9B51E0"}, afsonaviy:{n:"Afsonaviy",c:"#F2B705"}};
const RORDER = ["oddiy","noyob","epik","afsonaviy"];
const REGIONS = [["Mahalla","🏘️","#7CC8F0","#BDE6C1"],["Bog'","🌸","#FFC4DD","#C8EFB5"],["Shahar","🕌","#FFC98A","#FFE9C2"],["Tog' etagi","⛰️","#A9B9F0","#D6F0D0"]];
const QPOOL = [{id:"fin", t:"2 marta marraga yet", n:2, r:30}, {id:"ok", t:"8 ta to'g'ri javob ber", n:8, r:30}, {id:"coin", t:"60 tanga yig'", n:60, r:25},
  {id:"jump", t:"15 marta sakra", n:15, r:20}, {id:"three", t:"Bitta darsni 3 yulduz bilan o'ta", n:1, r:40}, {id:"chest", t:"1 ta sandiq och", n:1, r:20},
  {id:"first", t:"5 ta savolga birinchi urinishda to'g'ri javob ber", n:5, r:30}];
const obData = k => { k.ob = k.ob || {}; const d = {tr:0, coins:0, skin:"", skins:[], les:{}, cards:[], q:null, chests:[], road:[], miss:{}};
  for (const x in d) if (k.ob[x]===undefined) k.ob[x] = d[x];
  const base = (k.gender||"m") + "0"; if (!k.ob.skins.includes(base)) k.ob.skins.push(base); if (!k.ob.skin || k.ob.skin[0] !== (k.gender||"m")) k.ob.skin = base;
  return k.ob; };
const league = tr => { let L = LEAGUES[0]; for (const l of LEAGUES) if (tr >= l[0]) L = l; return L; };
const nextLeague = tr => LEAGUES.find(l=>l[0] > tr);
const skinOf = k => { const d = obData(k); return SKINS[k.gender].find(s=>s.id===d.skin) || SKINS[k.gender][0]; };
const lesSt = (k, u) => (obData(k).les[u.id]||{}).st || 0;
const lesUnlocked = (k, i) => i === 0 || lesSt(k, BOOK.units[i-1]) >= 1;
const nextLesson = k => BOOK.units.find((u,i)=>lesUnlocked(k,i) && !lesSt(k,u)) || BOOK.units.find((u,i)=>lesUnlocked(k,i) && lesSt(k,u) < 3) || BOOK.units[0];
const allCards = () => BOOK.units.flatMap(u=>u.cards.map((c,i)=>Object.assign({id:u.id+"-"+i, u:u.id, icon:u.icon, ut:u.title}, c)));
const regionOf = u => REGIONS[Math.floor((u.id-1)/4) % 4];
function obQuests(k){
  const d = obData(k), day = dayKey();
  if (!d.q || d.q.day !== day){ let h = 7; for (const c of day + k.id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const pool = QPOOL.slice(), pick = []; while (pick.length < 3){ h = (h * 1103515245 + 12345) >>> 0; pick.push(pool.splice(h % pool.length, 1)[0]); }
    d.q = {day, list:pick.map(x=>({id:x.id, p:0, c:false}))}; save(); }
  return d.q.list.map(x=>Object.assign({}, QPOOL.find(y=>y.id===x.id), {ref:x}));
}
const questAdd = (k, id, n) => { if (n > 0) obQuests(k).forEach(q=>{ if (q.id===id && !q.ref.c) q.ref.p = Math.min(q.n, q.ref.p + n); }); };
const questReady = k => obQuests(k).filter(q=>q.ref.p >= q.n && !q.ref.c).length;
function roadGrant(k){
  const d = obData(k), got = [];
  ROAD.forEach((m,i)=>{ if (d.tr >= m.t && !d.road.includes(i)){ d.road.push(i);
    if (m.r==="skin"){ const s = SKINS[k.gender][m.i]; if (!d.skins.includes(s.id)) d.skins.push(s.id); got.push({skin:s}); }
    if (m.r==="coins"){ d.coins += m.n; got.push({coins:m.n}); }
    if (m.r==="chest"){ d.chests.push(m.rare); got.push({chest:m.rare}); } } });
  return got;
}
const roadIcon = m => m.r==="skin" ? "👕" : m.r==="coins" ? "🪙" : "🎁";
const chestHTML = (rare, cls="") => `<span class="chest3 ${cls}" style="--rc:${RARE[rare].c}">${objSVG("chest")}</span>`;
const srcBox = () => `<section class="booksrc"><span>📖</span><div><b>${tx("Manba")}:</b> «${BOOK.meta.title}» (${BOOK.meta.sub}). ${BOOK.meta.author}. ${BOOK.meta.city}: ${BOOK.meta.pub}, ${BOOK.meta.year}.
  <small>${tx("O'yindagi barcha darslar va savollar faqat shu kitob asosida tuzilgan. Har bir javob izohida kitobning beti ko'rsatiladi.")}</small></div></section>`;

/* ---- bosh sahifa ---- */
function gameHub(k){
  if (!k.gender) return gChooseHero(k);
  const d = obData(k); if (roadGrant(k).length) save();
  const L = league(d.tr), NL = nextLeague(d.tr), sk = skinOf(k), nx = nextLesson(k), tl = timeLeft(k);
  const done = BOOK.units.filter(u=>lesSt(k,u)).length, stars = BOOK.units.reduce((a,u)=>a+lesSt(k,u),0);
  const mi = ROAD.findIndex((m,i)=>!d.road.includes(i)), nm = ROAD[mi], pt = mi > 0 ? ROAD[mi-1].t : 0;
  const qr = questReady(k);
  playMus("map");
  app.innerHTML = `<main class="wrap ghub obhub" data-g="${k.gender}"><div class="phead"><button class="bk" data-back aria-label="${t("back")}">${ic("back")}</button>
      <button class="kidchip" id="odwho"><span class="kav">${k.av}</span><span><b>${esc(k.name)}</b><small>${ODOBIM[k.group].age} ${tx("yosh")}</small></span>${S.kids.length>1?ic("chev"):""}</button>
      <button class="icb parent" id="odpar" aria-label="${tx("Ota-ona")}">${ic("users")}</button></div>
    <div class="hublogo">${logoImg()}</div>${OD_ONLY ? "" : `<div class="hubver">v11</div>`}
    <section class="hcard tilt" id="hcard"><div class="hbg"></div><div class="hsp">${[...Array(8)].map((_,i)=>`<i style="left:${8+i*11}%;--d:${3+i%3}s;--dl:-${i*.6}s"></i>`).join("")}</div>
      <div class="hhero" id="hhero"><span class="ped"></span>${heroFrontSkin(k.gender, sk)}</div>
      <div class="hinfo"><span class="lg">${L[2]} ${tx(L[1])}</span><h2>${esc(k.name)}</h2>
        <div class="trow"><span class="tro">🏆 <b>${d.tr}</b></span><span class="tro coin">🪙 <b>${d.coins}</b></span></div>
        ${NL?`<div class="hprog"><i style="width:${(d.tr-L[0])/(NL[0]-L[0])*100}%"></i></div><small>${tx("Keyingi")}: ${NL[2]} ${tx(NL[1])} — ${NL[0]} 🏆</small>`:`<small>${tx("Eng yuqori liga!")}</small>`}
        ${tl!==Infinity?`<small>${ic("clock")} ${Math.max(0,Math.ceil(tl/60))} ${tx("daq qoldi")}</small>`:""}</div></section>
    <button class="gbtn go mega obplay" id="hplay">${ic("play")}<span>${tx("O'YNASH")}<small>${nx.icon} ${esc(tx(nx.title))}</small></span></button>
    ${OD_ONLY && !API.on ? "" : `<section class="frbar"><button class="frbtn" id="hfr"><span class="fri">🏆</span><div><b>${tx("Do'stlar reytingi")}</b><small>${S.obRank&&S.obRank[k.id]?`${S.obRank[k.id]}-o'rin · `:""}${tx("Kim ko'p kubok yig'adi?")}</small></div>${ic("chev","chev")}</button>
      <button class="gbtn go frsend" id="hfrs">${ic("send")}<span>${tx("Do'stga yuborish")}</span></button></section>`}
    ${d.chests.length?`<button class="chestbar" id="hchest">${chestHTML(d.chests[0], "wob")}<b>${d.chests.length} ${tx("ta sandiq kutmoqda!")}</b><span class="gbtn go">${tx("Ochish")}</span></button>`:""}
    ${nm?`<button class="roadbar" id="hroad"><span class="ri">${roadIcon(nm)}</span><div><b>${tx("Kubok yo'li")}</b><div class="hprog"><i style="width:${Math.min(100,(d.tr-pt)/(nm.t-pt)*100)}%"></i></div><small>${d.tr}/${nm.t} 🏆 — ${nm.r==="skin"?esc(tx(SKINS[k.gender][nm.i].name)):nm.r==="coins"?`${nm.n} ${tx("tanga")}`:`${tx(RARE[nm.rare].n)} ${tx("sandiq")}`}</small></div>${ic("chev","chev")}</button>`:""}
    <div class="hrow3"><button class="hmini" id="hmap"><span class="hico">🗺️</span><b>${tx("Bekatlar")}</b><small>${done}/${BOOK.units.length} · ⭐${stars}</small></button>
      <button class="hmini" id="hskin"><span>${heroFrontSkin(k.gender, sk)}</span><b>${tx("Kiyimlar")}</b><small>${d.skins.length}/${SKINS[k.gender].length}</small></button>
      <button class="hmini" id="hcards"><span class="hico">📜</span><b>${tx("Hikmatlar")}</b><small>${d.cards.length}/${allCards().length}</small></button></div>
    <button class="card link qbar" id="hq"><span class="ib">🎯</span><div><b>${tx("Kunlik vazifalar")}</b><small>${obQuests(k).filter(q=>q.ref.c).length}/3 ${tx("bajarildi")}</small></div>${qr?`<span class="badge">${qr}</span>`:ic("chev","chev")}</button>
    ${srcBox()}</main>`;
  bindBack();
  $("#odwho").onclick = ()=>{ if (S.kids.length>1){ kidChosen=false; PAGES.odobim.fn(); } };
  $("#odpar").onclick = ()=>pinGate(tx("Ota-ona bo'limi"), ()=>go("odParent"));
  $("#hplay").onclick = ()=>{ sfx("whoosh"); go("obLesson", {u:nx.id}); };
  $("#hmap").onclick = ()=>go("obMap");
  if ($("#hfr")){ $("#hfr").onclick = ()=>go("obFriends"); $("#hfrs").onclick = ()=>obShare(k); }
  obSync();
  $("#hskin").onclick = ()=>go("obSkins");
  $("#hcards").onclick = ()=>go("obCards");
  $("#hq").onclick = ()=>go("obQuests");
  if ($("#hroad")) $("#hroad").onclick = ()=>go("obRoad");
  if ($("#hchest")) $("#hchest").onclick = ()=>openChest(k, ()=>PAGES.odobim.fn());
  $("#hhero").onclick = ()=>{ const h=$("#hhero .hero"); h.classList.remove("jump"); void h.offsetWidth; h.classList.add("jump"); sfx("jump"); FX.burst(h, {n:16, r:70}); };
  const hc = $("#hcard"); hc.onpointermove = e=>{ const r = hc.getBoundingClientRect(), x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5; hc.style.transform = `rotateY(${x*12}deg) rotateX(${-y*10}deg)`; };
  hc.onpointerleave = ()=>{ hc.style.transform = ""; };
}
function gChooseHero(k){
  app.innerHTML = `<main class="wrap choose"><div class="phead"><button class="bk" data-back aria-label="${t("back")}">${ic("back")}</button><div><h1>${tx("Qahramoningni tanla")}</h1><p>${esc(k.name)}, ${tx("kim bo'lib yugurasan?")}</p></div></div>
    <div class="chgrid"><button class="chcard" data-g="m">${heroSVG("m",0,"idle")}<b>${tx("O'g'il bola")}</b></button><button class="chcard" data-g="f">${heroSVG("f",0,"idle")}<b>${tx("Qiz bola")}</b></button></div>
    <p class="note center">${tx("Kubok yig'ib, yangi kiyimlarni ochasan!")}</p></main>`;
  bindBack(); playMus("map");
  $$("[data-g]").forEach(b=>b.onclick=()=>{ k.gender = b.dataset.g; obData(k); save(); syncKids(); sfx("fanfare"); confetti(40); FX.burst(b, {n:30, r:140}); setTimeout(()=>PAGES.odobim.fn(), 500); });
}

/* ---- bekatlar xaritasi (16 dars) ---- */
/* ---------- Do'stlar bilan bellashuv ---------- */
const friendLink = () => `https://t.me/${CFG.bot}?start=of_${S.sysId || (TGU?TGU.id:"0")}`;
function obShare(k){
  const d = obData(k), txt = tx(`🏆 ${k.name} Odobim o'yinida ${d.tr} ta kubok yig'di! Men bilan bellash — kim ko'p yig'ar ekan? 👇`);
  openLink(`https://t.me/share/url?url=${encodeURIComponent(friendLink())}&text=${encodeURIComponent(txt)}`);
}
let obSyncT = 0;
function obSync(now){
  if (!API.on || !S.kids || !S.kids.length) return;
  clearTimeout(obSyncT);
  obSyncT = setTimeout(()=>API.call("/api/odobim/score", {kids: S.kids.filter(k=>k.ob).map(k=>({id:k.id, name:k.name, av:k.av, grp:k.group, skin:obData(k).skin, tr:obData(k).tr}))}), now ? 0 : 800);
}
PAGES.obFriends = {fn(){
  const k = curKid(), d = obData(k);
  playMus("map");
  app.innerHTML = `<main class="wrap ghub obfr" data-g="${k.gender}">${pageHead(tx("Do'stlar reytingi"), tx("Kubok bo'yicha"))}
    <section class="frhero"><span class="fri big">🏆</span><div><b>${tx("Do'stlaringni chaqir!")}</b><small>${tx("Havolani do'stingga yubor. U o'yinga kirsa, bir-biringizning kubogingizni ko'rib, bellashasiz.")}</small></div></section>
    <button class="gbtn go big wide" id="frs">${ic("send")} ${tx("Do'stga yuborish")}</button>
    <div class="rows frrows" id="frrows"><p class="empty">…</p></div></main>`;
  bindBack();
  $("#frs").onclick = ()=>obShare(k);
  const medal = i => i===0?"🥇":i===1?"🥈":i===2?"🥉":`<span class="n">${i+1}</span>`;
  const draw = (rows, nf) => {
    rows.forEach((r,i)=>{ if (r.me && r.kid){ S.obRank = S.obRank||{}; S.obRank[r.kid] = i+1; } }); save();
    $("#frrows").innerHTML = rows.map((r,i)=>{ const L = league(r.tr);
      return `<div class="rk fr ${r.me?"me":""} ${r.me && r.kid===k.id?"self":""}"><span class="pos">${medal(i)}</span><span class="av">${esc(r.av||"🙂")}</span><span class="nm"><b>${esc(r.name)}</b><small>${L[2]} ${esc(tx(L[1]))}${!r.me && r.parent?` · ${esc(r.parent)}`:""}</small></span><b class="tnum">${r.tr} 🏆</b></div>`; }).join("")
      + (nf ? "" : `<p class="note center">${tx("Hozircha do'stlar yo'q. «Do'stga yuborish» tugmasini bosing!")}</p>`)
      + (API.on ? "" : `<p class="note center">${tx("Do'stlar reytingi Telegram'dagi botda ishlaydi.")}</p>`); };
  const local = () => S.kids.filter(x=>x.ob).map(x=>({name:x.name, av:x.av, tr:obData(x).tr, me:true, kid:x.id})).sort((a,b)=>b.tr-a.tr);
  if (!API.on) return draw(local(), 0);
  draw(local(), 1);
  obSync(true);
  setTimeout(()=>API.call("/api/odobim/friends").then(r=>{ if (!r || !$("#frrows")) return; draw(r.rows.length ? r.rows : local(), r.friends); }), 350);
}};
PAGES.obMap = {fn(){
  const k = curKid(), d = obData(k); playMus("map");
  const cur = nextLesson(k);
  const offs = [0, 70, 100, 70, 0, -70, -100, -70];
  app.innerHTML = `<main class="wrap obmap" data-g="${k.gender}">${pageHead(tx("Bekatlar"), `«${BOOK.meta.title}» ${tx("kitobi bo'yicha")} ${BOOK.units.length} ${tx("dars")}`)}
    ${REGIONS.map((R,ri)=>`<section class="oreg" style="--r1:${R[2]};--r2:${R[3]}"><div class="oreg-h">${R[1]} <b>${tx(R[0])}</b></div>
      ${BOOK.units.slice(ri*4, ri*4+4).map((u,j)=>{ const i = ri*4+j, st = lesSt(k,u), open = lesUnlocked(k,i), isCur = u.id===cur.id;
        return `<div class="onode-w" style="transform:translateX(${offs[i%8]}px)"><button class="onode ${st?"done":""} ${open?"":"lock"} ${isCur?"cur":""}" data-u="${u.id}">
          ${isCur?`<span class="ohero">${heroFrontSkin(k.gender, skinOf(k))}</span>`:""}<span class="oic">${open?u.icon:"🔒"}</span></button>
          <span class="ost">${[1,2,3].map(n=>`<i class="${st>=n?"on":""}">★</i>`).join("")}</span><b class="ot">${i+1}. ${esc(tx(u.title))}</b></div>`; }).join("")}</section>`).join("")}
    ${srcBox()}</main>`;
  bindBack();
  $$("[data-u]").forEach(b=>b.onclick=()=>{ const i = BOOK.units.findIndex(u=>u.id===+b.dataset.u);
    if (!lesUnlocked(k,i)){ sfx("bad"); FX.shake(b); return toast(tx("Avval oldingi darsni o'ting")); }
    sfx("tap"); go("obLesson", {u:+b.dataset.u}); });
  const c = $(".onode.cur"); if (c) c.scrollIntoView({block:"center"});
}};

/* ---- dars kartasi: kitobdan qisqa saboq, keyin yugurish ---- */
PAGES.obLesson = {full:true, fn(p){
  const k = curKid(), d = obData(k), u = BOOK.units.find(x=>x.id===p.u), st = lesSt(k,u), R = regionOf(u); playMus("map");
  const cards = u.story || u.lesson.map(x=>({e:u.icon, t:x.t, p:x.p}));
  let i = 0;
  const start = sh => { kidTick(k); if (timeLeft(k) <= 0) return PAGES.odobim.fn(); if (sh && d.coins >= 30){ d.coins -= 30; save(); } sfx("fanfare"); stack.pop(); go("obRun", {u:u.id, shield:sh}); };
  const draw = () => {
    const last = i >= cards.length, c = cards[Math.min(i, cards.length-1)];
    app.innerHTML = `<div class="story" data-g="${k.gender}" style="--r1:${R[2]};--r2:${R[3]};--bgi:url('${imgURL("bg_" + ((u.id-1)%4), true)}')">
      <div class="sbars">${cards.map((_,j)=>`<i class="${j<=i?"on":""}"></i>`).join("")}<i class="${last?"on":""}"></i></div>
      <div class="stop"><button class="gico" id="sx" aria-label="${t("back")}">${ic("back")}</button><b>${u.icon} ${esc(tx(u.title))}</b>${musBtn()}</div>
      ${last ? `<div class="scard"><div class="se">🏃</div><div class="st">${tx("Tayyormisan?")}</div>
          <div class="sp">${tx("Yo'lda savol darvozalari bor. Qahramon to'xtaydi — sen javobni tanlaysan!")}</div>${st?`<div class="lbest">${[1,2,3].map(n=>`<i class="${st>=n?"on":""}">★</i>`).join("")}</div>`:""}</div>
        <div class="sfin"><button class="gbtn go mega" id="sgo">${ic("play")}${tx("YUGURISH")}</button>
          ${d.coins >= 30 ? `<button class="gbtn big" id="sgo2">📗 ${tx("Qalqon bilan")} — 30 🪙</button>` : ""}
          <button class="glink" id="sback">↺ ${tx("Kartochkalarni qayta ko'rish")}</button></div>`
      : `<div class="scard" id="snext"><div class="se">${c.e}</div><div class="st">${esc(tx(c.t))}</div><div class="sp">📖 «${BOOK.meta.title}», ${c.p}-${tx("bet")}</div></div>
        <div class="snav">${i?`<button class="gico" id="sprev" aria-label="${tx("Orqaga")}">${ic("back")}</button>`:""}<span class="stap">👆 ${tx("Bosing")}</span></div>`}
    </div>`;
    bindMus();
    $("#sx").onclick = ()=>{ stack.pop(); render(true); };
    const nx = $("#snext"); if (nx) nx.onclick = ()=>{ i++; sfx(i >= cards.length ? "star" : "pop"); draw(); };
    const pv = $("#sprev"); if (pv) pv.onclick = e=>{ e.stopPropagation(); i--; sfx("tap"); draw(); };
    if ($("#sgo")) $("#sgo").onclick = ()=>start(false);
    if ($("#sgo2")) $("#sgo2").onclick = ()=>start(true);
    if ($("#sback")) $("#sback").onclick = ()=>{ i = 0; draw(); };
  };
  draw();
}};

/* ---- yugurish ---- */
let curRun = null;
PAGES.obRun = {full:true, fn(p){
  const k = curKid(), d = obData(k), u = BOOK.units.find(x=>x.id===p.u);
  if (curRun){ curRun.destroy(); curRun = null; }
  const teens = k.group === "teens", n = teens ? 8 : 6;
  const pool = u.qs.filter(q=>!q.g || q.g===k.gender);
  const l1 = shuffle(pool.filter(q=>q.l===1)), l2 = shuffle(pool.filter(q=>q.l===2));
  const qs = shuffle((teens ? [...l2, ...l1] : [...l1, ...l2]).slice(0, n));
  playMus(regionOf(u)[0]==="Shahar" ? "karvon" : "vodiy");
  app.innerHTML = `<div class="obrun" id="obrun" data-g="${k.gender}"></div>`;
  curRun = RUNNER.start({host:$("#obrun"), unit:u, qs, gender:k.gender, skin:skinOf(k), age:k.group, coins:d.coins, sfx,
    onEnd:s=>{ curRun = null; obFinish(k, u, s); }});
  if (p.shield) curRun.p.shield = true;
}};
function obFinish(k, u, s){
  const d = obData(k), lg = kidLog(k);
  if (s.quit){ stack.pop(); return render(true); }
  k.right += s.correct; k.wrong += s.wrong; lg.right += s.correct; lg.wrong += s.wrong;
  if (s.wrongQs.length) d.miss[u.id] = (d.miss[u.id]||0) + s.wrongQs.length;
  const coins = Math.max(0, s.coinsRun - (s.reviveCost||0)); d.coins += coins;
  const trGain = s.first * 2 + (s.correct - s.first) + (s.done ? 3 : 0), oldL = league(d.tr); d.tr += trGain; setTimeout(()=>obSync(true), 300);
  let st = 0, firstDone = false, chest = null;
  if (s.done){
    st = s.wrong === 0 ? 3 : s.wrong <= 2 ? 2 : 1; const prev = d.les[u.id] || {};
    firstDone = !prev.st; d.les[u.id] = {st:Math.max(prev.st||0, st), n:(prev.n||0) + 1};
    if (firstDone){ addStars(3); lg.lessons++; API.event("odobim", {lesson:`${k.id}/${k.group}:${u.id-1}-0`}); }
    if (k.lastDay!==dayKey()){ k.streak = k.lastDay===yKey()?k.streak+1:1; k.lastDay=dayKey(); }
    const r = Math.random(); chest = r < .03 ? "afsonaviy" : r < .13 ? "epik" : r < .4 ? "noyob" : "oddiy"; d.chests.push(chest);
    questAdd(k, "fin", 1); if (st === 3) questAdd(k, "three", 1);
  }
  questAdd(k, "ok", s.correct); questAdd(k, "coin", coins); questAdd(k, "jump", s.jumps); questAdd(k, "first", s.first);
  const road = roadGrant(k), newL = league(d.tr);
  save(); syncKids();
  const ov = document.createElement("div"); ov.className = "gdlg win obres"; ov.dataset.g = k.gender;
  const nxi = BOOK.units.findIndex(x=>x.id===u.id) + 1, nxu = BOOK.units[nxi];
  ov.innerHTML = `<div class="gcard center"><small class="eb">${u.icon} ${esc(tx(u.title))}</small>
    <h2>${s.done ? tx("Marraga yetdingiz!") : tx("Yaxshi harakat!")}</h2>
    ${s.done ? `<div class="rstars">${[1,2,3].map(n=>`<i class="${st>=n?"on":""}" style="--d:${n*.25}s">★</i>`).join("")}</div>` : `<p class="muted">${tx("Marraga yetish uchun yana urinib ko'ring — har safar o'rganganingiz qoladi!")}</p>`}
    <div class="winrow"><span>✅ ${s.correct}/${s.total}</span><span>🪙 +${coins}</span><span>🏆 +${trGain}</span></div>
    ${newL !== oldL ? `<p class="bonus">${newL[2]} ${tx("Yangi liga")}: <b>${tx(newL[1])}</b>!</p>` : ""}
    ${road.map(r=>`<p class="bonus">🎉 ${tx("Kubok yo'li")}: ${r.skin ? `${tx("yangi kiyim")} — <b>${esc(tx(r.skin.name))}</b>` : r.coins ? `+${r.coins} 🪙` : `${tx(RARE[r.chest].n)} ${tx("sandiq")}`}</p>`).join("")}
    ${firstDone && !OD_ONLY ? `<p class="bonus">⭐ +3 ${tx("yulduz (umumiy hisobga)")}</p>` : ""}
    ${s.wrongQs.length ? `<details class="recap"><summary>${tx("Takrorlab olamiz")} (${s.wrongQs.length})</summary>${s.wrongQs.map(q=>{ const S2 = q.s || q; return `<div><b>${esc(S2.q)}</b><p>${esc(q.t==="tf"?(q.a?"✅ To'g'ri":"❌ Noto'g'ri"):"✅ "+(S2.o||q.o)[q.a])}</p><small>${esc(S2.e)} (${q.p}-${tx("bet")})</small></div>`; }).join("")}</details>` : ""}
    <div class="gopts">${chest ? `<button class="gbtn go big" data-a="chest">🎁 ${tx("Sandiqni ochish")}</button>` : ""}
      ${s.done && nxu && lesUnlocked(k, nxi) ? `<button class="gbtn ${chest?"":"go"} big" data-a="next">${nxu.icon} ${tx("Keyingi dars")}</button>` : ""}
      <button class="gbtn big" data-a="again">🔁 ${tx("Yana yugurish")}</button><button class="glink" data-a="home">${tx("Bosh sahifa")}</button></div></div>`;
  document.body.appendChild(ov);
  if (s.done){ confetti(90); FX.fireworks(2600); }
  const goTo = fn => { ov.remove(); fn(); };
  const home = () => { stack = stack.filter(x=>!GAME_PAGES.includes(x.name)); render(true); };
  ov.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{ sfx("tap"); const a = b.dataset.a;
    if (a==="chest") goTo(()=>{ home(); openChest(k, ()=>PAGES.odobim.fn()); });
    if (a==="next") goTo(()=>{ stack = stack.filter(x=>!GAME_PAGES.includes(x.name)); go("obLesson", {u:nxu.id}); });
    if (a==="again") goTo(()=>{ stack.pop(); go("obRun", {u:u.id}); });
    if (a==="home") goTo(home); });
}

/* ---- sandiq (Starr Drop uslubida): bosib, darajasini oshirasiz ---- */
function openChest(k, after){
  const d = obData(k); if (!d.chests.length) return after && after();
  let rare = d.chests.shift(), taps = 0; save();
  const ov = document.createElement("div"); ov.className = "gdlg win chestov"; ov.dataset.g = k.gender;
  const draw = () => { ov.innerHTML = `<div class="chestbox" style="--rc:${RARE[rare].c}"><span class="crays"></span><b class="crare">${tx(RARE[rare].n)}</b>${chestHTML(rare, "big")}
      <p>${taps < 3 ? `${tx("Bosing!")} ${"●".repeat(3-taps)}${"○".repeat(taps)}` : ""}</p></div>`; };
  draw(); document.body.appendChild(ov); sfx("chest");
  ov.onclick = () => {
    if (taps >= 3) return;
    taps++; sfx("chest"); haptic("i","medium"); FX.shake(ov.querySelector(".chest3"));
    const up = {oddiy:.38, noyob:.26, epik:.14, afsonaviy:0}[rare];
    if (Math.random() < up){ rare = RORDER[RORDER.indexOf(rare) + 1]; sfx("star"); FX.flash(RARE[rare].c); }
    draw();
    if (taps >= 3) setTimeout(reveal, 450);
  };
  const reveal = () => {
    const base = {oddiy:[10,20], noyob:[25,40], epik:[50,80], afsonaviy:[100,150]}[rare], coins = base[0] + Math.floor(Math.random() * (base[1]-base[0]));
    let card = null;
    if (Math.random() < {oddiy:.3, noyob:.65, epik:1, afsonaviy:1}[rare]){
      const maxU = Math.max(1, ...BOOK.units.filter(u=>lesSt(k,u)).map(u=>u.id)), pool = allCards().filter(c=>!d.cards.includes(c.id) && c.u <= maxU + 1);
      if (pool.length){ card = pool[Math.floor(Math.random()*pool.length)]; d.cards.push(card.id); }
    }
    d.coins += coins; questAdd(k, "chest", 1); save();
    sfx("treasure"); FX.rays(ov.querySelector(".chest3"), {size:420}); FX.burst(ov.querySelector(".chest3"), {n:40, r:160, up:80});
    ov.onclick = null;
    ov.innerHTML = `<div class="gcard center"><small class="eb" style="color:${RARE[rare].c}">${tx(RARE[rare].n)} ${tx("sandiq")}</small>
      <div class="cgot">🪙 +${coins}</div>
      ${card ? `<div class="hcardx"><small>${card.icon} ${tx("Yangi hikmat kartochkasi")}</small><p>«${esc(card.t)}»</p><cite>«${BOOK.meta.title}», ${card.p}-${tx("bet")}</cite></div>` : ""}
      <div class="gopts">${d.chests.length ? `<button class="gbtn go big" data-a="more">🎁 ${tx("Keyingi sandiq")} (${d.chests.length})</button>` : ""}<button class="gbtn ${d.chests.length?"":"go"} big" data-a="ok">${tx("Ajoyib!")}</button></div></div>`;
    ov.querySelector('[data-a="ok"]').onclick = e => { e.stopPropagation(); ov.remove(); after && after(); };
    const m = ov.querySelector('[data-a="more"]'); if (m) m.onclick = e => { e.stopPropagation(); ov.remove(); openChest(k, after); };
  };
}

/* ---- kiyimlar ---- */
PAGES.obSkins = {fn(){
  const k = curKid(), d = obData(k); playMus("map");
  const need = s => { const m = ROAD.find(x=>x.r==="skin" && SKINS[k.gender][x.i].id===s.id); return m ? m.t : 0; };
  app.innerHTML = `<main class="wrap ghub" data-g="${k.gender}">${pageHead(tx("Kiyimlar"), tx("Kubok yig'ib yangilarini oching"))}
    <section class="hcard ward"><div class="hbg"></div><div class="hhero"><span class="ped"></span>${heroFrontSkin(k.gender, skinOf(k))}</div></section>
    <div class="wlist">${SKINS[k.gender].map(s=>{ const got = d.skins.includes(s.id), on = d.skin===s.id;
      return `<button class="witem ${got?"got":""} ${on?"on":""}" data-s="${s.id}" ${got?"":"disabled"} style="--rc:${RARE[s.rare].c}"><span>${got?heroFrontSkin(k.gender, s):ic("lock")}</span><b>${esc(tx(s.name))}</b><small class="rtag">${tx(RARE[s.rare].n)}</small><small>${on?tx("Kiyilgan"):got?tx("Kiyish"):`🏆 ${need(s)}`}</small></button>`; }).join("")}</div></main>`;
  bindBack();
  $$("[data-s]").forEach(b=>b.onclick=()=>{ d.skin = b.dataset.s; save(); sfx("star"); PAGES.obSkins.fn(); FX.burst($(".hhero"), {n:24, r:110}); });
}};
/* ---- hikmatlar albomi ---- */
PAGES.obCards = {fn(){
  const k = curKid(), d = obData(k), C = allCards();
  app.innerHTML = `<main class="wrap" data-g="${k.gender}">${pageHead(tx("Hikmatlar to'plami"), `${d.cards.length}/${C.length} · ${tx("sandiqlardan chiqadi")}`)}
    ${BOOK.units.map(u=>`<h3 class="sec">${u.icon} ${esc(tx(u.title))}</h3><div class="cgrid">${C.filter(c=>c.u===u.id).map(c=>d.cards.includes(c.id)
      ? `<div class="hcardx"><p>«${esc(c.t)}»</p><cite>${c.p}-${tx("bet")}</cite></div>` : `<div class="hcardx lock"><span>❔</span><small>${tx("Sandiqdan chiqadi")}</small></div>`).join("")}</div>`).join("")}
    ${srcBox()}</main>`;
  bindBack();
}};
/* ---- kubok yo'li ---- */
PAGES.obRoad = {fn(){
  const k = curKid(), d = obData(k);
  app.innerHTML = `<main class="wrap" data-g="${k.gender}">${pageHead(tx("Kubok yo'li"), `🏆 ${d.tr}`)}
    <div class="troad">${ROAD.map((m,i)=>{ const got = d.road.includes(i); return `<div class="tstep ${got?"got":""} ${!got && d.tr < m.t && (i===0 || d.road.includes(i-1))?"cur":""}">
      <span class="tt">🏆 ${m.t}</span><span class="tic">${m.r==="skin"?heroFrontSkin(k.gender, SKINS[k.gender][m.i]):m.r==="chest"?chestHTML(m.rare):"🪙"}</span>
      <b>${m.r==="skin"?esc(tx(SKINS[k.gender][m.i].name)):m.r==="coins"?`${m.n} ${tx("tanga")}`:`${tx(RARE[m.rare].n)} ${tx("sandiq")}`}</b>${got?`<span class="ok">✓</span>`:""}</div>`; }).join("")}</div>
    <p class="note">${tx("Kubok har bir to'g'ri javob uchun beriladi: birinchi urinishda +2, qayta urinishda +1, marraga yetganda +3.")}</p></main>`;
  bindBack();
}};
/* ---- kunlik vazifalar ---- */
PAGES.obQuests = {fn(){
  const k = curKid(), d = obData(k), Q = obQuests(k);
  app.innerHTML = `<main class="wrap" data-g="${k.gender}">${pageHead(tx("Kunlik vazifalar"), tx("Har kuni yangilanadi"))}
    ${Q.map((q,i)=>`<section class="card quest ${q.ref.c?"done":""}"><div class="row"><b>${esc(tx(q.t))}</b><span class="sp"></span><span>🪙 ${q.r}</span></div>
      <div class="hprog"><i style="width:${q.ref.p/q.n*100}%"></i></div><div class="row"><small class="muted">${q.ref.p}/${q.n}</small><span class="sp"></span>
      ${q.ref.c?`<small>✓ ${tx("Olindi")}</small>`:q.ref.p>=q.n?`<button class="gbtn go" data-q="${i}">${tx("Olish")}</button>`:""}</div></section>`).join("")}</main>`;
  bindBack();
  $$("[data-q]").forEach(b=>b.onclick=()=>{ const q = Q[+b.dataset.q]; q.ref.c = true; d.coins += q.r; save(); sfx("coin"); FX.fly(b, b, "🪙", {n:3}); FX.burst(b, {n:20}); setTimeout(()=>PAGES.obQuests.fn(), 500); });
}};

/* ---------- start ---------- */
document.addEventListener("keydown", e=>{ if (e.key==="Escape") back(); });
if (tg) try { tg.onEvent("themeChanged", applyTheme); } catch(e){}
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
const sp = tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param; if (sp && /^ref_/.test(sp) && !S.invitedBy) { S.invitedBy = sp.slice(4); save(); }
if (API.on) API.call("/api/me").then(r=>{ syncUser(r); if (S.loc) syncPrayer(); });
render(true);
window.__MZ = {get S(){return S;}, BOOK, obData, get curRun(){return curRun;}, get top(){return stack[stack.length-1];}, BOOKS, PT, cyr, nextPrayer, fmtT};
})();
