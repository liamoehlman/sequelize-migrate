var mrPotatoHead = require('mr-potato-head'),
    abbott = require('abbott'),
    kgo = require('kgo');

module.exports = function(umzug, config){
    var locking = mrPotatoHead(config);

    function migrate(to, action, callback) {
        var migrateTo;

        if (to) {
            migrateTo = {
                to: to
            };
        }

        if (!~['up', 'down'].indexOf(action)) {
            return callback(new Error('No such action'));
        }

        kgo
        ('lock', locking.lock)
        ('migrate', ['!lock'], abbott(umzug[action](migrateTo)))
        ('unlock', ['!migrate'], locking.close)
        (['*', '!unlock'], function(error) {
            if (error) {
                console.log('Error running migrations, exiting ' + error);
                process.exit(1);
            }

            callback();
        });
    }

    return migrate;
};