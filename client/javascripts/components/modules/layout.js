// *************************************
//
//   Layout
//   -> Interface sections
//
// *************************************
//
// @param $element         { jQuery object }
// @param headerFixedClass { string }
//
// *************************************

JS.Modules.Layout = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  _$html    = $('html');
  _$body    = $('body');
  _settings = {};

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  init = function(options) {
    _settings = $.extend({
      $element         : $('.js-layout'),
      $form            : $('.js-layout-form'),
      headerFixedClass : 'is-layout-header-fixed'
    }, options);

    _setEventHandlers();
  }

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  _setEventHandlers = function() {
    _settings.$form.on('submit', function(event) {
        event.preventDefault();

        repositionHeader();
    });
  }

  // -------------------------------------
  //   Reposition Header
  // -------------------------------------

  repositionHeader = function() {
    scrolledDistance      = $(window).scrollTop();
    scrollAnimationLength = Math.min(scrolledDistance * 2, 400);

    _$html.animate({
      scrollTop: 0
    }, scrollAnimationLength);

    _$body.animate({
      scrollTop: 0
    }, scrollAnimationLength, function() {
      _$html.toggleClass(_settings.headerFixedClass);
    });
  }

  // -------------------------------------
  //   Public Methods
  // -------------------------------------

  return {
    init             : init,
    repositionHeader : repositionHeader
  }

})();

// -------------------------------------
//   Usage
// -------------------------------------
//
// JS.Modules.Layout.init();
// JS.Modules.Layout.repositionHeader();
//
