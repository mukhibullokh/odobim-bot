/* Odobim bot serveri — Cloudflare Worker.
   Vazifalar: /start javobi, do'stlar reytingi (o'yin uchun API), kunlik eslatma, yangi multfilm xabari.
   Kalitlar: BOT_TOKEN (Cloudflare secret). Ma'lumotlar: KV (binding DB). */

const APP_URL = "https://mukhibullokh.github.io/odobim-bot/";
const EPISODES_URL = APP_URL + "episodes.json";
const APP_VER = "?v=12";
const BANNER = "https://d8j0ntlcm91z4.cloudfront.net/user_3BU2MlPv3we8DCTjdMWqvmqHc6f/hf_20261124_105810_103267b5-c68a-4097-b182-6e4db592fc25.png";
const BATCH = 40;
const ADMIN_ID = 5991137115;            // buyurtmalar va cheklar shu Telegram akkauntga keladi
const PHOTO_CONSENT = "Men ushbu bolaning ota-onasi (vasiysi)man. Rasmini Odobimga faqat multfilm yoki ertak qahramonini yasash uchun berishga roziman. Rasm boshqa joyda ishlatilmaydi, hech kimga berilmaydi va ish tugagach o‘chiriladi.";
const YT_CONSENT = "Roziman: multfilm Odobim YouTube va Instagram sahifalarida farzandimning faqat ismi bilan chiqsin. Istalgan payt so‘rasam, olib tashlanadi.";
const CARD = "8600 1404 0140 4463";      // Sisters Cooking'dagi to'lov kartasi
const CARD_OWNER = "Farhodov Muhibulloh";
const TARIFFS = {
  ertak: { name: "📖 Ovozli ertak-komiks", price: 59000, desc: "5 betlik ertak: video (Dilzoda ovozida) va PDF", what: "ertak", eta: "bir necha soat" },
  oila: { name: "🎁 Oilaviy", price: 149000, desc: "Multfilm faqat sizning oilangizga beriladi", what: "multfilm", eta: "1–2 kun" },
  dost: { name: "⭐ Odobim do‘sti", price: 299000, desc: "Multfilm sizga beriladi va Odobim YouTube hamda Instagram sahifalariga qo‘yiladi", what: "multfilm", eta: "1–2 kun" }
};
const WHAT = o => (TARIFFS[o.tariff] || TARIFFS.oila).what;
const ETA = o => (TARIFFS[o.tariff] || TARIFFS.oila).eta;
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const esc = s => String(s == null ? "" : s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); // bir daqiqada yuboriladigan xabarlar soni (bepul tarif cheklovi ichida)

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
async function tgPhoto(env, chat_id, dataUrl, caption, markup) {
  const m = /^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(dataUrl || "");
  if (!m || m[2].length > 2800000) return { ok: false };
  const bin = Uint8Array.from(atob(m[2]), c => c.charCodeAt(0));
  const fd = new FormData();
  fd.append("chat_id", String(chat_id));
  fd.append("caption", caption);
  if (markup) fd.append("reply_markup", JSON.stringify(markup));
  fd.append("photo", new Blob([bin], { type: "image/" + m[1] }), "bola." + (m[1] === "jpeg" ? "jpg" : m[1]));
  const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendPhoto`, { method: "POST", body: fd });
  return r.json().catch(() => ({ ok: false }));
}
async function tg(env, method, body) {
  const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  return r.json().catch(() => ({ ok: false }));
}
const appButton = (text = "🎮 O‘yinlarni ochish", hash = "") => ({ inline_keyboard: [[{ text, web_app: { url: APP_URL + APP_VER + hash } }]] });

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
📺 /yangiliklar — yangi multfilm xabarini yoqish yoki o‘chirish
🎬 /buyurtma — farzandingiz uchun maxsus multfilm yoki ertak`;

async function onMessage(env, m) {
  if (!m.from || m.from.is_bot || !m.chat || m.chat.type !== "private") return;
  const text = (m.text || m.caption || "").trim();
  const { u } = await saveUser(env, m.from);
  const id = m.from.id;
  const hasMedia = m.photo || m.document || m.video;

  // Admin: tayyor multfilmni "#123" izohi bilan yuborsa — buyurtmachiga yetkaziladi
  if (id === ADMIN_ID && hasMedia) {
    const mm = text.match(/#(\d+)/);
    if (mm) {
      const o = await getJ(env, "o:" + mm[1], null);
      if (!o) return tg(env, "sendMessage", { chat_id: id, text: "❗ #" + mm[1] + " buyurtma topilmadi." });
      if (o.status !== "delivered") await tg(env, "sendMessage", { chat_id: o.uid, text: `🎉 ${o.child} uchun ${WHAT(o)} tayyor! Marhamat, ${WHAT(o) === "ertak" ? "o‘qing va tinglang 📖" : "tomosha qiling 🎬"}` });
      const r = await tg(env, "copyMessage", { chat_id: o.uid, from_chat_id: id, message_id: m.message_id, caption: `${WHAT(o) === "ertak" ? "📖" : "🎬"} ${o.child} va Odobim — maxsus ${WHAT(o)} 💛\nDo‘stlaringga ham yubor 👇 @odobimbot` });
      if (r.ok) { o.status = "delivered"; await putJ(env, "o:" + o.id, o); }
      return tg(env, "sendMessage", { chat_id: id, text: r.ok ? `✅ #${o.id} ${WHAT(o)} ${o.parent}ga yuborildi.` : "❗ Yuborib bo‘lmadi: " + (r.description || "") });
    }
  }
  // Buyurtmachi chek yoki bola rasmini yuborsa — adminga yetkaziladi
  if (hasMedia && id !== ADMIN_ID) {
    const last = await env.DB.get("lastOrder:" + id);
    const o = last ? await getJ(env, "o:" + last, null) : null;
    if (o) {
      await tg(env, "copyMessage", { chat_id: ADMIN_ID, from_chat_id: id, message_id: m.message_id,
        caption: `📎 #${o.id} — ${o.parent} (${o.child})\n${o.status === "paid" ? "To‘lov tasdiqlangan. Bu bolaning rasmi bo‘lishi mumkin." : "Chek yoki bolaning rasmi"}`,
        reply_markup: o.status === "paid" ? undefined : { inline_keyboard: [[{ text: "✅ To‘lov tasdiqlandi", callback_data: "pay:" + o.id }, { text: "❌ Rad etish", callback_data: "rej:" + o.id }]] } });
      return tg(env, "sendMessage", { chat_id: id, text: "✅ Qabul qilindi! Tekshirib, tez orada xabar beramiz." });
    }
  }

  if (text.startsWith("/start")) {
    const arg = text.split(" ")[1] || "";
    const mm = arg.match(/^(?:of|ref)_(\d+)$/);
    if (mm) await addFriend(env, id, Number(mm[1]));
    const r = await tg(env, "sendPhoto", { chat_id: id, photo: BANNER, caption: WELCOME(m.from.first_name), reply_markup: { inline_keyboard: [appButton().inline_keyboard[0], appButton("🎬 Farzandim uchun multfilm", "#order").inline_keyboard[0], appButton("📖 Odobim ertagi — 59 000", "#ertak").inline_keyboard[0]] } });
    if (!r.ok) await tg(env, "sendMessage", { chat_id: id, text: WELCOME(m.from.first_name), reply_markup: appButton() });
    return;
  }
  if (text.startsWith("/buyurtma")) {
    return tg(env, "sendMessage", { chat_id: id, text: "🎬 Farzandingiz Halili va opalari bilan multfilm qahramoni bo‘ladi!\n\nPastdagi tugmani bosing: tarifni tanlang, farzandingiz haqida yozing va rasmini qo‘shing 📷", reply_markup: appButton("🎬 Buyurtma berish", "#order") });
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

async function onCallback(env, q) {
  const [act, oid] = String(q.data || "").split(":");
  if (q.from.id !== ADMIN_ID) return tg(env, "answerCallbackQuery", { callback_query_id: q.id });
  const o = await getJ(env, "o:" + oid, null);
  if (!o) return tg(env, "answerCallbackQuery", { callback_query_id: q.id, text: "Buyurtma topilmadi" });
  if (act === "pay") {
    o.status = "paid"; o.paidAt = Date.now(); await putJ(env, "o:" + o.id, o);
    await tg(env, "sendMessage", { chat_id: o.uid, text: `🎉 To‘lov tasdiqlandi! ${o.child} uchun ${WHAT(o)} tayyorlanmoqda. ${ETA(o)} ichida shu chatga yuboramiz 💛\n\nFarzandingizning rasmini hali yubormagan bo‘lsangiz, hozir yuborishingiz mumkin.` });
  } else if (act === "rej") {
    o.status = "rejected"; await putJ(env, "o:" + o.id, o);
    await tg(env, "sendMessage", { chat_id: o.uid, text: `❌ Chek tasdiqlanmadi. Iltimos, to‘lovni tekshirib, chekni qayta yuboring yoki savolingizni shu yerga yozing.` });
  }
  await tg(env, "answerCallbackQuery", { callback_query_id: q.id, text: act === "pay" ? "Tasdiqlandi ✅" : "Rad etildi" });
  if (q.message) await tg(env, "editMessageReplyMarkup", { chat_id: q.message.chat.id, message_id: q.message.message_id, reply_markup: { inline_keyboard: [[{ text: act === "pay" ? "✅ #" + o.id + " to‘langan" : "❌ #" + o.id + " rad etilgan", callback_data: "x" }]] } });
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
  if (path === "/api/paint" && req.method === "POST") {
    const name = String(body.name || "").replace(/[<>]/g, "").slice(0, 60);
    const r = await tgPhoto(env, id, body.photo, `🎨 Men bo‘yadim! «${name}»\n\nOdobim’da sen ham bo‘ya 👉 @odobimbot`,
      { inline_keyboard: [[{ text: "📤 Oilamga yuborish", url: "https://t.me/share/url?url=" + encodeURIComponent("https://t.me/odobimbot") + "&text=" + encodeURIComponent("🎨 Odobim’da rasm bo‘yadim! Sen ham bo‘ya:") }], [{ text: "🎨 Yana bo‘yash", web_app: { url: APP_URL + APP_VER + "#boyash" } }]] });
    return json({ ok: !!r.ok });
  }
  if (path === "/api/order/receipt" && req.method === "POST") {
    const o = await getJ(env, "o:" + Number(body.id), null);
    if (!o || o.uid !== id) return json({ ok: false, error: "order" }, 404);
    if (o.status === "paid") return json({ ok: true, status: "paid" });
    const r = await tgPhoto(env, ADMIN_ID, body.photo, `🧾 Chek · buyurtma #${o.id} · ${o.child} · ${fmt(o.price)} so‘m\nOta-ona: ${o.parent}${o.username ? " @" + o.username : ""}`,
      { inline_keyboard: [[{ text: "✅ To‘lov tasdiqlandi", callback_data: "pay:" + o.id }, { text: "❌ Rad etish", callback_data: "rej:" + o.id }]] });
    if (!r.ok) return json({ ok: false, error: "photo" }, 400);
    o.status = "check"; o.receiptAt = Date.now(); await putJ(env, "o:" + o.id, o);
    return json({ ok: true, status: "check" });
  }
  if (path === "/api/order/status") {
    const o = await getJ(env, "o:" + Number(body.id), null);
    if (!o || o.uid !== id) return json({ ok: false }, 404);
    return json({ ok: true, status: o.status });
  }
  if (path === "/api/order" && req.method === "POST") {
    const t = TARIFFS[body.tariff] ? body.tariff : "oila";
    const clean = (v, n) => String(v || "").replace(/[<>]/g, "").trim().slice(0, n);
    const o = {
      id: 0, uid: id, at: Date.now(), status: "new", tariff: t, price: TARIFFS[t].price,
      child: clean(body.child, 30), age: clean(body.age, 10), gender: body.gender === "qiz" ? "qiz" : "o‘g‘il",
      look: clean(body.look, 200), topic: clean(body.topic, 120), note: clean(body.note, 300),
      consent: t === "dost" ? !!body.consent : false,
      parent: [user.first_name, user.last_name].filter(Boolean).join(" ").slice(0, 40), username: user.username || ""
    };
    if (!o.child) return json({ ok: false, error: "name" }, 400);
    const photos = (Array.isArray(body.photos) ? body.photos : []).slice(0, 3);
    if (photos.length && !body.photoConsent) return json({ ok: false, error: "photoConsent" }, 400);
    o.photos = photos.length;
    const stamp = new Date(Date.now() + 5 * 3600e3).toISOString().slice(0, 16).replace("T", " ") + " (Toshkent)";
    if (photos.length) o.photoConsent = { at: stamp, text: PHOTO_CONSENT };
    if (o.consent) o.ytConsent = { at: stamp, text: YT_CONSENT };
    if (t === "dost" && !o.consent) return json({ ok: false, error: "consent" }, 400);
    const seq = Number(await env.DB.get("orderSeq") || 100) + 1;
    o.id = seq;
    await env.DB.put("orderSeq", String(seq));
    await putJ(env, "o:" + seq, o);
    await env.DB.put("lastOrder:" + id, String(seq));
    await saveUser(env, user);
    await tg(env, "sendMessage", { chat_id: id, parse_mode: "HTML", text:
`🎬 <b>Buyurtma #${seq} qabul qilindi!</b>

👶 ${esc(o.child)} (${esc(o.age)} yosh, ${o.gender})
📚 Mavzu: ${esc(o.topic)}
${TARIFFS[t].name} — <b>${fmt(o.price)} so‘m</b>

💳 <b>To‘lov:</b> quyidagi kartaga <b>${fmt(o.price)} so‘m</b> o‘tkazing:
<code>${CARD}</code>
${CARD_OWNER}

📸 Keyin to‘lov chekini (skrinshot) ilovaning o‘zida yoki shu chatga yuboring.
${o.photos ? "🧒 Farzandingiz rasmi qabul qilindi — qahramon unga o‘xshab chiqadi. Rasm faqat qahramon yasash uchun ishlatiladi va ish tugagach o‘chiriladi." : "🧒 Xohlasangiz, farzandingizning rasmini ham yuboring — qahramon unga o‘xshab chiqadi. Rasm faqat qahramon yasash uchun ishlatiladi va ish tugagach o‘chiriladi."}

⏳ To‘lov tasdiqlangach, ${WHAT(o)} ${ETA(o)} ichida tayyor bo‘ladi.` });
    await tg(env, "sendMessage", { chat_id: ADMIN_ID, parse_mode: "HTML", text:
`🆕 <b>Yangi buyurtma #${seq}</b>
${TARIFFS[t].name} — ${fmt(o.price)} so‘m${o.consent ? "\n✅ YouTube va Instagram’ga qo‘yishga rozi" : ""}

👶 Bola: <b>${esc(o.child)}</b>, ${esc(o.age)} yosh, ${o.gender}
👕 Ko‘rinishi: ${esc(o.look) || "—"}
📚 Mavzu: ${esc(o.topic)}
📝 Izoh: ${esc(o.note) || "—"}
👤 Ota-ona: ${esc(o.parent)}${o.username ? " @" + esc(o.username) : ""} (id ${id})
🖼 Rasm: ${o.photos ? o.photos + " ta (pastda)" : "yo‘q"}

Chek kelsa, shu yerga yuboraman. Tayyor ${WHAT(o)}ni yuborish: video yoki PDF faylni <code>#${seq}</code> izohi bilan shu botga yuboring.` });
    for (let i = 0; i < photos.length; i++) await tgPhoto(env, ADMIN_ID, photos[i], `#${seq} · ${o.child} · rasm ${i + 1}`);
    if (o.photoConsent || o.ytConsent) {
      const who = `${esc(o.parent)}${o.username ? " (@" + esc(o.username) + ")" : ""}, Telegram ID ${id}`;
      const doc = (title, c) => `📄 <b>${title}</b>\nBuyurtma #${seq} · Bola: ${esc(o.child)}\nKim: ${who}\nVaqt: ${c.at}\n\n«${c.text}»\n\n✅ Ota-ona ilovada belgini bosib tasdiqladi.`;
      const parts = [];
      if (o.photoConsent) parts.push(doc("Rasmdan foydalanishga rozilik", o.photoConsent));
      if (o.ytConsent) parts.push(doc("YouTube va Instagram’ga qo‘yishga rozilik", o.ytConsent));
      const r = await tg(env, "sendMessage", { chat_id: ADMIN_ID, parse_mode: "HTML", text: parts.join("\n\n———\n\n") });
      if (r && r.result) await tg(env, "pinChatMessage", { chat_id: ADMIN_ID, message_id: r.result.message_id, disable_notification: true });
      await tg(env, "sendMessage", { chat_id: id, parse_mode: "HTML", text: "📄 <b>Roziligingiz qayd etildi</b> — " + (o.photoConsent || o.ytConsent).at + ".\nIstalgan payt rasmni yoki videoni o‘chirishni so‘rashingiz mumkin — shu chatga yozing." });
    }
    return json({ ok: true, id: seq });
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
        markup: { inline_keyboard: [[{ text: "▶️ Tomosha qilish", url }], [{ text: "🎮 O‘yinlar", web_app: { url: APP_URL + APP_VER } }]] }
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
      else if (upd.callback_query) await onCallback(env, upd.callback_query);
      return new Response("ok");
    }
    if (url.pathname.startsWith("/api/")) return api(req, env, url.pathname);
    if (url.pathname === "/") return new Response("Odobim bot ishlayapti ✅", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    return new Response("not found", { status: 404 });
  },
  scheduled(event, env, ctx) { ctx.waitUntil(scheduled(event, env)); }
};
