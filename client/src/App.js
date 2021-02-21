import React from 'react';
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom';
import Feed from "./pages/feed";
import { Container } from "react-bootstrap";
import Logo from "./css/121212.png";
import Nav from "react-bootstrap/Nav";
import Goals from "./pages/goals";
import Hash from "./pages/hash";
import Home from "./pages/home";
import Yt from "./pages/yt";
import Login from './pages/login';
import NotFound from "./pages/not-found";
import Button from "react-bootstrap/Button";

const checkAuth = () => {
  const access_token = localStorage.getItem('access_token'); // Get "access_token".`
  const refresh_token = localStorage.getItem('refresh_token'); // Get expiration date.

  if (!access_token || access_token.length < 200 || !refresh_token) { // If there's not access_token, refresh_token & if the length of the access_token is less than 212, return false.
		localStorage.clear();
    return false;
  }

  try {

    if (refresh_token < new Date().getTime() / 1000) { // If refresh_token < current date, return false.
			localStorage.clear();
			return false;
    }

  } catch (e) {
		localStorage.clear();
    return false; // If any error whatsoever, return false.
  }

  return true;
}

function handleSubmit() {
	localStorage.clear();
}

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    checkAuth() ? ( // If authenticated, then show the navigation menu and everything else.
			<div className="container">
			<Container>
			<div>
					<header className="container">
						<img src={Logo} className="headerHomeImage borderCircle header" alt="Logo"/>
						<h1><div align="center"><a href="/" className="logo-text">g</a></div></h1>
					</header>

					<div align="right">
					<Link to="/">
					<Button variant="primary" size="m" type="submit" onClick={handleSubmit}>Log out</Button>
					</Link>
					</div>

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
				</div>
      <Component {...props} />
			</Container>
			</div>
    ) : ( // If not authenticated, return to "/login" page.
        <Redirect to={{ pathname: '/login' }} />
      )
  )} />
)

// "AuthRoute" is for the authenticated user. If you're not logged in, you won't have access to those pages.

export default () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" render={props => <Login {...props} />} />
      {/* <Route exact path="*" render={props => <Login {...props} />} /> */}
      <AuthRoute exact path="/feed" component={Feed} />
      <AuthRoute exact path="/goals" component={Goals} />
      <AuthRoute exact path="/hash" component={Hash} />
      <AuthRoute exact path="/home" component={Home} />
      <AuthRoute exact path="/yt" component={Yt} />
      <AuthRoute exact path="/" component={Home} />
      <AuthRoute exact path="*" component={NotFound} />
    </Switch>
  </BrowserRouter>
);