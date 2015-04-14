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
//   Document Ready
// -------------------------------------

jQuery(function($) {

  // ----- Components ----- //

  // Modules

  JS.Modules.Layout.init();

});

// -------------------------------------
//   Inbox
// -------------------------------------

jQuery(function($) {

  // Hide sponsor links
  $('tr[style="background-color: #faf9dc;"]').hide();

});
