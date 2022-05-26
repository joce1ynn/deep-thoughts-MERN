const express = require("express");
// import ApolloServer
const { ApolloServer } = require("apollo-server-express");

// import path
const path = require("path");

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

// import auth middleware
const { authMiddleware } = require("./utils/auth");

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  // create a new Apollo server and pass in our schema data
  // we provide the type definitions and resolvers so they know what our API looks like and how it resolves requests
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // read the incoming request and return only the headers
    context: authMiddleware,
  });

  // Start the Apollo server
  await server.start();

  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  // log where we can go to test our GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// Initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve up static assets, they only come into effect when we go into production
// check to see if the Node environment is in production
if (process.env.NODE_ENV === "production") {
  // If it is, we instruct the Express.js server to serve any files in the React app's build directory in the client folder.
  app.use(express.static(path.join(__dirname, "../client/build")));
}

//如果我们向服务器上没有明确定义路由的任何位置发出GET请求，则用生产就绪的React前端代码进行响应
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});

// 21.1.5
