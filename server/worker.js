/* Odobim bot serveri — Cloudflare Worker.
   Vazifalar: /start javobi, do'stlar reytingi (o'yin uchun API), kunlik eslatma, yangi multfilm xabari.
   Kalitlar: BOT_TOKEN (Cloudflare secret). Ma'lumotlar: KV (binding DB). */

const APP_URL = "https://mukhibullokh.github.io/odobim-bot/";
const EPISODES_URL = APP_URL + "episodes.json";
const BANNER = "https://d8j0ntlcm91z4.cloudfront.net/user_3BU2MlPv3we8DCTjdMWqvmqHc6f/hf_20261124_105810_103267b5-c68a-4097-b182-6e4db592fc25.png";
const BATCH = 40; // bir daqiqada yuboriladigan xabarlar soni (bepul tarif cheklovi ichida)

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Init-Data",
  "Access-Control-Max-Age": "86400"
};
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json", ...CORS } });
const enc = new TextEncoder();
const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");

async function sha256hex(s) { return hex(await crypto.subtle.digest("SHA-256", enc.encode(s))); }
async function hmac(key, data) {
  const k = await crypto.subtle.importKey("raw", typeof key === "string" ? enc.encode(key) : key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return crypto.subtle.sign("HMAC", k, enc.encode(data));
}

/* Telegram Mini App initData tekshiruvi */
async function webAppUser(req, env) {
  const init = req.headers.get("X-Init-Data") || "";
  if (!init) return null;
  const p = new URLSearchParams(init);
  const hash = p.get("hash"); if (!hash) return null;
  p.delete("hash");
  const dcs = [...p.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([k, v]) => k + "=" + v).join("\n");
  const secret = await hmac("WebAppData", env.BOT_TOKEN);
  const sig = hex(await hmac(secret, dcs));
  if (sig !== hash) return null;
  const age = Date.now() / 1000 - Number(p.get("auth_date") || 0);
  if (age > 30 * 86400) return null;
  try { return JSON.parse(p.get("user")); } catch (e) { return null; }
}

/* ---------- Telegram API ---------- */
async function tg(env, method, body) {
  const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  return r.json().catch(() => ({ ok: false }));
}
const appButton = (text = "🎮 O‘yinlarni ochish", hash = "") => ({ inline_keyboard: [[{ text, web_app: { url: APP_URL + hash } }]] });

/* ---------- ma'lumotlar ---------- */
const getJ = async (env, k, d) => { const v = await env.DB.get(k); if (!v) return d; try { return JSON.parse(v); } catch (e) { return d; } };
const putJ = (env, k, v) => env.DB.put(k, JSON.stringify(v));

async function saveUser(env, from) {
  const key = "u:" + from.id;
  const old = await getJ(env, key, null);
  const u = Object.assign({ id: from.id, remind: true, news: true, joined: Date.now() }, old || {}, {
    name: [from.first_name, from.last_name].filter(Boolean).join(" ").slice(0, 40), active: true
  });
  if (!old || old.name !== u.name || old.active === false) await putJ(env, key, u);
  if (!old) {
    const list = await getJ(env, "users", []);
    if (!list.includes(from.id)) { list.push(from.id); await putJ(env, "users", list); }
  }
  return { u, isNew: !old };
}

async function addFriend(env, a, b) {
  if (!a || !b || a === b) return;
  for (const [x, y] of [[a, b], [b, a]]) {
    const f = await getJ(env, "f:" + x, []);
    if (!f.includes(y)) { f.push(y); await putJ(env, "f:" + x, f.slice(-200)); }
  }
}

/* ---------- bot xabarlari ---------- */
const WELCOME = (name) =>
`Assalomu alaykum${name ? ", " + name : ""}! 👋

Odobim — bolajonlar uchun tarbiyaviy o‘yinlar va multfilmlar.

🏃 Odob yo‘li — yugur, tanga yig‘, savollarga javob ber
🃏 Juftini top — xotira o‘yini
❓ Odob viktorinasi — qaysi biri to‘g‘ri?
📒 Yaxshi ishlar — har kuni yulduz yig‘
📺 Multfilmlar — Halili va opalarining sarguzashtlari

Pastdagi tugmani bosing va o‘ynang! 🌟`;

const HELP =
`🎮 /start — o‘yinlarni ochish
🔔 /eslatma — kunlik eslatmani yoqish yoki o‘chirish
📺 /yangiliklar — yangi multfilm xabarini yoqish yoki o‘chirish`;

async function onMessage(env, m) {
  if (!m.from || m.from.is_bot || !m.chat || m.chat.type !== "private") return;
  const text = (m.text || "").trim();
  const { u } = await saveUser(env, m.from);
  const id = m.from.id;

  if (text.startsWith("/start")) {
    const arg = text.split(" ")[1] || "";
    const mm = arg.match(/^(?:of|ref)_(\d+)$/);
    if (mm) await addFriend(env, id, Number(mm[1]));
    const r = await tg(env, "sendPhoto", { chat_id: id, photo: BANNER, caption: WELCOME(m.from.first_name), reply_markup: appButton() });
    if (!r.ok) await tg(env, "sendMessage", { chat_id: id, text: WELCOME(m.from.first_name), reply_markup: appButton() });
    return;
  }
  if (text.startsWith("/eslatma")) {
    u.remind = !u.remind; await putJ(env, "u:" + id, u);
    return tg(env, "sendMessage", { chat_id: id, text: u.remind ? "🔔 Kunlik eslatma yoqildi. Har kuni kechqurun soat 19:00 da eslataman." : "🔕 Kunlik eslatma o‘chirildi." });
  }
  if (text.startsWith("/yangiliklar")) {
    u.news = !u.news; await putJ(env, "u:" + id, u);
    return tg(env, "sendMessage", { chat_id: id, text: u.news ? "📺 Yangi multfilm chiqqanda xabar beraman." : "🔕 Yangi multfilm xabarlari o‘chirildi." });
  }
  return tg(env, "sendMessage", { chat_id: id, text: "O‘yinlarni ochish uchun pastdagi tugmani bosing 👇\n\n" + HELP, reply_markup: appButton() });
}

/* ---------- o'yin API ---------- */
async function api(req, env, path) {
  const user = await webAppUser(req, env);
  if (!user) return json({ ok: false, error: "auth" }, 401);
  const id = user.id;
  const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};

  if (path === "/api/me" || path === "/api/register" || path === "/api/event") {
    const { u } = await saveUser(env, user);
    const f = await getJ(env, "f:" + id, []);
    return json({ ok: true, user: { id, stars: 0, friends: f.length, invited_by: null, name: u.name } });
  }
  if (path === "/api/odobim/score") {
    const kids = (body.kids || []).slice(0, 8).map(k => ({
      id: String(k.id || "").slice(0, 40), name: String(k.name || "").slice(0, 24), av: String(k.av || "🙂").slice(0, 8),
      grp: k.grp, tr: Math.max(0, Math.min(100000, Number(k.tr) || 0))
    }));
    const old = await env.DB.get("s:" + id);
    const neu = JSON.stringify(kids);
    if (old !== neu) await env.DB.put("s:" + id, neu);
    return json({ ok: true });
  }
  if (path === "/api/odobim/friends") {
    const friends = await getJ(env, "f:" + id, []);
    const rows = [];
    const mine = await getJ(env, "s:" + id, []);
    mine.forEach(k => rows.push({ name: k.name, av: k.av, tr: k.tr, me: true, kid: k.id }));
    for (const fid of friends.slice(0, 40)) {
      const [ks, fu] = await Promise.all([getJ(env, "s:" + fid, []), getJ(env, "u:" + fid, null)]);
      const parent = fu ? (fu.name || "").split(" ")[0] : "";
      ks.forEach(k => rows.push({ name: k.name, av: k.av, tr: k.tr, parent }));
    }
    rows.sort((a, b) => b.tr - a.tr);
    return json({ ok: true, rows: rows.slice(0, 50), friends: friends.length });
  }
  return json({ ok: true });
}

