angular.module('javascriptcom').factory('jsHintCommand', function() {

  function runHintCommand(challenge, report) {
    report({ content: "hint called" });
  }

  return runHintCommand;
});
