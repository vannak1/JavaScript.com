angular.module('javascriptcom').directive('jsConsole', ['$compile', function($compile) {
  return {
    templateUrl: 'javascripts/javascriptcom/templates/js-console.html',
    replace: true,
    link: function(scope, element) {
      scope.console = new CSConsole($(element).find('.console-ui')[0], {
        prompt: '> ',
        syntax: 'javascript',
        autoFocus: true,
        welcomeMessage: 'Type `help` to see the help menu',
        commandValidate: function(line) {
          return line.length > 0
        },
        commandHandle: function(line, report, prompt) {
          if (!parseCommand(line, report)) {
            console.log(line);
          }
        }
      });

      var displayHelpMenu = function(report) {
        var content = '<div class="console-msg console-msg--help">\n';
        content += '<ul>\n';
        content += '<li><code>help</code></li> - Display the help menu</li>\n';
        content += '<li><code>hint</code></li> - Displays a hint related to the error that you see</li>\n';
        content += '</ul>\n';
        content += '</div>';

        content = $compile(content)(scope)[0];

        report({ content: content });
      };

      var displayHint = function(report) {
        report({ content: 'TODO' });
      };

      var parseCommand = function(line, report) {
        switch (false) {
          case !line.match(/^help\s*/):
            displayHelpMenu(report);
            break;
          case !line.match(/^hint\s*/):
            displayHint(report);
            break;
          default:
            return false;
        }
      };
    }
  };
}]);
