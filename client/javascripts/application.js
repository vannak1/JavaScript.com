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
JS.Pages    = {},
JS.Services = {},
JS.Inbox    = {};

// -------------------------------------
//   Globals
// -------------------------------------

JS.Globals = {
  homepageChallengeAnswer : /^['"][A-z-\.\s]*['"](;)?/,
  userNameCookie          : 'try_name'
};

// -------------------------------------
//   Document Ready
// -------------------------------------

jQuery(function($) {

  // ----- Dispatcher ----- //

  new JS.Classes.Dispatcher({
    events: [
      { page  : 'home',      run : function() { JS.Pages.Home(); } },
      { match : 'news',      run : function() { JS.Pages.News(); } },
      { page  : 'news:new',  run : function() { JS.Pages.News.New(); } }
    ]
  });

});

// -------------------------------------
//   Inbox
// -------------------------------------

jQuery(function($) {
  $('.js-courseLayout-toggle').on('click', function(event) {
    $('.js-courseLayout').toggleClass('is-active')
  });
});
