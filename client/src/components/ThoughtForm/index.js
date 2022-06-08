import React, { useState } from "react";
import { ADD_THOUGHT } from "../../utils/mutations";
import { useMutation } from "@apollo/client";

//update the cache of any related queries
// The Apollo Client tracks cached objects by their IDs.
// In this case, we've added a new thought that should go inside an array of thoughts,
// but the array itself has no ID to track.
//So the only way to get the updated array is to re-request it from the server.
import { QUERY_THOUGHTS, QUERY_ME } from "../../utils/queries";

const ThoughtForm = () => {
  const [thoughtText, setText] = useState("");
  const [characterCount, setCharacterCount] = useState(0);

  // the addThought() function will run the actual mutation.
  // The error variable will initially be undefined but can change depending on if the mutation failed.
  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    update(cache, { data: { addThought } }) {
      // could potentially not exist yet, so wrap in a try/catch
      try {
        // update me array's cache
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          // update thoughts in me query
          data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
        });
      } catch (e) {
        console.warn("First thought insertion by user!");
      }

      //read what's currently in the cache
      const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

      // add the newest thought to the front of the array
      cache.writeQuery({
        query: QUERY_THOUGHTS,
        data: { thoughts: [addThought, ...thoughts] },
      });
    },
  });

  // form content
  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      //monitor the typing
      setText(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // add thoughts to database
      await addThought({
        variables: { thoughtText },
      });

      // clear the form values
      setText("");
      setCharacterCount(0);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <p
        className={`m-0 ${characterCount === 280 || error ? "text-error" : ""}`}
      >
        Character Count: {characterCount}/280
        {error && <span className="ml-2">Something went wrong...</span>}
      </p>
      <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <textarea
          placeholder="Here's a new thought..."
          value={thoughtText}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>
        <button className="btn col-12 col-md-3" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
