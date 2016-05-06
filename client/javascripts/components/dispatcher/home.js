// *************************************
//
//   Home
//   -> Dispatch events
//
// *************************************

JS.Pages.Home = function() {

  // -------------------------------------
  //   Modules
  // -------------------------------------

  JS.Modules.Console.init();
  JS.Modules.Newsletter.init();

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
