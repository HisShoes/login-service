const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  username: String,
  firstName: String,
  lastName: String,
  passwordHash: String,
  passwordSalt: String
});

const UserProfile = function(user) {
  this.email = user.email;
  this.firstName = user.firstName;
  this.lastName = user.lastName;
};

module.exports.UserModel = mongoose.model('User', UserSchema);

module.exports.UserProfile = UserProfile;
