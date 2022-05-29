import React from "react";
import { useParams } from "react-router-dom";

// import query
import { useQuery } from "@apollo/client";
import { QUERY_THOUGHT } from "../utils/queries";

// import reaction
import ReactionList from "../components/ReactionList";

const SingleThought = (props) => {
  // get id from url
  const { id: thoughtId } = useParams();

  // The id on the variables object will become the $id parameter in the GraphQL query.
  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId },
  });

  const thought = data?.thought || {};

  // The loading variable is then used to briefly show a loading <div> element,
  if (loading) {
    return <div>Loading...</div>;
  }

  // thought.reactionCount > 0 expression to prevent rendering the reactions if the array is empty.
  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{" "}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>

      {thought.reactionCount > 0 && (
        <ReactionList reactions={thought.reactions} />
      )}
    </div>
  );
};

export default SingleThought;
