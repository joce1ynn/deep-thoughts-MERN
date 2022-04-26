// Type definitions,  involves literally defining every piece of data that the client can expect to work with through a query or mutation
// Queries: Queries are how we perform GET requests and ask for data from a GraphQL API.
// Mutations: Mutations are how we perform POST, PUT, and DELETE requests to create or manipulate data through a GraphQL API.

// import the gql tagged template function
const { gql } = require("apollo-server-express");

// create our typeDefs
const typeDefs = gql`
  type Query {
    helloWorld: String
  }
`;

// export the typeDefs
module.exports = typeDefs;
