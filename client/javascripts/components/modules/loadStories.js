// *************************************
//
//   Load Stories
//   -> Asynchronous story loader
//
// *************************************

JS.Modules.LoadStories = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings = {};

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function(options) {
    _settings = $.extend({
      $element        : $('.js-loadFeed'),
      $button         : $('.js-loadFeed-btn'),
      $list           : $('.js-loadFeed-list'),
      increment       : 10,
      offset          : 10,
      path            : '/news?page=',
      hiddenClass     : 'is-hidden'
    }, options);

    _setEventHandlers();
  };

  // -------------------------------------
  //   Append Stories
  // -------------------------------------

  var _appendStories = function(data) {
    var stories = data.flow,
        markup  = '';

    stories.forEach(function(story) {
      markup +=
        '<li class="list-item">' +
          '<article class="bucket">' +
            '<div class="bucket-media">' +
              '<img class="thumb" src="' + story.avatar_url + '" width="50"/>' +
            '</div>' +
            '<div class="bucket-content">' +
              '<h2 class="h h--3">' +
                '<a class="tct twb" href="/news/' + 'TODO: Add path' + '">' + story.title + '</a>' +
              '</h2>' +
              '<p class="tcs tfh">' +
                'via ' + '<span class="twsb">' + story.name + '</span>' +
                ' | ' + '<time class="tsi">' + 'TODO: Add date' + '</time>' +
              '</p>' +
              '<p class="tcs tfh">' + story.body + '</p>' +
            '</div>' +
          '</article>' +
        '</li>';
    });

    _settings.$list.append(markup);
  };

  // -------------------------------------
  //   Get Stories
  // -------------------------------------

  var _getStories = function() {
      $.get('/news?page=' + _settings.offset, function(data) {
        _appendStories(data);
        _toggleButton(data);
      });

      _settings.offset += _settings.increment;
  };

  // -------------------------------------
  //   Toggle Button
  // -------------------------------------

  var _toggleButton = function(data) {
    var stories = data.flow;

    if (stories.length < _settings.increment) {
      _settings.$button.addClass(_settings.hiddenClass);
    }
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {
    _settings.$button.on('click', function(){
      _getStories();
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
