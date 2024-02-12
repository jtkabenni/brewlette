import Cafe from "./components/Cafe";
import Logo from "./components/Logo";
import CafeMenu from "./components/CafeMenu";
import Search from "./components/Search";
import BrewletteApi from "./api/api";
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import shuffle from "./helpers/helpers";

function App() {
  const [neighborhood, setNeighborhood] = useState("");
  const [cafeIndex, setCafeIndex] = useState(0);
  const [coords, setCoords] = useState("");
  const [cafes, setCafes] = useState([]);
  const [cafe, setCafe] = useState(null);

  //when coordinates change, fetch cafes, and get details for first cafe
  useEffect(() => {
    if (coords != "") {
      const fetchData = async () => {
        try {
          const cs = await BrewletteApi.getCafes(coords);
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
          const c = await BrewletteApi.getCafeDetails(
            cafes[cafeIndex].place_id
          );
          setCafe(c);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [cafes]);

  // every time cafeIndex changes, fetch cafe details for cafe of current cafeIndex
  useEffect(() => {
    if (cafeIndex > 0) {
      const fetchData = async () => {
        try {
          const c = await BrewletteApi.getCafeDetails(
            cafes[cafeIndex].place_id
          );
          setCafe(c);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [cafeIndex]);

  async function search(neighborhood) {
    const coords = await BrewletteApi.getCoordinates(neighborhood);
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
          <CafeMenu
            restart={restart}
            setCafeIndex={setCafeIndex}
            cafeIndex={cafeIndex}
          />
          <Cafe cafe={cafe} />
        </>
      )}
    </div>
  );
}

export default App;
