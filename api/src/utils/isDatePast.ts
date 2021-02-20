const isDatePast = (firstDate: Date): boolean => {
  if (!firstDate) return false;

  return new Date(firstDate) < new Date(Date.now());
};

export default isDatePast;
