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
}

export default BrewletteApi;
