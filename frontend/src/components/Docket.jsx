import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import * as api from '../lib/api';

const money = (n) => `$${n.toFixed(2)}`;

export default function Docket() {
  const cart = useCart();
  const { user, refreshProfile } = useAuth();
  const [redeem, setRedeem] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(null);

  const canRedeem = user?.role === 'customer' && (user?.loyaltyPoints ?? 0) >= 100;

  const handlePlaceOrder = async () => {
    setError('');
    setPlacing(true);
    try {
      const payload = {
        items: cart.items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        redeemPoints: redeem && canRedeem,
      };
      const res = await api.placeOrder(payload);
      setConfirmed(res);
      cart.clear();
      setRedeem(false);
      await refreshProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.isOpen) return null;

  return (
    <>
      {/* backdrop, mobile + desktop */}
      <div className="fixed inset-0 z-40 bg-ink/30" onClick={cart.close} aria-hidden="true" />

      <aside
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm animate-slide-in flex-col bg-linen shadow-docket sm:inset-y-4 sm:right-4 sm:rounded-sm"
        role="dialog"
        aria-label="Order docket"
      >
        <div className="docket-perforation" />

        <div className="flex items-center justify-between border-b border-dashed border-ink/20 px-6 py-4">
          <div>
            <p className="label-eyebrow">Order docket</p>
            <p className="font-display text-lg text-ink">Table for one</p>
          </div>
          <button onClick={cart.close} className="text-ink/50 hover:text-ink" aria-label="Close docket">
            ✕
          </button>
        </div>

        {confirmed ? (
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <p className="label-eyebrow text-forest">Order sent to the kitchen</p>
            <p className="mt-2 font-mono text-sm text-ink/70">
              Order #{confirmed.order._id.slice(-6).toUpperCase()}
            </p>
            <div className="mt-4 space-y-1 font-mono text-sm text-ink/80">
              <p>Total charged: {money(confirmed.order.total_price)}</p>
              {confirmed.loyalty.pointsRedeemed > 0 && <p>Points redeemed: −{confirmed.loyalty.pointsRedeemed}</p>}
              <p>Points earned: +{confirmed.loyalty.pointsEarned}</p>
              <p>New balance: {confirmed.loyalty.newBalance} pts</p>
            </div>
            <button onClick={() => setConfirmed(null)} className="btn-primary mt-6 w-full">
              Start a new order
            </button>
          </div>
        ) : cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-display text-xl text-ink/70">The docket is empty</p>
            <p className="mt-1 text-sm text-ink/50">Add something from the menu to start an order.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-3 font-mono text-sm">
                {cart.items.map((item) => (
                  <li key={item.menuItemId} className="leader-row">
                    <span className="shrink-0 text-ink/50">{item.quantity}×</span>
                    <span className="shrink-0 text-ink">{item.name}</span>
                    <span className="leader-fill" />
                    <span className="shrink-0 text-ink">{money(item.price * item.quantity)}</span>
                    <div className="ml-2 flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => cart.setQuantity(item.menuItemId, item.quantity - 1)}
                        className="h-5 w-5 rounded-sm border border-ink/20 text-xs leading-none hover:bg-ink/5"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>
                      <button
                        onClick={() => cart.setQuantity(item.menuItemId, item.quantity + 1)}
                        className="h-5 w-5 rounded-sm border border-ink/20 text-xs leading-none hover:bg-ink/5"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-dashed border-ink/20 pt-4 font-mono text-sm">
                <div className="leader-row">
                  <span className="text-ink/60">Subtotal</span>
                  <span className="leader-fill" />
                  <span>{money(cart.subtotal)}</span>
                </div>
                {redeem && canRedeem && (
                  <div className="leader-row text-brass">
                    <span>Loyalty discount (10%)</span>
                    <span className="leader-fill" />
                    <span>−{money(cart.subtotal * 0.1)}</span>
                  </div>
                )}
              </div>

              {user?.role === 'customer' && (
                <label className="mt-4 flex items-start gap-2 text-xs text-ink/70">
                  <input
                    type="checkbox"
                    checked={redeem}
                    disabled={!canRedeem}
                    onChange={(e) => setRedeem(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    {canRedeem
                      ? `Redeem 100 loyalty points for 10% off this order (you have ${user.loyaltyPoints} pts).`
                      : `Redeem loyalty points at 100 pts (you have ${user?.loyaltyPoints ?? 0} pts).`}
                  </span>
                </label>
              )}
            </div>

            <div className="border-t border-dashed border-ink/20 px-6 py-4">
              <div className="leader-row mb-4 font-mono text-base font-semibold">
                <span>Total</span>
                <span className="leader-fill" />
                <span>{money(redeem && canRedeem ? cart.subtotal * 0.9 : cart.subtotal)}</span>
              </div>

              {error && <p className="mb-3 text-sm text-brick">{error}</p>}

              {user ? (
                user.role === 'customer' ? (
                  <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary w-full">
                    {placing ? 'Sending to kitchen…' : 'Place order'}
                  </button>
                ) : (
                  <p className="text-center text-sm text-ink/50">Admin accounts can't place orders.</p>
                )
              ) : (
                <p className="text-center text-sm text-ink/60">
                  Please log in as a customer to place this order.
                </p>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
