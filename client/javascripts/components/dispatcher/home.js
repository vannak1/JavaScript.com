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
  JS.Modules.Video.init();

  // -------------------------------------
  //   Services
  // -------------------------------------

  JS.Services.expel({
    $toggle     : $('.js-alert-close'),
    elementNode : '.js-alert'
  });

};
