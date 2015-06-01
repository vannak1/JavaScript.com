angular.module('javascriptcom').factory('jsCommand', ['_', 'jsCommandFactory', 'jsChallengeProgress', function(_, jsCommandFactory, jsChallengeProgress) {
  return function jsCommand(successCallback, errorCallback) {
    var vm = this;

    function jsReportAdapter(content) {
      if(_.isArray(content)) { return content; }
      if(_.isObject(content) && content['content']) { return [content]; }
      return [{ content: content }];
    }

    vm.handler = function parseCommand(line, report) {
      var command = jsCommandFactory(line);

      var challenge = jsChallengeProgress.activeChallenge();

      command(challenge, line).then(function(content) {
        report(jsReportAdapter(content));
        successCallback(challenge);
      }, function(content) {
        report(jsReportAdapter(content));
        errorCallback(challenge);
      });
    }

    vm.validate = function validate(line) {
      return line.length > 0
    };
  };
}]);
