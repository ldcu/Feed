const mongoose = require("mongoose");
const Accounts = mongoose.model("accounts");

module.exports = (app) => {
	app.get(`/api/accounts`, async (req, res) => {
		let accounts = await Accounts.find();
		return res.status(200).send(accounts);
	});

	app.post(`/api/accounts`, async (req, res) => {
		let accounts = await Accounts.create(req.body);
		return res.status(201).send({
			error: false,
			accounts,
		});
	});

	app.put(`/api/accounts/:id`, async (req, res) => {
		const { id } = req.params;

		let accounts = await Accounts.findByIdAndUpdate(id, req.body);

		return res.status(202).send({
			error: false,
			accounts,
		});
	});

	app.delete(`/api/accounts/:id`, async (req, res) => {
		const { id } = req.params;

		let accounts = await Accounts.findByIdAndDelete(id);

		return res.status(202).send({
			error: false,
			accounts,
		});
	});
};
