# CS-202: Produtos sem categoria não aparecem na loja

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Marta Okafor (Dona) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API de produtos (listagem) |
| Rótulos | `api`, `banco` |
| Sprint | CS Sprint 12 |
| Criado em | 16/11/2026 11:45 |

## Descrição

Quando chega algo novo eu cadastro na hora e escolho a categoria depois, quando sobra um minuto. Esses produtos não estão aparecendo: nem na loja, nem na lista do painel. Hoje de manhã cadastrei um guarda-chuva três vezes até entender que ele estava sendo salvo e só não era listado.

Assim que dou uma categoria ao produto, ele aparece.

## Passos para reproduzir

1. Abra o painel do dono e cadastre um produto, deixando **Category** como "No category".
2. Procure por ele na lista do painel e na loja.
3. Rode `psql "$DATABASE_URL" -c "select count(*) from products"` no terminal e compare com o número de produtos que a loja lista.

## Resultado esperado

Todo produto é listado, com ou sem categoria, e o total conta todos.

## Resultado atual

Produtos sem categoria são salvos no banco mas não estão na lista, e o total os deixa de fora.

## Critérios de aceitação

- [ ] `GET /api/products` lista também os produtos sem categoria, com `"category": null`.
- [ ] O `total` conta esses produtos, e a busca os encontra.
- [ ] Filtrar por uma categoria continua mostrando só os produtos daquela categoria.

## Ambiente

- CornerShop 1.0 (API)
- A loja de exemplo tem seis produtos sem categoria (por exemplo Umbrella e Matches)

## Atividade

**Marta Okafor** · 16/11/2026 12:02
> O banco tem 60 produtos. A loja lista 54.
