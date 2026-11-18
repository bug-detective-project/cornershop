# Solução: Cada página mostra produtos diferentes

**Causa.** No `listProducts` (`server/src/repository.ts`) a consulta pega `pageSize` linhas (`limit(pageSize)`) mas pula `(page - 1) * DEFAULT_PAGE_SIZE` linhas. Com o tamanho padrão (10) os dois números batem, e é por isso que os testes existentes passam. A loja pede 12 por página: a página 2 pula 10 linhas em vez de 12, então começa com os dois últimos produtos da página 1, e cada página seguinte se desloca mais dois.

## Passo a passo

1. **Reproduza com o tamanho de página da loja.** `?pageSize=12&page=2` começa no 11º produto; deveria começar no 13º.
2. **Pule pelo tamanho que foi pedido.** Troque o offset por `.offset((page - 1) * pageSize)`.
3. **Remova a importação** de `DEFAULT_PAGE_SIZE` do `repository.ts`, que não é mais usada ali. O padrão continua valendo onde deve: no `parseListQuery`, quando quem chama não envia `pageSize`.
4. **Adicione um teste de regressão.** A referência adiciona `server/src/pagination.test.ts`: com 12, 5, 25 e 50 por página, percorrer as páginas devolve cada produto exatamente uma vez.

Depois rode `npm test`, percorra as páginas da loja e mova o card para **Em QA**.
