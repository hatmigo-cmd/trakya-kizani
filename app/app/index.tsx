import { Redirect } from "expo-router";

/**
 * Giriş kapısı: uygulama her açıldığında (link her tıklandığında) önce
 * ana sayfa / mod seçim ekranına ("/onboarding") gider - kullanıcı orada
 * mizah seviyesini (Efendi/Samimi/Kahvehane/Delirmiş Kızan) seçip
 * "Başlayalım" ile sohbete geçer. Daha önce tamamlanmış olması bir şeyi
 * değiştirmez; bu ekran kalıcı ana sayfa olarak kullanılıyor. Geçmiş
 * sohbetlere "Geçmiş" ekranından erişilir.
 */
export default function Index() {
  return <Redirect href="/onboarding" />;
}
