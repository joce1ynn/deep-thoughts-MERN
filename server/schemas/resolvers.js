// Resolvers are simply the functions we connect to each query or mutation type definition
// that perform the CRUD actions that each query or mutation is expected to perform.

const resolvers = {
  Query: {
    helloWorld: () => {
      return "Hello world!";
    },
  },
};

module.exports = resolvers;
