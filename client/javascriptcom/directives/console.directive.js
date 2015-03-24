angular.module('javascriptcom').directive('jsConsole', ['CSConsole', 'jsCommand', 'jsChallengeProgress', function(CSConsole, jsCommand, jsChallengeProgress) {
  return {
    templateUrl: 'javascripts/javascriptcom/templates/console.html',
    replace: true,
    scope: {
      challenge: '='
    },
    bindToController: true,
    controllerAs: 'ctrl',
    link: function(scope, element) {
      function onConsoleSuccess() {
        scope.challenge.completed = true;
        jsChallengeProgress.next();
      }
      function onConsoleError() { }

      var el = $(element).find('.console-ui')[0];
      var command = new jsCommand(scope.challenge, onConsoleSuccess, onConsoleError);

      var console = new CSConsole(el, {
        prompt: '> ',
        syntax: 'javascript',
        autoFocus: true,
        welcomeMessage: 'Type `help` to see the help menu',
        commandValidate: command.validate,
        commandHandle: command.handler
      });
    }
  };
}]);
