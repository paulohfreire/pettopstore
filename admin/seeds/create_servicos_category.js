
exports.seed = function(knex) {
        return knex('categories').insert([
          {
            name: 'Serviços'
          }
      ]);
};
