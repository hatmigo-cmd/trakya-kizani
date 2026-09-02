import * as Speech from "expo-speech";

/**
 * Sesli sohbet - metni sesli okuma (TTS) yardımcıları.
 *
 * expo-speech hem native (iOS/Android, Expo Go dahil) hem de web'de
 * (tarayıcının kendi konuşma sentezi motorunu kullanarak) çalışır - ekstra
 * native build/config plugin gerekmez.
 */

const TR_LANG = "tr-TR";

export function speak(text: string) {
  const trimmed = text?.trim();
  if (!trimmed) return;
  // Önceki okumayı kesip yenisini başlat - üst üste binmesin.
  Speech.stop();
  Speech.speak(trimmed, {
    language: TR_LANG,
    pitch: 1.0,
    rate: 1.0,
  });
}

export function stopSpeaking() {
  Speech.stop();
}

export function isSpeakingAsync(): Promise<boolean> {
  return Speech.isSpeakingAsync();
}
