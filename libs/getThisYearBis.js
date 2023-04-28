import {actualDay, getMonth, actualMonth, actualYear, getDaysInMonth, avg} from './helper.js';

export const getDataForthisYear = (resultat) => {
    // Data selected is for the actual year
    const meteoDataForYearCalculated = [];
    let cummul = 0;
    for (let i = 0; i < getMonth; i++) {
      const monthName = new Date(actualYear, i).toLocaleString("default", {
        month: "long",
      });
      let nbDayPerMonth = getDaysInMonth(actualYear, i);
      if (actualMonth === getMonth - 1) {
        nbDayPerMonth = actualDay;
      }

      const tempMaxAllMonth = resultat.daily.temperature_2m_max.slice(
        cummul,
        cummul + nbDayPerMonth
      );
      const tempMinAllMonth = resultat.daily.temperature_2m_min
        .filter((value) => value !== null)
        .slice(cummul, cummul + nbDayPerMonth);
      const rainSum = resultat.daily.rain_sum.slice(
        cummul,
        cummul + nbDayPerMonth
      );
      cummul += nbDayPerMonth;

      meteoDataForYearCalculated[monthName] = {tempMaxAllMonth, tempMinAllMonth, rainSum};
    }

    return meteoDataForYearCalculated;
  };