const express = require("express");
const router = express.Router();

const { citydata } = require("./db");

router.get("/searchcity/:city", async (req, res) => {
  const status = await citydata.exists({ CityName: req.params.city });
  if (status) {
    res.cookie("city", req.params.city, {
      httpOnly: false,
    });
    return res.json({ status: "City found" });
  }
  return res.json({ status: "No Listings in this city" });
});

router.get("/citiesdata/", function (req, res) {
  citydata.find(
    { CityName: req.cookies.city, Status: false },
    function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      if (result.length == 0) {
        console.log("Empty DataBase");
        return res.json(result);
      }
      typeof result;
      res.json(result);
      res.end();
    }
  );
});

router.post("/filters", function (req, res) {
  const filters = req.body;
  let query = {};
  for (const key in filters) {
    if (filters[key] != "default" && filters[key] != 0) {
      if (key === "minPrice") {
        query.RentPrice = {};
        query.RentPrice.$gt = filters[key];
      }
      if (key === "maxPrice") {
        if (!query.RentPrice) {
          query.RentPrice = {};
        }
        query.RentPrice.$lt = filters[key];
      }
      if (key === "numberOfBedrooms") {
        query.NumberOfBedrooms = {};
        query.NumberOfBedrooms.$gt = filters[key];
      }
      if (key === "numberOfBathrooms") {
        query.NumberOfBathrooms = {};
        query.NumberOfBathrooms.$gt = filters[key];
      }
      if (key === "spaceType") {
        query.HomeType = filters[key];
      }
    }
  }
  query.CityName = req.cookies.city;

  citydata.find(query, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).json(data);
  });
});

module.exports = router;
