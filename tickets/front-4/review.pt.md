# Code review: CS-104, o filtro de categoria mora na URL

Onde um estado mora decide o que acontece com ele ao recarregar, compartilhar e voltar. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O `useState` é a primeira ferramenta que todo mundo pega, e na tela funciona: a lista filtrava certo, então o problema ficava invisível até alguém recarregar.
- Os outros filtros já estavam na URL. A categoria foi adicionada do jeito rápido e ninguém comparou com os vizinhos.
- Compartilhar um link é uma funcionalidade que ninguém escreve, porque o navegador dá de graça, desde que o estado esteja no endereço.

## Por que a correção de referência está certa

- Ela reaproveita o `useFilters()`, o único lugar que sabe como os filtros viram URL. A categoria agora se comporta exatamente como a busca.
- Escolher uma categoria cria uma entrada no histórico (digitar na busca substitui a atual), então o Voltar anda por categorias e não por letras.
- A página volta para 1 em qualquer troca de filtro, porque a página 3 da padaria pode não existir.

## Compare com a sua correção

- Você manteve o `useState` e copiou o valor para a URL num efeito? Agora há duas fontes da verdade que podem discordar; o Voltar muda a URL mas não o estado.
- Você guardou a categoria no `localStorage`? Ela sobrevive a recarregar no mesmo computador, mas um link compartilhado continua abrindo a loja inteira.
- Você chamou `setSearchParams` direto na página? Funciona; confira se mantém os outros parâmetros e reinicia a página.

## Para a próxima vez

- Antes de escolher onde um estado mora, pergunte: ele deve sobreviver a recarregar? Um link deve levá-lo? O Voltar deve desfazê-lo? Três vezes sim quer dizer URL.
- Quando uma funcionalidade tem irmãs (outros filtros, outros campos), faça a nova funcionar como elas.
