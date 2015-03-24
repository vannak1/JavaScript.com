tests = `
var js = require('/courses/helper/index.js');

describe('set_a_var', function(){
  var message, errorMessage;

  before(function() {
    try {
      message = js.evaluate(code);
    } catch(e) {
      errorMessage = e.message;
    }
  });

  details(function() {
    return {
      output: message
    };
  });

  it('f_error', function() {
    if(errorMessage) {
      js.assert(false, errorMessage);
    }
  });

  it('f_null', function(){
    js.assert(message != null);
  });

  it('f_not_username', function(){
    js.assert(message == js.state.username);
  });
});
`

failures = {
  "f_error": {
    "message": "Uh oh, it looks like your code won't run. Here's the error message we're getting"
  },
  'f_null': {
    'message': 'Nope. This variable does not have any value assigned to it.',
    'hint': ''
  },
  'f_not_username': {
    'message': 'That is not your name. Use the variable that you stored your name in.',
    'hint': ''
  }
};

module.exports = {
  'title': 'Variable Value',
  'instructions': 'Now we have a variable called `name` that has a string stored inside of it. Output it to see what it looks like.',
  'tests': tests,
  'failures': failures,
  'answer': "test;"
};