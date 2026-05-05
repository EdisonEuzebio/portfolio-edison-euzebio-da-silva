import { useEffect, useRef, useCallback, useState } from 'react';
import { useTraining } from '@/lib/training-context';

interface WebSocketMessage {
  type: 'timer' | 'reps' | 'activity' | 'participant' | 'error';
  data: any;
  timestamp: number;
}

interface WebSocketHookOptions {
  url: string;
  roomId: string;
  userName: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export function useWebSocket({
  url,
  roomId,
  userName,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: WebSocketHookOptions) {
  const { setConnected, setError } = useTraining();
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000; // 1 second

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnected(true);
        reconnectAttemptsRef.current = 0;
        onConnect?.();

        // Send join message
        const joinMessage: WebSocketMessage = {
          type: 'participant',
          data: { action: 'join', roomId, userName },
          timestamp: Date.now(),
        };
        ws.send(JSON.stringify(joinMessage));
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        const error = new Error('WebSocket connection error');
        setError(error.message);
        onError?.(error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setConnected(false);
        onDisconnect?.();

        // Attempt to reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        } else {
          setError('Falha ao conectar ao servidor. Máximo de tentativas atingido.');
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      const err = error instanceof Error ? error : new Error(String(error));
      setError(err.message);
      onError?.(err);
    }
  }, [url, roomId, userName, onMessage, onConnect, onDisconnect, onError, setConnected, setError]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const send = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const sendTimer = useCallback((hours: number, minutes: number, seconds: number) => {
    send({
      type: 'timer',
      data: { hours, minutes, seconds },
      timestamp: Date.now(),
    });
  }, [send]);

  const sendReps = useCallback((reps: number) => {
    send({
      type: 'reps',
      data: { reps },
      timestamp: Date.now(),
    });
  }, [send]);

  const sendActivity = useCallback((activityId: string, action: 'start' | 'complete') => {
    send({
      type: 'activity',
      data: { activityId, action },
      timestamp: Date.now(),
    });
  }, [send]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    send,
    sendTimer,
    sendReps,
    sendActivity,
    disconnect,
  };
}
