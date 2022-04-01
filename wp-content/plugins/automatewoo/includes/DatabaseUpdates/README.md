# Database Updates

AutomateWoo uses database updates (migrations) to preform any required changes to the WordPress database.
This can happen after AutomateWoo is updated and a user with `manage_woocommerce` privileges chooses to initiate 
database update.

## Key points 
- Each database update corresponds to a specific plugin version.
- Database updates must be able to safely run multiple times without breaking anything. 
This is because sites can downgrade plugin versions.
- The database updates unfortunately still use "include based" loading rather than "class based" auto loading 

## How to add a new database update

1. Register the database update by adding the targeted version number to `\AutomateWoo\Installer::$db_updates`
1. Create the file: `includes\DatabaseUpdates\{$version}.php` where `$version` corresponds to the previous step
1. In the file add class that extends `\AutomateWoo\DatabaseUpdates\AbstractDatabaseUpdate`
1. Return a new instance of the class at the end of the file
1. In the new database update class
 - Set the `$version` property
 - Implement the `process()` method (see `\AutomateWoo\DatabaseUpdates\AbstractDatabaseUpdate::process`)
 - If you need to preform actions before or after the database process use the `start()` and `finish()` methods
