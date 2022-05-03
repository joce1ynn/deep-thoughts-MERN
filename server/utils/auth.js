const jwt = require("jsonwebtoken");

// given an expiration date and a secret to sign the token with
// If your JWT secret is ever compromised, you'll need to generate a new one, immediately invalidating all current tokens.
// secret is so important, you should store it somewhere other than in a JavaScript file—like an environment variable.
const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  // signToken add user's username, email, and _id properties to the token
  // never include sensitive data like a password on your tokens—and always sign your tokens with a secret.
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
