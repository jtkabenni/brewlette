import Cafe from "./components/Cafe";
import logo from "./logo.png";
import home from "./home.png";
import replay from "./replay.png";
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
  const [loaded, setLoaded] = useState(false);
  const [cafe, setCafe] = useState(null);

  //when coordinates change, get cafes
  useEffect(() => {
    async function fetch() {
      await getCafes();
    }
    fetch();
  }, [coords]);

  useEffect(() => {
    async function fetch() {
      if (count === 0) {
        await getCafeDetails();
      }
    }
    fetch();
  }, [cafes]);

  useEffect(() => {
    getCafeDetails();
  }, [count]);

  function searchNeighborhoods(e) {
    if (e.target.value === "") {
      setFilteredNeighborhoods([]);
      return;
    }
    const inputValue = e.target.value.toLowerCase();
    const filtered = neighborhoods.filter((n) =>
      n.toLowerCase().includes(inputValue)
    );
    setFilteredNeighborhoods(filtered);
  }

  function selectNeighborhood(e) {
    setNeighborhood(e.target.innerHTML);
    setFilteredNeighborhoods([]);
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
      console.error("error :(", error);
    }
  }

  function restart() {
    setCoords("");
    setCafe(null);
    setNeighborhood("");
  }

  async function getCafes() {
    if (coords) {
      try {
        const res = await axios.get(`${base_url}/api/google-maps`, {
          params: {
            nbh: neighborhood,
            type: "cafe",
            radius: 1000,
            location: coords,
          },
        });
        setCafes(res.data.results);
        return res.data.results;
      } catch (e) {
        console.error("error :(", e);
      }
    }
  }

  async function getCafeDetails() {
    try {
      const res = await axios.get(`${base_url}/api/cafe`, {
        params: {
          place_id: cafes[count].place_id,
        },
      });
      setCafe(res.data.result);
    } catch (e) {
      console.error("error :(", e);
    }
  }

  return (
    <div className="bg-peach h-screen flex flex-col justify-center items-center">
      <img src={logo} style={{ width: "200px" }} />
      {!cafe ? (
        <>
          <div className="flex flex-col justify-center  items-center bg-cream w-1/2 h-1/2 m-6 p-6 rounded-lg">
            <h2 className="text-purple text-2xl font-luckiest">
              WHICH NEIGHBORHOOD?
            </h2>
            {/* <div>
              <input type="checkbox" id="no-preference" name="no-preference" />
              <label htmlFor="no-preference">I have no preference</label>
            </div> */}
            <br></br>
            <input
              className="p-3 w-1/3"
              onChange={(e) => {
                setNeighborhood(e.target.value);
                searchNeighborhoods(e);
              }}
              type="text"
              placeholder="Type neighborhood name"
              value={neighborhood}
            ></input>
            {filteredNeighborhoods.slice(0, 3).map((n, i) => (
              <p
                className="text-lg text-purple font-luckiest bg-white p-3 w-1/3 rounded-lg "
                key={i}
                onClick={(e) => selectNeighborhood(e)}
              >
                {n}
              </p>
            ))}
          </div>

          <button
            className="bg-purple p-3 text-2xl text-white rounded-lg font-luckiest"
            onClick={getCoordinates}
          >
            FIND A CAFE!
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between w-1/2">
            <button
              className="bg-white p-3 rounded-lg font-luckiest"
              onClick={() => restart()}
            >
              <img src={home} />
            </button>
            <h2 className="text-purple text-2xl font-luckiest">Result</h2>
            <button
              className="bg-purple p-3 rounded-lg font-luckiest"
              onClick={() => setCount(count + 1)}
            >
              <img src={replay} />
            </button>
          </div>
          <Cafe cafe={cafe} />
        </>
      )}
    </div>
  );
}

export default App;
