# Pesquisa: Integração Jitsi Meet com React Native/Expo

## Resumo Executivo

A integração do Jitsi Meet com React Native é possível através do **@jitsi/react-native-sdk**, que fornece um componente `JitsiMeeting` pronto para uso. O SDK oferece a mesma experiência do aplicativo Jitsi Meet de forma customizável.

## Opções de Integração

### 1. **@jitsi/react-native-sdk** (Recomendado)
- **Status**: Oficialmente mantido pelo Jitsi
- **Instalação**: `npm i @jitsi/react-native-sdk`
- **Compatibilidade**: React Native 0.77.2+ (limitação: Expo SDK 52)
- **Plataformas**: iOS e Android
- **Componente Principal**: `<JitsiMeeting />`

### 2. Alternativas Legadas
- `react-native-jitsi-meet` (skrafft/react-native-jitsi-meet)
- `@xendoc/react-native-jitsi-meet` (descontinuado)

## Configuração Necessária

### Instalação
```bash
npm i @jitsi/react-native-sdk
npm i @jitsi/react-native-sdk --force  # Se houver conflitos
node node_modules/@jitsi/react-native-sdk/update_dependencies.js
npm install
```

### Metro Bundler (para SVG)
O SDK usa arquivos SVG, então é necessário atualizar a configuração do Metro:

```javascript
const { getDefaultConfig } = require('metro-config');
module.exports = (async () => {
  const { resolver: { sourceExts, assetExts } } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg']
    }
  }
})();
```

### Android
**Permissões** (AndroidManifest.xml):
- ACCESS_NETWORK_STATE
- ACCESS_WIFI_STATE
- BLUETOOTH
- CAMERA
- INTERNET
- MANAGE_OWN_CALLS
- MODIFY_AUDIO_SETTINGS
- POST_NOTIFICATIONS
- RECORD_AUDIO
- WAKE_LOCK
- FOREGROUND_SERVICE (Android 14+)
- FOREGROUND_SERVICE_MEDIA_PLAYBACK (Android 14+)
- FOREGROUND_SERVICE_MEDIA_PROJECTION (Android 14+)

**Configurações**:
- SDK mínimo: API 24
- Target SDK: API 33+
- Compilação: API 33+
- Screen sharing: Ativar `WebRTCModuleOptions.enableMediaProjectionService = true` em `MainApplication.java`

### iOS
**Info.plist**:
- `NSCameraUsageDescription`: Descrição de uso da câmera
- `NSMicrophoneUsageDescription`: Descrição de uso do microfone
- `UIViewControllerBasedStatusBarAppearance`: `NO`
- `RTCScreenSharingExtension`: Bundle ID da extensão de broadcast
- `UIBackgroundModes`: Incluir `voip`

**Xcode Script** (para sons):
```bash
SOUNDS_DIR="${PROJECT_DIR}/../node_modules/@jitsi/react-native-sdk/sounds"
cp $SOUNDS_DIR/* ${CONFIGURATION_BUILD_DIR}/${UNLOCALIZED_RESOURCES_FOLDER_PATH}/
```

## Componente JitsiMeeting

### Props Principais

| Prop | Tipo | Descrição |
|------|------|-----------|
| `config` | Object | Configurações da reunião (hideConferenceTimer, subject, customToolbarButtons) |
| `flags` | Object | Feature flags (call-integration.enabled, fullscreen.enabled, invite.enabled) |
| `room` | string | Nome da sala de conferência |
| `serverURL` | string | URL do servidor Jitsi |
| `style` | Object | Estilos CSS para a experiência |
| `token` | string | JWT token para autenticação |
| `userInfo` | Object | Informações do usuário (avatarUrl, displayName, email) |

### Event Listeners

| Evento | Descrição |
|--------|-----------|
| `onConferenceBlurred` | Quando a tela de conferência perde foco |
| `onConferenceFocused` | Quando a tela de conferência ganha foco |
| `onAudioMutedChanged` | Quando o estado de áudio é alterado |
| `onConferenceJoined` | Quando a conferência é iniciada |
| `onConferenceLeft` | Quando a conferência é encerrada |
| `onConferenceWillJoin` | Antes de entrar na conferência |
| `onEnterPictureInPicture` | Quando entra em Picture-in-Picture |
| `onParticipantJoined` | Quando um participante entra |
| `onReadyToClose` | Quando está pronto para fechar |
| `onVideoMutedChanged` | Quando o estado de vídeo é alterado |

## Sincronização em Tempo Real

Para sincronizar cronômetro e contador de repetições entre participantes, recomenda-se:

### Opção 1: Firebase Realtime Database
- **Vantagens**: Sincronização automática, escalável
- **Desvantagens**: Requer backend externo
- **Implementação**: `firebase` + `react-native-firebase`

### Opção 2: WebSocket (Socket.io)
- **Vantagens**: Controle total, baixa latência
- **Desvantagens**: Requer servidor próprio
- **Implementação**: `socket.io-client`

### Opção 3: Jitsi Meet API (Data Channels)
- **Vantagens**: Integrado ao Jitsi
- **Desvantagens**: Limitado a participantes da conferência
- **Implementação**: Usar `postMessage` do Jitsi

## Fluxo Recomendado

1. **Tela de Entrada**: Coletar nome do usuário e ID da sala
2. **Tela de Configuração**: Pré-visualizar câmera/áudio
3. **JitsiMeeting**: Renderizar conferência com event listeners
4. **Sincronização**: Usar WebSocket/Firebase para cronômetro e contador
5. **Overlay**: Adicionar cronômetro e contador sobre o vídeo Jitsi

## Limitações Conhecidas

1. **Expo SDK 52**: Jitsi requer React Native 0.77.2, limitando a Expo SDK 52
2. **Compatibilidade**: Pode haver conflitos de dependências
3. **Screen Sharing**: Requer configuração adicional no Android 14+
4. **Permissions**: Múltiplas permissões necessárias no Android

## Próximos Passos

1. Instalar `@jitsi/react-native-sdk`
2. Configurar Metro bundler para SVG
3. Adicionar permissões no AndroidManifest.xml
4. Implementar componente JitsiMeeting
5. Integrar sincronização em tempo real (WebSocket/Firebase)
6. Adicionar cronômetro e contador como overlay
