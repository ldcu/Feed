const mongoose = require('mongoose');
const {Schema} = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new Schema({
		content: { type: String },
		date: { type: Date, default: Date.now } // Inserting current date.
	}, {
		versionKey: false, // Removing Mongoose's "__v" field. This keys value contains the internal revision of the document.
})

productSchema.plugin(mongoosePaginate);

mongoose.pluralize(null);
mongoose.model('feed', productSchema);