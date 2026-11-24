/* MuhibZiyo — mazmun (savollar, ziyoratgohlar, universitetlar) */
const ODOBIM = {
kids:{ name:"Kichik ziyolilar", age:"7–11", units:[
 {title:"Salom va hurmat", desc:"Salomlashish, ota-onaga hurmat", lessons:[
  {title:"Salomlashish", qs:[
   {t:"mc",q:"Musulmonlar uchrashganda bir-biriga nima deydi?",o:["Assalomu alaykum","Xayr","Rahmat","Kechirasiz"],a:0,e:"Salom — musulmonlarning bir-biriga tinchlik tilashi."},
   {t:"mc",q:"«Assalomu alaykum»ga qanday javob beriladi?",o:["Va alaykum assalom","Bismillah","Alhamdulillah","Omin"],a:0,e:"Salomga undan yaxshiroq yoki o'shanday javob berish buyurilgan (Niso, 86)."},
   {t:"mc",q:"«Assalomu alaykum» nima degani?",o:["Sizga tinchlik bo'lsin","Xayrli tong","Ishlaringiz qalay","Ko'rishguncha"],a:0,e:"«Salom» so'zi tinchlik, omonlik ma'nosini beradi."},
   {t:"tf",q:"Kichiklar kattalarga birinchi bo'lib salom bergani yaxshi.",a:true,e:"Sunnatga ko'ra kichik kattaga, yuruvchi o'tirganga salom beradi."},
   {t:"tf",q:"Birodaringga jilmayib qarash ham yaxshi amal.",a:true,e:"Payg'ambarimiz (s.a.v.) jilmayishni ham sadaqa deganlar (Termiziy)."}]},
  {title:"Ota-onaga hurmat", qs:[
   {t:"mc",q:"Onang chaqirsa nima qilasan?",o:["Darhol «labbay» deb boraman","O'yinni tugatib keyin boraman","Eshitmaganga olaman","Javob bermayman"],a:0,e:"Ota-ona chaqirig'iga tez va chiroyli javob berish — hurmat belgisi."},
   {t:"tf",q:"Ota-onaga hatto «uf» deyish ham mumkin emas.",a:true,e:"Qur'onda ota-onaga «uf» deyish ham man qilingan (Isro, 23)."},
   {t:"mc",q:"Qaysi biri ota-onaga yaxshilik?",o:["Uy ishlarida yordam berish","Ular bilan baland ovozda gapirish","Gaplarini bo'lish","Ruxsatsiz ketib qolish"],a:0,e:"Yordam berish, yumshoq gapirish — ota-onaga yaxshilikdir."},
   {t:"mc",q:"Ota-ona uchun qaysi duo Qur'onda o'rgatilgan?",o:["«Robbim, ular meni kichikligimda tarbiya qilganidek, ularga rahm qil»","«Robbim, menga ko'p o'yinchoq ber»","«Robbim, uyimiz katta bo'lsin»","«Robbim, darsim kam bo'lsin»"],a:0,e:"Bu duo Isro surasining 24-oyatida keltirilgan."}]}
 ]},
 {title:"Kundalik odoblar", desc:"Ovqatlanish, aksirish, chiroyli so'zlar", lessons:[
  {title:"Ovqatlanish odobi", qs:[
   {t:"mc",q:"Ovqatni boshlashdan oldin nima deyiladi?",o:["Bismillah","Alhamdulillah","Omin","Mashaalloh"],a:0,e:"Har bir yaxshi ish «Bismillah» bilan boshlanadi."},
   {t:"mc",q:"Ovqatdan keyin nima deyiladi?",o:["Alhamdulillah","Bismillah","Assalomu alaykum","Insha'Alloh"],a:0,e:"Ne'mat uchun Allohga hamd aytamiz."},
   {t:"mc",q:"Qaysi qo'l bilan ovqatlanish sunnat?",o:["O'ng qo'l","Chap qo'l","Farqi yo'q","Ikkala qo'l"],a:0,e:"Payg'ambarimiz (s.a.v.) o'ng qo'l bilan, o'z oldidan yeyishni o'rgatganlar."},
   {t:"order",q:"Ovqatlanish tartibini joylashtiring",items:["Qo'lni yuvish","«Bismillah» deyish","O'ng qo'l bilan, oldingdan yeyish","«Alhamdulillah» deyish"],e:"Poklik bilan boshlab, shukr bilan tugatamiz."},
   {t:"tf",q:"Ovqatni isrof qilish — yaxshi ish emas.",a:true,e:"«Yenglar, ichinglar, isrof qilmanglar» (A'rof, 31)."}]},
  {title:"Chiroyli so'zlar", qs:[
   {t:"mc",q:"Aksirgan odam nima deydi?",o:["Alhamdulillah","Bismillah","Omin","Rahmat"],a:0,e:"Aksirgan kishi Allohga hamd aytadi."},
   {t:"mc",q:"Aksirgan kishi «Alhamdulillah» desa, eshitgan kishi nima deydi?",o:["Yarhamukalloh","Bismillah","Omin","Mashaalloh"],a:0,e:"«Yarhamukalloh» — «Alloh senga rahm qilsin» degani."},
   {t:"mc",q:"Biror ishni ertaga qilmoqchi bo'lsang nima deysan?",o:["Insha'Alloh","Mashaalloh","Subhanalloh","Astag'firulloh"],a:0,e:"«Insha'Alloh» — «Alloh xohlasa» (Kahf, 23–24)."},
   {t:"mc",q:"Chiroyli narsani ko'rganda nima deyiladi?",o:["Mashaalloh","Insha'Alloh","Omin","Bismillah"],a:0,e:"«Mashaalloh» — «Alloh xohlagani bo'ldi»."},
   {t:"tf",q:"Hazil uchun bo'lsa ham yolg'on gapirish yaxshi emas.",a:true,e:"Payg'ambarimiz (s.a.v.) hazilda ham faqat rost gapirganlar."}]}
 ]},
 {title:"Iymon va Islom", desc:"Islom va iymon arkonlari", lessons:[
  {title:"Islomning 5 ustuni", qs:[
   {t:"mc",q:"Islomning nechta arkoni (ustuni) bor?",o:["5","3","6","7"],a:0,e:"Shahodat, namoz, zakot, ro'za va haj."},
   {t:"mc",q:"Qaysi biri Islom arkonlariga kirmaydi?",o:["Tug'ilgan kunni nishonlash","Namoz","Ro'za","Haj"],a:0,e:"Islom arkonlari: shahodat, namoz, zakot, ro'za, haj."},
   {t:"mc",q:"Ro'za qaysi oyda tutiladi?",o:["Ramazon","Shavvol","Muharram","Rajab"],a:0,e:"Ramazon oyida ro'za tutish farz qilingan (Baqara, 185)."},
   {t:"mc",q:"Haj qilish uchun qaysi shaharga boriladi?",o:["Makka","Buxoro","Toshkent","Qohira"],a:0,e:"Ka'ba Makka shahrida joylashgan."},
   {t:"tf",q:"Zakot — boylarning molidan muhtojlarga beriladigan haq.",a:true,e:"Zakot molni poklaydi va kambag'allarga yordam bo'ladi."}]},
  {title:"Iymon arkonlari", qs:[
   {t:"mc",q:"Iymon arkonlari nechta?",o:["6","5","4","7"],a:0,e:"Allohga, farishtalarga, kitoblarga, payg'ambarlarga, oxirat kuniga va qadarga iymon."},
   {t:"mc",q:"Qaysi biri iymon arkonlaridan?",o:["Farishtalarga iymon","Tushga ishonish","Omadga ishonish","Yulduzlarga ishonish"],a:0,e:"Farishtalarga iymon — iymonning ikkinchi arkoni."},
   {t:"mc",q:"Qur'oni karim qaysi payg'ambarga nozil bo'lgan?",o:["Muhammad (s.a.v.)","Muso (a.s.)","Iso (a.s.)","Dovud (a.s.)"],a:0,e:"Qur'on oxirgi payg'ambar Muhammad (s.a.v.)ga nozil bo'lgan."},
   {t:"mc",q:"Birinchi inson va birinchi payg'ambar kim?",o:["Odam (a.s.)","Nuh (a.s.)","Ibrohim (a.s.)","Yunus (a.s.)"],a:0,e:"Odam (a.s.) — insoniyatning otasi."},
   {t:"tf",q:"Muhammad (s.a.v.) — oxirgi payg'ambar.",a:true,e:"U zot «xotamun nabiyyin» — payg'ambarlarning so'nggisidir (Ahzob, 40)."}]}
 ]},
 {title:"Poklik va namoz", desc:"Tahorat va besh vaqt namoz", lessons:[
  {title:"Tahorat", qs:[
   {t:"mc",q:"Namozdan oldin qanday poklanish qilinadi?",o:["Tahorat","Faqat qo'l yuvish","Tish yuvish","Soch tarash"],a:0,e:"Tahoratsiz namoz qabul bo'lmaydi."},
   {t:"order",q:"Tahorat tartibini joylashtiring",items:["Qo'llarni bilakkacha yuvish","Og'iz va burunni chayish","Yuzni yuvish","Qo'llarni tirsakkacha yuvish","Boshga mash tortish","Oyoqlarni to'piqqacha yuvish"],e:"Tahorat niyat va «Bismillah» bilan boshlanadi."},
   {t:"tf",q:"Tahoratda o'ng tomondan boshlash sunnat.",a:true,e:"Avval o'ng qo'l, keyin chap; avval o'ng oyoq, keyin chap."},
   {t:"mc",q:"Tahorat qilganda suvni qanday ishlatamiz?",o:["Isrof qilmasdan","Jo'mrakni ochiq qoldirib","Faqat issiq suv bilan","Iloji boricha ko'p"],a:0,e:"Daryo bo'yida bo'lsang ham suvni isrof qilma, deyilgan."}]},
  {title:"Besh vaqt namoz", qs:[
   {t:"mc",q:"Kuniga necha vaqt farz namoz o'qiladi?",o:["5","3","2","7"],a:0,e:"Bomdod, peshin, asr, shom va xufton."},
   {t:"order",q:"Namoz vaqtlarini kun tartibida joylashtiring",items:["Bomdod","Peshin","Asr","Shom","Xufton"],e:"Bomdod tongda, xufton kechqurun o'qiladi."},
   {t:"mc",q:"Quyosh chiqishidan oldin o'qiladigan namoz?",o:["Bomdod","Asr","Shom","Xufton"],a:0,e:"Bomdod tong otgandan quyosh chiqqunicha o'qiladi."},
   {t:"mc",q:"Namozda qaysi tomonga yuzlanamiz?",o:["Qiblaga — Ka'ba tomonga","Quyosh tomonga","Shimolga","Farqi yo'q"],a:0,e:"Qibla — Makkadagi Ka'ba tomoni."},
   {t:"tf",q:"Namozning har rakatida Fotiha surasi o'qiladi.",a:true,e:"Fotiha — Qur'onning birinchi surasi."}]}
 ]}
]},
teens:{ name:"Yosh ziyolilar", age:"12–15", units:[
 {title:"Aqida", desc:"Iymon arkonlari va Qur'on", lessons:[
  {title:"Iymon arkonlari", qs:[
   {t:"order",q:"«Amantu» tartibida iymon arkonlarini joylashtiring",items:["Allohga","Farishtalarga","Kitoblarga","Payg'ambarlarga","Oxirat kuniga","Qadarga"],e:"Bu tartib «Amantu» duosida keltirilgan."},
   {t:"mc",q:"Vahiyni payg'ambarlarga yetkazgan farishta kim?",o:["Jabroil (a.s.)","Mikoil (a.s.)","Isrofil (a.s.)","Azroil (a.s.)"],a:0,e:"Jabroil (a.s.) — vahiy farishtasi."},
   {t:"mc",q:"Tavrot qaysi payg'ambarga nozil bo'lgan?",o:["Muso (a.s.)","Dovud (a.s.)","Iso (a.s.)","Ibrohim (a.s.)"],a:0,e:"To'rt kitob: Tavrot — Musoga, Zabur — Dovudga, Injil — Isoga, Qur'on — Muhammad (s.a.v.)ga."},
   {t:"mc",q:"Zabur qaysi payg'ambarga nozil bo'lgan?",o:["Dovud (a.s.)","Muso (a.s.)","Iso (a.s.)","Nuh (a.s.)"],a:0,e:"«Dovudga Zaburni berdik» (Niso, 163)."},
   {t:"tf",q:"Imom Moturidiy — Samarqandlik buyuk aqida olimi.",a:true,e:"Yurtimiz musulmonlari aqidada Moturidiya yo'lidan boradi."}]},
  {title:"Qur'oni karim", qs:[
   {t:"mc",q:"Qur'onda nechta sura bor?",o:["114","99","120","30"],a:0,e:"Qur'on 114 sura, 30 poradan iborat."},
   {t:"mc",q:"Birinchi nozil bo'lgan oyat qaysi so'z bilan boshlanadi?",o:["«Iqro'» — «O'qi»","«Alhamdulillah»","«Qul huvalloh»","«Yo ayyuhallaziyna»"],a:0,e:"Alaq surasining dastlabki oyatlari Hiro g'orida nozil bo'lgan."},
   {t:"mc",q:"Qur'on qaysi kechada nozil bo'la boshlagan?",o:["Qadr kechasi","Me'roj kechasi","Barot kechasi","Hayit kechasi"],a:0,e:"«Albatta, Biz uni Qadr kechasida nozil qildik» (Qadr, 1)."},
   {t:"mc",q:"Qur'onning eng uzun surasi qaysi?",o:["Baqara","Fotiha","Yosin","Kavsar"],a:0,e:"Baqara surasi 286 oyatdan iborat."},
   {t:"tf",q:"Qur'onning eng qisqa surasi — Kavsar.",a:true,e:"Kavsar surasi uch oyatdan iborat."}]}
 ]},
 {title:"Ibodat", desc:"Namoz, ro'za va zakot", lessons:[
  {title:"Namoz rakatlari", qs:[
   {t:"mc",q:"Bomdod namozining farzi necha rakat?",o:["2","3","4","1"],a:0,e:"Bomdod farzi — 2 rakat."},
   {t:"mc",q:"Shom namozining farzi necha rakat?",o:["3","2","4","5"],a:0,e:"Shom farzi — 3 rakat."},
   {t:"mc",q:"Peshin, asr va xuftonning farzi necha rakatdan?",o:["4 rakatdan","2 rakatdan","3 rakatdan","6 rakatdan"],a:0,e:"Bu uch namozning farzi 4 rakatdan."},
   {t:"mc",q:"Juma namozi qaysi namoz o'rniga o'qiladi?",o:["Peshin","Bomdod","Asr","Shom"],a:0,e:"Juma kuni peshin o'rniga juma namozi o'qiladi."},
   {t:"tf",q:"Namoz «Allohu akbar» deb takbir aytish bilan boshlanadi.",a:true,e:"Bu takbiri tahrima deyiladi va namozning farzlaridan."}]},
  {title:"Ro'za va zakot", qs:[
   {t:"mc",q:"Saharlik nima?",o:["Tong otishidan oldingi taom","Ro'za ochish","Kechki namoz","Hayit taomi"],a:0,e:"Saharlik qilish sunnat, unda baraka bor."},
   {t:"mc",q:"Ro'za ochish nima deb ataladi?",o:["Iftor","Sahar","Taroveh","Ruku'"],a:0,e:"Shom vaqti kirganda iftor qilinadi."},
   {t:"mc",q:"Zakot odatda molning qancha qismi?",o:["Qirqdan biri (2,5%)","Yarmi","O'ndan biri","Hammasi"],a:0,e:"Nisobga yetgan va bir yil to'lgan moldan 2,5% beriladi."},
   {t:"mc",q:"Ramazon hayiti namozidan oldin beriladigan sadaqa?",o:["Fitr sadaqasi","Qurbonlik","Nazr","Kafforat"],a:0,e:"Fitr sadaqasi ro'zani poklaydi va muhtojlarni bayramda xursand qiladi."},
   {t:"tf",q:"Kasal yoki safardagi odam ro'zani keyinroq tutishi mumkin.",a:true,e:"Bu yengillik Baqara surasining 184-oyatida bayon qilingan."}]}
 ]},
 {title:"Axloq", desc:"Til odobi va insonlar bilan muomala", lessons:[
  {title:"Til odobi", qs:[
   {t:"mc",q:"G'iybat nima?",o:["Birovning yo'qligida u yoqtirmaydigan gapni aytish","Birovni yuzida maqtash","Ovoz chiqarib kitob o'qish","Birov uchun duo qilish"],a:0,e:"G'iybat Qur'onda qattiq qoralangan (Hujurot, 12)."},
   {t:"mc",q:"Tuhmat nima?",o:["Birovga u qilmagan ishni to'nkash","Birovni haqiqatda maqtash","Sir saqlash","Kechirim so'rash"],a:0,e:"Tuhmat g'iybatdan ham og'irroq gunoh."},
   {t:"mc",q:"Payg'ambarimiz (s.a.v.) yaxshi so'zni nima deganlar?",o:["Sadaqa","Odat","Behuda gap","Majburiyat"],a:0,e:"«Yaxshi so'z — sadaqadir» (Buxoriy)."},
   {t:"mc",q:"Ijtimoiy tarmoqda tekshirilmagan xabar ko'rsang?",o:["Avval tekshiraman, ishonchsiz bo'lsa tarqatmayman","Darhol hammaga yuboraman","O'zimdan qo'shib yozaman","Izoh qoldirib ustidan kulaman"],a:0,e:"Xabarni aniqlab olish buyurilgan (Hujurot, 6)."},
   {t:"tf",q:"Rost bo'lsa ham, birovning ayblarini yoyib yurish g'iybat hisoblanadi.",a:true,e:"Agar gap yolg'on bo'lsa, u tuhmatga aylanadi."}]},
  {title:"Insonlar bilan muomala", qs:[
   {t:"tf",q:"Va'dani bajarmaslik munofiqlik belgilaridan biri.",a:true,e:"Hadisda munofiqning uch belgisi: yolg'on, va'daga xilof, omonatga xiyonat (Buxoriy, Muslim)."},
   {t:"mc",q:"Do'sting seni xafa qilsa, eng yaxshi yo'l qaysi?",o:["Sabr qilib, kechirish va yarashish","Albatta qasos olish","Hammaga yomonlash","Butunlay gaplashmay qo'yish"],a:0,e:"Musulmon birodari bilan uch kundan ortiq arazlashib yurmaydi (Buxoriy)."},
   {t:"mc",q:"Qo'shni haqida to'g'ri fikr qaysi?",o:["Qo'shniga ozor bermaslik iymondan","Qo'shni bilan ishimiz yo'q","Faqat qarindosh qo'shni hurmatga loyiq","Qo'shni bayramda eslanadi"],a:0,e:"Qo'shni haqqi Islomda juda ulug'langan."},
   {t:"mc",q:"Kattalar gapirayotganda nima qilinadi?",o:["Diqqat bilan tinglab, gapini bo'lmaslik","Telefonga qarab o'tirish","Gapini to'g'rilab turish","Chiqib ketish"],a:0,e:"Kattani hurmat qilish — odobning asosi."},
   {t:"tf",q:"Hayvonlarga ozor berish ham gunoh.",a:true,e:"Hadislarda hayvonga rahm qilish savobli ish ekani aytilgan."}]}
 ]},
 {title:"Tarix va allomalar", desc:"Sira va yurtimiz olimlari", lessons:[
  {title:"Payg'ambarimiz hayoti", qs:[
   {t:"mc",q:"Muhammad (s.a.v.) qaysi shaharda tug'ilganlar?",o:["Makka","Madina","Toif","Quddus"],a:0,e:"Payg'ambarimiz (s.a.v.) Makkada, Fil yilida tug'ilganlar."},
   {t:"mc",q:"Makkadan Madinaga ko'chish nima deb ataladi?",o:["Hijrat","Me'roj","Haj","Fath"],a:0,e:"Hijriy yil hisobi shu voqeadan boshlanadi."},
   {t:"mc",q:"Hijrat milodiy qaysi yilda bo'lgan?",o:["622-yil","570-yil","632-yil","750-yil"],a:0,e:"Hijrat milodiy 622-yilda bo'lgan."},
   {t:"mc",q:"Birinchi xalifa kim bo'lgan?",o:["Abu Bakr Siddiq (r.a.)","Umar (r.a.)","Usmon (r.a.)","Ali (r.a.)"],a:0,e:"Abu Bakr (r.a.) — Payg'ambarimizning eng yaqin do'sti."},
   {t:"tf",q:"Payg'ambarimiz (s.a.v.) yoshligidayoq «Al-Amin» — «ishonchli» deb atalganlar.",a:true,e:"Rostgo'ylik va omonatdorlik u zotning tanilgan sifatlari edi."}]},
  {title:"Vatanimiz allomalari", qs:[
   {t:"mc",q:"«Sahihi Buxoriy» kitobining muallifi kim?",o:["Imom Buxoriy","Imom Termiziy","Imom Moturidiy","Bahouddin Naqshband"],a:0,e:"Bu kitob eng ishonchli hadis to'plamlaridan biri."},
   {t:"mc",q:"Imom Buxoriy maqbarasi qayerda?",o:["Samarqand yaqinidagi Xartangda","Buxoro markazida","Termizda","Toshkentda"],a:0,e:"Hozirgi Samarqand viloyati, Payariq tumanida."},
   {t:"mc",q:"«Sunani Termiziy» muallifi qaysi alloma?",o:["Imom Termiziy","Imom Buxoriy","Hakim Termiziy","Imom Moturidiy"],a:0,e:"Imom Abu Iso Termiziy — Imom Buxoriyning shogirdi."},
   {t:"mc",q:"Imom Moturidiy qaysi shaharda yashagan?",o:["Samarqand","Xiva","Qo'qon","Andijon"],a:0,e:"Abu Mansur Moturidiy — Samarqandlik alloma."},
   {t:"mc",q:"Bahouddin Naqshband maqbarasi qaysi shaharda?",o:["Buxoro","Samarqand","Namangan","Termiz"],a:0,e:"Buxoro yaqinidagi Qasri Orifonda."}]}
 ]}
]}
};

