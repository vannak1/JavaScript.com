angular.module('javascriptcom').directive('jsInstructions', ['_', 'jsChallengeProgress', 'jsCourseState', function jsInstructions(_, jsChallengeProgress, jsCourseState) {
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
        var csConsole = jsChallengeProgress.console,
            text = $(this).text().split('');

        csConsole.setValue('');

        _.each(text, function(character, index) {
          setTimeout(function() {
            csConsole.setValue(csConsole.getValue() + character);
          }, 100 * index);
        });

        csConsole.focus();
      });
    }
  };
}]);
