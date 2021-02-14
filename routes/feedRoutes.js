const mongoose = require('mongoose');
const Feed = mongoose.model('feed');

module.exports = (app) => {

	app.get(`/api/feed`, async (req, res) => {
		let feed = await Feed.find().sort({ date: -1 });
		return res.status(200).send(feed);
	});

	app.get(`/api/feed/count`, async (req, res) => {
		let feed = await Feed.estimatedDocumentCount();
		return res.status(200).send({
			error: false,
			feed
		});
	});

	app.post(`/api/feed`, async (req, res) => {
		let feed = await Feed.create(req.body);
		return res.status(201).send({
			error: false,
			feed
		})
	})

	app.put(`/api/feed/:id`, async (req, res) => {
		const { id } = req.params;

		let feed = await Feed.findByIdAndUpdate(id, req.body);

		return res.status(202).send({
			error: false,
			feed
		})

	});

	app.delete(`/api/feed/:id`, async (req, res) => {
		const { id } = req.params;

		let feed = await Feed.findByIdAndDelete(id);

		return res.status(202).send({
			error: false,
			feed
		})

	})

}