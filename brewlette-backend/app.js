const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
require("dotenv").config();
const api = process.env.GOOGLE_API;
app.use(cors());
app.use(express.json());

app.get("/api/coordinates", async (req, res) => {
  const { address } = req.query;
  try {
    const apiUrl = "https://maps.googleapis.com/maps/api/geocode/json";
    const response = await axios.get(apiUrl, {
      params: {
        address: address,
        key: api,
      },
    });

    return res.json(response.data);
  } catch (e) {
    console.error(e);
  }
});

app.get("/api/google-maps", async (req, res) => {
  const { type, radius, location } = req.query;
  try {
    const apiUrl =
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
    const response = await axios.get(apiUrl, {
      params: {
        key: api,
        type: type,
        radius: radius,
        location: location,
      },
    });

    return res.json(response.data);
    // return res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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
