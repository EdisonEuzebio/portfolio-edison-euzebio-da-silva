import { describe, it, expect, beforeEach } from 'vitest';
import { SyncService } from '../sync-service';

describe('SyncService', () => {
  let syncService: SyncService;

  beforeEach(() => {
    syncService = new SyncService();
  });

  describe('initialize', () => {
    it('should initialize with correct user data', () => {
      syncService.initialize('room-123', 'user-1', 'John', true);
      
      const state = syncService.getState();
      expect(state.participants.size).toBe(1);
      
      const participant = state.participants.get('user-1');
      expect(participant?.userName).toBe('John');
      expect(participant?.role).toBe('instructor');
    });

    it('should set instructor flag correctly', () => {
      syncService.initialize('room-123', 'user-1', 'John', true);
      expect(syncService.isUserInstructor()).toBe(true);

      const syncService2 = new SyncService();
      syncService2.initialize('room-123', 'user-2', 'Jane', false);
      expect(syncService2.isUserInstructor()).toBe(false);
    });
  });

  describe('createTimerMessage', () => {
    beforeEach(() => {
      syncService.initialize('room-123', 'user-1', 'John', true);
    });

    it('should create a valid timer message', () => {
      const message = syncService.createTimerMessage(1, 30, 45);
      
      expect(message.type).toBe('timer');
      expect(message.data.hours).toBe(1);
      expect(message.data.minutes).toBe(30);
      expect(message.data.seconds).toBe(45);
      expect(message.data.fromInstructor).toBe(true);
    });
  });

  describe('createRepsMessage', () => {
    beforeEach(() => {
      syncService.initialize('room-123', 'user-1', 'John', false);
    });

    it('should create a valid reps message', () => {
      const message = syncService.createRepsMessage(15);
      
      expect(message.type).toBe('reps');
      expect(message.data.reps).toBe(15);
      expect(message.data.fromInstructor).toBe(false);
    });
  });

  describe('createActivityMessage', () => {
    beforeEach(() => {
      syncService.initialize('room-123', 'user-1', 'John', true);
    });

    it('should create a valid activity message', () => {
      const message = syncService.createActivityMessage('activity-1', 'start');
      
      expect(message.type).toBe('activity');
      expect(message.data.activityId).toBe('activity-1');
      expect(message.data.action).toBe('start');
    });
  });

  describe('processMessage', () => {
    beforeEach(() => {
      syncService.initialize('room-123', 'user-1', 'John', false);
    });

    it('should update timer state from instructor', () => {
      const timerMessage = {
        type: 'timer' as const,
        roomId: 'room-123',
        userId: 'user-2',
        userName: 'Instructor',
        data: { hours: 1, minutes: 15, seconds: 30, fromInstructor: true },
        timestamp: Date.now(),
      };

      syncService.processMessage(timerMessage);
      const state = syncService.getState();

      expect(state.timerHours).toBe(1);
      expect(state.timerMinutes).toBe(15);
      expect(state.timerSeconds).toBe(30);
    });

    it('should update reps state from instructor', () => {
      const repsMessage = {
        type: 'reps' as const,
        roomId: 'room-123',
        userId: 'user-2',
        userName: 'Instructor',
        data: { reps: 20, fromInstructor: true },
        timestamp: Date.now(),
      };

      syncService.processMessage(repsMessage);
      const state = syncService.getState();

      expect(state.currentReps).toBe(20);
    });

    it('should add participant on join message', () => {
      const joinMessage = {
        type: 'participant' as const,
        roomId: 'room-123',
        userId: 'user-2',
        userName: 'Jane',
        data: { action: 'join', role: 'student' },
        timestamp: Date.now(),
      };

      syncService.processMessage(joinMessage);
      const participants = syncService.getParticipants();

      expect(participants.length).toBe(2);
      expect(participants.some(p => p.userId === 'user-2')).toBe(true);
    });

    it('should remove participant on leave message', () => {
      // First add a participant
      const joinMessage = {
        type: 'participant' as const,
        roomId: 'room-123',
        userId: 'user-2',
        userName: 'Jane',
        data: { action: 'join', role: 'student' },
        timestamp: Date.now(),
      };
      syncService.processMessage(joinMessage);

      // Then remove them
      const leaveMessage = {
        type: 'participant' as const,
        roomId: 'room-123',
        userId: 'user-2',
        userName: 'Jane',
        data: { action: 'leave' },
        timestamp: Date.now(),
      };
      syncService.processMessage(leaveMessage);

      const participants = syncService.getParticipants();
      expect(participants.some(p => p.userId === 'user-2')).toBe(false);
    });
  });

  describe('getParticipants', () => {
    beforeEach(() => {
      syncService.initialize('room-123', 'user-1', 'John', true);
    });

    it('should return all participants', () => {
      const joinMessage = {
        type: 'participant' as const,
        roomId: 'room-123',
        userId: 'user-2',
        userName: 'Jane',
        data: { action: 'join', role: 'student' },
        timestamp: Date.now(),
      };
      syncService.processMessage(joinMessage);

      const participants = syncService.getParticipants();
      expect(participants.length).toBe(2);
      expect(participants[0].userName).toBe('John');
      expect(participants[1].userName).toBe('Jane');
    });
  });
});
