# Solução: Um identificador de requisição nas respostas e nos registros

**O que faltava.** A API registrava cada requisição, mas nada ligava uma linha de registro à resposta que quem chamou recebeu, nem uma linha de erro à requisição que a causou. O registro precisava de um valor comum por requisição.

## Passo a passo

1. **Decida o identificador no começo da requisição.** No `requestLog` (`server/src/log.ts`): `const sent = req.get('x-request-id')`, e `const requestId = sent !== undefined && REQUEST_ID.test(sent) ? sent : randomUUID()`, com `const REQUEST_ID = /^[A-Za-z0-9-]{8,64}$/`.
2. **Devolva e guarde.** `res.setHeader('X-Request-Id', requestId)` e `res.locals.requestId = requestId`. Definir o cabeçalho no middleware, antes de qualquer rota rodar, é o que o coloca em toda resposta, inclusive nos erros.
3. **Registre.** Adicione `requestId` ao objeto escrito no tratador de `finish`.
4. **Use na linha de erro.** Exporte um pequeno `requestIdOf(res)` do `log.ts`; no `handleErrors` (`server/src/app.ts`), ponha o identificador na linha de erro e no corpo do 500.
5. **Mantenha o middleware em primeiro.** O `app.use(requestLog(log))` já vem antes da conferência do host, então um host recusado também ganha identificador.
6. **Adicione testes.** A referência adiciona `server/src/request-id.test.ts`: o cabeçalho em toda resposta, identificadores diferentes, o de quem chamou reaproveitado ou trocado, e o identificador nas linhas de registro.

Depois rode `npm test`, chame a API com `curl -i`, leia o registro e mova o card para **Em QA**.
