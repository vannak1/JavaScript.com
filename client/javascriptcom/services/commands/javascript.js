angular.module('javascriptcom').factory('jsJavaScriptCommand', ['$', 'Abecedary', 'jsCommandReport', function($, Abecedary, jsCommandReport) {

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

  function runJavaScriptCommand(challenge, report, line) {
    var sandbox = new Abecedary('/iframe.html', iframeTemplate);

    sandbox.on('complete', function(results) {
      var response = [],
          result = new jsCommandReport(challenge, results),
          output = result.output();

      response.push(generateResponse(output));

      if(result.isSuccess()) {
        response.push(generateResponse('Correct!', 'success'));
      } else {
        response.push(generateResponse(result.failureMessage(), 'error'));
      }

      report(response);
    });

    sandbox.run(line, challenge.tests)
  }

  return runJavaScriptCommand;
}]);
