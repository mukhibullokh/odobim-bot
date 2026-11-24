/* Odobim — qo'shimcha darslar va yangi o'yin turlari.
   Savol turlari:
     mc     — variantli:            {t:"mc", q, o:[...], a, e}
     tf     — to'g'ri/noto'g'ri:     {t:"tf", q, a:true|false, e}
     order  — tartibga solish:       {t:"order", q, items:[to'g'ri tartibda], e}
     match  — juftini topish:        {t:"match", q, pairs:[[chap, o'ng], ...], e}
     pic    — rasmli (emoji) javob:  {t:"pic", q, o:["🕌","🏫",...], ol:["izoh",...], a, e}
     word   — so'zlardan tuzish:     {t:"word", q, ans:"to'g'ri gap", extra:["chalg'ituvchi"], e}
     listen — eshitib tanlash:       {t:"listen", say:"o'qiladigan matn", q, o:[...], a, e}
   Har qanday savolga  audio:"https://.../fayl.mp3"  qo'shsangiz, ovoz tugmasi o'sha yozuvni qo'yadi
   (aks holda telefonning o'z ovozi bilan o'qiladi, agar telefon qo'llasa). */

/* --- mavjud darslarga yangi turdagi savollar --- */
ODOBIM.kids.units[0].lessons[0].qs.push(
 {t:"pic", q:"Qaysi rasm salomlashishni ko'rsatadi?", o:["🤝","😴","🏃","📱"], ol:["Qo'l berib ko'rishish","Uxlash","Yugurish","Telefon"], a:0, e:"Musulmonlar salomlashib, qo'l berib ko'rishadi."},
 {t:"listen", say:"Assalomu alaykum", q:"Eshiting: bu salomga qanday javob beriladi?", o:["Va alaykum assalom","Xayr","Rahmat"], a:0, e:"Salomga «Va alaykum assalom» deb javob qaytaramiz."}
);
ODOBIM.kids.units[1].lessons[0].qs.push(
 {t:"match", q:"Juftini toping", pairs:[["Ovqatdan oldin","Bismillah"],["Ovqatdan keyin","Alhamdulillah"],["Qo'l bilan","O'ng qo'l"],["Taom qolsa","Isrof qilmaymiz"]], e:"Ovqatlanish odoblarini yaxshi bilibsiz!"}
);
ODOBIM.teens.units[2].lessons[0].qs.push(
 {t:"match", q:"So'zni ma'nosi bilan juftlang", pairs:[["G'iybat","Birovni orqasidan yomonlash"],["Tuhmat","Qilmagan ishni to'nkash"],["Namima","Gap tashish, ig'vo"],["Sidq","Rostgo'ylik"]], e:"Til odobining asosiy tushunchalari."}
);

