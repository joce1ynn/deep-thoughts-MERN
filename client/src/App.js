import React from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";

// We renamed BrowserRouter to Router to make it easier to work with.
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ApolloProvider is a special type of React component that we'll use to provide data to all of the other components.
// ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server.
// InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.
// createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import SingleThought from "./pages/SingleThought";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

// establish a new link to the GraphQL server
const httpLink = createHttpLink({
  // URI stands for "Uniform Resource Identifier."
  // With this proxy value in package.json, the React App set up the development server to prefix all HTTP requests using relative paths
  // uri: "http://localhost:3001/graphql",
  uri: "/graphql",
});

const client = new ApolloClient({
  //使用ApolloClient()构造函数实例化Apollo Client实例并创建到API端点的连接
  link: httpLink,
  //instantiate a new cache object using new InMemoryCache()
  cache: new InMemoryCache(),
});

function App() {
  //wrap the entire returning JSX code with <ApolloProvider>
  // a path that leads to the wildcard character, an asterisk (*) sending the 404 message.
  // The ? means this parameter is optional, so /profile and /profile/myUsername will both render the Profile component.
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile/:username?" element={<Profile />} />
              <Route path="/thought/:id" element={<SingleThought />} />
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
