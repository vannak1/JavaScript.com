angular.module('javascriptcom').directive('jsChallenge', ['jsChallengeProgress', 'jsChallengeState', function(jsChallengeProgress, jsChallengeState) {
  return {
    templateUrl: 'javascripts/javascriptcom/templates/challenge.html',
    replace: true,
    scope: {
      challenge: '='
    },
    bindToController: true,
    controllerAs: 'ctrl',
    controller: function jsChallengeController(jsChallengeProgress, jsChallengeState) {
      this.state = jsChallengeState.state;

      this.onSuccess = function onSuccess(challenge) {
        challenge.completed = true;
        jsChallengeProgress.next();
      }

      this.onFailure = function onFailure(challenge) {
        console.log('challenge failure');
      }

      this.activate = function(challenge) {
        jsChallengeProgress.activate(challenge);
      }
    }
  };
}]);
