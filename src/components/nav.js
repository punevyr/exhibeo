import React from "react";
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
          ooonus
          </NavLink>
          <div>
            <ul className="navbar-nav ml-auto">
  
                <li className="nav-item">
                <NavLink className="nav-link" to="/forum">
                  forum
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">
                  profile
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;