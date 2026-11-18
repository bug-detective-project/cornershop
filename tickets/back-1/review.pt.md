# Code review: CS-201, um produto precisa de um preço válido

Uma API é usada por mais gente que o seu próprio front, e é o último lugar onde um dado ruim pode ser barrado. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- Conferir o tipo parecia validação, mas um tipo diz que espécie de valor é, não se o valor faz sentido. Um preço tem faixa e unidade.
- O painel nunca envia preço negativo, então ninguém viu o buraco pela tela. O script do fornecedor fala direto com a API.
- O código de status piorou: o `201` disse ao script que estava tudo certo, então ninguém antes da loja percebeu.

## Por que a correção de referência está certa

- A regra mora na API, por onde todo mundo passa: o painel, um script, o `curl`.
- Ela responde `400` com o nome do campo, o contrato que a API já tinha para os outros campos. Quem chama consegue mostrar a mensagem ao lado do campo certo.
- Ela reaproveita o `isCount`, então preço e estoque seguem uma definição só de "uma contagem" e não se afastam.
- O zero continua válido. Recusar seria uma regra nova que ninguém pediu.

## Compare com a sua correção

- Você só conferiu `priceCents >= 0`? Então `4.5` ainda passa, e o banco (uma coluna inteira) responde com um erro que chega a quem chamou como 500.
- Você corrigiu no formulário do painel? O painel nunca foi o problema.
- Você respondeu `422` ou `500`? A API usa 400 com `fields` para todo corpo inválido; um formato diferente para um campo quebra quem a chama.
- Você corrigiu o `POST` e esqueceu o `PATCH`? Confira de onde cada rota tira a validação.

## Para a próxima vez

- Para cada campo que uma API aceita, escreva o tipo, a faixa e a unidade, e teste o primeiro valor fora de cada limite.
- Um status de sucesso é uma promessa. Quando uma API responde 2xx, o dado precisa estar bom.
