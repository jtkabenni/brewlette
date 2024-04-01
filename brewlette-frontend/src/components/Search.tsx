import React, { useRef, ChangeEvent, MouseEvent } from "react";
import { neighborhoods } from "../neighborhoods";

interface SearchProps {
  neighborhood: string;
  setNeighborhood: React.Dispatch<React.SetStateAction<string>>;

  search: (neighborhood: string) => void;
}

function Search({ neighborhood, setNeighborhood, search }: SearchProps) {
  const filteredNeighborhoodsRef = useRef<string[]>([]);

  function selectNeighborhood(e: MouseEvent<HTMLParagraphElement>): void {
    setNeighborhood(
      (e.currentTarget as HTMLParagraphElement).textContent || ""
    );
    filteredNeighborhoodsRef.current = [];
  }

  function searchNeighborhoods(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value === "") {
      filteredNeighborhoodsRef.current = [];
      return;
    }
    const inputValue = e.target.value.toLowerCase();
    const filtered = neighborhoods.filter((n) =>
      n.toLowerCase().includes(inputValue)
    );
    filteredNeighborhoodsRef.current = filtered;
  }
  return (
    <div className="flex flex-col justify-center  items-center bg-cream w-4/5 lg:w-1/2 h-1/2 m-6 p-6 rounded-3xl">
      <h2 className="text-purple text-2xl font-luckiest">
        WHICH NYC NEIGHBORHOOD?
      </h2>
      {/* <div>
              <input type="checkbox" id="no-preference" name="no-preference" />
              <label htmlFor="no-preference">I have no preference</label>
            </div> */}
      <div className="m-3 w-1/2">
        <input
          className="p-3  w-full"
          onChange={(e) => {
            setNeighborhood(e.target.value);
            searchNeighborhoods(e);
          }}
          type="text"
          placeholder="Type neighborhood name"
          value={neighborhood}
        ></input>
        {filteredNeighborhoodsRef.current.slice(0, 3).map((n, i) => (
          <p
            className="text-lg text-purple font-luckiest bg-white p-3 w-100 rounded-md "
            key={i}
            onClick={(e) => selectNeighborhood(e)}
          >
            {n}
          </p>
        ))}
      </div>
      <button
        className="bg-purple p-3 text-2xl text-white rounded-3xl font-luckiest"
        onClick={() => search(neighborhood)}
      >
        FIND A CAFE!
      </button>
    </div>
  );
}

export default Search;
