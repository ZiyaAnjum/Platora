import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Docket from './components/Docket';
import ProtectedRoute from './components/ProtectedRoute';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import AdminMenu from './pages/AdminMenu';
import AdminOrders from './pages/AdminOrders';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <Docket />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/menu" replace />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute role="customer">
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <ProtectedRoute role="admin">
                <AdminMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="admin">
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="border-t border-ink/10 py-8 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink/40">
        Foglia — built for the table
      </footer>
    </div>
  );
}
