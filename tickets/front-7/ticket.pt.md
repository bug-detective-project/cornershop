# CS-107: Aplicar o tema escuro ao cabeçalho e aos cartões de produto

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | História |
| Status | A fazer |
| Prioridade | Média |
| Relator | Lucy Tran (Atendimento ao cliente) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Vitrine (tema) |
| Rótulos | `vitrine`, `tema` |
| Sprint | CS Sprint 12 |
| Criado em | 18/11/2026 09:00 |

## Descrição

A loja ganhou um tema escuro no sprint passado (o botão da lua no topo). O fundo da página, os filtros, o painel do dono e a página de produto seguem o tema. Duas partes ficaram para depois e continuam pintadas com as cores do tema claro: o **cabeçalho** e os **cartões de produto**. No tema escuro eles ficam brancos, o contrário do que um tema escuro deveria fazer: quem olha a loja à noite recebe uma parede de cartões claros.

Por favor, terminem o trabalho: os dois precisam seguir o tema, com texto fácil de ler nos dois.

## O que já existe

- O botão de tema no cabeçalho: ele põe `data-theme="dark"` ou `"light"` no `<html>` e lembra a escolha (`client/src/theme.ts`).
- Os tokens de cor em `client/src/styles.css`: `surface`, `surface-raised`, `content`, `muted`, `border`, `accent`, cada um com um valor por tema. Eles são cores do Tailwind: `bg-surface-raised`, `text-content`, `border-border`…
- Todas as outras partes do app já usam os tokens. `client/src/pages/Admin.tsx` e `client/src/components/Filters.tsx` são bons exemplos.

## O que construir

- Em `client/src/components/Header.tsx`: o fundo e a borda do cabeçalho, o nome da loja e os dois links de navegação (o da página atual e o outro) seguem o tema.
- Em `client/src/components/ProductCard.tsx`: o fundo e a borda do cartão, o nome, o preço, a descrição mostrada pelo **Details** e o espaço "No photo" seguem o tema.
- Nenhuma cor fixa sobra nesses dois arquivos: use os tokens (ou uma variante `dark:` para cada cor fixa).

## Critérios de aceitação

- [ ] No tema escuro, o cabeçalho e os cartões de produto têm fundo escuro.
- [ ] Nos dois temas, todo texto do cabeçalho e dos cartões tem contraste de pelo menos 4,5:1 com o fundo (WCAG AA).
- [ ] No tema claro eles ficam como estão hoje.
- [ ] O tema escolhido continua aplicado depois de recarregar.

## Ambiente

- CornerShop 1.0, qualquer navegador
- Use o botão da lua no canto superior direito para trocar de tema

## Atividade

**Lucy Tran** · 18/11/2026 09:17
> Uma freguesa mandou uma captura de tela às 23h com a legenda "meus olhos". Justo.
