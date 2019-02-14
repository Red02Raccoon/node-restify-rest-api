const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = mongoose.model('User');

exports.authFn = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // get user
      const user = await User.findOne({ email });

      // match user?
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw new Error;
        if(isMatch) {
          resolve(user)
        } else {
          reject('auth failed');
        }
      })

    } catch(e) {
      // email not found
      reject('auth failed');
    }
  })
}