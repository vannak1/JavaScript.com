tests = `
var assert = require('chai').assert,
  Sandbox = require('javascript-sandbox'),
  sandbox = new Sandbox(),
  CS = require('./cs.js'),
  varFound,
  isString,
  message,
  input = code;

  var userName = code[0].clientStore.userName;

  before(function(){

    var exec = "var "+ code[0].clientStore.variable + " = '" + code[0].clientStore.userName + "' \\n " + input;
    try {
      message = sandbox.evaluate(exec)
    } catch(e) {
      message = e.message
    }
  });
describe('set_a_var', function(){

  it('f_null', function(){
    assert(message != null);
  });

  it('f_not_username', function(){
    assert(message == userName);
  });

});

details("output", function() {

  return {
    'result': message
  };
});
`

failures = {
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
  'instructions': 'Now we have a variable called firstName that has a string stored inside of it.',
  'hints': [
    "You can remove the `if` statement altogether. You'll be able to replace it with a ternary that returns the result."
  ],
  'tests': tests,
  'failures': failures,
  'answer': "test;"
};
