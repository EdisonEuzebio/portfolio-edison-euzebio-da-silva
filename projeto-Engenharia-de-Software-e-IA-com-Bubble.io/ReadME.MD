# 🎬 Gestor de Aplicações Web: Engenharia de Software com IA (Bubble)
 
## 📝 Descrição do Projeto
Este projeto consiste no desenvolvimento de uma aplicação web de gestão (como um gerenciador de orçamentos ou férias) utilizando a Inteligência Artificial do **Bubble.io** como acelerador de produtividade. O objetivo central é demonstrar que a IA atua apenas como um "rascunho", sendo responsabilidade do engenheiro de software aplicar o rigor técnico necessário para garantir segurança, escalabilidade e governança.
 
Desenvolvido como parte de um estudo sobre ferramentas No-Code/Low-Code, o sistema foca na transição do protótipo gerado automaticamente para um produto robusto, corrigindo falhas típicas de IA em lógicas de permissão e design responsivo, além de prevenir o *Shadow IT* através de documentação interna.
 
 
## 🚀 Tecnologias Utilizadas
* **Plataforma de Desenvolvimento:** Bubble.io (Versão 2024)
* **Inteligência Artificial:** Bubble AI (Web Application Generator e Blueprint)
* **Arquitetura de Dados:** Mapeamento de Entidades, Otimização de Relações e Option Sets
* **Design e Layout:** Flexbox (Column, Row, Alignments)
* **Segurança:** Privacy Rules (Privacy by Design) e OWASP Top Ten para LCNC
 
## 📊 Resultados e Aprendizados
O projeto alcançou um nível de maturidade profissional ao aplicar fundamentos de engenharia sobre a base gerada por IA.
* **Segurança e Privacidade:** Implementação de regras estritas onde "Apenas o Criador" visualiza dados sensíveis, mitigando vulnerabilidades de exposição acidental (OWASP).
* **Otimização de Custos (WUs):** Redução do consumo de Unidades de Carga de Trabalho através de buscas otimizadas (Do a search for) concentradas apenas em Repeating Groups.
* **Refatoração Crítica:** Substituição de textos "chumbados" (hardcoded) por Option Sets dinâmicos, facilitando a manutenção e escalabilidade.
* **Governança:** Organização cromática de workflows e inclusão de notas documentais para garantir que o código não seja uma "caixa preta".
 
 
## 🔧 Como Executar
1. **Modelagem de Dados:** Antes do Bubble, documente as tabelas (Data Types) e evite campos do tipo "Lista" que excedam 100 itens.
2. **Geração Inicial:** Utilize a opção "Criar com IA" no Bubble com um prompt detalhado para o sistema de gestão.
3. **Auditoria de Interface:** Corrija o layout gerado pela IA utilizando os conceitos de Flexbox para garantir responsividade.
4. **Aplicação de Regras de Privacidade:** Vá em `Data > Privacy` e crie a condição `This [Objeto]'s Creator is Current User`.
5. **Integração de IA (Opcional):** Via API Connector, utilize o parâmetro `max_tokens` para evitar custos excessivos com prompts maliciosos.
 
 
---
### 🛡️ Estratégia de Saída (Mitigação de Vendor Lock-in)
Como o Bubble retém a posse do código-fonte, o projeto estabelece uma estratégia de saída baseada na **Data API**. Ao habilitar a extração das tabelas de Usuários e Dados via JSON, garantimos que a lógica de negócio e as informações possam ser migradas para uma arquitetura tradicional (React/Node.js) caso o sistema precise ser reescrito no futuro.
 
[Voltar ao início](https://github.com/seu-usuario/seu-usuario)
