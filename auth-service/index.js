console.log('started node');

const { connect } = require('./db');
const server = require('./server');
const tokenAuth = require('./jwt-auth-middleware')(process.env.SECRET);

//connect to db
connect(process.env.DATABASE_URL)
  .then(res => {
    //start the server, pass in config
    return server.start({
      port: process.env.PORT,
      host: process.env.HOST,
      tokenMiddleware: tokenAuth.middleware,
      generateToken: tokenAuth.generateToken,
      db: res
    });
  })
  .catch(err => {
    console.log(`Couldn't connect to db and start server: ${err}`);
    console.log('------');
  });
