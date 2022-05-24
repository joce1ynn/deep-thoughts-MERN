import React from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";

// ApolloProvider is a special type of React component that we'll use to provide data to all of the other components.
// ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server.
// InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.
// createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";

// establish a new link to the GraphQL server
const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
});

const client = new ApolloClient({
  //使用ApolloClient()构造函数实例化Apollo Client实例并创建到API端点的连接
  link: httpLink,
  //instantiate a new cache object using new InMemoryCache()
  cache: new InMemoryCache(),
});

function App() {
  //wrap the entire returning JSX code with <ApolloProvider>
  return (
    <ApolloProvider client={client}>
      <div className="flex-column justify-flex-start min-100-vh">
        <Header />
        <div className="container">
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
