import React from "react";
import { Helmet } from "react-helmet";
import Layout from "../css/layout.module.css";
import Axios from "axios";
import Cookies from "js-cookie";

export default class Goals extends React.Component {
	state = {
		goals: [],
		isLoading: true,
		errors: null,
		googleId: Cookies.get("googleId"),
	};

	getQuotes() {
		Axios.get("/api/goals")
			.then((response) => {
				this.setState({
					goals: response.data,
					isLoading: false,
				});
			})
			.catch((error) => this.setState({ error, isLoading: false }));
	}

	componentDidMount() {
		this.getQuotes();
	}

	render() {
		const { isLoading, goals } = this.state;
		let GOALS = "";
		const googleId = this.state.googleId;

		if (googleId === process.env.REACT_APP_GOOGLE_ID) {
			GOALS = (
				<div className={Layout.container}>
					<Helmet>
						<title>Goals</title>
					</Helmet>
					<h1>2021</h1>
					<br />
					<div className="tab-space">
						<ul>
							{!isLoading ? (
								goals.map((fields) => {
									const { _id, goal } = fields; // Getting the fields in a const as it is neater and more informative.
									return (
										<div key={_id}>
											<li>{goal}</li>
										</div>
									);
								})
							) : (
								<p>Loading...</p>
							)}
						</ul>
					</div>
					<br />
					<br />

					{/* Back to home button. */}

					<hr className="half-rule" />
					<a href="/home" className="link">
						← Back to home
					</a>
				</div>
			);
		} else {
			GOALS = (
				<div align="center">
					<p>Sorry, mate. This page doesn't exist.</p>
				</div>
			);
		}

		return <>{GOALS}</>;
	}
}
