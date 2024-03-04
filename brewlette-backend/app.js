const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
require("dotenv").config();
const api = process.env.GOOGLE_API;
app.use(cors());
app.use(express.json());

async function getCoordinates(address) {
  const responseNeighborhood = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    {
      params: {
        address: address,
        key: api,
      },
    }
  );
  return `${responseNeighborhood.data.results[0].geometry.location.lat}, ${responseNeighborhood.data.results[0].geometry.location.lng}`;
}

async function getCafes(coordinates) {
  const getCafesApiUrl =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
  const responseCafes = await axios.get(getCafesApiUrl, {
    params: {
      key: api,
      type: "cafe",
      radius: 1000,
      location: coordinates,
    },
  });
  return responseCafes;
}

async function getAllCafeDetails(cafes) {
  const cafeDetailsApiUrl =
    "https://maps.googleapis.com/maps/api/place/details/json";
  const cafesDetails = [];
  for (let r of cafes.data.results) {
    const cafeResponse = await axios.get(cafeDetailsApiUrl, {
      params: {
        key: api,
        place_id: r.place_id,
      },
    });
    cafesDetails.push(cafeResponse.data.result);
  }
  return cafesDetails;
}

app.get("/api/cafes", async (req, res) => {
  try {
    const { address } = req.query;

    const location = await getCoordinates(address);

    const cafes = await getCafes(location);

    const allCafeDetails = await getAllCafeDetails(cafes);

    return res.json(allCafeDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
