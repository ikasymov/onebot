'use strict';
module.exports = function(sequelize, DataTypes) {
  var Method = sequelize.define('Method', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    last: {
      type: DataTypes.BOOLEAN,
      defaults: false,
      allowNull: true
    }
  },{
    timestamps: false
  });
  
  Method.associate = function(models){
    this.belongsTo(models.User, {foreignKey: 'user_id'});
    this.belongsTo(models.Event, {foreignKey: 'event_id'})
  };
  return Method;
};