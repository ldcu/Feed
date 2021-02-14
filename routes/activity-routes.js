const mongoose = require('mongoose');
const Activity = mongoose.model('activity');

module.exports = (app) => {

	app.get(`/api/activity`, async (req, res) => {
		let activity = await Activity.find().sort({date:-1});
		return res.status(200).send(activity);
	});

	app.get(`/api/activity/:id`, async (req, res) => {
		const {id} = req.params;

		let activity = await Activity.findById(id, req.body);
		return res.status(200).send(activity);
	});

	app.post(`/api/activity`, async (req, res) => {
		let activity = await Activity.create(req.body);
		return res.status(201).send({
			error: false,
			activity
		})
	})

	app.put(`/api/activity/:id`, async (req, res) => {
		const {id} = req.params;

		let activity = await Activity.findByIdAndUpdate(id, req.body);

		return res.status(202).send({
			error: false,
			activity
		})

	});

	app.delete(`/api/activity/:id`, async (req, res) => {
		const {id} = req.params;

		let activity = await Activity.findByIdAndDelete(id);

		return res.status(202).send({
			error: false,
			activity
		})

	})
	
}