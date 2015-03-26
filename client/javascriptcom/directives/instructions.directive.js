angular.module('javascriptcom').directive('jsInstructions', ['$compile', 'marked', 'jsChallengeState', function($compile, marked, jsChallengeState) {
  return {
    templateUrl: 'javascripts/javascriptcom/templates/instructions.html',
    replace: true,
    scope: true,
    bindToController: true,
    controllerAs: 'ctrl',
    require: '^jsChallenge'
  };
}]);
