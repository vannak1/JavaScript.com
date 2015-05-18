angular.module('javascriptcom').directive('jsInstructions', ['jsChallengeProgress', 'jsCourseState', function jsInstructions(jsChallengeProgress, jsCourseState) {
  return {
    templateUrl: 'templates/instructions.html',
    replace: true,
    scope: true,
    bindToController: true,
    controllerAs: 'ctrl',
    require: '^jsChallenge',
    link: function(scope, element, attrs, ctrl) {
      ctrl.state = jsCourseState.state;

      $(element).on('click', 'code', function(e) {
        if(!jsChallengeProgress.console) { return true; }

        // Todo: incrementally add these in
        jsChallengeProgress.console.setValue($(this).text());
        jsChallengeProgress.console.focus();
      });
    }
  };
}]);
