// jwt-decode is  to extract nonsensitive data such as the expiration date so we can check if it has expired before we make a request to the server that needs it.

import decode from "jwt-decode";

// AuthService that we instantiate a new version for every component that imports it.
class AuthService {
  // retrieve data saved in token
  getProfile() {
    return decode(this.getToken());
  }

  // check if the user is still logged in
  loggedIn() {
    // check if there is a saved token and it's still valid
    const token = this.getToken();
    // use type coersion to check if token is NOT undefined and is NOT expired
    return !!token && !this.isTokenExpired(token);
  }
}

export default new AuthService();
