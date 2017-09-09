'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    last_method: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    }
  }, {
    hooks: {},
    timestamps:false
  });
  
  User.associate = function(models){
    this.hasMany(models.Method, {foreignKey: 'user_id'})
  };
  return User;
};