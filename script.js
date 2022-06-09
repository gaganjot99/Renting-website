const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const {
  dbStart,
  userdata,
  citydata,
  requestdata,
} = require("./serverfiles/db");
const { validatetoken } = require("./serverfiles/validate");
const signRouter = require("./serverfiles/sign");
const userRouter = require("./serverfiles/user");
const cityRouter = require("./serverfiles/city");
const listingRouter = require("./serverfiles/listing");
const requestRouter = require("./serverfiles/request");
const graphqlServer = require("./serverfiles/graphql");

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

//routes for landing page for logged out users
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/ui/html/index.html"));
});
app.use("/index", express.static(path.join(__dirname + "/ui")));
app.use("/sign", signRouter);
app.use("/graphql", graphqlServer);

app.use(validatetoken);

app.use("/user", userRouter);
app.use("/city", cityRouter);
app.use("/listing", listingRouter);
app.use("/request", requestRouter);

// app.get("/main", (req, res) => {
//   res.sendFile(path.join(__dirname + "/ui/html/main.html"));
// });

//static routes for logged in users
app.use(express.static(path.join(__dirname + "/ui")));
app.use("/UserData", express.static(path.join(__dirname + "/UserData")));

//route for 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname + "/ui/html/404.html"));
});

dbStart().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server is running.");
  });
});
