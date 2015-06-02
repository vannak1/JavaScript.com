// *************************************
//
//   Application
//   -> Global scripts
//
// *************************************

// -------------------------------------
//   Namespace
// -------------------------------------

// ----- JavaScript.com ----- //

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
  homepageChallengeAnswer : /^['"][A-z-\.\s]*['"](;)?/
};

// -------------------------------------
//   Document Ready
// -------------------------------------

jQuery(function($) {

  // ----- Components ----- //

  // Classes

  new JS.Classes.FormValidator();

  // Modules

  JS.Modules.Console.init();
  JS.Modules.LoadStories.init();
  JS.Modules.SaveProgress.init();
  JS.Modules.Video.init();

  JS.Modules.Counter.init({
    onMinPreceeded: function(settings) {
      $('.js-counter-message-min').removeClass('is-hidden');
      $('.js-counter-message-max').addClass('is-hidden');
    },
    onMaxExceeded: function(settings) {
      $('.js-counter-message-max').removeClass('is-hidden');
      $('.js-counter-message-min').addClass('is-hidden');
    },
    onConditionsMet: function(settings){
      $('.js-counter-message-min').addClass('is-hidden');
      $('.js-counter-message-max').addClass('is-hidden');
    }
  });

});

// -------------------------------------
//   Inbox
// -------------------------------------

$('a:contains("Next Challenge")').on('click', function() {
  var name = $('.js-inlineConsole-input').val().replace(/['";]/g, '');

  document.cookie = 'try_name=' + name;
});

jQuery(function($) {
  $('.js-courseLayout-toggle').on('click', function(event) {
    $('.js-courseLayout').toggleClass('is-active')
  });
});
