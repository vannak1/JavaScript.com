angular.module('javascriptcom').factory('jsHelpCommand', ['$', '$q', function($, $q) {
  var helpMessage = [
    '<div class="console-msg console-msg--help">',
    '  <p class="console-msg-title">The following commands are available:</p>',
    '  <ul>',
    '    <li><code>help</code> - Display the help menu</li>',
    '    <li><code>hint</code> - Displays a hint related to the error that you see</li>',
    '  </ul>',
    '</div>'
  ].join('\n');

  function runHelpCommand(challenge) {
    var message = $(helpMessage)[0];

    var deferred = $q.defer();
    deferred.reject(message);
    return deferred.promise;
  }

  return runHelpCommand;
}]);
