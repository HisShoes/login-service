class UserController {
  constructor(db, tokenGenerator) {
    this.db = db;
    this.tokenGenerator = tokenGenerator;
    this.crypto = require('crypto');
  }

  //check if the username and password is valid
  // return a token if it is or null if not
  loginCheck(username, pass) {
    return this.db
      .getUserDetails(username)
      .then(user => {
        if (!user) {
          throw new Error('no user found');
        } else {
          return this.hashPassword(pass, user[0].passwordSalt).then(res => {
            return {
              user: user[0],
              password: res.passHash
            };
          });
        }
      })
      .then(({ user, password }) => {
        if (username === user.username && password === user.passwordHash) {
          return this.tokenGenerator(user);
        } else {
          return null;
        }
      })
      .catch(err => {
        return null;
      });
  }

  createUser(email, username, firstName, lastName, password) {
    return this.hashPassword(password)
      .then(res => {
        return this.db.createUser(
          email,
          username,
          firstName,
          lastName,
          res.passHash,
          res.salt
        );
      })
      .then(userProfile => {
        return {
          userProfile: userProfile,
          loginToken: this.tokenGenerator(username)
        };
      });
  }

  //create hash of a password
  hashPassword(
    password,
    salt = this.crypto.randomBytes(128).toString('base64'),
    iterations = 1000
  ) {
    return new Promise((resolve, reject) => {
      if (!password) {
        reject(new Error('No password supplied'));
      }
      this.crypto.pbkdf2(
        password,
        salt,
        iterations,
        64,
        'sha512',
        (err, passHash) => {
          if (err) {
            reject(new Error(err));
          } else {
            resolve({ passHash: passHash.toString('hex'), salt: salt });
          }
        }
      );
    });
  }
}

module.exports = UserController;
