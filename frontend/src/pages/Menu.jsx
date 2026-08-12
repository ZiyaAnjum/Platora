import { useEffect, useMemo, useState } from 'react';
import * as api from '../lib/api';
import MenuItemRow from '../components/MenuItemRow';

const CATEGORIES = ['Starter', 'Main Course', 'Dessert', 'Drinks'];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    const params = {};
    if (search) params.search = search;
    if (activeCategory !== 'All') params.category = activeCategory;

    api
      .getMenu(params)
      .then((res) => {
        if (!cancelled) setItems(res.items);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map(CATEGORIES.map((c) => [c, []]));
    items.forEach((item) => {
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category).push(item);
    });
    return Array.from(map.entries()).filter(([, list]) => list.length > 0);
  }, [items]);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-ink/10 bg-linen">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="label-eyebrow">Neighborhood trattoria, est. today</p>
          <h1 className="mt-3 max-w-2xl font-display text-5xl font-semibold leading-[1.05] text-ink">
            Table service, made simple.
          </h1>
          <p className="mt-4 max-w-lg text-ink/70">
            Browse the printed menu below, build your order on the docket, and send it straight to the kitchen —
            no waiting for a server to swing by.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? 'border-forest bg-forest text-paper'
                    : 'border-ink/20 text-ink/60 hover:border-ink/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the menu…"
            className="input-field max-w-xs"
            aria-label="Search menu items"
          />
        </div>
      </section>

      {/* Menu listing */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        {loading && <p className="text-sm text-ink/50">Setting the table…</p>}
        {error && <p className="text-sm text-brick">{error}</p>}

        {!loading && !error && grouped.length === 0 && (
          <div className="rounded-sm border border-dashed border-ink/20 px-6 py-12 text-center">
            <p className="font-display text-xl text-ink/70">Nothing matches, chef.</p>
            <p className="mt-1 text-sm text-ink/50">Try a different search or category.</p>
          </div>
        )}

        <div className="grid gap-10 sm:grid-cols-2">
          {grouped.map(([category, list]) => (
            <div key={category}>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="font-display text-2xl text-ink">{category}</h2>
                <div className="h-px flex-1 bg-ink/15" />
              </div>
              <div>
                {list.map((item) => (
                  <MenuItemRow key={item._id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
