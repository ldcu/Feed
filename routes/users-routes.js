const mongoose = require("mongoose");
const Users = mongoose.model("users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
	app.get(`/api/users`, async (req, res) => {
		let accounts = await Users.find();
		return res.status(200).send(accounts);
	});

	app.post("/api/signup", (req, res, next) => {
		Users.find({ email: req.body.email })
			.exec()
			.then((user) => {
				if (user.length >= 1) {
					return res.status(409).json({
						message: "That email is already registered.",
					});
				} else {
					bcrypt.hash(req.body.password, 10, (err, hash) => {
						if (err) {
							return res.status(500).json({
								error: err,
							});
						} else {
							const user = new Users({
								_id: new mongoose.Types.ObjectId(),
								email: req.body.email,
								password: hash,
							});
							user
								.save()
								.then((result) => {
									console.log(result);
									res.status(201).json({
										message: "New bloke added.",
									});
								})
								.catch((err) => {
									console.log(err);
									res.status(500).json({
										error: err,
									});
								});
						}
					});
				}
			});
	});

	app.post("/api/login", (req, res, next) => {
		Users.find({ email: req.body.email })
			.exec()
			.then((user) => {
				if (user.length < 1) {
					return res.status(401).json({
						message: "Oi, mate. Not good.",
					});
				}
				bcrypt.compare(req.body.password, user[0].password, (err, result) => {
					if (err) {
						return res.status(401).json({
							message: "Oi, mate. Not good.",
						});
					}
					if (result) {
						const token = jwt.sign(
							{
								email: user[0].email,
								userId: user[0]._id,
							},
							process.env.JWT_KEY,
							{
								expiresIn: "1h",
							}
						);
						return res.status(200).json({
							message: "Here you go, sir.",
							access_token: token,
						});
					}
					res.status(401).json({
						message: "Oi, mate. Not good.",
					});
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					error: err,
				});
			});
	});
};
