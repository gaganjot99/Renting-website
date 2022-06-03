const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const { citydata, userdata, requestdata } = require("./db");

router.get("/userinfo", function (req, res) {
  console.log("userinfo");
  if (req.userData) {
    res.json(req.userData);
  } else {
    res.json({ status: "no token was found" });
  }
});

router.get("/userdashboarddata", function (req, res) {
  let userobj = {};
  const data = req.userData;
  //console.log(data);
  citydata.find({ Email: data.email }, function (err, info) {
    if (err) {
      console.log("Cant find user.");
      return;
    }
    userobj.owner = info;

    citydata.find({ Tenant: data.email }, function (err1, info1) {
      if (err1) {
        console.log(err1);
        return;
      }
      //console.log("userobj with tenant");
      //console.log(userobj);
      userobj.tenant = info1;

      requestdata.find({ Tenant: data.email }, function (err, info) {
        if (err) {
          console.log(err);
          return;
        }
        userobj.requestsSent = info;
        requestdata.find(
          { Owner: data.email, Status: "Pending" },
          function (err, info) {
            if (err) {
              console.log(err);
              return;
            }
            userobj.requestsReceived = info;
            return res.json(userobj);
          }
        );
      });
    });
  });
});

router.post("/profileEdit", function (req, res) {
  const userdatavalue = req.userData;
  var formdata = new formidable.IncomingForm();
  formdata.uploadDir = path.join(__dirname + `/../UserData/temp`);
  let data = {};
  let imgpath;
  formdata
    .on("field", function (field, value) {
      data[field] = value;
    })
    .on("file", function (file, value) {
      imgpath = `/../ui/media/User_Profile_images/${
        userdatavalue.email + value.originalFilename
      }`;
      if (fs.existsSync(imgpath)) {
        console.log("same image exists");
      } else {
        if (userdatavalue.image.split("/")[3].toString() == "default.png") {
          console.log("Found default no need to remove");
        } else {
          fs.unlinkSync(`/../ui${userdatavalue.image}`);
        }
        fs.renameSync(
          value.filepath,
          path.join(
            __dirname +
              `/../ui/media/User_Profile_images/${
                userdatavalue.email + value.originalFilename
              }`
          ),
          function (err) {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
      }
      imgpath = `/media/User_Profile_images/${
        userdatavalue.email + value.originalFilename
      }`;
    })
    .on("end", function () {
      console.log(data);
      if (data.Password != data.Confirm_password) {
        console.log("Password and confirm password do not match");
        return res.send("Password and confirm password do not match");
      }
      userdata.updateOne(
        { Email: userdatavalue.email },
        {
          UserImage: imgpath,
          FirstName: data.FirstName,
          LastName: data.LastName,
          Password: bcrypt.hashSync(data.Password, 10),
        },
        function (err, dbdata) {
          if (err) {
            return res.send(err);
          }
          console.log("Data updated successfully.");
          console.log(dbdata);

          citydata.updateMany(
            { Email: userdatavalue.email },
            {
              FirstName: data.FirstName,
              LastName: data.LastName,
              OwnerImage: imgpath,
            },
            function (err1, db1) {
              if (err1) {
                return res.send(err1);
              }
              console.log("Data updated in citydb");
              console.log(db1);

              res.clearCookie("userdata");

              let userval = {
                email: userdatavalue.email,
                image: imgpath,
                firstname: data.FirstName,
                lastname: data.LastName,
              };

              console.log(userval);
              const token2 = jwt.sign(userval, process.env.SECRET_KEY);

              res.cookie("userdata", token2, {
                httpOnly: false,
                expiresin: new Date(Date.now() + 1000 * 60 * 10),
              });

              console.log("User data updated");
              return res.sendFile(
                path.join(__dirname, "/../ui/html/dashboard.html")
              );
            }
          );
        }
      );
    });
  formdata.parse(req);
});

module.exports = router;
