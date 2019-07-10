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

  createUser = (email, username, firstName, lastName, passHash, passSalt) => {
    return new Promise((resolve, reject) => {
      if (
        !email ||
        !username ||
        !firstName ||
        !lastName ||
        !passHash ||
        !passSalt
      ) {
        reject(Error('Missing fields'));
      } else {
        const newUser = UserModel({
          email: email,
          username: username,
          firstName: firstName,
          lastName: lastName,
          passwordHash: passHash,
          passwordSalt: passSalt
        });

        UserModel.find({ username: username }, (err, user) => {
          if (err || !user || user.length === 0) {
            newUser.save(err => {
              const newUserProfile = new UserProfile(newUser);
              if (err) {
                reject(err);
              } else {
                resolve(newUserProfile);
              }
            });
          } else {
            reject(null);
          }
        });
      }
    });
  };

  return {
    getUserDetails: getUserDetails,
    createUser: createUser
  };
};

module.exports.connect = conString => {
  return new Promise((resolve, reject) => {
    mongoose.connect(conString).then(res => {
      resolve(dbInterface(mongoose));
    });
  });
};
