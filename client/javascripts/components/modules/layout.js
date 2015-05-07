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

  var _$html    = $('html');
  var _$body    = $('body');
  var _settings = {};

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function(options) {
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

  var _setEventHandlers = function() {
    _settings.$form.on('submit', function(event) {
        event.preventDefault();

        repositionHeader();
    });
  }

  // -------------------------------------
  //   Reposition Header
  // -------------------------------------

  var repositionHeader = function() {
    var scrolledDistance      = $(window).scrollTop();
    var scrollAnimationLength = Math.min(scrolledDistance * 2, 400);

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
  };

})();

// -------------------------------------
//   Usage
// -------------------------------------
//
// JS.Modules.Layout.init();
// JS.Modules.Layout.repositionHeader();
//
