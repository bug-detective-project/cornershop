# Code review: CS-204, a product has one price everywhere

When a value is wrong on screen, the bug is somewhere along its path, and the fastest way to find it is to look at the value at each stop. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- The symptom was on a page, so the page was the first suspect. The page was innocent: it formatted what it was given.
- Two functions did the same conversion. Someone "helped" in one of them by turning cents into dollars, and the other one kept the contract. Duplicated code drifts apart exactly like this.
- A unit is part of a value. `priceCents: 4.5` has the right name and the wrong unit, and nothing in the types can tell.

## Why the reference fix is right

- It fixes the value where it goes wrong, in the API, so every caller of the details route gets cents again.
- The name of the field and its content agree: `priceCents` holds cents.
- One rule for money in the whole project: whole cents everywhere, formatted in one function on the client.

## Compare with your fix

- Did you fix it in the product page, by not dividing there? The page now shows the right number while the API still answers the wrong one, and the owner panel, which reads the same answers, is now wrong in the other direction.
- Did you multiply by 100 in the client when the value "looks small"? That is a guess the next price will break.
- Did you merge the two functions into one? That removes the cause of the drift, and is a fair next step if you kept the answer shape of both routes.

## Watch for next time

- Put the unit in the name of a field (`priceCents`, `durationMs`) and then keep the content true to the name.
- To debug a wrong value, write down what it is at each step before reading any code. The step where it changes is where the bug lives.
- Two functions that look the same are a question: should there be one?
