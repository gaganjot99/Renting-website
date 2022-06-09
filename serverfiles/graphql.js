var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
const { makeExecutableSchema } = require("graphql-tools");

const { load } = require("nodemon/lib/config");
const { userdata, citydata } = require("./db");

var typeDefs = buildSchema(`
type User {
    Email: String
    FirstName: String
    LastName: String
    UserImage: String
    ownerListings: [Listing]
    rentedListings: [Listing]
}

type Listing {
    Email: String
    FirstName: String
    LastName: String
    OwnerImage: String
    HomeType: String
    NumberOfBedrooms: Int
    NumberOfBathrooms: Int
    AreaSqft: Int
    RentalInfo: String
    RentPrice: String
    CityName: String
    Landmark: String
    StreetName: String
    HouseNumber: String
    Pincode: Int
    Longitude: String
    Latitude: String
    Tenant: String
    Status: Boolean
    Image: [String]
}

type Query {
    user(input: String): User
    city(input: String): [Listing]
}

`);

var resolvers = {
  Query: {
    user(_, { input }) {
      //console.log("user resolver");
      return userdata.findOne({ Email: input });
    },
    city(_, { input }) {
      return citydata.find({ CityName: input });
    },
  },
  User: {
    ownerListings: (user) => {
      //console.log("listing resolver");
      return citydata.find({ Email: user.Email });
    },
    rentedListings: (user) => {
      return citydata.find({ Tenant: user.Email });
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const graphqlServer = graphqlHTTP({
  schema: schema,
  graphiql: true,
});

module.exports = graphqlServer;