const ODOBIM_QA = {
kids:[
 ["Nega «Bismillah» deymiz?","«Bismillah» — «Allohning nomi bilan» degani. Ishni shu so'z bilan boshlasak, ishimizga baraka kiradi va Allohni eslagan bo'lamiz.",""],
 ["Tahorat nima uchun kerak?","Tahorat — namozdan oldingi poklanish. Alloh pok bo'lganlarni yaxshi ko'radi, tahoratsiz namoz o'qilmaydi.","Moida surasi, 6-oyat"],
 ["Bolalar ham ro'za tutadimi?","Ro'za balog'atga yetgandan keyin farz bo'ladi. Bungacha ota-onalar bolani asta-sekin, kuchiga yarasha ro'zaga odatlantiradi.",""],
 ["Duoni o'zbek tilida qilsa bo'ladimi?","Ha. Alloh har bir tilni biladi, duoni o'z tilingda qilsang bo'ladi. Namoz ichidagi qiroat va zikrlar esa arabcha o'qiladi.",""],
 ["Sadaqa faqat pulmi?","Yo'q. Yaxshi so'z, birovga yordam, yo'ldan ozor beruvchi narsani olib tashlash, hatto jilmayish ham sadaqa hisoblanadi.","Buxoriy, Termiziy"],
 ["Nechta hayit bor?","Ikkita: Ramazon hayiti (Ro'za hayiti) va Qurbon hayiti.",""]
],
teens:[
 ["Nima uchun ro'za tutamiz?","Ro'za taqvoga — Allohdan qo'rqib, yomonlikdan saqlanishga o'rgatadi. Sabr, shukr va muhtojlarning holini his qilish ham ro'zaning hikmatlaridandir.","Baqara surasi, 183-oyat"],
 ["Namozni vaqtida o'qiy olmasam nima qilaman?","Uxlab qolgan yoki unutgan kishi eslagan zahoti uni qazo qilib o'qiydi. Namozni ataylab qoldirmaslik kerak.","Muslim"],
 ["Qur'onni tahoratsiz ushlasa bo'ladimi?","Hanafiy mazhabida mushafni tahoratsiz ushlash mumkin emas. Yoddan o'qish yoki telefondan o'qish masalasida ustozdan so'rang.","Voqi'a surasi, 79-oyat"],
 ["G'iybatdan qanday saqlanaman?","Gapirishdan oldin «bu gapni u eshitsa xafa bo'ladimi?» deb o'ylang. G'iybat bo'layotgan joyda mavzuni burish yoki o'sha kishini himoya qilish ham savob.",""],
 ["Mazhab nima?","Mazhab — Qur'on va sunnatdan hukm chiqarish yo'li. Yurtimiz musulmonlari fiqhda Imom A'zam Abu Hanifa mazhabiga, aqidada Imom Moturidiy yo'liga ergashadi.",""],
 ["Ota-onam bilan fikrim to'g'ri kelmasa-chi?","Fikringizni hurmat bilan, ovozni ko'tarmasdan ayting. Gunoh bo'lmagan ishda ularga itoat qiling va doim yaxshi muomalada bo'ling.","Luqmon surasi, 15-oyat"]
]};

