/**
 * Serviço de sincronização em tempo real
 * Gerencia a sincronização de cronômetro, contador e atividades entre participantes
 */

export interface SyncMessage {
  type: 'timer' | 'reps' | 'activity' | 'participant' | 'sync-request';
  roomId: string;
  userId: string;
  userName: string;
  data: any;
  timestamp: number;
}

export interface SyncState {
  timerSeconds: number;
  timerMinutes: number;
  timerHours: number;
  currentReps: number;
  currentActivityId: string;
  participants: Map<string, ParticipantInfo>;
}

export interface ParticipantInfo {
  userId: string;
  userName: string;
  role: 'instructor' | 'student';
  joinedAt: number;
  isActive: boolean;
}

export class SyncService {
  private syncState: SyncState;
  private messageHandlers: Map<string, (msg: SyncMessage) => void> = new Map();
  private isInstructor: boolean = false;
  private roomId: string = '';
  private userId: string = '';

  constructor() {
    this.syncState = {
      timerSeconds: 0,
      timerMinutes: 0,
      timerHours: 0,
      currentReps: 0,
      currentActivityId: '',
      participants: new Map(),
    };
  }

  /**
   * Inicializa o serviço de sincronização
   */
  initialize(roomId: string, userId: string, userName: string, isInstructor: boolean) {
    this.roomId = roomId;
    this.userId = userId;
    this.isInstructor = isInstructor;

    // Adiciona o usuário atual aos participantes
    this.syncState.participants.set(userId, {
      userId,
      userName,
      role: isInstructor ? 'instructor' : 'student',
      joinedAt: Date.now(),
      isActive: true,
    });
  }

  /**
   * Registra um handler para um tipo de mensagem
   */
  onMessage(type: string, handler: (msg: SyncMessage) => void) {
    this.messageHandlers.set(type, handler);
  }

  /**
   * Processa uma mensagem de sincronização recebida
   */
  processMessage(message: SyncMessage) {
    // Atualiza o estado baseado no tipo de mensagem
    switch (message.type) {
      case 'timer':
        if (this.isInstructor || message.data.fromInstructor) {
          this.syncState.timerHours = message.data.hours || 0;
          this.syncState.timerMinutes = message.data.minutes || 0;
          this.syncState.timerSeconds = message.data.seconds || 0;
        }
        break;

      case 'reps':
        if (this.isInstructor || message.data.fromInstructor) {
          this.syncState.currentReps = message.data.reps || 0;
        }
        break;

      case 'activity':
        if (this.isInstructor || message.data.fromInstructor) {
          this.syncState.currentActivityId = message.data.activityId || '';
        }
        break;

      case 'participant':
        if (message.data.action === 'join') {
          this.syncState.participants.set(message.userId, {
            userId: message.userId,
            userName: message.userName,
            role: message.data.role || 'student',
            joinedAt: Date.now(),
            isActive: true,
          });
        } else if (message.data.action === 'leave') {
          this.syncState.participants.delete(message.userId);
        }
        break;

      case 'sync-request':
        // Responde com o estado atual
        return this.createSyncResponse();
    }

    // Chama o handler registrado para este tipo
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    }
  }

  /**
   * Cria uma mensagem de sincronização de cronômetro
   */
  createTimerMessage(hours: number, minutes: number, seconds: number): SyncMessage {
    return {
      type: 'timer',
      roomId: this.roomId,
      userId: this.userId,
      userName: this.syncState.participants.get(this.userId)?.userName || 'Unknown',
      data: {
        hours,
        minutes,
        seconds,
        fromInstructor: this.isInstructor,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * Cria uma mensagem de sincronização de repetições
   */
  createRepsMessage(reps: number): SyncMessage {
    return {
      type: 'reps',
      roomId: this.roomId,
      userId: this.userId,
      userName: this.syncState.participants.get(this.userId)?.userName || 'Unknown',
      data: {
        reps,
        fromInstructor: this.isInstructor,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * Cria uma mensagem de sincronização de atividade
   */
  createActivityMessage(activityId: string, action: 'start' | 'complete'): SyncMessage {
    return {
      type: 'activity',
      roomId: this.roomId,
      userId: this.userId,
      userName: this.syncState.participants.get(this.userId)?.userName || 'Unknown',
      data: {
        activityId,
        action,
        fromInstructor: this.isInstructor,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * Cria uma resposta de sincronização com o estado atual
   */
  private createSyncResponse(): SyncMessage {
    return {
      type: 'sync-request',
      roomId: this.roomId,
      userId: this.userId,
      userName: this.syncState.participants.get(this.userId)?.userName || 'Unknown',
      data: {
        state: {
          timerHours: this.syncState.timerHours,
          timerMinutes: this.syncState.timerMinutes,
          timerSeconds: this.syncState.timerSeconds,
          currentReps: this.syncState.currentReps,
          currentActivityId: this.syncState.currentActivityId,
          participants: Array.from(this.syncState.participants.values()),
        },
      },
      timestamp: Date.now(),
    };
  }

  /**
   * Obtém o estado atual de sincronização
   */
  getState(): SyncState {
    return { ...this.syncState };
  }

  /**
   * Obtém a lista de participantes
   */
  getParticipants(): ParticipantInfo[] {
    return Array.from(this.syncState.participants.values());
  }

  /**
   * Verifica se o usuário atual é instrutor
   */
  isUserInstructor(): boolean {
    return this.isInstructor;
  }
}

// Instância global do serviço
export const syncService = new SyncService();
