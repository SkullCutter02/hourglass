const isDatePast = (firstDate: Date, secondDate = new Date()) => {
  if (!firstDate) return false;
  return firstDate.toString() < secondDate.toISOString();
};

export default isDatePast;
