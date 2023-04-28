import { avg } from "./helper.js";
export const calculations = (allCompiled) => {
    const all = [];
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(0, i).toLocaleString("default", {
        month: "long",
      });

      const tempsAllMonth = allCompiled
        .filter((item) => item[monthName])
        .map((item) => {
          if (!item[monthName]) {
            // if the month is not yet in the data (for actual year)
            return;
          } ///
          return {
            tempMinAllMonth: item[monthName].tempMinAllMonth,
            tempMaxAllMonth: item[monthName].tempMaxAllMonth,
            rainSum: item[monthName].rainSum,
          };
        })
        .reduce(
          (acc, cur) => {
            return {
              tempMinAllMonth: acc.tempMinAllMonth.concat(cur.tempMinAllMonth),
              tempMaxAllMonth: acc.tempMaxAllMonth.concat(cur.tempMaxAllMonth),
              rainSum: acc.rainSum.concat(cur.rainSum),
            };
          },
          { tempMinAllMonth: [], tempMaxAllMonth: [], rainSum: [] }
        );
      const { tempMinAllMonth, tempMaxAllMonth, rainSum } = tempsAllMonth;
      const tempMin = Math.min(...tempMinAllMonth);
      const tempMax = Math.max(...tempMaxAllMonth);
      const rainSumAdd = ((rainSum.reduce((a, b) => a + b, 0))/10).toFixed(1);

      const tempMoyMax = avg(tempMaxAllMonth);
      const tempMoyMin = avg(tempMinAllMonth);
      const tempMoy = ((tempMoyMax + tempMoyMin) / 2).toFixed(1);

      const obj = {
        tempMin: tempMin,
        tempMax: tempMax,
        rainSumAvg: rainSumAdd,
        tempMoy: tempMoy,
        monthName,
      };
      all.push(obj);
    }
    return all;
  };