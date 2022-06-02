import React from "react";
// use Link from react instead of <a href="">
import { Link } from "react-router-dom";

// personalize the app nav for logged-in user
import Auth from "../../utils/auth";

// if login, nav returns ME & Logout; if not, Login/ Signup
const Header = () => {
  const logout = (event) => {
    //overriding the <a> element's default nature of having the browser load a different resource.
    event.preventDefault();
    //remove the token from localStorage and refresh the app by taking the user to the homepage.
    Auth.logout();
  };

  return (
    <header className="bg-secondary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to="/">
          <h1>Deep Thoughts</h1>
        </Link>

        <nav className="text-center">
          {Auth.loggedIn() ? (
            <>
              <Link to="/profile">Me</Link>
              <a href="/" onClick={logout}>
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
