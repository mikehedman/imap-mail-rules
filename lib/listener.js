var
  Imap = require('imap'),
  inspect = require('util').inspect
  EmailModel = require('./emailmodel').EmailModel;

function Listener(config) {
  this.inbox = undefined;
  this.imap = new Imap(config);

  Listener.prototype.go = function() {
    var self = this;
    self.imap.once('ready', function() {
      self._openInbox(function(err, box) {
        if (err) throw err;
        inbox = box;
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

  Listener.prototype._processMail = function(numMsgs) {
    var self = this;
    var f = self.imap.seq.fetch((inbox.messages.total - numMsgs + 1) + ':*', {
      bodies: 'HEADER.FIELDS (FROM TO CC SUBJECT DATE)',
      struct: true
    });
    var moveUIDs = [];
    f.on('message', function(msg, seqno) {
      var shouldMove = false,
        uid,
        emailModel = new EmailModel();

      msg.on('body', function(stream, info) {
        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          emailModel.setHeader(Imap.parseHeader(buffer));
//          var subject = emailModel.getSubject();
//          if (subject.indexOf('Refund failure') === 0) {
//            if (uid !== undefined) {
//              moveUIDs.push(uid);
//            } else {
//              shouldMove = true;
//            }
//          }
        });
      });
      msg.once('attributes', function(attrs) {
        emailModel.setAttributes(attrs);
//        uid = attrs.uid;
//        if (shouldMove === true)
//          moveUIDs.push(uid);
      });
      emailModel.on('ready', function(){
        if (emailModel.getSubject().indexOf('Refund failure') === 0) {
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

  Listener.prototype._openInbox = function(cb) {
    this.imap.openBox('INBOX', false, cb);
  }

}

exports.Listener = Listener;