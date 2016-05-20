// *************************************
//
//   Track Analytics Events
//   -> Add Google Analytics event handlers
//
// *************************************

JS.trackAnalyticsEvents = function () {

  // ----- Track Outbound Links ----- //

  $(document).on('click', 'a[href^=http]', function(){
    var url = $(this).attr('href');

    ga('send', 'event', 'outbound', 'click', url, {
      'transport': 'beacon'
    });
  });
};

// -------------------------------------
//   Usage
// -------------------------------------
//
// JS.trackAnalyticsEvents();
//
