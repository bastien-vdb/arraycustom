import "./App.css";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useEffect } from "react";
Chart.register(...registerables);

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

  const getDate = (year, month) => {
    const firstDay = new Date(year, month, 1)
      .getDate()
      .toString()
      .padStart(2, "0");
    const lastDay = new Date(year, month + 1, 0)
      .getDate()
      .toString()
      .padStart(2, "0");
    const monthNumber = (month + 1).toString().padStart(2, "0");
    return {
      firstDay: `${year}-${monthNumber}-${firstDay}`,
      lastDay: `${year}-${monthNumber}-${lastDay}`,
    };
  };

  const fullYear = [];
  const actualYear = new Date().getFullYear();
  const yearLessTen = actualYear - 10;

  for (let year = 2022; year >= yearLessTen; year--) {
    for (let i = 0; i < 12; i++) {
      fullYear.push(getDate(year, i));
    }
  }

  // console.log(fullYear);

  const handleSearch = () => {
    fetch(`${api.base}q=${search}`)
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setWeather(result);

        // Call the second API for weather data only when the first API call is successful
        const meteoDataForYearCalculated = [];
        for (let i = 0; i < fullYear.length; i++) {
          fetch(
            `${url.base}latitude=${result[0].lat}&longitude=${result[0].lon}&start_date=${fullYear[i].firstDay}&end_date=${fullYear[i].lastDay}&daily=temperature_2m_max,temperature_2m_min,rain_sum&timezone=auto`
          )
            .then((res1) => res1.json())
            .then((resultat) => {
              // console.log(resultat);
              setMeteo(resultat);

              const max = Math.max(...resultat.daily.temperature_2m_max);
              const min = Math.min(...resultat.daily.temperature_2m_min);

              //temperature_max_avg
              const temperature_max_avg = avg(
                resultat.daily.temperature_2m_max
              );
              const temperature_min_avg = avg(
                resultat.daily.temperature_2m_min
              );
              const tempAvg = avg([temperature_max_avg, temperature_min_avg]);
              const rainAvg = avg(resultat.daily.rain_sum);

              const dataOfOneMonth = {
                startDate: [fullYear[i].firstDay],
                endDate: [fullYear[i].lastDay],
                max,
                min,
                tempAvg,
                rainAvg,
              };

              meteoDataForYearCalculated[i] = dataOfOneMonth;
              setMeteoData(meteoDataForYearCalculated);
            });
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
