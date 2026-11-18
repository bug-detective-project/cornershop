# Solução: Um produto tem um preço só em todo lugar

**Causa.** Em `server/src/repository.ts`, o `toDetail` (usado por `GET /api/products/:id` e pelas respostas de criar e de alterar um produto) devolve `priceCents: product.priceCents / 100`. O campo se chama `priceCents` e todo mundo que o lê o trata como centavos: o cliente divide por 100 de novo para formatar, então 450 vira 4.5 e depois "$0.05". O `toListItem`, a função gêmea usada pela lista, devolve o valor como está guardado.

## Passo a passo

1. **Siga o valor.** Banco: `450`. `GET /api/products?q=sourdough loaf`: `"priceCents": 450`. `GET /api/products/<id>`: `"priceCents": 4.5`. O número muda dentro da API, entre a linha e a resposta da rota de detalhes.
2. **Ache onde a resposta de detalhes é montada.** O `findProduct` chama o `toDetail`. Compare linha a linha com o `toListItem`, logo acima.
3. **Devolva os centavos como estão:** `priceCents: product.priceCents`. O dinheiro fica em centavos inteiros do banco até a API; só a tela transforma em texto.
4. **Adicione um teste de regressão.** A referência adiciona `server/src/price-cents.test.ts`: o preço é o mesmo número inteiro na lista, nos detalhes e no banco, e volta como foi enviado depois de criar e de alterar.

Depois rode `npm test`, abra a página do pão e mova o card para **Em QA**.
