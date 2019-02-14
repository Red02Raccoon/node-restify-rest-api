const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const auth = require('../auth');
const config = require('../config');

module.exports = server => {
  // create user
  server.post('/register', (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({
      email,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async(err, hash) => {
        user.password = hash;
        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch(e) {
          return next(new errors.InvalidContentError(e.message));
        }
      });
    })
  });

  // auth user
  server.post('/auth', async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const user = await auth.authFn(email, password);

      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: '15m'
      });

      const { iat, ext } = jwt.decode(token);

      res.send({ iat, ext, token })
      next();
    } catch(e) {
      return next(new errors.UnauthorizedError(e));
    }

  })
}