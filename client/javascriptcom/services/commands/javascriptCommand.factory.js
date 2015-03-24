angular.module('javascriptcom').factory('jsJavaScriptCommand', ['$', '$q', 'Abecedary', 'jsCommandReport', function($, $q, Abecedary, jsCommandReport) {

  var iframeTemplate = [
    '<!DOCTYPE html>',
    '<html>',
    '  <head>',
    '    <title>Abecedary Tests</title>',
    '  </head>',
    '  <body>',
    '    <script src="/javascripts/abecedary-javascript-com.js"></script>',
    '  </body>',
    '</html>'
  ].join('\n');

  function generateResponse(content, className) {
    return { content: $("<div class='console-msg console-msg--"+(className ? className : '')+"'>"+content+"</div>")[0] };
  }

  function runJavaScriptCommand(challenge, line) {
    var deferred = $q.defer(),
        sandbox = new Abecedary('/iframe.html', iframeTemplate);

    sandbox.on('complete', function(results) {
      var response = [],
          result = new jsCommandReport(challenge, results),
          output = result.output();

      response.push(generateResponse(output));

      if(result.isSuccess()) {
        response.push(generateResponse('Correct!', 'success'));
        deferred.resolve(response);
      } else {
        response.push(generateResponse(result.failureMessage(), 'error'));
        deferred.reject(response);
      }
    });

    sandbox.run(line, challenge.tests);

    return deferred.promise;
  }

  return runJavaScriptCommand;
}]);
