class UserController {
  constructor(db, tokenGenerator) {
    this.db = db;
    this.tokenGenerator = tokenGenerator;
    this.crypto = require('crypto');
  }

  //check if the username and password is valid
  // return a token if it is or null if not
  loginCheck(user, pass) {
    return this.db
      .getUserDetails(user)
      .then(user => {
        if (!user) {
          throw new Error('no user found');
        } else {
          return this.hashPassword(pass).then(hashedPass => {
            return {
              user: user,
              password: hashedPass
            };
          });
        }
      })
      .then(({ user, password }) => {
        if (user === user.username && password === user.passwordHash) {
          return this.tokenGenerator(user);
        } else {
          return null;
        }
      })
      .catch(err => {
        return null;
      });
  }

  //create hash of a password
  hashPassword(
    password,
    salt = crypto.randomBytes(128).toString('base64'),
    iterations = 1000
  ) {
    return new Promise((resolve, reject) => {
      this.crypto.pbkdf2(
        password,
        salt,
        iterations,
        64,
        'sha512',
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  }
}

module.exports = UserController;
