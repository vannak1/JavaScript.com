angular.module('javascriptcom').factory('jsChallengeProgress', ['_', function(_) {

  var state = {
    courseCompleted: false,
    challenges: [],
    console: null,
    setChallenges: function setChallenge(challenges) {
      this.challenges = challenges;
    },
    next: function() {
      var challengeIndex = _.findIndex(this.challenges, { active: true });

      if(challengeIndex+1 == this.challenges.length) {
        this.courseCompleted                   = true;
        this.challenges[challengeIndex].active = false;

        return true;
      }

      this.challenges[challengeIndex].active = false;
      this.challenges[challengeIndex+1].active = true;

      this.challenges[challengeIndex+1].started = true;
    },

    activate: function(challenge) {
      if(this.activeChallenge() == challenge) {
        return true;
      }

      this.deactivateAll();
      if(challenge && !challenge.active) {
        challenge.active = true;
        challenge.started = true;
      }
    },

    deactivateAll: function() {
      _.each(this.challenges, function(challenge) {
        challenge.active = false;
      })
    },

    activeChallenge: function() {
      return _.find(this.challenges, { active: true });
    }
  }

  return state;
}]);
