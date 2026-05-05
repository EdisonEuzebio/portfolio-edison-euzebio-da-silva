import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketSyncState {
  timerSeconds: number;
  isRunning: boolean;
  reps: number;
  currentActivity: string;
  participants: Array<{
    userId: string;
    displayName: string;
    isInstructor: boolean;
  }>;
}

interface UseWebSocketSyncOptions {
  roomId: string;
  userId: string;
  displayName: string;
  isInstructor: boolean;
  serverUrl?: string;
}

export function useWebSocketSync(options: UseWebSocketSyncOptions) {
  const {
    roomId,
    userId,
    displayName,
    isInstructor,
    serverUrl = 'http://localhost:3000',
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<WebSocketSyncState>({
    timerSeconds: 0,
    isRunning: false,
    reps: 0,
    currentActivity: '',
    participants: [],
  });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Conectar ao WebSocket
  useEffect(() => {
    try {
      const socket = io(serverUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
      });

      socketRef.current = socket;

      // Eventos de conexão
      socket.on('connect', () => {
        console.log('[WebSocket] Conectado ao servidor');
        setIsConnected(true);
        setError(null);

        // Entrar na sala de treino
        socket.emit('join-training', {
          roomId,
          userId,
          displayName,
          isInstructor,
        });
      });

      socket.on('disconnect', () => {
        console.log('[WebSocket] Desconectado do servidor');
        setIsConnected(false);
      });

      socket.on('connect_error', (error: any) => {
        console.error('[WebSocket] Erro de conexão:', error);
        setError('Erro ao conectar ao servidor WebSocket');
      });

      // Eventos de estado de treino
      socket.on('training-state', (data: WebSocketSyncState) => {
        console.log('[WebSocket] Estado de treino recebido:', data);
        setState(data);
      });

      socket.on('timer-update', (data: any) => {
        setState((prev) => ({
          ...prev,
          timerSeconds: data.timerSeconds,
          isRunning: data.isRunning,
          reps: data.reps,
          currentActivity: data.currentActivity,
        }));
      });

      socket.on('timer-started', (data: any) => {
        setState((prev) => ({
          ...prev,
          isRunning: true,
          timerSeconds: data.timerSeconds,
        }));
      });

      socket.on('timer-paused', (data: any) => {
        setState((prev) => ({
          ...prev,
          isRunning: false,
          timerSeconds: data.timerSeconds,
        }));
      });

      socket.on('timer-reset', (data: any) => {
        setState((prev) => ({
          ...prev,
          isRunning: false,
          timerSeconds: 0,
        }));
      });

      socket.on('reps-updated', (data: any) => {
        setState((prev) => ({
          ...prev,
          reps: data.reps,
        }));
      });

      socket.on('activity-changed', (data: any) => {
        setState((prev) => ({
          ...prev,
          currentActivity: data.activity,
          timerSeconds: 0,
          reps: 0,
          isRunning: false,
        }));
      });

      socket.on('participant-joined', (data: any) => {
        console.log('[WebSocket] Participante entrou:', data);
        setState((prev) => ({
          ...prev,
          participants: [
            ...prev.participants,
            {
              userId: data.userId,
              displayName: data.displayName,
              isInstructor: data.isInstructor,
            },
          ],
        }));
      });

      socket.on('participant-left', (data: any) => {
        console.log('[WebSocket] Participante saiu:', data);
        setState((prev) => ({
          ...prev,
          participants: prev.participants.filter((p) => p.userId !== data.userId),
        }));
      });

      return () => {
        // Sair da sala ao desmontar
        socket.emit('leave-training', { roomId, userId });
        socket.disconnect();
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('[WebSocket] Erro ao conectar:', err);
      setError(errorMessage);
    }
  }, [roomId, userId, displayName, isInstructor, serverUrl]);

  // Funções para controlar o timer
  const startTimer = useCallback(() => {
    if (socketRef.current && isInstructor) {
      socketRef.current.emit('start-timer', { roomId });
    }
  }, [roomId, isInstructor]);

  const pauseTimer = useCallback(() => {
    if (socketRef.current && isInstructor) {
      socketRef.current.emit('pause-timer', { roomId });
    }
  }, [roomId, isInstructor]);

  const resetTimer = useCallback(() => {
    if (socketRef.current && isInstructor) {
      socketRef.current.emit('reset-timer', { roomId });
    }
  }, [roomId, isInstructor]);

  // Funções para atualizar reps e atividade
  const updateReps = useCallback(
    (reps: number) => {
      if (socketRef.current && isInstructor) {
        socketRef.current.emit('update-reps', { roomId, reps });
      }
    },
    [roomId, isInstructor]
  );

  const updateActivity = useCallback(
    (activity: string) => {
      if (socketRef.current && isInstructor) {
        socketRef.current.emit('update-activity', { roomId, activity });
      }
    },
    [roomId, isInstructor]
  );

  return {
    state,
    isConnected,
    error,
    startTimer,
    pauseTimer,
    resetTimer,
    updateReps,
    updateActivity,
  };
}
