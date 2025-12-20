const bcrypt = require('bcryptjs');

/**
 * User Seeder
 * This file contains the seed data for users.
 * 
 * Default user credentials:
 * Email: test@example.com
 * Password: password123
 */
const seedUsers = () => {
  return [
    {
      email: 'test@example.com',
      password: bcrypt.hashSync('password123', 10), // hashed password
    },
    // Add more users here if needed
    // {
    //   email: 'user2@example.com',
    //   password: bcrypt.hashSync('password456', 10),
    // },
  ];
};

module.exports = seedUsers;

