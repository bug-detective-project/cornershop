# CS-109: Digitar preços no painel do jeito que os filtros de preço aceitam

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | História |
| Status | A fazer |
| Prioridade | Média |
| Relator | Marta Okafor (Dona) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Painel do dono (formulário de produto) |
| Rótulos | `admin`, `formulários` |
| Sprint | CS Sprint 12 |
| Criado em | 19/11/2026 09:10 |

## Descrição

Na página da loja, os campos **Min price** e **Max price** são uma maravilha: eu digito 4, 5, 0 e eles mostram **$4.50**, o celular abre o teclado de números, e letra simplesmente não entra. O campo **Price** do meu formulário de produto, no painel, ainda é uma caixa de texto comum: eu digito "4.5", "$4,50" ou "4.50" e só descubro quando clico em **Save** se foi aceito.

Por favor, faça o **Price** do painel funcionar igualzinho aos filtros de preço.

## O que já existe

- `client/src/components/PriceInput.tsx`: o campo de preço com máscara que os filtros usam (`client/src/components/Filters.tsx`). Ele recebe o preço como texto simples (`value`, por exemplo `"4.50"`) e devolve do mesmo jeito (`onChange`).
- O formulário de produto, `client/src/components/ProductForm.tsx`, guarda o preço como texto simples em `values.price` e o transforma em centavos com `parsePrice` quando salva.

## O que construir

- O campo **Price** do formulário recebe os dígitos pela direita, como centavos: digitar 4, 5, 0 mostra **$4.50**.
- Tudo que não é dígito é ignorado, e o Backspace tira o último dígito.
- No celular o campo abre o teclado de números.
- Editar um produto mostra o preço com a máscara (o Matches mostra **$1.20**), e um preço digitado com a máscara é salvo em centavos.
- O campo mantém o rótulo **Price** e mostra o erro **Enter a price like 4.50** quando fica vazio, como hoje.

## Critérios de aceitação

- [ ] Digitar 4, 5, 0 em **Price** mostra $0.04, depois $0.45, depois $4.50.
- [ ] Letras, vírgulas e pontos são ignorados; o Backspace tira o último dígito.
- [ ] O campo abre o teclado de números no celular.
- [ ] **Edit** no Matches mostra **$1.20** em **Price**.
- [ ] Um produto salvo com 4, 5, 0 digitados em **Price** aparece com **$4.50** na lista.

## Ambiente

- CornerShop 1.0

## Atividade

**Marta Okafor** · 19/11/2026 09:25
> Mesma sensação dos filtros, por favor. Eu digito preço o dia inteiro.
