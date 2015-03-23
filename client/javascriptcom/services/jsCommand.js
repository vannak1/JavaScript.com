angular.module('javascriptcom').factory('jsCommand', ['jsCommandFactory', function(jsCommandFactory) {
  return function jsCommand(challenge) {
    this.challenge = challenge;

    this.handler = function parseCommand(line, report) {
      var handler = jsCommandFactory(line);
      handler(challenge, report, line);
    }

    this.validate = function validate(line) {
      return line.length > 0
    };
  };
}]);
