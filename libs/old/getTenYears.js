import {getDaysInMonth, avg} from '../helper.js';

export const getMeteoDataForEachYearCalculated = (resultat, year) => {
    const meteoDataForYearCalculated = [];
    let cummul = 0;
    
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(year, i).toLocaleString("default", {
        month: "long",
      });
      const nbDayPerMonth = getDaysInMonth(year, i);

      const tempMaxAllMonth = resultat.daily.temperature_2m_max.slice(
        cummul,
        cummul + nbDayPerMonth
      );
      const tempMinAllMonth = resultat.daily.temperature_2m_min.slice(
        cummul,
        cummul + nbDayPerMonth
      );
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
    return { year: year, meteoDataForYearCalculated };
  };