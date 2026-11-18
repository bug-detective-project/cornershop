# CS-103: Detalhes abertos pulam para outro produto quando a lista é ordenada

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

Uma freguesa escreveu para a gente confusa. Ela abriu os **Details** do Sourdough Loaf para ler sobre o pão, depois ordenou a lista por preço, e a descrição aberta de repente era de um croissant. Ela achou que a loja tinha misturado os produtos.

Eu testei: os produtos ficam na ordem certa depois de ordenar, mas os detalhes abertos ficam no mesmo lugar da tela, embaixo do produto que for parar ali.

## Passos para reproduzir

1. Abra a loja e escolha a categoria **Bakery**.
2. Clique em **Details** no Sourdough Loaf.
3. Troque **Sort by** para **Price: low to high**.

## Resultado esperado

Os detalhes continuam abertos no Sourdough Loaf, para onde quer que ele vá, e só nele.

## Resultado atual

O cartão que agora está no lugar onde o pão estava fica com os detalhes abertos, e o pão fica com eles fechados.

## Critérios de aceitação

- [ ] Detalhes abertos continuam com o seu produto quando a lista é ordenada, em qualquer ordem.
- [ ] Também continuam com o seu produto quando a lista é filtrada por uma busca.
- [ ] Fechar os detalhes fecha no mesmo produto.

## Ambiente

- CornerShop 1.0, qualquer navegador

## Atividade

**Lucy Tran** · 16/11/2026 14:20
> Também acontece quando eu digito na busca com algum detalhe aberto.
