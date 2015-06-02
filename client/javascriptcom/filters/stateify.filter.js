angular.module('javascriptcom')
  .filter('stateify', ['$interpolate', function Stateify($interpolate) {
    return function(text, scope) {
      return $interpolate(text)(scope);
    };
  }]
);
