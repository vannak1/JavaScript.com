var assert = require('chai').assert,
    Sandbox = require('javascript-sandbox'),
    jshint = require('jshint').JSHINT;

module.exports = {
  assert: assert,
  Sandbox: Sandbox,
  activeSandbox: new Sandbox(),
  state: { },
  evaluate: function(code) {
    return this.activeSandbox.evaluate(code);
  }
};
