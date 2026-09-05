import * as Speech from "expo-speech";

/**
 * Sesli sohbet - metni sesli okuma (TTS) yardımcıları.
 *
 * expo-speech hem native (iOS/Android, Expo Go dahil) hem de web'de
 * (tarayıcının kendi konuşma sentezi motorunu kullanarak) çalışır - ekstra
 * native build/config plugin gerekmez.
 *
 * Bazı platformlarda (özellikle Windows/Chrome'un varsayılan Türkçe sesi)
 * ses çok robotik/"tutuk" çıkabiliyor. Cihazda/tarayıcıda kurulu seslerin
 * arasında daha doğal duran bir tane varsa (ör. Edge'in Azure "Online
 * (Natural)" nöral Türkçe sesi) onu otomatik seçiyoruz - kullanıcı için
 * ekstra bir ayar gerekmiyor.
 */

const TR_LANG = "tr-TR";

let cachedVoiceId: string | null | undefined; // undefined = henüz aranmadı

async function resolveVoiceId(): Promise<string | null> {
  if (cachedVoiceId !== undefined) return cachedVoiceId;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const turkish = voices.filter((v) => v.language?.toLowerCase().startsWith("tr"));

    // 1. "Natural"/"Online"/"Neural" adlı sesler (ör. Microsoft Edge'in Azure
    //    nöral sesleri) - kıyaslanamayacak kadar daha akıcı ve insansı.
    const natural = turkish.find((v) => /natural|online|neural/i.test(v.name));
    // 2. Native platformlarda (iOS/Android) "Enhanced" kalite işaretli ses.
    const enhanced = turkish.find((v) => v.quality === Speech.VoiceQuality.Enhanced);
    const chosen = natural ?? enhanced ?? turkish[0];

    cachedVoiceId = chosen?.identifier ?? null;
  } catch {
    cachedVoiceId = null;
  }
  return cachedVoiceId;
}

export async function speak(text: string) {
  const trimmed = text?.trim();
  if (!trimmed) return;
  // Önceki okumayı kesip yenisini başlat - üst üste binmesin.
  Speech.stop();
  const voice = await resolveVoiceId();
  Speech.speak(trimmed, {
    language: TR_LANG,
    voice: voice ?? undefined,
    pitch: 1.0,
    // Doğal sesler için normal hız daha akıcı duruyor; robotik yedek
    // seslerde de hafif yavaşlatmak "tutukluk" hissini azaltıyor.
    rate: 0.98,
  });
}

export function stopSpeaking() {
  Speech.stop();
}

export function isSpeakingAsync(): Promise<boolean> {
  return Speech.isSpeakingAsync();
}
