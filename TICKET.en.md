# CS-106: A new product only shows up in the list after a reload

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Marta Okafor (Owner) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Owner panel (new product) |
| Labels | `admin`, `cache` |
| Sprint | CS Sprint 12 |
| Created | 17/11/2026 15:20 |

## Description

When I add a product in the panel, the form says **Product created**, but the product is not in the list below, and it is not in the shop either. I thought it had not been saved and added it again. And again. After I reloaded the page there were three of them.

Editing a product and deleting one both update the list immediately. It is only the new ones.

## Steps to reproduce

1. Open the owner panel (**Admin**).
2. Fill in a name and a price and click **Save**.
3. Look at the list of the panel, then go to **Shop** using the link at the top.
4. Reload the page.

## Expected result

After **Product created**, the product is in the list of the panel and in the shop, without a reload.

## Actual result

The product only appears after the page is reloaded.

## Acceptance criteria

- [ ] A new product appears in the list of the panel right after it is created, without a reload.
- [ ] It also appears in the shop when I go there with the link at the top of the page.
- [ ] Editing and deleting keep updating the list at once.

## Environment

- CornerShop 1.0, any browser

## Activity

**Marta Okafor** · 17/11/2026 15:41
> I deleted the two extra ones. Deleting updated the list right away, which is what made me notice that creating does not.
