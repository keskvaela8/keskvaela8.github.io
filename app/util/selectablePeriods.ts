export const selectablePeriods = () => {
  const periods: string[] = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const year = now.getFullYear();
    const month = String(now.getMonth()).padStart(2, "0");
    periods.push(`${year}_${month}`);
    now.setMonth(now.getMonth() - 1);
  }
  return periods;
};
