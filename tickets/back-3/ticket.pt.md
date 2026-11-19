# CS-203: A página 2 da loja repete produtos da página 1

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Média |
| Relator | Lucy Tran (Atendimento ao cliente) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API de produtos (paginação) |
| Rótulos | `api`, `paginação` |
| Sprint | CS Sprint 12 |
| Criado em | 17/11/2026 08:50 |

## Descrição

Uma freguesa me disse que "fica vendo as mesmas coisas" na loja. Ela tem razão: os dois primeiros produtos da página 2 são os dois últimos da página 1. O mesmo acontece em toda página seguinte, e quando passei pelas cinco páginas não encontrei dois produtos que sei que temos (os últimos em ordem alfabética).

O desenvolvedor que estava antes de você disse que os testes de paginação da API passam todos.

## Passos para reproduzir

1. Abra a loja e anote os dois últimos produtos da primeira página.
2. Clique em **Next**.
3. Compare os dois primeiros produtos da página 2 com os que você anotou.
4. Vá até a última página e procure `Whole Milk 1 L` e `Wildflower Honey`.

## Resultado esperado

Cada página mostra os próximos produtos da lista. Nenhum produto aparece em duas páginas e nenhum fica de fora.

## Resultado atual

Cada página começa com produtos que a anterior já mostrou, e os últimos produtos da lista nunca são alcançados.

## Critérios de aceitação

- [ ] Percorrer todas as páginas de `GET /api/products` devolve cada produto exatamente uma vez, para qualquer `pageSize` (a loja usa 12).
- [ ] `total`, `page` e `pageSize` na resposta continuam certos.
- [ ] A paginação também funciona dentro de uma categoria e com uma busca.

## Ambiente

- CornerShop 1.0 (API)
- A loja pede 12 produtos por página; o padrão da API é 10

## Atividade

**Lucy Tran** · 17/11/2026 09:06
> Com o endereço `…/api/products?page=2` no navegador eu não vejo o problema. Na loja, sempre vejo.
