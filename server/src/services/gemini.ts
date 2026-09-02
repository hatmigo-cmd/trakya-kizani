import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import type { ChatMessage } from "../types";

/**
 * AIService: bu arayüz sabit tutularak ileride (örn. sesli konuşma için
 * Whisper/TTS entegrasyonu ya da farklı bir model sağlayıcısı eklenirken)
 * geri kalan kodun (routes/chat.ts) değişmesine gerek kalmaz.
 */
export interface AIService {
  generateReply(
    systemPrompt: string,
    history: ChatMessage[],
    userMessage: string
  ): Promise<string>;
}

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY tanımlı değil. server/.env dosyasını server/.env.example dosyasından kopyalayıp kendi anahtarınızı girin."
    );
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

/**
 * NOT: Bu değişken adı ("openAIService") tarihsel nedenlerle korunmuştur -
 * routes/chat.ts ve persona-tests/client.ts sadece import satırlarını bu
 * dosyaya işaret edecek şekilde günceller, çağıran kod
 * (`openAIService.generateReply(...)`) hiç değişmez. İçeriği artık OpenAI
 * değil Gemini'dir.
 */
export const openAIService: AIService = {
  async generateReply(systemPrompt, history, userMessage) {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const contents = [
      ...history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: userMessage }] },
    ];

    const response = await getClient().models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.9,
        // Bu bir sohbet/mizah asistanı - derin "thinking" moduna hiç
        // gerek yok, sadece cevabı gereksiz yere geciktiriyor (kullanıcı
        // "çok uzun süre düşünüp cevap veriyor" diye şikayet etti).
        // NOT: gemini-3.x modelleri (bu projede gemini-3.6-flash)
        // "thinkingBudget" DEĞİL "thinkingLevel" kullanıyor - budget
        // göndermek INVALID_ARGUMENT (400) hatası veriyordu. "MINIMAL"
        // düşünmeyi mümkün olduğunca kısıp cevabı hızlandırır.
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.MINIMAL,
        },
      },
    });

    const reply = response.text;
    if (!reply) {
      throw new Error("Gemini boş cevap döndürdü.");
    }
    return reply;
  },
};
