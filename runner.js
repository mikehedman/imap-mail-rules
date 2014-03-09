var
  Listener = require('./lib/Listener').Listener,
  config = require('./config.js').config;

  //can supply a custom config file to override the publicly visible file
  try {
    config = require('./custom_config.js').custom_config;
  } catch (e) {
    //just eat errors, this i
  }

var listener = new Listener(config);
listener.go();