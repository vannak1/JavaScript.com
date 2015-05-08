// *************************************
//
//   Expel
//   -> Pest control
//
// *************************************
//
// @param $toggle     { jQuery object }
// @param elementNode { string }
//
// *************************************

JS.Services.expel = function(options) {
  var settings = $.extend({
    $toggle     : $('.js-expel-toggle'),
    elementNode : '.js-expel',
  }, options);

  settings.$toggle.on('click', function(event) {
    event.preventDefault();
    $(this).closest(settings.elementNode).remove();
  });
};

// -------------------------------------
//   Usage
// -------------------------------------
//
// JS.Services.expel();
//
