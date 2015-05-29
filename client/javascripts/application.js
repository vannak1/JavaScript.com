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
  homepageChallengeAnswer : /^['"][A-z]*['"](;)?/
};

// -------------------------------------
//   Document Ready
// -------------------------------------

jQuery(function($) {

  // ----- Components ----- //

  // Modules

  JS.Modules.Console.init();
  JS.Modules.Layout.init();
  JS.Modules.LoadStories.init();
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

jQuery(function($) {

  // Hide sponsor links
  $('tr[style="background-color: #faf9dc;"]').hide();


  $('a:contains("Next Challenge")').on('click', function() {
    var name = $('.js-inlineConsole-input').val().replace(/['";]/g, '');

    document.cookie = 'try_name=' + name;
  });
});
