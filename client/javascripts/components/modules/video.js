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
      console.log(event.which);
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
