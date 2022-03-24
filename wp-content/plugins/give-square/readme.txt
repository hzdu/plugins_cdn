=== Give - Square Payment Gateway ===
Contributors: givewp
Tags: donations, donation, ecommerce, e-commerce, fundraising, fundraiser, square, gateway
Requires at least: 4.8
Tested up to: 5.3
Stable tag: 1.1.1
Requires Give: 2.4.0
License: GPLv3
License URI: https://opensource.org/licenses/GPL-3.0

Square Gateway add-on for Give.

== Description ==

This plugin requires the Give plugin activated to function properly. When activated, it adds a payment gateway for square.com.

== Installation ==

= Minimum Requirements =

* WordPress 4.8 or greater
* PHP version 5.3 or greater
* MySQL version 5.0 or greater

= Automatic installation =

Automatic installation is the easiest option as WordPress handles the file transfers itself and you don't need to leave your web browser. To do an automatic install of Give, log in to your WordPress dashboard, navigate to the Plugins menu and click Add New.

In the search field type "Give" and click Search Plugins. Once you have found the plugin you can view details about it such as the the point release, rating and description. Most importantly of course, you can install it by simply clicking "Install Now".

= Manual installation =

The manual installation method involves downloading our donation plugin and uploading it to your server via your favorite FTP application. The WordPress codex contains [instructions on how to do this here](http://codex.wordpress.org/Managing_Plugins#Manual_Plugin_Installation).

= Updating =

Automatic updates should work like a charm; as always though, ensure you backup your site just in case.

== Changelog ==

= 1.1.1: March 18th, 2020 =
* Fix: When a donor did not provide an "Address line 2" field it would result in an error from Square preventing the donation from processing.

= 1.1.0: February 27th, 2020 =
* Important: When you are updating to this version please ensure that you reconnect your Square account.
* New: Square's API has undergone significant updates and this update brings it up to date with all those changes. Specific updates include updating oAuth API to version 2.0, Locations API updated to v2, payment processing now using the new Payments API, and improvements to token renewals.
* New: Square now has a proper sandbox for testing so we have added a new "Connect to Square Sandbox" button within the admin.
* New: There is now a "Token Refresh" date field that displays within Square's WP-admin settings screen so you can more easily tell when the last refresh was and can even manually refresh it yourself. As well, there is also a line item under System Information for support.

= 1.0.4: July 29th, 2019 =
* New: When disconnecting the site from Square a notice now appears prompting the admin that any other sites connected to Give will also be disconnected. This is a requirement of the Square API and we are providing this to warn admins that other sites sharing the same Square connection will also be disconnected.
* Fix: Zero decimal currencies such as the Japanese Yen were not being passed properly to Square resulting in inaccurate totals at the gateway. If you're using a zero decimal currency please update to this version or higher immediately.
* Tweak: The Square connect notice now uses Give Core's class to display.

= 1.0.3: June 3rd, 2019 =
* Fix: Resolved "INVALID_REQUEST_ERROR" and "AUTHENTICATION_ERROR" errors when connecting to Square's API when using the advanced API key method.
* Tweak: Updated the Square PHP SDK to the latest minor release.
* Tweak: The Square add-on now required GiveWP 2.4.0+.

= 1.0.2: February 25th, 2019 =
* New: AES encryption is now used to access the Square access tokens from database for added security.
* Fix: Donation forms with more than 60 characters in the form title are now properly processed.
* Fix: Prevented minor JS error - "Uncaught TypeError: Cannot set property 'checked' of null on donation details page".

= 1.0.1: January 31st, 2019 =
* Fix: Ensure that donations process when the donation form title is more than 60 characters. The title will be truncated if the donation form titles exceed the Square API limit of 60 characters.

= 1.0.0: January 23rd, 2019 =
* Initial plugin release. Yippee!
