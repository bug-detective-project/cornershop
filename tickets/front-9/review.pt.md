# Code review: CS-109, o campo de preço do dono com a máscara dos filtros

A melhor linha de código aqui é a que você não escreveu. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o campo era comum

- A máscara foi feita primeiro para os filtros, como um componente próprio. O formulário era mais antigo e ninguém voltou nele.
- Dois campos que fazem o mesmo trabalho se comportando diferente é o tipo de falha que quem usa percebe antes de quem desenvolve.

## Por que a correção de referência está certa

- Ela reaproveita o `PriceInput`, então o painel e os filtros recebem preços do mesmo jeito, e um conserto na máscara conserta os dois.
- O formulário guarda o preço no mesmo texto simples, então salvar, editar e a mensagem de erro não mudaram.
- O `PriceInput` repassa ao `<input>` as props que não usa, então o rótulo, a classe e o `aria-describedby` continuam funcionando.

## Compare com a sua correção

- Você escreveu uma máscara nova dentro do formulário? Pode funcionar, mas agora são duas máscaras para manter de acordo, e a dos filtros trata um caso que a sua talvez não trate: uma página que devolve o valor atrasado.
- Você trocou o campo para `type="number"`? Ele abre o teclado de números, mas não mostra o `$` nem a vírgula de milhar, e aceita "4.567".
- Você guardou o preço em centavos no estado do formulário? Dá, mas aí editar, salvar e o erro de campo vazio tiveram que mudar junto.

## Para a próxima vez

- Antes de construir um pedaço de interface, procure um que já faça o trabalho em outro lugar do app.
- Mantenha o valor de um campo num formato só pelo app (aqui, o texto simples "4.50"); a máscara é só a aparência.
