export default function SummaryCards({ totalMeals, totalCost, mealRate }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl bg-slate-800 p-6 shadow-xl">
        <p className="text-sm text-slate-400">Total meals</p>
        <p className="mt-4 text-4xl font-semibold text-white">{totalMeals}</p>
      </div>
      <div className="rounded-3xl bg-slate-800 p-6 shadow-xl">
        <p className="text-sm text-slate-400">Total bazar cost</p>
        <p className="mt-4 text-4xl font-semibold text-white">৳{totalCost.toFixed(2)}</p>
      </div>
      <div className="rounded-3xl bg-slate-800 p-6 shadow-xl">
        <p className="text-sm text-slate-400">Meal rate</p>
        <p className="mt-4 text-4xl font-semibold text-white">৳{mealRate.toFixed(2)}</p>
      </div>
    </div>
  );
}
