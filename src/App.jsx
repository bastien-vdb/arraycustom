import "./App.css";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useEffect } from "react";
Chart.register(...registerables);
import { Tab, Tabs } from "react-bootstrap";

const api = {
  base: "https://geocode.maps.co/search?",
};

const url = {
  base: "https://archive-api.open-meteo.com/v1/archive?",
};

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [meteo, setMeteo] = useState({});

  const [meteoData, setMeteoData] = useState([]);

  //Avg calculation
  const avg = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

  //getNumber of days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month+1, 0).getDate();
  };

  const actualDay = new Date().getDate();

  const getMonth = new Date().getMonth()+1;
  const actualMonth = getMonth.toString().padStart(2, "0");

  const actualYear = new Date().getFullYear();

  const handleSearch = () => {
    fetch(`${api.base}q=${search}`)
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setWeather(result);

        // Call the second API for weather data only when the first API call is successful

        //Only for the actual year
        const meteoDataForYearCalculated = [];
        fetch(
          `${url.base}latitude=${result[0].lat}&longitude=${result[0].lon}&start_date=${actualYear}-01-01&end_date=${actualYear}-${actualMonth}-${actualDay}&daily=temperature_2m_max,temperature_2m_min,rain_sum&timezone=auto`
        )
          .then((res1) => res1.json())
          .then((resultat) => {
            setMeteo(resultat);
            
            // Data selected is for the actual year
            let cummul = 0
            for (let i = 0; i < getMonth; i++) {
              const monthName = new Date(actualYear, i).toLocaleString("default", { month: "long" });
              let nbDayPerMonth = getDaysInMonth(actualYear, i);
              if(actualMonth === getMonth-1) {
                nbDayPerMonth = actualDay;
              }

              const tempMaxAllMonth = resultat.daily.temperature_2m_max.slice(cummul, cummul+nbDayPerMonth);
              const tempMinAllMonth = resultat.daily.temperature_2m_min.filter(value=> value!== null).slice(cummul, cummul+nbDayPerMonth);
              const rainSum = resultat.daily.rain_sum.slice(cummul, cummul+nbDayPerMonth);
              cummul += nbDayPerMonth;
              const max = Math.max(...tempMaxAllMonth);
              const min = Math.min(...tempMinAllMonth);

              const temperatureMaxAvg = avg(tempMaxAllMonth);
              const temperatureMinAvg = avg(tempMinAllMonth);
              const tempAvg = avg([temperatureMaxAvg, temperatureMinAvg]);
              const rainAvg = avg(rainSum);

              const dataOfOneMonth = {
                monthName,
                max,
                min,
                tempAvg,
                rainAvg,
              };

              meteoDataForYearCalculated.push(dataOfOneMonth);
            }
            setMeteoData((prev) => [...prev, {year: actualYear, meteoDataForYearCalculated}].sort((a, b) => b.year - a.year));
            });

              


        //We split the data by year to avoid to much data in one call (max 365 days)

        for (let year = actualYear-1; year > actualYear-11; year--) {
        const meteoDataForYearCalculated = [];
        fetch(
          `${url.base}latitude=${result[0].lat}&longitude=${result[0].lon}&start_date=${year}-01-01&end_date=${year}-12-31&daily=temperature_2m_max,temperature_2m_min,rain_sum&timezone=auto`
        )
          .then((res1) => res1.json())
          .then((resultat) => {
            // console.log(resultat);
            setMeteo(resultat);

            // Data selected is for one year so we need to split it by month
            let cummul = 0
            for (let i = 0; i < 12; i++) {
              const monthName = new Date(year, i).toLocaleString("default", { month: "long" });
              const nbDayPerMonth = getDaysInMonth(year, i);

              const tempMaxAllMonth = resultat.daily.temperature_2m_max.slice(cummul, cummul+nbDayPerMonth);
              const tempMinAllMonth = resultat.daily.temperature_2m_min.slice(cummul, cummul+nbDayPerMonth);
              const rainSum = resultat.daily.rain_sum.slice(cummul, cummul+nbDayPerMonth);
              cummul += nbDayPerMonth;
              const max = Math.max(...tempMaxAllMonth);
              const min = Math.min(...tempMinAllMonth);

              const temperatureMaxAvg = avg(tempMaxAllMonth);
              const temperatureMinAvg = avg(tempMinAllMonth);
              const tempAvg = avg([temperatureMaxAvg, temperatureMinAvg]);
              const rainAvg = avg(rainSum);

              const dataOfOneMonth = {
                monthName,
                max,
                min,
                tempAvg,
                rainAvg,
              };

              meteoDataForYearCalculated.push(dataOfOneMonth);
              
            }
          });

          setMeteoData((prev) => [...prev, {year: year, meteoDataForYearCalculated}]);
        }
      });
  };

  const [data, setData] = useState(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    if (meteo?.daily) {
      console.log("meteoData", meteoData);
      setData({
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Maximum Temperature",
            data: meteo.daily.temperature_2m_max,
            fill: false,
            borderColor: "red",
            tension: 0.1,
          },
          {
            label: "Minimum Temperature",
            data: meteo.daily.temperature_2m_min,
            fill: false,
            borderColor: "blue",
            tension: 0.1,
          },
          {
            label: "Average Temperature",
            data: [17, 18, 20, 23, 27, 30, 32, 31, 29, 24, 20, 17],
            fill: false,
            borderColor: "green",
            tension: 0.1,
          },
        ],
      });

      setOptions({
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      });
    }
  }, [meteo]);

  return (
    <div className="App">
      <header className="App-header">
        {/* HEADER */}
        <h1>Weather App 2</h1>

        {/* Search Box */}
        <div>
          <input
            type="text"
            placeholder="Entrez une ville"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* If weather is not undefined */}
        {typeof weather[0] !== "undefined" ? (
          <div>
            {/* Location */}
            <p>Latitude : {weather[0].lat}</p>

            {/* Temperature */}
            <p>Longitude : {weather[0].lon}</p>
          </div>
        ) : (
          ""
        )}

        <div>
          <button onClick={handleSearch}>Lancer la recherche</button>
        </div>
        <div>
          <p>Altitude: {meteo.elevation}</p>
        </div>
        {meteoData.map((month, key) => (
          <div key={key}>
            <p>
              Start Date : {month.startDate}. - End date: {month.endDate}
            </p>
            <p>Max : {month.max}</p>
            <p>Min : {month.min}</p>
            <p>Moy: {month.tempAvg}</p>
            <p>Rain sum avg : {month.rainAvg}</p>
          </div>
        ))}
        <div style={{ width: "1000px", height: "500px", margin: "0 auto" }}>
          {data && options ? <Line data={data} options={options} /> : ""}
        </div>
      </header>
    </div>
  );
}

export default App;