/* ===================== HAJ VA UMRA SAVOLLARI ===================== */
const HAJ_QS = [
 {t:"mc",q:"Umra uchun ihrom qayerdan bog'lanadi?",o:["Miqotdan","Ka'ba oldida","Arafotda","Madinadagi mehmonxonada"],a:0,e:"Makkaga boruvchi ihromsiz miqotdan o'tmaydi."},
 {t:"mc",q:"Ka'ba atrofida tavof necha aylana bo'ladi?",o:["7","3","5","10"],a:0,e:"Tavof yetti aylanadan iborat."},
 {t:"mc",q:"Sa'y qaysi ikki tepalik orasida qilinadi?",o:["Safo va Marva","Uhud va Savr","Arafot va Muzdalifa","Nur va Rahmat"],a:0,e:"«Albatta, Safo va Marva Allohning nishonalaridandir» (Baqara, 158)."},
 {t:"mc",q:"Tavof qaysi joydan boshlanadi?",o:["Hajarul asvad ro'parasidan","Ruknul yamoniydan","Maqomi Ibrohimdan","Bobus-salomdan"],a:0,e:"Tavof Hajarul asvad ro'parasidan boshlanib, o'sha yerda tugaydi."},
 {t:"mc",q:"Arafotda turish qaysi kuni bo'ladi?",o:["9-Zulhijja","10-Zulhijja","8-Zulhijja","1-Muharram"],a:0,e:"Arafa kuni — Zulhijjaning 9-kuni."},
 {t:"mc",q:"Hajning eng asosiy rukni qaysi?",o:["Arafotda turish","Zamzam ichish","Madinani ziyorat qilish","Sochni qisqartirish"],a:0,e:"«Haj — Arafotdir» (Termiziy)."},
 {t:"mc",q:"Ihromdagi erkak kishi nima kiyadi?",o:["Ikki parcha tikilmagan mato","Oq to'n va do'ppi","Oddiy kiyim","Faqat oq ko'ylak"],a:0,e:"Izor va rido — tikilmagan ikki mato."},
 {t:"mc",q:"Talbiya qaysi so'zlar bilan boshlanadi?",o:["Labbaykallohumma labbayk","Subhanalloh","Allohu akbar","Bismillah"],a:0,e:"Talbiya ihromga kirgandan boshlab aytiladi."},
 {t:"mc",q:"Qurbon hayiti qaysi kunga to'g'ri keladi?",o:["10-Zulhijja","1-Shavvol","9-Zulhijja","27-Ramazon"],a:0,e:"Qurbon hayiti Arafa kunining ertasi."},
 {t:"mc",q:"Masjidul Haromda o'qilgan namoz boshqa masjiddagidan necha barobar afzal?",o:["100 ming","1 ming","10","500"],a:0,e:"Bu fazilat Ibn Moja va Ahmad rivoyat qilgan hadisda kelgan."},
 {t:"mc",q:"Rawdai sharifa qayerda joylashgan?",o:["Payg'ambar masjidida, minbar va hujrai saodat orasida","Masjidul Haromda","Quba masjidida","Arafot tog'ida"],a:0,e:"«Uyim bilan minbarim orasi jannat bog'laridan bir bog'dir» (Buxoriy, Muslim)."},
 {t:"tf",q:"Tavof qilinganda Ka'ba tavof qiluvchining chap tomonida bo'ladi.",a:true,e:"Tavof soat miliga teskari yo'nalishda qilinadi."},
 {t:"tf",q:"Zamzam qudug'i Masjidul Harom hududida joylashgan.",a:true,e:"Zamzam — Ka'ba yaqinidagi muborak quduq."},
 {t:"mc",q:"Sa'y necha shavtdan (borib-kelishdan) iborat?",o:["7","4","3","9"],a:0,e:"Safodan boshlanib, Marvada tugaydi."},
 {t:"mc",q:"Islomdagi birinchi masjid qaysi?",o:["Quba masjidi","Masjidi Nabaviy","Qiblatayn masjidi","Juma masjidi"],a:0,e:"Hijratda Payg'ambarimiz (s.a.v.) Qubaga kelib, masjidga asos solganlar."}
];

