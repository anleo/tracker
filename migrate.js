let migrate = require('migrate');
let set = migrate.load('migrations/.migrate', 'migrations');

set.up(function (err) {
    if (err) {
        console.error(err);
        err.stack && console.error(err.stack);
        return process.exit(1);
    }

    console.log('Migration completed');
    process.exit(0);
});