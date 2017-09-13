'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    message_update: {
      type: DataTypes.STRING,
      allowNull: true
    },
    new_chat: {
      type: DataTypes.STRING,
      allowNull: true
    },
    new_message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_follow: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_unfollow: {
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