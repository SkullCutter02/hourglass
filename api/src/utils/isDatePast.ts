const isDatePast = (firstDate: Date, secondDate = new Date()) => {
  return firstDate.toString() < secondDate.toISOString();
};

export default isDatePast;
