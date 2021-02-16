const mongoose = require("mongoose");
const { Schema } = mongoose;

const usersSchema = new Schema(
	{
    email: { 
			type: String, 
			required: true, 
			unique: true, 
			match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	},
		password: { type: String, required: true },
		date: { type: Date, default: Date.now }, // Inserting current date.
	},
	{
		versionKey: false, // Removing Mongoose's "__v" field. This keys value contains the internal revision of the document.
	}
);

mongoose.pluralize(null);
mongoose.model("users", usersSchema);