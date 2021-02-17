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

// This is for making the domains (ex.: example.com) clickable. Otherwise you can't click on a link from a text.
let clickableLink = [
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

// Building the pagination.
const PaginationPage = (props) => {
	const pageLinks = [];

	let start = props.currentPage - (props.currentPage % 10);
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

class Feed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [], // API data. The posts.
			currentPage: 0, // Current page.
			totalFeed: 0, // Total posts.
		};
	}

	// Next pages to be shown within pagination menu.
	nextpage = (pageNumber) => {
		this.setState({
			currentPage: pageNumber,
			data: [],
		});
		this.getPosts(pageNumber);
	};

	// If more than 10 pages, show the 10 buttons in the pagination menu.
	tenChange = (pageNumber, isposOrneg) => {
		var finalPage;
		if (isposOrneg > 0)
			finalPage = pageNumber + 10;
		else finalPage = pageNumber - 10;
		this.setState({
			currentPage: finalPage,
			data: [],
		});
		this.getPosts(finalPage);
	};

	// If more than 100 pages, show the 100 buttons in the pagination menu.
	hundreadChange = (pageNumber, isposOrneg) => {
		var finalPage;
		if (isposOrneg > 0)
			finalPage = pageNumber + 100;
		else finalPage = pageNumber - 100;
		this.setState({
			currentPage: finalPage,
			data: [],
		});
		this.getPosts(finalPage);
	};

	// Function for the API requests, headers and what needs to be included.
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

	// Paginating the results. Getting posts.
	getPosts = (currentPage) => {
		this.dataRequest("/api/feed/?page=" + currentPage + "&limit=10", "GET")
			.then((data) => {
				this.setState({
					data: data.posts,
				});
			})
			.catch((err) => {
				console.log("Error fetching posts, mate. ", err);
			});
	};

	// Get total number of posts.
	componentDidMount() {
		this.dataRequest("/api/feed/?page=1", "GET").then((data) => {
			this.setState(
				{
					totalFeed: data.total,
				},
				() => this.getPosts(this.state.currentPage)
			);
		});
	}

	render() {

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
								pages={this.state.totalFeed / 10}
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

		this.dataRequest("/api/feed/", "POST", this.state) // Sending the content via POST.
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
	var options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", weekday: "long", };
	return new Date(string).toLocaleDateString("en-GB", options);
}

export default Feed;