/* ---------- ommaviy xabarlar (navbat bilan) ---------- */
async function startJob(env, job) {
  const cur = await getJ(env, "job", null);
  if (cur && cur.i < cur.total) { const q = await getJ(env, "jobq", []); q.push(job); await putJ(env, "jobq", q); return; }
  const users = await getJ(env, "users", []);
  await putJ(env, "job", Object.assign(job, { i: 0, total: users.length, sent: 0 }));
}

async function runJob(env) {
  let job = await getJ(env, "job", null);
  if (!job || job.i >= job.total) {
    const q = await getJ(env, "jobq", []);
    if (!q.length) return;
    const next = q.shift(); await putJ(env, "jobq", q);
    const users = await getJ(env, "users", []);
    job = Object.assign(next, { i: 0, total: users.length, sent: 0 });
  }
  const users = await getJ(env, "users", []);
  const part = users.slice(job.i, job.i + BATCH);
  for (const uid of part) {
    const u = await getJ(env, "u:" + uid, null);
    if (!u || u.active === false) continue;
    if (job.kind === "remind" && !u.remind) continue;
    if (job.kind === "news" && !u.news) continue;
    const r = job.photo
      ? await tg(env, "sendPhoto", { chat_id: uid, photo: job.photo, caption: job.text, reply_markup: job.markup })
      : await tg(env, "sendMessage", { chat_id: uid, text: job.text, reply_markup: job.markup });
    if (r.ok) job.sent++;
    else if (r.error_code === 403) { u.active = false; await putJ(env, "u:" + uid, u); }
  }
  job.i += part.length;
  await putJ(env, "job", job);
}

