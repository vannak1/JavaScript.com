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
      submittedClass      : 'is-submitted',
      newsletterTextClass : 'newsletter-text',
      newsletterTextCopy  : "Thanks! You're all set to receive the latest JavaScript&nbsp;news."
    }, options);

    _setEventHandlers();
  };

  // -------------------------------------
  //   Submit Form
  // -------------------------------------

  var _submitForm = function() {
    $.post('/subscribe', _settings.$form.serialize());
  };

  // -------------------------------------
  //   Update Interface
  // -------------------------------------

  var _updateInterface = function() {
    _settings.$form.find('input').prop('disabled', true);

    _settings.$element.addClass(_settings.submittedClass);
    _settings.$element.append("<p class='" + _settings.newsletterTextClass + "'>" + _settings.newsletterTextCopy + "</p>");
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {
    _settings.$form.on('submit', function(event){
      event.preventDefault();

      _submitForm();
      _updateInterface();
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
