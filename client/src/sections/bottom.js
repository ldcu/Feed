import React, { Component } from 'react';

class Bottom extends Component {
	render() {
		return (
			<div>
				<hr className="bottom-line" />
				<a href="/home" className="link">← Back to home</a>
				<hr className="bottom-line" />
			</div>
		);
	}
}

export default Bottom;