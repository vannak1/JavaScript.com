angular.module('javascriptcom').directive('jsConsole', ['CSConsole', 'jsCommand', 'jsChallengeProgress', function(CSConsole, jsCommand, jsChallengeProgress) {
  return {
    templateUrl: 'templates/console.html',
    replace: true,
    scope: true,
    bindToController: true,
    controllerAs: 'ctrl',
    require: '^jsCourse',
    link: function(scope, element, attrs, ctrl) {
      var el = $(element).find('.console-ui')[0];

      var onSuccess = function onSuccess(challenge) {
        console.log('successful challenge!');
        challenge.completed = true;
        jsChallengeProgress.next();
      }

      var onFailure = function onFailure(challenge) {
        console.log('failed challenge!');
      }

      // Todo: Figure out how to make this work as a one time init
      var command = new jsCommand(onSuccess, onFailure, ctrl.messages);

      ctrl.csConsole = new CSConsole(el, {
        prompt: '> ',
        syntax: 'javascript',
        autoFocus: true,
        commandValidate: command.validate,
        commandHandle: command.handler
      });
    }
  };
}]);
