# Solução: Detalhes abertos continuam com o seu produto

**Causa.** Em `client/src/components/ProductGrid.tsx` os itens da lista usam a posição como chave: `key={index}`. O React usa a key para ligar cada item ao componente que ele renderizou antes. Com o índice como key, depois de ordenar o React mantém o mesmo componente (e o estado "detalhes abertos" dele) na mesma posição e só entrega outro produto para ele.

## Passo a passo

1. **Veja o que se move e o que fica.** Depois de ordenar, nomes e preços trocam de lugar, mas os detalhes abertos não: as props seguem os dados, o estado segue a key.
2. **Use a identidade do dado como key.** Troque `products.map((product, index) => <li key={index}>` por `products.map((product) => <li key={product.id}>`. Agora o React move cada cartão, com o estado, junto com o produto.
3. **Teste de novo.** Abra detalhes, ordene, busque: os detalhes acompanham o pão.
4. **Adicione um teste de regressão.** A referência adiciona `client/src/pages/Storefront.details.test.tsx`, que abre os detalhes e depois ordena e filtra a lista.

Depois rode `npm test`, teste na loja e mova o card para **Em QA**.
