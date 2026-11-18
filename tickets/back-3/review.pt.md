# Code review: CS-203, cada página mostra produtos diferentes

Paginação são dois números que precisam vir do mesmo lugar. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- `limit` e `offset` são calculados a partir de um tamanho de página. Aqui cada um usava um: o tamanho que quem chamou pediu, e o padrão.
- Com o padrão o bug é invisível, e o padrão é o que um teste usa se ninguém decidir outra coisa. Os testes estavam verdes e não provavam nada sobre a loja.
- O sintoma ("os mesmos produtos de novo") parecia dado duplicado. O dado estava certo; a janela sobre ele estava no lugar errado.

## Por que a correção de referência está certa

- Um valor só, `pageSize`, comanda os dois números, então eles não discordam de novo.
- O padrão fica em um lugar, a leitura da consulta, e o repositório só recebe um tamanho de página já decidido.
- A ordenação tem desempate (o id), então um produto não pula de página quando dois nomes ou preços são iguais. Sem isso, até um offset certo pode repetir linhas.

## Compare com a sua correção

- Você fez a loja pedir 10 por página? A API continua devolvendo páginas erradas para quem pedir outro tamanho.
- Você removeu os duplicados no cliente? Os produtos que foram pulados continuam faltando.
- Você testou só a página 2? Percorra todas as páginas e conte: cada produto uma vez, e a contagem igual ao `total`.

## Para a próxima vez

- Teste paginação com um tamanho de página que não é o padrão, e percorrendo todas as páginas, não uma.
- Quando a suíte está verde e um usuário vê um bug, pergunte o que os testes têm em comum que o usuário não tem.
