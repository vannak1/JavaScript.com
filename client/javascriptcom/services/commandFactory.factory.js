// Maps a specific command to a specific handler.
// If none are found, runs as JavaScript.

angular.module('javascriptcom').factory('jsCommandFactory', ['_', 'jsHelpCommand', 'jsHintCommand', 'jsJavaScriptCommand', function(_, jsHelpCommand, jsHintCommand, jsJavaScriptCommand) {

  var matchers = [
    {
      pattern: /^help\s*/,
      handler: jsHelpCommand
    },
    {
      pattern: /^hint\s*/,
      handler: jsHintCommand
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
