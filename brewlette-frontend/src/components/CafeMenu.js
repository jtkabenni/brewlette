import home from "../assets/home.png";
import replay from "../assets/replay.png";

export default function CafeMenu({ restart, setCafeIndex, cafeIndex }) {
  return (
    <div className="flex items-center justify-between w-4/5 lg:w-1/2">
      <button
        className="bg-white p-3 rounded-lg w-12 h-12 font-luckiest"
        onClick={restart}
      >
        <img src={home} />
      </button>
      <h2 className="text-purple text-2xl font-luckiest">Result</h2>
      <button
        className="bg-purple p-3 rounded-lg w-12 h-12 font-luckiest"
        onClick={() => setCafeIndex(cafeIndex === 19 ? 0 : cafeIndex + 1)}
      >
        <img src={replay} />
      </button>
    </div>
  );
}
