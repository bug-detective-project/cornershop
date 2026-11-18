# Code review: CS-202, produtos sem categoria aparecem na lista

O tipo de junção é uma decisão sobre as linhas que não têm par. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- `innerJoin` soa natural ("produtos com as suas categorias") e dá a resposta certa enquanto todo produto tem categoria. A coluna é opcional, então isso nunca foi garantido.
- Os dados de exemplo usados quando a lista foi escrita tinham categoria em todo produto. As linhas que mostram o bug vieram depois.
- O construtor de consultas espelha o SQL: `innerJoin` e `leftJoin` diferem por uma palavra, e a biblioteca faz exatamente o que foi pedido.

## Por que a correção de referência está certa

- Um left join diz o que a lista significa: todo produto, com a categoria quando tem.
- A consulta da página e a da contagem mudam juntas. Uma lista cujo total discorda das linhas quebra a paginação de um jeito difícil de notar.
- A API já descrevia `category` como podendo ser null, então ninguém que a chama precisa mudar.

## Compare com a sua correção

- Você corrigiu só a consulta que lê as linhas? Confira o `total`: com 60 produtos e total 54, a última página não é alcançada.
- Você carregou os produtos sem categoria numa segunda consulta e juntou as duas listas em JavaScript? Ordenar e paginar entre as duas listas agora é trabalho seu, a cada requisição.
- Você deu a esses produtos uma categoria padrão nos dados? A dona classifica depois de propósito.

## Para a próxima vez

- Quando uma coluna pode ser nula e você junta por ela, decida em voz alta o que acontece com as linhas em que ela é nula.
- Mantenha nos dados de teste uma linha de cada caso opcional: sem categoria, sem foto, sem estoque.
- Quando uma lista parece curta, compare o `count(*)` do banco com o que a API responde antes de ler código.
