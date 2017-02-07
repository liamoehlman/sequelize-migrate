var Umzug = require('umzug');

function logMigrationName(name) {
    console.log('Running -->', name);
}

function migrate(persistence, config, action, migrationPath, migration, callback) {
    var sequelize = persistence.createConnection(),
        umzug = new Umzug({
            storage: 'sequelize',
            storageOptions: {
                sequelize: sequelize
            },
            migrations: {
                path: migrationPath,
                params: [
                    sequelize.queryInterface || sequelize.getQueryInterface(),
                    sequelize.Sequelize
                ]
            }
        }).on('migrating', logMigrationName);

    var runMigration = require('./migrate')(umzug, config);

    runMigration(migration, action, callback);
}

module.exports = migrate;
