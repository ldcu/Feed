const mongoose = require("mongoose");
const Goals = mongoose.model("goals");
const checkAuth = require('../middleware/check-auth');

module.exports = (app) => {
	app.get(`/api/goals`, checkAuth, async (req, res) => {
		let goals = await Goals.find().sort({ date: -1 });
		// let goals = await Goals.find();
		return res.status(200).send(goals);
	});

	app.post(`/api/goals`, checkAuth, async (req, res) => {
		let goals = await Goals.create(req.body);
		return res.status(201).send({
			error: false,
			goals,
		});
	});

	app.put(`/api/goals/:id`, checkAuth, async (req, res) => {
		const { id } = req.params;

		let goals = await Goals.findByIdAndUpdate(id, req.body);

		return res.status(202).send({
			error: false,
			goals,
		});
	});

	app.delete(`/api/goals/:id`, checkAuth, async (req, res) => {
		const { id } = req.params;

		let goals = await Goals.findByIdAndDelete(id);

		return res.status(202).send({
			error: false,
			goals,
		});
	});
};
