angular.module('javascriptcom').factory('jsChallengeProgress', ['_', function(_) {

  var state = {
    challenges: [],
    setChallenges: function setChallenge(challenges) {
      this.challenges = challenges;
    },
    next: function() {
      var challengeIndex = _.findIndex(this.challenges, { active: true });

      if(challengeIndex >= this.challenges.length) {
        return true;
      }

      this.challenges[challengeIndex].active = false;
      this.challenges[challengeIndex+1].active = true;
    }
  }

  return state;
}]);
