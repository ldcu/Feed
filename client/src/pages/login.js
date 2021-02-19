import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import { Container } from "react-bootstrap";
import Layout from "../css/layout.module.css";
import Logo from "../css/121212.png";
import { Redirect } from 'react-router-dom';
import Alert from "react-bootstrap/Alert";

class Login extends React.Component {

	state = {
		email: "", // Will be filled with email and password.
		password: "",
		toDashboard: false, // This to be used for redirection.
		alert: false // Alert for wrong credentials.
	};

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value }); // Get the values from the form and set the value for those with same name in "state".
	};

	handleSubmit = (e) => {
		e.preventDefault();

		const data = { // Creating the data to load the POST API.
			email: this.state.email,
			password: this.state.password,
		};

		const headers = {
			"Content-Type": "application/json",
		};

		Axios.post("/api/login", data, { // Sending the credentials entered and obtaining the "access_token".
			headers,
		})
			.then(function (response) {
				localStorage.setItem("access_token", response.data.access_token); // Get "access_token".
				localStorage.setItem("refresh_token", Math.round(new Date().getTime() / 1000 + 3600)); // Unix timestamp with 1 hour ahead of the current time.
			})
			.then(() => this.setState(() => ({
				toDashboard: true // Setting the "toDashboard" if the API POST is successful.
			})))
			// .catch(function (error) {
			// 	console.log('Tough luck. "' + error + '"'); // In case the login doesn't work.
			// });
			.catch(() => this.setState(() => ({
				alert: true // Set alert to 'true' if there's an error.
			})));
	};

	render() {

		if (this.state.toDashboard === true) { // Checking if the API POST has been done, and redirecting the user to "/".
			return <Redirect to='/' />
		}

		return (
			<div className={Layout.container} align="center">
				<Container>
					<header className={Layout.header}>
						<img src={Logo} className={`${Layout.headerHomeImage} ${Layout.borderCircle}`} alt="Logo"/>
						<h1><a href="/" style={{ color: "#121212" }}>g</a></h1>
					</header>
					<br />
					<hr className="half-rule" />
					<br />
					<Form onSubmit={this.handleSubmit.bind(this)}>
						<Form.Group controlId="formBasicEmail">
							<Form.Control type="email" placeholder="Email" name="email" onChange={this.handleChange} style={{ backgroundColor: "#121212", color: "#b7b7b7", boxShadow: "0px 0px 0px white", border: "none", width: "50%", }} />
						</Form.Group>

						<Form.Group controlId="formBasicPassword">
							<Form.Control type="password" placeholder="Password" name="password" onChange={this.handleChange} style={{ backgroundColor: "#121212", color: "#b7b7b7", boxShadow: "0px 0px 0px white", border: "none", width: "50%", }} />
						</Form.Group>
						<Button variant="primary" type="submit" style={{ border: "none", boxShadow: "0px 0px 0px white", backgroundColor: "#121212", color: "#b7b7b7", }}>Login</Button>
					</Form><br/>
					
						{/* Displaying an alert if wrong credentials. */}
						{this.state.alert && (
							<div align="left">
							<Alert variant="danger" onClose={() => this.setState({ alert: false })} dismissible>
								<Alert.Heading>Oh snap! You got an error!</Alert.Heading>
								<p>Wrong credentials.</p>
							</Alert>
							</div>
						)}

				</Container>
			</div>
		);
	}
}

export default Login;
