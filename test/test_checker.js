var
  Checker = require('../lib/checker').Checker,
  EmailModel = require('../lib/EmailModel').EmailModel,
  testEmailModel,
  assert = require('assert'),
  FROM_ADDRESS = 'you@domain.com',
  TO_ADDRESS = 'me@here.com',
  CC_ADDRESS = 'cc@winans.com',
  SUBJECT = 'abc';

var testCases = [];
testEmailModel = new EmailModel();
testEmailModel.setHeader(
  {
    'subject': [SUBJECT],
    'from': ['you <' + FROM_ADDRESS + '>'],
    'to': ['me <' + TO_ADDRESS + '>', 'Just Another <email@address.com'],
    'cc': ['CC <' + CC_ADDRESS + '>']
  });

testCases.push({
  description: 'Subject starts with, no match',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return emailModel.getSubject().indexOf('No match') === 0;
  }],
  expected: false
});

testCases.push({
  description: 'Subject starts with, match',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return emailModel.getSubject().indexOf(SUBJECT) === 0;
  }],
  expected: true
});

testCases.push({
  description: 'Subject starts with, contains but does not start with',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return emailModel.getSubject().indexOf('bad bad ' + SUBJECT) === 0;
  }],
  expected: false
});

testCases.push({
  description: 'Subject starts with, match, but has exception',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return emailModel.getSubject().indexOf(SUBJECT) === 0;
  }],
  exceptions: [function(emailModel) {
    return emailModel.getFrom().email == FROM_ADDRESS;
  }],
  expected: false
});

//test the Checker's helper methods
testCases.push({
  description: 'checkFrom as rule',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return Checker.prototype.checkFrom(emailModel, FROM_ADDRESS);
  }],
  expected: true
});

testCases.push({
  description: 'checkFrom as exception',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return emailModel.getSubject().indexOf('abc') === 0;
  }],
  exceptions: [function(emailModel) {
    return Checker.prototype.checkFrom(emailModel, FROM_ADDRESS);
  }],
  expected: false
});

testCases.push({
  description: 'checkSubjectStartsWith',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return Checker.prototype.checkSubjectStartsWith(emailModel, SUBJECT);
  }],
  expected: true
});

testCases.push({
  description: 'checkSubjectStartsWith - no match',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return Checker.prototype.checkSubjectStartsWith(emailModel, 'no match ' + SUBJECT);
  }],
  expected: false
});

testCases.push({
  description: 'checkSubjectContains',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return Checker.prototype.checkSubjectContains(emailModel, 'b');
  }],
  expected: true
});

testCases.push({
  description: 'checkSubjectContains as exception',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return Checker.prototype.checkSubjectContains(emailModel, 'b');
  }],
  expected: true
});

testCases.push({
  description: 'checkToContains',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return Checker.prototype.checkToContains(emailModel, TO_ADDRESS);
  }],
  expected: true
});

testCases.push({
  description: 'checkToContains - no match',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return Checker.prototype.checkToContains(emailModel, 'bad' + TO_ADDRESS);
  }],
  expected: false
});

testCases.push({
  description: 'checkCcContains',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return Checker.prototype.checkCcContains(emailModel, CC_ADDRESS);
  }],
  expected: true
});

testCases.push({
  description: 'checkCcContains - no match',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return Checker.prototype.checkCcContains(emailModel, 'bad' + CC_ADDRESS);
  }],
  expected: false
});

testCases.forEach(function(v) {
  var checker = new Checker();
  if (v.exceptions) {
    v.exceptions.forEach(function(element, index, array) {
      checker.addException(index, element);
    });
  }

  if (v.rules) {
    v.rules.forEach(function(element, index, array) {
      checker.addRule(index, element);
    });
  }

  var actual = checker.check(v.emailModel);
  assert.equal(actual, v.expected, 'Expected: ' + v.expected + ' Got: ' + actual + ' ~ ' + v.description);
});
