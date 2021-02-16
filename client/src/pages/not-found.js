import React, { Component } from 'react';

// Page returned only if you're authenticated.
// Meaning it won't show that the page you're accessing doesn't exist to a not logged in user.

class NotFound extends Component {
	render() {
		return (
			<div align="center">
				<p>Sorry, mate. This page doesn't exist.</p>
			</div>
		);
	}
}

export default NotFound;