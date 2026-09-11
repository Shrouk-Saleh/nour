import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Register({ onSwitch }) {
  const { register } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await register(form.name, form.email, form.password);
    if (!success) {
      setError('Registration failed. Please try again or use a different email.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-card">
        <h1 className="mb-2 text-2xl font-bold text-ink-900">Create Account 🌱</h1>
        <p className="mb-6 text-sm text-ink-600">Sign up to get your exact personalized schedule.</p>
        {error && <p className="mb-4 text-sm font-semibold text-bloom-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-600">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full rounded-xl border border-paper-200 bg-paper-50 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-600">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full rounded-xl border border-paper-200 bg-paper-50 px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-600">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="w-full rounded-xl border border-paper-200 bg-paper-50 px-3 py-2.5 text-sm"
            />
          </div>
          <button type="submit" className="w-full rounded-full bg-sprout-500 py-2.5 font-semibold text-white transition-colors hover:bg-sprout-600">
            Sign up
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-600">
          Already have an account?{' '}
          <button type="button" onClick={onSwitch} className="font-semibold text-sprout-600 underline">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
