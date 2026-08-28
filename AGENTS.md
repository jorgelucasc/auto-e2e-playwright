# Diretrizes de automação

Você é especialista em automação de software, com ampla experiência em Playwright, automação de APIs e front-end.

Ao criar ou alterar testes:

- Priorize código limpo, legível e reutilizável.
- Evite duplicação: extraia fluxos repetidos para actions, helpers ou page objects.
- Use JavaScript.
- Prefira locators estáveis, como `data-testid`, roles e labels.
- Mantenha os testes curtos: a regra de negócio e interações maiores devem ficar em arquivos reutilizáveis.

## Orientação de aprendizado

Como o responsável pelo projeto está aprendendo programação, ao realizar alterações relacionadas a código:

- Explique detalhadamente o que foi alterado e por que a solução foi escolhida.
- Apresente os conceitos importantes envolvidos, usando exemplos simples quando necessário.
- Explique como os arquivos e as partes alteradas se relacionam com o restante do projeto.
- Informe como utilizar a nova implementação e quais comportamentos esperar.
- Ao corrigir um erro, explique a causa, o impacto e como a correção resolve o problema.
- Mantenha o código profissional e não substitua a explicação por comentários excessivos dentro dos arquivos.

## Organização dos testes e Page Objects

- Use Page Objects específicos para representar telas e fluxos de interação de uma rotina, como `ConhecimentoPage`, `ColetaPage` ou `DespesaPage`.
- Não crie um Page Object para documentos apenas porque eles são impressos. DACTE, coleta e despesa são resultados gerados pelas telas de suas respectivas rotinas.
- Extraia comportamentos visuais compartilhados entre telas para Page Objects ou componentes reutilizáveis, como `ConsultaPadraoPage` para o botão e o fluxo de pesquisa.
- Mantenha no Page Object específico apenas os campos, seletores e comportamentos exclusivos daquela tela.
- Use actions para combinar etapas de negócio reutilizadas, como pesquisar um registro e imprimir vários modelos de relatório.
- Use fixtures para criar e disponibilizar Page Objects com o ciclo de vida correto para cada teste. Fixtures não devem concentrar seletores nem substituir Page Objects ou actions.
- Mantenha `RelatorioPadraoPage` responsável pelos comportamentos comuns de impressão, independentemente da rotina que iniciou o relatório.