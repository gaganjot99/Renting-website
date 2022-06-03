const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const { citydata } = require("./db");

router.post("/addinfovalidate", function (req, res) {
  const data = req.userData;
  //console.log(data);
  var formdata = new formidable.IncomingForm();
  formdata.uploadDir = path.join(__dirname + `/../UserData/temp`);
  var imgarr = [];
  let cityvalmap = new Map();
  let filearr = [];
  formdata
    .on("field", function (field, value) {
      cityvalmap.set(field, value);
    })
    .on("file", function (file, value) {
      filearr.push(value);
    })
    .on("end", function () {
      console.log("end run");
      if (
        !cityvalmap.get("rentaltype") ||
        !cityvalmap.get("numberofbeds") ||
        !cityvalmap.get("numberofbathrooms") ||
        !cityvalmap.get("area") ||
        !cityvalmap.get("info") ||
        !cityvalmap.get("price") ||
        !cityvalmap.get("CityName") ||
        !cityvalmap.get("landmark") ||
        !cityvalmap.get("streetname") ||
        !cityvalmap.get("houseno") ||
        !cityvalmap.get("pincode") ||
        !cityvalmap.get("latitude") ||
        !cityvalmap.get("longitude")
      ) {
        res.status(400).json({ status: "All fields were not present" });
        return;
      }
      //console.log(__dirname);
      let npath = path.join(__dirname + `/../UserData/${data.email}`);
      for (let i of filearr) {
        let name = crypto.randomBytes(15).toString("hex") + i.originalFilename;
        fs.renameSync(
          i.filepath,
          path.join(npath + `/${name}`),
          function (err) {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
        let imgpath = `/UserData/${data.email}/${name}`;
        imgarr.push(imgpath);
      }
      console.log(`Images uploaded successfully`);

      console.log(imgarr);
      //console.log(cityvalmap);
      let cityobj = {
        Email: data.email,
        FirstName: data.firstname,
        LastName: data.lastname,
        OwnerImage: data.image,
        HomeType: cityvalmap.get("rentaltype"),
        NumberOfBedrooms: cityvalmap.get("numberofbeds"),
        NumberOfBathrooms: cityvalmap.get("numberofbathrooms"),
        AreaSqft: cityvalmap.get("area"),
        RentalInfo: cityvalmap.get("info"),
        RentPrice: cityvalmap.get("price"),
        CityName: cityvalmap.get("CityName"),
        Landmark: cityvalmap.get("landmark"),
        StreetName: cityvalmap.get("streetname"),
        HouseNumber: cityvalmap.get("houseno"),
        Pincode: cityvalmap.get("pincode"),
        Latitude: cityvalmap.get("latitude"),
        Longitude: cityvalmap.get("longitude"),
        Tenant: "",
        Status: false,
        Image: imgarr,
      };

      //console.log(cityobj);

      citydata.create(cityobj, (err, dbinfo) => {
        if (err) {
          console.log("Error in creating city data.");
          console.log(err);
          return;
        }
        console.log("City data created successfully");
        //console.log(dbinfo);

        res.sendFile(path.join(__dirname + "/../ui/html/dashboard.html"));
      });
    });
  formdata.parse(req);
});

router.get("/deletelisting/:id", (req, res) => {
  citydata.deleteOne({ _id: req.params.id }, function (err, info) {
    if (err) {
      console.log(err);
      return res.status(500).json({ status: "failed" });
    }
    console.log("A listing got deleted");
    return res.json({ status: "successfull" });
  });
});

router.get("/removetenant/:id", (req, res) => {
  citydata.findOneAndUpdate(
    { _id: req.params.id },
    { Tenant: "", Status: false },
    {},
    function (err, info) {
      if (err) {
        console.log(err);
        return res.status(500).json({ status: "failed" });
      }
      console.log("tenant was removed");
      return res.json({ status: "successfull" });
    }
  );
});

module.exports = router;
