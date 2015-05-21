angular.module('javascriptcom').directive('jsConsole', ['CSConsole', 'jsCommand', 'jsChallengeProgress', '$cookies', 'jsCourseState', function(CSConsole, jsCommand, jsChallengeProgress, $cookies, jsCourseState) {
  return {
    templateUrl: 'templates/console.html',
    replace: true,
    scope: true,
    bindToController: true,
    controllerAs: 'ctrl',
    require: '^jsCourse',
    link: function(scope, element, attrs, ctrl) {
      var el = $(element).find('.console-ui')[0],
          tryName = $cookies.get('try_name');

      if (tryName) {
        jsCourseState.state.username = tryName;
        jsChallengeProgress.challenges[0].completed = true;
        jsChallengeProgress.next();
      }

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

      jsChallengeProgress.console = new CSConsole(el, {
        prompt: '> ',
        syntax: 'javascript',
        autoFocus: true,
        commandValidate: command.validate,
        commandHandle: command.handler
      });
    }
  };
}]);
