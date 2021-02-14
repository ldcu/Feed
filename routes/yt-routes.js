const mongoose = require("mongoose");
const Yt = mongoose.model("yt");

module.exports = (app) => {
	app.get(`/api/yt`, async (req, res) => {
		let yt = await Yt.find().collation({ locale: "en" }).sort({ name: 1 });
		return res.status(200).send(yt);
	});

	app.post(`/api/yt`, async (req, res) => {
		let yt = await Yt.create(req.body);
		return res.status(201).send({
			error: false,
			yt,
		});
	});

	app.put(`/api/yt/:id`, async (req, res) => {
		const { id } = req.params;

		let yt = await Yt.findByIdAndUpdate(id, req.body);

		return res.status(202).send({
			error: false,
			yt,
		});
	});

	app.delete(`/api/yt/:id`, async (req, res) => {
		const { id } = req.params;

		let yt = await Yt.findByIdAndDelete(id);

		return res.status(202).send({
			error: false,
			yt,
		});
	});
};
