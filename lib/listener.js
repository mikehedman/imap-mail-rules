var
  Imap = require('imap')
  EmailModel = require('./emailmodel').EmailModel;
  Checker = require('./checker').Checker;

/**
 * Class for listening to the IMAP server
 */
/**
 *
 * @param config An object containing configuration info
 * @param checks An object containing an array of checks that will be performed on incoming mail
 * @constructor
 */
function Listener(config, checks) {
  this.inbox = undefined;
  this.imap = new Imap(config);
  this.checker = new Checker();
  this.checks = checks;

  /**
   * The Listener classes main method - connects to the server and waits for mail
   */
  Listener.prototype.go = function() {
    var self = this;
    self._addChecks();
    self.imap.once('ready', function() {
      self._openInbox(function(err, box) {
        if (err) throw err;
        self.inbox = box;
        self.imap.on('mail', function(numNewMsgs){
          console.log("New messages: " + numNewMsgs);
          //limit the number of messages to process, specifically for the first time
          self._processMail(Math.max(numNewMsgs, 10));
        });
      });
    });
    self.imap.once('error', function(err) {
      console.log(err);
    });

    self.imap.once('end', function() {
      console.log('Connection ended');
    });

    self.imap.connect();
  }

  /**
   * Takes the checks provided to the constructor and passes them to the Checker
   * @private
   */
  Listener.prototype._addChecks = function() {
    var self = this;
    if (self.checks.exceptions) {
      self.checks.exceptions.forEach(function(element, index) {
        self.checker.addException(index, element);
      });
    }

    if (self.checks.rules) {
      self.checks.rules.forEach(function(element, index) {
        self.checker.addRule(index, element);
      });
    }
  }

  /**
   * Process a set of mail messages
   * @param numMessages number of messages to retrieve and process
   * @private
   */
  Listener.prototype._processMail = function(numMessages) {
    var self = this;
    var f = self.imap.seq.fetch((self.inbox.messages.total - numMessages + 1) + ':*', {
      bodies: 'HEADER.FIELDS (FROM TO CC SUBJECT DATE)',
      struct: true
    });
    var moveUIDs = [];
    f.on('message', function(msg, seqno) {
      var emailModel = new EmailModel();

      msg.on('body', function(stream, info) {
        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          emailModel.setHeader(Imap.parseHeader(buffer));
        });
      });
      msg.once('attributes', function(attrs) {
        emailModel.setAttributes(attrs);
      });
      emailModel.on('ready', function(){
        if (self.checker.check(emailModel)) {
          moveUIDs.push(emailModel.getUid());
        }
      })
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      moveUIDs.forEach(function(uid) {
        self.imap.move(uid, 'node', function(err) {
          if (err) {
            console.log('Move error: ' + err);
          } else {
            console.log('Moved: ' + uid);
          }
        });
      });
    });
  }

  /**
   * Open the IMAP server's inbox
   * @param cb Callback to be run after connected
   * @private
   */
  Listener.prototype._openInbox = function(cb) {
    this.imap.openBox('INBOX', false, cb);
  }
}

exports.Listener = Listener;