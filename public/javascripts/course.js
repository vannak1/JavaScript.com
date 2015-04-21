angular.module('javascriptcom', ['ngResource', 'ngAnimate'])
  .config(['$httpProvider', function config($httpProvider) {
    $httpProvider.defaults.cache = true;
  }]);

angular.module('javascriptcom').directive('jsChallenge', ['jsChallengeProgress', 'jsCourseState', function(jsChallengeProgress, jsCourseState) {
  return {
    templateUrl: 'javascripts/javascriptcom/templates/challenge.html',
    replace: true,
    scope: {
      challenge: '='
    },
    bindToController: true,
    controllerAs: 'ctrl',
    controller: function jsChallengeController(jsChallengeProgress, jsCourseState) {
      this.state = jsCourseState.state;

      this.onSuccess = function onSuccess(challenge) {
        challenge.completed = true;
        jsChallengeProgress.next();
      }

      this.onFailure = function onFailure(challenge) {
        console.log('challenge failure');
      }

      this.activate = function(challenge) {
        jsChallengeProgress.activate(challenge);
      }
    }
  };
}]);

angular.module('javascriptcom').directive('jsConsole', ['CSConsole', 'jsCommand', function(CSConsole, jsCommand) {
  return {
    templateUrl: 'javascripts/javascriptcom/templates/console.html',
    replace: true,
    scope: true,
    bindToController: true,
    controllerAs: 'ctrl',
    require: '^jsChallenge',
    link: function(scope, element, attrs, ctrl) {
      var el = $(element).find('.console-ui')[0];
      var command = new jsCommand(ctrl.challenge, ctrl.onSuccess, ctrl.onFailure);

      ctrl.csConsole = new CSConsole(el, {
        prompt: '> ',
        syntax: 'javascript',
        autoFocus: true,
        welcomeMessage: $('<p>Type <code>help</code> to see the help menu</p>')[0],
        commandValidate: command.validate,
        commandHandle: command.handler
      });
    }
  };
}]);

angular.module('javascriptcom').directive('jsCourse', ['_', 'jsCourseChallengeResource', 'jsChallengeProgress', function(_, jsCourseChallengeResource, jsChallengeProgress) {
  return {
    replace: true,
    templateUrl: 'javascripts/javascriptcom/templates/course.html',
    scope: {
      course: '@'
    },
    bindToController: true,
    controllerAs: 'ctrl',
    controller: function jsChallengeResourceController(jsCourseChallengeResource) {
      this.challenges = jsCourseChallengeResource.query({ course: this.course });
      jsChallengeProgress.setChallenges(this.challenges);

      this.activateChallenge = function(challenge) {
        jsChallengeProgress.activate(challenge)
      }
    }
  };
}]);

angular.module('javascriptcom').directive('jsInstructions', ['$compile', 'marked', 'jsCourseState', function($compile, marked, jsCourseState) {
  return {
    templateUrl: 'javascripts/javascriptcom/templates/instructions.html',
    replace: true,
    scope: true,
    bindToController: true,
    controllerAs: 'ctrl',
    require: '^jsChallenge'
  };
}]);

angular.module('javascriptcom').directive('jsSafeHtml', ['$sce', function SafeHtmlDirective($sce) {
  return {
    restrict: 'A',
    scope: {
      jsSafeHtml: "@"
    },
    template: "<div ng-bind-html='safeHtml'></div>",
    link: function(scope, element, attrs) {
      var unregister = scope.$watch('jsSafeHtml', setHtml);

      function setHtml(value) {
        if(!value) { return; }
        scope.safeHtml = $sce.trustAsHtml(value.replace(/^\s+|\s+$/g, ''));
        unregister();
      }
    }
  };
}]);

angular.module('javascriptcom')
  .filter('markdown', ['marked', function Markdown(marked) {
    return function(text) {
      return marked(text);
    };
  }]
);

angular.module('javascriptcom')
  .filter('stateify', ['jsCourseState', '$interpolate', function Stateify(jsCourseState, $interpolate) {
    return function(text, scope) {
      return $interpolate(text)(scope);
    };
  }]
);

angular.module('javascriptcom').factory('jsCourseChallengeResource', function($resource) {
  return $resource('/courses/:course/challenges.json', {}, {});
});

