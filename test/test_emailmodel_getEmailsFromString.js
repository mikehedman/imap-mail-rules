var
  EmailModel = require('../lib/emailmodel').EmailModel,
  emailModel = new EmailModel(),
  assert = require('assert'),
  inspect = require('util').inspect;

[
  { source: ['"Harry Potter" <harry@potter.com>'],
    expected: [{'name':'Harry Potter', 'email':'harry@potter.com'}],
    what: 'Quoted name'
  },
  { source: ['Mary Potter <mary@potter.com>'],
    expected: [{'name':'Mary Potter', 'email':'mary@potter.com'}],
    what: 'Unquoted name'
  },
  { source: ['harry@potter.com'],
    expected: [{'name': undefined, 'email':'harry@potter.com'}],
    what: 'No text name'
  },
  { source: ['harry@potter.com', 'mary@potter.com'],
    expected: [{'name': undefined, 'email':'harry@potter.com'},
               {'name': undefined, 'email':'mary@potter.com'}],
    what: 'Multiple names'
  }
].forEach(function(v) {
    var result;

    try {
      result = emailModel._getEmailsFromString(v.source);
    } catch (e) {
      console.log(makeMsg(v.what, 'JS Exception: ' + e.stack));
      return;
    }

    assert.deepEqual(result,
      v.expected,
      makeMsg(v.what,
        'Result mismatch:'
        + '\nReturned: ' + inspect(result, false, 10)
        + '\nExpected: ' + inspect(v.expected, false, 10)
      )
    );
  });

function makeMsg(what, msg) {
  return '[' + what + ']: ' + msg;
}