angular.module('javascriptcom').directive('jsConsole', ['CSConsole', 'jsCommand', function(CSConsole, jsCommand) {
  return {
    templateUrl: 'javascripts/javascriptcom/templates/console.html',
    replace: true,
    scope: true,
    bindToController: true,
    controllerAs: 'ctrl',
    require: '^jsChallenge',
    link: function(scope, element, attrs, ctrl) {
      var el = $(element).find('.console-ui')[0];
      var command = new jsCommand(ctrl.challenge, ctrl.onSuccess, ctrl.onFailure);

      ctrl.csConsole = new CSConsole(el, {
        prompt: '> ',
        syntax: 'javascript',
        autoFocus: true,
        welcomeMessage: $('<p>Type <code>help</code> to see the help menu</p>')[0],
        commandValidate: command.validate,
        commandHandle: command.handler
      });
    }
  };
}]);
