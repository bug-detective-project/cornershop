# Code review: CS-102, a grade de produtos cabe no celular

Rolagem para os lados no celular quase sempre vem de um elemento com largura mínima fixa. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- `repeat(auto-fill, minmax(360px, 1fr))` é um padrão copiado em todo lugar, e ele carrega uma suposição escondida: o contêiner tem pelo menos 360 px.
- No notebook a suposição sempre vale, então a grade parecia perfeita para quem escreveu.
- Uma trilha de grid nunca fica mais estreita que o mínimo do seu `minmax()`. Ela transborda.

## Por que a correção de referência está certa

- `min(100%, 18rem)` mantém o padrão e tira a suposição em um lugar só, sem breakpoint para manter.
- A página não precisou de `overflow-x: hidden`. Esconder o transbordo esconderia a parte cortada dos cartões, não consertaria.
- O layout do desktop não muda: a alteração só vale abaixo de 18rem de largura disponível.

## Compare com a sua correção

- Você usou breakpoints (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`)? Também é uma boa correção; agora é você quem escolhe o número de colunas em cada largura.
- Você pôs `overflow-x-hidden` na página? A rolagem lateral some, mas os cartões continuam cortados.
- Você baixou o mínimo para um valor menor em pixels? Isso empurra o problema para uma tela mais estreita.

## Para a próxima vez

- Teste toda página em 375 px antes de dar por pronta: é o celular mais estreito que a loja suporta.
- Quando uma página rola para os lados, procure o elemento cuja largura não vem do contêiner.
