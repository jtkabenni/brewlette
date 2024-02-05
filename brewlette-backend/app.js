const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
require("dotenv").config();
const api = process.env.GOOGLE_API;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, this is your Node.js server!");
});

app.get("/api/coordinates", async (req, res) => {
  console.log("reached this route", req.query);
  const { address } = req.query;
  try {
    const apiUrl = "https://maps.googleapis.com/maps/api/geocode/json";
    const response = await axios.get(apiUrl, {
      params: {
        address: address,
        key: api,
      },
    });
    console.log(response.data);
    return res.json(response.data);
  } catch (e) {
    console.error(e);
  }
});

app.get("/api/google-maps", async (req, res) => {
  console.log("reached this route", req.query);
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
    console.log(response.data);
    return res.json(response.data);
    // return res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
