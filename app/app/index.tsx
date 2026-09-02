import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { isOnboardingDone } from "../lib/storage";
import { colors } from "../lib/theme";

/**
 * Giriş kapısı: onboarding tamamlanmadıysa onboarding'e, tamamlandıysa
 * doğrudan yeni bir sohbete yönlendirir. Geçmiş sohbetlere "Geçmiş"
 * ekranından erişilir.
 */
export default function Index() {
  const [ready, setReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    isOnboardingDone().then((done) => {
      setNeedsOnboarding(!done);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return <Redirect href={needsOnboarding ? "/onboarding" : "/chat/new"} />;
}
