// *************************************
//
//   Clean URL
//   -> Strip URL parameters
//
// *************************************

JS.Helpers.cleanUrl = function(url) {
  var anchor = document.createElement('a');

  anchor.href = url;

  return anchor.protocol + '//' + anchor.host + anchor.pathname;
}

// -------------------------------------
//   Usage
// -------------------------------------
//
// JS.Helpers.cleanUrl('https://example.com/?foo=bar#baz')
//
