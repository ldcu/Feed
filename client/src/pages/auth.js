import React, { Component } from "react";
import GoogleLogin from "react-google-login";
import Cookies from "js-cookie";

const responseGoogle = (response) => {
	if (response.profileObj.googleId === process.env.REACT_APP_GOOGLE_ID) {
		Cookies.set("googleId", response.profileObj.googleId, { expires: 7 });
		console.log(response);
	}
};

const responseErrorGoogle = (response) => {
	console.log("Tough luck. Error logging in.");
};

class Authentication extends Component {
	constructor(props) {
		super(props);

		this.state = {
			googleId: Cookies.get("googleId"),
		};
	}

	render() {
		let GOOGLE_BUTTON = "";

		if (this.state.googleId === process.env.REACT_APP_GOOGLE_ID) {
			GOOGLE_BUTTON = (
				<>
					<br />
					<p>Heya!</p>
					<GoogleLogin
						theme="dark"
						clientId="639369337592-25j6d7dod9nhlkfnsrn3v096b0vpvqol.apps.googleusercontent.com"
						onSuccess={responseGoogle}
						onFailure={responseErrorGoogle}
						cookiePolicy={"single_host_origin"}
					/>
				</>
			);
		} else {
			// Not logged in.
			GOOGLE_BUTTON = (
				<>
					<GoogleLogin
						theme="dark"
						clientId="639369337592-25j6d7dod9nhlkfnsrn3v096b0vpvqol.apps.googleusercontent.com"
						onSuccess={responseGoogle}
						onFailure={responseErrorGoogle}
						cookiePolicy={"single_host_origin"}
					/>
				</>
			);
		}

		return <div align="center">{GOOGLE_BUTTON}</div>;
	}
}

export default Authentication;
