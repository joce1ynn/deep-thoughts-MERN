// Type definitions,  involves literally defining every piece of data that the client can expect to work with through a query or mutation
// Queries: Queries are how we perform GET requests and ask for data from a GraphQL API.
// Mutations: Mutations are how we perform POST, PUT, and DELETE requests to create or manipulate data through a GraphQL API.

// import the gql tagged template function
const { gql } = require("apollo-server-express");

// create our typeDefs
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }

  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
  }
`;

// export the typeDefs
module.exports = typeDefs;

// thoughts query that it could receive a parameter if we wanted.
// allow us to query thoughts with or without the username
// ! 要执行该查询，该数据必须存在
// we didn't enforce a query parameter for thoughts because it wasn't necessary for the query to work. If there's no parameter, we simply return all thoughts.
// we want to look up a single thought or user, we need to know which one we're looking up and thus necessitate a parameter for us to look up that data.

// friends field is an array that will be populated with data that also adheres to the User type,
// as a user's friends should follow the same data pattern as that user.

// A token isn't part of the User model, so it doesn't make sense to add it to the User type definition.
// Instead, we'll create a new type specifically for authentication.
// The auth code above means that an Auth type must return a token and can optionally include any other user data.
