import Cafe from "./components/Cafe";
import Logo from "./components/Logo";
import CafeMenu from "./components/CafeMenu";
import Search from "./components/Search";
import { getCoordinates, getCafes, getCafeDetails } from "./api/api";
import "./App.css";
import { neighborhoods } from "./neighborhoods";
import React, { useState, useEffect, useRef } from "react";
import shuffle from "./helpers/helpers";

function App() {
  const [neighborhood, setNeighborhood] = useState("");
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
          const shuffled = shuffle(cs);
          setCafes(shuffled);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
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
      fetchData();
    }
  }, [cafes]);

  // every time count changes, fetch cafe details for cafe of current count
  useEffect(() => {
    if (count > 0) {
      const fetchData = async () => {
        try {
          const c = await getCafeDetails(cafes[count].place_id);
          setCafe(c);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [count]);

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
            setNeighborhood={setNeighborhood}
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