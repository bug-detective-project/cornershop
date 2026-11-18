# CS-105: The stock buttons of the panel do not work from the keyboard and have no name

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Dev Patel (Shop assistant) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Owner panel (stock) |
| Labels | `admin`, `accessibility` |
| Sprint | CS Sprint 12 |
| Created | 17/11/2026 11:30 |

## Description

I update the stock at the counter all day, with a keyboard only: my right hand is usually holding a scanner or a box. In the panel, the **−** and **+** next to the stock of each product cannot be reached with Tab. I can Tab to Edit and Delete, but the two stock controls are skipped. Pressing Enter or Space near them does nothing.

My colleague Ana uses a screen reader. She says that when she finds them some other way, it reads nothing useful: no "button", no product name.

With the mouse they work.

## Steps to reproduce

1. Open the owner panel (**Admin**).
2. Press Tab to walk through the list of products.
3. Try to change the stock of a product without the mouse.

## Expected result

Each stock control is a button that Tab reaches, that works with Enter and Space, and that says what it does and to which product ("Increase stock of Umbrella").

## Actual result

Tab jumps from one row to the next without stopping at the stock controls, and they have no role and no name.

## Acceptance criteria

- [ ] Each product of the panel has a button named **Increase stock of <product name>** and one named **Decrease stock of <product name>**.
- [ ] Tab reaches both, and Enter and Space change the stock and save it.
- [ ] The decrease button is disabled when the stock is 0.
- [ ] Clicking with the mouse keeps working.

## Environment

- CornerShop 1.0, Chrome, keyboard only
- Also tested with the NVDA screen reader

## Activity

**Dev Patel** · 17/11/2026 11:48
> Edit and Delete in the same row work fine from the keyboard, so it is something about these two.
