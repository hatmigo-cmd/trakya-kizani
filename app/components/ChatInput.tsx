import { useRef, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing } from "../lib/theme";
import { stopSpeaking } from "../lib/speech";

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  }

  // Web'de Enter ile gönder, Shift+Enter ile yeni satıra geç.
  function handleKeyPress(e: any) {
    if (Platform.OS !== "web") return;
    const nativeEvent = e.nativeEvent ?? {};
    if (nativeEvent.key === "Enter" && !nativeEvent.shiftKey) {
      e.preventDefault?.();
      handleSend();
    }
  }

  // Sesle soru sorma (STT). Şu an sadece web'de (tarayıcının kendi
  // SpeechRecognition API'si üzerinden) çalışıyor - native (iOS/Android)
  // tarafı ekstra bir native build/config plugin gerektirdiği için henüz
  // eklenmedi, orada kullanıcıya bilgilendirme gösteriyoruz.
  function toggleMic() {
    if (Platform.OS !== "web") {
      Alert.alert(
        "Mikrofon",
        "Sesle soru sorma şu an sadece web (tarayıcı) sürümünde çalışıyor. Mobil desteği yakında ekleniyor."
      );
      return;
    }

    const g: any = globalThis as any;
    const SpeechRecognitionCtor =
      g.window?.SpeechRecognition || g.window?.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      Alert.alert("Mikrofon", "Bu tarayıcı sesle yazmayı desteklemiyor.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    stopSpeaking();

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "tr-TR";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalText += event.results[i][0].transcript;
      }
      setText(finalText);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={toggleMic}
        disabled={disabled}
        style={[styles.micButton, listening && styles.micButtonActive]}
      >
        <Text style={styles.micButtonText}>{listening ? "⏹" : "🎤"}</Text>
      </Pressable>
      <TextInput
        value={text}
        onChangeText={setText}
        onKeyPress={handleKeyPress}
        placeholder={listening ? "Dinliyorum..." : "Ne soracaksın beya?"}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        multiline
        editable={!disabled}
      />
      <Pressable
        onPress={handleSend}
        disabled={disabled || text.trim().length === 0}
        style={[
          styles.sendButton,
          (disabled || text.trim().length === 0) && styles.sendButtonDisabled,
        ]}
      >
        <Text style={styles.sendButtonText}>Gönder</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.backgroundElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    maxHeight: 120,
    fontSize: 15,
  },
  micButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  micButtonActive: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  micButtonText: { fontSize: 16 },
  sendButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  sendButtonDisabled: { opacity: 0.4 },
  sendButtonText: { color: colors.bubbleUserText, fontWeight: "700" },
});
