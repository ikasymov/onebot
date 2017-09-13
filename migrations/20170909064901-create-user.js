'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message_update: {
        type: Sequelize.STRING,
        defaultValue: 'defaultMethod'
      },
      new_chat: {
        type: Sequelize.STRING,
        defaultValue: 'defaultMethod'
      },
      new_message: {
        type: Sequelize.STRING,
        defaultValue: 'defaultMethod'
      },
      user_follow: {
        type: Sequelize.STRING,
        defaultValue: 'defaultMethod'
      },
      user_unfollow: {
        type: Sequelize.STRING,
        defaultValue: 'defaultMethod'
      },
      sender_id: {
        type: Sequelize.INTEGER,
        unique: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users');
  }
};