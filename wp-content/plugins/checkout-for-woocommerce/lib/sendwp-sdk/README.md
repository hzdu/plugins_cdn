## About
The SendWP SDK is intended for SendWP partners to include in their Wordpress Plugin, so that their users can receive Email Deliverability service with only a few clicks.

It is comprised of a **PHP** component, and a **Javascript** component, with responsibilities as follows:

### Javascript
 * When appropriate, send a request to the site's backend to trigger a download of the SendWP Wordpress plugin.
 * Redirect to the site's plugin page upon completion.

### PHP
 * Listen for download requests from the Javascript component, and initiate a silent download via the Plugins API.
 * Activate the plugin once the download is complete.
 * Verify that download and activation was successful.


## Using the SDK

* the prefix_ and textdomain should be adapted to your naming
* the partner ID needs to be defined in sendwp-init.php
* the sendwp-init.php file needs to be included in your file system ( the three files need to be in the same folder )
* prefix_sendwp_remote_install() js function can be called from your UI to trigger the SendWP registration process and connection