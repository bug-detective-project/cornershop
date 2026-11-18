# Solução: Produto novo aparece sem recarregar

**Causa.** As listas vêm do cache do TanStack Query, onde cada resposta vale por um minuto (`client/src/queryClient.ts`). Em `client/src/api/products.ts`, `useUpdateProduct` e `useDeleteProduct` chamam `queryClient.invalidateQueries({ queryKey: ['products'] })` quando dão certo, o que marca toda lista em cache como desatualizada e busca de novo as que estão na tela. `useCreateProduct` não chama, então depois do `POST` a tela continua mostrando a cópia antiga.

## Passo a passo

1. **Confirme na aba Network.** Criar envia um `POST` que responde 201 e mais nada. Editar envia um `PATCH` e depois um `GET /api/products`.
2. **Pegue o query client** em `useCreateProduct`: `const queryClient = useQueryClient();`.
3. **Invalide no sucesso:** `onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })`. A chave `['products']` é o prefixo de toda lista e de toda página de produto, então todas são atualizadas.
4. **Adicione um teste de regressão.** A referência adiciona `client/src/pages/Admin.create.test.tsx`: um produto novo aparece no painel e na vitrine sem recarregar.

Depois rode `npm test`, cadastre um produto olhando a lista e mova o card para **Em QA**.
