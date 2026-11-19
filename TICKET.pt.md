# CS-205: Adicionar um identificador de requisição às respostas e aos registros da API

| Campo | Valor |
| --- | --- |
| Projeto | CornerShop (CS) |
| Tipo de item | História |
| Status | A fazer |
| Prioridade | Média |
| Relator | Lucy Tran (Atendimento ao cliente) |
| Trilha | Back-end |
| Versão afetada | 1.0 |
| Componente | API (registro de requisições) |
| Rótulos | `api`, `registros` |
| Sprint | CS Sprint 12 |
| Criado em | 18/11/2026 08:30 |

## Descrição

Quando um freguês me diz "a loja deu erro lá pelas dez", eu abro o registro da API e encontro centenas de linhas daquele minuto. São todas parecidas: método, caminho, status, duração. Não consigo saber quais linhas são daquele freguês, nem qual linha de erro vai com qual requisição.

Outros sistemas que já usei dão um identificador a cada requisição, mostram na resposta e escrevem em toda linha de registro daquela requisição. Aí o freguês (ou a página) me diz o identificador, e eu acho a requisição em segundos. Queremos isso aqui.

## O que já existe

- `server/src/log.ts`: o middleware `requestLog(log)` escreve uma linha JSON por requisição quando a resposta é enviada, com `method`, `path`, `status` e `durationMs`.
- `server/src/app.ts`: o `handleErrors(log)` escreve uma linha JSON com `level: "error"` e a mensagem quando uma rota falha com 500.
- `log` é uma função que recebe uma linha de texto. No app é o `console.log`; nos testes ela guarda as linhas (`server/src/test/app.ts`), então dá para testar o que foi registrado.
- O `node:crypto` tem `randomUUID()`.

## O que construir

- Toda requisição ganha um identificador. Se quem chamou enviou um cabeçalho `X-Request-Id` cujo valor tem de 8 a 64 caracteres entre letras, dígitos e hífens, esse valor é o identificador. Caso contrário, a API cria um novo (por exemplo com `randomUUID()`).
- Toda resposta leva o identificador no cabeçalho `X-Request-Id`: sucessos, 400, 403, 404 e 500.
- A linha de registro da requisição tem o identificador num campo `requestId`, e a linha de erro de um 500 também.
- Os outros campos da linha de registro continuam como estão.

## Critérios de aceitação

- [ ] Toda resposta da API tem um cabeçalho `X-Request-Id` com 8 a 64 letras, dígitos ou hífens.
- [ ] Duas requisições nunca têm o mesmo identificador.
- [ ] Um `X-Request-Id` válido enviado por quem chama é usado como identificador; um inválido (curto demais, longo demais, outros caracteres) é trocado por um novo.
- [ ] A linha de registro de cada requisição tem `requestId` igual ao cabeçalho da resposta dela, também quando a requisição falha.
- [ ] A linha de registro mantém `method`, `path`, `status` e `durationMs`.

## Ambiente

- CornerShop 1.0 (API)
- O registro é o que o `npm run dev` imprime para o servidor

## Atividade

**Lucy Tran** · 18/11/2026 08:47
> Se o identificador também aparecer na aba Network do navegador, posso pedir aos fregueses uma captura de tela. Um cabeçalho faz isso, certo?
