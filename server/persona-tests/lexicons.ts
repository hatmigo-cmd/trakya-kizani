/**
 * Heuristik motorun dayandığı kelime listeleri.
 *
 * Bunlar server/src/personas/*.ts içindeki gerçek kurallardan türetilmiştir
 * (bkz. dialectLexicon.ts, profanityRules.ts, humorRules.ts). Amaç, o
 * dosyalardaki kuralların modelin ÇIKTISINDA gerçekten uygulanıp
 * uygulanmadığını otomatik olarak yoklayabilmektir.
 */

// dialectLexicon.ts DIALECT_LEXICON_GUIDE ile birebir aynı liste.
export const DIALECT_WORDS = [
  "ula",
  "beya",
  "be",
  "bre",
  "kızan",
  "len",
  "gari",
  "bak hele",
  "ne ediyon",
  "napıyon",
];

// dialectLexicon.ts kural 4: "kelimeleri bozarak yazma" örnekleri ve benzer
// fonetik bozma kalıpları. Kesin bir liste değildir, en yaygın kalıpları
// yakalamayı hedefler.
export const FAKE_DIALECT_PATTERNS: RegExp[] = [
  /\b\w*iyorm\b/gi, // "geliyorm"
  /\b\w*ıyorm\b/gi,
  /\b\w*uyorm\b/gi,
  /\b\w*üyorm\b/gi,
  /\b\w*yoz\b/gi, // "yapıyoz"
  /\b\w*yom\b/gi, // "yapıyom"
  /\b\w*caz\b/gi, // "gidecez" -> "gidecaz" gibi bozmalar
  /\b\w*cez\b/gi,
];

// humorRules.ts "OLMAZ (aşağılama)" örnekleri ve benzer, kullanıcıyı hedef
// alan aşağılayıcı ifadeler.
export const INSULT_KEYWORDS = [
  "aptalca",
  "aptal mısın",
  "salaksın",
  "salak mısın",
  "gerizekalı",
  "geri zekalı",
  "beyinsiz",
  "ahmaksın",
  "beceriksizsin",
  "bu kadar da beceriksiz",
  "hiç mi düşünmüyon",
  "hiç düşünmüyorsun",
  "aptal soru",
];

// Ağır küfür / hakaret niteliğindeki kelimeler. Level 1-2'de HİÇ görülmemeli.
export const STRONG_PROFANITY = [
  "orospu",
  "piç",
  "amk",
  "amına",
  "yarrak",
  "siktir git",
  "siktir ol",
  "göt herif",
  "ananı",
  "ibne",
];

// Hafif argo/deyimsel ifadeler - küfür sayılmaz ama sokak ağzı hissi verir.
// profanityRules.ts level 2 açıklamasındaki örneklerle uyumludur.
export const MILD_ARGO = [
  "siktir etti",
  "yavşaklık",
  "sinek uçuyo",
  "adam sandık",
  "boş yapma",
  "kafayı yedim",
];

// Soru-cevap alaka kontrolü için göz ardı edilecek çok yaygın Türkçe
// bağlaç/edat/zamirler (kaba bir stopword listesi).
export const STOPWORDS = new Set([
  "bir",
  "bu",
  "şu",
  "o",
  "ve",
  "ile",
  "de",
  "da",
  "mi",
  "mı",
  "mu",
  "mü",
  "ne",
  "için",
  "gibi",
  "çok",
  "daha",
  "en",
  "ama",
  "ya",
  "ki",
  "beya",
  "ula",
  "kızan",
  "sen",
  "ben",
  "biz",
  "siz",
  "var",
  "yok",
  "olur",
  "olmaz",
  "nasıl",
  "neden",
  "niye",
  "diye",
]);
