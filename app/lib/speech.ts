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
 *
 * "Kızan" karakteri erkek olduğu için ses de her zaman erkek olmalı - bazı
 * cihazlarda birden fazla Türkçe ses kurulu olabiliyor (ör. Windows/Edge'de
 * hem kadın "Emel" hem erkek "Ahmet" nöral sesi), bu yüzden isim bazlı bir
 * sezgiyle erkek sesi önceliklendiriliyor ve seçim bir kere yapılıp
 * (cachedVoiceId) sabitleniyor - her cevapta farklı ses aralığına
 * düşmesin diye.
 */

const TR_LANG = "tr-TR";

// Yaygın Türkçe TTS seslerinin isimlerinden bilinen erkek/kadın işaretleri.
// (Web Speech API ve native platformlar sesin cinsiyetini ayrı bir alan
// olarak vermiyor, sadece isimden anlaşılabiliyor.)
const MALE_NAME_HINT = /ahmet|mehmet|tolga|kemal|erkek|\bmale\b/i;
const FEMALE_NAME_HINT = /emel|yelda|filiz|seda|kadın|\bfemale\b/i;

let cachedVoiceId: string | null | undefined; // undefined = henüz aranmadı

async function resolveVoiceId(): Promise<string | null> {
  if (cachedVoiceId !== undefined) return cachedVoiceId;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const turkish = voices.filter((v) => v.language?.toLowerCase().startsWith("tr"));
    const notFemale = turkish.filter((v) => !FEMALE_NAME_HINT.test(v.name));

    // 1. İsminden erkek olduğu belli, doğal/nöral bir ses (en iyi durum).
    const maleNatural = notFemale.find(
      (v) => MALE_NAME_HINT.test(v.name) && /natural|online|neural/i.test(v.name)
    );
    // 2. İsminden erkek olduğu belli, herhangi bir ses.
    const male = notFemale.find((v) => MALE_NAME_HINT.test(v.name));
    // 3. Cinsiyeti belirsiz ama doğal/nöral olan bir ses (kadın olduğu
    //    isimden kesin belli olanlar hariç tutuldu).
    const natural = notFemale.find((v) => /natural|online|neural/i.test(v.name));
    // 4. Native platformlarda (iOS/Android) "Enhanced" kalite işaretli ses.
    const enhanced = notFemale.find((v) => v.quality === Speech.VoiceQuality.Enhanced);
    // 5. Son çare: kadın olmayan ilk Türkçe ses, o da yoksa (tek ses kadınsa)
    //    elimizdeki ilk Türkçe ses.
    const chosen = maleNatural ?? male ?? natural ?? enhanced ?? notFemale[0] ?? turkish[0];

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
