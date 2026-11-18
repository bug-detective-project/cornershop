# Solução: A página de produto, com galeria de fotos

**O que faltava.** A vitrine apontava para `/products/<id>`, mas nenhuma rota casava com esse endereço, então o roteador caía na rota de "Page not found". Os dados e o gancho para carregá-los já existiam; a página e a galeria, não.

## Passo a passo

1. **Adicione a rota.** Em `client/src/App.tsx`: `<Route path="/products/:id" element={<ProductPage />} />`, acima da rota `*`.
2. **Carregue o produto.** `client/src/pages/ProductPage.tsx` lê `const { id } = useParams()` e chama `useProduct(id)`.
3. **Trate carregamento e erros primeiro.** `isPending`: uma linha "Loading product…". `isError` com um `ApiError` de status 404: `<NotFound title="Product not found" />`. Qualquer outro erro: uma mensagem com `role="alert"`.
4. **Mostre o produto.** O nome num `<h1>`, `formatPrice(priceCents)` em `data-testid="product-price"`, o nome da categoria (ou "Uncategorized"), "In stock" quando `stock > 0` e "Out of stock" caso contrário, a descrição e um `<Link to="/">Back to the shop</Link>`.
5. **Construa a galeria.** `client/src/components/Gallery.tsx` guarda `const [selected, setSelected] = useState(0)`. Sem imagens: a caixa "No photos yet". Caso contrário, o `<img data-testid="gallery-main" src={images[selected]} alt={name}>` principal e um `<button aria-label={`Show photo ${index + 1}`} aria-pressed={index === selected}>` por imagem.
6. **Comece cada produto na primeira foto.** A página renderiza `<Gallery key={product.id} …>`, então ir de um produto para outro cria uma galeria nova em vez de manter o índice antigo.
7. **Adicione testes.** A referência adiciona `client/src/pages/ProductPage.test.tsx`, que cobre todos os critérios.

Depois rode `npm test`, abra um produto com três fotos, um sem nenhuma e um id que não existe, e mova o card para **Em QA**.
