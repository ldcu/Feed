import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import Feed from "./pages/feed";
import { Container } from "react-bootstrap";
import Logo from "./css/121212.png";
import Layout from "./css/layout.module.css";
import Nav from "react-bootstrap/Nav";
import Goals from "./pages/goals";
import Hash from "./pages/hash";
import Home from "./pages/home";
import Yt from "./pages/yt";
import Login from './pages/login';
import NotFound from "./pages/not-found";

const checkAuth = () => {
  const access_token = localStorage.getItem('access_token');
  const refresh_token = localStorage.getItem('refresh_token');
  if (!access_token || access_token.length < 212 || !refresh_token) {
    return false;
  }

  try {
    // { exp: 12903819203 }
    const { exp } = refresh_token;

    if (exp < new Date().getTime() / 1000) {
      return false;
    }

  } catch (e) {
    return false;
  }

  return true;
}

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    checkAuth() ? (
			<div className={Layout.container}>
			<Container>
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
      <Component {...props} />
			</Container>
			</div>
    ) : (
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