# Persona Test Suite

Trakya Kızanı karakter sisteminin (4 mizah seviyesi) ürün kalitesini ölçen
yarı otomatik test altyapısı. Uygulamanın gerçek kodunu (`buildSystemPrompt`,
`openAIService`) doğrudan kullanır — ayrı/kopya bir prompt mantığı yoktur.

## Ne içeriyor

- `scenarios.ts` — 16 kategoride, kategori başına en az 2 soru olacak
  şekilde 32 test senaryosu (Günlük hayat, İlişkiler, Para, Finans,
  Teknoloji, Spor, Yemek, İş hayatı, Sinir/stres, Felsefe, Bilim, Tarih,
  Sağlık, Hukuk, Saçma/absürt, Mizah bekleyen sorular).
- `lexicons.ts` — `personas/dialectLexicon.ts` ve `personas/profanityRules.ts`
  ile uyumlu kelime listeleri (şive kelimeleri, fonetik bozma kalıpları,
  aşağılama ifadeleri, küfür/argo listeleri).
- `heuristics.ts` — API çağrısı gerektirmeyen otomatik ölçütler: mekanik
  şive serpiştirme, yapay/fonetik şive hissi, yasak liste/rapor formatı,
  aşırı uzunluk, kullanıcıyı aşağılama şüphesi, seviyeye göre küfür
  uygunsuzluğu, soru-cevap alaka örtüşmesi, seviyeler arası fark analizi.
- `selfTest.ts` — heuristik motorun kendini bilinen iyi/kötü örneklerle
  (görev tanımındaki "Ula beya, bunu yap beya..." örneği dahil) her
  çalıştırmada doğrulaması. API anahtarı gerektirmez.
- `judge.ts` — **opsiyonel**, `--judge` bayrağıyla açılan ikinci bir LLM
  çağrısı. Heuristiklerin ölçemediği öznel kriterleri (bilgi doğruluğu,
  mizahın gerçekten komik olması, laf sokmanın bağlama uygunluğu) 1-5
  puanlar. Varsayılan kapalı, ek OpenAI çağrısı/maliyeti gerektirir.
- `client.ts` — gerçek uygulama kodunu (`src/personas`, `src/services/openai`)
  çağıran ince katman.
- `report.ts` / `run.ts` — çalıştırıcı ve rapor üretici (JSON + Markdown).

## Neyi otomatik ölçer, neyi ölçmez

**Otomatik (heuristik, her zaman çalışır, API gerektirmez):**
mekanik şive serpiştirme, yapay şive hissi, yasak liste formatı, aşırı
uzunluk şüphesi, kaba aşağılama tespiti, seviyeye göre küfür uygunsuzluğu,
kaba alaka sinyali, seviyeler arası kelime/ton benzerliği.

**Yarı otomatik (opsiyonel `--judge`, ek OpenAI çağrısı gerektirir):**
bilgi doğruluğu, mizahın gerçekten komik/yerinde olması, laf sokmanın
bağlama uygunluğu, şive doğallığı — bunlar dil modelinin anlam
değerlendirmesi gerektirir, saf regex/kelime listesiyle güvenilir
ölçülemez.

**Manuel (raporun Markdown çıktısı bunun için tasarlandı):** 4 seviyenin
yan yana karşılaştırılıp gözle kontrol edilmesi, özellikle "gerçekten
gülüyor muyum" gibi tamamen öznel yargılar.

## Kullanım

Bağımlılıkları kurun (proje henüz `npm install` çalıştırılmamışsa):

```bash
cd server
npm install
```

### 1. Şimdi, API anahtarı olmadan — sadece altyapıyı doğrula

```bash
npm run persona-test:dry-run
```

Gerçek bir OpenAI çağrısı YAPMAZ. Şunları doğrular: 32 senaryonun doğru
yüklendiğini, her seviye için `buildSystemPrompt`'un farklı bir prompt
ürettiğini, heuristik motorun bilinen örneklerle self-testten geçtiğini ve
rapor dosyalarının (JSON + Markdown) doğru üretildiğini.

### 2. İleride, gerçek OPENAI_API_KEY eklendiğinde — tam koşum

```bash
cd server
cp .env.example .env   # .env içine gerçek OPENAI_API_KEY'inizi yazın
npm run persona-test
```

Bu tek komut 32 senaryo × 4 seviye = **128 gerçek OpenAI çağrısı** yapar.
Maliyeti/süreyi kontrol etmek için filtreler kullanılabilir:

```bash
# Sadece Finans ve Hukuk kategorileri
npm run persona-test -- --category=Finans,Hukuk

# Sadece Level 1 ve Level 4 (uç noktaları karşılaştırmak için)
npm run persona-test -- --level=1,4

# İlk 3 senaryoyla hızlı bir deneme
npm run persona-test -- --limit=3

# Öznel kriterleri de (bilgi doğruluğu, mizah kalitesi vb.) LLM-judge ile puanla
npm run persona-test -- --judge

# Tüm seçenekler
npm run persona-test -- --help
```

### 3. TypeScript kontrolü

Persona test suite ana `npm run typecheck` komutunu ETKİLEMEZ (ayrı bir
`tsconfig.persona-tests.json` kullanır, ana `server/dist` derlemesine hiçbir
dosya eklemez):

```bash
npm run persona-test:typecheck
```

## Çıktı

Her çalıştırma `persona-tests/results/` altına iki dosya yazar
(`dry-run-<zaman>.json/.md` ya da `report-<zaman>.json/.md`):

- **`.md`** — her senaryo için 4 seviyenin cevabı alt alta, hemen altında
  her seviye için otomatik ölçüt tablosu, en altta seviyeler arası
  benzerlik/fark analizi. İnsan gözden geçirme için tasarlanmıştır.
- **`.json`** — aynı verinin ham hâli, ileride başka bir araca (ör. bir
  dashboard, regresyon karşılaştırması) beslemek için.

Bu dosyalar `.gitignore`'da hariç tutulmuştur, repoya commitlenmez.
