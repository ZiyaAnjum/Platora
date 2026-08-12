import { useEffect, useState } from 'react';
import * as api from '../lib/api';
import StatusTimeline from '../components/StatusTimeline';

const STATUSES = ['Pending', 'Preparing', 'Out for delivery', 'Delivered'];
const money = (n) => `$${n.toFixed(2)}`;
const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    api
      .getAllOrders(statusFilter || undefined)
      .then((res) => setOrders(res.orders))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, [statusFilter]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await api.updateOrderStatus(orderId, status);
      loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label-eyebrow">Kitchen view</p>
          <h1 className="mt-1 font-display text-3xl text-ink">Order queue</h1>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mt-4 text-sm text-brick">{error}</p>}

      {loading ? (
        <p className="mt-8 text-sm text-ink/50">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="mt-8 rounded-sm border border-dashed border-ink/20 px-6 py-12 text-center">
          <p className="font-display text-xl text-ink/70">Queue is clear.</p>
          <p className="mt-1 text-sm text-ink/50">No orders match this filter right now.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-sm border border-ink/10 bg-linen p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-ink/50">#{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm font-medium text-ink">{order.user?.name}</p>
                  <p className="text-xs text-ink/50">{order.user?.email}</p>
                  <p className="mt-1 text-xs text-ink/50">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg text-brass">{money(order.total_price)}</p>
                  <p className="text-xs text-ink/50">{order.items.reduce((n, i) => n + i.quantity, 0)} items</p>
                </div>
              </div>

              <p className="mt-3 text-sm text-ink/60">
                {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="max-w-xs flex-1">
                  <StatusTimeline status={order.status} compact />
                </div>
                <select
                  value={order.status}
                  disabled={updatingId === order._id}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="input-field w-auto"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
