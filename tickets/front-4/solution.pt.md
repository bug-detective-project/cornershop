# Solução: O filtro de categoria mora na URL

**Causa.** Em `client/src/pages/Storefront.tsx` a categoria é guardada com `useState`, enquanto todos os outros filtros vêm de `useFilters()` (`client/src/filters.ts`), que lê e escreve os parâmetros de busca da URL. Estado de componente não aparece no endereço, então se perde ao recarregar, não vai num link copiado e não cria entrada no histórico para o Voltar.

## Passo a passo

1. **Compare os dois filtros.** A busca escreve `?q=…` no endereço; a categoria não escreve nada.
2. **Leia a categoria da URL.** Troque `const [category, setCategory] = useState('')` por `const { category } = filters;`: o `useFilters()` já lê `category` do endereço.
3. **Escreva na URL.** `const setCategory = (slug: string) => update({ category: slug });`. O `update` tira o número da página (volta para a página 1), mantém os outros filtros e cria uma entrada no histórico, então o Voltar funciona.
4. **Remova a importação** de `useState`, que não é mais usada.
5. **Adicione um teste de regressão.** A referência adiciona `client/src/pages/Storefront.category.test.tsx`: a categoria vai para a URL, é lida dela, mantém a busca e reinicia a página.

Depois rode `npm test`, teste recarregar, um link copiado e o botão Voltar, e mova o card para **Em QA**.
