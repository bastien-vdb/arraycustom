import { actualDay, getMonth, actualYear, getDaysInMonth } from "./helper.js";

export const getDataForTenYears = (resultat, year) => {
  const meteoDataForYearCalculated = [];
  let cummul = 0;

  if (year === actualYear) {
    for (let i = 0; i < getMonth; i++) {
      const monthName = new Date(actualYear, i).toLocaleString("default", {
        month: "long",
      });
      let nbDayPerMonth = getDaysInMonth(year, i);

      if (i === getMonth - 1) {
        nbDayPerMonth = actualDay;
      }

      const { tempMaxAllMonth, tempMinAllMonth, rainSum } = getDataByMonth(resultat, cummul, nbDayPerMonth);
      cummul += nbDayPerMonth;

      meteoDataForYearCalculated[monthName] = { tempMaxAllMonth, tempMinAllMonth, rainSum };
    }
  } else {
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(year, i).toLocaleString("default", {
        month: "long",
      });
      let nbDayPerMonth = getDaysInMonth(year, i);

      const { tempMaxAllMonth, tempMinAllMonth, rainSum } = getDataByMonth(resultat, cummul, nbDayPerMonth);
      cummul += nbDayPerMonth;

      meteoDataForYearCalculated[monthName] = { tempMaxAllMonth, tempMinAllMonth, rainSum };
    }
  }
  return meteoDataForYearCalculated;
};

export const getDataByMonth = (resultat, cummul, nbDayPerMonth) => {
  const tempMaxAllMonth = resultat.daily.temperature_2m_max
    .filter((value) => value !== null | value !== 0)
    .slice(cummul, cummul + nbDayPerMonth);
  const tempMinAllMonth = resultat.daily.temperature_2m_min
    .filter((value) => value !== null | value !== 0)
    .slice(cummul, cummul + nbDayPerMonth);
  const rainSum = resultat.daily.rain_sum.filter((value) => value !== null | value !== 0).slice(cummul, cummul + nbDayPerMonth);

  return { tempMaxAllMonth, tempMinAllMonth, rainSum };
};
