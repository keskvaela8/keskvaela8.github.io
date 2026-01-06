export const selectablePeriods = () => {
  const periods: string[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    now.setMonth(now.getMonth() - 1);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    periods.push(`${year}_${month}`);
  }
  return periods;
};
