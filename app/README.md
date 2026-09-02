# Trakya Kızanı — Mobil Uygulama

Expo (React Native + TypeScript) ile yazılmış mobil uygulama. `expo-router`
ile sayfa yönlendirme kullanır.

## Kurulum

```bash
cd app
npm install
npx expo start
```

Açılan QR kodu Expo Go uygulamasıyla okutup telefonunuzda, ya da `i`/`a`
tuşlarıyla iOS/Android simülatöründe çalıştırabilirsiniz.

## Backend'e bağlanma

Uygulama, tüm OpenAI isteklerini kendi backend'iniz üzerinden yapar
(`../server`). Varsayılan olarak `http://localhost:3000` adresine bağlanır.

- **Web veya simülatörde** test ediyorsanız backend'i `npm run dev` ile
  ayrı bir terminalde çalıştırmanız yeterli, varsayılan adres çalışır.
- **Fiziksel bir cihazda / Expo Go'da** test ediyorsanız `localhost`
  telefonun kendisini işaret eder, bilgisayarınızı değil. Bilgisayarınızın
  yerel ağ IP adresini kullanmanız gerekir:

  ```bash
  # app/ klasöründe bir .env dosyası oluşturup:
  EXPO_PUBLIC_API_URL=http://192.168.1.23:3000
  ```

  (IP adresinizi `ifconfig` / `ipconfig` ile bulabilirsiniz; telefon ve
  bilgisayarın aynı Wi-Fi ağında olması gerekir.)

## Proje yapısı

```
app/
  app/                # expo-router sayfaları
    _layout.tsx        # kök navigasyon (Stack)
    index.tsx           # onboarding/sohbet yönlendirme kapısı
    onboarding.tsx       # ilk açılış tanıtımı + mizah seviyesi seçimi
    chat/[id].tsx         # ana sohbet ekranı ("new" = yeni sohbet)
    history.tsx            # sohbet geçmişi (modal)
    settings.tsx             # ayarlar (modal)
  components/          # ChatBubble, ChatInput, HumorLevelPicker, MessageActionsSheet
  lib/                 # theme.ts, api.ts (backend client), storage.ts (AsyncStorage)
  types/               # chat.ts (ortak tipler)
```

## Komutlar

- `npm run start` — Expo geliştirme sunucusunu başlatır
- `npm run android` / `npm run ios` / `npm run web`
- `npm run typecheck` — TypeScript tip kontrolü

## Notlar

- Sohbet geçmişi cihazda `AsyncStorage` ile saklanır (bulut senkronizasyonu
  yok, MVP kapsamı dışında).
- Mizah seviyesi Ayarlar'dan değiştirilir ve yeni başlatılan sohbetlere
  uygulanır.
- Sesli konuşma bu sürümde yok; veri modeli (`types/chat.ts`) ve backend
  servis katmanı (`server/src/services/openai.ts`) ileride eklenmesine
  uygun şekilde tasarlandı.
