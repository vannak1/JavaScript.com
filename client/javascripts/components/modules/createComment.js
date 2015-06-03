// *************************************
//
//   Create Comment
//   -> Ajax creation of comment
//
// *************************************
//
// @param $element  { jQuery object }
// @param className { string }
//
// *************************************

JS.Modules.CreateComment = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings     = {};
  var _firstComment = false;

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function( options ) {
    _settings = $.extend({
      $element        : $('.js-createComment'),
      $number         : $('.js-createComment-number'),
      $container      : $('.js-createComment-container'),
      $emptyContainer : $('.js-createComment-empty'),
      listClass       : 'js-createComment-list'
    }, options );

    _settings.$list = $('.' + _settings.listClass);

    _setEventHandlers();
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {

    // ----- Submit ----- //

    _settings.$element.on('submit', function(event) {
      event.preventDefault();
      _postComment($(this));
    });

  };

  // -------------------------------------
  //   Post Comment
  // -------------------------------------

  var _postComment = function(form) {
    var url = form.attr('action');

    $.post(url, form.serialize(), function(data) {
      var comment = '';

      _firstComment = false;

      if (_settings.$container.hasClass('is-empty')) {
        _firstComment = true;
        comment       = _addFirstComment(data);
      } else {
        if (data.comment.isSpam) {
          comment = _addModerationComment(data);
        } else {
          comment = _addRegularComment(data);
        }
      }

      _appendComment(comment);
      _updateCommentNumber();
    });
  };

  // -------------------------------------
  //   Add Moderation Comment
  // -------------------------------------

  var _addModerationComment = function(data) {
    var comment = '';

    comment +=
      '<li class="list-item">' +
        '<p class="mbf tac tce tsi">Hang tight! Your comment needs to be moderated.</p>' +
      '</li>';

    return comment;
  };

  // -------------------------------------
  //   Add Regular Comment
  // -------------------------------------

  var _addRegularComment = function(data) {
    var comment = '';

    comment+=
      '<li id="comment-' + data.comment.id + '" class="list-item is-added">' +
        '<div class="bucket">' +
          '<div class="bucket-media">' +
            '<img class="thumb" src="' + data.comment.avatar_url + '" width="50">' +
          '</div>' +
          '<div class="bucket-content">' +
            '<p class="tfh">' +
              '<span class="mrs twb">' + data.comment.name + '</span>' +
              '<time class="tcs tsi">Today</time>' +
            '</p>' +
            '<p class="mbf">' + data.comment.body + '</p>' +
          '</div>' +
      '</li>';

    return comment;
  };

  // -------------------------------------
  //   Add First Comment
  // -------------------------------------

  var _addFirstComment = function(data) {
    var comment = '';

    comment+=
      '<li id="comment-' + data.comment.id + '" class="list-item is-added">' +
        '<div class="bucket">' +
          '<div class="bucket-media">' +
            '<img class="thumb" src="' + data.comment.avatar_url + '" width="50">' +
          '</div>' +
          '<div class="bucket-content">' +
            '<p class="tfh">' +
              '<span class="mrs twb">' + data.comment.name + '</span>' +
              '<time class="tcs tsi">Today</time>' +
            '</p>' +
            '<p class="mbf">' + data.comment.body + '</p>' +
          '</div>' +
        '</li>';

    return comment;
  };

  // -------------------------------------
  //   Append Comment
  // -------------------------------------

  var _appendComment = function(comment) {
    if (_firstComment) {
      _settings.$emptyContainer.remove();
      _settings.$list.removeClass('is-hidden');
    }

    _settings.$list.append(comment);
    _settings.$element.find('textarea').val('');
  };

  // -------------------------------------
  //   Update Comment Number
  // -------------------------------------

  var _updateCommentNumber = function() {
    var number = _settings.$number.text().split(' ')[0];

    number++;
    _settings.$number.text(number + ' Comments');
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
// Spellbook.Modules.CreateComment.init()
//
