export function Search({
  neighborhood,
  filteredNeighborhoods,
  setNeighborhood,
  selectNeighborhood,
  searchNeighborhoods,
  getCoordinates,
}) {
  return (
    <div className="flex flex-col justify-center  items-center bg-cream w-1/2 h-1/2 m-6 p-6 rounded-lg">
      <h2 className="text-purple text-2xl font-luckiest">
        WHICH NYC NEIGHBORHOOD?
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
      <button
        className="bg-purple p-3 text-2xl text-white rounded-lg font-luckiest"
        onClick={getCoordinates}
      >
        FIND A CAFE!
      </button>
    </div>
  );
}
