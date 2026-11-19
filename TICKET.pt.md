# CS-104: O filtro de categoria some ao recarregar e não vai nos links compartilhados

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Média |
| Relator | Lucy Tran (Atendimento ao cliente) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Vitrine (filtros) |
| Rótulos | `vitrine`, `rotas` |
| Sprint | CS Sprint 12 |
| Criado em | 17/11/2026 09:10 |

## Descrição

Eu mando links das nossas prateleiras para os fregueses o tempo todo ("aqui está tudo o que temos na padaria"). O link que eu copio com a categoria Bakery escolhida abre a loja inteira para eles, não a padaria.

Acontece comigo também quando recarrego a página: a categoria volta para "All categories". A busca não tem esse problema: quando busco algo e recarrego, a busca continua lá.

## Passos para reproduzir

1. Abra a loja e escolha a categoria **Bakery**.
2. Olhe a barra de endereço e depois recarregue a página.
3. Escolha **Bakery**, depois **Dairy**, e aperte o botão Voltar do navegador.

## Resultado esperado

A categoria escolhida faz parte do endereço. Recarregar, abrir um link compartilhado e usar o Voltar mostram a prateleira que foi escolhida.

## Resultado atual

O endereço nunca muda quando uma categoria é escolhida. Recarregar e abrir um link mostram todos os produtos, e o Voltar sai da loja em vez de voltar para a categoria anterior.

## Critérios de aceitação

- [ ] Escolher uma categoria coloca a categoria no endereço (`?category=bakery`).
- [ ] Recarregar e abrir um link direto mostram aquela categoria, na lista e no seletor.
- [ ] O botão Voltar retorna para a categoria escolhida antes.
- [ ] Escolher uma categoria mantém a busca digitada e volta para a primeira página.

## Ambiente

- CornerShop 1.0, qualquer navegador

## Atividade

**Lucy Tran** · 17/11/2026 09:24
> Por enquanto eu peço para os fregueses abrirem a loja e escolherem a categoria eles mesmos. Metade não escolhe.
