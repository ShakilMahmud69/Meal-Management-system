import { useState } from 'react';
import { createMealDate } from '../api';

export default function MealDateForm({ onCreated }) {
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    if (!date) {
      setError('Please select a date');
      return;
    }

    try {
      await createMealDate({ date });
      setStatus('Date row created successfully');
      setDate('');
      onCreated();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="rounded-3xl bg-slate-800 p-6 shadow-xl">
      <h3 className="text-xl font-semibold text-white">Add meal date</h3>
      <p className="mt-2 text-slate-400">Create a new date row so you can add meal values.</p>
      {error && <p className="mt-4 rounded-2xl bg-red-500/20 p-3 text-sm text-red-200">{error}</p>}
      {status && <p className="mt-4 rounded-2xl bg-emerald-500/20 p-3 text-sm text-emerald-200">{status}</p>}
      <form className="mt-4 flex flex-col gap-4 sm:flex-row" onSubmit={handleSubmit}>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100" />
        <button type="submit" className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
          Add date
        </button>
      </form>
    </div>
  );
}
