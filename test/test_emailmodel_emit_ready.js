var
  EmailModel = require('../lib/emailmodel').EmailModel,
  assert = require('assert');

it('should not emit an event - missing attributes', function(done){
  var emailModel = new EmailModel();
  var errTimeout = setTimeout(function () {
    assert(true, 'Event never fired'); //or assert.fail, or whatever.
    done();
  }, 1000); //timeout with an error in one second

  emailModel.on('ready',function(){
    clearTimeout(errTimeout); //cancel error timeout
    assert(false);
    done();
  });

  emailModel.setHeader({});
});

it('should not emit an event - missing header', function(done){
  var emailModel = new EmailModel();
  var errTimeout = setTimeout(function () {
    assert(true, 'Event never fired');
    done();
  }, 1000);

  emailModel.on('ready',function(){
    clearTimeout(errTimeout);
    assert(false, 'Event was fired');
    done();
  });

  emailModel.setAttributes({});
});

it('should emit an event', function(done){
  var emailModel = new EmailModel();
  var errTimeout = setTimeout(function () {
    assert(false, 'Event never fired');
    done();
  }, 1000);

  emailModel.on('ready',function(){
    clearTimeout(errTimeout);
    assert(true, 'Event was fired');
    done();
  });

  emailModel.setAttributes({});
  emailModel.setHeader({});
});