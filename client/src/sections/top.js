import React, { Component } from "react";
import Logo from "../css/121212.png";

class Top extends Component {
  render() {
    return (
      <div align="center">
        <header>
          <a href="/">
            <img src={Logo} className="headerHomeImage borderCircle header" alt="Logo"/>
            <h1 className="logo-text">g</h1>
          </a>
        </header>
      </div>
    );
  }
}

export default Top;
