var fs   = require('fs');
var path = require('path');

var Course = {
  all() {
    return fs.readdirSync(path.join(__dirname, '..', 'courses'));
  },
  find(id) {
    if (this.all().indexOf(id) > -1) {
      files = fs.readdirSync(path.join(__dirname, '..', 'courses', id));

      return files.map(function(file) {
        return require(path.join(__dirname, '..', 'courses', id, file));
      });
    } else {
      return { error: `invalid course ${id}` };
    }
  }
}

module.exports = Course;
