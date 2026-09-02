/**
 * Trakya Kızanı - tasarım dili.
 *
 * Sohbet ekranları hâlâ sade/koyu bir zeminde çalışıyor (aşağıdaki `colors`).
 * Açılış/tanıtım yüzeyleri (onboarding, mizah seviyesi seçici) ve web
 * tanıtım sayfası aynı `folk` paletini paylaşıyor - koyu/ahşap kahvehane
 * zemini + bordo/turkuaz/mor/altın canlı vurgular + gerçek maskot fotoğrafı
 * (bkz. assets/images/mascot-hero.jpg). Bu palet web tanıtım sayfasındaki
 * (Claude Design canvas) CSS token'larıyla birebir eşleşecek şekilde
 * tutuluyor ki mobil ve web aynı marka kimliğini yansıtsın.
 */

export const colors = {
  background: "#0F1115",
  backgroundElevated: "#171A21",
  surface: "#1D2029",
  surfaceAlt: "#242835",
  border: "#2B2F3A",

  textPrimary: "#F5F6F8",
  textSecondary: "#A7ACB9",
  textMuted: "#6E7381",

  accent: "#F2B33D", // amber / ayçiçeği
  accentMuted: "#4A3B1E",
  wine: "#8C3A4B", // bağ kültürü, laf sokma vurgusu
  success: "#4CAF7D",
  danger: "#E0555C",

  bubbleUser: "#F2B33D",
  bubbleUserText: "#1A1300",
  bubbleAssistant: "#1D2029",
  bubbleAssistantText: "#F5F6F8",
};

/** Açılış/tanıtım yüzeyleri için koyu/ahşap kahvehane zemini + canlı vurgular. */
export const folk = {
  bg900: "#1B140F", // en koyu zemin
  bg800: "#241A12", // ikincil zemin / gradient durağı
  panel: "#2B2016", // kart zemini (koyu panel)
  panelLine: "rgba(244,183,64,0.18)", // panel kenarlığı, ince altın çizgi
  heading: "#F5EBD8", // başlık metni (krem, koyu zeminde okunur)
  text: "#EDE1CC", // gövde metni
  textSoft: "#C4B79D", // ikincil/soluk metin
  ink: "#241A12", // açık (tint) zeminler üzerinde koyu metin
  bordo: "#D41B5C", // ana marka vurgusu / CTA
  bordoDeep: "#A8134A",
  turq: "#12C7C0",
  purple: "#7C4DFF",
  gold: "#F4B740", // ayçiçeği / vurgu detayları
};

/** Her mizah seviyesine özgü kimlik rengi (kartlar, ikonlar, rozetler) - web tanıtım sayfasıyla birebir aynı. */
export const levelColors: Record<1 | 2 | 3 | 4, { base: string; deep: string; tint: string }> = {
  1: { base: "#12C7C0", deep: "#0B9A94", tint: "#E3FBFA" }, // Efendi - turkuaz
  2: { base: "#FF6FA0", deep: "#C24A76", tint: "#FFEBF2" }, // Samimi - pembe
  3: { base: "#7C4DFF", deep: "#5B32C9", tint: "#F0EBFF" }, // Kahvehane Modu - mor
  4: { base: "#D41B5C", deep: "#A8134A", tint: "#FDE7EE" }, // Delirmiş Kızan - bordo
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

export const typography = {
  title: { fontSize: 24, fontWeight: "700" as const },
  subtitle: { fontSize: 16, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  caption: { fontSize: 12, fontWeight: "500" as const },
};
