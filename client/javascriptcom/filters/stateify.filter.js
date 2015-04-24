angular.module('javascriptcom')
  .filter('stateify', ['jsCourseState', '$interpolate', function Stateify(jsCourseState, $interpolate) {
    return function(text, scope) {
      return $interpolate(text)(scope);
    };
  }]
);
