import { useEffect, useState } from 'react';
import { useCameraPermissions as useCameraPerms, useMicrophonePermissions as useMicPerms } from 'expo-camera';
import { Platform } from 'react-native';

interface PermissionStatus {
  camera: boolean;
  microphone: boolean;
}

export function useCameraPermissions() {
  const [cameraPermission, requestCameraPermission] = useCameraPerms();
  const [micPermission, requestMicPermission] = useMicPerms();
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: false,
    microphone: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAndRequestPermissions();
  }, []);

  useEffect(() => {
    if (cameraPermission && micPermission) {
      setPermissions({
        camera: cameraPermission.status === 'granted',
        microphone: micPermission.status === 'granted',
      });
      setLoading(false);

      if (cameraPermission.status !== 'granted' || micPermission.status !== 'granted') {
        setError('Permissões de câmera e microfone são necessárias');
      } else {
        setError(null);
      }
    }
  }, [cameraPermission, micPermission]);

  const checkAndRequestPermissions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Request camera permission
      const cameraResult = await requestCameraPermission();
      
      // Request microphone permission
      const micResult = await requestMicPermission();

      setPermissions({
        camera: cameraResult.status === 'granted',
        microphone: micResult.status === 'granted',
      });

      if (cameraResult.status !== 'granted' || micResult.status !== 'granted') {
        setError('Permissões de câmera e microfone são necessárias para usar o aplicativo');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao solicitar permissões';
      setError(errorMessage);
      console.error('Permission request error:', err);
    } finally {
      setLoading(false);
    }
  };

  const requestPermissions = async () => {
    await checkAndRequestPermissions();
  };

  return {
    permissions,
    loading,
    error,
    requestPermissions,
    allGranted: permissions.camera && permissions.microphone,
  };
}
