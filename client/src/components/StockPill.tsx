/** How many are few enough to say so. */
const LOW_STOCK = 5;

/** Whether a product can be bought today, in a word and a color. */
export function StockPill({ stock }: { stock: number }) {
  if (stock === 0) {
    return <span className="pill bg-danger-soft text-danger">Out of stock</span>;
  }
  if (stock <= LOW_STOCK) {
    return <span className="pill bg-warn-soft text-warn">Only {stock} left</span>;
  }
  return <span className="pill bg-accent-soft text-accent-strong">In stock</span>;
}
