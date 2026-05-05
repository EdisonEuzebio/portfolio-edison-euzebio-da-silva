import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { JitsiMeetView } from '@/components/jitsi-meet-view';
import { useTraining } from '@/lib/training-context';
import { useWebSocketSync } from '@/hooks/use-websocket-sync';
import { cn } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

export default function TrainingScreen() {
  const router = useRouter();
  const { state, startTimer, pauseTimer, tickTimer, incrementReps, decrementReps, nextActivity } = useTraining();
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const [showJitsi, setShowJitsi] = useState(true);
  const [useWebSocket, setUseWebSocket] = useState(true);

  // WebSocket sync
  const wsSync = useWebSocketSync({
    roomId: state.session?.roomId || 'default',
    userId: 'user-' + Date.now(),
    displayName: state.session?.userName || 'Participante',
    isInstructor: state.session?.userRole === 'instructor',
    serverUrl: 'http://localhost:3000', // Ajustar conforme necessário
  });

  // Sincronizar com WebSocket se conectado
  useEffect(() => {
    if (useWebSocket && wsSync.isConnected) {
      // Usar estado do WebSocket
      if (wsSync.state.timerSeconds !== state.timer.seconds) {
        // Atualizar estado local com valores do servidor
        console.log('[Training] Sincronizando com WebSocket:', wsSync.state);
      }
    }
  }, [wsSync.state, useWebSocket, wsSync.isConnected, state.timer.seconds]);

  // Timer effect
  useEffect(() => {
    if (state.timer.isRunning) {
      const interval = setInterval(() => {
        tickTimer();
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  }, [state.timer.isRunning, tickTimer]);

  const handleToggleTimer = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (state.timer.isRunning) {
      pauseTimer();
      if (useWebSocket && state.session?.userRole === 'instructor') {
        wsSync.pauseTimer();
      }
    } else {
      startTimer();
      if (useWebSocket && state.session?.userRole === 'instructor') {
        wsSync.startTimer();
      }
    }
  };

  const handleIncrementReps = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    incrementReps();
    if (useWebSocket && state.session?.userRole === 'instructor') {
      wsSync.updateReps(state.currentReps + 1);
    }
  };

  const handleDecrementReps = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    decrementReps();
    if (useWebSocket && state.session?.userRole === 'instructor') {
      wsSync.updateReps(Math.max(0, state.currentReps - 1));
    }
  };

  const handleNextActivity = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    nextActivity();
  };

  const handleExitTraining = () => {
    Alert.alert(
      'Sair do Treino',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Sair',
          onPress: () => {
            router.push('/(tabs)' as any);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const formatTime = (hours: number, minutes: number, seconds: number) => {
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  if (!state.session) {
    return (
      <ScreenContainer className="bg-background justify-center items-center">
        <Text className="text-foreground text-lg">Carregando...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background" edges={['top', 'left', 'right', 'bottom']}>
      <View className="flex-1 gap-0 flex-col">
        {/* Jitsi Meet Video Area - 60% */}
        <View className="flex-[0.6] bg-black rounded-t-3xl overflow-hidden shadow-lg">
          {showJitsi ? (
            <JitsiMeetView
              roomId={state.session.roomId}
              displayName={state.session.userName}
              onConferenceJoined={() => {
                console.log('Conferência iniciada');
              }}
              onConferenceLeft={() => {
                console.log('Conferência finalizada');
              }}
              onError={(error) => {
                Alert.alert('Erro', `Erro na conferência: ${error.message}`);
              }}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <View className="items-center gap-2">
                <Text className="text-6xl">📹</Text>
                <Text className="text-background text-sm">Jitsi Meet Video</Text>
              </View>
            </View>
          )}
        </View>

        {/* Controls Panel - 40% */}
        <View className="flex-[0.4] bg-surface rounded-b-3xl border-2 border-t-0 border-border p-4 gap-3 overflow-y-auto">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-bold text-foreground">
                {state.session.userName}
              </Text>
              <Text className="text-xs text-muted">
                {state.session.userRole === 'instructor' ? '👨‍🏫 Instrutor' : '👤 Aluno'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleExitTraining}
              className="bg-error rounded-full p-2"
            >
              <Text className="text-background text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Timer and Reps Display */}
          <View className="flex-row gap-2">
            {/* Timer */}
            <View className="flex-1 bg-background rounded-lg p-2 items-center border border-border">
              <Text className="text-muted text-xs font-semibold">Cronômetro</Text>
              <Text className="text-2xl font-bold text-primary font-mono">
                {formatTime(state.timer.hours, state.timer.minutes, state.timer.seconds)}
              </Text>
            </View>

            {/* Reps */}
            <View className="flex-1 bg-background rounded-lg p-2 items-center border border-border">
              <Text className="text-muted text-xs font-semibold">Reps</Text>
              <Text className="text-2xl font-bold text-primary">
                {state.currentReps}
              </Text>
            </View>
          </View>

          {/* Timer Controls */}
          <TouchableOpacity
            onPress={handleToggleTimer}
            className="bg-primary rounded-lg py-2 items-center justify-center"
          >
            <Text className="text-background font-bold text-sm">
              {state.timer.isRunning ? '⏸' : '▶'} {state.timer.isRunning ? 'Pausar' : 'Iniciar'}
            </Text>
          </TouchableOpacity>

          {/* Reps Controls */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleDecrementReps}
              className="flex-1 bg-background border-2 border-primary rounded-lg py-2 items-center justify-center"
            >
              <Text className="text-primary font-bold text-xl">−</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleIncrementReps}
              className="flex-1 bg-primary rounded-lg py-2 items-center justify-center"
            >
              <Text className="text-background font-bold text-xl">+</Text>
            </TouchableOpacity>
          </View>

          {/* Next Activity Button */}
          <TouchableOpacity
            onPress={handleNextActivity}
            className="bg-success rounded-lg py-2 items-center justify-center"
          >
            <Text className="text-background font-bold text-sm">
              ✓ Próxima
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
