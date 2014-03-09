var
  inherits = require('util').inherits,
  EventEmitter = require('events').EventEmitter;

function EmailModel() {

  this.requiredElements = {
    'HEADER': false,
    'ATTRIBUTES': false
  };
  EmailModel.prototype._setRequiredElement = function(element) {
    this.requiredElements[element] = true;
    this._checkReady();
  }

  EmailModel.prototype.setHeader = function(header) {
    this.header = header;
    this._setRequiredElement('HEADER');
  }

  EmailModel.prototype.getFrom = function() {
    return this._getEmailsFromString(this.header['from'])[0];
  }
  EmailModel.prototype.getSubject = function() {
    return this.header['subject'][0];
  }
  EmailModel.prototype.getToArray = function() {
    return this._getEmailsFromString(this.header['to']);
  }
  EmailModel.prototype.getCcArray = function() {
    return this._getEmailsFromString(this.header['cc']);
  }

  EmailModel.prototype.setAttributes = function(attributes) {
    this.attributes = attributes;
    this._setRequiredElement('ATTRIBUTES');
  }

  EmailModel.prototype.getUid = function() {
    return this.attributes.uid;
  }


  EmailModel.prototype._getEmailsFromString = function(input) {
    var ret = [];
    //var email = /\"([^\"]+)\"\s+\<([^\>]+)\>/g
    var email =  /\"?([^\"]+)\"?\s+\<([^\>]+)\>/g
    var match;
    while (match = email.exec(input))
      ret.push({'name':match[1], 'email':match[2]})

    return ret;
  }

  EmailModel.prototype._checkReady = function() {
    for (var section in this.requiredElements)
    {
      if (this.requiredElements[section] == false) {
        return;
      }
    }
    this.emit('ready', this);
  }
}
inherits(EmailModel, EventEmitter);

exports.EmailModel = EmailModel;