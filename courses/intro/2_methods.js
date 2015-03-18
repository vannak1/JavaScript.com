tests = `
var assert       = require('chai').assert,
    Sandbox      = require('javascript-sandbox'),
    CS           = require('./cs.js'),
    consoleInput = code[0].code,
    message;
if(typeof(sandbox) == 'undefined') {
  var sandbox = new Sandbox();
}
sandbox.evaluate("var _alertCalled = false; var _alert = alert; alert = function(val) { _alertCalled = true; return _alert(val); };")
try {
  message = sandbox.evaluate(consoleInput)
} catch(e) {
  message = e.message
}
describe('alert example', function() {
  it('f_no_alert', function() {
    var alertWasCalled = sandbox.evaluate('_alertCalled');
    assert(alertWasCalled);
  });
});
details("output", function() {
  return {
    'result': message
  };
});
`

failures = {
  'f_no_alert': {
    'message': "You didn't call the alert method! Try typing `alert();` in the console.",
    'hint':    'Call the alert method by typing the following: `alert();`'
  }
};

module.exports = {
  'title': 'Methods',
  "instructions": `Great job, *Taylor*{: .client-persistence-display key='userName'}! In JavaScript,
    when we surround a word with quotes it's called a *string*, and when we're done
    with a line of code we finish it with a semicolon.

    JavaScript also has built-in features, called *methods*. In order to call a method,
    we simply write its name (this time without quotes) and end it with a set of
    parentheses. Try calling the \`alert\` method as you see below.

    Don't be afraid when a box pops up, that's your code working, *Taylor*{: .client-persistence-display key='userName'}!

    &gt; \`alert();\``,
  'hints': [
    'Call the alert method by typing the following: `alert();`'
  ],
  'tests': tests,
  'failures': failures,
  'answer': 'alert();'
};
