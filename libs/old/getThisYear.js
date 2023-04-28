import {actualDay, getMonth, actualMonth, actualYear, getDaysInMonth, avg} from './helper.js';

export const getMeteoDataForYearCalculated = (resultat) => {
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
      const max = Math.max(...tempMaxAllMonth);
      const min = Math.min(...tempMinAllMonth);

      const temperatureMaxAvg = avg(tempMaxAllMonth);
      const temperatureMinAvg = avg(tempMinAllMonth);
      const tempAvg = avg([temperatureMaxAvg, temperatureMinAvg]).toFixed(2);
      const rainAvg = avg(rainSum).toFixed(2);

      const dataOfOneMonth = {
        monthName,
        max,
        min,
        tempAvg,
        rainAvg,
      };

      meteoDataForYearCalculated.push(dataOfOneMonth);
    }

    return [{ year: actualYear, meteoDataForYearCalculated }];
  };