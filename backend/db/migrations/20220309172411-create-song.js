'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Songs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
         allowNull: false,
        type: Sequelize.STRING(256)
      },
      song_url: {
         allowNull: false,
        type: Sequelize.TEXT
      },
      genre: {
         allowNull: false,
        type: Sequelize.JSONB
      },
      user_id: {
         allowNull: false,
        type: Sequelize.INTEGER
      },
      album_id: {
         allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Songs');
  }
};
