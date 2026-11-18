# Solução: Ordenação e faixa de preço na listagem de produtos

**O que faltava.** O endpoint da lista só lia `category`, `q`, `page` e `pageSize`. A vitrine já enviava `sort`, `minPrice` e `maxPrice`, mas nada na API os lia, então a ordem era sempre por nome e nenhum preço era filtrado.

## Passo a passo

1. **Dê nome às ordens permitidas.** Em `server/src/types.ts`: `export const SORTS = ['name', 'price_asc', 'price_desc', 'newest'] as const;` e `export type Sort = (typeof SORTS)[number];`.
2. **Valide.** No `parseListQuery` (`server/src/validation.ts`): `sort` tem `name` como padrão e precisa estar em `SORTS`; `minPrice` e `maxPrice` passam pelo `wholeNumber`; um `maxPrice` menor que o `minPrice` é erro em `maxPrice`. Cada problema acrescenta uma entrada em `fields`, e a função devolve os três valores novos junto com os outros.
3. **Filtre.** No `listProducts` (`server/src/repository.ts`): `if (query.minPrice !== undefined) filters.push(gte(products.priceCents, query.minPrice))` e o mesmo com `lte` para `maxPrice`. As duas consultas usam o `where`, então o total acompanha.
4. **Ordene.** Uma tabela `ORDERS: Record<Sort, SQL[]>` liga cada valor às suas colunas: `price_asc: [asc(products.priceCents), asc(products.id)]`, `price_desc: [desc(products.priceCents), asc(products.id)]`, `newest: [desc(products.createdAt), asc(products.id)]`, `name: [asc(byName), asc(products.id)]`. A consulta vira `.orderBy(...ORDERS[query.sort])`.
5. **Deixe o banco fazer.** Ordenar e filtrar acontecem no SQL, antes do `limit` e do `offset`, então a página 2 é a página 2 da lista ordenada e filtrada.
6. **Adicione testes.** A referência adiciona `server/src/price-range-and-sort.test.ts`: cada ordem, os empates, a faixa sozinha e combinada, o total e todos os 400.

Depois rode `npm test`, teste o seletor e os campos de preço na loja e mova o card para **Em QA**.
