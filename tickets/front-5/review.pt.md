# Code review: CS-105, os botões de estoque funcionam pelo teclado e dizem o que fazem

A maioria dos bugs de acessibilidade é uma decisão só: um elemento genérico onde cabia um nativo. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- Um `<span>` com `onClick` tem a aparência e o clique de um botão para quem usa mouse, então o bug é invisível para quem escreveu.
- O estilo piorou: a mesma classe `button` está nos dois, então até a aparência é igual.
- Um símbolo como "−" não é um nome. Ele é lido como "menos", ou nem é lido, e não diz de qual produto é.

## Por que a correção de referência está certa

- O `<button>` nativo traz foco, teclado, papel e `disabled` juntos, e eles continuam funcionando em todo navegador e com toda tecnologia assistiva.
- O nome leva o produto, porque quem usa leitor de tela anda de botão em botão sem ver a linha.
- Nenhum papel ARIA precisou ser escrito. O melhor ARIA é o elemento HTML que já tem o comportamento.

## Compare com a sua correção

- Você manteve o `<span>` e pôs `role="button"`, `tabIndex={0}` e um `onKeyDown` para Enter e Espaço? Pode funcionar, mas você refez à mão o que o elemento já dá, e é fácil esquecer o Espaço, ou o `disabled`.
- Você usou `title` em vez de `aria-label`? O suporte ao `title` como nome é irregular; o `aria-label` é o confiável.
- Todos os botões ficaram com o mesmo nome ("Increase stock")? O nome precisa diferenciar as linhas.

## Para a próxima vez

- Se faz algo quando clicado, é um `<button>`; se leva a algum lugar, é um link. Decida isso antes de estilizar.
- Faça uma passada em cada tela só com o teclado antes de dar por pronta.
