import axios from "axios";
const base_url = process.env.REACT_APP_BASE_URL;

class BrewletteApi {
  static async getCoordinates(neighborhood) {
    try {
      const res = await axios.get(`${base_url}/api/coordinates`, {
        params: {
          address: `${neighborhood}, NY`,
        },
      });
      if (res.data.results.length > 0) {
        const location = res.data.results[0].geometry.location;
        return `${location.lat},${location.lng}`;
      } else {
        return null;
      }
    } catch (error) {
      console.error("error :(", error);
    }
  }

  static async getCafes(coords) {
    try {
      const res = await axios.get(`${base_url}/api/google-maps`, {
        params: {
          type: "cafe",
          radius: 1000,
          location: coords,
        },
      });
      return res.data.results;
    } catch (e) {
      console.error("error :(", e);
    }
  }

  static async getCafeDetails(placeid) {
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
}

export default BrewletteApi;
