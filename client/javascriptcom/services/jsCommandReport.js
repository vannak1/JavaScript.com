// Represents a Mocha report object with a better interface

angular.module('javascriptcom').factory('jsCommandReport', [function() {

  function jsCommandReport(challenge, report) {
    this.challenge = challenge;
    this.report = report;

    this.isSuccess = function() {
      return this.report.failures.length == 0;
    }

    this.failureMessage = function() {
      return this.failure().message;
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
  }

  return jsCommandReport;
}]);
