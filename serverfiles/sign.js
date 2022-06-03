const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const { checkdata } = require("./validate");
const { userdata } = require("./db");

router.post("/signin", urlencodedParser, function (req, res) {
  const info = req.body;
  let email = info.email;
  let password = info.password;
  if (checkdata(info)) {
    userdata.findOne({ Email: email }, (err, values) => {
      if (err) {
        console.log("An error occured while signing in.");
        res.send("An error occured while signing in.");
        return;
      }
      if (values == null) {
        console.log("User not found.");
        res.send("User not found.");
        return;
      }
      let flag = bcrypt.compareSync(password, values.Password);
      if (flag) {
        console.log("Passwrod valid");
      } else {
        return res.send("Password not valid.");
      }

      let userval = {
        email: values.Email,
        image: values.UserImage,
        firstname: values.FirstName,
        lastname: values.LastName,
      };

      const token = jwt.sign(userval, process.env.SECRET_KEY);

      res.cookie("userdata", token, {
        httpOnly: false,
        expiresin: new Date(Date.now() + 1000 * 60 * 10),
      });
      res.cookie("city", "new delhi", {
        httpOnly: false,
        expiresin: new Date(Date.now() + 1000 * 60 * 10),
      });
      res.sendFile(path.join(__dirname, "../ui/html/index.html"));
    });
  } else {
    res.send("Credentials not valid");
  }
});

router.post("/signupcheck", urlencodedParser, function (req, res) {
  const info = req.body;
  console.log(info);
  if (checkdata(info)) {
    if (!info.email || !info.firstname || !info.lastname || !info.password) {
      return res.status(400).json({ status: "All fields were not present" });
    }
    let user = {
      Email: info.email,
      FirstName: info.firstname,
      LastName: info.lastname,
      Password: bcrypt.hashSync(info.password, 10),
      UserImage: "/media/User_Profile_images/default.png",
    };
    userdata.create(user, (err, dbinfo) => {
      if (err) {
        console.log(err);
        console.log("Error creating new user.");
        res.send("Error creating new user.");
        return;
      }
      console.log("New USER created.");
      console.log(dbinfo);
      fs.mkdirSync(path.join(__dirname + `/UserData/${dbinfo.Email}`), {
        recursive: true,
      });
      res.sendFile(path.join(__dirname, "../ui/html/signup.html"));
      return;
    });
  } else {
    console.log("Data not valid");
    res.send("Data not valid");
    return;
  }
});

router.get("/signout", function (req, res) {
  res.clearCookie("userdata");
  console.log("cookie cleared");
  res.sendFile(path.join(__dirname, "../ui/html/index.html"));
});

module.exports = router;
