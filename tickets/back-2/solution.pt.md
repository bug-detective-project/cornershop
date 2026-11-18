# Solução: Produtos sem categoria aparecem na lista

**Causa.** Em `server/src/repository.ts`, o `listProducts` junta `products` com `categories` usando `innerJoin`. Um inner join devolve só as linhas que casam dos dois lados, então um produto com `category_id` nulo não casa com nenhuma categoria e some do resultado. A mesma junção é usada pela consulta que conta o total.

## Passo a passo

1. **Conte dos dois lados.** A tabela tem 60 produtos; a API diz `total: 54`. Os seis que faltam têm todos `category_id` nulo.
2. **Mantenha todo produto.** Na consulta que lê a página, troque `.innerJoin(categories, eq(products.categoryId, categories.id))` por `.leftJoin(…)`. Um left join mantém toda linha de `products`; onde não há categoria, a coluna `category` do resultado é null.
3. **Corrija a contagem também.** A consulta que calcula o `total` tem a mesma junção. Troque nela também, senão a lista e o total discordam e a última página some.
4. **Confira o filtro de categoria.** O filtro compara `categories.slug`; para um produto sem categoria essa coluna é null, então ele fica fora de uma lista filtrada, como deve ser.
5. **Adicione um teste de regressão.** A referência adiciona `server/src/uncategorized.test.ts`: produtos sem categoria são listados, contados e encontrados pela busca, e ficam fora de um filtro de categoria.

Depois rode `npm test`, compare as duas contagens de novo e mova o card para **Em QA**.
