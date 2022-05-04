// Resolvers are simply the functions we connect to each query or mutation type definition
// that perform the CRUD actions that each query or mutation is expected to perform.

const { AuthenticationError } = require("apollo-server-express");
const { User, Thought } = require("../models");
const { signToken } = require("../utils/auth");

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

    // 5 header me
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("thoughts")
          .populate("friends");

        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
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

      const token = signToken(user);
      return { token, user };
    },

    addThought: async (parent, args, context) => {
      // Only logged-in users should be able to use this mutation, so we check for the existence of context.user
      if (context.user) {
        // create new thought
        const thought = await Thought.create({
          ...args,
          username: context.user.username,
        });

        // update user with new thought
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          { new: true }
        );

        return thought;
      }

      throw new AuthenticationError("You need to be logged in!");
    },

    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      if (context.user) {
        //Reactions are stored as arrays on the Thought model, so you'll use the Mongo $push operator.
        const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          {
            $push: {
              reactions: { reactionBody, username: context.user.username },
            },
          },
          { new: true, runValidators: true }
        );

        return updatedThought;
      }

      throw new AuthenticationError("You need to be logged in!");
    },

    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        //This mutation will look for an incoming friendId and add that to the current user's friends array.
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          // A user can't be friends with the same person twice, though, hence why we're using the $addToSet operator instead of $push to prevent duplicate entries.
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate("friends");

        return updatedUser;
      }

      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
