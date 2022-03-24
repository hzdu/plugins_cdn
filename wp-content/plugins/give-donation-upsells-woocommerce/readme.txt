=== Give - Donation Upsells for WooCommerce ===
Contributors: givewp
Tags: donations, donation, ecommerce, e-commerce, fundraising, fundraiser, woocommerce
Requires at least: 4.9
Tested up to: 5.8
Requires PHP: 5.6
Stable tag: 1.2.0
Requires Give: 2.13.0
License: GPLv3
License URI: https://opensource.org/licenses/GPL-3.0

Allow your shop customers to donate at the cart or checkout in WooCommerce.

== Description ==

This plugin requires the Give plugin activated to function properly. When activated, it provides WooCommerce customers the ability to donate at the cart or checkout.

== Installation ==

= Minimum Requirements =

* WordPress 4.8 or greater
* WooCommerce 3.0.0 or greater
* PHP version 5.6 or greater
* MySQL version 5.0 or greater
* Some payment gateways require fsockopen support (for IPN access)

= Automatic installation =

Automatic installation is the easiest option as WordPress handles the file transfers itself and you don't need to leave your web browser. To do an automatic install of Give, log in to your WordPress dashboard, navigate to the Plugins menu and click Add New.

In the search field type "Give" and click Search Plugins. Once you have found the plugin you can view details about it such as the the point release, rating and description. Most importantly of course, you can install it by simply clicking "Install Now".

= Manual installation =

The manual installation method involves downloading our donation plugin and uploading it to your server via your favorite FTP application. The WordPress codex contains [instructions on how to do this here](http://codex.wordpress.org/Managing_Plugins#Manual_Plugin_Installation).

= Updating =

Automatic updates should work like a charm; as always though, ensure you backup your site just in case.

== Changelog ==
= 1.2.0: August 24th, 2021 =
* New: Updated to work with the latest version of GiveWP and its new revenue table
* New: Under the hood improvements for loading the add-on faster and more reliably

= 1.1.6: April 7th, 2020 =
* Fix: Improved support for various currency formats, such as commas for decimal separators and periods for thousands separators (popular in Europe), to prevent incorrect amount appearance in the donation giving section.
* New: Tested for compatibility with WooCommerce 4.0+.

= 1.1.5: December 16th, 2019 =
* Improvement: Updated the output styles so that they appear better across various themes and device resolutions.
* Improvement: When giving a custom amount the field highlights the entire content area for easier input for the donor.
* Fix: Updated the "Donation:" text to be more easily translatable by removing an extra whitespace character.
* Fix: Resolved an issue with changing text outputting html "select=selected" or "check=checked" in the actual content incorrectly.

= 1.1.4: October 8th, 2019 =
* Fix: Corrected a version number mismatch that was displaying updates available incorrect once the plugin already updated.

= 1.1.3: September 26th, 2019 =
* Fix: Ensure that if HTML does not display in the dropdown option for selecting a donation within the WooCommerce Cart or Checkout.
* Fix: When asking for a donation on the Checkout screen ensure that the donation is added properly and the total displayed correctly in the cart total.

= 1.1.2: July 12th, 2019 =
* Fix: Prevent fatal error from occurring when refunding purchases on certain versions of WooCommerce.

= 1.1.1: April 12th, 2019 =
* New: Added a snippet to make it easy for developers to customize the conditions for displaying the donation upsell by one or more product IDs, amounts, etc. [See the example snippet here](https://github.com/impress-org/give-snippet-library/tree/master/add-on-snippets/woocommerce-upsells).
* Fix: Resolved a WP-Admin issue with donation amounts becoming inaccurate when changing donation level ordering using drag and drop.

= 1.1.0: December 13th, 2018 =
* New: Donations now appear in the order preview modal within WooCommerce for quick and easy reference.
* Fix: Resolved a fatal error when updating donations collected through WooCommerce.
* Fix: Updating the cart within the WooCommerce admin while updating the donation was not properly reflecting the admin's changes.

= 1.0.4: September 26th, 2018 =
* Fix: Ensure that refunding an order through WooCommerce with a donation doesn't result in a fatal error.
* Fix: Prevent PHP warning "Invalid argument supplied for foreach()" when orders with donations are processed.
* Tweak: The plugin will no longer deactivate itself if minimum requirements are not met but rather disable itself until requirements are met.

= 1.0.3: August 23rd, 2018 =
* Fix: Resolved JS conflict affecting compatibility with other add-ons and plugins.

= 1.0.2: July 5th, 2018 =
* Tweak: Removed the "babel-polyfill" script that is now included in Give Core 2.1.7+

= 1.0.1 =
* Fix: Resolved licensing activation issue.
* Fix: Updated stable tag to proper version.

= 1.0.0 =
* Initial plugin release. Yippee!