/* --- 7–11 yosh: yangi bo'limlar --- */
ODOBIM.kids.units.push(
 {title:"Payg'ambarlar qissalari", desc:"Nuh, Ibrohim, Yunus va Muso (a.s.)", lessons:[
  {title:"Nuh va Ibrohim (a.s.)", qs:[
   {t:"pic", q:"Nuh (a.s.) Alloh amri bilan nima yasaganlar?", o:["🚢","🏠","🕌","🌉"], ol:["Kema","Uy","Masjid","Ko'prik"], a:0, e:"To'fondan oldin Nuh (a.s.) mo'minlar uchun kema yasaganlar (Hud, 37)."},
   {t:"tf", q:"Ibrohim (a.s.) olovga tashlanganlarida olov u zotni kuydirmagan.", a:true, e:"Alloh: «Ey olov, Ibrohimga salqin va salomatlik bo'l», degan (Anbiyo, 69)."},
   {t:"pic", q:"Ibrohim (a.s.) va o'g'illari Ismoil (a.s.) qaysi uyni qurganlar?", o:["🕋","🏰","⛺","🏠"], ol:["Ka'ba","Qasr","Chodir","Uy"], a:0, e:"Ular Ka'baning poydevorini ko'targanlar (Baqara, 127)."},
   {t:"mc", q:"Ismoil (a.s.) qaysi payg'ambarning o'g'li?", o:["Ibrohim (a.s.)","Nuh (a.s.)","Muso (a.s.)","Iso (a.s.)"], a:0, e:"Ismoil (a.s.) — Ibrohim (a.s.)ning o'g'li."},
   {t:"match", q:"Payg'ambarni qissasi bilan juftlang", pairs:[["Nuh (a.s.)","Kema"],["Ibrohim (a.s.)","Ka'ba"],["Yunus (a.s.)","Baliq"],["Muso (a.s.)","Hassa"]], e:"Har bir payg'ambarning qissasida biz uchun ibrat bor."}]},
  {title:"Yunus va Muso (a.s.)", qs:[
   {t:"mc", q:"Yunus (a.s.)ni nima yutib yuborgan?", o:["Katta baliq","Sher","Burgut","Ilon"], a:0, e:"Baliq qornida Allohga duo qilib, najot topganlar (Anbiyo, 87–88)."},
   {t:"word", q:"Yunus (a.s.)ning duosini tuzing", ans:"La ilaha illa anta subhanaka", extra:["Bismillah"], e:"To'liq duo: «La ilaha illa anta subhanaka inni kuntu minaz-zolimiyn» (Anbiyo, 87)."},
   {t:"mc", q:"Muso (a.s.)ga qaysi kitob nozil bo'lgan?", o:["Tavrot","Zabur","Injil","Qur'on"], a:0, e:"Tavrot — Muso (a.s.)ga nozil bo'lgan kitob."},
   {t:"tf", q:"Muso (a.s.) hassalarini dengizga urganlarida dengiz ikkiga bo'lingan.", a:true, e:"Bu Alloh bergan mo'jiza edi (Shuaro, 63)."},
   {t:"listen", say:"Alayhis-salom", q:"Payg'ambar nomi aytilganda shunday deymiz. Eshitganingizni tanlang", o:["Alayhis-salom","Xayrli tong","Rahmat"], a:0, e:"«Alayhis-salom» — «Unga salom bo'lsin» degani."}]}
 ]},
 {title:"Kundalik duolar", desc:"Uyqu, uy, salovat va zikr", lessons:[
  {title:"Uy va uyqu duolari", qs:[
   {t:"match", q:"Qachon nima deymiz? Juftini toping", pairs:[["Ovqatdan oldin","Bismillah"],["Chiroyli narsa ko'rganda","Mashaalloh"],["Ertaga qilmoqchi bo'lsak","Insha'Alloh"],["Xato qilganda","Astag'firulloh"]], e:"Har bir holatning o'z go'zal so'zi bor."},
   {t:"mc", q:"Uxlashdan oldin qaysi duo o'qiladi?", o:["Bismikallohumma amutu va ahya","Robbana atina","Subhana Robbiyal a'la","Allohu akbar"], a:0, e:"«Allohim, Sening isming bilan o'laman va tirilaman» (Buxoriy)."},
   {t:"mc", q:"Uyqudan uyg'onganda nima deymiz?", o:["Alhamdulillahillaziy ahyana","Assalomu alaykum","Mashaalloh","Insha'Alloh"], a:0, e:"«Bizni tiriltirgan Allohga hamd bo'lsin» (Buxoriy)."},
   {t:"tf", q:"Uydan chiqayotganda «Bismillah» deyish sunnat.", a:true, e:"«Bismillahi tavakkaltu 'alalloh» deb chiqiladi (Abu Dovud, Termiziy)."},
   {t:"listen", say:"Bismillah", q:"Eshitgan so'zingizni tanlang", o:["Bismillah","Alhamdulillah","Insha'Alloh","Mashaalloh"], a:0, e:"«Bismillah» — «Allohning nomi bilan»."}]},
  {title:"Salovat va zikr", qs:[
   {t:"mc", q:"Payg'ambarimizning ismlari aytilganda nima deymiz?", o:["Sollallohu alayhi va sallam","Rahmat","Omin","Xayr"], a:0, e:"Salovat aytish — Payg'ambarimizga muhabbat belgisi."},
   {t:"word", q:"Namozdan keyingi tasbehni tartib bilan tuzing", ans:"SubhanAlloh Alhamdulillah Allohu akbar", extra:["Bismillah"], e:"Har biri 33 martadan aytiladi (Muslim)."},
   {t:"pic", q:"Zikr sanash uchun nima ishlatiladi?", o:["📿","⚽","🎮","📺"], ol:["Tasbeh","To'p","O'yin","Televizor"], a:0, e:"Tasbeh bilan yoki barmoqlar bilan sanasa ham bo'ladi."},
   {t:"tf", q:"Zikrni faqat masjidda qilish mumkin.", a:false, e:"Allohni har joyda — uyda, yo'lda, maktabda eslash mumkin."},
   {t:"mc", q:"«Astag'firulloh» nima degani?", o:["Allohdan kechirim so'rayman","Alloh buyukdir","Allohga hamd","Alloh xohlasa"], a:0, e:"Xato qilsak, Allohdan kechirim so'raymiz."}]}
 ]}
);

