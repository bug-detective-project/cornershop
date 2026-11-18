# CS-204: A página de produto mostra um preço cem vezes menor

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Lucy Tran (Atendimento ao cliente) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API de produtos (detalhes do produto) |
| Rótulos | `api`, `preço` |
| Sprint | CS Sprint 12 |
| Criado em | 17/11/2026 13:40 |

## Descrição

Uma freguesa chegou com o celular, apontou a página do Sourdough Loaf e pediu o pão por **$0.05**. Na página da loja o mesmo pão está a **$4.50**, que é o preço certo. Na página dele, diz $0.05.

Conferi mais alguns: toda página de produto mostra um preço baixo demais, e os cartões da loja estão certos. A Marta olhou no banco e o preço lá está correto. Honramos os cinco centavos uma vez. Por favor, corrijam antes que vire costume.

## Passos para reproduzir

1. Abra a loja e busque por `Sourdough Loaf`. Anote o preço do cartão.
2. Clique no nome do produto para abrir a página dele. Anote o preço de lá.
3. Compare com o banco: `psql "$DATABASE_URL" -c "select name, price_cents from products where name = 'Sourdough Loaf'"`.

## Resultado esperado

A página do produto mostra o mesmo preço do cartão: $4.50.

## Resultado atual

O cartão mostra $4.50 e a página do produto mostra $0.05. O banco guarda 450.

## Critérios de aceitação

- [ ] `GET /api/products/:id` devolve o mesmo `priceCents` da lista e do banco: um número inteiro de centavos.
- [ ] As respostas de criar e de alterar um produto trazem o preço que foi salvo.
- [ ] A página do produto mostra o mesmo preço do cartão da loja.

## Ambiente

- CornerShop 1.0
- Todos os produtos são afetados; os cartões da loja não

## Atividade

**Lucy Tran** · 17/11/2026 13:58
> A cesta de presente, o nosso item mais caro, aparece a $1.29 na página dela. Custa $129.
