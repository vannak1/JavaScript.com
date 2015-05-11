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
  homepageChallengeAnswer : /^['"][A-z]*['"];/
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

      if (value.match(JS.Globals.homepageChallengeAnswer)) {
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

// *************************************
//
//   Toggle
//   -> Toggle state on given elements
//
// *************************************
//
// @param $element     { jQuery object }
// @param proximity    { string }
// @param event        { string }
// @param toggleClass  { string }
// @param activeClass  { string }
// @param initialState { function }
// @param onClick      { function }
// @param onMouseover  { function }
// @param onMouseout   { function }
//
// *************************************

JS.Modules.Toggle = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings = {};

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function(options) {
    _settings = $.extend({
      $element     : $('.js-toggle'),
      proximity    : 'next',
      event        : 'click',
      toggleClass  : 'is-hidden',
      activeClass  : 'is-active',
      initialState : null,
      onClick      : null,
      onMouseover  : null,
      onMouseout   : null
    }, options);

    _setEventHandlers();
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {
    switch (_settings.event) {
      case 'click':
        _handleClickEvent();
      case 'hover':
        _handleHoverEvent();
    }
  };

  // -------------------------------------
  //   Handle Click Event
  // -------------------------------------

  var _handleClickEvent = function() {
    _settings.$element.on('click', function(event) {
      event.preventDefault();
      var $element = $(this);

      if (_settings.onClick != null) {
        _settings.onClick(_settings);
      }

      _settings.$element.toggleClass(_settings.activeClass);

      switch (_settings.proximity) {
        case 'next':
          return $element.next().toggleClass(_settings.toggleClass);
        case 'prev':
          return $element.prev().toggleClass(_settings.toggleClass);
        case 'nextParent':
          return $element.parent().next().toggleClass(_settings.toggleClass);
        case 'prevParent':
          return $element.parent().prev().toggleClass(_settings.toggleClass);
        default:
          if (typeof _settings.proximity === 'object') {
            return _settings.proximity.toggleClass(_settings.toggleClass);
          } else {
            return $element.find(_settings.proximity).toggleClass(_settings.toggleClass);
          }
      }
    });
  };

  // -------------------------------------
  //   Handle Hover Event
  // -------------------------------------

  var _handleHoverEvent = function() {
    if (_settings.initialState) {
      _settings.initialState(_settings);
    }

    _settings.$element.on({
      mouseenter: function() {
        _handleHoverStateEvent($(this), 'on');
      },
      mouseleave: function() {
        _handleHoverStateEvent($(this), 'off');
      }
    });
  };

  // -------------------------------------
  //   Handle Hover State Event
  // -------------------------------------
  //
  // @param $element { object }
  // @param state    { string }
  //
  // -------------------------------------

  var _handleHoverStateEvent = function($element, state) {
    switch (state) {
      case 'on':
        if (_settings.onMouseover != null) {
          _settings.onMouseover(_settings);
        }
        $element.addClass(_settings.activeClass);
        break;
      case 'off':
        if (_settings.onMouseout != null) {
          _settings.onMouseout(_settings);
        }
        $element.removeClass(_settings.activeClass);
    }

    switch (_settings.proximity) {
      case 'next':
        _toggleClass($element.next());
      case 'prev':
        _toggleClass($element.prev());
      case 'nextParent':
        _toggleClass($element.parent().next());
      case 'prevParent':
        _toggleClass($element.parent().prev());
      default:
        if (typeof _settings.proximity === 'object') {
          _toggleClass(_settings.proximity);
        } else {
          _toggleClass($element.find(_settings.proximity));
        }
    }
  };

  // -------------------------------------
  //   Toggle Cass
  // -------------------------------------
  //
  // @param $element      { object }
  // @param classToToggle { string }
  //
  // -------------------------------------

  var _toggleClass = function($element, classToToggle) {
    if (classToToggle == null) {
      classToToggle = _settings.toggleClass;
    }

    if ($element.hasClass(classToToggle)) {
      $element.removeClass(classToToggle);
    } else {
      $element.addClass(classToToggle);
    }
  };

  // -------------------------------------
  //   Public Methods
  // -------------------------------------

  return {
    init: init
  };

})();

// -------------------------------------
//   Usage
// -------------------------------------
//
// JS.Modules.Toggle.init();
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

  var _settings  = {};
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

    // ----- Click: Hover ----- //

    _settings.$trigger.on('mouseover', function(event) {
      _settings.$video.attr('preload', 'true');
    });

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

// *************************************
//
//   Expel
//   -> Pest control
//
// *************************************
//
// @param $toggle     { jQuery object }
// @param elementNode { string }
//
// *************************************

JS.Services.expel = function(options) {
  var settings = $.extend({
    $toggle     : $('.js-expel-toggle'),
    elementNode : '.js-expel',
  }, options);

  settings.$toggle.on('click', function(event) {
    event.preventDefault();
    $(this).closest(settings.elementNode).remove();
  });
};

// -------------------------------------
//   Usage
// -------------------------------------
//
// JS.Services.expel();
//
