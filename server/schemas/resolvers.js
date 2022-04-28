// Resolvers are simply the functions we connect to each query or mutation type definition
// that perform the CRUD actions that each query or mutation is expected to perform.

const { AuthenticationError } = require("apollo-server-express");
const { User, Thought } = require("../models");

const resolvers = {
  // We don't have to worry about error handling here because Apollo can infer if something goes wrong and will respond for us.
  Query: {
    //1. get thoughts by username/ get all thoughts
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      // ? check if username exists.
      // If it does, we set params to an object with a username key set to that value.
      // If it doesn't, we simply return an empty object.

      return Thought.find(params).sort({ createdAt: -1 });
      // If there's data, it'll perform a lookup by a specific username.
      // If there's not, it'll simply return every thought.
    },

    // 2. get single thought by id
    thought: async (parent, { _id }) => {
      // look up a single thought by its _id
      return Thought.findOne({ _id });
    },

    // 3. get all users
    users: async () => {
      return (
        User.find()
          // omit the Mongoose-specific __v property and the user's password information
          .select("-__v -password")
          .populate("friends")
          .populate("thoughts")
      );
    },

    // 4. get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("friends")
        .populate("thoughts");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      return user;
    },
    
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      return user;
    },
  },
};

module.exports = resolvers;
