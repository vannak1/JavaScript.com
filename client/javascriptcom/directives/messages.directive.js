angular.module('javascriptcom').directive('jsMessages', function() {
  return {
    scope: true,
    templateUrl: 'templates/messages.html',
    replace: true,
    require: '^jsChallenge',
    controllerAs: 'ctrl',
    bindToController: true
  };
});
