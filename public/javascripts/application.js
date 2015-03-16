$(function() {
  // Hide sponsor links
  $('tr[style="background-color: #faf9dc;"]').hide();
})

angular.module('javascriptcom', []);

angular.module('javascriptcom').directive('jsCourse', function() {
  return {
    templateUrl: 'templates/js-course.html',
    replace: true
  };
});

angular.module('javascriptcom').directive('jsInstructions', function() {
  return {
    templateUrl: 'templates/js-instructions.html',
    replace: true
  };
});

angular.module('javascriptcom').directive('jsConsole', function() {
  return {
    templateUrl: 'templates/js-console.html',
    replace: true
  };
});
