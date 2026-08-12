import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-forest' : 'text-ink/60 hover:text-ink'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <NavLink to="/menu" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">Foglia</span>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-ink/40 sm:inline">
            Trattoria
          </span>
        </NavLink>

        <nav className="flex items-center gap-6">
          <NavLink to="/menu" className={navLinkClass}>
            Menu
          </NavLink>
          {user && user.role === 'customer' && (
            <NavLink to="/my-orders" className={navLinkClass}>
              My orders
            </NavLink>
          )}
          {user && user.role === 'admin' && (
            <>
              <NavLink to="/admin/menu" className={navLinkClass}>
                Manage menu
              </NavLink>
              <NavLink to="/admin/orders" className={navLinkClass}>
                Order queue
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {(!user || user.role === 'customer') && (
            <button
              onClick={cart.toggle}
              className="relative inline-flex items-center gap-2 rounded-sm border border-ink/20 px-3 py-1.5 text-sm font-medium text-ink hover:border-ink/40"
              aria-label="Open order docket"
            >
              Docket
              {cart.itemCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brass px-1 font-mono text-[11px] font-semibold text-paper">
                  {cart.itemCount}
                </span>
              )}
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-tight text-ink">{user.name}</p>
                {user.role === 'customer' && (
                  <p className="font-mono text-[11px] leading-tight text-brass">{user.loyaltyPoints} pts</p>
                )}
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/menu');
                }}
                className="btn-secondary !px-3 !py-1.5 text-xs"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="btn-secondary !px-3 !py-1.5 text-xs">
                Log in
              </NavLink>
              <NavLink to="/signup" className="btn-primary !px-3 !py-1.5 text-xs">
                Sign up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
