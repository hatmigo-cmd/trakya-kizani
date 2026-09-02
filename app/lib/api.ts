import type { ChatMessage, HumorLevel } from "../types/chat";

/**
 * Backend URL. Expo'da istemciye açık env değişkenleri EXPO_PUBLIC_ öneki
 * taşımalı. Fiziksel bir cihazda / Expo Go'da test ederken "localhost"
 * cihazın kendisini işaret eder; bu yüzden geliştirme sırasında bilgisayarın
 * yerel ağ IP'sini (örn. http://192.168.1.23:3000) kullanmanız gerekir.
 * Bkz. app/README.md.
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {}

export interface SendMessageParams {
  message: string;
  level: HumorLevel;
  history: ChatMessage[];
}

export interface SendMessageResult {
  reply: string;
  level: HumorLevel;
}

export async function sendChatMessage({
  message,
  level,
  history,
}: SendMessageParams): Promise<SendMessageResult> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        level,
        history: history.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
  } catch (err) {
    throw new ApiError(
      "Sunucuya ulaşılamadı. Backend çalışıyor mu ve doğru adrese mi bağlanıyorsun kontrol et."
    );
  }

  if (!response.ok) {
    let errorMessage = "Bir şeyler ters gitti.";
    try {
      const data = await response.json();
      if (typeof data?.error === "string") errorMessage = data.error;
    } catch {
      // yanıt JSON değilse varsayılan mesajı kullan
    }
    throw new ApiError(errorMessage);
  }

  const data = await response.json();
  return { reply: data.reply, level: data.level };
}
