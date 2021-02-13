import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Feed from "./pages/feed";
import Home from "./pages/home";
import Goals from "./pages/goals";
import Logo from './css/121212.png'
import Nav from 'react-bootstrap/Nav'
import Yt from "./pages/yt";
import Hash from "./pages/hash";
import Layout from './css/layout.module.css'
import { Container } from 'react-bootstrap'

function App() {

	return (
		<>
			<div className={Layout.container}>
				<Container>

					<header className={Layout.header}>
						<img src={Logo} className={`${Layout.headerHomeImage} ${Layout.borderCircle}`} alt="Logo" />
						<h1><a href="/home" style={{ color: '#121212' }}>g</a></h1>
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
							<Nav.Link eventKey="4" href="/yt" title="YouTube" className="link">
								YT
							</Nav.Link>
						</Nav.Item>

						<Nav.Item>
							<Nav.Link eventKey="4" href="/hash" title="Hash" className="link">
								Hash
							</Nav.Link>
						</Nav.Item>

						<Nav.Item>
							<Nav.Link eventKey="4" href="/goals" title="Goals" className="link">
								Goals
							</Nav.Link>
						</Nav.Item>

					</Nav>
					<hr className="half-rule" />

					<br />

					<BrowserRouter>
						<Route exact path="/"><Redirect to="/home" /></Route>
						<BrowserRouter><Route path="/yt" component={Yt} exact /></BrowserRouter>
						<BrowserRouter><Route path="/feed" component={Feed} exact /></BrowserRouter>
						<BrowserRouter><Route path="/home" component={Home} exact /></BrowserRouter>
						<BrowserRouter><Route path="/hash" component={Hash} exact /></BrowserRouter>
						<BrowserRouter><Route path="/goals" component={Goals} exact /></BrowserRouter>
					</BrowserRouter>

				</Container>
			</div>
		</>
	);
}

export default App;