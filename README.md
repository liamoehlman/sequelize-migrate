# sequelize-migrate
Standardised sequelize migration wrapper, takes a persistence.initialise function and a config object

## Usage
- Command line

``` bash
cd my-cool-project/migrations && sequelize-migrate -u
cd my-cool-project/migrations && sequelize-migrate -c my-cool-new-migration
```

- Programatically

``` javascript
const migrate = require('sequelize-migrate');

migrate(
    persistence, // persistence object with .initialise and .sequelise
    config, // database config
    action, // either 'up' or 'down'
    migrationPath, // full path to the existing migrations
    migration, // optional - migration to run
    callback
);
```
