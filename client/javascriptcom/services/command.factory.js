angular.module('javascriptcom').factory('jsCommand', ['_', 'jsCommandFactory', function(_, jsCommandFactory) {
  return function jsCommand(challenge, successCallback, errorCallback) {
    var vm = this;
    vm.challenge = challenge;

    function jsReportAdapter(content) {
      if(_.isArray(content)) { return content; }
      if(_.isObject(content) && content['content']) { return [content]; }
      return [{ content: content }];
    }

    vm.handler = function parseCommand(line, report) {
      var command = jsCommandFactory(line);

      command(vm.challenge, line).then(function(content) {
        report(jsReportAdapter(content));
        successCallback();
      }, function(content) {
        report(jsReportAdapter(content));
        errorCallback();
      });
    }

    vm.validate = function validate(line) {
      return line.length > 0
    };
  };
}]);
