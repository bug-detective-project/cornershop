# CS-109: Type prices in the owner panel the way the price filters take them

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Story |
| Status | To Do |
| Priority | Medium |
| Reporter | Marta Okafor (Owner) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Owner panel (product form) |
| Labels | `admin`, `forms` |
| Sprint | CS Sprint 12 |
| Created | 19/11/2026 09:10 |

## Description

On the shop page, the **Min price** and **Max price** fields are lovely: I type 4, 5, 0 and they show **$4.50**, the phone opens its number keys, and letters simply do not go in. The **Price** field of my product form, in the owner panel, is still a plain text box: I type "4.5", "$4,50" or "4.50" and only find out when I click **Save** whether it was accepted.

Please make the **Price** of the owner panel work exactly like the price filters.

## What is already there

- `client/src/components/PriceInput.tsx`: the price field with the mask that the filters use (`client/src/components/Filters.tsx`). It takes the price as plain text (`value`, for example `"4.50"`) and gives it back the same way (`onChange`).
- The product form, `client/src/components/ProductForm.tsx`, keeps the price as plain text in `values.price` and turns it into cents with `parsePrice` when it saves.

## What to build

- The **Price** field of the product form takes the digits from the right, as cents: typing 4, 5, 0 shows **$4.50**.
- Anything that is not a digit is ignored, and Backspace takes the last digit out.
- On a phone the field opens the number keys.
- Editing a product shows its price with the mask (Matches shows **$1.20**), and a price typed with the mask is saved in cents.
- The field keeps its label **Price** and shows the error **Enter a price like 4.50** when it is left empty, as today.

## Acceptance criteria

- [ ] Typing 4, 5, 0 in **Price** shows $0.04, then $0.45, then $4.50.
- [ ] Letters, commas and points are ignored; Backspace takes the last digit out.
- [ ] The field opens the number keys on a phone.
- [ ] **Edit** on Matches shows **$1.20** in **Price**.
- [ ] A product saved with 4, 5, 0 typed in **Price** shows **$4.50** in the list.

## Environment

- CornerShop 1.0

## Activity

**Marta Okafor** · 19/11/2026 09:25
> Same feel as the filters, please. I type prices all day.
