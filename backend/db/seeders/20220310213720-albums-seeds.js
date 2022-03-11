'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
      return queryInterface.bulkInsert('Albums', [
        {
          name: 'DefaultAlbum',
          user_id: 1,
          image_url: 'empty'
        }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete('Albums', {
        name: { [Op.in]: ['DefaultAlbum'] }
      }, {});
  }
};
