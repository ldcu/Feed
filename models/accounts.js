const mongoose = require("mongoose");
const { Schema } = mongoose;

const accountsSchema = new Schema(
	{
		name: String,
		email: String,
		role: String,
		googleId: String,
		date: { type: Date, default: Date.now }, // Inserting current date.
	},
	{
		versionKey: false, // Removing Mongoose's "__v" field. This keys value contains the internal revision of the document.
	}
);

mongoose.pluralize(null);
mongoose.model("accounts", accountsSchema);
