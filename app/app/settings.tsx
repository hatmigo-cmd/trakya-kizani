import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HumorLevelPicker } from "../components/HumorLevelPicker";
import { getDefaultHumorLevel, setDefaultHumorLevel } from "../lib/storage";
import { colors, radius, spacing, typography } from "../lib/theme";
import type { HumorLevel } from "../types/chat";

export default function Settings() {
  const [level, setLevel] = useState<HumorLevel>(2);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getDefaultHumorLevel().then((l) => {
      setLevel(l);
      setLoaded(true);
    });
  }, []);

  async function handleChange(newLevel: HumorLevel) {
    setLevel(newLevel);
    await setDefaultHumorLevel(newLevel);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.closeText}>Kapat</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Mizah Seviyesi</Text>
        <Text style={styles.sectionHint}>
          Yeni başlattığın sohbetlerde bu seviye kullanılır.
        </Text>
        {loaded && <HumorLevelPicker value={level} onChange={handleChange} />}

        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Sesli Sohbet</Text>
        <View style={styles.futureCard}>
          <Text style={styles.futureTitle}>Kızan artık dilinden düşmüyor! 🎤🔊</Text>
          <Text style={styles.futureBody}>
            Sesli sohbet açık: sohbet ekranındaki mikrofona bas, derdini
            konuşarak anlat - cevaplar da otomatik sesli okunur. Sesi
            kısmak istersen üstteki hoparlör ikonuna, bir cevabı tekrar
            dinlemek istersen o mesaj balonuna dokun.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Hakkında</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>Trakya Kızanı · v0.1.0 (MVP)</Text>
          <Text style={styles.aboutText}>Önce doğru cevap, sonra Trakyalılaştır.</Text>
        </View>

        <View style={styles.brandFooter}>
          <Text style={styles.brandFooterTitle}>A HATMIGO PRODUCT</Text>
          <Text style={styles.brandFooterText}>Designed & Developed by Hatmigo</Text>
          <Text style={styles.brandFooterText}>Istanbul, Türkiye · © 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { ...typography.title, color: colors.textPrimary },
  closeText: { ...typography.body, color: colors.accent },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  sectionTitle: { ...typography.subtitle, color: colors.textPrimary },
  sectionHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  sectionSpacing: { marginTop: spacing.xxl },
  futureCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  futureTitle: { ...typography.subtitle, color: colors.wine },
  futureBody: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  aboutCard: { marginTop: spacing.sm, gap: spacing.xs },
  aboutText: { ...typography.caption, color: colors.textMuted },
  brandFooter: {
    marginTop: spacing.xxl,
    alignItems: "center",
    gap: 2,
  },
  brandFooterTitle: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: "700",
    letterSpacing: 1,
  },
  brandFooterText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
});