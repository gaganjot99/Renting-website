const jwt = require("jsonwebtoken");
const path = require("path");

const validatetoken = (req, res, next) => {
  if (!req.cookies || !req.cookies.userdata) {
    return res.sendFile(path.join(__dirname, "../ui/html/signup.html"));
  }
  const flag = jwt.verify(req.cookies.userdata, process.env.SECRET_KEY);
  if (flag) {
    req.userData = flag;
    //console.log(req.userData);
    next();
  } else {
    res.sendFile(path.join(__dirname, "../ui/html/signup.html"));
  }
};

const checkdata = (info) => {
  var pattern =
    /^[a-zA-z0-9]{2,}[.]{0,1}[a-zA-z0-9]{1,}@[a-z]{2,}[.]{1}[a-z]{2,3}[.]{0,1}[a-z]{0,3}$/;
  if (pattern.test(info.email)) {
    console.log("Email status ok");
  } else {
    console.log("Email not valid");
    return false;
  }

  if (info.firstname != undefined && info.firstname == "") {
    console.log("FirstName cannot be empty.");
    return false;
  }

  if (info.lastname != undefined && info.lastname == "") {
    console.log("Lastname cannot be empty.");
    return false;
  }

  if (
    info.password == "" ||
    info.password == undefined ||
    info.password.length < 8
  ) {
    console.log("Password not valid.");
    return false;
  }

  return true;
};

module.exports = { checkdata, validatetoken };
