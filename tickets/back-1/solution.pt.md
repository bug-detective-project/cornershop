# Solução: Um produto precisa de um preço válido

**Causa.** Em `server/src/validation.ts`, o `parseProduct` confere o preço com `typeof input.priceCents !== 'number'`. Isso só recusa valores que nem são números. `-500` e `4.5` são números, então passam, o produto é inserido e a rota responde 201. O estoque, dois blocos abaixo, usa `isCount`, que pede um número inteiro de zero para cima.

## Passo a passo

1. **Confirme na API.** O `curl` do ticket responde `201 Created`; a mesma requisição com `"stock": -1` responde `400` e aponta o campo.
2. **Use a mesma regra do estoque.** Troque a condição por `if (!isCount(input.priceCents))`. O `isCount` aceita inteiros de 0 até o maior inteiro que a coluna do banco guarda.
3. **Diga o que é esperado.** A mensagem vira `priceCents must be a whole number of cents, 0 or more`, para quem chama a API saber como corrigir a requisição.
4. **Confira a rota de alteração.** O `PATCH` usa a mesma função com `partial: true`, então a mesma linha corrige os dois.
5. **Adicione um teste de regressão.** A referência adiciona `server/src/price-validation.test.ts`: preços negativos, fracionados, em texto, ausentes e enormes são recusados ao criar e ao alterar, e zero é aceito.

Depois rode `npm test`, repita o `curl` e mova o card para **Em QA**.
