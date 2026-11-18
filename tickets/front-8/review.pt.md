# Code review: CS-108, a página de produto, com galeria de fotos

Uma página nova é principalmente um conjunto de decisões sobre estados: carregando, inexistente, vazio, e o caminho feliz por último. Aqui está a abordagem de referência, para você comparar com a sua.

## Do que este ticket tratava

- O trabalho era uma página e uma rota. Tudo em volta (a API, o gancho, o formato do preço, a página de não encontrado) estava pronto, e usar isso fazia parte do trabalho.
- Uma página que lê o id da URL pode ser aberta por um link, um favorito ou um recarregamento: ela não pode depender de a lista ter sido carregada antes.
- A galeria tem exatamente um fato para lembrar, qual foto está selecionada. Todo o resto vem das props.

## Por que a referência foi construída assim

- Carregamento e erros são tratados antes de tocar nos dados, então o resto do componente pode assumir que existe um produto.
- Um 404 da API e um endereço desconhecido são a mesma coisa para o freguês: a mesma página `NotFound`, com outro título.
- A galeria é um componente separado que não sabe nada de produtos: recebe imagens e um nome. Pode ser testada, e reaproveitada, sozinha.
- As miniaturas são botões de verdade, com nome e `aria-pressed`, então a galeria funciona com teclado e leitor de tela desde o primeiro dia.

## Compare com o que você construiu

- Você buscou com `fetch` dentro de um `useEffect` em vez de usar `useProduct`? Funciona, e você reescreveu carregamento, erros e cache que o gancho já resolve.
- Você procurou o produto na lista em cache da vitrine? Um link direto não tem lista.
- O que a sua galeria mostra depois de ir de um produto com três fotos (a terceira selecionada) para um com uma foto só? Sem `key` ou sem reiniciar, `images[2]` é undefined.
- As suas miniaturas são elementos `<img>` clicáveis? Veja o que o teclado faz com elas.

## Para a próxima vez

- Liste os estados de uma página antes de escrever a marcação: carregando, erro, não encontrado, vazio, cheio.
- Antes de construir algo, leia o que o projeto já tem para isso. Aqui, era a maior parte do trabalho.
