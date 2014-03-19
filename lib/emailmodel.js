var
  inherits = require('util').inherits,
  EventEmitter = require('events').EventEmitter;

/**
 * Class to hold a mail message
 * @constructor
 */
function EmailModel() {

  this.requiredElements = {
    'HEADER': false,
    'ATTRIBUTES': false
  };

  /**
   * Used to keep track of which mail elements have been parsed and are ready to be checked
   * @param element One of the "requiredElements"
   * @private
   */
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

    /**
     * Extracts email from strings like: "Harry Potter" <harry@potter.com>
     * @param input A string containing email addresses
     * @returns {Array} An array of the email addresses
     * @private
     */
  EmailModel.prototype._getEmailsFromString = function(input) {
    var
      ret = [],
      emailRegex =  /(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)/,
      name,
      email,
      match;

      input.forEach(function(element) {
        match = emailRegex.exec(element);
        if (match && match.length == 3) {
          name = match[1];
          email = match[2];
          ret.push({'name':name, 'email':email});
        }
      });

    return ret;
  }

    /**
     * Since some checks require both header and attributes, this method confirms that both are ready
     * @private
     */
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