import React, { useRef } from "react";
import { neighborhoods } from "../neighborhoods";
function Search({ neighborhood, setNeighborhood, selectNeighborhood, search }) {
  const filteredNeighborhoodsRef = useRef([]);

  function selectNeighborhood(e) {
    setNeighborhood(e.target.innerHTML);
    filteredNeighborhoodsRef.current = [];
  }

  function searchNeighborhoods(e) {
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
    <div className="flex flex-col justify-center  items-center bg-cream w-4/5 lg:w-1/2 h-1/2 m-6 p-6 rounded-lg">
      <h2 className="text-purple text-2xl font-luckiest">
        WHICH NYC NEIGHBORHOOD?
      </h2>
      {/* <div>
              <input type="checkbox" id="no-preference" name="no-preference" />
              <label htmlFor="no-preference">I have no preference</label>
            </div> */}
      <div className="m-3">
        <input
          className="p-3  w-100"
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
            className="text-lg text-purple font-luckiest bg-white p-3 w-100 rounded-lg "
            key={i}
            onClick={(e) => selectNeighborhood(e)}
          >
            {n}
          </p>
        ))}
      </div>
      <button
        className="bg-purple p-3 text-2xl text-white rounded-lg font-luckiest"
        onClick={() => search(neighborhood)}
      >
        FIND A CAFE!
      </button>
    </div>
  );
}

export default Search;
