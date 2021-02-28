import Axios from "axios";
import React from "react";
import { Helmet } from "react-helmet";

const processString = require("react-process-string"); // Used for processing the string.

// This is for making the domains (ex.: example.com) clickable. Otherwise you can't click on a link from a text.
let clickable_link = [
	{
		regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |,|$|\.|\))/gim, // This is for link starting with 'http' or 'https'.
		fn: (key, result) => (
			<span key={key}><a target="_blank" rel="noopener noreferrer" className="link" href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}>{" "}{result[2]}.{result[3]}{result[4]}</a>{""}{result[5]}</span>
		),
	},
	{
		regex: /(\S+)\.([a-z]{2,}?)(.*?)( |,|$|\.|\))/gim, // This is for any word that ends in .com or .something, and starts with anything. Meaning it will turn it into a link.
		fn: (key, result) => (
			<span key={key}><a target="_blank" rel="noopener noreferrer" className="link" href={`http://${result[1]}.${result[2]}${result[3]}`}>{" "}{result[1]}.{result[2]}{result[3]}</a>{""}{result[4]}</span>
		),
	},
];

export default class Home extends React.Component {
	state = {
		quotes: [],
		links: [],
		isLoading: true,
		errors: null,
	};

	getQuotes() {
		Axios.get("/api/quotes", {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			}
		})
		.then((response) => {
			this.setState({
				quotes: response.data,
				isLoading: false,
			});
		})
		.catch((error) => this.setState({ error, isLoading: false }));
	}

	getLinks() {
		Axios.get("/api/links", {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			}
		})
			.then((response) => {
				this.setState({
					links: response.data,
					isLoading: false,
				});
			})
			.catch((error) => this.setState({ error, isLoading: false }));
	}

	componentDidMount() {
		this.getLinks();
		this.getQuotes();
	}

	render() {
		const day = 21,
			month = "Apr",
			year = 1996;

		let age = calculateAge(`${month} ${day} ${year}`);
		let left = timeLeft(`${month} ${day} ${year}`);

		const { isLoading, quotes, links } = this.state;

		return (
			<>
			<div className="container">
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
							<blockquote>
								<p>"{quote}"</p>
								<footer>{author} in <cite title="Source Title">{source}</cite></footer>
							</blockquote>
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
			<div className="tab-space">{age} old.
			<br/><br/> More {left} and I'll be one hundred years old.</div>
			<br/>
			<h1>Saved links</h1>
			<br />
			<div className="tab-space">
				<ul>
					{!isLoading ? (
						links.map((fields) => {
							const { _id, name, link } = fields; // Getting the fields in a const as it is neater and more informative.
							return (
								<div key={_id}>
									<li>{name} {processString(clickable_link)(link)}</li>
								</div>
							);
						})
					) : (
						<p>Loading...</p>
					)}
				</ul>
			</div>
		</div>
		</>
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
