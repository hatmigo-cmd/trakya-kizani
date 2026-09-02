# Trakya Kızanı

Kullanıcının sorduğu her konuda önce doğru ve faydalı, sonra Trakya şivesi/mizahıyla
karakterleştirilmiş cevaplar veren mobil yapay zekâ sohbet uygulaması.

Bu depo iki parçadan oluşur:

- `app/` — Expo (React Native + TypeScript) mobil uygulaması
- `server/` — Node.js + Express (TypeScript) backend'i. OpenAI API anahtarını
  saklar ve mobil uygulamanın tek konuştuğu yer burasıdır; anahtar istemciye
  asla gönderilmez.

Kurulum ve çalıştırma adımları için `server/README.md` ve `app/README.md`
dosyalarına bakın.
