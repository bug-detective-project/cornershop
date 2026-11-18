# CS-201: Um produto pode ser salvo com preço negativo

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Marta Okafor (Dona) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API de produtos (validação) |
| Rótulos | `api`, `validação` |
| Sprint | CS Sprint 12 |
| Criado em | 16/11/2026 09:05 |

## Descrição

O nosso fornecedor manda um arquivo de preços toda semana, e um script deles cadastra os produtos novos pela API. Na semana passada uma linha veio com erro de digitação, `-500` em vez de `500`, e a loja mostrou uma geleia a **-$5.00** por uma tarde inteira. Uma freguesa perguntou no balcão se a gente pagaria para ela levar.

A API deveria ter recusado esse produto. Ela aceitou e respondeu como se estivesse tudo certo. Também vi passar um preço `4.5`, que nem é um número de centavos.

## Passos para reproduzir

1. Com o app rodando, envie um produto com preço negativo:
   `curl -i -X POST http://localhost:3001/api/products -H "Content-Type: application/json" -d '{"name":"Fig Jam","priceCents":-500,"stock":5}'`
2. Olhe o status da resposta.
3. Abra a loja e busque por `Fig Jam`.

## Resultado esperado

A API responde **400** e diz qual campo está errado, como já faz para um produto sem nome ou com estoque negativo. Nada é salvo.

## Resultado atual

A API responde **201 Created** e o produto aparece na loja com preço negativo.

## Critérios de aceitação

- [ ] `POST /api/products` com um `priceCents` negativo, não inteiro ou que não é número responde 400 com `{ "error": "Invalid product", "fields": { "priceCents": "…" } }`, e não salva nada.
- [ ] `PATCH /api/products/:id` recusa os mesmos valores e mantém o preço antigo.
- [ ] O preço `0` é permitido (amostras grátis), e produtos válidos continuam sendo criados com 201.
- [ ] Os outros campos continuam validados como antes.

## Ambiente

- CornerShop 1.0 (API)
- Reproduzido com `curl` e pelo script do fornecedor

## Atividade

**Marta Okafor** · 16/11/2026 09:19
> Corrigi a geleia na mão pelo painel. O painel não me deixa digitar preço negativo, então o problema é o que a API aceita.
