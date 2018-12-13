const mrPotatoHead = require('mr-potato-head');
const abbott = require('abbott');
const kgo = require('kgo');

module.exports = function(umzug, config) {
    config.dialect = 'mysql';

    const locking = mrPotatoHead(config);

    function migrate(to, action, callback) {
        let migrateTo;

        if (to) {
            migrateTo = {
                to,
            };
        }

        if (!~['up', 'down'].indexOf(action)) {
            return callback(new Error('No such action'));
        }

        kgo
        ('lock', locking.lock)
        ('migrate', ['!lock'], abbott(umzug[action](migrateTo)))
        ('unlock', ['!migrate'], locking.close, )
        (['*', '!unlock'], error => {
            if (error) {
                console.log(`Error running migrations, exiting ${error}`);
                process.exit(1);
            }

            callback();
        });
    }

    return migrate;
};
