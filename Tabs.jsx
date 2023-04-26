import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import PropTypes from "prop-types";

Tabs.propTypes = {
  meteoData: PropTypes.array.isRequired,
};

function Tabs({ meteoData }) {

  if (meteoData?.length === 0) {
    return <div>...</div>;
  }

  return (
    <div>
      <Table style={{color:'skyblue'}} variant="dark" striped bordered hover responsive>
      <thead>
        <tr>
          <th>Month</th>
          {meteoData.map((year) => (
            <th key={year.year}>{year.year}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {meteoData[1]?.meteoDataForYearCalculated?.map((month) => (
          <tr key={month.monthName}>
            <td>{month.monthName}</td>
            {meteoData.map((year) => {
              const monthData = year.meteoDataForYearCalculated.find(
                (m) => m.monthName === month.monthName
              );
              return (
                <td style={{padding:'0px'}} key={`${year.year}-${month.monthName}`}>
                  <div style={{backgroundColor:'#696969', padding:'6px'}}>Max: {monthData?.max}</div>
                  <div style={{padding:'6px'}}>Min: {monthData?.min}</div>
                  <div style={{backgroundColor:'#696969', padding: '6px 0'}}>TempAvg: {monthData?.tempAvg}</div>
                  <div style={{padding:'6px'}}>RainAvg: {monthData?.rainAvg}</div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
    </div>
  );
}

export default Tabs;
