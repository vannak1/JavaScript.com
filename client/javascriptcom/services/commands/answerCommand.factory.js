angular.module('javascriptcom').factory('jsAnswerCommand', ['$q', function($q) {

  function runAnswerCommand(challenge) {
    var deferred = $q.defer();
    deferred.reject(challenge.answer);
    return deferred.promise;
  }

  return runAnswerCommand;
}]);
