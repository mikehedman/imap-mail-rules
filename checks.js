var checks = {
  'exceptions': [
    {
      'name': 'Genuine jackpot',
      'exception': function(emailModel) {
        return Checker.prototype.checkSubjectContains(emailModel, 'genuine');
      }
    }
  ],
  'rules': [
    {
      'name': 'Nigerian spam',
      'rule': function(emailModel) {
        return Checker.prototype.checkSubjectStartsWith(emailModel, 'Nigerian jackpot')
       }
    }
  ]
}

exports.checks = checks;