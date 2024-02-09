import Cafe from "./components/Cafe";
import Logo from "./components/Logo";
import CafeMenu from "./components/CafeMenu";
import { Search } from "./components/Search";
import "./App.css";
import { neighborhoods } from "./neighborhoods";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
const base_url = "http://localhost:3001";

function App() {
  const [neighborhood, setNeighborhood] = useState("");
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState([]);
  const [count, setCount] = useState(0);
  const [coords, setCoords] = useState("");
  const [cafes, setCafes] = useState([]);
  const [cafe, setCafe] = useState(null);

  //when coordinates change, fetch cafes, and get details for first cafe
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cs = await getCafes();
        setCafes(cs);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    console.log("coords changed");
    fetchData();
  }, [coords]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const c = await getCafeDetails();
        setCafe(c);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    console.log("coords changed");
    fetchData();
  }, [cafes]);

  // every time count changes, fetch cafe details
  useEffect(() => {
    const fetchData = async () => {
      console.log("getting cafe deets....");

      const c = await getCafeDetails();
      setCafe(c);
    };
    fetchData();
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
    try {
      const res = await axios.get(`${base_url}/api/google-maps`, {
        params: {
          nbh: neighborhood,
          type: "cafe",
          radius: 1000,
          location: coords,
        },
      });

      return res.data.results;
    } catch (e) {
      console.error("error :(", e);
    }
  }

  async function getCafeDetails() {
    try {
      console.log("cafe deets:", count, cafes, cafes[count]);
      const res = await axios.get(`${base_url}/api/cafe`, {
        params: {
          place_id: cafes[count].place_id,
        },
      });
      return res.data.result;
    } catch (e) {
      console.error("error :(", e);
    }
  }

  return (
    <div className="bg-peach h-screen flex flex-col justify-center items-center">
      <Logo />
      {!cafe ? (
        <>
          <Search
            neighborhood={neighborhood}
            filteredNeighborhoods={filteredNeighborhoods}
            setNeighborhood={setNeighborhood}
            selectNeighborhood={selectNeighborhood}
            searchNeighborhoods={searchNeighborhoods}
            getCoordinates={getCoordinates}
          />
        </>
      ) : (
        <>
          <CafeMenu restart={restart} setCount={setCount} count={count} />
          <Cafe cafe={cafe} />
        </>
      )}
    </div>
  );
}

export default App;
