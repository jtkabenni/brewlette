const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
require("dotenv").config();
const api = process.env.GOOGLE_API;
app.use(cors());
app.use(express.json());

app.get("/api/cafes", async (req, res) => {
  const { address } = req.query;
  try {
    const getCoordsApiUrl = "https://maps.googleapis.com/maps/api/geocode/json";
    const responseNeighborhood = await axios.get(getCoordsApiUrl, {
      params: {
        address: address,
        key: api,
      },
    });
    const coords = `${responseNeighborhood.data.results[0].geometry.location.lat}, ${responseNeighborhood.data.results[0].geometry.location.lng}`;
    const getCafesApiUrl =
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    const responseCafes = await axios.get(getCafesApiUrl, {
      params: {
        key: api,
        type: "cafe",
        radius: 1000,
        location: coords,
      },
    });
    return res.json(responseCafes.data.results);
  } catch (e) {
    console.error(e);
  }
});

app.get("/api/cafe", async (req, res) => {
  try {
    const apiUrl = "https://maps.googleapis.com/maps/api/place/details/json";
    const response = await axios.get(apiUrl, {
      params: {
        key: api,
        place_id: req.query.place_id,
      },
    });

    return res.json(response.data);
    // return res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
