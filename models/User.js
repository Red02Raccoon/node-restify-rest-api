const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const UserSchema = new mongoose.Schema({
  password: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true,
    trim: true
  },
});

UserSchema.plugin(timestamp);

const User = mongoose.model('User', UserSchema);
module.exports = User;