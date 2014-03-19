var
  Listener = require('./lib/listener').Listener,
  config = require('./config').config,
  checks = require('./checks').checks;

//can supply a custom config file to override the publicly visible file
try {
  config = require('./custom_config.js').custom_config;
} catch (e) {
  //just eat errors, since using a custom_config file is optional
}

try {
  checks = require('./custom_checks').custom_checks;
} catch (e) {
  //just eat errors, since providing a custom_checks file is optional
}
var listener = new Listener(config, checks);
listener.go();