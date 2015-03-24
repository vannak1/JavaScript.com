angular.module('javascriptcom').factory('jsCommand', ['_', 'jsCommandFactory', function(_, jsCommandFactory) {
  return function jsCommand(challenge, successCallback, errorCallback) {
    this.challenge = challenge;

    function jsReportAdapter(content) {
      if(_.isArray(content)) { return content; }
      if(_.isObject(content) && content['content']) { return [content]; }
      return [{ content: content }];
    }

    this.handler = function parseCommand(line, report) {
      var handler = jsCommandFactory(line);

      handler(challenge, line).then(function(content) {
        report(jsReportAdapter(content));
        successCallback();
      }, function(content) {
        report(jsReportAdapter(content));
        errorCallback();
      });
    }

    this.validate = function validate(line) {
      return line.length > 0
    };
  };
}]);
