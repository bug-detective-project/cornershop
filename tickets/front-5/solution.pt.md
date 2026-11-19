# Solução: Os botões de estoque funcionam pelo teclado e dizem o que fazem

**Causa.** Em `client/src/components/StockStepper.tsx` os dois controles são `<span onClick={…}>`. Um span não é interativo: não entra na ordem do Tab, não reage a Enter nem a Espaço, e a tecnologia assistiva enxerga texto simples ("−"), sem papel e sem nome.

## Passo a passo

1. **Compare com o que funciona.** Edit e Delete na mesma linha são elementos `<button>`, e o teclado chega neles.
2. **Use botões de verdade.** Troque cada `<span>` por `<button type="button" className={step} …>` (`step` é o visual que os dois controles já dividem). O `type="button"` impede que ele envie um formulário.
3. **Dê um nome a cada um.** `aria-label={`Decrease stock of ${product.name}`}` e `aria-label={`Increase stock of ${product.name}`}`. Com vinte linhas na página, só "menos" não diria qual produto.
4. **Pare no zero.** `disabled={product.stock === 0}` no botão de diminuir: a API recusa estoque negativo, então o botão não deve oferecer.
5. **Adicione um teste de regressão.** A referência adiciona `client/src/pages/Admin.stock.test.tsx`: os botões são achados pelo papel e pelo nome, alcançados com Tab e usados com Enter e Espaço.

Depois rode `npm test`, mude um estoque só com o teclado e mova o card para **Em QA**.
