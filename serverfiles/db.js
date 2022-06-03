const mongoose = require("mongoose");

const dblink = `mongodb+srv://Ayush:B6pQIEJnN78zl74Z@cluster0.sbck0.mongodb.net/Users?retryWrites=true&w=majority`;

const dbStart = () => {
  return mongoose
    .connect(dblink)
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log("Error connecting to database");
    });
};

const userSchema = mongoose.Schema({
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
    minLength: 8,
  },
  UserImage: {
    type: String,
    required: true,
  },
});

const citySchema = mongoose.Schema({
  Email: {
    type: String,
    required: true,
  },
  FirstName: {
    type: String,
    required: true,
    minLength: 1,
  },
  LastName: {
    type: String,
    required: true,
    minLength: 1,
  },
  OwnerImage: {
    type: String,
    required: true,
    minLength: 1,
  },
  HomeType: {
    type: String,
    required: true,
  },
  NumberOfBedrooms: {
    type: Number,
    required: true,
  },
  NumberOfBathrooms: {
    type: Number,
    required: true,
  },
  AreaSqft: {
    type: Number,
    required: true,
  },
  RentalInfo: {
    type: String,
    required: true,
  },
  RentPrice: {
    type: Number,
    required: true,
  },
  CityName: {
    type: String,
    required: true,
    minLength: 1,
  },
  Landmark: {
    type: String,
    required: true,
    minLength: 1,
  },
  StreetName: {
    type: String,
    required: true,
    minLength: 1,
  },
  HouseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  Pincode: {
    type: Number,
    required: true,
  },
  Longitude: {
    type: String,
    required: true,
  },
  Latitude: {
    type: String,
    required: true,
  },
  Tenant: {
    type: String,
  },
  Status: {
    type: Boolean,
    required: true,
  },
  Image: [
    {
      type: String,
      required: true,
    },
  ],
});

const requestSchema = mongoose.Schema({
  Listing: {
    type: String,
    required: true,
  },
  ListingId: {
    type: mongoose.ObjectId,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
  },
  Owner: {
    type: String,
    required: true,
  },
  OwnerFirstName: {
    type: String,
    required: true,
    minLength: 1,
  },
  OwnerLastName: {
    type: String,
    required: true,
    minLength: 1,
  },
  OwnerImage: {
    type: String,
    required: true,
    minLength: 1,
  },
  Tenant: {
    type: String,
    required: true,
  },
  TenantFirstName: {
    type: String,
    required: true,
    minLength: 1,
  },
  TenantLastName: {
    type: String,
    required: true,
    minLength: 1,
  },
  TenantImage: {
    type: String,
    required: true,
    minLength: 1,
  },

  Status: {
    type: String,
    required: true,
  },
});

const citydata = mongoose.model("citydata", citySchema, "citydata");

const userdata = mongoose.model("userdata", userSchema, "userdata");

const requestdata = mongoose.model("requestdata", requestSchema, "requestdata");

module.exports = { dbStart, userdata, citydata, requestdata };
