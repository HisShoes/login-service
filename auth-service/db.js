const mongoose = require('mongoose');

getUserDetails = username => {
  return {
    user: 'Ryan',
    pw: 'password'
  };
};

const dbInterface = client => {
  loginCheck = (user, pw) => {
    if (user && pw) {
      const userDetails = getUserDetails(user);
      if (userDetails && userDetails.user === user && userDetails.pw === pw) {
        return true;
      } else {
        return false;
      }
    }
  };

  return {
    loginCheck: loginCheck
  };
};

module.exports.connect = conString => {
  return new Promise((resolve, reject) => {
    mongoose.connect(conString).then(res => {
      resolve(dbInterface(mongoose));
    });
  });
};
