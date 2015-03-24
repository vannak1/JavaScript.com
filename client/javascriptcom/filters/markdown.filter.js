angular.module('javascriptcom')
  .filter('markdown', ['marked', function Markdown(marked) {
    return function(text) {
      return marked(text);
    };
  }]
);
