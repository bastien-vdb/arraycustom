import { actualDay, getMonth, actualYear, getDaysInMonth, avg } from "./../helper";

export const getMeteoDataForYearCalculated = (resultat, year) => {
  // Data selected is for the actual year
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

      const { max, min, tempAvg, rainAvg } = getDataByMonth(resultat, cummul, nbDayPerMonth);
      cummul += nbDayPerMonth;

      const dataOfOneMonth = {
        monthName,
        max,
        min,
        tempAvg,
        rainAvg,
      };

      meteoDataForYearCalculated.push(dataOfOneMonth);
    }
  }
  else {
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(year, i).toLocaleString("default", {
        month: "long",
      });
      let nbDayPerMonth = getDaysInMonth(year, i);

      const { max, min, tempAvg, rainAvg } = getDataByMonth(resultat, cummul, nbDayPerMonth);
      cummul += nbDayPerMonth;

      const dataOfOneMonth = {
        monthName,
        max,
        min,
        tempAvg,
        rainAvg,
      };

      meteoDataForYearCalculated.push(dataOfOneMonth);
    }
  }
  return {year, meteoDataForYearCalculated};
};

export const getDataByMonth = (resultat, cummul, nbDayPerMonth) => {
  const tempMaxAllMonth = resultat.daily.temperature_2m_max.slice(cummul, cummul + nbDayPerMonth);
  const tempMinAllMonth = resultat.daily.temperature_2m_min
    .filter((value) => value !== null)
    .slice(cummul, cummul + nbDayPerMonth);
  const rainSum = resultat.daily.rain_sum.slice(cummul, cummul + nbDayPerMonth);
  cummul += nbDayPerMonth;
  const max = Math.max(...tempMaxAllMonth);
  const min = Math.min(...tempMinAllMonth);

  const temperatureMaxAvg = avg(tempMaxAllMonth);
  const temperatureMinAvg = avg(tempMinAllMonth);
  const tempAvg = avg([temperatureMaxAvg, temperatureMinAvg]).toFixed(2);
  const rainAvg = avg(rainSum).toFixed(2);

  return { max, min, tempAvg, rainAvg };
};