const REMINDERS = [
  "🌙 Bugun qanday yaxshi ishlar qilding? Kundalikka yulduz qo‘y! ⭐",
  "⭐ Bugun salom berdingmi? Onangga yordam berdingmi? Kundalikni to‘ldir!",
  "📒 Yaxshi ishlar kundaligi seni kutyapti! Bugun nechta yulduz yig‘asan?",
  "💛 Bugun kimgadir yaxshilik qildingmi? Kundalikka belgila va yulduz ol!"
];
const tashkentDate = () => new Date(Date.now() + 5 * 3600e3).toISOString().slice(0, 10);

async function scheduled(event, env) {
  if (event.cron === "0 14 * * *") { // 19:00 Toshkent
    const text = REMINDERS[new Date().getUTCDate() % REMINDERS.length];
    await startJob(env, { kind: "remind", text, markup: appButton("📒 Kundalikni ochish", "#diary") });
  } else if (event.cron === "10 13 * * *") { // 18:10 Toshkent
    const eps = await fetch(EPISODES_URL + "?t=" + Date.now()).then(r => r.json()).catch(() => []);
    const today = tashkentDate();
    const ep = eps.find(e => e.d === today);
    const done = await env.DB.get("news:" + today);
    if (ep && !done) {
      await env.DB.put("news:" + today, "1", { expirationTtl: 3 * 86400 });
      const url = ep.y ? "https://www.youtube.com/shorts/" + ep.y : "https://www.youtube.com/@odobim/shorts";
      await startJob(env, {
        kind: "news", photo: ep.img,
        text: `📺 Yangi multfilm chiqdi!\n\n${ep.n}-qism: ${ep.t}\n\nHalili va opalari bilan birga tomosha qiling! 🌟`,
        markup: { inline_keyboard: [[{ text: "▶️ Tomosha qilish", url }], [{ text: "🎮 O‘yinlar", web_app: { url: APP_URL } }]] }
      });
    }
  }
  await runJob(env);
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    if (url.pathname === "/webhook" && req.method === "POST") {
      const want = (await sha256hex(env.BOT_TOKEN)).slice(0, 32);
      if (req.headers.get("X-Telegram-Bot-Api-Secret-Token") !== want) return new Response("forbidden", { status: 403 });
      const upd = await req.json().catch(() => ({}));
      if (upd.message) await onMessage(env, upd.message);
      return new Response("ok");
    }
    if (url.pathname.startsWith("/api/")) return api(req, env, url.pathname);
    if (url.pathname === "/") return new Response("Odobim bot ishlayapti ✅", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    return new Response("not found", { status: 404 });
  },
  scheduled(event, env, ctx) { ctx.waitUntil(scheduled(event, env)); }
};
