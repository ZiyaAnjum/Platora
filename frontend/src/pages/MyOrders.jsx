import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../lib/api';
import StatusTimeline from '../components/StatusTimeline';

const money = (n) => `₹${n.toFixed(0)}`;
const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getMyOrders()
      .then((res) => setOrders(res.orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <p className="label-eyebrow">Your history</p>
      <h1 className="mt-1 font-display text-3xl text-ink">My orders</h1>

      {loading && <p className="mt-8 text-sm text-ink/50">Fetching your dockets…</p>}
      {error && <p className="mt-8 text-sm text-brick">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-8 rounded-sm border border-dashed border-ink/20 px-6 py-12 text-center">
          <p className="font-display text-xl text-ink/70">No orders yet.</p>
          <p className="mt-1 text-sm text-ink/50">
            Head to the{' '}
            <Link to="/menu" className="font-semibold text-forest hover:underline">
              menu
            </Link>{' '}
            to place your first one.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="block rounded-sm border border-ink/10 bg-linen p-5 transition-colors hover:border-forest/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-ink/50">#{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-ink/70">{formatDate(order.created_at)}</p>
              </div>
              <p className="font-mono text-lg text-brass">{money(order.total_price)}</p>
            </div>
            <p className="mt-2 text-sm text-ink/60">
              {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
            </p>
            <div className="mt-4">
              <StatusTimeline status={order.status} compact />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