angular.module('javascriptcom').factory('jsCourseResource', function($resource) {
  return $resource('/courses/:course.json', {}, {});
});

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
        successCallback(vm.challenge);
      }, function(content) {
        report(jsReportAdapter(content));
        errorCallback(vm.challenge);
      });
    }

    vm.validate = function validate(line) {
      return line.length > 0
    };
  };
}]);

// Maps a specific command to a specific handler.
// If none are found, runs as JavaScript.

angular.module('javascriptcom').factory('jsCommandFactory', ['_', 'jsHelpCommand', 'jsHintCommand', 'jsJavaScriptCommand', function(_, jsHelpCommand, jsHintCommand, jsJavaScriptCommand) {

  var matchers = [
    {
      pattern: /^help\s*/,
      handler: jsHelpCommand
    },
    {
      pattern: /^hint\s*/,
      handler: jsHintCommand
    },
    {
      pattern: /[.|\s]*/,
      handler: jsJavaScriptCommand
    }
  ];

  function jsCommandFactory(command) {
    return _.find(matchers, function(m) {
      return command.match(m.pattern);
    }).handler;
  }

  return jsCommandFactory;
}]);

// Represents a Mocha report object with a better interface

angular.module('javascriptcom').factory('jsCommandReport', ['_', function(_) {
  function jsCommandReport(challenge, report) {
    this.challenge = challenge;
    this.report = report;

    this.isSuccess = function() {
      return this.report.failures.length == 0;
    }

    this.state = function() {
      return this.report.details.state;
    }

    this.successMessage = function() {
      return "Correct!";
    }

    this.failureMessage = function() {
      return this.failure() ?
        _.compact([this.failure().message, this.errorMessage()]).join(': ') :
        this.errorMessage();
    }

    this.output = function() {
      return this.report.details.output;
    }

    this.failure = function() {
      return this.challenge.failures[this.failureName()];
    }

    this.failureName = function() {
      return this.report.failures[0].title;
    }

    this.errorMessage = function() {
      if(this.isSuccess()) { return null; }

      var message = (this.report.failures[0]['err']) ? this.report.failures[0]['err'].message : null;

      if(message && message.match(/Unspecified AssertionError/)) {
        return null;
      } else {
        return message;
      }
    }
  }

  return jsCommandReport;
}]);

angular.module('javascriptcom').factory('jsExecutor', ['Abecedary', function(Abecedary) {
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
  var sandbox = new Abecedary('/iframe.html', iframeTemplate);
  return sandbox;
}]);

angular.module('javascriptcom').factory('jsChallengeProgress', ['_', function(_) {

  var state = {
    challenges: [],
    setChallenges: function setChallenge(challenges) {
      this.challenges = challenges;
    },
    next: function() {
      var challengeIndex = _.findIndex(this.challenges, { active: true });

      if(challengeIndex+1 == this.challenges.length) {
        alert('You have finished the course!');
        return true;
      }

      this.challenges[challengeIndex].active = false;
      this.challenges[challengeIndex+1].active = true;

      this.challenges[challengeIndex+1].started = true;
    },

    activate: function(challenge) {
      if(!challenge.active) {
        this.deactivateAll();
        challenge.active = true;
        challenge.started = true;
      }
    },

    deactivateAll: function() {
      _.each(this.challenges, function(challenge) {
        challenge.active = false;
      })
    }
  }

  return state;
}]);

angular.module('javascriptcom').factory('jsCourseState', ['_', function(_) {

  return {
    state: {},
    update: function(newState) {
      this.state = _.merge(this.state, newState)
    }
  };
}]);

angular.module('javascriptcom').factory('Abecedary', ['$window',
  function Abecedary($window) {
    return $window.Abecedary;
  }
]);

angular.module('javascriptcom').factory('CSConsole', ['$window',
  function CSConsole($window) {
    return $window.CSConsole;
  }
]);

angular.module('javascriptcom').factory('$', ['$window',
  function jQuery($window) {
    return $window.$;
  }
]);

angular.module('javascriptcom').factory('_', ['$window',
  function lodash($window) {
    return $window._;
  }
]);

angular.module('javascriptcom').factory('marked', ['$window',
  function marked($window) {
    return $window.marked;
  }
]);

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

angular.module('javascriptcom').factory('jsHintCommand', ['$q', function($q) {

  function runHintCommand(challenge) {
    var deferred = $q.defer();
    deferred.reject('hint called');
    return deferred.promise;
  }

  return runHintCommand;
}]);

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
