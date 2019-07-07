module.exports = (app, config) => {
  //use to verify that a request has a valid token
  app.get('/', config.tokenMiddleware, (req, res) => {
    res.json({ success: true, message: 'token valid' });
  });

  //used to login
  app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password && config.db.loginCheck(username, password)) {
      res.json({
        success: true,
        message: `Authentication successful`,
        token: config.generateToken(username)
      });
    } else {
      res.sendStatus(403).json({
        success: false,
        message: `Authentication failed`
      });
    }
  });
};
