const estonianDateFormat = new Intl.DateTimeFormat("et-EE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const formatDate = (date: Date): string => {
  return estonianDateFormat.format(date);
};
