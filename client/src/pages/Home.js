import React from "react";

// integrate apollo useQuery hook
// make requests to the GraphQL server and made available to use the <ApolloProvider> component in App.js earlier.
import { useQuery } from "@apollo/client";
// show thoughts on home page
import { QUERY_THOUGHTS } from "../utils/queries";

const Home = () => {
  // use useQuery hook to make query request
  // When loading the Home component, we'll execute the query for the thought data
  // data returned from the server, that information is stored in the destructured data property.
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  //because GraphQL response comes in a big data object. just need to access data.thoughts
  // ? is optional chaining, it doesn't need to check if an object exists before accessing its properties
  // no data will exist until the query to the server is finished
  // if data exists, store it in the thoughts constant we just created.
  // If data is undefined, then save an empty array to the thoughts component.
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className="flex-row justify-space-between">
        <div className="col-12 mb-3">{/* PRINT THOUGHT LIST */}</div>
      </div>
    </main>
  );
};

export default Home;
