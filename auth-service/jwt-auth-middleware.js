const jwt = require('jsonwebtoken');

module.exports = jwtAuth = secret => {
  middleware = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    if (token) {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        message: 'Token is not supplied'
      });
    }
  };

  generateToken = payload => {
    return jwt.sign({ payload }, secret, { expiresIn: '24h' });
  };

  return { middleware, generateToken };
};
