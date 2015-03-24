angular.module('javascriptcom').directive('jsChallenge', [function() {
  return {
    templateUrl: 'javascripts/javascriptcom/templates/challenge.html',
    replace: true,
    scope: {
      challenge: '='
    },
    bindToController: true,
    controllerAs: 'ctrl',
    controller: function jsChallengeController() {
      this.isActive = function() {
        return this.challenge.active;
      }
    }
  };
}]);
