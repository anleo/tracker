let migrate = require('migrate');
let set = migrate.load('migrations/.migrate', 'migrations');

set.up(function (err) {
    if (err) throw err;

    console.log('Migration completed');
});