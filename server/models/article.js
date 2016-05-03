'use strict';
module.exports = function(sequelize, DataTypes) {
  var Article = sequelize.define("Article", {
    approved: { type: DataTypes.BOOLEAN, defaultValue: false},
    slug: { type: DataTypes.STRING, notNull: true},
    title: { type: DataTypes.STRING, notNull: true},
    body: { type: DataTypes.STRING},
    url: { type: DataTypes.STRING},
    user_id: { type: DataTypes.INTEGER},
    published_at: {type: DataTypes.TIME}
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Article;
};
