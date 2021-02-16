import Axios from "axios";
import React from "react";
import { Helmet } from "react-helmet";
import Layout from "../css/layout.module.css";

const headers = {
	headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
}

export default class Home extends React.Component {
	state = {
		quotes: [],
		isLoading: true,
		errors: null,
	};

	componentDidMount() {
		Axios.get("/api/quotes", headers)
		.then((response) => {
			this.setState({
				quotes: response.data,
				isLoading: false,
			});
		})
		.catch((error) => this.setState({ error, isLoading: false }));
	}

	render() {
		const day = 21,
			month = "Apr",
			year = 1996;

		let age = calculateAge(`${month} ${day} ${year}`);
		let left = timeLeft(`${month} ${day} ${year}`);

		const { isLoading, quotes } = this.state;

		return (
			<div className={Layout.container}>
			<Helmet>
				<title>Home</title>
			</Helmet>
			<h1>Home</h1>
			<br />
			<div className="tab-space">
				{!isLoading ? (
					quotes.map((fields) => {
						const { _id, quote, author, source } = fields; // Getting the fields in a const as it is neater and more informative.
						return (
							<div key={_id}>
								"{quote}"
								<br />
								<br />
								{author} in {source}
							</div>
						);
					})
				) : (
					<p>Loading...</p>
				)}
			</div>
			<br />
			<h1>About you</h1>
			<br />
			{/* <li className="tab-space">There are {rows} posts made on <a rel="noopener noreferrer" className="link" href="/feed">Feed</a>.</li> */}
			<h5>Age</h5>
			<ul>
				<li>I'm {age} old.</li>
				<li>In {left} I'll be one hundred years old.</li>
			</ul>
		</div>
		)
	}
}

function calculateAge(birthday) {
	// Calculate age.

	let today = new Date(),
		dob = new Date(birthday), // Birthay already has a value.
		diff = today.getTime() - dob.getTime(), // Difference in milliseconds.
		years = Math.floor(diff / 31556736000), // Convert milliseconds into years. // Milliseconds in a year 1000*24*60*60*365.24 = 31556736000.
		days_diff = Math.floor((diff % 31556736000) / 86400000), // 1 day has 86400000 milliseconds.
		months = Math.floor(days_diff / 30.4167), // 1 month has 30.4167 days.
		days = Math.floor(days_diff % 30.4167);

	return `${years} years, ${months} months, ${days} days`;
}

function timeLeft() {
	// Calculate time left for age.

	let today = new Date("21 Apr 2096"),
		dob = new Date(), // Birthay already has a value.
		diff = today.getTime() - dob.getTime(), // Difference in milliseconds.
		years = Math.floor(diff / 31556736000), // Convert milliseconds into years. // Milliseconds in a year 1000*24*60*60*365.24 = 31556736000.
		days_diff = Math.floor((diff % 31556736000) / 86400000), // 1 day has 86400000 milliseconds.
		months = Math.floor(days_diff / 30.4167), // 1 month has 30.4167 days.
		days = Math.floor(days_diff % 30.4167);

	return `${years} years, ${months} months, ${days} days`;
}
