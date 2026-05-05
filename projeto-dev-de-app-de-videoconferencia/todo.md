# Fitness Jitsi Meet App - TODO

## Funcionalidades Principais

### Autenticação e Entrada
- [x] Tela de entrada com campos (nome, ID da sala, tipo de participante)
- [x] Validação de campos obrigatórios
- [x] Seleção de "Instrutor" ou "Aluno"
- [x] Persistência de dados do usuário (AsyncStorage)

### Configuração da Chamada
- [x] Tela de pré-visualização de câmera
- [x] Controles de áudio/vídeo (toggle)
- [ ] Seletor de câmera (frontal/traseira)
- [x] Botão "Iniciar Treino"

### Integração Jitsi Meet
- [x] Integração do Jitsi Meet via WebView (dentro do app)
- [x] Conexão com sala de videoconferência (sem abrir navegador externo)
- [x] Solicitar permissões de câmera e microfone no Android
- [x] Tratamento de erros de conexão
- [x] Reconexão automática

### Cronômetro e Contador
- [x] Implementar cronômetro sincronizado (HH:MM:SS)
- [x] Implementar contador de repetições
- [ ] Sincronização em tempo real via WebSocket
- [x] Botão Iniciar/Pausar cronômetro
- [x] Botão Incrementar repetições (+)
- [x] Botão Decrementar repetições (-)
- [x] Botão "Próxima Atividade"

### Tela Principal de Treino
- [x] Layout com vídeo (60%) + controles (40%)
- [x] Exibição do cronômetro em tempo real
- [x] Exibição do contador de repetições em tempo real
- [x] Botões de controle funcionais
- [x] Indicador de Instrutor/Aluno
- [x] Botão de sair da chamada

### Plano de Treino (Atividades)
- [x] Tela de lista de exercícios
- [x] Destaque do exercício atual
- [x] Fila de próximos exercícios
- [x] Duração estimada por exercício
- [x] Número de repetições esperadas
- [x] Botão de confirmação de conclusão

### Sincronização em Tempo Real
- [x] Configurar WebSocket para comunicação (Socket.io)
- [x] Sincronizar cronômetro entre todos os usuários
- [x] Sincronizar contador de repetições
- [x] Sincronizar mudança de atividade
- [x] Latência < 100ms

### Histórico e Resumo
- [ ] Tela de resumo do treino
- [ ] Tempo total gasto
- [ ] Exercícios completados
- [ ] Estatísticas por exercício
- [ ] Botão de compartilhamento

### UI/UX e Branding
- [x] Gerar logo do aplicativo
- [x] Atualizar app.config.ts com nome e logo
- [x] Definir paleta de cores
- [x] Implementar tema claro/escuro
- [x] Feedback haptic em botões
- [x] Responsividade para diferentes tamanhos de tela

### Testes e Validação
- [ ] Testar fluxo de entrada
- [ ] Testar integração Jitsi Meet
- [ ] Testar sincronização de cronômetro
- [ ] Testar sincronização de contador
- [ ] Testar reconexão automática
- [ ] Testar em dispositivo Android real

### Documentação
- [ ] Documentar arquitetura
- [ ] Documentar fluxos de dados
- [ ] Criar guia de uso para instrutor
- [ ] Criar guia de uso para aluno

## Dependências Externas
- Jitsi Meet SDK
- WebSocket (Socket.io ou similar)
- Firebase Realtime Database (opcional para sincronização)
- Expo Camera
- Expo Permissions

## Notas Técnicas
- Usar React Context para estado compartilhado
- Usar WebView para integração Jitsi Meet
- Usar WebSocket para sincronização em tempo real
- Usar AsyncStorage para persistência local
- Implementar reconexão automática com backoff exponencial
