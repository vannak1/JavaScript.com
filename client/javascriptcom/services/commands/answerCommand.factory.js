angular.module('javascriptcom').factory('jsAnswerCommand', ['$q', function($q) {

  function runAnswerCommand(challenge) {
    var deferred = $q.defer();
    deferred.reject('The answer would look something like this: ' + challenge.answer);
    return deferred.promise;
  }

  return runAnswerCommand;
}]);
