import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const money = (n) => `$${n.toFixed(2)}`;

export default function MenuItemRow({ item }) {
  const { user } = useAuth();
  const cart = useCart();
  const inCart = cart.items.find((i) => i.menuItemId === item._id);
  const isCustomer = !user || user.role === 'customer';

  return (
    <div className="border-b border-ink/10 py-4 first:pt-0 last:border-b-0">
      <div className="leader-row">
        <h3 className="shrink-0 font-display text-lg text-ink">{item.name}</h3>
        <span className="leader-fill" />
        <span className="shrink-0 font-mono text-sm text-brass">{money(item.price)}</span>
      </div>

      {item.description && <p className="mt-1 max-w-xl text-sm text-ink/60">{item.description}</p>}

      <div className="mt-2 flex items-center gap-3">
        {!item.is_available && (
          <span className="font-mono text-[11px] uppercase tracking-wide text-brick">86'd today</span>
        )}
        {item.is_available && isCustomer && (
          <>
            {inCart ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => cart.setQuantity(item._id, inCart.quantity - 1)}
                  className="h-6 w-6 rounded-sm border border-ink/20 text-sm leading-none hover:bg-ink/5"
                  aria-label={`Decrease ${item.name} quantity`}
                >
                  −
                </button>
                <span className="w-4 text-center font-mono text-sm">{inCart.quantity}</span>
                <button
                  onClick={() => cart.addItem(item)}
                  className="h-6 w-6 rounded-sm border border-ink/20 text-sm leading-none hover:bg-ink/5"
                  aria-label={`Increase ${item.name} quantity`}
                >
                  +
                </button>
              </div>
            ) : (
              <button onClick={() => cart.addItem(item)} className="text-xs font-semibold text-forest hover:underline">
                + Add to docket
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
