import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Linking from 'expo-linking';

interface JitsiMeetNativeProps {
  roomId: string;
  displayName: string;
  serverUrl?: string;
  onConferenceJoined?: () => void;
  onConferenceLeft?: () => void;
  onError?: (error: Error) => void;
}

export function JitsiMeetNative({
  roomId,
  displayName,
  serverUrl = 'https://meet.jitsi',
  onConferenceJoined,
  onConferenceLeft,
  onError,
}: JitsiMeetNativeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
      onConferenceJoined?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onConferenceJoined]);

  const handleOpenJitsi = async () => {
    try {
      // Sanitizar room ID
      const sanitizedRoomId = roomId
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Criar URL do Jitsi Meet
      const url = `${serverUrl}/${sanitizedRoomId}?displayName=${encodeURIComponent(displayName)}`;

      // Tentar abrir no navegador
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        setError('Não foi possível abrir o Jitsi Meet');
        onError?.(new Error('Não foi possível abrir o Jitsi Meet'));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMsg);
      onError?.(new Error(errorMsg));
    }
  };

  if (error) {
    return (
      <View className="flex-1 bg-black items-center justify-center p-4">
        <Text className="text-error text-center text-lg font-bold mb-2">
          ⚠️ Erro
        </Text>
        <Text className="text-muted text-center text-sm mb-4">
          {error}
        </Text>
        <TouchableOpacity
          onPress={handleOpenJitsi}
          className="bg-primary px-6 py-3 rounded-lg"
        >
          <Text className="text-background font-bold">Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text className="text-foreground mt-4 text-center">
          Preparando conferência...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black items-center justify-center p-4">
      <View className="items-center gap-4">
        <Text className="text-6xl">📹</Text>
        <Text className="text-foreground text-xl font-bold text-center">
          Sala: {roomId}
        </Text>
        <Text className="text-muted text-center text-sm">
          Participante: {displayName}
        </Text>
        <TouchableOpacity
          onPress={handleOpenJitsi}
          className="bg-primary px-8 py-4 rounded-lg mt-4"
        >
          <Text className="text-background font-bold text-base">
            Abrir Conferência
          </Text>
        </TouchableOpacity>
        <Text className="text-muted text-xs text-center mt-4">
          A conferência será aberta no navegador
        </Text>
      </View>
    </View>
  );
}
