# CS-102: No celular, a grade de produtos é uma coluna cortada à direita

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Lucy Tran (Atendimento ao cliente) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Vitrine (grade de produtos) |
| Rótulos | `vitrine`, `responsivo` |
| Sprint | CS Sprint 12 |
| Criado em | 16/11/2026 10:15 |

## Descrição

Três fregueses me disseram esta semana que a loja "não cabe" no celular. Conferi no meu: aparece uma coluna de produtos e o lado direito de cada cartão fica cortado. A página também desliza para os lados, o que nunca aconteceu.

A maioria dos nossos fregueses olha a loja no celular a caminho daqui.

## Passos para reproduzir

1. Abra a loja.
2. Deixe a janela estreita como um celular (ou use o modo de dispositivo do DevTools, com 375 px de largura).
3. Role a lista para baixo e depois tente rolar para os lados.

## Resultado esperado

No celular os cartões cabem na largura da tela e a página não rola para os lados. No desktop a grade continua com as suas colunas.

## Resultado atual

Cada cartão é mais largo que a tela: o lado direito fica cortado e a página rola para os lados.

## Critérios de aceitação

- [ ] Com 375 e 414 px de largura, nenhum cartão passa da borda da tela e a página não rola para os lados.
- [ ] No tablet a grade tem mais de uma coluna.
- [ ] No desktop (1280 px) a grade continua com pelo menos três colunas.

## Ambiente

- CornerShop 1.0, Chrome no Android e Safari no iPhone
- No notebook está certo

## Atividade

**Lucy Tran** · 16/11/2026 10:31
> No meu celular antigo (um pequeno) é pior ainda, falta quase um terço do cartão.
