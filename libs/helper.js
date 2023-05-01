export const actualDay = new Date().getDate();
export const getMonth = new Date().getMonth() + 1;
export const actualMonth = getMonth.toString().padStart(2, "0");
export const actualYear = new Date().getFullYear();
export const padDate= (date) => date.toString().padStart(2, "0");
//Avg calculation
export const avg = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

//getNumber of days in a month
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};