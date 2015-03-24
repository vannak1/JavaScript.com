angular.module('javascriptcom').factory('jsHintCommand', ['$q', function($q) {

  function runHintCommand(challenge) {
    var deferred = $q.defer();
    deferred.reject('hint called');
    return deferred.promise;
  }

  return runHintCommand;
}]);
