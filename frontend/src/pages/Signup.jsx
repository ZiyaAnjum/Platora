import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await signup(form.name, form.email, form.password, form.role);
      navigate(user.role === 'admin' ? '/admin/menu' : '/menu');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-20">
      <p className="label-eyebrow text-center">Join the house</p>
      <h1 className="mt-2 text-center font-display text-3xl text-ink">Create your account</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-sm border border-ink/10 bg-linen p-6">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/70">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/70">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/70">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink/70">Account type</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="input-field"
          >
            <option value="customer">Customer — browse & order</option>
            <option value="admin">Admin — manage restaurant</option>
          </select>
        </div>

        {error && <p className="text-sm text-brick">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-forest hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
