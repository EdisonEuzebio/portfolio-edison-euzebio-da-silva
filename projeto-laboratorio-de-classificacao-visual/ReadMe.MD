# 🎬 Laboratório de Classificação Visual e Viés em IA
 
## 📝 Descrição do Projeto
Este projeto consiste em um experimento prático de treinamento de aprendizado de máquina supervisionado para explorar o fenômeno do viés algorítmico. O objetivo principal é demonstrar como a seleção de dados de treinamento baseada em estereótipos induz erros de classificação e reforça preconceitos sociais.
 
Desenvolvido como parte da disciplina de **Inteligência Artificial (2024.1)**, utilizamos o **Teachable Machine** do Google para criar um modelo de imagem com as classes "Perfil Liderança" e "Perfil Operacional". O sistema processa imagens capturadas via webcam para identificar padrões visuais, mas, devido ao dataset deliberadamente enviesado (homens de terno vs. roupas informais), o modelo falha ao analisar perfis que não correspondem aos estereótipos iniciais.
 
## 🚀 Tecnologias Utilizadas
* [cite_start]**Plataforma:** Teachable Machine (Google) [cite: 49]
* [cite_start]**Entrada de Dados:** Webcam em tempo real [cite: 40]
* **Conceitos:** Visão Computacional, Inferência de Classes e Engenharia de Dados
 
## 📊 Resultados e Aprendizados
O experimento revela como a lógica matemática de um algoritmo é vulnerável à qualidade dos dados de entrada.
 
* **Mecanismo do Viés:** A seleção restrita de dados corrompe a lógica do algoritmo e gera uma visão distorcida da realidade, pois o sistema limita seu aprendizado a padrões superficiais e excludentes.
* **Consequência Social:** O sistema marginaliza e invisibiliza o indivíduo através desta classificação, o que gera um impacto emocional e profissional profundo ao institucionalizar o preconceito em ferramentas "neutras".
* [cite_start]**Erro Identificado:** No teste prático, o modelo apresentou 81% de confiança em uma classificação incorreta ("Não Objeto") ao ser confrontado com um elemento fora do padrão treinado[cite: 43, 46].
 
## 🔧 Como Executar
1. Acesse o **Teachable Machine** e defina as categorias "Perfil Liderança" e "Perfil Operacional".
2. Alimente o modelo com 20 imagens estereotipadas por categoria (ex: roupas formais vs. informais).
3. Realize o teste de inferência com um colega que não se encaixe nos padrões capturados.
4. [cite_start]Monitore a saída (Output) para identificar o nível de confiança e os erros de predição[cite: 41].
 
---
### 🛡️ Ação Mitigadora (Human-in-the-loop)
Para garantir a equidade no processo, propõe-se uma intervenção de **curadoria humana**. Esta ação garante que a diversidade social seja representada no dataset antes da implementação, neutralizando a visão distorcida do algoritmo e assegurando que a tecnologia atue como uma ferramenta de inclusão, não de exclusão.

[Voltar ao início](https://github.com/seu-usuario/seu-usuario)
