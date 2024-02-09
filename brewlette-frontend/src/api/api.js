import axios from "axios";
const base_url = process.env.REACT_APP_BASE_URL;

async function getCoordinates(neighborhood) {
  try {
    const res = await axios.get(`${base_url}/api/coordinates`, {
      params: {
        address: `${neighborhood}, NY`,
      },
    });
    if (res.data.results.length > 0) {
      const location = res.data.results[0].geometry.location;
      console.log(`${location.lat},${location.lng}`);
      return `${location.lat},${location.lng}`;
    } else {
      return null;
    }
  } catch (error) {
    console.error("error :(", error);
  }
}

async function getCafes({ neighborhood, coords }) {
  console.log(neighborhood, coords);
  try {
    const res = await axios.get(`${base_url}/api/google-maps`, {
      params: {
        nbh: neighborhood,
        type: "cafe",
        radius: 1000,
        location: coords,
      },
    });
    console.log("res", res.data.results);
    return res.data.results;
  } catch (e) {
    console.error("error :(", e);
  }
}

async function getCafeDetails(placeid) {
  try {
    const res = await axios.get(`${base_url}/api/cafe`, {
      params: {
        place_id: placeid,
      },
    });
    return res.data.result;
  } catch (e) {
    console.error("error :(", e);
  }
}

export { getCoordinates, getCafes, getCafeDetails };
