'use strict';
module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });
  
  Event.associate = function(models){
    this.hasMany(models.Method, {foreignKey: 'event_id'})
  };
  return Event;
};