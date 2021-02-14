const mongoose = require("mongoose");
const { Schema } = mongoose;

const qSchema = new Schema(
	{
		quote: String,
		author: String,
		source: String,
	},
	{
		versionKey: false, // Removing Mongoose's "__v" field. This keys value contains the internal revision of the document.
	}
);

mongoose.pluralize(null);
mongoose.model("quotes", qSchema);
