import React, { Component } from 'react';

class Bottom extends Component {
	render() {
		return (
			<div className="vertical-lines">
				<hr className="separate-line" />
				<a href="/home" className="link">&#160;&#160;&#160;&#160;← Back to home</a>
				<hr className="separate-line" />
			</div>
		);
	}
}

export default Bottom;