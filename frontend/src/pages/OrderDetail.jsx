import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as api from '../lib/api';
import StatusTimeline from '../components/StatusTimeline';

const money = (n) => `$${n.toFixed(2)}`;
const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getOrderById(id)
      .then((res) => setOrder(res.order))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="mx-auto max-w-2xl px-6 py-16 text-sm text-ink/50">Loading order…</p>;
  if (error) return <p className="mx-auto max-w-2xl px-6 py-16 text-sm text-brick">{error}</p>;
  if (!order) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link to="/my-orders" className="text-sm text-forest hover:underline">
        ← Back to my orders
      </Link>

      <div className="mt-6 rounded-sm border border-ink/10 bg-linen">
        <div className="docket-perforation" />
        <div className="px-6 py-6">
          <p className="label-eyebrow">Order #{order._id.slice(-6).toUpperCase()}</p>
          <p className="mt-1 text-sm text-ink/60">{formatDate(order.created_at)}</p>

          <div className="mt-6">
            <StatusTimeline status={order.status} />
          </div>

          <ul className="mt-8 space-y-2 border-t border-dashed border-ink/20 pt-6 font-mono text-sm">
            {order.items.map((item) => (
              <li key={item.menuItem} className="leader-row">
                <span className="shrink-0 text-ink/50">{item.quantity}×</span>
                <span className="shrink-0 text-ink">{item.name}</span>
                <span className="leader-fill" />
                <span className="shrink-0 text-ink">{money(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-1 border-t border-dashed border-ink/20 pt-4 font-mono text-sm">
            <div className="leader-row text-ink/60">
              <span>Subtotal</span>
              <span className="leader-fill" />
              <span>{money(order.subtotal)}</span>
            </div>
            {order.loyaltyDiscountApplied > 0 && (
              <div className="leader-row text-brass">
                <span>Loyalty discount</span>
                <span className="leader-fill" />
                <span>−{money(order.loyaltyDiscountApplied)}</span>
              </div>
            )}
            <div className="leader-row text-base font-semibold text-ink">
              <span>Total</span>
              <span className="leader-fill" />
              <span>{money(order.total_price)}</span>
            </div>
            {order.loyaltyPointsEarned > 0 && (
              <p className="pt-1 text-xs text-ink/50">Earned {order.loyaltyPointsEarned} loyalty points on this order.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
