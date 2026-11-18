# Code review: CS-205, um identificador de requisição nas respostas e nos registros

Um registro só serve se você consegue achar uma história dentro dele. Um identificador de requisição é o jeito mais barato de tornar isso possível. Aqui está a abordagem de referência, para você comparar com a sua.

## Do que este ticket tratava

- Cada linha estava certa e o registro como um todo era inútil: nada ligava as linhas de uma requisição, nem uma linha à pessoa que fez a requisição.
- O identificador precisa existir em dois lugares ao mesmo tempo, onde quem chamou vê (a resposta) e onde o time busca (o registro). Um sem o outro não ajuda.
- Aceitar o identificador de quem chama permite seguir uma requisição entre sistemas, da página até a API e além.

## Por que a referência foi construída assim

- O identificador é decidido uma vez, no primeiro middleware, e tudo depois lê dali. Nenhuma rota precisou mudar.
- O cabeçalho é definido antes de a resposta ser montada, então nenhum caminho do app consegue esquecê-lo.
- O cabeçalho de quem chama é conferido contra um padrão estrito antes de ser usado. É entrada: sem a conferência, qualquer um escreveria texto arbitrário, ou linhas novas, no registro.
- O registro continua sendo um objeto JSON por linha, então dá para buscar por campo com ferramentas comuns.

## Compare com o que você construiu

- Você definiu o cabeçalho em cada rota, ou só no caminho de sucesso? Confira um 404, um 400 e um host recusado.
- Você usou um contador (1, 2, 3…) como identificador? Ele recomeça com o servidor e se repete; duas requisições de dias diferentes ficam com o mesmo identificador.
- Você aceitou qualquer `X-Request-Id` que quem chama envia? Teste um com espaços, ou um com dois mil caracteres.
- Você gerou o identificador no tratador de `finish`? Então a resposta já foi enviada sem ele.

## Para a próxima vez

- Quando criar uma linha de registro, pergunte como alguém vai achá-la depois e do que vai precisar ao lado dela.
- Trate cabeçalhos como entrada, igual a um corpo: valide antes de usar.
- Decida um valor uma vez e passe adiante. Dois lugares que calculam "o identificador" cada um do seu jeito um dia discordam.
