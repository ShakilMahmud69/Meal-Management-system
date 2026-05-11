import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function SignupPage({ onSwitch }) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await signup({ name, email, password });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Sign Up</h2>
      {error && <div className="rounded-2xl bg-red-500/20 px-4 py-3 text-red-200">{error}</div>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm text-slate-300">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter name" />
        </label>
        <label className="block space-y-2 text-sm text-slate-300">
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" />
        </label>
        <label className="block space-y-2 text-sm text-slate-300">
          Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Create password" />
        </label>
        <button type="submit" className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
          Create account
        </button>
      </form>
      <p className="text-sm text-slate-400">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-cyan-300 hover:text-cyan-100">
          Login
        </button>
      </p>
    </div>
  );
}
