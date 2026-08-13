import { useEffect, useState } from 'react';
import * as api from '../lib/api';

const CATEGORIES = ['Starter', 'Main Course', 'Dessert', 'Drinks'];
const emptyForm = { name: '', category: 'Starter', price: '', description: '', image_url: '', is_available: true };

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadItems = () => {
    setLoading(true);
    api
      .getMenu()
      .then((res) => setItems(res.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadItems, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description || '',
      image_url: item.image_url || '',
      is_available: item.is_available,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await api.updateMenuItem(editingId, payload);
      } else {
        await api.createMenuItem(payload);
      }
      setFormOpen(false);
      loadItems();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this item from the menu?')) return;
    try {
      await api.deleteMenuItem(id);
      loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await api.updateMenuItem(item._id, { is_available: !item.is_available });
      loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-eyebrow">Back of house</p>
          <h1 className="mt-1 font-display text-3xl text-ink">Manage the menu</h1>
        </div>
        <button onClick={openCreate} className="btn-primary">
          + Add item
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-brick">{error}</p>}

      {formOpen && (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-sm border border-ink/10 bg-linen p-6 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/70">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/70">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/70">Price (INR)</label>
            <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink/70">Image URL (optional)</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-ink/70">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} />
            Available on the menu
          </label>
          <div className="flex items-end justify-end gap-2 sm:col-span-2">
            <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add item'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-ink/50">Loading menu…</p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-sm border border-ink/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-linen text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t border-ink/10">
                  <td className="px-4 py-3 font-medium text-ink">{item.name}</td>
                  <td className="px-4 py-3 text-ink/60">{item.category}</td>
                  <td className="px-4 py-3 font-mono text-brass">₹{item.price.toFixed(0)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAvailability(item)}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.is_available ? 'bg-forest/10 text-forest' : 'bg-brick/10 text-brick'
                      }`}
                    >
                      {item.is_available ? 'Available' : '86\u2019d'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(item)} className="mr-3 text-xs font-semibold text-forest hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="text-xs font-semibold text-brick hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
