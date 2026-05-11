import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDashboard, updateMeal, createUser, deleteUser, deleteAllUsers } from '../api';
import MealTable from './MealTable';
import SummaryCards from './SummaryCards';
import BazarForm from './BazarForm';
import MealDateForm from './MealDateForm';
import BazarDetails from './BazarDetails';
import History from './History';

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
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [memberMessage, setMemberMessage] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey(new Date()));
  const [showHistory, setShowHistory] = useState(false);

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

    // Save current scroll position
    const scrollPosition = window.scrollY;

    try {
      await updateMeal({ date, lunch, dinner, userId });
      
      // Silently fetch updated data without showing loading state
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (err) {
        setError(err.message);
      }
      
      // Use setTimeout to restore scroll after React re-render completes
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddMember = async (event) => {
    event.preventDefault();
    setMemberMessage('');
    setError('');

    try {
      await createUser({ name: memberName, email: memberEmail, password: memberPassword });
      setMemberMessage('New mess member added successfully.');
      setMemberName('');
      setMemberEmail('');
      setMemberPassword('');
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this mess member?')) {
      return;
    }
    setMemberMessage('');
    setError('');

    try {
      await deleteUser(userId);
      setMemberMessage('Member removed successfully.');
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAllMembers = async () => {
    if (!window.confirm('Delete all non-admin members? This cannot be undone.')) {
      return;
    }
    setMemberMessage('');
    setError('');

    try {
      await deleteAllUsers();
      setMemberMessage('All non-admin members have been deleted.');
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
          {user.isAdmin && <span className="rounded-3xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950">Admin</span>}
          {user.isAdmin && (
            <button
              type="button"
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 rounded-3xl bg-slate-800 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
              title="View modification history"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </button>
          )}
          <button type="button" onClick={logout} className="rounded-3xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-400">
            Logout
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="rounded-3xl bg-slate-900 px-5 py-4 shadow-xl">
          <p className="text-sm text-slate-400">Selected month</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatMonthLabel(selectedMonth)}</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => handleChangeMonth(-1)} className="rounded-3xl bg-slate-800 px-5 py-3 text-sm text-white hover:bg-slate-700">
            Previous month
          </button>
          <button type="button" onClick={() => handleChangeMonth(1)} className="rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
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
                  <p className="mt-1 text-cyan-300">Estimated cost: ৳{summary.cost.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 shadow-xl">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Meal table</h2>
                <p className="text-slate-400">Click on your own user cells to toggle lunch/dinner values. Admin can edit any member's meals.</p>
              </div>
              <div className="rounded-3xl bg-slate-800 px-4 py-3 text-sm text-slate-300">
                {user.isAdmin ? 'Admin can edit all members' : `Editable only for ${user.name}`}
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
          {user.isAdmin && (
            <div className="rounded-3xl bg-slate-900 p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Member management</h2>
                  <p className="text-slate-400">Add or remove mess members from the system.</p>
                </div>
              </div>

              {memberMessage && <div className="mb-4 rounded-3xl bg-emerald-500/20 p-4 text-emerald-200">{memberMessage}</div>}
              {error && <div className="mb-4 rounded-3xl bg-red-500/20 p-4 text-red-200">{error}</div>}

              <form className="space-y-4" onSubmit={handleAddMember}>
                <label className="block space-y-2 text-sm text-slate-300">
                  Name
                  <input value={memberName} onChange={(e) => setMemberName(e.target.value)} type="text" placeholder="Member name" />
                </label>
                <label className="block space-y-2 text-sm text-slate-300">
                  Email
                  <input value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} type="email" placeholder="Member email" />
                </label>
                <label className="block space-y-2 text-sm text-slate-300">
                  Password
                  <input value={memberPassword} onChange={(e) => setMemberPassword(e.target.value)} type="password" placeholder="Temporary password" />
                </label>
                <button type="submit" className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
                  Add member
                </button>
              </form>

              <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-slate-700 bg-slate-800 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Current members</h3>
                    <p className="text-slate-400 text-sm">You can remove members one by one or delete all non-admin members.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteAllMembers}
                    className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400"
                  >
                    Delete all members
                  </button>
                </div>
                <div className="space-y-3">
                  {dashboard.users.map((member) => (
                    <div key={member._id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-slate-900 p-4">
                      <div>
                        <p className="font-semibold text-white">{member.name}</p>
                        <p className="text-slate-400 text-sm">{member.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member._id)}
                        disabled={member._id === user._id}
                        className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                      >
                        {member._id === user._id ? 'Cannot remove self' : 'Remove'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <MealDateForm onCreated={loadDashboard} defaultDate={monthDays[0]} />
          <BazarDetails bazars={monthlyBazars} mealRate={monthlyMealRate} totalCost={monthlyTotalCost} totalMeals={monthlyTotalMeals} />
        </div>
      </section>

      <History isVisible={showHistory} onClose={() => setShowHistory(false)} />
    </div>
  );
}
