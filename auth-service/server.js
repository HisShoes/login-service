//server startup
const express = require('express');
const bodyParser = require('body-parser');

const api = require('./api');

module.exports.start = config => {
  return new Promise((resolve, reject) => {
    if (!config) reject(new Error(`no config provided`));
    //setup the app with express
    const app = express();

    //setup middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //add api to express app
    api(app, config);

    //start the server
    const server = app.listen(config.port, config.host, () => {
      console.log(`Server starting, listening on port: ${config.port}`);
      console.log('----');
      resolve(server);
    });
  });
};
