# Solução: O campo de preço do dono com a máscara dos filtros

**O que faltava.** A máscara já existe: `client/src/components/PriceInput.tsx` recebe os dígitos pela direita como centavos, ignora o resto, abre o teclado de números (`inputMode="numeric"`) e guarda o que foi digitado enquanto tem o foco. Os filtros usam ele; o formulário de produto em `client/src/components/ProductForm.tsx` ainda tinha um `<input>` comum no **Price**.

## Passo a passo

1. **Ache o que já está pronto.** O `Filters.tsx` renderiza `<PriceInput value={props.minPrice} onChange={props.onMinPrice} />`. O campo recebe e devolve o preço como texto simples ("4.50"), o mesmo texto que o formulário guarda em `values.price` e lê com `parsePrice`.
2. **Use ele no formulário.** Importe o `PriceInput` e troque o `<input>` do **Price** por `<PriceInput className={input} placeholder="$0.00" value={values.price} onChange={(price) => setValues((current) => ({ ...current, price }))} aria-describedby={…} />`. O `PriceInput` repassa as outras props (classe, placeholder, `aria-describedby`) para o `<input>` dele.
3. **Nada mais muda.** Salvar continua chamando `parsePrice(values.price)`; editar continua preenchendo `values.price` com `"1.89"`, que o campo mostra como **$1.89**; um campo vazio continua mostrando **Enter a price like 4.50**.
4. **Adicione um teste de regressão.** A referência adiciona `client/src/pages/Admin.price.test.tsx`: digitar dígito a dígito, letras e Backspace, o preço de um produto em edição e os centavos enviados ao salvar.

Depois rode `npm test`, digite alguns preços no painel e mova o card para **Em QA**.
