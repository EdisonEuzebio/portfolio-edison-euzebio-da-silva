import { ScrollView, Text, View, TouchableOpacity, Alert, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useTraining } from '@/lib/training-context';
import { cn } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

export default function SetupCallScreen() {
  const router = useRouter();
  const { state } = useTraining();
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!state.session) {
    return (
      <ScreenContainer className="bg-background justify-center items-center">
        <Text className="text-foreground text-lg">Carregando...</Text>
      </ScreenContainer>
    );
  }

  const handleStartTraining = async () => {
    try {
      setIsLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Navigate to training screen
      router.push('/(tabs)/training' as any);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao iniciar o treino. Tente novamente.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-between px-6 py-8">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground mb-2">
              Configurar Chamada
            </Text>
            <Text className="text-base text-muted">
              {state.session.userName} • {state.session.userRole === 'instructor' ? 'Instrutor' : 'Aluno'}
            </Text>
          </View>

          {/* Camera Preview Placeholder */}
          <View className="my-8">
            <View className="bg-surface rounded-2xl aspect-video border-2 border-border items-center justify-center overflow-hidden">
              <View className="items-center gap-2">
                <Text className="text-4xl">📹</Text>
                <Text className="text-muted text-sm">Pré-visualização de câmera</Text>
              </View>
            </View>
          </View>

          {/* Settings */}
          <View className="gap-4">
            {/* Camera Toggle */}
            <View className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-1 gap-1">
                <Text className="text-foreground font-semibold">Câmera</Text>
                <Text className="text-muted text-sm">
                  {cameraEnabled ? 'Ativada' : 'Desativada'}
                </Text>
              </View>
              <Switch
                value={cameraEnabled}
                onValueChange={setCameraEnabled}
                trackColor={{ false: '#E5E7EB', true: '#0a7ea4' }}
                thumbColor={cameraEnabled ? '#ffffff' : '#f5f5f5'}
              />
            </View>

            {/* Audio Toggle */}
            <View className="bg-surface rounded-lg p-4 border border-border flex-row items-center justify-between">
              <View className="flex-1 gap-1">
                <Text className="text-foreground font-semibold">Microfone</Text>
                <Text className="text-muted text-sm">
                  {audioEnabled ? 'Ativado' : 'Desativado'}
                </Text>
              </View>
              <Switch
                value={audioEnabled}
                onValueChange={setAudioEnabled}
                trackColor={{ false: '#E5E7EB', true: '#0a7ea4' }}
                thumbColor={audioEnabled ? '#ffffff' : '#f5f5f5'}
              />
            </View>

            {/* Room Info */}
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-foreground font-semibold mb-2">Sala</Text>
              <Text className="text-muted text-sm font-mono">
                {state.session.roomId}
              </Text>
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            onPress={handleStartTraining}
            disabled={isLoading}
            className={cn(
              'rounded-lg py-4 px-6 items-center justify-center mt-8',
              isLoading ? 'bg-primary opacity-60' : 'bg-primary'
            )}
          >
            <Text className="text-background font-bold text-base">
              {isLoading ? 'Iniciando...' : 'Iniciar Treino'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
