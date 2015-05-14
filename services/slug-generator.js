var slug = require('slug');
var shortid = require('shortid');

function createSlug(title) {
  var slug_title = slug(title) + "-" + shortid.generate().toLowerCase();
  return slug_title;
};

module.exports = {createSlug: createSlug};
