# Code review: CS-101, nome longo de produto fica dentro do cartão

Esta é a armadilha de flexbox que quase todo mundo encontra uma vez. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O `truncate` precisa de uma caixa mais estreita que o texto. Numa linha flex, a caixa em volta do texto podia ter a largura do texto, então não havia o que cortar.
- O `min-width` padrão de um item flex é `auto`, não `0`. Esse padrão protege o conteúdo de ser espremido, e é exatamente o que quebra as reticências dentro de linhas flex.
- Só um produto tinha nome longo o bastante para mostrar o problema, então o bug ficava escondido atrás dos dados comuns.

## Por que a correção de referência está certa

- O `min-w-0` vai no item flex (o título), não no texto: é o item que se recusa a encolher.
- O `shrink-0` no preço diz qual dos dois cede. Sem ele, um cartão muito estreito poderia espremer o preço.
- O nome completo continua disponível no atributo `title`, então nada se perde quando ele é cortado.

## Compare com a sua correção

- Você deixou o nome quebrar em mais linhas? Também é uma correção válida; confira se os cartões da mesma linha continuam alinhados.
- Você pôs um `max-width` fixo em pixels no nome? Funciona numa largura de janela e quebra na seguinte.
- Você encurtou o nome nos dados? A dona pediu para manter.

## Para a próxima vez

- Quando as reticências não aparecem dentro de um layout flex ou grid, procure um `min-width: 0` faltando no item.
- Teste listas com o maior e o menor valor reais, não só com os típicos.
