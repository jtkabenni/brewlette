import axios from "axios";
const base_url = process.env.REACT_APP_BASE_URL;

class BrewletteApi {
  static async getCafes(neighborhood) {
    try {
      const res = await axios.get(`${base_url}/api/cafes`, {
        params: {
          address: `${neighborhood}, NY`,
        },
      });

      return res.data;
    } catch (error) {
      console.error("error :(", error);
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
