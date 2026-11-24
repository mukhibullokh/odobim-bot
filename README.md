# Odobim — Telegram mini ilova (@odobimbot)

Bolalar uchun odob o'yinlari: Odob yo'li (yugurish o'yini), Juftini top, Odob viktorinasi,
Yaxshi ishlar kundaligi, Multfilmlar va duolar.

- `index.html` — bosh sahifa va 4 bo'lim (bitta fayl).
- `oyin/` — «Odob yo'li» yugurish o'yini.

Sayt: https://mukhibullokh.github.io/odobim-bot/

## Bot serveri (`server/`)
Cloudflare Workers'da ishlaydi (bepul). GitHub'ga har yuklashda avtomatik yangilanadi
(`.github/workflows/deploy-bot.yml`). Kerakli GitHub Secrets:
`BOT_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

Yangi multfilm qo'shish: `episodes.json` ga qator qo'shing (sana — `d`, YouTube ID — `y`).
Chiqqan kuni soat 18:10 da bot obunachilarga xabar yuboradi.
