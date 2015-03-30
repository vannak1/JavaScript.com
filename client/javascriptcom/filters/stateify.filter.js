angular.module('javascriptcom')
  .filter('stateify', ['jsChallengeState', '$interpolate', function Stateify(jsChallengeState, $interpolate) {
    return function(text, scope) {
      return $interpolate(text)(scope);
    };
  }]
);
