const mongoose = require('mongoose');
const Quotes = mongoose.model('quotes');

module.exports = (app) => {

	app.get(`/api/quotes`, async (req, res) => {
		let quotes = await Quotes.aggregate([{ $sample: { size: 1 } }]);
		// let quotes = await Quotes.find();
		return res.status(200).send(quotes);
	});

	app.post(`/api/quotes`, async (req, res) => {
		let quotes = await Quotes.create(req.body);
		return res.status(201).send({
			error: false,
			quotes
		})
	})

	app.put(`/api/quotes/:id`, async (req, res) => {
		const { id } = req.params;

		let quotes = await Quotes.findByIdAndUpdate(id, req.body);

		return res.status(202).send({
			error: false,
			quotes
		})

	});

	app.delete(`/api/quotes/:id`, async (req, res) => {
		const { id } = req.params;

		let quotes = await Quotes.findByIdAndDelete(id);

		return res.status(202).send({
			error: false,
			quotes
		})

	})

}