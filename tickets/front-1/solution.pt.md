# Solução: Nome longo de produto fica dentro do cartão

**Causa.** Em `client/src/components/ProductCard.tsx`, o nome (`<h3>`) e o preço dividem uma linha flex. Um item flex tem `min-width: auto`: ele se recusa a ficar mais estreito que o seu conteúdo. O link dentro do nome é `truncate` (uma linha, reticências), então o conteúdo é o nome inteiro em uma linha, e o `<h3>` cresce até essa largura, para fora do cartão. O cartão corta o que transborda, e o preço some.

## Passo a passo

1. **Veja no DevTools.** Selecione o `<h3>` do cartão de nome longo: a caixa dele é bem mais larga que o cartão. O preço fica depois dela, fora da área visível.
2. **Deixe o nome encolher.** Adicione `min-w-0` ao `<h3>`: `className="min-w-0 flex-1 text-lg leading-snug font-bold"`. Agora o título pode ficar mais estreito que o texto, e o `truncate` do link mostra as reticências.
3. **Mantenha o preço inteiro.** Adicione `shrink-0` ao preço: `className="shrink-0 text-lg font-extrabold text-content tabular-nums"`. Quando falta espaço, só o nome cede.
4. **Adicione um teste de regressão.** A referência adiciona `client/src/components/ProductCard.layout.test.tsx`, que confere que o nome pode encolher e o preço não.

Depois rode `npm test`, olhe o cartão em algumas larguras de janela e mova o card para **Em QA**.
