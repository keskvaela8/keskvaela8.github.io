const START_YEAR = 2025;
const START_MONTH = 1;

export const selectablePeriods = () => {
  const periods: string[] = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  let year = currentYear;
  let month = currentMonth - 1 || 12;
  if (month === 12) year--;

  while (year > START_YEAR || (year === START_YEAR && month >= START_MONTH)) {
    periods.push(`${year}_${String(month).padStart(2, "0")}`);
    month--;
    if (month === 0) {
      month = 12;
      year--;
    }
  }
  return periods;
};
