"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    admin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    github_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: DataTypes.STRING,
    avatar_url: {type: DataTypes.STRING, allowNull: false}
  }, {
    classMethods: {
    }
  });

  return User;
};
