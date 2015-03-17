angular.module('javascriptcom').directive('jsInstructions', function() {
  return {
    templateUrl: 'javascripts/javascriptcom/templates/js-instructions.html',
    replace: true,
    link: function(scope, element) {
      element.text(scope.challenges[0].instructions)
    }
  };
});
