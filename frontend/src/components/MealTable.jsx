const getDateRows = (meals) => {
  const dates = Array.from(new Set(meals.map((meal) => meal.date))).sort();
  const cells = {};

  meals.forEach((meal) => {
    const userId = String(meal.userId._id);
    if (!cells[meal.date]) cells[meal.date] = {};
    cells[meal.date][userId] = { lunch: meal.lunch, dinner: meal.dinner };
  });

  return { dates, cells };
};

const getTotals = (dates, users, cells) => {
  return users.map((user) => {
    const userId = String(user._id);
    const totalMeals = dates.reduce((sum, date) => {
      const meal = cells[date]?.[userId] || { lunch: 0, dinner: 0 };
      return sum + meal.lunch + meal.dinner;
    }, 0);
    return { userId, totalMeals };
  });
};

export default function MealTable({ users, monthDates, meals, currentUser, onToggle }) {
  const { dates: mealDates, cells } = getDateRows(meals);
  const dates = monthDates.length > 0 ? monthDates : mealDates;
  const totals = getTotals(dates, users, cells);

  return (
    <div className="overflow-x-auto rounded-3xl bg-slate-900 p-4 shadow-xl">
      <table className="min-w-full table-auto border-separate border-spacing-0">
        <thead>
          <tr className="text-left text-sm uppercase text-slate-400">
            <th className="border-b border-slate-700 p-3">Date</th>
            {users.map((user) => (
              <th key={`${user._id}-header`} className="border-b border-slate-700 p-3 text-center" colSpan={2}>
                {user.name}
              </th>
            ))}
          </tr>
          <tr className="text-slate-500 text-xs uppercase">
            <th />
            {users.flatMap((user) => [
              <th key={`${user._id}-lunch`} className="border-b border-slate-700 p-2 text-center">Lunch</th>,
              <th key={`${user._id}-dinner`} className="border-b border-slate-700 p-2 text-center">Dinner</th>,
            ])}
          </tr>
        </thead>
        <tbody>
          {dates.length === 0 && (
            <tr>
              <td colSpan={1 + users.length * 2} className="p-6 text-center text-slate-400">
                No meal records yet for this month.
              </td>
            </tr>
          )}
          {dates.map((date) => (
            <tr key={date} className="border-b border-slate-800 hover:bg-slate-950/50">
              <td className="p-3 text-sm text-slate-300">{date}</td>
              {users.map((user) => {
                const userId = String(user._id);
                const meal = cells[date]?.[userId] || { lunch: 0, dinner: 0 };
                const canEdit = currentUser?.isAdmin || String(user._id) === String(currentUser?._id);
                return [
                  <td key={`${date}-${user._id}-lunch`} className="p-2 text-center">
                    <button
                      disabled={!canEdit}
                      onClick={() => onToggle(date, 'lunch', meal.lunch, userId)}
                      data-tooltip={`${user.name} - Lunch`}
                      className={`meal-tooltip mx-auto inline-flex h-10 w-20 items-center justify-center rounded-2xl font-semibold ${
                        meal.lunch ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                      } ${canEdit ? 'cursor-pointer hover:brightness-110' : 'cursor-not-allowed opacity-60'}`}
                    >
                      {meal.lunch ? '1' : '0'}
                    </button>
                  </td>,
                  <td key={`${date}-${user._id}-dinner`} className="p-2 text-center">
                    <button
                      disabled={!canEdit}
                      onClick={() => onToggle(date, 'dinner', meal.dinner, userId)}
                      data-tooltip={`${user.name} - Dinner`}
                      className={`meal-tooltip mx-auto inline-flex h-10 w-20 items-center justify-center rounded-2xl font-semibold ${
                        meal.dinner ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                      } ${canEdit ? 'cursor-pointer hover:brightness-110' : 'cursor-not-allowed opacity-60'}`}
                    >
                      {meal.dinner ? '1' : '0'}
                    </button>
                  </td>,
                ];
              })}
            </tr>
          ))}
          <tr className="bg-slate-800 text-slate-200">
            <td className="p-3 font-semibold">TOTAL</td>
            {totals.map((total) => (
              <td key={`${total.userId}-total-1`} className="border-l border-slate-700 px-2 py-3 text-center font-semibold" colSpan={2}>
                {total.totalMeals}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
