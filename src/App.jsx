import "./App.css";
import { useState } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);
import Tabs from "./Tabs";
import Tabs2 from "./Tabs2";
import { fetcher, getPosition } from "./../libs/fetchs";
import { actualDay, actualMonth, actualYear } from "../libs/helper";
import { getDataForTenYears } from "../libs/getDataForTenYears";
import { calculations } from "../libs/calculations";
import { url, api } from "../libs/constants";
import { getByMonthForEachYear } from "../libs/getByMonthForEachYear";

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [meteo, setMeteo] = useState({});

  // const [meteoData, setMeteoData] = useState([]);
  const [byMonthTenYears, setByMonthTenYears] = useState([]);
  const [byMonthForEachYear, setByMonthForEachYear] = useState([]);

  const handleSearch = async () => {
    //API CAll for getting position
    const result = await getPosition(api, search);
    setWeather(result);

    //********* First TAB (10 years) *********//
    const getAllByMonthCompiled = [];
    const getAllByMonthCompiled_2 = [];

    for (let year = actualYear - 10; year <= actualYear; year++) {
      let month = 12;
      let day = 31;
      if (year === actualYear) {
        month = actualMonth;
        day = actualDay;
      }
      const resultat = await fetcher(url, result, year, month, day);
      setMeteo(resultat);

      // Data selected is for one year so we need to split it by month
      const getAllByMonth = getDataForTenYears(resultat, year);
      getAllByMonthCompiled.push(getAllByMonth);

      //********* Second TAB (per year) *********//
      const getAllByMonth_2 = getByMonthForEachYear(resultat, year);
      getAllByMonthCompiled_2.push(getAllByMonth_2);
    }

    // Calculations for the first tab
    const parameters = calculations(getAllByMonthCompiled);

    setByMonthTenYears(parameters); // First tab
    setByMonthForEachYear(getAllByMonthCompiled_2); // Second tab
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* HEADER */}
        <h1>Weather App 2</h1>
      </header>

      {/* Search Box */}
      <div>
        <input type="text" placeholder="Entrez une ville" onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* If weather is not undefined */}
      {typeof weather[0] !== "undefined" ? (
        <div>
          {/* Location */}
          <p>Latitude : {weather[0].lat}</p>
          <p>Longitude : {weather[0].lon}</p>
          {/* Altitude */}
          <p>Altitude: {meteo.elevation}</p>
        </div>
      ) : (
        ""
      )}

      <div
        style={{
          fontSize: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <button onClick={handleSearch}>Lancer la recherche</button>
        <Tabs byMonthTenYears={byMonthTenYears} />
        <Tabs2 byMonthForEachYear={byMonthForEachYear} />
      </div>
    </div>
  );
}

export default App;
