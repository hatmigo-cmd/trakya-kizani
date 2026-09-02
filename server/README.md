# Trakya Kızanı — Backend

Mobil uygulamanın konuştuğu tek yer burası. OpenAI API anahtarını saklar,
seçilen mizah seviyesine göre "Trakya Kızanı" karakter sistemini içeren
system prompt'u kurar ve OpenAI'ye iletir.

## Kurulum

```bash
cd server
npm install
cp .env.example .env
# .env dosyasını açıp OPENAI_API_KEY değerini kendi anahtarınızla değiştirin
npm run dev
```

Sunucu varsayılan olarak `http://localhost:3000` üzerinde çalışır.

> ÖNEMLİ: `OPENAI_API_KEY` sadece `.env` dosyasında tutulur. `.env`,
> `.gitignore` içinde olduğu için repoya asla commitlenmez. Anahtarı hiçbir
> zaman kod içine yazmayın ya da mobil uygulamaya göndermeyin.

## Endpoint'ler

- `GET /health` — sağlık kontrolü.
- `GET /api/humor-levels` — mevcut 4 mizah seviyesinin listesi.
- `POST /api/chat` — asıl sohbet endpoint'i.

  İstek gövdesi:

  ```json
  {
    "message": "Bugün spor yapmalı mıyım?",
    "level": 2,
    "history": [{ "role": "user", "content": "..." }, { "role": "assistant", "content": "..." }]
  }
  ```

  `level`: 1 (Efendi), 2 (Samimi, varsayılan), 3 (Kahvehane Modu), 4 (Delirmiş Kızan).
  `history` opsiyoneldir, en fazla son 20 mesaj dikkate alınır.

  Yanıt:

  ```json
  { "reply": "Yap beya. ...", "level": 2 }
  ```

## Karakter sistemi

`src/personas/` klasöründe tutulur:

- `basePrompt.ts` — değişmez kural: önce doğruluk, sonra karakter.
- `level1-efendi.ts` … `level4-delirmis-kizan.ts` — her mizah seviyesine özel üslup direktifleri.
- `fewShotExamples.ts` — modelin tonu yakalaması için örnek diyaloglar.
- `buildSystemPrompt.ts` — hepsini birleştirip tek system prompt üretir.

Bir seviyenin tonunu değiştirmek istediğinizde sadece ilgili `levelN-*.ts`
dosyasını düzenlemeniz yeterli; endpoint veya diğer kod değişmez.

## Komutlar

- `npm run dev` — geliştirme sunucusu (dosya değişikliklerinde otomatik yeniden başlar)
- `npm run build` — TypeScript'i `dist/`e derler
- `npm start` — derlenmiş sürümü çalıştırır
- `npm run typecheck` — sadece tip kontrolü yapar

## Barındırma (deploy)

Sade bir Node.js/Express uygulaması olduğu için Render, Railway, Fly.io gibi
herhangi bir Node hosting'inde çalıştırılabilir: `npm run build && npm start`
komutlarını çalıştıracak şekilde ayarlayıp `OPENAI_API_KEY` ve `OPENAI_MODEL`
değişkenlerini o platformun "environment variables" bölümünden tanımlamanız
yeterli.
