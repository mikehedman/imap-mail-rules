var
  Checker = require('../lib/checker').Checker,
  EmailModel = require('../lib/EmailModel').EmailModel,
  testEmailModel,
  assert = require('assert');

var testCases = [];
testEmailModel = new EmailModel();
testEmailModel.setHeader(
  {
    'subject': ['abc'],
    'from': ['me <me@domain.com>']
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
    return emailModel.getSubject().indexOf('abc') === 0;
  }],
  expected: true
});

testCases.push({
  description: 'Subject starts with, contains but does not start with',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return emailModel.getSubject().indexOf('bad bad abc') === 0;
  }],
  expected: false
});

testCases.push({
  description: 'Subject starts with, match, but has exception',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return emailModel.getSubject().indexOf('abc') === 0;
  }],
  exceptions: [function(emailModel) {
    return emailModel.getFrom().email == 'me@domain.com';
  }],
  expected: false
});

//test the Checker's helper methods
testCases.push({
  description: 'checkFrom as rule',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return Checker.prototype.checkFrom(emailModel, 'me@domain.com');
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
    return Checker.prototype.checkFrom(emailModel, 'me@domain.com');
  }],
  expected: false
});

testCases.push({
  description: 'checkSubjectStartsWith',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return Checker.prototype.checkSubjectStartsWith(emailModel, 'abc');
  }],
  expected: true
});

testCases.push({
  description: 'checkSubjectStartsWith - no match',
  emailModel: testEmailModel,
  rules: [function(emailModel) {
    return Checker.prototype.checkSubjectStartsWith(emailModel, 'no match abc');
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

  assert.equal(checker.check(v.emailModel), v.expected);
});
