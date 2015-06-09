// *************************************
//
//   Edit Comment
//   -> Ajax editing of comment
//
// *************************************
//
// @param $element  { jQuery object }
// @param className { string }
//
// *************************************

JS.Modules.EditComment = (function() {

  // -------------------------------------
  //   Private Variables
  // -------------------------------------

  var _settings = {};

  // -------------------------------------
  //   Initialize
  // -------------------------------------

  var init = function( options ) {
    _settings = $.extend({
      $element   : $('.js-editComment'),
      $form      : $('.js-editComment-form'),
      $deleteBtn : $('.js-editComment-deleteBtn'),
      $saveBtn   : $('.js-editComment-saveBtn'),
      $textarea  : $('.js-editComment-textarea'),
      storySlug  : window.location.pathname.split('/')[2],
      token      : $('input[name="_csrf"]').val()
    }, options);

    _setEventHandlers();
  };

  // -------------------------------------
  //   Set Event Handlers
  // -------------------------------------

  var _setEventHandlers = function() {

    // ----- Form ----- //

    _settings.$form.on('submit', function(event) {
      event.preventDefault();
    });

    // ----- Delete Button ----- //

    _settings.$deleteBtn.on('click', function(event) {
      _deleteComment();
    });

    // ----- Save Button ----- //

    _settings.$saveBtn.on('click', function(event) {
      _saveComment($(this).closest(_settings.$element));
    });

  };

  // -------------------------------------
  //   Delete Comment
  // -------------------------------------

  var _deleteComment = function(parameters) {
    console.log( '_deleteComment()' );

    // Ajax to delete
  };

  // -------------------------------------
  //   Save Comment
  // -------------------------------------

  var _saveComment = function($element) {
    var id   = $element.data('id'),
        body = $element.find(_settings.$textarea).val();

    $.ajax({
      beforeSend : function(xhr) { xhr.setRequestHeader('csrf-token', _settings.token); },
      url        : '/news/' + _settings.storySlug + '/comment/' + id,
      type       : 'put',
      data       : { body: body }
    });
  }

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
// Spellbook.Modules.EditComment.init()
//
