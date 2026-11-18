# CS-105: Os botões de estoque do painel não funcionam pelo teclado e não têm nome

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | Bug |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Dev Patel (Atendente da loja) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Painel do dono (estoque) |
| Rótulos | `admin`, `acessibilidade` |
| Sprint | CS Sprint 12 |
| Criado em | 17/11/2026 11:30 |

## Descrição

Eu atualizo o estoque no balcão o dia inteiro, só com o teclado: a mão direita costuma estar com o leitor de código de barras ou com uma caixa. No painel, o **−** e o **+** ao lado do estoque de cada produto não são alcançados com Tab. Consigo chegar com Tab em Edit e Delete, mas os dois controles de estoque são pulados. Apertar Enter ou Espaço perto deles não faz nada.

Minha colega Ana usa leitor de tela. Ela diz que, quando chega neles por outro caminho, o leitor não anuncia nada útil: nem "botão", nem o nome do produto.

Com o mouse funcionam.

## Passos para reproduzir

1. Abra o painel do dono (**Admin**).
2. Aperte Tab para andar pela lista de produtos.
3. Tente mudar o estoque de um produto sem o mouse.

## Resultado esperado

Cada controle de estoque é um botão que o Tab alcança, que funciona com Enter e Espaço e que diz o que faz e para qual produto ("Increase stock of Umbrella").

## Resultado atual

O Tab pula de uma linha para a outra sem parar nos controles de estoque, e eles não têm papel nem nome.

## Critérios de aceitação

- [ ] Cada produto do painel tem um botão chamado **Increase stock of <nome do produto>** e um chamado **Decrease stock of <nome do produto>**.
- [ ] O Tab alcança os dois, e Enter e Espaço mudam o estoque e salvam.
- [ ] O botão de diminuir fica desabilitado quando o estoque é 0.
- [ ] Clicar com o mouse continua funcionando.

## Ambiente

- CornerShop 1.0, Chrome, só teclado
- Testado também com o leitor de tela NVDA

## Atividade

**Dev Patel** · 17/11/2026 11:48
> Edit e Delete na mesma linha funcionam bem pelo teclado, então é algo com esses dois.
