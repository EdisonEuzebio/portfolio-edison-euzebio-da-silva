import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

interface TrainingSession {
  roomId: string;
  instructorId: string;
  timerSeconds: number;
  isRunning: boolean;
  reps: number;
  currentActivity: string;
  participants: Map<string, ParticipantData>;
}

interface ParticipantData {
  userId: string;
  displayName: string;
  isInstructor: boolean;
  joinedAt: number;
}

interface TimerUpdate {
  roomId: string;
  seconds: number;
  isRunning: boolean;
  reps: number;
  currentActivity: string;
  timestamp: number;
}

class WebSocketManager {
  private io: SocketIOServer;
  private sessions: Map<string, TrainingSession> = new Map();
  private timerIntervals: Map<string, any> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: any) => {
      console.log(`[WebSocket] Cliente conectado: ${socket.id}`);

      // Usuário entra em uma sala de treino
      socket.on('join-training', (data: {
        roomId: string;
        userId: string;
        displayName: string;
        isInstructor: boolean;
      }) => {
        const { roomId, userId, displayName, isInstructor } = data;

        // Entrar na sala Socket.io
        socket.join(roomId);

        // Criar ou obter sessão
        if (!this.sessions.has(roomId)) {
          this.sessions.set(roomId, {
            roomId,
            instructorId: isInstructor ? userId : '',
            timerSeconds: 0,
            isRunning: false,
            reps: 0,
            currentActivity: '',
            participants: new Map(),
          });
        }

        const session = this.sessions.get(roomId)!;
        session.participants.set(userId, {
          userId,
          displayName,
          isInstructor,
          joinedAt: Date.now(),
        });

        // Notificar outros participantes
        this.io.to(roomId).emit('participant-joined', {
          userId,
          displayName,
          isInstructor,
          participantCount: session.participants.size,
        });

        // Enviar estado atual para o novo participante
        socket.emit('training-state', {
          timerSeconds: session.timerSeconds,
          isRunning: session.isRunning,
          reps: session.reps,
          currentActivity: session.currentActivity,
          participants: Array.from(session.participants.values()),
        });

        console.log(`[WebSocket] ${displayName} entrou na sala ${roomId}`);
      });

      // Instrutor inicia o cronômetro
      socket.on('start-timer', (data: { roomId: string }) => {
        const { roomId } = data;
        const session = this.sessions.get(roomId);

        if (!session) return;

        session.isRunning = true;

        // Limpar intervalo anterior se existir
        if (this.timerIntervals.has(roomId)) {
          clearInterval(this.timerIntervals.get(roomId)!);
        }

        // Iniciar novo intervalo
        const interval = setInterval(() => {
          session.timerSeconds++;

          // Enviar atualização para todos na sala
          this.io.to(roomId).emit('timer-update', {
            roomId,
            seconds: session.timerSeconds,
            isRunning: session.isRunning,
            reps: session.reps,
            currentActivity: session.currentActivity,
            timestamp: Date.now(),
          });
        }, 1000);

        this.timerIntervals.set(roomId, interval);

        // Notificar que timer começou
        this.io.to(roomId).emit('timer-started', {
          timerSeconds: session.timerSeconds,
          timestamp: Date.now(),
        });

        console.log(`[WebSocket] Timer iniciado na sala ${roomId}`);
      });

      // Instrutor pausa o cronômetro
      socket.on('pause-timer', (data: { roomId: string }) => {
        const { roomId } = data;
        const session = this.sessions.get(roomId);

        if (!session) return;

        session.isRunning = false;

        // Parar intervalo
        if (this.timerIntervals.has(roomId)) {
          clearInterval(this.timerIntervals.get(roomId)!);
          this.timerIntervals.delete(roomId);
        }

        // Notificar pausa
        this.io.to(roomId).emit('timer-paused', {
          timerSeconds: session.timerSeconds,
          timestamp: Date.now(),
        });

        console.log(`[WebSocket] Timer pausado na sala ${roomId}`);
      });

      // Instrutor reseta o cronômetro
      socket.on('reset-timer', (data: { roomId: string }) => {
        const { roomId } = data;
        const session = this.sessions.get(roomId);

        if (!session) return;

        session.isRunning = false;
        session.timerSeconds = 0;

        // Parar intervalo
        if (this.timerIntervals.has(roomId)) {
          clearInterval(this.timerIntervals.get(roomId)!);
          this.timerIntervals.delete(roomId);
        }

        // Notificar reset
        this.io.to(roomId).emit('timer-reset', {
          timerSeconds: 0,
          timestamp: Date.now(),
        });

        console.log(`[WebSocket] Timer resetado na sala ${roomId}`);
      });

      // Atualizar contador de repetições
      socket.on('update-reps', (data: { roomId: string; reps: number }) => {
        const { roomId, reps } = data;
        const session = this.sessions.get(roomId);

        if (!session) return;

        session.reps = reps;

        // Notificar atualização
        this.io.to(roomId).emit('reps-updated', {
          reps,
          timerSeconds: session.timerSeconds,
          timestamp: Date.now(),
        });

        console.log(`[WebSocket] Repetições atualizadas para ${reps} na sala ${roomId}`);
      });

      // Atualizar atividade atual
      socket.on('update-activity', (data: { roomId: string; activity: string }) => {
        const { roomId, activity } = data;
        const session = this.sessions.get(roomId);

        if (!session) return;

        session.currentActivity = activity;
        session.timerSeconds = 0;
        session.reps = 0;
        session.isRunning = false;

        // Parar intervalo
        if (this.timerIntervals.has(roomId)) {
          clearInterval(this.timerIntervals.get(roomId)!);
          this.timerIntervals.delete(roomId);
        }

        // Notificar mudança de atividade
        this.io.to(roomId).emit('activity-changed', {
          activity,
          timerSeconds: 0,
          reps: 0,
          timestamp: Date.now(),
        });

        console.log(`[WebSocket] Atividade mudou para "${activity}" na sala ${roomId}`);
      });

      // Usuário sai da sala
      socket.on('leave-training', (data: { roomId: string; userId: string }) => {
        const { roomId, userId } = data;
        const session = this.sessions.get(roomId);

        if (!session) return;

        session.participants.delete(userId);

        // Se ninguém mais está na sessão, limpar
        if (session.participants.size === 0) {
          if (this.timerIntervals.has(roomId)) {
            clearInterval(this.timerIntervals.get(roomId)!);
            this.timerIntervals.delete(roomId);
          }
          this.sessions.delete(roomId);
          console.log(`[WebSocket] Sessão ${roomId} finalizada`);
        } else {
          // Notificar saída
          this.io.to(roomId).emit('participant-left', {
            userId,
            participantCount: session.participants.size,
          });
        }

        socket.leave(roomId);
      });

      // Desconexão
      socket.on('disconnect', () => {
        console.log(`[WebSocket] Cliente desconectado: ${socket.id}`);

        // Limpar todas as salas do cliente
        this.sessions.forEach((session, roomId) => {
          session.participants.forEach((participant, userId) => {
            if (socket.id === userId) {
              session.participants.delete(userId);
            }
          });

          if (session.participants.size === 0) {
            if (this.timerIntervals.has(roomId)) {
              clearInterval(this.timerIntervals.get(roomId)!);
              this.timerIntervals.delete(roomId);
            }
            this.sessions.delete(roomId);
          }
        });
      });

      // Erro
      socket.on('error', (error: any) => {
        console.error(`[WebSocket] Erro no socket ${socket.id}:`, error);
      });
    });
  }

  public getIO() {
    return this.io;
  }

  public getSession(roomId: string) {
    return this.sessions.get(roomId);
  }

  public getAllSessions() {
    return Array.from(this.sessions.values());
  }
}

export { WebSocketManager, TrainingSession, ParticipantData, TimerUpdate };
