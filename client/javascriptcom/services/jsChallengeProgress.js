angular.module('javascriptcom').factory('jsChallengeProgress', ['_', function(_) {

  var state = {
    challenges: [],
    setChallenges: function setChallenge(challenges) {
      this.challenges = challenges;
    },
    next: function() {
      var challengeIndex = _.findIndex(this.challenges, { active: true });

      if(challengeIndex+1 == this.challenges.length) {
        alert('You have finished the course!');
        return true;
      }

      this.challenges[challengeIndex].active = false;
      this.challenges[challengeIndex+1].active = true;

      this.challenges[challengeIndex+1].started = true;
    },

    activate: function(challenge) {
      if(!challenge.active) {
        this.deactivateAll();
        challenge.active = true;
        challenge.started = true;
      }
    },

    deactivateAll: function() {
      _.each(this.challenges, function(challenge) {
        challenge.active = false;
      })
    }
  }

  return state;
}]);
