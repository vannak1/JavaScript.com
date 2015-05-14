var slug = require('slug');
var shortid = require('shortid');

function createSlug(title) {
  var slug_title = slug(title) + "-" + shortid.generate();
  return slug_title.toLowerCase();
};

module.exports = {createSlug: createSlug};
