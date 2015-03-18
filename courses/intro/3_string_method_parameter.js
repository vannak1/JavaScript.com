tests = `
var assert       = require('chai').assert,
Sandbox      = require('javascript-sandbox'),
CS           = require('./cs.js'),
consoleInput = code[0].code,
message;
if(typeof(sandbox) == 'undefined') {
  var sandbox = new Sandbox();
}
sandbox.evaluate("var _alertCalled = false; var _alertVal; var _alert = alert; alert = function(val) { _alertVal = val; _alertCalled = true; return _alert(val); };")
try {
  message = sandbox.evaluate(consoleInput)
} catch(e) {
  message = e.message
}
describe('console.log example', function() {
  it('f_no_alert', function() {
    var alertWasCalled = sandbox.evaluate('_alertCalled');
    assert(alertWasCalled);
  });
  it('f_no_alert_val', function() {
    var alertWasCalled = sandbox.evaluate('_alertVal');
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
    'hint':    "You didn't call the alert method! Try Typing `alert();` in the console.",
    'message': 'You can call the alert method like this: `alert();`'
  },
  'f_no_alert_val': {
    'hint':    'Woops, you forgot to pass the parameter to the `alert` method! Try this: `alert(\"yourNameGoesHere\")`',
    'message': "Here's a sample name to see how it works: `alert(\"Taylor\");`"
  }
};

module.exports = {
  'title': 'String Method Parameter',
  'instructions': `Nice pop-up box, *Taylor*{: .client-persistence-display key='userName'}, but
    there wasn't much in it. How can we get that box to show your name?

    Well, many methods (like the \`alert\` method) can take instructions, which we call
    *parameters*. By sending a string into the \`alert\` method, we can put text on the pop-up box. Try it!

    &gt; \`alert("Gregg");\``,
  'hints': [
    "Type in your first name surrounded by double quotes inside the alert method: `alert(\"Gregg\");`"
  ],
  'tests': tests,
  'failures': failures,
  'answer': "`alert(\"name\");`"
};
