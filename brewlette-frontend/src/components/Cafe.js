import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
export default function Cafe({ cafe }) {
  const libraries = ["places"];
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = {
    lat: cafe.geometry.location.lat || 7.2905715, // default latitude
    lng: cafe.geometry.location.lng || 80.6337262, // default longitude
  };
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API,
    libraries,
  });
  return (
    <>
      <div className="flex flex-col justify-center items-center bg-cream w-4/5 lg:w-1/2 h-1/2 m-6 p-3 rounded-lg">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={20}
            center={center}
          >
            <Marker position={center} />
          </GoogleMap>
        ) : (
          <div>Loading map...</div>
        )}
      </div>
      <div className="flex items-center justify-between w-4/5 lg:w-1/2">
        <div>
          <p>{cafe.name}</p>
          <p>{cafe.vicinity}</p>
        </div>
        <button className="bg-purple font-white p-3 rounded-lg font-luckiest">
          <a href={cafe.url} target="_blank">
            Let's go!
          </a>
        </button>
      </div>
    </>
  );
}
