# Code review: CS-109, the owner's price field with the mask of the filters

The best line of code here is the one you did not write. Here is the reference approach, so you can compare it with yours.

## Why the field was plain

- The mask was built for the filters first, as a component of its own. The form was older and nobody went back to it.
- Two fields that do the same job behaving differently is the kind of gap users notice before developers do.

## Why the reference fix is right

- It reuses `PriceInput`, so the panel and the filters type prices the same way, and a fix to the mask fixes both.
- The form keeps the price as the same plain text, so saving, editing and the error message did not change.
- `PriceInput` passes the props it does not use to its `<input>`, so the label, the class and `aria-describedby` keep working.

## Compare with your fix

- Did you write a new mask inside the form? It can work, but now there are two masks to keep in agreement, and the filters' one handles a case yours may not: a page that gives the value back late.
- Did you switch the field to `type="number"`? It opens the number keys, but it cannot show `$` or the thousands comma, and it accepts "4.567".
- Did you keep the price in cents in the form state? Possible, but then editing, saving and the empty-field error all had to change with it.

## Watch for next time

- Before building a piece of UI, look for one that already does the job somewhere else in the app.
- Keep a field's value in one shape across the app (here, the plain text "4.50"); the mask is only how it looks.
