var Settings = require('./settings');

var rollbar = require('rollbar-browser');

var config = {
  accessToken: Settings.rollbarToken,
  captureUncaught: true,
  payload: {
    environment: Settings.environment
  }
};

var Rollbar = rollbar.init(config);
window.Rollbar = Rollbar;
module.exports = Rollbar;
