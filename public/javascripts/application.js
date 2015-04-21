// *************************************
//
//   Application
//   -> Global scripts
//
// *************************************

// -------------------------------------
//   Namespace
// -------------------------------------

var JS = {};
JS.Globals  = {},
JS.Classes  = {},
JS.Helpers  = {},
JS.Modules  = {},
JS.Services = {},
JS.Inbox    = {};

// -------------------------------------
//   Globals
// -------------------------------------

JS.Globals = {
  homepageChallengeAnswer : '"Gregg";'
};

// -------------------------------------
//   Document Ready
// -------------------------------------

jQuery(function($) {

  // ----- Components ----- //

  // Modules

  JS.Modules.Console.init()
  JS.Modules.Layout.init();
  JS.Modules.Video.init();

});

// -------------------------------------
//   Inbox
// -------------------------------------

jQuery(function($) {

  // Hide sponsor links
  $('tr[style="background-color: #faf9dc;"]').hide();

});

// *************************************
//
//   Console
//   -> Homepage faux challenge
//
// *************************************

JS.Modules.Console = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings = {};

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function( options ) {
    _settings = $.extend({
      $element       : $('.js-console'),
      $input         : $('.js-console-input'),
      correctClass   : 'is-correct',
      incorrectClass : 'is-incorrect'
    }, options );

    _settings.$input.focus();

    _setEventHandlers();
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {

    _settings.$element.on('submit', function(event) {
      event.preventDefault();

      var $element = $(this);
      var value = _settings.$input.val();

      if (value == JS.Globals.homepageChallengeAnswer) {
        $element.removeClass(_settings.incorrectClass);
        $element.addClass(_settings.correctClass);
      } else {
        $element.removeClass(_settings.correctClass);
        $element.addClass(_settings.incorrectClass);
        setTimeout(function() {
          $element.removeClass(_settings.incorrectClass);
        }, 500);
      }
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
// JS.Modules.Console.init()
//

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

// *************************************
//
//   Video
//   -> Homepage video modal
//
// *************************************
//
// @param $element    { jQuery object }
// @param $trigger    { jQuery object }
// @param $video      { jQuery object }
// @param $close      { jQuery object }
// @param $overlay    { jQuery object }
// @param overlayNode { string (selector) }
// @param closeNode   { string (selector) }
// @param activeClass { string }
//
// *************************************

JS.Modules.Video = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings =  {};
  var _video     = null;

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function(options) {
    _settings = $.extend({
      $element    : $('body'),
      $trigger    : $('.js-video-trigger'),
      $video      : $('.js-video-element'),
      $close      : $('<a href="#" class="video-close js-video-close" aria-label="close">&times;</a>'),
      $overlay    : $('<div class="video-overlay js-video-overlay"></div>'),
      overlayNode : '.js-video-overlay',
      closeNode   : '.js-video-close',
      activeClass : 'is-video-playing'
    }, options);

    _video = _settings.$video[0];

    _setEventHandlers();
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {

    // ----- Click: Trigger ----- //

    _settings.$trigger.on('click', function(event) {
      event.preventDefault();

      _toggle('open');
    });

    // ----- Click: Close ----- //

    $(document).on('click', _settings.closeNode, function(event) {
      event.preventDefault();

      _toggle('close');
    });

    // ----- Click: Overlay ----- //

    $(document).on('click', _settings.overlayNode, function(event) {
      _toggle('close');
    });

    // ----- Keydown: Escape ----- //

    $(document).on('keydown', function(event) {
      switch (event.which) {
        case 27:
          _toggle('close');
          break;
      }
    });

  };

  // -------------------------------------
  //   Toggle
  // -------------------------------------

  var _toggle = function(state) {
    switch(state) {

      case 'open':
        _settings.$element.prepend(_settings.$overlay);
        _settings.$overlay.prepend(_settings.$close);

        setTimeout(function() {
          _settings.$element.addClass(_settings.activeClass);
        }, 200);

        setTimeout(function() {
          _play();
        }, 1000);

        break;

      case 'close':
        _settings.$element.removeClass(_settings.activeClass);
        _pause();

        break;
    }
  };

  // -------------------------------------
  //   Play
  // -------------------------------------

  var _play = function() {
    _video.play();
  };

  // -------------------------------------
  //   Pause
  // -------------------------------------

  var _pause = function() {
    _video.pause();
  };

  // -------------------------------------
  //   Stop
  // -------------------------------------

  var _stop = function() {
    _video.stop();
  };

  // -------------------------------------
  //   Public Methods
  // -------------------------------------

  return {
    init : init
  };

})();
