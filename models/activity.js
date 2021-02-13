const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
	{
		m: { type: String },
		night_eating: { type: String }, // 8PM
		soda: { type: String },
		bread: { type: String },
		number_of_pages_i_read: { type: Number },
		book_and_author: { type: String },
		minutes_i_spent_learning: { type: Number },
		learning_what: { type: String },
		date: { type: Date, default: Date.now } // Inserting current date.
	},
	{
		versionKey: false, // Removing Mongoose's "__v" field. This keys value contains the internal revision of the document.
	}
);

mongoose.pluralize(null);
mongoose.model("activity", productSchema);
