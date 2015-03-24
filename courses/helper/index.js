var esprima = require('esprima'),
  estraverse = require('estraverse');

module.exports = {
  /*
   * code - the code to traverse through
   * cb   - this can be an object or a function. if it is a function it will
   *        execute and pass the `node` parameter for you to deal with everything
   *        yourself. if it is an object you can set a `find` value for the kind
   *        of `node.type` you're looking for and a `callback` for what to do once
   *        that type is found.
   *
   * todo: better doc
   */
  traverse: function(code, cb) {
    estraverse.traverse(esprima.parse(code), {
      enter: function(node) {
        if (typeof cb === 'object') {
          if (node.type === cb.find) {
            cb.callback(node);
          }
        } else if (typeof cb === 'function') {
          cb(node);
        }
      }
    });
  }
};
