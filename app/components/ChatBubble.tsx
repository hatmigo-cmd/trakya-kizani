import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ChatMessage } from "../types/chat";
import { colors, radius, spacing, typography } from "../lib/theme";
import { speak } from "../lib/speech";

interface Props {
  message: ChatMessage;
  onLongPress: (message: ChatMessage) => void;
}

export function ChatBubble({ message, onLongPress }: Props) {
  const isUser = message.role === "user";
  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      <Pressable
        onPress={!isUser ? () => speak(message.content) : undefined}
        onLongPress={() => onLongPress(message)}
        delayLongPress={250}
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAssistant,
        ]}
      >
        <Text style={isUser ? styles.textUser : styles.textAssistant}>
          {message.content}
        </Text>
        {!isUser && <Text style={styles.speakerHint}>🔊 dinlemek için dokun</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { width: "100%", marginVertical: spacing.xs, flexDirection: "row" },
  rowUser: { justifyContent: "flex-end" },
  rowAssistant: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.lg,
  },
  bubbleUser: {
    backgroundColor: colors.bubbleUser,
    borderBottomRightRadius: radius.sm,
  },
  bubbleAssistant: {
    backgroundColor: colors.bubbleAssistant,
    borderBottomLeftRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textUser: { ...typography.body, color: colors.bubbleUserText },
  textAssistant: { ...typography.body, color: colors.bubbleAssistantText },
  speakerHint: {
    marginTop: 4,
    fontSize: 11,
    color: colors.textMuted,
  },
});
