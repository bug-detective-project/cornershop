# Code review: CS-204, um produto tem um preço só em todo lugar

Quando um valor está errado na tela, o bug está em algum ponto do caminho dele, e o jeito mais rápido de achar é olhar o valor em cada parada. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O sintoma estava numa página, então a página foi a primeira suspeita. A página era inocente: formatou o que recebeu.
- Duas funções faziam a mesma conversão. Alguém "ajudou" em uma delas transformando centavos em dólares, e a outra manteve o contrato. Código duplicado se afasta exatamente assim.
- A unidade faz parte do valor. `priceCents: 4.5` tem o nome certo e a unidade errada, e nada nos tipos consegue perceber.

## Por que a correção de referência está certa

- Ela corrige o valor onde ele fica errado, na API, então todo mundo que chama a rota de detalhes volta a receber centavos.
- O nome do campo e o conteúdo concordam: `priceCents` guarda centavos.
- Uma regra só para dinheiro no projeto inteiro: centavos inteiros em todo lugar, formatados em uma função no cliente.

## Compare com a sua correção

- Você corrigiu na página de produto, deixando de dividir ali? A página agora mostra o número certo enquanto a API continua respondendo errado, e o painel do dono, que lê as mesmas respostas, fica errado no outro sentido.
- Você multiplicou por 100 no cliente quando o valor "parece pequeno"? É um palpite que o próximo preço vai quebrar.
- Você juntou as duas funções em uma? Isso tira a causa do afastamento, e é um bom próximo passo se você manteve o formato da resposta das duas rotas.

## Para a próxima vez

- Ponha a unidade no nome do campo (`priceCents`, `durationMs`) e depois mantenha o conteúdo fiel ao nome.
- Para depurar um valor errado, escreva quanto ele vale em cada passo antes de ler código. O passo em que ele muda é onde o bug mora.
- Duas funções que parecem iguais são uma pergunta: deveria haver uma só?