/* ===================== ZIKRLAR ===================== */
const ADHKAR = [
 {ar:"سُبْحَانَ اللهِ", tr:"SubhanAlloh", uz:"Alloh pokdir", n:33},
 {ar:"الْحَمْدُ لِلَّهِ", tr:"Alhamdulillah", uz:"Allohga hamd bo'lsin", n:33},
 {ar:"اللهُ أَكْبَرُ", tr:"Allohu akbar", uz:"Alloh buyukdir", n:34},
 {ar:"لَا إِلَٰهَ إِلَّا اللهُ", tr:"La ilaha illalloh", uz:"Allohdan o'zga iloh yo'q", n:100},
 {ar:"أَسْتَغْفِرُ اللهَ", tr:"Astag'firulloh", uz:"Allohdan mag'firat so'rayman", n:100},
 {ar:"سُبْحَانَ اللهِ وَبِحَمْدِهِ", tr:"Subhanallohi va bihamdihi", uz:"Alloh pokdir va Unga hamd bo'lsin", n:100},
 {ar:"اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ", tr:"Allohumma solli 'ala Muhammad", uz:"Payg'ambarimizga salovat", n:100}
];

/* ===================== ALLOHNING 99 ISMI ===================== */
const NAMES99 = `الرَّحْمَنُ|Ar-Rohman|Mehribon
الرَّحِيمُ|Ar-Rohim|Rahmli
الْمَلِكُ|Al-Malik|Podshoh
الْقُدُّوسُ|Al-Quddus|Pok
السَّلَامُ|As-Salom|Tinchlik beruvchi
الْمُؤْمِنُ|Al-Mu'min|Omonlik beruvchi
الْمُهَيْمِنُ|Al-Muhaymin|Kuzatib turuvchi
الْعَزِيزُ|Al-Aziz|Qudratli
الْجَبَّارُ|Al-Jabbor|Irodasini o'tkazuvchi
الْمُتَكَبِّرُ|Al-Mutakabbir|Ulug'vor
الْخَالِقُ|Al-Xoliq|Yaratuvchi
الْبَارِئُ|Al-Bori'|Yo'qdan bor qiluvchi
الْمُصَوِّرُ|Al-Musavvir|Shakl beruvchi
الْغَفَّارُ|Al-G'affor|Ko'p mag'firat qiluvchi
الْقَهَّارُ|Al-Qahhor|G'olib
الْوَهَّابُ|Al-Vahhob|Hadya qiluvchi
الرَّزَّاقُ|Ar-Razzoq|Rizq beruvchi
الْفَتَّاحُ|Al-Fattoh|Ochuvchi
الْعَلِيمُ|Al-Alim|Biluvchi
الْقَابِضُ|Al-Qobiz|Toraytiruvchi
الْبَاسِطُ|Al-Bosit|Kengaytiruvchi
الْخَافِضُ|Al-Xofiz|Pastlatuvchi
الرَّافِعُ|Ar-Rofi'|Yuksaltiruvchi
الْمُعِزُّ|Al-Mu'izz|Aziz qiluvchi
الْمُذِلُّ|Al-Muzill|Xor qiluvchi
السَّمِيعُ|As-Sami'|Eshituvchi
الْبَصِيرُ|Al-Basir|Ko'ruvchi
الْحَكَمُ|Al-Hakam|Hukm qiluvchi
الْعَدْلُ|Al-Adl|Adolatli
اللَّطِيفُ|Al-Latif|Lutfli
الْخَبِيرُ|Al-Xobir|Xabardor
الْحَلِيمُ|Al-Halim|Halim
الْعَظِيمُ|Al-Azim|Ulug'
الْغَفُورُ|Al-G'afur|Kechiruvchi
الشَّكُورُ|Ash-Shakur|Qadrlovchi
الْعَلِيُّ|Al-Aliy|Oliy
الْكَبِيرُ|Al-Kabir|Buyuk
الْحَفِيظُ|Al-Hafiz|Saqlovchi
الْمُقِيتُ|Al-Muqit|Quvvat beruvchi
الْحَسِيبُ|Al-Hasib|Hisob qiluvchi
الْجَلِيلُ|Al-Jalil|Jalil
الْكَرِيمُ|Al-Karim|Karamli
الرَّقِيبُ|Ar-Roqib|Kuzatuvchi
الْمُجِيبُ|Al-Mujib|Ijobat qiluvchi
الْوَاسِعُ|Al-Vosi'|Keng
الْحَكِيمُ|Al-Hakim|Hikmatli
الْوَدُودُ|Al-Vadud|Sevuvchi
الْمَجِيدُ|Al-Majid|Sharafli
الْبَاعِثُ|Al-Bo'is|Tiriltiruvchi
الشَّهِيدُ|Ash-Shahid|Guvoh
الْحَقُّ|Al-Haqq|Haq
الْوَكِيلُ|Al-Vakil|Vakil
الْقَوِيُّ|Al-Qaviy|Kuchli
الْمَتِينُ|Al-Matin|Mustahkam
الْوَلِيُّ|Al-Valiy|Yordamchi
الْحَمِيدُ|Al-Hamid|Maqtovga loyiq
الْمُحْصِي|Al-Muhsi|Hisoblovchi
الْمُبْدِئُ|Al-Mubdi'|Boshlovchi
الْمُعِيدُ|Al-Mu'id|Qaytaruvchi
الْمُحْيِي|Al-Muhyi|Hayot beruvchi
الْمُمِيتُ|Al-Mumit|O'lim beruvchi
الْحَيُّ|Al-Hayy|Tirik
الْقَيُّومُ|Al-Qayyum|Abadiy turuvchi
الْوَاجِدُ|Al-Vojid|Topuvchi
الْمَاجِدُ|Al-Mojid|Ulug'
الْوَاحِدُ|Al-Vohid|Yagona
الْأَحَدُ|Al-Ahad|Yakka
الصَّمَدُ|As-Somad|Behojat
الْقَادِرُ|Al-Qodir|Qodir
الْمُقْتَدِرُ|Al-Muqtadir|Qudratli
الْمُقَدِّمُ|Al-Muqaddim|Oldinga suruvchi
الْمُؤَخِّرُ|Al-Mu'axxir|Ortga suruvchi
الْأَوَّلُ|Al-Avval|Avval
الْآخِرُ|Al-Oxir|Oxir
الظَّاهِرُ|Az-Zohir|Zohir
الْبَاطِنُ|Al-Botin|Botin
الْوَالِي|Al-Voliy|Hokim
الْمُتَعَالِي|Al-Muta'oliy|Yuksak
الْبَرُّ|Al-Barr|Yaxshilik qiluvchi
التَّوَّابُ|At-Tavvob|Tavbalarni qabul qiluvchi
الْمُنْتَقِمُ|Al-Muntaqim|Jazolovchi
الْعَفُوُّ|Al-Afuvv|Afv etuvchi
الرَّءُوفُ|Ar-Ro'uf|Shafqatli
مَالِكُ الْمُلْكِ|Molikul-Mulk|Mulk egasi
ذُو الْجَلَالِ وَالْإِكْرَامِ|Zul-Jaloli val-Ikrom|Ulug'lik va ikrom sohibi
الْمُقْسِطُ|Al-Muqsit|Adolat qiluvchi
الْجَامِعُ|Al-Jomi'|Jamlovchi
الْغَنِيُّ|Al-G'aniy|Behojat boy
الْمُغْنِي|Al-Mug'niy|Boy qiluvchi
الْمَانِعُ|Al-Mone'|To'suvchi
الضَّارُّ|Az-Zorr|Zarar yetkazuvchi
النَّافِعُ|An-Nofi'|Foyda beruvchi
النُّورُ|An-Nur|Nur
الْهَادِي|Al-Hodi|Hidoyat qiluvchi
الْبَدِيعُ|Al-Badi'|Benazir yaratuvchi
الْبَاقِي|Al-Boqiy|Boqiy
الْوَارِثُ|Al-Voris|Voris
الرَّشِيدُ|Ar-Roshid|To'g'ri yo'lga boshlovchi
الصَّبُورُ|As-Sobur|Sabrli`.split("\n").map(l=>{const [ar,tr,uz]=l.split("|");return {ar,tr,uz,n:33};});

