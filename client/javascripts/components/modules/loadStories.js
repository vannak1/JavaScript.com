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
                '<a class="tct twb" href="' + story.url  + '">' + story.title + '</a>' +
              '</h2>' +
              '<p class="tcs tfh">' +
                'via ' + '<span class="twsb">' + story.name + '</span>' +
                ' | ' + '<time class="tsi">' + story.date + '</time>' +
                ' | ' + '<a class="' + commentClass(story.comment_count) + '" href="/news/' + story.slug + '#comments">View Discussion ' + commentNumber(story.comment_count) + '</a>' +
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
  //   Comment Class
  // -------------------------------------
  //
  // @param count { integer }
  //
  // -------------------------------------

  var commentClass = function(count) {
    return count > 2 ? 'link link--highlighted' : '';
  };

  // -------------------------------------
  //   Comment Number
  // -------------------------------------
  //
  // @param count { integer }
  //
  // -------------------------------------

  var commentNumber = function(count) {
    if (count > 0) {
      return '(' + count + ')';
    } else {
      return '';
    }
  };

  // -------------------------------------
  //   Toggle Button
  // -------------------------------------

  var _toggleButton = function(data) {
    var isMoreStories = data.more;

    if (!isMoreStories) {
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
