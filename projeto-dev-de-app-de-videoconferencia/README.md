# Fitness Jitsi - Videoconferência para Treino Personalizado

## 🏋️ Sobre o Projeto
O **Fitness Jitsi** é um aplicativo Android nativo projetado para transformar a experiência de consultorias fitness remotas. O projeto resolve o problema da falta de ferramentas de acompanhamento em tempo real durante chamadas de vídeo, onde alunos e instrutores frequentemente perdem o foco ao alternar entre a live e aplicativos de cronômetro ou planilhas externas.

## 🚀 Proposta de Valor
Diferente de plataformas de vídeo genéricas, o **Fitness Jitsi** é único porque integra a gestão do treino diretamente na interface de vídeo:
* **Controle Centralizado:** O instrutor gerencia o tempo e as repetições, que aparecem instantaneamente na tela do aluno.
* **Overlays Inteligentes:** Cronômetro e contador de repetições sobrepostos ao vídeo, permitindo que o aluno mantenha a atenção total na execução e postura.
* **Sincronização de Baixa Latência:** Dados e vídeo em harmonia para que a correção do exercício seja imediata.

## 🛠️ Tecnologias Utilizadas
* **Linguagem:** Kotlin / Java (Desenvolvimento Android Nativo).
* **Streaming de Vídeo:** WebRTC com integração via Jitsi Meet SDK.
* **Backend & Sincronia:** Firebase Realtime Database para atualização dos contadores em tempo real.
* **Arquitetura:** MVVM (Model-View-ViewModel) para um código limpo e escalável.
* **Interface (UI):** XML com Custom Views para os elementos sobrepostos.

## Link para pré-visualização.

Link: https://manus.im/app-preview/ddh2oJdPy3uuZkP2Ybkgr9?sessionId=lY31OMqDO2Y6pZzs8CpbzZ

## QR-CODE PARA FACILITAR A INSTALAÇÃO DO TESTE

<img width="422" height="414" alt="qr_code_fitness" src="https://github.com/user-attachments/assets/0b2342d3-450f-49eb-a091-acd6b97d950a" />


## ⚙️ Instruções de Instalação

Siga os passos abaixo para configurar o ambiente de desenvolvimento:

1.  **Pré-requisitos:**
    * Android Studio Jellyfish ou superior.
    * Dispositivo Android físico (recomendado para testes de câmera) ou emulador (API 26+).

2.  **Clonar o Repositório:**
    ```bash
    git clone [https://github.com/EdisonEuzebio/portfolio-edison-euzebio-da-silva.git](https://github.com/EdisonEuzebio/portfolio-edison-euzebio-da-silva.git)
    cd portfolio-edison-euzebio-da-silva/projeto-dev-de-app-de-videoconferencia
    ```

3.  **Configuração de Build:**
    * Abra o projeto no Android Studio.
    * Aguarde a finalização do *Gradle Sync*.
    * Certifique-se de que o dispositivo está conectado e reconhecido pelo `adb`.

## 📖 Instruções de Uso

1.  **Conexão:** Ao abrir o app, insira o ID da sala de treinamento fornecido pelo instrutor.
2.  **Interface do Instrutor:** Toque nos ícones de cronômetro ou contador no painel lateral para ativar as ferramentas na tela de ambos os participantes.
3.  **Durante o Treino:** * O instrutor inicia a contagem e o aluno visualiza o progresso sem precisar interagir com o dispositivo, focando apenas no movimento.
    * As métricas são salvas automaticamente ao final da sessão para acompanhamento de evolução.

---

## 👨‍💻 Autor
**Edison Euzebio da Silva** [GitHub](https://github.com/EdisonEuzebio) | 
