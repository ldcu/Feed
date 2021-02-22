import React, { Component } from 'react';
import Bottom from "./bottom";

// Page returned only if you're authenticated.
// Meaning it won't show that the page you're accessing doesn't exist to a not logged in user.

class NotFound extends Component {
	render() {
		return (
			<>
			<div align="center">
				<p>Sorry, mate. This page doesn't exist.</p>
			</div>
			<Bottom />
			</>
		);
	}
}

export default NotFound;