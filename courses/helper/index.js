var assert = require('chai').assert,
    Sandbox = require('javascript-sandbox'),
    jshint = require('jshint').JSHINT;

function verify(code) {
  if (!jshint('/* jshint asi:true */' + code)) {
    var error = jshint.errors[0];

    if (!error.message) {
      error.message = 'Looks like there is a syntax error in your code: ' + error.reason || error.raw;
    }

    if (error.message.match(/Missing semicolon/)) return;

    it('f_jshint_error', function() {
      assert(false, error.message);
    });
  }
}

module.exports = {
  assert: assert,
  verify: verify,
  Sandbox: Sandbox,
  activeSandbox: new Sandbox(),
  state: {},
  evaluate: function(code) {
    return this.activeSandbox.evaluate(code);
  }
};
