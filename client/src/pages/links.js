import React from "react";
import { Helmet } from "react-helmet";
import Axios from "axios";
import Bottom from "../sections/bottom"

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
				<title>Goals</title>
			</Helmet>
			<h1>2021</h1>
			<br />
			<div className="tab-space">
				<ul>
					{!isLoading ? (
						links.map((fields) => {
							const { _id, name, link } = fields; // Getting the fields in a const as it is neater and more informative.
							return (
								<div key={_id}>
									<li>{name} - {link}</li>
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
