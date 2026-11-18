# CS-108: Construir a página de produto, com galeria de fotos

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | História |
| Status | A fazer |
| Prioridade | Alta |
| Relator | Marta Okafor (Dona) |
| Trilha | Front-end |
| Versão afetada | 1.0 |
| Componente | Vitrine (página de produto) |
| Rótulos | `vitrine`, `página-nova` |
| Sprint | CS Sprint 12 |
| Criado em | 18/11/2026 10:30 |

## Descrição

Os fregueses querem ver um produto direito antes de vir até a loja: fotos maiores, a descrição completa, se temos ou não. Hoje, clicar no nome de um produto na página da loja leva para `/products/<id>` e cai em "Page not found", porque essa página nunca foi construída.

Por favor, construam. Vários dos nossos produtos têm duas ou três fotos, e alguns ainda não têm nenhuma, então a página precisa de uma galeria pequena e também precisa ficar certa sem fotos.

## O que já existe

- A API: `GET /api/products/:id` responde o produto, ou 404 com `{ "error": "Product not found" }`.
- O gancho `useProduct(id)` em `client/src/api/products.ts`: ele carrega o produto com o TanStack Query (`isPending`, `isError`, `error`, `data`). Um 404 chega como um `ApiError` com `status` 404 (`client/src/api/http.ts`).
- `formatPrice(cents)` em `client/src/utils/formatPrice.ts`, e a página `NotFound` em `client/src/pages/NotFound.tsx`, que recebe um `title` e já tem o link **Back to the shop**.
- Os cartões da vitrine já apontam para `/products/<id>`.

## O que construir

- A rota `/products/:id` em `client/src/App.tsx`, mostrando um componente de página novo.
- A página mostra: o nome como título principal (`<h1>`), o preço (num elemento com `data-testid="product-price"`), o nome da categoria, **In stock** ou **Out of stock**, a descrição e um link **Back to the shop** para `/`.
- Uma galeria: a foto selecionada num `<img data-testid="gallery-main">` cujo `alt` é o nome do produto, e um botão por foto chamado **Show photo 1**, **Show photo 2**… Clicar num botão mostra aquela foto. A primeira foto começa selecionada.
- Um produto sem fotos mostra o texto **No photos yet** no lugar da galeria.
- Enquanto o produto carrega, avise. Um produto que não existe mostra o título **Product not found** e o link **Back to the shop**.

## Critérios de aceitação

- [ ] Clicar no nome de um produto na loja abre a página dele em `/products/<id>`, e abrir esse endereço direto também funciona.
- [ ] A página mostra o nome (`<h1>`), o preço (`data-testid="product-price"`, por exemplo `$4.50`), a categoria, **In stock** / **Out of stock** e a descrição.
- [ ] A galeria mostra a primeira foto em `data-testid="gallery-main"` e um botão **Show photo N** por foto; clicar em um mostra aquela foto.
- [ ] Um produto sem fotos mostra **No photos yet**, sem imagem de galeria e sem botões de foto.
- [ ] Um id que não existe mostra **Product not found** e um link **Back to the shop**.

## Ambiente

- CornerShop 1.0
- Sourdough Loaf tem três fotos; Matches não tem nenhuma; Fish Fingers está sem estoque

## Atividade

**Marta Okafor** · 18/11/2026 10:44
> Nada sofisticado. Fotos claras, o preço e se está na prateleira.
