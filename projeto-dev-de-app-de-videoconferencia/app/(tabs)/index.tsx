import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

/**
 * Home Screen - Fitness Jitsi App
 */
export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center gap-8">
          {/* Hero Section */}
          <View className="items-center gap-4">
            <Text className="text-5xl">💪</Text>
            <Text className="text-4xl font-bold text-foreground text-center">
              Fitness Jitsi
            </Text>
            <Text className="text-base text-muted text-center">
              Treinos personalizados com videoconferência em tempo real
            </Text>
          </View>

          {/* Features */}
          <View className="gap-3">
            <View className="bg-surface rounded-lg p-4 border border-border flex-row gap-3">
              <Text className="text-2xl">📹</Text>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Videoconferência</Text>
                <Text className="text-sm text-muted">Integração com Jitsi Meet</Text>
              </View>
            </View>

            <View className="bg-surface rounded-lg p-4 border border-border flex-row gap-3">
              <Text className="text-2xl">⏱️</Text>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Cronômetro Sincronizado</Text>
                <Text className="text-sm text-muted">Tempo real para todos</Text>
              </View>
            </View>

            <View className="bg-surface rounded-lg p-4 border border-border flex-row gap-3">
              <Text className="text-2xl">🔄</Text>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Contador de Repetições</Text>
                <Text className="text-sm text-muted">Acompanhamento em tempo real</Text>
              </View>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={() => router.push("/login" as any)}
            className="bg-primary rounded-lg py-4 px-6 items-center justify-center"
          >
            <Text className="text-background font-bold text-base">
              Começar Treino
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
