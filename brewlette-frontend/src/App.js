import Cafe from "./components/Cafe";
import Logo from "./components/Logo";
import CafeMenu from "./components/CafeMenu";
import Search from "./components/Search";
import BrewletteApi from "./api/api";
import React, { useState, useEffect, useRef } from "react";
import shuffle from "./helpers/helpers";

function App() {
  console.log("rendering....");
  const [neighborhood, setNeighborhood] = useState("");
  const [cafeIndex, setCafeIndex] = useState(0);
  const [cafes, setCafes] = useState([]);
  const [cafe, setCafe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //every time cafes change, fetch the details for first cafe in the cafes list
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
      setIsLoading(false);
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

  // get cafes from API based on user input
  async function search(neighborhood) {
    setIsLoading(true);
    const cafes = await BrewletteApi.getCafes(neighborhood);
    setCafes(shuffle(cafes));
  }

  function restart() {
    setCafeIndex(0);
    setCafe(null);
    setNeighborhood("");
  }

  return (
    <div className="bg-peach h-screen flex flex-col justify-center items-center">
      <Logo />

      {isLoading ? (
        <div>Fetching cafes...</div>
      ) : (
        <>
          {!cafe ? (
            <Search
              neighborhood={neighborhood}
              setNeighborhood={setNeighborhood}
              search={search}
            />
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
        </>
      )}
    </div>
  );
}

export default App;
