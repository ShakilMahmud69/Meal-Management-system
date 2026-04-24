export default function BazarDetails({ bazars, mealRate, totalCost, totalMeals }) {
  return (
    <div className="rounded-3xl bg-slate-900 p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Bazar details</h2>
          <p className="text-slate-400">Track bazar items and calculate meal rate.</p>
        </div>
        <div className="rounded-3xl bg-slate-800 px-4 py-3 text-sm text-slate-300">
          Meal rate: ${mealRate.toFixed(2)}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Total meals</p>
          <p className="mt-3 text-3xl font-semibold text-white">{totalMeals}</p>
        </div>
        <div className="rounded-3xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Total bazar</p>
          <p className="mt-3 text-3xl font-semibold text-white">${totalCost.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">Meal rate</p>
          <p className="mt-3 text-3xl font-semibold text-white">${mealRate.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950">
        <table className="min-w-full border-collapse text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase">
            <tr>
              <th className="border-b border-slate-700 px-4 py-3">Date</th>
              <th className="border-b border-slate-700 px-4 py-3">Item</th>
              <th className="border-b border-slate-700 px-4 py-3 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {bazars.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                  No bazar items yet.
                </td>
              </tr>
            ) : (
              bazars.map((item) => (
                <tr key={`${item._id}`} className="border-b border-slate-800 last:border-none">
                  <td className="px-4 py-3">{item.date}</td>
                  <td className="px-4 py-3">{item.itemName}</td>
                  <td className="px-4 py-3 text-right">${item.price.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
