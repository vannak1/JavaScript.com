tests = `
var js = require('/courses/helper/index.js');

describe('alert example', function() {
  var message, errorMessage;

  before(function() {
    var setup = "var _alertCalled = false; var _alert = alert; alert = function(val) { _alertCalled = true; return _alert(val); };";
    js.evaluate(setup);

    try {
      message = js.evaluate(code);
    } catch(e) {
      errorMessage = e.message;
    }
  });

  after(function() {
    js.evaluate("alert = _alert");
  });

  js.verify(code);

  it('f_no_alert', function() {
    var alertWasCalled = js.evaluate('_alertCalled');
    js.assert(alertWasCalled);
  });

  details(function() {
    return {
      output: message
    };
  });


});
`

failures = {
  "f_error": {
    "message": "Uh oh, it looks like your code won't run. Here's the error message we're getting"
  },
  'f_no_alert': {
    'message': "You didn't call the alert method! Try typing `alert();` in the console.",
    'hint':    'Call the alert method by typing the following: `alert();`'
  }
};

module.exports = {
  'id': 2,
  'title': 'Methods',
  'instructions': `Great job, {{username}}! In JavaScript, when we surround a word with quotes it's called a *string*, and when we're done with a line of code we finish it with a semicolon.

JavaScript also has built-in features, called *methods*. In order to call a method, we simply write its name (this time without quotes) and end it with a set of parentheses. Try calling the \`alert\` method as you see below.

Don't be afraid when a box pops up, that's your code working, {{username}}!

<code class=\"inlineCode inlineCode--btn\">alert();</code>`,
  'hints': [
    'Call the alert method by typing the following: `alert();`'
  ],
  'tests': tests,
  'failures': failures,
  'answer': 'alert();'
};
