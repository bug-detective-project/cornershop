# CS-101: Nome longo de produto passa por cima do preço e sai do cartão

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Média |
| Relator | Marta Okafor (Dona) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Vitrine (cartão de produto) |
| Rótulos | `vitrine`, `css` |
| Sprint | CS Sprint 12 |
| Criado em | 16/11/2026 08:40 |

## Descrição

Cadastrei ontem o nosso pão novo, "Grandma Lucia's Slow-Fermented Whole Wheat Sourdough Country Loaf (Large)". Na página da loja o cartão dele está quebrado: o nome fica numa linha só, atravessa o cartão inteiro e o preço sumiu. Todos os outros cartões estão certos.

Os fregueses perguntam o preço desse pão no balcão porque não conseguem ver no site.

## Passos para reproduzir

1. Abra a loja.
2. Busque por `Grandma`.
3. Olhe o cartão do pão de nome longo e depois deixe a janela mais estreita e mais larga.

## Resultado esperado

O nome cabe dentro do cartão (cortado com "…" ou quebrado em linhas) e o preço, $8.90, aparece ao lado, em qualquer largura de janela.

## Resultado atual

O nome passa da borda do cartão e o preço é empurrado para fora da área visível.

## Critérios de aceitação

- [ ] No celular, no tablet e no desktop, o nome longo fica dentro do cartão.
- [ ] O nome nunca cobre o preço, e o preço aparece por inteiro.
- [ ] Os cartões de nome curto continuam como estavam.

## Ambiente

- CornerShop 1.0, Chrome
- Acontece em qualquer largura de janela

## Atividade

**Marta Okafor** · 16/11/2026 08:52
> O nome é longo de propósito, é como a Lucia quer no rótulo. Por favor, não encurtem no banco.
