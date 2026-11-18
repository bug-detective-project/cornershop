# Code review: CS-106, produto novo aparece sem recarregar

Um cache deixa o app rápido e cria um dever: toda escrita precisa dizer o que ela deixou velho. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O dado foi salvo. O que a dona via era uma cópia feita antes de salvar, da qual o cliente não tinha motivo para duvidar.
- O comentário acima das mutações diz que cada uma invalida as listas. O código de uma delas deixou de bater com o comentário, e acreditaram no comentário.
- Com as configurações padrão da biblioteca (dado velho na hora, nova busca quando a janela ganha foco) o bug quase sempre se esconderia. Um tempo de cache sensato fez ele aparecer toda vez.

## Por que a correção de referência está certa

- Invalidar pergunta de novo ao servidor, então a lista fica com o que o servidor decidiu: o id, a data de criação, a posição na ordem.
- A chave é o prefixo comum, então o painel, a vitrine e qualquer lista filtrada ficam cobertos por uma linha.
- É a mesma linha que as outras duas mutações usam: uma regra para toda escrita.

## Compare com a sua correção

- Você adicionou o produto novo à lista em cache na mão, com `setQueryData`? Evita uma requisição, mas é preciso colocar no lugar certo de cada lista em cache (ordenada, filtrada, paginada).
- Você pôs `staleTime` em 0, ou ligou a nova busca ao focar a janela? Isso esconde este bug e faz toda tela perguntar ao servidor muito mais vezes.
- Você recarregou a página pelo código depois de salvar? Funciona e joga fora tudo para o que o cache servia.

## Para a próxima vez

- Quando criar uma mutação, escreva ao lado quais consultas ela deixa desatualizadas.
- Quando a tela e o servidor discordam, olhe primeiro a aba Network: ela diz se o errado é o dado ou a cópia.
