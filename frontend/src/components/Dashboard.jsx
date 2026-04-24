import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboard, updateMeal } from '../api';
import MealTable from './MealTable';
import SummaryCards from './SummaryCards';
import BazarForm from './BazarForm';
import MealDateForm from './MealDateForm';
import BazarDetails from './BazarDetails';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userSummary = useMemo(() => dashboard?.users || [], [dashboard]);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleToggle = async (date, mealType, currentValue, userId) => {
    if (!dashboard) return;
    const row = dashboard.meals.find(
      (meal) => meal.date === date && String(meal.userId._id) === String(userId)
    );

    const lunch = mealType === 'lunch' ? (currentValue ? 0 : 1) : row?.lunch || 0;
    const dinner = mealType === 'dinner' ? (currentValue ? 0 : 1) : row?.dinner || 0;

    try {
      await updateMeal({ date, lunch, dinner, userId });
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 p-8 text-slate-200">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-8 text-slate-100">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-slate-400">Manage meals, bazar cost, and meal rate with your group.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <span className="rounded-3xl bg-slate-800 px-4 py-3 text-sm text-slate-300">Signed in as {user.name}</span>
          <button onClick={logout} className="rounded-3xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-400">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="mb-6 rounded-3xl bg-red-500/20 p-4 text-red-200">{error}</div>}

      <SummaryCards totalMeals={dashboard.totalMeals} totalCost={dashboard.totalCost} mealRate={dashboard.mealRate} />

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900 p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white">User cost summary</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {userSummary.map((summary) => (
                <div key={summary._id} className="rounded-3xl border border-slate-700 bg-slate-800 p-4">
                  <p className="font-semibold text-white">{summary.name}</p>
                  <p className="mt-2 text-slate-400">Meals: {summary.totalMeals}</p>
                  <p className="mt-1 text-cyan-300">Estimated cost: ${summary.cost.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 shadow-xl">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Meal table</h2>
                <p className="text-slate-400">Click on your own user cells to toggle lunch/dinner values.</p>
              </div>
              <div className="rounded-3xl bg-slate-800 px-4 py-3 text-sm text-slate-300">
                Editable only for {user.name}
              </div>
            </div>
            <MealTable users={dashboard.users} meals={dashboard.meals} currentUser={user} onToggle={handleToggle} />
          </div>

          {user.isAdmin && <BazarForm onSaved={loadDashboard} />}
        </div>

        <div className="space-y-6">
          <MealDateForm onCreated={loadDashboard} />
          <BazarDetails bazars={dashboard.bazars} mealRate={dashboard.mealRate} totalCost={dashboard.totalCost} totalMeals={dashboard.totalMeals} />
        </div>
      </section>
    </div>
  );
}
