import React from "react";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

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
			<Pagination.Item key={i}>
				<Link className="link" to="#" onClick={() => props.nextPage(i)}>
					{i}
				</Link>
			</Pagination.Item>
		);
	}

	return (
		<Pagination size="sm" className="customPagination">
			{props.currentPage > 10 && (
				<Pagination.Item>
					<Link className="link" to="#" onClick={() => props.tenChange(props.currentPage, -1)}>- 10</Link>
				</Pagination.Item>
			)}
			{pageLinks}
			{props.currentPage + 10 < props.pages && (
				<Pagination.Item>
					<Link className="link" to="#" onClick={() => props.tenChange(props.currentPage, 1)}>+ 10</Link>
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
			alert: false // Alert to show if text is invalid.
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
		if (isposOrneg > 0) finalPage = pageNumber + 10;
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
		if (isposOrneg > 0) finalPage = pageNumber + 100;
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
				<div className="container">
					<Helmet>
						<title>Feed</title>
					</Helmet>
					<Container>
						<h1>Feed</h1>
						<br />
						<form id="feed-form" onSubmit={this.handleSubmit.bind(this)} method="POST" elevation={0}>
							<Form.Control
								as="textarea"
								rows="10"
								name="feed"
								elevation={0}
								value={this.state.content}
								onChange={this.onMessageChange.bind(this)}
								className="textarea"
								placeholder="What's on your mind?"
							/>
							<br />

							<div align="right">
								<Button type="submit" size="lg">Send</Button>
							</div>
							<br />
						</form>

						{/* Displaying alert if no text is entered. 'onClose' sets the 'alert' to 'false' so the button would close. */}
						{this.state.alert && (
							<Alert variant="danger" onClose={() => this.setState({ alert: false })} dismissible>
								<Alert.Heading>Oi, mate! You got a warning!</Alert.Heading>
								<p>Type something.</p>
							</Alert>
						)}

						{/* Pagination. */}
						{this.state.totalFeed > 10 && (
							<PaginationPage
								pages={this.state.totalFeed / 10}
								nextPage={this.nextpage}
								currentPage={this.state.currentPage}
								tenChange={this.tenChange}
								hundreadChange={this.hundreadChange}
							></PaginationPage>
						)}

						{/* Posts. */}
						{this.state.data.map((fields) => {
							const { _id, content, date } = fields;
							return (
								<React.Fragment key={_id}>
									<ListGroup>
										<ListGroup.Item className="post">
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

	// As you type, set the text to the 'content' element.
	onMessageChange(event) {
		this.setState({ content: event.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();

		if (this.state.content) {
			// If there is text, send it over.
			this.dataRequest("/api/feed/", "POST", this.state) // Sending the content via POST.
				.then((response) => {
					if (!response.error) {
						this.setState({ content: "", alert: false }); // Setting alert
						this.componentDidMount(); // Refresh component after sending the content so you'd have the latest record displaying on the page.
					} else if (response.error) {
						alert("Message failed to send."); // Pop-up for when it fails to send the message.
					}
				});
		} else {
			// If there's no text being sent, set the 'alert' to 'true'.
			this.setState({ alert: true });
		}
	}
}

function formatDate(string) {
	// Format date into DD Mon YYYY, HH:MM:SS.
	var options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", weekday: "long", };
	return new Date(string).toLocaleDateString("en-GB", options);
}

export default Feed;
