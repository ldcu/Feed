import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Logo from "./css/121212.png";
import Nav from "react-bootstrap/Nav";
import Layout from "./css/layout.module.css";
import { Container } from "react-bootstrap";
import Cookies from "js-cookie";
// Menu pages
import Authentication from "./pages/auth";
import Feed from "./pages/feed";
import Goals from "./pages/goals";
import Hash from "./pages/hash";
import Home from "./pages/home";
import Yt from "./pages/yt";
import NotFound from "./pages/not-found";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			googleId: Cookies.get("googleId"),
		};
	}

	render() {
		let NAVIGATION_MENU = "";
		const googleId = this.state.googleId;

		if (googleId === process.env.REACT_APP_GOOGLE_ID) {
			NAVIGATION_MENU = (
				<div>
					<header className={Layout.header}>
						<img
							src={Logo}
							className={`${Layout.headerHomeImage} ${Layout.borderCircle}`}
							alt="Logo"
						/>
						<h1>
							<a href="/" style={{ color: "#121212" }}>
								g
							</a>
						</h1>
					</header>
					<br />
					<br />

					<Nav variant="pills" activeKey="1">
						<Nav.Item>
							<Nav.Link eventKey="2" href="/home" title="Home" className="link">
								Home
							</Nav.Link>
						</Nav.Item>

						<Nav.Item>
							<Nav.Link eventKey="3" href="/feed" title="Feed" className="link">
								Feed
							</Nav.Link>
						</Nav.Item>

						<Nav.Item>
							<Nav.Link
								eventKey="4"
								href="/yt"
								title="YouTube"
								className="link"
							>
								YT
							</Nav.Link>
						</Nav.Item>

						<Nav.Item>
							<Nav.Link eventKey="4" href="/hash" title="Hash" className="link">
								Hash
							</Nav.Link>
						</Nav.Item>

						<Nav.Item>
							<Nav.Link
								eventKey="4"
								href="/goals"
								title="Goals"
								className="link"
							>
								Goals
							</Nav.Link>
						</Nav.Item>
					</Nav>
					<hr className="half-rule" />
				</div>
			);
		} else {
			// Not logged in.
			NAVIGATION_MENU = <div align="center"></div>;
		}

		return (
			<div className={Layout.container}>
				<Container>
					{NAVIGATION_MENU}

					<Router>
						<Switch>
							<Route exact path="/" component={Authentication} />
							<Route path="/feed" component={Feed} exact />
							<Route path="/goals" component={Goals} exact />
							<Route path="/hash" component={Hash} exact />
							<Route path="/home" component={Home} exact />
							<Route path="/yt" component={Yt} exact />
							<Route path="*" component={NotFound} exact />
						</Switch>
					</Router>
				</Container>
			</div>
		);
	}
}

export default App;
