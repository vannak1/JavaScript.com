angular.module('javascriptcom').directive('jsCourse', ['$http', function($http) {
  return {
    templateUrl: 'javascripts/javascriptcom/templates/js-course.html',
    replace: true,
    link: function(scope, element, attrs) {
      scope.currentChallenge = scope.currentChallenge || 0;

      $http.get('/courses/' + attrs.course + '.json').success(function(data) {
        scope.challenges = data;
        scope.challenge  = scope.challenges[scope.currentChallenge];
      });
    }
  };
}]);
