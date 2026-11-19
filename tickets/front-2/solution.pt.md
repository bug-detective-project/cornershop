# Solução: A grade de produtos cabe no celular

**Causa.** Em `client/src/components/ProductGrid.tsx` a grade é `repeat(auto-fill, minmax(360px, 1fr))`: quantas colunas couberem, cada uma com pelo menos 360 px. Os celulares que a loja suporta têm de 375 a 414 px, e a página tem 16 px de espaço de cada lado, então nem uma coluna cabe: ela mantém os 360 px e transborda.

## Passo a passo

1. **Ache o que transborda.** No modo de dispositivo em 375 px, o `<ul>` da grade tem 343 px e a única coluna tem 360 px.
2. **Faça o mínimo depender do espaço.** Troque a classe por `grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))]`. Uma coluna tem pelo menos 18rem, mas nunca mais que a própria grade: o `min()` escolhe o menor dos dois.
3. **Confira as outras larguras.** Tablet: duas colunas. Desktop: três ou mais. Nada mais muda, porque telas largas nunca caem no `100%`.
4. **Adicione um teste de regressão.** A referência adiciona `client/src/components/ProductGrid.layout.test.tsx`, que recusa uma coluna com largura mínima fixa.

Depois rode `npm test`, teste a loja em 375 px e em 1280 px e mova o card para **Em QA**.
