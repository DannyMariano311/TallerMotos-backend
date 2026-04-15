'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    // Hash password for initial admin user
    const saltRounds = 10;
    const adminPassword = 'Admin123!'; // CHANGE THIS PASSWORD IMMEDIATELY
    const password_hash = await bcrypt.hash(adminPassword, saltRounds);

    await queryInterface.bulkInsert('Users', [
      {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Administrator',
        email: 'admin@tallermotosapi.com',
        password_hash: password_hash,
        role: 'ADMIN',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Users', null, {});
  }
};
