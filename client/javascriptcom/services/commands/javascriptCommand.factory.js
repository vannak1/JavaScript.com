angular.module('javascriptcom').factory('jsJavaScriptCommand', ['$', '$q', 'jsExecutor', 'jsCourseState', 'jsCommandReport', function($, $q, jsExecutor, jsCourseState, jsCommandReport) {
  function generateResponse(content, className) {
    return { content: $("<div class='console-msg "+(className ? 'console-msg--'+className : '')+"'>"+content+"</div>")[0] };
  }

  function runJavaScriptCommand(challenge, line) {
    var deferred = $q.defer();

    function onComplete(results) {
      var response = [],
          result = new jsCommandReport(challenge, results),
          output = result.output();

      jsCourseState.update(result.state());

      response.push(generateResponse(output));

      if(result.isSuccess()) {
        response.push(generateResponse('Correct!', 'success'));
        jsExecutor.off('complete', onComplete);

        deferred.resolve(response);
      } else {
        response.push(generateResponse(result.failureMessage(), 'error'));
        deferred.reject(response);
      }
    }

    jsExecutor.on('complete', onComplete);
    jsExecutor.run(line, challenge.tests);

    return deferred.promise;
  }

  return runJavaScriptCommand;
}]);
