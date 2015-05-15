angular.module('javascriptcom').factory('jsCommand', ['_', 'jsCommandFactory', 'jsChallengeProgress', function(_, jsCommandFactory, jsChallengeProgress) {
  return function jsCommand(successCallback, errorCallback, messages) {
    var vm = this;
    vm.messages  = messages;

    function setErrorMessageType(message, fallback) {
      message = _.isArray(message) ? message[1].content.textContent : message;

      return message.match(/syntax error/i) ? 'error' : 'default';
    }

    function formatResponse(content, vm, report, type) {
      vm.messages.push({ value: _.isArray(content) ? content[1].content.textContent : content, type: !type ? setErrorMessageType(content) : type })
      report({ content: _.isArray(content) ? content[0].content : '' });
    }

    vm.handler = function parseCommand(line, report) {
      var command = jsCommandFactory(line);

      var challenge = jsChallengeProgress.activeChallenge();

      command(challenge, line).then(function(content) {
        formatResponse(content, vm, report, 'success')
        successCallback(challenge);
      }, function(content) {
        formatResponse(content, vm, report)
        errorCallback(challenge);
      });
    }

    vm.validate = function validate(line) {
      return line.length > 0
    };
  };
}]);
