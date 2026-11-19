# Code review: CS-103, a foto escolhida continua com o seu produto

O aviso de `key` é a primeira coisa que o React ensina e a última que as pessoas entendem. Este bug mostra para que a key serve de verdade. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- Uma key responde à pergunta "qual item é este?". O índice responde "qual posição é esta?", que é outra pergunta assim que a ordem muda.
- Enquanto o cartão não tinha estado próprio, o índice era inofensivo: o React renderizava cada cartão com props novas e ninguém via diferença. Os pontinhos de foto deram estado ao cartão, e o bug apareceu.
- A lista nunca mudou de ordem enquanto o código era escrito, então a key errada nunca foi testada.

## Por que a correção de referência está certa

- `product.id` é estável e único: é o mesmo valor em toda página, em toda ordem e depois de todo recarregamento.
- Nada nos pontinhos de foto precisou mudar. O estado estava certo; estava preso à coisa errada.
- Com uma key de verdade o React também pode mover os nós do DOM em vez de reescrever, o que é mais barato.

## Compare com a sua correção

- Você subiu a foto escolhida para a lista, indexada pelo id do produto? Funciona e às vezes é o desenho certo, mas a key continua errada para qualquer outro estado que o cartão ganhar depois.
- Você usou o nome do produto como key? Nomes podem se repetir; ids não.
- Você voltou todos os cartões para a primeira foto quando a ordem muda? Isso esconde o sintoma e joga fora o que a pessoa estava olhando.

## Para a próxima vez

- Use o índice como key só em lista que nunca muda de ordem, nunca filtra e cujos itens não têm estado.
- Quando um estado aparece no item errado depois de reordenar, confira a key antes de qualquer outra coisa.
