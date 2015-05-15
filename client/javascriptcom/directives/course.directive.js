angular.module('javascriptcom').directive('jsCourse', ['_', 'jsCourseChallengeResource', 'jsChallengeProgress', function(_, jsCourseChallengeResource, jsChallengeProgress) {
  return {
    replace: true,
    templateUrl: 'templates/course.html',
    scope: {
      course: '@'
    },
    bindToController: true,
    controllerAs: 'ctrl',
    controller: function jsCourseDirective(jsCourseChallengeResource, jsChallengeProgress) {
      this.challengeProgress = jsChallengeProgress;
      this.challenges        = jsCourseChallengeResource.query({ course: this.course });
      this.messages = [];

      this.challengeProgress.setChallenges(this.challenges);

      this.activateChallenge = function activateChallenge(_challenge) {
        this.challengeProgress.activate(_challenge)
        this.challenge = _challenge;
      }


      this.onWrapupPage = function onWrapupPage() {
        return jsChallengeProgress.activeChallenge() ? false : true;
      }
    }
  };
}]);
