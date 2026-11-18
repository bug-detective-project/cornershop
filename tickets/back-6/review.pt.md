# Code review: CS-206, ordenação e faixa de preço na listagem de produtos

Um endpoint de lista são três passos em ordem fixa: filtrar, ordenar e depois cortar uma página. Aqui está a abordagem de referência, para você comparar com a sua.

## Do que este ticket tratava

- A página ficou pronta antes da API. Um parâmetro que o servidor não lê é ignorado em silêncio, então nada falhava: a lista só nunca mudava.
- Ordenar tem um detalhe que só aparece com dados de verdade: valores iguais. Sem desempate, o banco pode devolver os empates em qualquer ordem, e um produto pode aparecer em duas páginas ou em nenhuma.
- Tudo o que quem chama envia é entrada, inclusive o nome de uma ordem e os dois limites de uma faixa.

## Por que a referência foi construída assim

- As ordens permitidas são uma lista só, que dá a validação, o tipo e a tabela de colunas. Acrescentar uma ordem é uma linha em cada.
- Toda ordem termina com o id, então o resultado é o mesmo em toda requisição.
- Os filtros entram numa lista que a contagem e a página usam, o que mantém o `total` honesto.
- Entrada ruim é recusada com o nome do campo, o mesmo contrato do resto da API, em vez de ser ignorada ou adivinhada.

## Compare com o que você construiu

- Você carregou todos os produtos e ordenou ou filtrou em JavaScript? Funciona com 60 produtos, lê a tabela inteira a cada requisição e obriga a refazer a paginação na mão.
- Você colocou o valor de `sort` direto no SQL (`order by ${sort}`)? É assim que começa uma injeção de SQL. Ligue valores permitidos a colunas.
- Você ordenou só a página que foi lida? Então "o mais barato primeiro" quer dizer o mais barato de dez produtos que vieram por nome.
- A sua faixa inclui os dois limites? Teste `minPrice=450&maxPrice=450`: quatro produtos.
- O que a sua API responde para `sort=cheapest`? Cair no padrão em silêncio esconde um bug de quem chamou.

## Para a próxima vez

- Para um endpoint de lista, escreva a ordem das operações: filtrar, ordenar (com desempate), paginar e contar com os mesmos filtros.
- Teste ordenação com dados que têm empates, e uma faixa exatamente nos seus dois limites.
