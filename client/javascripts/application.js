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

  // ----- Vendor ----- //

  // Bootstrap

  $('[data-tooltip]').tooltip({
    animation  : false,
    container  : 'body',
    placement  : 'bottom',
    title      : function() {
      return $(this).data('tooltip');
    },
    viewport   : {
      selector : 'body',
      padding  : 10
    }
  });

});

// -------------------------------------
//   Inbox
// -------------------------------------

jQuery(function($) {

  // Hide sponsor links
  $('tr[style="background-color: #faf9dc;"]').hide();

  $('.js-courseLayout-toggle').on('click', function(event) {
    $('.js-courseLayout').toggleClass('is-active')
  });

});
