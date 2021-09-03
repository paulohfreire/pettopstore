
exports.up = function(knex) {
    return knex.schema.createTable('clients', function (table) {
        table.increments('id');
        table.string('email');
        table.string('password');
        table.string('name');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('clients');
};
