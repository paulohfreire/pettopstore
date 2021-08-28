const bcrypt = require('bcrypt');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('clients').del()
    .then(function () {
      // Inserts seed entries
      return knex('clients').insert([
        {
          id: 1,
          name: 'Paulo Admin',
          email: 'paulo@exemplo.com',
          password: bcrypt.hashSync('123456', 10),
        },
      ]);
    });
};