/* ===================== SOVG'ALAR =====================
   Server ham shu ro'yxatni o'qiydi (GIFTS_JSON belgilari orasidagi qism qat'iy JSON bo'lishi shart).
   books  — yig'ilgan yulduzga beriladigan kitoblar (stars — narxi)
   odobim — Odobim o'yinidagi yutuq uchun sovg'alar: units — nechta bo'lim to'liq tugatilishi kerak,
            pick — bir xil pick qiymatli sovg'alardan faqat bittasini tanlash mumkin.
   Bu ro'yxat NAMUNA: nomlar va narxlarni o'zingizdagi haqiqiy sovg'alarga almashtiring. */
const GIFTS = /*GIFTS_JSON*/{
 "books": [
  {"id":"b1", "title":"Payg'ambarlar qissalari", "desc":"Oila bilan o'qish uchun rangli nashr", "stars":300, "color":"#2F9E8F"},
  {"id":"b2", "title":"Odob va axloq kitobi", "desc":"Kundalik odoblar haqida qisqa hikoyalar", "stars":250, "color":"#C9603B"},
  {"id":"b3", "title":"Hadislar to'plami", "desc":"Tanlangan hadislar sharhi bilan", "stars":500, "color":"#4A7BD0"},
  {"id":"b4", "title":"Haj va umra qo'llanmasi", "desc":"Ziyoratga tayyorlanuvchilar uchun", "stars":200, "color":"#C8962E"},
  {"id":"b5", "title":"Qur'oni karim ma'nolari tarjimasi", "desc":"Katta formatdagi nashr", "stars":800, "color":"#8B5CC9"}
 ],
 "odobim": {
  "kids": [
   {"id":"k1", "title":"Rangli bo'yama kitob", "type":"book", "desc":"Odob mavzusidagi bo'yama", "units":1},
   {"id":"k2", "title":"Bolalar uchun payg'ambarlar qissasi", "type":"book", "desc":"Rasmli kitob", "units":3},
   {"id":"k3", "title":"Konstruktor o'yinchoq", "type":"toy", "desc":"Butun kursni tugatganlarga", "units":6, "pick":"kfinal"},
   {"id":"k4", "title":"Yumshoq o'yinchoq", "type":"toy", "desc":"Butun kursni tugatganlarga", "units":6, "pick":"kfinal"}
  ],
  "teens": [
   {"id":"t1", "title":"Yoshlar uchun odob kitobi", "type":"book", "desc":"Qisqa va qiziqarli bo'limlar", "units":1},
   {"id":"t2", "title":"Sahobalar hayoti", "type":"book", "desc":"Tarixiy hikoyalar", "units":3},
   {"id":"t3", "title":"Shaxmat to'plami", "type":"toy", "desc":"Butun kursni tugatganlarga", "units":6, "pick":"tfinal"},
   {"id":"t4", "title":"Kitoblar to'plami (3 ta)", "type":"book", "desc":"Butun kursni tugatganlarga", "units":6, "pick":"tfinal"}
  ]
 }
}/*END_GIFTS_JSON*/;

