angular.module('javascriptcom').factory('jsHelpCommand', ['$', function($) {
  var helpMessage = [
    '<div class="console-msg console-msg--help">',
    '  <p class="console-msg-title">The following commands are available:</p>',
    '  <ul>',
    '    <li><code>help</code> - Display the help menu</li>',
    '    <li><code>hint</code> - Displays a hint related to the error that you see</li>',
    '  </ul>',
    '</div>'
  ].join('\n');

  function runHelpCommand(challenge, report) {
    report({ content: $(helpMessage)[0] });
  }

  return runHelpCommand;
}]);
