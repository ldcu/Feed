import React from "react";
import { Helmet } from "react-helmet";
import Axios from "axios";
import Bottom from "../sections/bottom"

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

export default class Goals extends React.Component {
	state = {
		links: [],
		isLoading: true,
		errors: null,
	};

	getGoals() {
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
		this.getGoals();
	}

	render() {
		const { isLoading, links } = this.state;

		return (
			<>
			<div className="container">
			<Helmet>
				<title>Links</title>
			</Helmet>
			<h1>Links</h1>
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
		
		{/* Page footer. */}
		<Bottom />
		</>
		)
	}
}
