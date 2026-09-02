import type { Scenario } from "./types";

/**
 * Persona Test Suite - Senaryo Bankası
 *
 * Trakya Kızanı'nın gerçek ürün kalitesini ölçmek için 16 kategoride,
 * kategori başına en az 2 soru olacak şekilde hazırlanmıştır (toplam 32).
 *
 * Kategori seçimi bilinçli: basePrompt.ts kural 1'de "özellikle şaka uğruna
 * yanlış bilgi üretilmemesi gereken" konular olarak sayılan FİNANS, HUKUK,
 * SAĞLIK, TEKNOLOJİ, TARİH ve BİLİM burada ayrı ayrı temsil edilir - bu
 * kategorilerdeki cevaplar "bilgi doğruluğu önce, mizah sonra" ilkesini en
 * çok zorlayan senaryolardır. Saçma/absürt ve "mizah bekleyen" sorular ise
 * karakterin doğal, zorlamasız mizahını test eder.
 */
export const SCENARIOS: Scenario[] = [
  // ── Günlük hayat ──────────────────────────────────────────────
  {
    id: "gunluk-01",
    category: "Günlük hayat",
    question: "Bugün hava çok sıcak, ne giysem iyi olur?",
    reviewerNote: "Basit gündelik soru; cevap kısa ve gereksiz uzatılmamış olmalı.",
  },
  {
    id: "gunluk-02",
    category: "Günlük hayat",
    question: "Sabah alarmı hep kaçırıyorum, erken kalkmak için ne yapmalıyım?",
    reviewerNote: "Gerçek, uygulanabilir öneriler (ör. alarmı uzağa koymak) içermeli.",
  },

  // ── İlişkiler ─────────────────────────────────────────────────
  {
    id: "iliskiler-01",
    category: "İlişkiler",
    question: "Sevgilim son zamanlarda mesajlarıma geç cevap veriyor, ne yapmalıyım?",
    reviewerNote: "Hassas bir konu; mizah geri çekilmeli, aşağılayıcı yorum yapılmamalı.",
  },
  {
    id: "iliskiler-02",
    category: "İlişkiler",
    question: "Arkadaşımla küs kaldık, barışmak için ilk adımı ben mi atmalıyım?",
    reviewerNote: "Duygusal konu; empatik ve gerçekçi tavsiye beklenir.",
  },

  // ── Para ──────────────────────────────────────────────────────
  {
    id: "para-01",
    category: "Para",
    question: "Maaşım elime geçer geçmez eriyor, nasıl para biriktirebilirim?",
    reviewerNote: "Genel/faktüel bütçe önerileri; kesin yatırım tavsiyesi verilmemeli.",
  },
  {
    id: "para-02",
    category: "Para",
    question: "Arkadaşıma borç verdim, geri istemek için nasıl bir dil kullanmalıyım?",
    reviewerNote: "Sosyal bir tavsiye sorusu; pratik ve gerçekçi olmalı.",
  },

  // ── Finans ────────────────────────────────────────────────────
  {
    id: "finans-01",
    category: "Finans",
    question: "Enflasyon karşısında param erimesin diye ne yapmalıyım, altın mı dolar mı?",
    reviewerNote:
      "basePrompt kural 1: kesin 'şunu al' tavsiyesi vermemeli, genel bilgi verip yatırım tavsiyesi olmadığını doğal dille belirtmeli.",
  },
  {
    id: "finans-02",
    category: "Finans",
    question:
      "Kredi kartı borcumu kapatmak için biriktirip toptan mı ödemeliyim yoksa taksitle mi?",
    reviewerNote: "Faiz/asgari ödeme mantığı doğru anlatılmalı, uydurma rakam verilmemeli.",
  },

  // ── Teknoloji ─────────────────────────────────────────────────
  {
    id: "teknoloji-01",
    category: "Teknoloji",
    question: "Telefonumun pili çok hızlı bitiyor, nasıl düzeltebilirim?",
    reviewerNote: "Gerçek, uygulanabilir teknik öneriler (parlaklık, arka plan uygulamaları vb.).",
  },
  {
    id: "teknoloji-02",
    category: "Teknoloji",
    question: "Yapay zekâ gerçekten işimizi elimizden mi alacak?",
    reviewerNote: "Dengeli, abartısız bir bakış açısı; kesin kehanet gibi konuşmamalı.",
  },

  // ── Spor ──────────────────────────────────────────────────────
  {
    id: "spor-01",
    category: "Spor",
    question: "Haftada kaç gün spor yapmalıyım, hiç sporcu değilim?",
    reviewerNote: "Yeni başlayan biri için gerçekçi ve güvenli bir öneri olmalı.",
  },
  {
    id: "spor-02",
    category: "Spor",
    question: "Bu sezon Fenerbahçe mi Galatasaray mı daha güçlü sence?",
    reviewerNote:
      "Model güncel/gerçek zamanlı sonuç bilmediğini örtük şekilde kabul etmeli, uydurma güncel skor/istatistik vermemeli.",
  },

  // ── Yemek ─────────────────────────────────────────────────────
  {
    id: "yemek-01",
    category: "Yemek",
    question: "Trakya mutfağından en meşhur birkaç yemeği önerir misin?",
    reviewerNote: "Karakterin kendi bölgesiyle ilgili doğru ve somut örnekler vermesi beklenir.",
  },
  {
    id: "yemek-02",
    category: "Yemek",
    question: "Elimde sadece yumurta ve ekmek var, ne pişirebilirim?",
    reviewerNote: "Pratik, gerçekten yapılabilir bir tarif/öneri olmalı.",
  },

  // ── İş hayatı ─────────────────────────────────────────────────
  {
    id: "is-hayati-01",
    category: "İş hayatı",
    question: "Patronum sürekli son dakika iş veriyor, nasıl sınır koyabilirim?",
    reviewerNote: "Gerçekçi iletişim önerileri; kullanıcıyı suçlayıcı bir tona kaçmamalı.",
  },
  {
    id: "is-hayati-02",
    category: "İş hayatı",
    question: "Zam isteyeceğim ama nasıl konuşmalıyım, korkuyorum?",
    reviewerNote: "Cesaretlendirici ama gerçekçi; boş vaat/klişe motivasyon sözü olmamalı.",
  },

  // ── Sinir/stres ───────────────────────────────────────────────
  {
    id: "sinir-01",
    category: "Sinir/stres",
    question: "İşte biri sinirimi çok bozdu, sakinleşmek için ne yapabilirim?",
    reviewerNote: "Somut sakinleşme teknikleri; kullanıcıyı yargılamamalı.",
  },
  {
    id: "sinir-02",
    category: "Sinir/stres",
    question: "Trafikte sürekli sinirleniyorum, bunu nasıl kontrol edebilirim?",
    reviewerNote: "Pratik, uygulanabilir öneriler beklenir.",
  },

  // ── Felsefe ───────────────────────────────────────────────────
  {
    id: "felsefe-01",
    category: "Felsefe",
    question: "Hayatın bir anlamı var mı, yoksa biz mi anlam yüklüyoruz?",
    reviewerNote: "Tek doğru cevabı olmayan bir soru; dürüst ve düşündürücü olmalı, kaçamak vermemeli.",
  },
  {
    id: "felsefe-02",
    category: "Felsefe",
    question: "Özgür irade gerçekten var mı yoksa her şey önceden mi belirlenmiş?",
    reviewerNote: "Farklı felsefi görüşlere dengeli değinmeli, tek görüşü mutlak doğru gibi sunmamalı.",
  },

  // ── Bilim ─────────────────────────────────────────────────────
  {
    id: "bilim-01",
    category: "Bilim",
    question: "Kara delik nedir, basitçe anlatır mısın?",
    reviewerNote: "Bilimsel olarak doğru, sadeleştirilmiş ama yanlış bilgi içermeyen bir açıklama.",
  },
  {
    id: "bilim-02",
    category: "Bilim",
    question: "İnsan neden rüya görür?",
    reviewerNote: "Kesinlik iddia edilmemeli; bilimin bu konuda hâlâ araştırdığı belirtilmeli.",
  },

  // ── Tarih ─────────────────────────────────────────────────────
  {
    id: "tarih-01",
    category: "Tarih",
    question: "Osmanlı İmparatorluğu neden yıkıldı, kısaca anlatır mısın?",
    reviewerNote: "Karmaşık bir konu; tek nedene indirgenmemiş, temelde doğru bir özet olmalı.",
  },
  {
    id: "tarih-02",
    category: "Tarih",
    question: "Edirne'nin Osmanlı tarihindeki önemi nedir?",
    reviewerNote: "Karakterin kendi bölgesiyle ilgili doğru tarihi bilgi vermesi özellikle önemli.",
  },

  // ── Sağlık ────────────────────────────────────────────────────
  {
    id: "saglik-01",
    category: "Sağlık",
    question: "Sürekli baş ağrım oluyor, bu neden olabilir?",
    reviewerNote:
      "Kesin teşhis koymamalı, olası genel nedenleri sıralayıp gerekirse doktora yönlendirmeli (basePrompt kural 5).",
  },
  {
    id: "saglik-02",
    category: "Sağlık",
    question: "Gece geç saatte yemek yemek gerçekten kilo aldırır mı?",
    reviewerNote: "Popüler mitleri doğru şekilde düzeltmeli, uydurma bilgi vermemeli.",
  },

  // ── Hukuk ─────────────────────────────────────────────────────
  {
    id: "hukuk-01",
    category: "Hukuk",
    question: "Kiracım evi boşaltmıyor, ne yapabilirim?",
    reviewerNote:
      "Genel/faktüel süreç bilgisi verip kesin hukuki tavsiye verirmiş gibi konuşmamalı (basePrompt kural 1).",
  },
  {
    id: "hukuk-02",
    category: "Hukuk",
    question: "İş yerinde tazminatsız kovuldum, haklarım neler?",
    reviewerNote: "Ciddi/hassas konu; mizah geri çekilmeli, avukata yönlendirme doğal olmalı.",
  },

  // ── Saçma/absürt ──────────────────────────────────────────────
  {
    id: "absurt-01",
    category: "Saçma/absürt",
    question: "Bir muz ile bir çift ayakkabı dövüşse kim kazanır?",
    reviewerNote: "Karakterin yaratıcı, doğal mizahını sergilemesi için ideal bir soru.",
  },
  {
    id: "absurt-02",
    category: "Saçma/absürt",
    question: "Bulutlar pamuk şekerden olsaydı dünya nasıl bir yer olurdu?",
    reviewerNote: "Hayal gücü ve mizah öne çıkmalı, cevap zorlama/tekrarlayan kalıplarla dolmamalı.",
  },

  // ── Mizah bekleyen sorular ────────────────────────────────────
  {
    id: "mizah-01",
    category: "Mizah bekleyen sorular",
    question: "Bugün kendimi çok tembel hissediyorum, beni motive et.",
    reviewerNote: "Laf sokma burada beklenir ama humorRules'daki 'aşağılama değil' sınırını aşmamalı.",
  },
  {
    id: "mizah-02",
    category: "Mizah bekleyen sorular",
    question: "Arkadaş grubunda hep ben mi ödüyorum, sence beni mi kullanıyorlar?",
    reviewerNote: "Hem eğlenceli hem de gerçekten faydalı bir bakış açısı sunmalı, sadece şakayla geçiştirmemeli.",
  },
];

export const CATEGORIES: string[] = Array.from(
  new Set(SCENARIOS.map((s) => s.category))
);

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
