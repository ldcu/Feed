import Axios from "axios";
import React from "react";
import ReactPaginate from "react-paginate";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Layout from "../css/layout.module.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Cookies from "js-cookie";

const processString = require("react-process-string"); // Used for processing the string.

let clickableLink = [
	{
		// 'clickableLink' for identifying links
		regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |,|$|\.|\))/gim, // This is for link starting with 'http' or 'https'.
		fn: (key, result) => (
			<span key={key}>
				<a
					target="_blank"
					rel="noopener noreferrer"
					className="link"
					href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}
				>
					{" "}
					{result[2]}.{result[3]}
					{result[4]}
				</a>{" "}
				{result[5]}
			</span>
		),
	},
	{
		regex: /(\S+)\.([a-z]{2,}?)(.*?)( |,|$|\.|\))/gim, // This is for any word that ends in .com or .something, and starts with anything. Meaning it will turn it into a link.
		fn: (key, result) => (
			<span key={key}>
				<a
					target="_blank"
					rel="noopener noreferrer"
					className="link"
					href={`http://${result[1]}.${result[2]}${result[3]}`}
				>
					{" "}
					{result[1]}.{result[2]}
					{result[3]}
				</a>{" "}
				{result[4]}
			</span>
		),
	},
];

class Feed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			offset: 0,
			data: [],
			perPage: 10, // 10 items per page to be returned.
			currentPage: 0,
			googleId: Cookies.get("googleId"),
		};
		this.handlePageClick = this.handlePageClick.bind(this);
	}

	receivedData() {
		Axios.get(`/api/feed`).then((res) => {
			const data = res.data;
			const slice = data.slice(
				this.state.offset,
				this.state.offset + this.state.perPage
			);
			const postData = slice.map((
				fields // Slicing the data so we can have pagination.
			) => (
				<React.Fragment key={fields._id}>
					<ListGroup >
						<ListGroup.Item
							style={{
								backgroundColor: "#121212",
								color: "#b7b7b7",
								border: "none",
							}}
						>
							{processString(clickableLink)(fields.content)}
							<br />
							<hr className="half-rule" />
							<div align="right">
								<small className="text-muted">{formatDate(fields.date)}</small>
							</div>
						</ListGroup.Item>
					</ListGroup>
					<br />
				</React.Fragment>
			));

			this.setState({
				pageCount: Math.ceil(data.length / this.state.perPage), // Making the pages.

				postData,
			});
		});
	}

	handlePageClick = (e) => {
		const selectedPage = e.selected;
		const offset = selectedPage * this.state.perPage;

		this.setState(
			{
				currentPage: selectedPage,
				offset: offset,
			},
			() => {
				this.receivedData();
			}
		);
	};

	componentDidMount() {
		this.receivedData();
	}

	render() {
		let FEED = "";
		const googleId = this.state.googleId;

		if (googleId === process.env.REACT_APP_GOOGLE_ID) {
			FEED = (
				<>
					<div className={Layout.container}>
						<Helmet>
							<title>Feed</title>
						</Helmet>
						<Container>
							<h1 style={{ color: "#b7b7b7" }}>Feed</h1>
							<br />

							<form
								id="feed-form"
								onSubmit={this.handleSubmit.bind(this)}
								method="POST"
								elevation={0}
							>
								<Form.Control
									as="textarea"
									rows="10"
									name="feed"
									style={{
										backgroundColor: "#121212",
										color: "#b7b7b7",
										boxShadow: "0px 0px 0px white",
										border: "none",
									}}
									elevation={0}
									value={this.state.content}
									onChange={this.onMessageChange.bind(this)}
									className="block"
									placeholder="What's on your mind?"
								/>
								<br />

								<div align="right">
									<Button
										type="submit"
										size="lg"
										style={{
											border: "none",
											boxShadow: "0px 0px 0px white",
											backgroundColor: "#121212",
											color: "#b7b7b7",
										}}
									>
										Send
									</Button>
								</div>
								<br />
							</form>

							<div>
								<ReactPaginate
									previousLabel={"←"}
									nextLabel={"→"}
									breakLabel={"..."}
									breakClassName={"break-me"}
									pageCount={this.state.pageCount}
									marginPagesDisplayed={2}
									pageRangeDisplayed={5}
									onPageChange={this.handlePageClick}
									containerClassName={"pagination"}
									subContainerClassName={"pages pagination"}
									activeClassName={"active"}
								/>

								{this.state.postData}
							</div>
						</Container>
					</div>

					{/* Back to home button. */}

					<hr className="half-rule" />
					<a href="/home" className="link">
						← Back to home
					</a>
				</>
			);
		} else {
			FEED = (
				<div align="center">
					<p>Sorry, mate. This page doesn't exist.</p>
				</div>
			);
		}

		return <>{FEED}</>;
	}

	onMessageChange(event) {
		this.setState({ content: event.target.value });
	}

	handleSubmit(e) {
		e.preventDefault();

		fetch("/api/feed", {
			method: "POST",
			body: JSON.stringify(this.state),
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
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
