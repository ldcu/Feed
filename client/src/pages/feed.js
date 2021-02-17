import React from "react";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Layout from "../css/layout.module.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

const processString = require("react-process-string"); // Used for processing the string.

let clickableLink = [
	{
		// This is for making the domains (ex.: example.com) clickable. Otherwise you can't click on a link from a text.
		regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |,|$|\.|\))/gim, // This is for link starting with 'http' or 'https'.
		fn: (key, result) => (
			<span key={key}><a target="_blank" rel="noopener noreferrer" className="link" href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}>{" "}{result[2]}.{result[3]}{result[4]}</a>{" "}{result[5]}</span>
		),
	},
	{
		regex: /(\S+)\.([a-z]{2,}?)(.*?)( |,|$|\.|\))/gim, // This is for any word that ends in .com or .something, and starts with anything. Meaning it will turn it into a link.
		fn: (key, result) => (
			<span key={key}><a target="_blank" rel="noopener noreferrer" className="link" href={`http://${result[1]}.${result[2]}${result[3]}`}>{" "}{result[1]}.{result[2]}{result[3]}</a>{" "}{result[4]}</span>
		),
	},
];

const PaginationPage = (props) => {
	const pageLinks = [];

	let start = props.currentPage - (props.currentPage % 10);
	if (start <= 0) start = 1;
	for (let i = start; i <= start + 11 && i <= props.pages; i++) {
		pageLinks.push(
			<Pagination.Item>
				<Link className="link" onClick={() => props.nextPage(i)}>
					{i}
				</Link>
			</Pagination.Item>
		);
	}

	return (
		<Pagination size="sm" className="customPagination">
			{props.currentPage > 10 && (
				<Pagination.Item>
					<Link className="link" onClick={() => props.tenChange(props.currentPage, -1)}>- 10</Link>
				</Pagination.Item>
			)}
			{pageLinks}
			{props.currentPage + 10 < props.pages && (
				<Pagination.Item>
					<Link className="link" onClick={() => props.tenChange(props.currentPage, 1)}>+ 10</Link>
				</Pagination.Item>
			)}
		</Pagination>
	);
};

const headers = {
	headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
};

class Feed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			currentPage: 1,
			totalFeed: 0,
		};
	}

	nextpage = (pageNumber) => {
		this.setState({
			currentPage: pageNumber,
			data: [],
		});
		this.getUsers(pageNumber);
	};

	tenChange = (pageNumber, isposOrneg) => {
		var finalPage;
		if (isposOrneg > 0)
			//+10 clicked
			finalPage = pageNumber + 10;
		//-10 clicked
		else finalPage = pageNumber - 10;
		this.setState({
			currentPage: finalPage,
			data: [],
		});
		this.getUsers(finalPage);
	};

	hundreadChange = (pageNumber, isposOrneg) => {
		var finalPage;
		if (isposOrneg > 0)
			//+100 clicked
			finalPage = pageNumber + 100;
		//-100 Clicked
		else finalPage = pageNumber - 100;
		this.setState({
			currentPage: finalPage,
			data: [],
		});
		this.getUsers(finalPage);
	};

	dataRequest = (URL, methodType, params) => {
		return fetch(URL, {
			method: methodType,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
			body: JSON.stringify(params),
		})
			.then((data) => {
				return data.json();
			})
			.catch((err) => {
				return err;
			});
	};

	getUsers = (currentPage) => {
		console.log("Rendering Inside GetUsers");
		const queryParams = {};
		queryParams["page"] = currentPage; //Page Number
		queryParams["pagination"] = 10; //Number Of records on Page
		this.dataRequest("/api/feed", "POST", queryParams)
			.then((data) => {
				console.log("Data FEtched ", data);
				this.setState({
					data: data.users,
				});
			})
			.catch((err) => {
				console.log("Error In Fetching Users ", err);
			});
	};

	getUsersCount = () => {
		//Passing /1 as Backend Uses same query so if argument then it will return count
		this.dataRequest("/api/feed/1", "GET").then((data) => {
			this.setState(
				{
					totalFeed: data.total,
				}, //call is for first page records only
				() => this.getUsers(this.state.currentPage)
			);
		});
	};

	componentDidMount() {
		this.getUsersCount();
	}

	render() {
		let numberOfPages = 0;
		if (this.state.totalFeed % 10 === 0)
			numberOfPages = Math.floor(this.state.totalFeed / 10);
		else numberOfPages = Math.floor(this.state.totalFeed / 10) + 1;

		return (
			<>
				<div className={Layout.container}>
					<Helmet>
						<title>Feed</title>
					</Helmet>
					<Container>
						<h1 style={{ color: "#b7b7b7" }}>Feed</h1>
						<br />

						<form id="feed-form" onSubmit={this.handleSubmit.bind(this)} method="POST" elevation={0}>
							<Form.Control
								as="textarea"
								rows="10"
								name="feed"
								style={{ backgroundColor: "#121212", color: "#b7b7b7", boxShadow: "0px 0px 0px white", border: "none",}}
								elevation={0}
								value={this.state.content}
								onChange={this.onMessageChange.bind(this)}
								className="block"
								placeholder="What's on your mind?"
							/>
							<br />

							<div align="right">
								<Button type="submit" size="lg" style={{ border: "none", boxShadow: "0px 0px 0px white", backgroundColor: "#121212", color: "#b7b7b7", }}>Send</Button>
							</div>
							<br />
						</form>

						{this.state.totalFeed > 10 && (
							<PaginationPage
								pages={numberOfPages}
								nextPage={this.nextpage}
								currentPage={this.state.currentPage}
								tenChange={this.tenChange}
								hundreadChange={this.hundreadChange}
							></PaginationPage>
						)}

						{this.state.data.map((fields) => {
							const { _id, content, date } = fields;
							return (
								<React.Fragment key={_id}>
									<ListGroup>
										<ListGroup.Item style={{ backgroundColor: "#121212", color: "#b7b7b7", border: "none", }} >
											{processString(clickableLink)(content)}
											<br />
											<hr className="half-rule" />
											<div align="right">
												<small className="text-muted">
													{formatDate(fields.date)}
												</small>
											</div>
										</ListGroup.Item>
									</ListGroup>
									<br />
								</React.Fragment>
							);
						})}
					</Container>
				</div>

				{/* Back to home button. */}

				<hr className="half-rule" />
				<a href="/home" className="link">
					← Back to home
				</a>
			</>
		);
	}

	onMessageChange(event) {
		this.setState({ content: event.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();

		fetch("/api/feed/post", {
			method: "POST",
			body: JSON.stringify(this.state),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		})
			.then((response) => response.json())
			.then((response) => {
				if (!response.error) {
					// alert("Message Sent."); // Pop-up that let's you know the content was successfully submitted.
					this.setState({ content: "" });
					// window.location.reload() // Refresh page.
					this.componentDidMount(); // Refresh component after sending the content so you'd have the latest record displaying on the page.
				} else if (response.error) {
					alert("Message failed to send."); // Pop-up for when it fails to send the message.
				}
			});
	}
}

function formatDate(string) {
	// Format date into DD Mon YYYY, HH:MM:SS.
	var options = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
		weekday: "long",
	};
	return new Date(string).toLocaleDateString("en-GB", options);
}

export default Feed;
