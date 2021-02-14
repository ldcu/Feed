import React, { Component } from "react";
import { Helmet } from "react-helmet";
import Layout from "../css/layout.module.css";
import Axios from "axios";
import Cookies from "js-cookie";

class Yt extends Component {
	state = {
		links: [],
		isLoading: true,
		errors: null,
		googleId: Cookies.get("googleId"),
	};

	getQuotes() {
		Axios.get("/api/yt")
			.then((response) => {
				this.setState({
					links: response.data,
					isLoading: false,
				});
			})
			.catch((error) => this.setState({ error, isLoading: false }));
	}

	componentDidMount() {
		this.getQuotes();
	}

	render() {
		const { isLoading, links } = this.state;
		let YT = "";
		const googleId = this.state.googleId;

		if (googleId === process.env.REACT_APP_GOOGLE_ID) {
			YT = (
				<div className={Layout.container}>
					<Helmet>
						<title>YT</title>
					</Helmet>
					<h1>Channels</h1>
					<br />
					<div className="tab-space">
						<ol>
							{!isLoading ? (
								links.map((fields) => {
									const { _id, link, name } = fields; // Getting the fields in a const as it is neater and more informative.
									return (
										<div key={_id} className="tab-space">
											<li>
												<a
													href={link}
													target="_blank"
													rel="noopener noreferrer"
													className="link"
												>
													{name}
												</a>
											</li>
										</div>
									);
								})
							) : (
								<p>Loading...</p>
							)}
						</ol>
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
			YT = (
				<div align="center">
					<p>Sorry, mate. This page doesn't exist.</p>
				</div>
			);
		}

		return <>{YT}</>;
	}
}

export default Yt;
