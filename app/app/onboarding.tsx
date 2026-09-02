import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HumorLevelPicker } from "../components/HumorLevelPicker";
import { NazarIcon, SunflowerIcon } from "../components/icons/TrakyaIcons";
import { getDefaultHumorLevel, setDefaultHumorLevel, setOnboardingDone } from "../lib/storage";
import { folk, radius, spacing, typography } from "../lib/theme";
import type { HumorLevel } from "../types/chat";

const mascotPhoto = require("../assets/images/mascot-hero.jpg");

export default function Onboarding() {
  const [level, setLevel] = useState<HumorLevel>(2);

  // Daha önce bir seviye seçilmişse (bu ekran artık her girişte gösterildiği
  // için) o seviye seçili gelsin, kullanıcı her seferinde 2'den başlamasın.
  useEffect(() => {
    getDefaultHumorLevel().then(setLevel);
  }, []);

  async function handleStart() {
    await setDefaultHumorLevel(level);
    await setOnboardingDone();
    router.replace("/chat/new");
  }

  return (
    <LinearGradient colors={[folk.bg900, folk.bg800]} style={styles.gradient}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.topRow}>
            <NazarIcon size={28} />
            <View style={styles.brandTag}>
              <Text style={styles.brandTagText}>TRAKYA KIZANI</Text>
            </View>
            <SunflowerIcon size={30} />
          </View>

          <View style={styles.heroCard}>
            <Image source={mascotPhoto} style={styles.mascotPhoto} />
            <Text style={styles.brand}>Trakya Kızanı</Text>
            <View style={styles.taglineBadge}>
              <Text style={styles.tagline}>Önce doğru cevap, sonra Trakyalılaştır!</Text>
            </View>
            <Text style={styles.body}>
              Ne sorarsan sor, önce sağlam ve doğru bir cevap alırsın. Üstüne de
              Trakya şivesi, muhabbeti ve hazırcevaplığı eklenir - resmi bir
              asistan değil, laf sokan ama seni gerçekten dinleyen bir kızan
              gibi.
            </Text>
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionRule} />
            <Text style={styles.sectionTitle}>Mizah seviyeni seç</Text>
            <View style={styles.sectionRule} />
          </View>
          <Text style={styles.sectionHint}>
            İstediğin zaman ayarlardan değiştirebilirsin.
          </Text>
          <HumorLevelPicker value={level} onChange={setLevel} />

          <Text style={styles.footNote}>Hoş geldin gardaş, kolay gelsin!</Text>
        </ScrollView>

        <Pressable style={styles.cta} onPress={handleStart}>
          <Text style={styles.ctaText}>Başlayalım, Kızan'a Sor</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, backgroundColor: "transparent" },
  content: { padding: spacing.xl, paddingBottom: spacing.xxl },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandTag: {
    borderWidth: 2,
    borderColor: folk.panelLine,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: folk.panel,
  },
  brandTagText: {
    color: folk.gold,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
  heroCard: {
    backgroundColor: folk.panel,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: folk.panelLine,
  },
  mascotPhoto: {
    width: 148,
    height: 168,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: "rgba(244,183,64,0.4)",
  },
  brand: {
    ...typography.title,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 1,
    color: folk.heading,
    marginTop: spacing.md,
  },
  taglineBadge: {
    backgroundColor: folk.bordo,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },
  tagline: {
    ...typography.caption,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  body: {
    ...typography.body,
    color: folk.textSoft,
    marginTop: spacing.md,
    lineHeight: 22,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
  sectionRule: { flex: 1, height: 1, backgroundColor: folk.panelLine },
  sectionTitle: {
    ...typography.subtitle,
    color: folk.gold,
    letterSpacing: 0.5,
  },
  sectionHint: {
    ...typography.caption,
    color: folk.textSoft,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  footNote: {
    ...typography.caption,
    color: folk.textSoft,
    textAlign: "center",
    marginTop: spacing.xl,
    fontStyle: "italic",
  },
  cta: {
    backgroundColor: folk.bordo,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: "center",
    borderWidth: 2,
    borderColor: folk.bordoDeep,
  },
  ctaText: { ...typography.subtitle, fontWeight: "800", color: "#FFFFFF" },
});
