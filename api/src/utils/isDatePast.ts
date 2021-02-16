const isDatePast = (firstDate, secondDate = new Date()) => {
  return firstDate < secondDate;
};

export default isDatePast;
