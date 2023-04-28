import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import { useEffect } from "react";

function Tabs({ byMonthTenYears }) {
  if (byMonthTenYears?.length === 0) {
    return <div>...</div>;
  }

  const columns = ["tempMin", "tempMax", "rainSumAvg", "tempMoy"];

  return (
    <div>
      <Table
        style={{ color: "skyblue" }}
        variant="dark"
        striped
        bordered
        hover
        responsive
      >
        <thead>
          <tr>
            <th>Sur 10 ans</th>
            {byMonthTenYears.map((month) => (
              <th key={month.monthName}>{month.monthName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {columns.map((column) => (
            <tr key={column}>
              <td>{column}</td>
              {byMonthTenYears.map((month) => (
                <td key={month.monthName}>{month[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Tabs;
