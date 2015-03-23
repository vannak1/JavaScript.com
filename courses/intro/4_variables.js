tests = `
var assert = require('chai').assert,
  Sandbox = require('javascript-sandbox'),
  sandbox = new Sandbox(),
  CS = require('./cs.js'),
  varFound,
  isString,
  variable,
  userName = 'Tyler',
  input = code;

describe('set_a_var', function(){

  it('f_no_var_keyword', function(){
    CS.traverse(input, function(node) {
      if(node.type == 'Program' &&
         node.body[0].kind == 'var'){
        varFound = true;
        variable = node.body[0].declarations[0].id.name
      }
    });
    assert(varFound);
  });

  it('f_name_blank', function(){
    var blank;
    CS.traverse(input, function(node) {
      if(node.type == 'Literal' &&
         typeof node.value != 'null'){
        blank = true;
      }
    });
    assert(blank);
  });

  it('f_name_not_string', function(){
    CS.traverse(input, function(node) {
      if(node.type == 'Literal' &&
         typeof node.value == 'string'){
        isString = true;
      }
    });
    assert(isString);
  });

});

details("output", function() {
  var message;

  try {
    message = sandbox.evaluate(input)
  } catch(e) {
    message = e.message
  }

  return {
    'result': message,
    'clientStore': {
      variable: variable,
      userName: userName
    }
  };
});
`

failures = {
  'f_no_var_keyword': {
    'message': 'Whoops. We did not use the `var` keyword when setting our variable.',
    'hint': ""
  },
  'f_name_blank': {
    'message': 'Almost, but we did not set our name to our variable we created.',
    'hint': ""
  },
  'f_name_not_string': {
    'message': 'Hold up. It looks like we entered the name not as a string.',
    'hint': ""
  }
};

module.exports = {
  'title': 'Variables',
  'instructions': 'TODO this can not be right -> Sweet! You now know how to create annoying text boxes!',
  'hints': [
    'You can remove the `if` statement altogether. You\'ll be able to replace it with a ternary that returns the result.'
  ],
  'tests': tests,
  'failures': failures,
  'answer': "var test = 'dan';"
};
