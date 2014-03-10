var checks = {
  'exceptions': [
    function(emailModel) {
      return Checker.prototype.checkSubjectContains(emailModel, 'genuine');
    }
  ],
  'rules': [
    function(emailModel) {
      return Checker.prototype.checkSubjectStartsWith(emailModel, 'Nigerian jackpot')
    }
  ]
}

exports.checks = checks;