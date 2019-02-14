const restify = require('restify');
const mongoose = require('mongoose');
const rjwt = require('restify-jwt-community');

const config = require('./config');
const customersRoute = require('./routes/customers');
const usersRoute = require('./routes/users');

const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());

// Protect routes
server.use(rjwt({ secret: config.JWT_SECRET}).unless(['/auth']))

// 
server.listen(config.PORT, () => {
  mongoose.set('useFindAndModify', false); // fix bug in server console
  mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
});

// 
const db = mongoose.connection;
db.on('error', err => console.log(err));
db.once('open', () => {
  customersRoute(server);
  usersRoute(server);
  console.log(`Server started on port: ${config.PORT}`)
});