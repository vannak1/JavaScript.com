angular.module('javascriptcom', ['ngResource', 'ngAnimate'])
  .config(['$httpProvider', function config($httpProvider) {
    $httpProvider.defaults.cache = true;
  }]);
