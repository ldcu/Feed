import React, { Component } from "react";
import { Container } from "react-bootstrap";
import Layout from "../css/layout.module.css";
import { Helmet } from "react-helmet";
import md5 from "crypto-js/md5";
import sha1 from "crypto-js/sha1";
import Form from "react-bootstrap/Form";

class MD5 extends Component {
	state = {
		userInput: "",
	};

	inputChangedHandler = (event) => {
		this.setState({ userInput: event.target.value });
	};

	render() {
		return (
			<div className={Layout.container}>
				<Helmet>
					<title>Hash</title>
				</Helmet>
				<Container>
					<h1 style={{ color: "#b7b7b7" }}>Hash</h1>

					<br />

					<Form.Control
						as="textarea"
						rows="5"
						onChange={this.inputChangedHandler}
						value={this.state.userInput}
						style={{
							backgroundColor: "#121212",
							color: "#b7b7b7",
							boxShadow: "0px 0px 0px white",
							border: "none",
						}}
						placeholder="Enter the plain text here."
					/>

					<br />

					{this.state.userInput.length > 0 && (
							<div align="center"><b>MD5</b> {md5(this.state.userInput).toString()}
							<br />
							<b>SHA1</b> {sha1(this.state.userInput).toString()}
							</div>
					)}

				</Container>
				
				{/* Back to home button. */}
				
				<hr className="half-rule" />
					<a href="/home" className="link">
						← Back to home
					</a>
			</div>
		);
	}
}
export default MD5;