/* ===================== QO'LLANMA ===================== */
const GUIDE = [
 {h:"MuhibZiyo nima?", p:["MuhibZiyo — ilm o'rganuvchilar va ularning farzandlari uchun yordamchi.","Bilimingizni sinab ⭐ yulduz yig'asiz va reytingda bellashasiz.","Ilovada namoz vaqtlari va eslatmalari, qibla, tasbeh va bolalar uchun Odobim o'yini bor."]},
 {h:"⭐ Yulduz qanday yig'iladi", list:["Kitob quizi — har bir to'g'ri javob uchun 1 ⭐","Tasodifiy quiz — har bir to'g'ri javob uchun 2 ⭐","Tasbeh — har 100 zikr uchun 1 ⭐ (kuniga 9 tagacha)","Odobim darsi — har bir yangi dars uchun 3 ⭐","Do'st taklif qilish — 5 ⭐ (haftasiga 25 tagacha)","7 kunlik seriya — +21 ⭐"], note:"Yulduzlar yo'qolmaydi — yig'ib boring va kitobga almashtiring."},
 {h:"👨‍👩‍👧 Ota-ona nazorati", list:["Odobim → «Ota-ona» bo'limida har bir farzand uchun alohida profil ochasiz","Kunlik o'yin vaqtini cheklaysiz (masalan, 20 daqiqa)","PIN-kod qo'yib, sozlamalarni bolalardan himoya qilasiz","Har bir bolaning natijasi, vaqti va qiyin bo'lgan darslarini ko'rasiz","Har yakshanba bot haftalik hisobot yuboradi"]},
 {h:"Quiz qoidalari", list:["Har bir savolga 20 soniya","3 ta xatodan keyin test tugaydi","Kitob testini 60 daqiqadan keyin qayta yechish mumkin","🎓 mashq rejimida yulduz berilmaydi, cheklov ham yo'q"]}
];

