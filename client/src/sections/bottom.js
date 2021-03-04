import React, { Component } from 'react';

class Bottom extends Component {
	render() {
		return (
      <div class="fixed-bottom">
        <p></p>
        <a href="/home" className="back-to-home tab-space">
          ← back to home
        </a>
        <p></p>
      </div>
    );
	}
}

export default Bottom;