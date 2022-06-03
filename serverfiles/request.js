const express = require("express");
const router = express.Router();

const { requestdata, citydata } = require("./db");

router.post("/requestadd", function (req, res) {
  //console.log(req.body);
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  };
  requestdata.findOneAndUpdate(
    req.body,
    req.body,
    options,
    function (err, info) {
      if (err) {
        console.log(err);
        return;
      }
      //console.log(info);
      return res.json({ status: "successfull" });
    }
  );
});

router.get("/rejectreq/:id", (req, res) => {
  requestdata.findOneAndUpdate(
    { _id: req.params.id },
    { Status: "Rejected" },
    {},
    function (err, info) {
      if (err) {
        console.log(err);
        return res.status(500).json({ status: "failure" });
      }
      return res.json({ status: "successfull" });
    }
  );
});

router.get("/acceptreq/:id", (req, res) => {
  requestdata.findOneAndUpdate(
    { _id: req.params.id },
    { Status: "Accepted" },
    {},
    function (err, info) {
      if (err) {
        console.log(err);
        return res.status(500).json({ status: "failure" });
      }
      citydata.findOneAndUpdate(
        { _id: info.ListingId },
        { Status: true, Tenant: info.Tenant },
        {},
        function (err, info) {
          if (err) {
            console.log(err);
            return res.status(500).json({ status: "failure" });
          }
          return res.json({ status: "successfull" });
        }
      );
    }
  );
});

module.exports = router;
