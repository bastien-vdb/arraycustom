import "./App.css";
import { useState } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
// import { Tab, Tabs } from "react-bootstrap";
import Tabs from "../Tabs";
import { fetcher } from "./../libs/fetchs";
import { actualDay, actualMonth, actualYear } from "../libs/helper";
import { getMeteoDataForEachYearCalculated } from "../libs/getTenYears";
import { getMeteoDataForYearCalculated } from "../libs/getThisYear";
import { getDataByMonth } from "../libs/getTenYearsBis";

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

  const getPosition = () => {
    return fetch(`${api.base}q=${search}`)
      .then((res) => res.json())
      .then((result) => {
        setWeather(result);
        return result;
      });
  };

  const handleSearch = async () => {
    setMeteoData([]);
    const result = await getPosition();
    // Call the second API for weather data only when the first API call is successful
    //Only for the actual year
    const resultat = await fetcher(
      url,
      result,
      actualYear,
      actualMonth,
      actualDay
    );
    const meteoDataForYearCalculated = getMeteoDataForYearCalculated(resultat);
    setMeteoData(meteoDataForYearCalculated);

    //We split the data by year to avoid to much data in one call (max 365 days)
    let meteoDataForYearCalculatedCompiled = [];
    let getAllByMonthCompiled = [];
    for (let year = actualYear - 1; year > actualYear - 11; year--) {
      const resultat = await fetcher(url, result, year, 12, 31);

      setMeteo(resultat);

      // Data selected is for one year so we need to split it by month

      const meteoDataForYearCalculated = getMeteoDataForEachYearCalculated(
        resultat,
        year
      );
      meteoDataForYearCalculatedCompiled.push(meteoDataForYearCalculated);

      const getAllByMonth = getDataByMonth(resultat, year);
      getAllByMonthCompiled[year] = getAllByMonth;
    }
    console.log(getAllByMonthCompiled);
    setMeteoData((prevMeteoData) => [
      ...prevMeteoData,
      ...meteoDataForYearCalculatedCompiled,
    ]);
  };

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
            <div>Altitude: {meteo.elevation}</div>
          </div>
        ) : (
          ""
        )}

        <div style={{ margin: "20px 0" }}>
          <button onClick={handleSearch}>Lancer la recherche</button>
        </div>

        <div style={{ fontSize: "14px" }}>
          <Tabs meteoData={meteoData} />
        </div>
      </header>
    </div>
  );
}

export default App;
