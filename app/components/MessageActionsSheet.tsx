import { Modal, Pressable, Share, StyleSheet, Text, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import type { ChatMessage } from "../types/chat";
import { colors, radius, spacing, typography } from "../lib/theme";

interface Props {
  message: ChatMessage | null;
  onClose: () => void;
}

export function MessageActionsSheet({ message, onClose }: Props) {
  const visible = message !== null;

  async function handleCopy() {
    if (!message) return;
    await Clipboard.setStringAsync(message.content);
    onClose();
  }

  async function handleShare() {
    if (!message) return;
    try {
      await Share.share({ message: message.content });
    } finally {
      onClose();
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title}>Mesaj</Text>
          <Pressable style={styles.action} onPress={handleCopy}>
            <Text style={styles.actionText}>Kopyala</Text>
          </Pressable>
          <Pressable style={styles.action} onPress={handleShare}>
            <Text style={styles.actionText}>Paylaş</Text>
          </Pressable>
          <Pressable style={[styles.action, styles.cancel]} onPress={onClose}>
            <Text style={[styles.actionText, styles.cancelText]}>Vazgeç</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.xs,
  },
  title: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  action: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
  },
  actionText: { ...typography.subtitle, color: colors.textPrimary },
  cancel: { marginTop: spacing.sm, backgroundColor: colors.surfaceAlt },
  cancelText: { color: colors.textSecondary },
});
