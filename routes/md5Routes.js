const mongoose = require('mongoose');
const MD5 = mongoose.model('md5');

module.exports = (app) => {

	const md5 = require('md5');

	app.get(`/api/md5`, async (req, res) => {
		let md5 = await MD5.find().sort({date:-1});
		return res.status(200).send(md5);
	});

	app.post(`/api/md5`, async (req, res) => {
		const obj = JSON.parse(JSON.stringify(req.body));
		const hex_md5 = md5(obj[0].content)
		let string = await MD5.create(req.body);
		let hash = await MD5.updateOne({content: obj[0].content, hash: null}, {$set: {"hash":hex_md5}});

		return res.status(201).send({
			error: false,
			string,
			hex_md5
		})
	})

	app.put(`/api/md5/:id`, async (req, res) => {
		const {id} = req.params;

		let md5 = await MD5.findByIdAndUpdate(id, req.body);

		return res.status(202).send({
			error: false,
			md5
		})

	});

	app.delete(`/api/md5/:id`, async (req, res) => {
		const {id} = req.params;

		let md5 = await MD5.findByIdAndDelete(id);

		return res.status(202).send({
			error: false,
			md5
		})

	})
	
}