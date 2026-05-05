import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useTraining, ParticipantRole } from '@/lib/training-context';
import { cn } from '@/lib/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCameraPermissions } from '@/hooks/use-camera-permissions';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const router = useRouter();
  const { setSession } = useTraining();
  const { permissions, loading, error, requestPermissions, allGranted } = useCameraPermissions();
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [role, setRole] = useState<ParticipantRole>('student');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const saved = await AsyncStorage.getItem('fitness-jitsi-user');
      if (saved) {
        const data = JSON.parse(saved);
        setUserName(data.userName || '');
        setRoomId(data.roomId || '');
        setRole(data.userRole || 'student');
      }
    } catch (err) {
      console.error('Error loading saved data:', err);
    }
  };

  const handleJoinTraining = async () => {
    if (!userName.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu nome');
      return;
    }

    if (!roomId.trim()) {
      Alert.alert('Erro', 'Por favor, insira o ID da sala');
      return;
    }

    if (!allGranted) {
      Alert.alert(
        'Permissões Necessárias',
        'Câmera e microfone são necessários. Deseja solicitar permissões novamente?',
        [
          { text: 'Cancelar', onPress: () => {} },
          {
            text: 'Solicitar',
            onPress: async () => {
              await requestPermissions();
            },
          },
        ]
      );
      return;
    }

    try {
      setIsLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Save user data locally
      await AsyncStorage.setItem('fitness-jitsi-user', JSON.stringify({ userName, roomId, userRole: role }));

      // Set session in context
      setSession({
        roomId: roomId.trim(),
        userName: userName.trim(),
        userRole: role,
      });

      // Navigate to activities screen
      router.push('/(tabs)/activities' as any);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao conectar. Tente novamente.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header */}
          <View className="mb-8 items-center gap-3">
            <Text className="text-6xl">💪</Text>
            <Text className="text-3xl font-bold text-foreground">
              Fitness Jitsi
            </Text>
            <Text className="text-sm text-muted text-center">
              Treinos personalizados com videoconferência
            </Text>
          </View>

          {/* Permission Status */}
          {!loading && (
            <View className={`rounded-lg p-4 border mb-6 ${allGranted ? 'bg-success/10 border-success' : 'bg-error/10 border-error'}`}>
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">{allGranted ? '✓' : '⚠'}</Text>
                <View className="flex-1">
                  <Text className={`font-semibold ${allGranted ? 'text-success' : 'text-error'}`}>
                    {allGranted ? 'Permissões Concedidas' : 'Permissões Necessárias'}
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    {allGranted
                      ? 'Câmera e microfone habilitados'
                      : 'Câmera e microfone são necessários para usar o app'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Form */}
          <View className="gap-6">
            {/* Name Input */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">
                Seu Nome
              </Text>
              <TextInput
                placeholder="Digite seu nome"
                value={userName}
                onChangeText={setUserName}
                placeholderTextColor="#687076"
                editable={!isLoading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Room ID Input */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">
                ID da Sala
              </Text>
              <TextInput
                placeholder="Digite o ID da sala"
                value={roomId}
                onChangeText={setRoomId}
                placeholderTextColor="#687076"
                editable={!isLoading}
                className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              />
            </View>

            {/* Role Selection */}
            <View>
              <Text className="text-sm font-semibold text-foreground mb-3">
                Tipo de Participante
              </Text>
              <View className="flex-row gap-3">
                {/* Instructor Button */}
                <TouchableOpacity
              onPress={() => {
                setRole('instructor');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              disabled={isLoading}
                  className={cn(
                    'flex-1 rounded-lg py-3 px-4 border-2 items-center justify-center',
                    role === 'instructor'
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'font-semibold',
                      role === 'instructor'
                        ? 'text-background'
                        : 'text-foreground'
                    )}
                  >
                    Instrutor
                  </Text>
                </TouchableOpacity>

                {/* Student Button */}
                <TouchableOpacity
              onPress={() => {
                setRole('student');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              disabled={isLoading}
                  className={cn(
                    'flex-1 rounded-lg py-3 px-4 border-2 items-center justify-center',
                    role === 'student'
                      ? 'bg-primary border-primary'
                      : 'bg-surface border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'font-semibold',
                      role === 'student'
                        ? 'text-background'
                        : 'text-foreground'
                    )}
                  >
                    Aluno
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Join Button */}
            <TouchableOpacity
              onPress={handleJoinTraining}
              disabled={isLoading || !allGranted}
              className={cn(
                'rounded-lg py-4 px-6 items-center justify-center mt-4',
                isLoading || !allGranted ? 'bg-muted opacity-50' : 'bg-primary'
              )}
            >
              <Text className="text-background font-bold text-base">
                {isLoading ? 'Conectando...' : 'Começar Treino'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View className="mt-12 bg-surface rounded-lg p-4 border border-border">
            <Text className="text-xs text-muted leading-relaxed">
              <Text className="font-semibold">Instrutor:</Text> Controla o cronômetro e contador de repetições.{'\n\n'}
              <Text className="font-semibold">Aluno:</Text> Visualiza o treino em tempo real.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
