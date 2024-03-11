import Cafe from "./components/Cafe";
import Logo from "./components/Logo";
import CafeMenu from "./components/CafeMenu";
import Search from "./components/Search";
import BrewletteApi from "./api/api";
import React, { useState, useEffect, useRef } from "react";
import shuffle from "./helpers/helpers";

interface Cafe {
  location: {
    lat: number;
    lng: number;
  };
  name: string;
  vicinity: string;
  url: string;
}

function App() {
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [cafeIndex, setCafeIndex] = useState<number>(0);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // get cafes from API based on user input
  async function search(neighborhood: string) {
    setIsLoading(true);
    const cafes = await BrewletteApi.getCafes(neighborhood);
    setCafes(shuffle(cafes));
    setIsLoading(false);
  }

  function restart() {
    setCafeIndex(0);
    setCafes([]);
    setNeighborhood("");
  }

  return (
    <div className="bg-peach h-screen flex flex-col justify-center items-center">
      <Logo />
      {isLoading ? (
        <div>Fetching cafes...</div>
      ) : (
        <>
          {!cafes.length ? (
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
              <Cafe cafe={cafes[cafeIndex]} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
