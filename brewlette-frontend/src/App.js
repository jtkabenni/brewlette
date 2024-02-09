import Cafe from "./components/Cafe";
import Logo from "./components/Logo";
import CafeMenu from "./components/CafeMenu";
import Search from "./components/Search";
import { getCoordinates, getCafes, getCafeDetails } from "./api/api";
import "./App.css";
import { neighborhoods } from "./neighborhoods";
import React, { useState, useEffect, useRef } from "react";

function App() {
  const [neighborhood, setNeighborhood] = useState("");
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState([]);
  const [count, setCount] = useState(0);
  const [coords, setCoords] = useState("");
  const [cafes, setCafes] = useState([]);
  const [cafe, setCafe] = useState(null);

  //when coordinates change, fetch cafes, and get details for first cafe
  useEffect(() => {
    if (coords != "") {
      const fetchData = async () => {
        try {
          const cs = await getCafes({ neighborhood, coords });
          console.log("cafes:", cs);
          setCafes(cs);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      console.log("coordinates changed");
      fetchData();
      return;
    }
  }, [coords]);

  //every time cafes change, fetch the details for first cafe on the list
  useEffect(() => {
    if (cafes.length > 0) {
      const fetchData = async () => {
        try {
          const c = await getCafeDetails(cafes[count].place_id);
          setCafe(c);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      // Check if it's not the initial load
      console.log(count);
      fetchData();
      return;
    }
  }, [cafes]);

  // every time count changes, fetch cafe details for cafe of current count
  useEffect(() => {
    if (count > 0) {
      const fetchData = async () => {
        console.log("getting cafe deets....");
        const c = await getCafeDetails(cafes[count].place_id);
        setCafe(c);
      };
      console.log(count);
      fetchData();
    }
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

  async function search(neighborhood) {
    const coords = await getCoordinates(neighborhood);
    setCoords(coords);
  }

  function restart() {
    setCoords("");
    setCafe(null);
    setNeighborhood("");
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
            search={search}
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
