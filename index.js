const restify = require('restify');
const mongoose = require('mongoose');

const config = require('./config');
const customersRoute = require('./routes/customers');

const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

// 
server.listen(config.PORT, () => {
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
});

// 
const db = mongoose.connection;
db.on('error', err => console.log(err));
db.once('open', () => {
  customersRoute(server);
  console.log(`Server started on port: ${config.PORT}`)
});