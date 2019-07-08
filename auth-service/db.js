const mongoose = require('mongoose');

const { UserModel, UserProfile } = require('./user-model');

const dbInterface = client => {
  //retrieve user details from the db
  getUserDetails = username => {
    return new Promise((resolve, reject) => {
      UserModel.find({ username: username }, (err, user) => {
        if (err || !user || user.length === 0) {
          reject(Error('No user found'));
        } else {
          resolve(user);
        }
      });
    });
  };

  return {
    getUserDetails: getUserDetails
  };
};

module.exports.connect = conString => {
  return new Promise((resolve, reject) => {
    mongoose.connect(conString).then(res => {
      resolve(dbInterface(mongoose));
    });
  });
};
