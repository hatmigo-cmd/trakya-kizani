import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatBubble } from "../../components/ChatBubble";
import { ChatInput } from "../../components/ChatInput";
import { MessageActionsSheet } from "../../components/MessageActionsSheet";
import { sendChatMessage, ApiError } from "../../lib/api";
import {
  generateId,
  getConversation,
  getDefaultHumorLevel,
  saveConversation,
} from "../../lib/storage";
import { speak, stopSpeaking } from "../../lib/speech";
import { colors, radius, spacing, typography } from "../../lib/theme";
import type { ChatMessage, Conversation, HumorLevel } from "../../types/chat";
import { HUMOR_LEVEL_INFO } from "../../types/chat";

function makeTitle(firstMessage: string): string {
  const trimmed = firstMessage.trim();
  return trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";

  const [conversationId, setConversationId] = useState<string | null>(
    isNew ? null : id
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [humorLevel, setHumorLevel] = useState<HumorLevel>(2);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [activeMessage, setActiveMessage] = useState<ChatMessage | null>(null);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    (async () => {
      if (isNew) {
        const level = await getDefaultHumorLevel();
        setHumorLevel(level);
        setMessages([]);
        setConversationId(null);
      } else {
        const conversation = await getConversation(id);
        if (conversation) {
          setMessages(conversation.messages);
          setHumorLevel(conversation.humorLevel);
          setConversationId(conversation.id);
        }
      }
      setInitializing(false);
    })();
  }, [id, isNew]);

  async function persist(nextMessages: ChatMessage[], level: HumorLevel) {
    const now = Date.now();
    const convId = conversationId ?? generateId();
    const firstUserMessage = nextMessages.find((m) => m.role === "user");
    const conversation: Conversation = {
      id: convId,
      title: firstUserMessage ? makeTitle(firstUserMessage.content) : "Yeni sohbet",
      humorLevel: level,
      messages: nextMessages,
      createdAt: now,
      updatedAt: now,
    };
    if (!conversationId) {
      setConversationId(convId);
      router.setParams({ id: convId });
    }
    await saveConversation(conversation);
  }

  async function handleSend(text: string) {
    setErrorText(null);
    stopSpeaking();
    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };
    const withUser = [...messages, userMessage];
    setMessages(withUser);
    setLoading(true);

    try {
      const result = await sendChatMessage({
        message: text,
        level: humorLevel,
        history: messages,
      });
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: result.reply,
        createdAt: Date.now(),
      };
      const withAssistant = [...withUser, assistantMessage];
      setMessages(withAssistant);
      if (!voiceMuted) speak(result.reply);
      await persist(withAssistant, humorLevel);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Beklenmeyen bir hata oldu.";
      setErrorText(message);
      await persist(withUser, humorLevel);
    } finally {
      setLoading(false);
    }
  }

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Trakya Kızanı</Text>
          <Text style={styles.headerSubtitle}>
            {HUMOR_LEVEL_INFO[humorLevel].title}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.headerButton}
            onPress={() => {
              if (!voiceMuted) stopSpeaking();
              setVoiceMuted((v) => !v);
            }}
          >
            <Text style={styles.headerButtonText}>{voiceMuted ? "🔇" : "🔊"}</Text>
          </Pressable>
          <Pressable style={styles.headerButton} onPress={() => router.push("/history")}>
            <Text style={styles.headerButtonText}>Geçmiş</Text>
          </Pressable>
          <Pressable
            style={styles.headerButton}
            onPress={() => router.push("/chat/new")}
          >
            <Text style={styles.headerButtonText}>Yeni</Text>
          </Pressable>
          <Pressable style={styles.headerButton} onPress={() => router.push("/settings")}>
            <Text style={styles.headerButtonText}>Ayarlar</Text>
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Ula naber beya?</Text>
            <Text style={styles.emptyBody}>
              Ne sorarsan sor, önce doğru cevap sonra muhabbet. Başla bakalım.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ChatBubble message={item} onLongPress={setActiveMessage} />
            )}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          />
        )}

        {loading && (
          <View style={styles.typingRow}>
            <ActivityIndicator color={colors.accent} size="small" />
            <Text style={styles.typingText}>Trakya Kızanı yazıyor…</Text>
          </View>
        )}

        {errorText && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorText}</Text>
          </View>
        )}

        <ChatInput onSend={handleSend} disabled={loading} />
      </KeyboardAvoidingView>

      <MessageActionsSheet message={activeMessage} onClose={() => setActiveMessage(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundElevated,
  },
  headerTitle: { ...typography.subtitle, color: colors.accent },
  headerSubtitle: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  headerActions: { flexDirection: "row", gap: spacing.xs },
  headerButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  headerButtonText: { ...typography.caption, color: colors.textSecondary },
  listContent: { padding: spacing.lg, flexGrow: 1 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
  },
  emptyTitle: { ...typography.title, color: colors.textPrimary },
  emptyBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  typingText: { ...typography.caption, color: colors.textMuted },
  errorBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.danger,
  },
  errorText: { ...typography.caption, color: colors.textPrimary },
});
