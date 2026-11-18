# CS-206: Construir a ordenação e a faixa de preço na listagem de produtos da API

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | História |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Marta Okafor (Dona) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API de produtos (listagem) |
| Rótulos | `api`, `listagem` |
| Sprint | CS Sprint 12 |
| Criado em | 18/11/2026 11:10 |

## Descrição

A página da loja tem um seletor **Sort by** e dois campos, **Min price** e **Max price**. Eles foram colocados na página antes da hora: a página envia `sort`, `minPrice` e `maxPrice` para a API, e a API ignora os três. O que quer que eu escolha, a lista vem por nome, com todos os preços.

Os fregueses pedem duas coisas o tempo todo: "mostra o mais barato primeiro" e "o que vocês têm por menos de cinco dólares". Por favor, façam a API atender. A página não precisa mudar.

## O que já existe

- `GET /api/products` já filtra por `category` e `q`, e pagina com `page` e `pageSize`. Responde `{ items, total, page, pageSize }`.
- `server/src/validation.ts`: o `parseListQuery` lê a query string e lança um `ValidationError` com os campos ruins, que vira um 400 com `{ "error": "Invalid query", "fields": { … } }`. Veja como `page` e `pageSize` são feitos.
- `server/src/repository.ts`: o `listProducts` monta a lista de filtros, a consulta que conta o total e a consulta que lê a página. Hoje a lista é ordenada por nome.
- A vitrine já envia os três parâmetros. Os preços viajam em centavos.

## O que construir

- `sort`: um de `name` (o padrão), `price_asc`, `price_desc` ou `newest` (por `createdAt`, o mais recente primeiro). Qualquer outro valor responde 400 e aponta o campo `sort`.
- Seja qual for a ordem, produtos que empatam (mesmo preço, por exemplo) vêm por `id`, do menor para o maior, para que as páginas nunca dependam de sorte.
- `minPrice` e `maxPrice`: números inteiros de centavos, 0 ou mais. Só são listados os produtos com `minPrice <= priceCents <= maxPrice`; os dois limites entram, e cada parâmetro funciona sozinho.
- Um valor que não é um inteiro de 0 para cima responde 400 e aponta o campo. Um `maxPrice` menor que o `minPrice` responde 400 e aponta `maxPrice`.
- O `total` conta só os produtos que casam, e os parâmetros novos funcionam junto com `category`, `q`, `page` e `pageSize`.

## Critérios de aceitação

- [ ] `sort=price_asc`, `price_desc`, `newest` e `name` ordenam a lista inteira (não só uma página), e os empates vêm por id.
- [ ] `minPrice` e `maxPrice` filtram em centavos, com os dois limites incluídos, sozinhos ou juntos.
- [ ] O `total` e as páginas acompanham os filtros.
- [ ] Valores inválidos respondem 400 com o campo em `fields`: um `sort` desconhecido, um preço negativo, fracionado ou que não é número, um `maxPrice` menor que o `minPrice`.
- [ ] A categoria, a busca e a paginação continuam funcionando como antes.

## Ambiente

- CornerShop 1.0 (API)
- Na loja de exemplo o produto mais barato é o Chewing Gum (95 centavos) e o mais caro é a Gift Hamper with Sparkling Wine (12900 centavos)

## Atividade

**Marta Okafor** · 18/11/2026 11:26
> Quatro dos nossos produtos custam exatamente $4.50. Quando ordeno por preço quero que eles venham na mesma ordem toda vez, não embaralhados a cada visita.
