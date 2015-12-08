// *************************************
//
//   Newsletter Form
//   -> Email signup
//
// *************************************

JS.Modules.Newsletter = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings = {};

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function(options) {
    _settings = $.extend({
      $element            : $('.js-newsletter'),
      $form               : $('.js-newsletter-form'),
      $error              : $('.js-newsletter-error'),
      submittedClass      : 'is-submitted',
      hiddenClass         : 'is-hidden',
      newsletterTextClass : 'newsletter-text',
      newsletterTextCopy  : "Thanks! You're all set to receive the latest JavaScript&nbsp;news."
    }, options);

    _setEventHandlers();
  };

  // -------------------------------------
  //   Submit Form
  // -------------------------------------

  var _submitForm = function() {
    $.post('/subscribe', _settings.$form.serialize(), function(results) {
      console.log(results)
      if (results.error) {
        _updateInterface('error', results.error.error);
      } else {
        _updateInterface('success');
      }
    });
  };

  // -------------------------------------
  //   Update Interface
  // -------------------------------------

  var _updateInterface = function(type, message) {
    var newsletterTextCopy;

    if (message !== undefined) {
      newsletterTextCopy = message;
    } else {
      newsletterTextCopy = _settings.newsletterTextCopy;
    }

    _settings.$form.find('input').prop('disabled', true);

    if (type === 'success') {
      _settings.$element.addClass(_settings.submittedClass);
      _settings.$element.append("<p class='" + _settings.newsletterTextClass + "'>" + newsletterTextCopy + "</p>");
    } else {
      _settings.$error
        .text(newsletterTextCopy)
        .removeClass(_settings.hiddenClass);
    }
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {
    _settings.$form.on('submit', function(event){
      event.preventDefault();

      _submitForm();
    });
  };

  // -------------------------------------
  //   Public Methods
  // -------------------------------------

  return {
    init : init
  };

})();

// -------------------------------------
//   Usage
// -------------------------------------
//
// JS.Modules.LoadStories.init()
//
