const mongoose = require("mongoose");
const Feed = mongoose.model("feed");
const checkAuth = require("../middleware/check-auth"); // checkAuth function is for making the API to work only with an "access_token".

module.exports = (app) => {
  app.get("/api/feed/:id?", checkAuth, function (req, res) {
	//Pagination For number Of receords on page
	if (req.params.id) {
	  //Case For Counting Number OF Users
	  Feed.find({})
		.count()
		.then((data) => {
		  res.status(200).send({
			total: data,
		  });
		})
		.catch((err) => {
		  res.status(400).send({
			err: err,
		  });
		});
	}
  });

  app.post("/api/feed/", checkAuth, function (req, res) {
	const pagination = req.body.pagination ? parseInt(req.body.pagination) : 10;
	//PageNumber From which Page to Start
	const pageNumber = req.body.page ? parseInt(req.body.page) : 1;
	Feed.find({})
	  //skip takes argument to skip number of entries
	  .sort({ id: 1 })
	  .skip((pageNumber - 1) * pagination)
	  //limit is number of Records we want to display
	  .limit(pagination)
	  .sort({ date: -1 })
	  .then((data) => {
		res.status(200).send({
		  posts: data,
		});
	  })
	  .catch((err) => {
		res.status(400).send({
		  err: err,
		});
	  });
  });

  app.post(`/api/feed/post`, checkAuth, async (req, res) => {
	let feed = await Feed.create(req.body);
	return res.status(201).send({
	  error: false,
	  feed,
	});
  });

  app.put(`/api/feed/:id`, checkAuth, async (req, res) => {
	const { id } = req.params;

	let feed = await Feed.findByIdAndUpdate(id, req.body);

	return res.status(202).send({
	  error: false,
	  feed,
	});
  });

  app.delete(`/api/feed/:id`, checkAuth, async (req, res) => {
	const { id } = req.params;

	let feed = await Feed.findByIdAndDelete(id);

	return res.status(202).send({
	  error: false,
	  feed,
	});
  });
};
