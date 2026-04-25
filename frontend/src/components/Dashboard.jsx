import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboard, updateMeal } from '../api';
import MealTable from './MealTable';
import SummaryCards from './SummaryCards';
import BazarForm from './BazarForm';
import MealDateForm from './MealDateForm';
import BazarDetails from './BazarDetails';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getMonthKey = (date) => ({ year: date.getFullYear(), month: date.getMonth() });
const formatMonthLabel = (monthKey) => `${MONTHS[monthKey.month]} ${monthKey.year}`;
const getMonthDays = (monthKey) => {
  const days = [];
  const date = new Date(monthKey.year, monthKey.month, 1);
  while (date.getMonth() === monthKey.month) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    days.push(`${date.getFullYear()}-${month}-${day}`);
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey(new Date()));

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

  const monthlyMeals = useMemo(() => {
    if (!dashboard) return [];
    return dashboard.meals.filter((meal) => {
      const mealDate = new Date(meal.date);
      return mealDate.getFullYear() === selectedMonth.year && mealDate.getMonth() === selectedMonth.month;
    });
  }, [dashboard, selectedMonth]);

  const monthlyBazars = useMemo(() => {
    if (!dashboard) return [];
    return dashboard.bazars.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate.getFullYear() === selectedMonth.year && itemDate.getMonth() === selectedMonth.month;
    });
  }, [dashboard, selectedMonth]);

  const monthlyTotalMeals = useMemo(() => monthlyMeals.reduce((sum, meal) => sum + meal.lunch + meal.dinner, 0), [monthlyMeals]);
  const monthlyTotalCost = useMemo(() => monthlyBazars.reduce((sum, item) => sum + item.price, 0), [monthlyBazars]);
  const monthlyMealRate = monthlyTotalMeals > 0 ? monthlyTotalCost / monthlyTotalMeals : 0;

  const userSummary = useMemo(() => {
    if (!dashboard) return [];
    return dashboard.users.map((userItem) => {
      const userMeals = monthlyMeals.filter((meal) => String(meal.userId._id) === String(userItem._id));
      const totalMeals = userMeals.reduce((sum, meal) => sum + meal.lunch + meal.dinner, 0);
      return {
        _id: userItem._id,
        name: userItem.name,
        totalMeals,
        cost: Number((totalMeals * monthlyMealRate).toFixed(2)),
      };
    });
  }, [dashboard, monthlyMeals, monthlyMealRate]);

  const monthDays = useMemo(() => getMonthDays(selectedMonth), [selectedMonth]);

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

  const handleChangeMonth = (delta) => {
    const date = new Date(selectedMonth.year, selectedMonth.month + delta, 1);
    setSelectedMonth(getMonthKey(date));
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 p-8 text-slate-200">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-8 text-slate-100">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monthly Meal Dashboard</h1>
          <p className="mt-2 text-slate-400">View monthly lunch and dinner records for your mess group.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <span className="rounded-3xl bg-slate-800 px-4 py-3 text-sm text-slate-300">Signed in as {user.name}</span>
          <button onClick={logout} className="rounded-3xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-400">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="mb-6 rounded-3xl bg-red-500/20 p-4 text-red-200">{error}</div>}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="rounded-3xl bg-slate-900 px-5 py-4 shadow-xl">
          <p className="text-sm text-slate-400">Selected month</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatMonthLabel(selectedMonth)}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleChangeMonth(-1)} className="rounded-3xl bg-slate-800 px-5 py-3 text-sm text-white hover:bg-slate-700">
            Previous month
          </button>
          <button onClick={() => handleChangeMonth(1)} className="rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
            Next month
          </button>
        </div>
      </div>

      <SummaryCards totalMeals={monthlyTotalMeals} totalCost={monthlyTotalCost} mealRate={monthlyMealRate} />

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
            <MealTable
              users={dashboard.users}
              monthDates={monthDays}
              meals={monthlyMeals}
              currentUser={user}
              onToggle={handleToggle}
            />
          </div>
        </div>

        <div className="space-y-6">
          <MealDateForm onCreated={loadDashboard} defaultDate={monthDays[0]} />
          <BazarDetails bazars={monthlyBazars} mealRate={monthlyMealRate} totalCost={monthlyTotalCost} totalMeals={monthlyTotalMeals} />
        </div>
      </section>
    </div>
  );
}
