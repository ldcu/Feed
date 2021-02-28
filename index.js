const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// Read .env files.

require("dotenv").config();

// Import models.

require('./models/yt');
require('./models/feed');
require('./models/activity');
require('./models/quotes');
require('./models/goals');
require('./models/users');
require('./models/links');

// Initiate MongoDB connection.

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

// Import routes.

require('./routes/yt-routes')(app);
require('./routes/feed-routes')(app);
require('./routes/activity-routes')(app);
require('./routes/quotes-routes')(app);
require('./routes/goals-routes')(app);
require('./routes/users-routes')(app);
require('./routes/links-routes')(app);

// Choose port & start the server.

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Mixing it up on port ${PORT}.`)
})

// This is to serve up the React files once it's in production. (1, 2)

// 1. Serve static files from the React frontend app

app.use(express.static(path.join(__dirname, 'client/build')))

// 2. Anything that doesn't match the above, send back index.html

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})