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
