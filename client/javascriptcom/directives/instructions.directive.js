angular.module('javascriptcom').directive('jsInstructions', function jsInstructions(){
  return {
    templateUrl: 'templates/instructions.html',
    replace: true,
    scope: true,
    bindToController: true,
    controllerAs: 'ctrl',
    require: '^jsChallenge'
  };
});
