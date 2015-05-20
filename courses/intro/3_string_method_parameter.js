tests = `
var js = require('/courses/helper/index.js')

describe('console.log example', function() {
  var message, errorMessage;

  before(function() {
    var setup = "var _alertCalled = false; var _alertVal; var _alert = alert; alert = function(val) { _alertVal = val; _alertCalled = true; return _alert(val); };"
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

  it('f_no_alert_val', function() {
    var alertWasCalled = js.evaluate('_alertVal');
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
    'hint':    "You didn't call the alert method! Try Typing `alert();` in the console.",
    'message': 'You can call the alert method like this: `alert();`'
  },
  'f_no_alert_val': {
    'hint':    'Woops, you forgot to pass the parameter to the `alert` method. Try this: `alert(\"yourNameGoesHere\")`',
    'message': "Here's a sample name to see how it works: `alert(\"Taylor\");`"
  }
};

module.exports = {
  'id': 3,
  'title': 'String Method Parameter',
  'instructions': `Nice pop-up box, {{username}}, but there wasn't much in it. How can we get that box to show your name?

Well, many methods (like the \`alert\` method) can take instructions, which we call *parameters*. By sending a string into the \`alert\` method, we can put text on the pop-up box. Try it!

\`alert("{{username}}");\``,
  'hints': [
    "Type in your first name surrounded by double quotes inside the alert method: `alert(\"{{username}}\");`"
  ],
  'tests': tests,
  'failures': failures,
  'answer': "`alert(\"name\");`"
};
