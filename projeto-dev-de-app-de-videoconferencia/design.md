# Design do Aplicativo Fitness Jitsi Meet

## Visão Geral
Aplicativo móvel Android para treinos personalizados com integração ao Jitsi Meet, permitindo videoconferências com cronômetro e contador de repetições sincronizados em tempo real entre todos os participantes.

## Orientação
- **Formato**: Retrato (9:16)
- **Uso**: Uma mão
- **Padrão**: Apple Human Interface Guidelines (HIG) - aparência nativa iOS

## Lista de Telas

### 1. **Tela de Entrada (Login/Acesso)**
- Campos para nome do usuário
- Campo para ID da sala/sessão
- Opção de entrar como "Instrutor" ou "Aluno"
- Botão "Entrar na Chamada"
- Validação de campos obrigatórios

### 2. **Tela de Configuração da Chamada**
- Pré-visualização de câmera e áudio
- Seletor de câmera (frontal/traseira)
- Toggle para ativar/desativar microfone
- Toggle para ativar/desativar câmera
- Botão "Iniciar Treino"

### 3. **Tela Principal de Treino (Video + Controles)**
- **Área de Vídeo**: Videoconferência Jitsi Meet (ocupando ~60% da tela)
- **Painel de Controles** (40% inferior):
  - Cronômetro (HH:MM:SS) - exibição grande e clara
  - Contador de Repetições (número grande)
  - Botões de Controle:
    - **Iniciar/Pausar Cronômetro**
    - **Incrementar Repetições** (+)
    - **Decrementar Repetições** (-)
    - **Próxima Atividade** (avançar para próximo exercício)
  - Indicador de Instrutor/Aluno
  - Botão de Sair da Chamada

### 4. **Tela de Atividades (Plano de Treino)**
- Lista de exercícios planejados
- Exercício atual destacado
- Próximos exercícios em fila
- Duração estimada de cada exercício
- Número de repetições esperadas
- Botão para confirmar conclusão do exercício

### 5. **Tela de Histórico/Resumo**
- Resumo do treino realizado
- Tempo total gasto
- Exercícios completados
- Estatísticas por exercício
- Botão para compartilhar resultado

## Conteúdo Primário e Funcionalidade

### Tela de Entrada
- **Campos**: Nome do usuário, ID da sala, tipo de participante
- **Funcionalidade**: Validação e conexão ao Jitsi Meet

### Tela de Configuração
- **Conteúdo**: Pré-visualização de câmera, controles de áudio/vídeo
- **Funcionalidade**: Permitir ajustes antes de iniciar

### Tela Principal de Treino
- **Conteúdo**: Vídeo em tempo real, cronômetro sincronizado, contador de repetições
- **Funcionalidade**: 
  - Todos os usuários veem o mesmo cronômetro e contador
  - Instrutor controla o cronômetro e contador
  - Alunos veem as atualizações em tempo real
  - Sincronização via WebSocket ou Firebase Realtime Database

### Tela de Atividades
- **Conteúdo**: Lista estruturada de exercícios
- **Funcionalidade**: Navegação entre exercícios, confirmação de conclusão

## Fluxos de Usuário Principais

### Fluxo 1: Instrutor Iniciando um Treino
1. Instrutor abre o app
2. Preenche nome e cria/seleciona ID da sala
3. Seleciona "Instrutor"
4. Configura câmera e áudio
5. Clica "Iniciar Treino"
6. Aguarda alunos entrarem
7. Inicia cronômetro e gerencia contador de repetições
8. Passa para próxima atividade quando concluir

### Fluxo 2: Aluno Entrando em um Treino
1. Aluno abre o app
2. Preenche nome e ID da sala do instrutor
3. Seleciona "Aluno"
4. Configura câmera e áudio
5. Clica "Entrar na Chamada"
6. Visualiza vídeo do instrutor e dos outros alunos
7. Vê cronômetro e contador sincronizados
8. Segue o treino do instrutor

### Fluxo 3: Sincronização em Tempo Real
1. Instrutor inicia cronômetro → todos veem começar
2. Instrutor incrementa contador → todos veem atualizar
3. Instrutor clica "Próxima Atividade" → todos veem mudança
4. Todos recebem atualizações via WebSocket em <100ms

## Escolhas de Cor

| Elemento | Cor (Light) | Cor (Dark) | Uso |
|----------|------------|-----------|-----|
| **Primária** | #0a7ea4 | #0a7ea4 | Botões principais, destaques |
| **Fundo** | #ffffff | #151718 | Fundo das telas |
| **Superfície** | #f5f5f5 | #1e2022 | Cards, painéis |
| **Texto Principal** | #11181C | #ECEDEE | Texto principal |
| **Texto Secundário** | #687076 | #9BA1A6 | Texto muted |
| **Borda** | #E5E7EB | #334155 | Divisores |
| **Sucesso** | #22C55E | #4ADE80 | Confirmação, status ok |
| **Aviso** | #F59E0B | #FBBF24 | Alertas |
| **Erro** | #EF4444 | #F87171 | Erros, problemas |

## Componentes Principais

- **ScreenContainer**: SafeArea wrapper para todas as telas
- **Cronômetro**: Display grande (48px+), atualização a cada segundo
- **Contador**: Display grande (64px+), incremento/decremento
- **Botões de Controle**: Pressable com feedback haptic
- **WebView Jitsi**: Integração da videoconferência
- **Sincronização**: WebSocket para atualizações em tempo real

## Considerações de Performance
- Sincronização de cronômetro: usar servidor de tempo (NTP) para evitar desvios
- Atualizações de UI: usar React Context + useReducer para estado compartilhado
- Vídeo: usar WebView otimizada para Jitsi Meet
- Conexão: reconectar automaticamente se desconectar

## Acessibilidade
- Textos grandes e contrastantes
- Feedback haptic para ações importantes
- Descrições de acessibilidade para elementos interativos
- Suporte a modo escuro automático
