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

  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // if no token, return request object as is
    if (!token) {
      return req;
    }

    // try...catch statement to mute the error.
    // users with an invalid token should still be able to request and see all thoughts
    try {
      // decode and attach user data to request object
      // If the secret on jwt.verify() doesn't match the secret that was used with jwt.sign(), the object won't be decoded.
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    // return updated request object
    return req;
  },
};
