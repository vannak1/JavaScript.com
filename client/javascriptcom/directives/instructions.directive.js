angular.module('javascriptcom').directive('jsInstructions', function() {
  return {
    templateUrl: 'javascripts/javascriptcom/templates/instructions.html',
    replace: true,
    scope: {
      challenge: '='
    },
    bindToController: true,
    controllerAs: 'ctrl',
    controller: function() {}
  };
});
