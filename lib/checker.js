function Checker() {
  this.rules = [];
  this.exceptions = [];

  /**
   * @param name A name for the rule
   * @param cb Rule callbacks should return true if the mail is a match for the rule or a string mailbox name, or false if not a match
   */
  Checker.prototype.addRule = function(name, cb) {
    this.rules[name] = cb;
  }

  /**
   * @param name A name for the exception
   * @param cb Exception callbacks should return true if the mail is a match for the exception rule
   */
  Checker.prototype.addException = function(name, cb) {
    this.exceptions[name] = cb;
  }
  /**
   * @return Returns false if no move is necessary, true to move to default destination, or a string with the mailbox to move the message to
   */
  Checker.prototype.check = function(emailModel) {
    for (var i in this.exceptions)
    {
      if (typeof(this.exceptions[i]) == "function") {
        if (this.exceptions[i].call(this, emailModel)) {
          return false;
        }
      }
    }

    for (var j in this.rules)
    {
      if (typeof(this.rules[j]) == "function") {
        var result = this.rules[j].call(this, emailModel);
        if (result !== false) {
          return result;
        }
      }
    }
    return false;
  }

  Checker.prototype.checkFrom = function(emailModel, emailAddress) {
    return emailModel.getFrom().email == emailAddress;
  }

  Checker.prototype.checkToContains = function(emailModel, emailAddress) {
    var toArray = emailModel.getToArray();
    return toArray.some(function(element) {
      return element.email == emailAddress;
    });
  }

  Checker.prototype.checkCcContains = function(emailModel, emailAddress) {
    var ccArray = emailModel.getCcArray();
    return ccArray.some(function(element) {
      return element.email == emailAddress;
    });
  }

  Checker.prototype.checkSubjectStartsWith = function(emailModel, text) {
    return emailModel.getSubject().indexOf(text) === 0;
  }

  Checker.prototype.checkSubjectContains = function(emailModel, text) {
    return emailModel.getSubject().indexOf(text) !== -1;
  }

}

exports.Checker = Checker;