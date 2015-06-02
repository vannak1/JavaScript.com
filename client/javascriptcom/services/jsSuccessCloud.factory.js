angular.module('javascriptcom').factory('jsSuccessCloud', ['jsChallengeProgress', function(jsChallengeProgress) {
  return {
    randInt: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    trigger: function() {
      var iconMarkup = '', delay,scale, xOffset, zIndex;

      for (var i = 0; i < 12; i++) {
        xOffset = this.randInt(18, 82);
        scale = this.randInt(5, 14) / 10;
        zIndex = scale < 1 ? -1 : 1;
        delay = this.randInt(0, 5) / 10;
        iconMarkup += "<div class='message-icon' style='left: " + xOffset + "vw; transform: scale(" + scale + "); z-index: " + zIndex + "'><div class='message-icon-item has-handle tci' style='animation-delay: " + delay + "s'><svg width='70' height='70' class='icon'><use xlink:href='#icon-check'></use></svg></div></div>";
      }

      $('body').append("<div class='message js-message'><p class='message-text'>Success!</p>" + iconMarkup + "</div>");

      setTimeout(function() {
        $('.js-message').remove();
      }, 2000);
    }
  }
}]);
