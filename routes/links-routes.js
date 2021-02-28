const mongoose = require("mongoose");
const Links = mongoose.model("links");
const checkAuth = require('../middleware/check-auth'); // checkAuth function is for making the API to work only with an "access_token".

module.exports = (app) => {
	app.get(`/api/links`, checkAuth, async (req, res) => {
		let links = await Links.find().sort({ date: -1 });
		// let links = await Links.find();
		return res.status(200).send(links);
	});

	app.post(`/api/links`, checkAuth, async (req, res) => {
		let links = await Links.create(req.body);
		return res.status(201).send({
			error: false,
			links,
		});
	});

	app.put(`/api/links/:id`, checkAuth, async (req, res) => {
		const { id } = req.params;

		let links = await Links.findByIdAndUpdate(id, req.body);

		return res.status(202).send({
			error: false,
			links,
		});
	});

	app.delete(`/api/links/:id`, checkAuth, async (req, res) => {
		const { id } = req.params;

		let links = await Links.findByIdAndDelete(id);

		return res.status(202).send({
			error: false,
			links,
		});
	});
};