/* ===================== NAMUNA REYTING ===================== */
const SAMPLE_BOARD = [["Abdulloh",412],["Oisha",368],["Muhammadali",301],["Zaynab",254],["Umar",190],["Hadicha",142],["Yusuf",96],["Maryam",61]];

/* ===================== NAMOZ VAQTLARI: SHAHARLAR VA HISOB USULLARI ===================== */
/* Usullar: f — bomdod burchagi, i — xufton burchagi yoki im — shomdan keyingi daqiqa,
   a — asr (1 = Shofeiy, 2 = Hanafiy), adj — daqiqali tuzatishlar (O'zbekiston taqvimiga moslangan) */
const PT_METHODS = {
  uzb:   {name:"O'zbekiston musulmonlari idorasi (islom.uz)", f:15.5, i:15.5, a:2, adj:{maghrib:4}},
  umm:   {name:"Ummul Quro (Makka)", f:18.5, im:90, a:1, ram:30},
  mwl:   {name:"Musulmon olami ligasi", f:18, i:17, a:2},
  rus:   {name:"Rossiya muftiyati", f:16, i:15, a:2},
  diyanet:{name:"Turkiya Diyanat", f:18, i:17, a:1, adj:{sunrise:-7, dhuhr:5, asr:4, maghrib:7}},
  egypt: {name:"Misr", f:19.5, i:17.5, a:1},
  karachi:{name:"Karachi", f:18, i:18, a:2},
  isna:  {name:"Shimoliy Amerika (ISNA)", f:15, i:15, a:1},
  dubai: {name:"BAA (Dubay)", f:18.2, i:18.2, a:1}
};
const PT_CITIES = [
 /* O'zbekiston */
 ["tashkent","Toshkent",41.300872,69.241813,"Asia/Tashkent","uz"],["samarkand","Samarqand",39.65065,66.97646,"Asia/Samarkand","uz"],
 ["bukhara","Buxoro",39.7723,64.423324,"Asia/Samarkand","uz"],["andijan","Andijon",40.786215,72.328205,"Asia/Tashkent","uz"],
 ["namangan","Namangan",41.005175,71.643583,"Asia/Tashkent","uz"],["fergana","Farg'ona",40.376952,71.793129,"Asia/Tashkent","uz"],
 ["kokand","Qo'qon",40.535509,70.937948,"Asia/Tashkent","uz"],["margilan","Marg'ilon",40.47111,71.72472,"Asia/Tashkent","uz"],
 ["navoi","Navoiy",40.102403,65.367579,"Asia/Samarkand","uz"],["karshi","Qarshi",38.830248,65.778764,"Asia/Samarkand","uz"],
 ["shahrisabz","Shahrisabz",39.0578,66.8342,"Asia/Samarkand","uz"],["termez","Termiz",37.258528,67.308346,"Asia/Samarkand","uz"],
 ["denau","Denov",38.33333,67.83333,"Asia/Samarkand","uz"],["jizzakh","Jizzax",40.122196,67.873275,"Asia/Samarkand","uz"],
 ["gulistan","Guliston",40.49255,68.777611,"Asia/Tashkent","uz"],["angren","Angren",41.008146,70.077367,"Asia/Tashkent","uz"],
 ["chirchiq","Chirchiq",41.4689,69.5822,"Asia/Tashkent","uz"],["urgench","Urganch",41.553823,60.620611,"Asia/Samarkand","uz"],
 ["khiva","Xiva",41.389141,60.350174,"Asia/Samarkand","uz"],["nukus","Nukus",42.471325,59.61682,"Asia/Samarkand","uz"],
 ["kattakurgan","Kattaqo'rg'on",39.901290,66.269495,"Asia/Samarkand","uz"],["bekabad","Bekobod",40.22083,69.26972,"Asia/Tashkent","uz"],
 ["zarafshan","Zarafshon",41.573315,64.184617,"Asia/Samarkand","uz"],["urgut","Urgut",39.415816,67.247700,"Asia/Samarkand","uz"],
 ["chust","Chust",41.005111,71.235968,"Asia/Tashkent","uz"],["kungrad","Qo'ng'irot",43.060726,58.862514,"Asia/Samarkand","uz"],
 ["shahrikhan","Shahrixon",40.715027,72.060484,"Asia/Tashkent","uz"],["boysun","Boysun",38.200470,67.203991,"Asia/Samarkand","uz"],
 ["gazalkent","G'azalkent",41.5659,69.7704,"Asia/Tashkent","uz"],["yangibazar","Yangibozor",41.318903,69.527575,"Asia/Tashkent","uz"],
 /* Haramayn va Saudiya */
 ["makkah","Makka",21.4225,39.8262,"Asia/Riyadh","sa"],["madinah","Madina",24.4672,39.6111,"Asia/Riyadh","sa"],
 ["jeddah","Jidda",21.4858,39.1925,"Asia/Riyadh","sa"],["riyadh","Riyod",24.7136,46.6753,"Asia/Riyadh","sa"],
 /* Boshqa davlatlar */
 ["almaty","Olmaota",43.2389,76.8897,"Asia/Almaty","kz"],["astana","Astana",51.1694,71.4491,"Asia/Almaty","kz"],
 ["bishkek","Bishkek",42.8746,74.5698,"Asia/Bishkek","kg"],["osh","O'sh",40.5140,72.8161,"Asia/Bishkek","kg"],
 ["dushanbe","Dushanbe",38.5598,68.7870,"Asia/Dushanbe","tj"],["ashgabat","Ashxobod",37.9601,58.3261,"Asia/Ashgabat","tm"],
 ["moscow","Moskva",55.7558,37.6173,"Europe/Moscow","ru"],["spb","Sankt-Peterburg",59.9343,30.3351,"Europe/Moscow","ru"],
 ["kazan","Qozon",55.7887,49.1221,"Europe/Moscow","ru"],["novosibirsk","Novosibirsk",55.0084,82.9357,"Asia/Novosibirsk","ru"],
 ["istanbul","Istanbul",41.0082,28.9784,"Europe/Istanbul","tr"],["ankara","Anqara",39.9334,32.8597,"Europe/Istanbul","tr"],
 ["dubai","Dubay",25.2048,55.2708,"Asia/Dubai","ae"],["cairo","Qohira",30.0444,31.2357,"Africa/Cairo","eg"],
 ["seoul","Seul",37.5665,126.9780,"Asia/Seoul","kr"],["london","London",51.5074,-0.1278,"Europe/London","gb"],
 ["berlin","Berlin",52.5200,13.4050,"Europe/Berlin","de"],["newyork","Nyu-York",40.7128,-74.0060,"America/New_York","us"],
 ["warsaw","Varshava",52.2297,21.0122,"Europe/Warsaw","pl"]
].map(([id,name,lat,lng,tz,cc])=>({id,name,lat,lng,tz,cc}));
const PT_COUNTRY_METHOD = {uz:"uzb", tj:"uzb", kg:"uzb", tm:"uzb", sa:"umm", kz:"mwl", ru:"rus", tr:"diyanet", ae:"dubai", eg:"egypt", us:"isna", kr:"mwl", gb:"mwl", de:"mwl", pl:"mwl"};
