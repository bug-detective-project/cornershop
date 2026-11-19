# Solução: O cabeçalho e os cartões de produto seguem o tema

**O que faltava.** `Header.tsx` e `ProductCard.tsx` estavam pintados com cores fixas do tema claro (`bg-white`, `text-slate-900`, `border-slate-300`…). O resto do app usa os tokens de cor de `client/src/styles.css`, cujos valores mudam com o `data-theme`.

## Passo a passo

1. **Conheça os tokens.** Em `styles.css`, o `:root` dá a cada token o valor claro e o `[data-theme='dark']` o valor escuro; o bloco `@theme inline` transforma os tokens em cores do Tailwind.
2. **Cabeçalho.** `border-slate-300 bg-white text-slate-900` vira `border-border bg-surface-raised text-content`; o nome da loja `text-content` e a linha embaixo dele `text-muted`; o link atual `bg-accent-soft text-accent-strong` e o outro `text-muted hover:bg-surface-sunken hover:text-content`.
3. **Cartão.** O article vira `border-border bg-surface-raised text-content`; o espaço "No photo" `bg-surface-sunken text-muted`; o nome da prateleira e a descrição `text-muted`; o preço `text-content`.
4. **Confira os dois temas.** Troque com o botão da lua e olhe cada texto. Os tokens foram escolhidos com contraste AA nos dois temas, então usar o par certo (um token de texto sobre um token de superfície) basta.
5. **Adicione um teste.** A referência adiciona `client/src/components/theme.test.tsx`, que recusa cor fixa no cabeçalho e no cartão.

Depois rode `npm test`, olhe a loja nos dois temas e mova o card para **Em QA**.
