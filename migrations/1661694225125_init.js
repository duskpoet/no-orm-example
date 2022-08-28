/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('users', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    name: {
      type: 'string',
      notNull: true,
    },
    age: {
      type: 'integer',
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('users');
};
