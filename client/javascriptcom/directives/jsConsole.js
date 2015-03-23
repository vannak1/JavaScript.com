angular.module('javascriptcom').directive('jsConsole', ['CSConsole', 'jsCommand', function(CSConsole, jsCommand) {
  return {
    templateUrl: 'javascripts/javascriptcom/templates/js-console.html',
    replace: true,
    link: function(scope, element) {
      var command = new jsCommand(scope.challenge),
          el = $(element).find('.console-ui')[0];

      scope.console = new CSConsole(el, {
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
