import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // Import styles
import { useAuth } from "../../context/User.context.jsx";

function Header() {
  const { user } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <h1>MyApp</h1>
      </div>
      <nav>
        <ul>
          {!user ? (
            <li>
              <Link to="/register">Register</Link>
            </li>
          ) : (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
