# CS-103: A foto escolhida num cartão pula para outro produto quando a lista é ordenada

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Média |
| Relator | Lucy Tran (Atendimento ao cliente) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Vitrine (lista de produtos) |
| Rótulos | `vitrine`, `react` |
| Sprint | CS Sprint 12 |
| Criado em | 16/11/2026 14:05 |

## Descrição

Uma freguesa escreveu para a gente confusa. No Sourdough Loaf ela clicou nos pontinhos da foto para ver a segunda foto, a do pão esfriando na grade. Depois ordenou a lista por preço, e o Sourdough Loaf tinha voltado para a primeira foto, enquanto o pão grande da Grandma Lucia agora mostrava a segunda foto dele, que ela nunca escolheu. Ela achou que a loja tinha misturado as fotos.

Eu testei: os produtos ficam na ordem certa depois de ordenar, mas a foto escolhida fica no mesmo lugar da tela, no produto que for parar ali.

## Passos para reproduzir

1. Abra a loja e escolha a categoria **Bakery**.
2. No Sourdough Loaf, clique no segundo pontinho da foto (**Photo 2**).
3. Troque **Sort by** para **Price: low to high**.

## Resultado esperado

O Sourdough Loaf continua mostrando a segunda foto, para onde quer que ele vá, e todo outro cartão continua com a foto que tinha.

## Resultado atual

O Sourdough Loaf volta para a primeira foto, e o cartão que agora está no lugar onde ele estava mostra a segunda foto dele.

## Critérios de aceitação

- [ ] A foto escolhida num cartão continua com o seu produto quando a lista é ordenada, em qualquer ordem.
- [ ] Também continua com o seu produto quando a lista é filtrada por uma busca.
- [ ] Voltar para a primeira foto muda o mesmo produto, e nenhum outro.

## Ambiente

- CornerShop 1.0, qualquer navegador

## Atividade

**Lucy Tran** · 16/11/2026 14:20
> Também acontece quando eu digito na busca depois de escolher uma foto.
