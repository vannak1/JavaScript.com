// *************************************
//
//   Home
//   -> Dispatch events
//
// *************************************

JS.Pages.Home = function() {

  // -------------------------------------
  //   Classes
  // -------------------------------------

  new JS.Classes.Newsletter({
    $element : $('.js-homeNewsletter'),
    $error   : $('.js-homeNewsletter-error'),
    $form    : $('.js-homeNewsletter-form')
  });

  // -------------------------------------
  //   Modules
  // -------------------------------------

  JS.Modules.Console.init();

  // -------------------------------------
  //   Services
  // -------------------------------------

  JS.Services.expel({
    $toggle     : $('.js-alert-close'),
    elementNode : '.js-alert'
  });

  // -------------------------------------
  //   Local
  // -------------------------------------

  $('.js-inlineConsole-btn').on('click', function(event) {
    var name = $('.js-inlineConsole-input').val().replace(/['";]/g, '');

    document.cookie = JS.Globals.userNameCookie + '=' + name;
  });

};
