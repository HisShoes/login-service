module.exports = (app, config) => {
  const userController = config.userController;

  //use to verify that a request has a valid token
  app.get('/', config.tokenMiddleware, (req, res) => {
    res.json({ success: true, message: 'token valid' });
  });

  app.post('/signup', (req, res) => {
    userController
      .createUser(
        req.body.email,
        req.body.username,
        req.body.firstName,
        req.body.lastName,
        req.body.password
      )
      .then(loginDetails => {
        console.log(loginDetails);
        res.json({
          success: true,
          userProfile: loginDetails.userProfile,
          token: loginDetails.loginToken
        });
      })
      .catch(err => {
        res.status(403).json({ success: false, err: err });
      });
  });

  //used to login
  app.post('/login', (req, res) => {
    userController
      .loginCheck(req.body.username, req.body.password)
      .then(token => {
        if (token) {
          res.json({
            success: true,
            message: `Authentication successful`,
            token: token
          });
        } else {
          throw new Error('not authenticated');
        }
      })
      .catch(err => {
        res.status(403).json({
          success: false,
          message: `Authentication failed`
        });
      });
  });
};