/* --- 12–15 yosh: yangi bo'limlar --- */
ODOBIM.teens.units.push(
 {title:"Qur'on va duolar", desc:"Fotiha surasi va kundalik duolar", lessons:[
  {title:"Fotiha surasi", qs:[
   {t:"mc", q:"Fotiha surasida nechta oyat bor?", o:["7","5","10","3"], a:0, e:"Fotiha — yetti oyatli sura, har rakatda o'qiladi."},
   {t:"match", q:"Arabcha ifodani ma'nosi bilan juftlang", pairs:[["Ar-Rohman","Mehribon"],["Robbil 'alamin","Olamlar Robbi"],["Yavmid-din","Jazo kuni"],["Sirotol mustaqim","To'g'ri yo'l"]], e:"Fotiha ma'nosini bilib o'qish namozni yanada go'zal qiladi."},
   {t:"word", q:"Fotihaning oyatini tuzing: «Faqat Senga ibodat qilamiz va faqat Sendan yordam so'raymiz»", ans:"Iyyaka na'budu va iyyaka nasta'in", extra:["Robbana"], e:"Bu Fotiha surasining 5-oyati."},
   {t:"tf", q:"Fotiha surasi «Ummul Kitob» — «Kitobning onasi» deb ham ataladi.", a:true, e:"Fotiha Qur'onning asosiy ma'nolarini o'zida jamlagan."},
   {t:"listen", say:"Alhamdulillahi Robbil 'alamin", q:"Eshitgan oyatingizning ma'nosini tanlang", o:["Hamd olamlar Robbi Allohgadir","Alloh buyukdir","Allohdan o'zga iloh yo'q"], a:0, e:"Bu Fotihaning birinchi oyati."}]},
  {title:"Kundalik duolar", qs:[
   {t:"mc", q:"«Robbi zidniy 'ilma» duosining ma'nosi?", o:["Robbim, ilmimni ziyoda qil","Robbim, meni kechir","Robbim, rizqimni ber","Robbim, menga sabr ber"], a:0, e:"Bu duo Toha surasining 114-oyatida keltirilgan."},
   {t:"mc", q:"«Robbirhamhuma kama robbayaniy sog'iyro» duosi kim haqida?", o:["Ota-ona","Do'stlar","Ustozlar","Qo'shnilar"], a:0, e:"«Robbim, ular meni kichikligimda tarbiyalaganidek, ularga rahm qil» (Isro, 24)."},
   {t:"word", q:"Qur'ondagi duoni tuzing: «Robbimiz, bizga dunyoda yaxshilik ber»", ans:"Robbana atina fid-dunya hasanah", extra:["Omin"], e:"Davomi: «va fil-axiroti hasanah va qina 'azaban-nar» (Baqara, 201)."},
   {t:"tf", q:"Duoni faqat arab tilida qilish mumkin.", a:false, e:"Duoni o'z tilingizda ham qila olasiz. Namoz ichidagi qiroat va zikrlar esa arabcha bo'ladi."},
   {t:"pic", q:"Duo qilganda qo'llar qanday tutiladi?", o:["🤲","👏","✌️","👍"], ol:["Ochiq kaftlar","Qarsak","Ikki barmoq","Bosh barmoq"], a:0, e:"Kaftlarni ochib, osmonga qaratib duo qilinadi."}]}
 ]},
 {title:"Oila va jamiyat", desc:"Oila odobi, ilm va do'stlik", lessons:[
  {title:"Oila odobi", qs:[
   {t:"mc", q:"Hadisi sharifda jannat kimning oyog'i ostida ekani aytilgan?", o:["Onalarning","Podshohlarning","Boylarning","Olimlarning"], a:0, e:"«Jannat onalarning oyog'i ostidadir» (Nasoiy)."},
   {t:"mc", q:"Kattalar xonasiga kirishdan oldin nima qilinadi?", o:["Ruxsat so'raladi","Eshik taqillatmay kiriladi","Baqirib chaqiriladi","Telefon qilinadi"], a:0, e:"Ruxsat so'rash odobi Nur surasida (58–59) o'rgatilgan."},
   {t:"match", q:"Vaziyatga to'g'ri ishni toping", pairs:[["Onam charchagan","Uy ishida yordam beraman"],["Ukam xafa","Yupatib, o'ynab beraman"],["Mehmon keldi","Hurmat bilan kutib olaman"],["Bobom gapiryapti","Diqqat bilan tinglayman"]], e:"Oiladagi har bir kishiga mehr — go'zal axloq."},
   {t:"tf", q:"Qarindoshlar bilan aloqani uzmaslik (silai rahm) buyurilgan.", a:true, e:"Silai rahm umr va rizqqa baraka ekani hadisda kelgan (Buxoriy)."},
   {t:"listen", say:"Silai rahm", q:"Eshitgan so'zingiz nimani anglatadi?", o:["Qarindoshlar bilan aloqani saqlash","Ro'za tutish","Sadaqa berish"], a:0, e:"Silai rahm — qarindoshlarni ziyorat qilish, holidan xabar olish."}]},
  {title:"Ilm va do'stlik", qs:[
   {t:"mc", q:"Hadisda yaxshi do'st kimga o'xshatilgan?", o:["Atir sotuvchiga","Temirchiga","Savdogarga","Dehqonga"], a:0, e:"Yaxshi do'st atir sotuvchiga, yomon do'st temirchi bosqoniga o'xshaydi (Buxoriy, Muslim)."},
   {t:"word", q:"Hadisni tuzing", ans:"Ilm talab qilish har bir musulmonga farzdir", extra:["sunnatdir"], e:"Bu hadisni Ibn Moja rivoyat qilgan."},
   {t:"match", q:"Fazilatni ma'nosi bilan juftlang", pairs:[["Sabr","Qiyinchilikka chidash"],["Shukr","Ne'matni qadrlash"],["Hayo","Uyalish va odob"],["Omonat","Ishonchni oqlash"]], e:"Bu fazilatlar musulmonning ziynati."},
   {t:"tf", q:"Internetda boshqalarni masxara qilish ham gunoh.", a:true, e:"«Bir qavm boshqa qavmni masxara qilmasin» (Hujurot, 11) — bu internetga ham tegishli."},
   {t:"mc", q:"Ilmli inson haqida to'g'ri fikr qaysi?", o:["Ilmini boshqalarga ham o'rgatadi","Ilmi bilan maqtanadi","Faqat o'zi uchun o'qiydi","Savol berganlardan qochadi"], a:0, e:"«Sizlarning yaxshilaringiz Qur'onni o'rganib, o'rgatganlaringizdir» (Buxoriy)."}]}
 ]}
);

/* --- yangi bo'limlar uchun savol-javoblar --- */
ODOBIM_QA.kids.push(
 ["Payg'ambarlar nechta bo'lgan?","Qur'onda 25 nafar payg'ambarning ismi zikr qilingan. Ularning birinchisi Odam (a.s.), oxirgisi Muhammad (s.a.v.).",""],
 ["Nega uxlashdan oldin duo o'qiymiz?","Duo bilan uxlasak, Alloh bizni yomonlikdan saqlaydi va uyqumiz ham ibodatga aylanadi.","Buxoriy"]
);
ODOBIM_QA.teens.push(
 ["Fotihani nega har rakatda o'qiymiz?","Payg'ambarimiz (s.a.v.) Fotihasiz namoz bo'lmasligini aytganlar. Unda hamd, Allohni ulug'lash va to'g'ri yo'lga hidoyat so'rash bor.","Buxoriy, Muslim"],
 ["Do'stimni qanday tanlayman?","Sizni yaxshilikka chorlaydigan, namoz va darsga undaydigan, yomon so'zdan tiyadigan do'st tanlang. «Kishi do'stining dinida bo'ladi» (Abu Dovud).",""]
);
