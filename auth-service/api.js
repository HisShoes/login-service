module.exports = (app, config) => {
  const userController = config.userController;

  //use to verify that a request has a valid token
  app.get('/', config.tokenMiddleware, (req, res) => {
    res.json({ success: true, message: 'token valid' });
  });

  //used to login
  app.post('/login', (req, res) => {
    userController
      .loginCheck(req.body.username, req.body.password)
      .then(token => {
        if (token) {
          console.log('response');
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
        console.log('err 2');
        res.status(403).json({
          success: false,
          message: `Authentication failed`
        });
      });
  });
};
