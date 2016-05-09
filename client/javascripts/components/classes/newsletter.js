// *************************************
//
//   Newsletter
//   -> Run JS events based on current page
//      Credit: https://github.com/gitlabhq/gitlabhq/blob/master/app/assets/javascripts/dispatcher.js.coffee
//
// *************************************
//
// @param $element  { jQuery object }
// @param dataAttr  { string }
// @param events    { array (objects) }
//
// *************************************

JS.Classes.Newsletter = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  Newsletter.prototype._settings = {};

  // -------------------------------------
  //   Constructor
  // -------------------------------------

  function Newsletter(options) {
    this.options = options;
    this.init();
  }

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  Newsletter.prototype.init = function() {
    this._settings = $.extend({
      $element            : $('.js-newsletter'),
      $error              : $('.js-newsletter-error'),
      $form               : $('.js-newsletter-form'),
      hiddenClass         : 'is-hidden',
      newsletterTextClass : 'newsletter-text',
      newsletterTextCopy  : "Thanks! You're all set to receive the latest JavaScript&nbsp;news.",
      submittedClass      : 'is-submitted'
    }, this.options);

    this._setEventHandlers();
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  Newsletter.prototype._setEventHandlers = function() {
    var self = this;

    this._settings.$form.on('submit', function(event){
      event.preventDefault();

      self._submitForm();
    });
  };

  // -------------------------------------
  //   Submit Form
  // -------------------------------------

  Newsletter.prototype._submitForm = function() {
    var self = this;

    $.post('/subscribe', this._settings.$form.serialize(), function(results) {
      if (results.error) {
        self._updateInterface('error', results.error.error);
      } else {
        self._updateInterface('success');
      }
    });
  };

  // -------------------------------------
  //   Update Interface
  // -------------------------------------

  Newsletter.prototype._updateInterface = function(type, message) {
    var newsletterTextCopy;

    if (message !== undefined) {
      newsletterTextCopy = message;
    } else {
      newsletterTextCopy = this._settings.newsletterTextCopy;
    }

    if (type === 'success') {
      this._settings.$element.addClass(this._settings.submittedClass);
      this._settings.$element.append("<p class='" + this._settings.newsletterTextClass + "'>" + newsletterTextCopy + "</p>");

      this._settings.$form.prop('disabled', true);
    } else {
      this._settings.$error
        .text(newsletterTextCopy)
        .removeClass(this._settings.hiddenClass);
    }
  };

  // -------------------------------------
  //   Namespace
  // -------------------------------------

  return Newsletter;

})();
