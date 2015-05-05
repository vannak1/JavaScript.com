// Maps a specific command to a specific handler.
// If none are found, runs as JavaScript.

angular.module('javascriptcom').factory('jsCommandFactory', ['_', 'jsHelpCommand', 'jsAnswerCommand', 'jsJavaScriptCommand', function(_, jsHelpCommand, jsAnswerCommand, jsJavaScriptCommand) {

  var matchers = [
    {
      pattern: /^answer\s*/,
      handler: jsAnswerCommand
    },
    {
      pattern: /[.|\s]*/,
      handler: jsJavaScriptCommand
    }
  ];

  function jsCommandFactory(command) {
    return _.find(matchers, function(m) {
      return command.match(m.pattern);
    }).handler;
  }

  return jsCommandFactory;
}]);
