import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteConversation, getConversations } from "../lib/storage";
import { colors, radius, spacing, typography } from "../lib/theme";
import type { Conversation } from "../types/chat";
import { HUMOR_LEVEL_INFO } from "../types/chat";

function formatDate(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function History() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useFocusEffect(
    useCallback(() => {
      getConversations().then(setConversations);
    }, [])
  );

  async function handleDelete(id: string) {
    await deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sohbet Geçmişi</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.closeText}>Kapat</Text>
        </Pressable>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Henüz bir sohbetin yok. Yeni sohbete başla.</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => {
                router.replace(`/chat/${item.id}`);
              }}
            >
              <View style={styles.rowText}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {item.title || "Sohbet"}
                </Text>
                <Text style={styles.rowMeta}>
                  {HUMOR_LEVEL_INFO[item.humorLevel].title} · {formatDate(item.updatedAt)}
                </Text>
              </View>
              <Pressable
                hitSlop={8}
                onPress={() => handleDelete(item.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Sil</Text>
              </Pressable>
            </Pressable>
          )}
        />
      )}
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
  listContent: { padding: spacing.lg, gap: spacing.sm },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowText: { flex: 1, marginRight: spacing.sm },
  rowTitle: { ...typography.subtitle, color: colors.textPrimary },
  rowMeta: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  deleteButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
  },
  deleteButtonText: { ...typography.caption, color: colors.danger },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: "center" },
});
