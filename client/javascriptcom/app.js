angular.module('javascriptcom', ['ngResource'])
  .config(['$httpProvider', function config($httpProvider) {
    $httpProvider.defaults.cache = true;
  }]);
