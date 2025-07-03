export const formatNumber = (value: number | undefined): string => {
  return (value || 0).toLocaleString("et-EE", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
};
