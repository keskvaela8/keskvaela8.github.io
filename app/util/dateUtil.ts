const estonianDateFormat = new Intl.DateTimeFormat("et-EE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const formatDate = (date: Date): string => {
  return estonianDateFormat.format(date);
};

export const formatEuropeanDateToISO = (date: string): string => {
  // Split the DD.MM.YYYY format
  const [day, month, year] = date.split(".");
  // Return in YYYY-MM-DD format
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};
