import OpenAI from "openai";
import type { HumorLevel, JudgeScore, Scenario } from "./types";
import { getModelName } from "./client";

/**
 * OPSİYONEL LLM-Judge aşaması.
 *
 * Heuristik motor (heuristics.ts) yalnızca mekanik/kelime bazlı sinyalleri
 * yakalayabilir (şive tekrarı, yasak liste formatı, küfür kelimesi vb.).
 * "Bilgi doğruluğu", "mizahın gerçekten komik olması", "laf sokmanın
 * bağlama uygunluğu" gibi öznel/anlamsal kriterler için tek güvenilir
 * otomatik yöntem ikinci bir LLM çağrısıyla hakemlik yaptırmaktır.
 *
 * Bu modül `--judge` bayrağı verildiğinde ve OPENAI_API_KEY tanımlıyken
 * çalışır; varsayılan olarak KAPALIDIR ve hiçbir ek API çağrısı yapmaz.
 */

export interface JudgeInput {
  scenario: Scenario;
  answers: Partial<Record<HumorLevel, string>>;
}

const RUBRIC = `Sen "Trakya Kızanı" adlı bir sohbet karakterinin cevap kalitesini
değerlendiren titiz bir kalite kontrol hakemisin. Aşağıda aynı soruya 4 farklı
mizah seviyesinde verilmiş cevaplar var (1: Efendi/en yumuşak, 4: Delirmiş
Kızan/en sert). Her seviyeyi ayrı ayrı, aşağıdaki 10 kritere 1-5 arası puan
vererek değerlendir (5 = mükemmel, 1 = ciddi sorunlu):

1. bilgiDogrulugu: Cevap doğru, faydalı ve eksiksiz mi?
2. siveDogalligi: Trakya şivesi doğal mı, yoksa zorlama/karikatürize mi?
3. mizah: Mizah varsa gerçekten esprili ve yerinde mi?
4. lafSokmaBaglami: Varsa laf sokma, kullanıcının söylediği somut bir şeye mi
   dokunuyor yoksa alakasız hazır bir kalıp mı?
5. kufurUygunlugu: Küfür/argo kullanımı bu seviye için uygun mu (fazla/az değil)?
6. asagilamama: Cevap kullanıcıyı gerçekten küçük düşürüyor mu? (5 = hiç
   aşağılamıyor, 1 = açıkça aşağılıyor)
7. beyaUlaTekrari: "beya/ula" gibi ifadeler doğal mı yoksa mekanik şekilde
   tekrar mı ediyor? (5 = doğal, 1 = mekanik tekrar)
8. yapaySiveHissi: Şive yapay/zorlama hissi veriyor mu? (5 = hiç vermiyor,
   1 = çok yapay)
9. gereksizUzunluk: Cevap sorunun niteliğine göre gereksiz uzun mu? (5 = uygun
   uzunlukta, 1 = gereksiz uzun)
10. sorulaAlaka: Cevap doğrudan soruyla alakalı mı?

Ayrıca 4 seviyenin GERÇEKTEN birbirinden farklı olup olmadığına dair kısa bir
"gerekce" yaz (seviyeler arasında ses tonu/içerik farkı yoksa bunu açıkça
belirt).

SADECE şu JSON şemasına uyan bir JSON döndür, başka hiçbir açıklama ekleme:

{
  "levels": {
    "1": { "bilgiDogrulugu": n, "siveDogalligi": n, "mizah": n, "lafSokmaBaglami": n, "kufurUygunlugu": n, "asagilamama": n, "beyaUlaTekrari": n, "yapaySiveHissi": n, "gereksizUzunluk": n, "sorulaAlaka": n, "gerekce": "..." },
    "2": { ... }, "3": { ... }, "4": { ... }
  },
  "seviyeFarkiYorumu": "..."
}`;

let client: OpenAI | null = null;
function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY tanımlı değil, judge aşaması çalıştırılamaz.");
  }
  if (!client) client = new OpenAI({ apiKey });
  return client;
}

export async function judgeScenario(
  input: JudgeInput
): Promise<{ scores: Partial<Record<HumorLevel, JudgeScore>>; seviyeFarkiYorumu: string }> {
  const userContent = JSON.stringify(
    {
      soru: input.scenario.question,
      kategori: input.scenario.category,
      cevaplar: input.answers,
    },
    null,
    2
  );

  const completion = await getClient().chat.completions.create({
    model: getModelName(),
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: RUBRIC },
      { role: "user", content: userContent },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Judge çağrısı boş cevap döndürdü.");

  const parsed = JSON.parse(raw) as {
    levels: Partial<Record<string, JudgeScore>>;
    seviyeFarkiYorumu: string;
  };

  const scores: Partial<Record<HumorLevel, JudgeScore>> = {};
  for (const key of ["1", "2", "3", "4"] as const) {
    const val = parsed.levels?.[key];
    if (val) scores[Number(key) as HumorLevel] = val;
  }

  return { scores, seviyeFarkiYorumu: parsed.seviyeFarkiYorumu ?? "" };
}
