const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
		content: { type: String },
		hash: { type: String },
		date: { type: Date, default: Date.now } // Inserting current date.
	}, {
		versionKey: false, // Removing Mongoose's "__v" field. This keys value contains the internal revision of the document.
})

mongoose.pluralize(null);
mongoose.model('md5', productSchema);