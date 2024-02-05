import logo from "./logo.svg";
import "./App.css";
import { neighborhoods } from "./neighborhoods";
import React, { useState, useEffect } from "react";
import axios from "axios";
const base_url = "http://localhost:3001";

function App() {
  const [neighborhood, setNeighborhood] = useState("");
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
      const res = await axios.get(`${base_url}/api/coordinates`, {
        params: {
          address: `${neighborhood}, NY`,
        },
      });
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
        console.log(res.data.results);
      } catch (e) {
        console.log("error :(", e);
      }
    }
  }

  function restart() {
    setNeighborhood("");
    setFilteredNeighborhoods([]);
    setCafes([]);
  }

  return (
    <div className="App bg-peach h-full">
      <h1 className="text-purple">BREWLETTE</h1>
      {!cafes.length ? (
        <>
          <h2 className="text-purple">WHICH NEIGHBORHOOD?</h2>
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

          <button className="bg-purple" onClick={getCoordinates}>
            FIND A CAFE!
          </button>
        </>
      ) : (
        <>
          <div>{cafes[count].name}</div>
          <button onClick={() => setCount(count + 1)}>Next</button>
          <button onClick={() => restart()}>Back</button>
        </>
      )}
    </div>
  );
}

export default App;
