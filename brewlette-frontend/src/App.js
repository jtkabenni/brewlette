import logo from "./logo.svg";
import "./App.css";
import { neighborhoods } from "./neighborhoods";
import React, { useState, useEffect } from "react";
import axios from "axios";

const api = process.env.REACT_APP_GOOGLE_API;
const base_url = "http://localhost:3001";

function App() {
  const [neighborhood, setNeighborhood] = useState(neighborhoods[0]);
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState([]);
  const [count, setCount] = useState(0);
  const [coords, setCoords] = useState("");
  const [cafes, setCafes] = useState([]);

  useEffect(() => {
    // This effect will run whenever coords changes
    if (coords) {
      getCafes(coords);
    }
  }, [coords]);

  function searchNeighborhoods(e) {
    setFilteredNeighborhoods([]);
    const inputValue = e.target.value.toLowerCase();
    const filtered = neighborhoods.filter((n) =>
      n.toLowerCase().includes(inputValue)
    );
    setFilteredNeighborhoods(filtered);
  }

  function selectNeighborhood(e) {
    setNeighborhood(e.target.innerHTML);
  }

  async function getCoordinates() {
    try {
      const res = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: `${neighborhood}, NY`,
            key: api,
          },
        }
      );
      console.log(res);
      if (res.data.results.length > 0) {
        const location = res.data.results[0].geometry.location;
        setCoords(`${location.lat},${location.lng}`);
      } else {
        return null;
      }
    } catch (error) {
      console.log("error :(", error);
    }
  }

  async function getCafes(coordinates) {
    if (coordinates) {
      try {
        const res = await axios.get(`${base_url}/api/google-maps`, {
          params: {
            nbh: neighborhood,
            type: "cafe",
            radius: 1000,
            location: coordinates,
          },
        });
        setCafes(res.data.results);
        cafes.map((c) => {
          console.log(c.name);
        });
        console.log(res.data.results);
      } catch (e) {
        console.log("error :(", e);
      }
    }
  }

  return (
    <div className="App">
      <h1>Hello!</h1>
      <h1>Selected:{neighborhood}</h1>
      <input
        onChange={(e) => {
          setNeighborhood(e.target.value);
          searchNeighborhoods(e);
        }}
        type="text"
        placeholder="Type neighborhood name"
        value={neighborhood}
      ></input>
      {filteredNeighborhoods.map((n, i) => (
        <li key={i} onClick={(e) => selectNeighborhood(e)}>
          {n}
        </li>
      ))}
      {/* <select>
        {neighborhoods.map((n, i) => (
          <option key={i} value={n}>
            {n}
          </option>
        ))}
      </select> */}
      <button onClick={getCoordinates}>FIND A CAFE!</button>
      {cafes.length ? <div>{cafes[count].name}</div> : ""}
      <button onClick={() => setCount(count + 1)}>Next</button>
      <button onClick={() => setCafes([])}>Back</button>
    </div>
  );
}

export default App;
