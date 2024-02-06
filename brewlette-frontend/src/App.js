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
  const [isLoading, setIsLoading] = useState(false);
  const [cafe, setCafe] = useState({});

  useEffect(() => {
    // This effect will run whenever coords changes
    if (coords) {
      getCafes(coords);
    }
  }, [coords]);

  useEffect(() => {
    getCafeDetails();
  }, [count]);

  function searchNeighborhoods(e) {
    const inputValue = e.target.value.toLowerCase();
    const filtered = neighborhoods.filter((n) =>
      n.toLowerCase().includes(inputValue)
    );
    if (e.target.value === "") {
      setFilteredNeighborhoods([]);
    } else {
      setFilteredNeighborhoods(filtered);
    }
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
      console.log("error :(", error);
    }
  }

  function restart() {
    setNeighborhood("");
    setFilteredNeighborhoods([]);
    setCafes([]);
  }

  async function getCafes(coordinates) {
    if (coordinates) {
      setIsLoading(true);
      try {
        const res = await axios.get(`${base_url}/api/google-maps`, {
          params: {
            nbh: neighborhood,
            type: "cafe",
            radius: 1000,
            location: coordinates,
          },
        });
        setIsLoading(false);
        setCafes(res.data.results);

        console.log(res.data.results);
      } catch (e) {
        console.log("error :(", e);
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

      console.log(res.data.result);
      setCafe(res.data.result);
    } catch (e) {}
  }

  return (
    <div className="bg-peach h-screen flex flex-col justify-center items-center">
      <img src={logo} style={{ width: "200px" }} />
      {!cafes.length ? (
        <>
          <div className="flex flex-col justify-center  items-center bg-cream w-1/2 h-1/2 m-6 p-6 rounded-lg">
            <h2 className="text-purple text-2xl font-luckiest">
              WHICH NEIGHBORHOOD?
            </h2>
            <div>
              <input type="checkbox" id="no-preference" name="no-preference" />
              <label for="no-preference">I have no preference</label>
            </div>
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
          <div className="flex flex-col justify-center  items-center bg-cream w-1/2 h-1/3 m-6 p-6 rounded-lg"></div>
          <div className="flex items-center justify-between w-1/2">
            <div>
              <p>{cafes[count].name}</p>
              <p>{cafes[count].vicinity}</p>
            </div>
            <button className="bg-purple font-white p-3 rounded-lg font-luckiest">
              <a href={cafe.url} target="_blank">
                Let's go!
              </a>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
