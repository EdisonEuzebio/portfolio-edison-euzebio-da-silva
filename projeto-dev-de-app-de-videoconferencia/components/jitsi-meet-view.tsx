import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

interface JitsiMeetViewProps {
  roomId: string;
  displayName: string;
  serverUrl?: string;
  onConferenceJoined?: () => void;
  onConferenceLeft?: () => void;
  onError?: (error: Error) => void;
}

export function JitsiMeetView({
  roomId,
  displayName,
  serverUrl = 'https://meet.jit.si',
  onConferenceJoined,
  onConferenceLeft,
  onError,
}: JitsiMeetViewProps) {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sanitizar room ID para URL
  const sanitizedRoomId = roomId
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Construir URL do Jitsi Meet com configurações
  const jitsiUrl = `${serverUrl}/${sanitizedRoomId}#config.startWithAudioMuted=false&config.startWithVideoMuted=false&config.disableProfile=true&config.prejoinPageEnabled=false&config.enableClosePage=false&userInfo.displayName="${encodeURIComponent(displayName)}"`;

  useEffect(() => {
    // Simular conferência iniciada após WebView carregar
    const timer = setTimeout(() => {
      setIsLoading(false);
      onConferenceJoined?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onConferenceJoined]);

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      console.log('Mensagem do WebView:', message);
      
      if (message.type === 'error') {
        setError(message.data);
        onError?.(new Error(message.data));
      }
    } catch (err) {
      console.error('Erro ao processar mensagem:', err);
    }
  };

  const injectedJavaScript = `
    (function() {
      console.log('Jitsi Meet carregado');
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'loaded',
        data: 'Conferência pronta'
      }));
    })();
    true;
  `;

  if (error) {
    return (
      <View className="flex-1 bg-black items-center justify-center p-4">
        <Text className="text-error text-center text-lg font-bold mb-2">
          ⚠️ Erro
        </Text>
        <Text className="text-muted text-center text-sm">
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {isLoading && (
        <View className="absolute inset-0 bg-black items-center justify-center z-50">
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text className="text-foreground mt-4 text-center text-sm">
            Conectando à conferência...
          </Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: jitsiUrl }}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        scalesPageToFit={true}
        originWhitelist={['*']}
        startInLoadingState={true}
        injectedJavaScript={injectedJavaScript}
        onLoadEnd={() => {
          console.log('WebView carregado');
          setIsLoading(false);
        }}
        onError={(syntheticEvent: any) => {
          const { nativeEvent } = syntheticEvent;
          console.error('Erro no WebView:', nativeEvent);
          setError('Falha ao carregar o Jitsi Meet');
          onError?.(new Error('Falha ao carregar o Jitsi Meet'));
        }}
        onHttpError={(syntheticEvent: any) => {
          const { nativeEvent } = syntheticEvent;
          console.error('Erro HTTP:', nativeEvent);
        }}
        mixedContentMode="always"
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"
      />
    </View>
  );
}
