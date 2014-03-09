var
  Listener = require('./lib/Listener').Listener,
  config = require('./config').config,
  checks = require('./checks').checks;

//can supply a custom config file to override the publicly visible file
try {
  config = require('./custom_config.js').custom_config;
} catch (e) {
  //just eat errors, this is optional
}

//can (should!) supply a custom config file to override the publicly visible file
try {
  checks = require('./custom_checks.js').custom_checks;
} catch (e) {
  //just eat errors, this is optional
}

var listener = new Listener(config, checks);
listener.go();