# CS-106: Produto novo só aparece na lista depois de recarregar

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Marta Okafor (Dona) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Painel do dono (novo produto) |
| Rótulos | `admin`, `cache` |
| Sprint | CS Sprint 12 |
| Criado em | 17/11/2026 15:20 |

## Descrição

Quando cadastro um produto no painel, o formulário diz **Product created**, mas o produto não está na lista embaixo, nem na loja. Achei que não tinha salvado e cadastrei de novo. E de novo. Depois que recarreguei a página, havia três.

Editar um produto e remover um atualizam a lista na hora. São só os novos.

## Passos para reproduzir

1. Abra o painel do dono (**Admin**).
2. Preencha um nome e um preço e clique em **Save**.
3. Olhe a lista do painel e depois vá para **Shop** pelo link do topo.
4. Recarregue a página.

## Resultado esperado

Depois de **Product created**, o produto está na lista do painel e na loja, sem recarregar.

## Resultado atual

O produto só aparece depois que a página é recarregada.

## Critérios de aceitação

- [ ] Um produto novo aparece na lista do painel logo depois de criado, sem recarregar.
- [ ] Ele também aparece na loja quando vou para lá pelo link do topo da página.
- [ ] Editar e remover continuam atualizando a lista na hora.

## Ambiente

- CornerShop 1.0, qualquer navegador

## Atividade

**Marta Okafor** · 17/11/2026 15:41
> Removi os dois que sobraram. Remover atualizou a lista na hora, e foi isso que me fez notar que criar não atualiza.
