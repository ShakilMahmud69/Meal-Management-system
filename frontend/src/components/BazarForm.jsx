import { useState } from 'react';
import { addBazarItem } from '../api';

export default function BazarForm({ onSaved }) {
  const [date, setDate] = useState('');
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await addBazarItem({ date, itemName, price: Number(price) });
      setDate('');
      setItemName('');
      setPrice('');
      onSaved();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="rounded-3xl bg-slate-800 p-6 shadow-xl">
      <h3 className="text-xl font-semibold text-white">Add Bazar item</h3>
      {error && <p className="mt-3 rounded-2xl bg-red-500/20 p-3 text-sm text-red-200">{error}</p>}
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2 text-sm text-slate-300">
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="block space-y-2 text-sm text-slate-300">
          Item name
          <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Rice, vegetables, etc." />
        </label>
        <label className="block space-y-2 text-sm text-slate-300">
          Price
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" placeholder="20.50" />
        </label>
        <button type="submit" className="rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
          Save item
        </button>
      </form>
    </div>
  );
}
