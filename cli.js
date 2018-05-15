#!/usr/bin/env node
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const path = require('path');
const fs = require('fs-extra');

const optionList = [
    { name: 'help', alias: 'h', type: Boolean, description: 'Display this help.' },
    { name: 'create', alias: 'c', type: String, description: 'Create a migration with the supplied name' },
    { name: 'up', alias: 'u', type: Boolean, typeLabel: '', description: 'Migrate up to most current migration.' },
    { name: 'down', alias: 'd', type: Boolean, typeLabel: '', description: 'Migrate down one migration.' },
    { name: 'to', alias: 't', type: String, typeLabel: '', description: 'Name of the migration to migrate to.' },
    {
        name: 'persistence',
        alias: 'p',
        type: String,
        typeLabel: '',
        description: 'Path to persistence layer, defaults to ../server/persistence',
    },
    { name: 'config', alias: 'C', type: String, typeLabel: '', description: 'Path to config, defaults to ./config' },
    {
        name: 'migrations',
        alias: 'm',
        type: String,
        typeLabel: '',
        description: 'Path to migrations, defaults to ./migrations',
    },
];

const options = commandLineArgs(optionList);

function createMigration(name, migrationDir) {
    const time = Date.now();
    const fullName = `${time.toString()}-${name}`;

    fs.copy(path.join(__dirname, '/skeleton.js'), path.join(migrationDir, `${fullName}.js`), error => {
        if (error) {
            console.log(error);
            process.exit(1);
        }

        console.log('New migration created: ', fullName);
        process.exit();
    });
}

function showUsage() {
    console.log(
        commandLineUsage([
            {
                header: 'Database migrations',
                content: "Run migrations against the configured server's database.",
            },
            {
                header: 'Options',
                optionList,
            },
        ]),
    );
}

function migrationCallback(error, migrations) {
    if (error) {
        console.log(error);
        process.exit(1);
    }

    if (migrations && migrations.length > 0) {
        console.log('Executed migrations: ', migrations.length);
        migrations.forEach(migration => {
            console.log(migration.file);
        });

        process.exit();
    }

    console.log('No migrations to execute');
    process.exit();
}

function parseOptions() {
    const migrations = options.migrations ? options.migrations : path.join(process.cwd(), './migrations');

    if ((!options.up && !options.down && !options.create) || (options.up && options.down) || options.help) {
        return showUsage();
    }

    if (options.create) {
        return createMigration(options.create, migrations);
    }

    const persistence = options.persistence
        ? require(options.persistence)
        : require(path.join(process.cwd(), '../server/persistence'));
    const config = options.config ? require(options.config) : require(path.join(process.cwd(), './config'));
    const migrate = require('./index');

    if (options.up) {
        return migrate(persistence, config, 'up', migrations, options.to, migrationCallback);
    }

    if (options.down) {
        return migrate(persistence, config, 'down', migrations, options.to, migrationCallback);
    }
}

parseOptions();
