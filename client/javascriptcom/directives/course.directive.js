angular.module('javascriptcom').directive('jsCourse', ['_', 'jsCourseChallengeResource', 'jsChallengeProgress', function(_, jsCourseChallengeResource, jsChallengeProgress) {
  return {
    replace: true,
    templateUrl: 'templates/course.html',
    scope: {
      course: '@'
    },
    bindToController: true,
    controllerAs: 'ctrl',
    controller: function jsChallengeResourceController(jsCourseChallengeResource, jsChallengeProgress) {
      this.challengeProgress = jsChallengeProgress;
      this.challenges        = jsCourseChallengeResource.query({ course: this.course });

      this.challengeProgress.setChallenges(this.challenges);

      this.activateChallenge = function(challenge) {
        this.challengeProgress.activate(challenge)
      }
    }
  };
}]);
