import home from "../home.png";
import replay from "../replay.png";

export default function CafeMenu({ restart, setCount, count }) {
  return (
    <div className="flex items-center justify-between w-1/2">
      <button
        className="bg-white p-3 rounded-lg font-luckiest"
        onClick={() => restart()}
      >
        <img src={home} />
      </button>
      <h2 className="text-purple text-2xl font-luckiest">Result</h2>
      <button
        className="bg-purple p-3 rounded-lg font-luckiest"
        onClick={() => setCount(count + 1)}
      >
        <img src={replay} />
      </button>
    </div>
  );
}
