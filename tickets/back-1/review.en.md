# Code review: CS-201, a product needs a valid price

An API is used by more than its own front end, and it is the last place where bad data can be stopped. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- Checking the type felt like validation, but a type says what kind of value it is, not whether the value makes sense. A price has a range and a unit.
- The panel never sends a negative price, so nobody saw the hole from the screen. The supplier's script talks to the API directly.
- The status code made it worse: `201` told the script that everything was fine, so nothing upstream noticed.

## Why the reference fix is right

- The rule lives in the API, where every caller passes: the panel, a script, `curl`.
- It answers `400` with the name of the field, the contract the API already had for the other fields. A caller can show the message next to the right input.
- It reuses `isCount`, so price and stock follow one definition of "a count" and cannot drift apart.
- Zero stays valid. Refusing it would have been a new rule nobody asked for.

## Compare with your fix

- Did you only check `priceCents >= 0`? Then `4.5` still passes, and the database (an integer column) answers with an error that reaches the caller as a 500.
- Did you fix it in the form of the panel? The panel was never the problem.
- Did you answer `422` or `500`? The API uses 400 with `fields` for every invalid body; a different shape for one field breaks its callers.
- Did you fix `POST` and forget `PATCH`? Check where each route gets its validation.

## Watch for next time

- For every field an API accepts, write down its type, its range and its unit, and test the first value outside each limit.
- A success status is a promise. When an API answers 2xx, the data must be good.
