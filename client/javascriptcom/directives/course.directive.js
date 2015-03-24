angular.module('javascriptcom').directive('jsCourse', ['_', 'jsCourseChallengeResource', 'jsChallengeProgress', function(_, jsCourseChallengeResource, jsChallengeProgress) {
  return {
    replace: true,
    templateUrl: 'javascripts/javascriptcom/templates/course.html',
    scope: {
      course: '@'
    },
    bindToController: true,
    controllerAs: 'ctrl',
    controller: function jsChallengeResourceController(jsCourseChallengeResource) {
      this.challenges = jsCourseChallengeResource.query({ course: this.course });
      jsChallengeProgress.setChallenges(this.challenges);
    }
  };
}]);
