import React, { Component } from 'react';

class Bottom extends Component {
	render() {
		return (
			<div className="vertical-lines">
				<hr className="top-line" />
				<a href="/home" className="link">&#160;&#160;&#160;&#160;← Back to home</a>
				<hr className="bottom-line" />
			</div>
		);
	}
}

export default Bottom;