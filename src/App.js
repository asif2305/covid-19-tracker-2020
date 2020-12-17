import './App.css';
import React, { useEffect, useState } from 'react'
import Infobox from './InfoBox'
import { Card, CardContent, Typography } from "@material-ui/core"
import Maps from './Maps'
import Table from './Table'
import { sortData, prettyPrintStat } from './util'
import LineGraph from './LineGraph'
import {
  MenuItem, FormControl, Select
} from "@material-ui/core"
import 'leaflet/dist/leaflet.css';

function App() {

  // state:how to write variable in REACT
  // https://disease.sh/v3/covid-19/countries
  // USEEFFECT = Runs a piece of code based on a given condition
  const [countries, setCountries] = useState([]) // hook
  const [country, setCountry] = useState('worldwide') // hook
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  // fetch everything
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data)
      });

  }, []);
  // dropdown data
  useEffect(() => {
    // The code inside here will run once
    // when the component loads and not again
    // async-> send a request,wait for it,do something with it
    const getContriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United States
            value: country.countryInfo.iso2 // UK,USA
          }));
          const sortedData = sortData(data); // sorting the data
          setTableData(sortedData);
          setMapCountries(data)
          setCountries(countries);
        });

    };
    getContriesData();
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode)
    //console.log('oncncnc', mapCountries)
    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode)
        // all of the data from the country response
        setCountryInfo(data)
        // set data for map
        if (countryCode === "worldwide") {
          setMapCenter([34.80746, -40.4796]);
        }
        else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        }

        setMapZoom(4);
      })

  }
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          {/*Header */}
          {/*Title + select input dropdown field */}
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select onChange={onCountryChange} variant="outlined" value={country}>
              {/*loop through all the countries*/}
              <MenuItem value={"worldwide"}>Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>

          </FormControl>

        </div>
        {/*Infobox title=Corona virus cases */}
        {/*Infobox */}
        {/*Infobox */}
        <div className="app__stats">
          <Infobox isRed active={casesType === "cases"} onClick={(e) => setCasesType("cases")} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)} ></Infobox>
          <Infobox active={casesType === "recovered"} onClick={(e) => setCasesType("recovered")} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}></Infobox>
          <Infobox isRed active={casesType === "deaths"} onClick={(e) => setCasesType("deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}></Infobox>

        </div>

        {/* Map  */}
        <Maps casesType={casesType} countryCircle={mapCountries} center={mapCenter} zoom={mapZoom} ></Maps>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          {/*Table */}
          <Table countries={tableData}></Table>
          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          {/*Graph */}
          <LineGraph className="app__graph" casesType={casesType}></LineGraph>
        </CardContent>

      </Card>


    </div>
  );
}

export default App;
