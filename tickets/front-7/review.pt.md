# Code review: CS-107, o cabeçalho e os cartões de produto seguem o tema

Um tema está pronto quando nenhum componente conhece uma cor, só o papel que a cor faz. Aqui está a abordagem de referência, para você comparar com a sua.

## Do que este ticket tratava

- O tema escuro entrou depois que os primeiros componentes foram escritos. Componentes que nomeavam cores direto (`bg-white`) não tinham como segui-lo.
- Um token nomeia um papel ("a superfície de um cartão", "texto secundário"). O valor por trás do papel pode mudar com o tema sem tocar em componente.
- O contraste faz parte do trabalho: um fundo escuro com o texto escuro antigo é tão ilegível quanto os cartões brancos eram claros.

## Por que a referência foi construída assim

- Ela muda só nomes de classe, em dois arquivos. Nenhum CSS novo e nenhum token novo: o sistema já tinha o que era preciso.
- Cada token de texto é usado sobre a superfície para a qual foi desenhado, então o contraste AA vale nos dois temas sem medir cada par de novo.
- Um terceiro tema, mais tarde, não pediria mudança nesses componentes.

## Compare com o que você construiu

- Você pôs variantes `dark:` ao lado das cores fixas (`bg-white dark:bg-slate-800`)? Funciona, e agora cada componente carrega duas paletas; mudar o tema escuro significa editar todo arquivo.
- Você inventou valores novos de cor para o cabeçalho escuro? Confira o contraste deles, e pergunte se um token existente já faz esse papel.
- Você esqueceu o espaço "No photo" ou a descrição? É fácil não ver, porque nem sempre aparecem.

## Para a próxima vez

- Ao escrever um componente, procure um token antes de uma cor. Se nenhum token serve, é uma questão de design, não uma classe para inventar.
- Olhe todo estado de um componente em todo tema: com e sem foto, com uma foto ou várias.
