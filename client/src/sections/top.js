import React, { Component } from 'react';
import Logo from "../css/121212.png";

class Top extends Component {
	render() {
		return (
			<div align="center">
				<header>
					<img src={Logo} className="headerHomeImage borderCircle header" alt="Logo"/>
					<h1><a href="/" className="logo-text">g</a></h1>
				</header>
				<br />
			</div>
		);
	}
}

export default Top;