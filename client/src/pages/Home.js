import React from "react";
import ThoughtList from "../components/ThoughtList";
import FriendList from "../components/FriendList";

// integrate apollo useQuery hook
// make requests to the GraphQL server and made available to use the <ApolloProvider> component in App.js earlier.
import { useQuery } from "@apollo/client";

// show thoughts and user data on home page
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from "../utils/queries";

// import auth to check the logged-in status of a user
import Auth from "../utils/auth";

const Home = () => {
  // use useQuery hook to make query request
  // When loading the Home component, we'll execute the query for the thought data
  // data returned from the server, that information is stored in the destructured data property.
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
  const { data: userData } = useQuery(QUERY_ME_BASIC);

  //because GraphQL response comes in a big data object. just need to access data.thoughts
  // ? is optional chaining, it doesn't need to check if an object exists before accessing its properties
  // no data will exist until the query to the server is finished
  // if data exists, store it in the thoughts constant we just created.
  // If data is undefined, then save an empty array to the thoughts component.
  const thoughts = data?.thoughts || [];

  // If you're logged in, the loggedIn variable will be true; otherwise, it will be false
  const loggedIn = Auth.loggedIn();

  // use a ternary operator to conditionally render the <ThoughtList> component
  // If the query hasn't completed and loading is still defined, we display a message to indicate just that.
  // If the user isn't logged in, it'll span the full width of the row.
  // But if you the user is logged in, it'll only span eight columns,
  // leaving space for a four-column <div> to display the <FriendList> component
  return (
    <main>
      <div className="flex-row justify-space-between">
        <div className={`col-12 mb-3 ${loggedIn && "col-lg-8"}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>

        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
