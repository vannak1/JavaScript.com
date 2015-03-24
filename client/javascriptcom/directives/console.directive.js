angular.module('javascriptcom').directive('jsConsole', ['CSConsole', 'jsCommand', 'jsChallengeProgress', function(CSConsole, jsCommand, jsChallengeProgress) {
  return {
    templateUrl: 'javascripts/javascriptcom/templates/console.html',
    replace: true,
    scope: {
      challenge: '='
    },
    bindToController: true,
    controllerAs: 'ctrl',
    link: function(scope, element, attrs, ctrl) {
      function onConsoleSuccess() {
        ctrl.challenge.completed = true;
        jsChallengeProgress.next();
      }
      function onConsoleError() { }

      var el = $(element).find('.console-ui')[0];
      var command = new jsCommand(ctrl.challenge, onConsoleSuccess, onConsoleError);

      ctrl.csConsole = new CSConsole(el, {
        prompt: '> ',
        syntax: 'javascript',
        autoFocus: true,
        welcomeMessage: $('<p>Type <code>help</code> to see the help menu</p>')[0],
        commandValidate: command.validate,
        commandHandle: command.handler
      });


      $(element).on('click', function(e) {
        e.preventDefault();
        jsChallengeProgress.activate(ctrl.challenge);
      })
    },
    controller: function jsConsoleController() {
    }
  };
}]);
