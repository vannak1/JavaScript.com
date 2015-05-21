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
        var csConsole = jsChallengeProgress.console,
            text      = $(this).text().split(''),
            timer     = (text.length > 15 ? 70 / 2 : 70),
            count     = 0,
            ticker;

        csConsole.setValue('');

        if (!ticker) {
          ticker = setInterval(function() {
            var letter = text[count];

            count += 1;

            if (letter) {
              csConsole.appendToInput(letter);
            } else {
              clearInterval(ticker);
              ticker = false;
            }
          }, timer);
        }

        csConsole.focus();
      });
    }
  };
}]);
