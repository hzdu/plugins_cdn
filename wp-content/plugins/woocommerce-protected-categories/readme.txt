=== WooCommerce Protected Categories ===
Contributors: andykeith, barn2media
Tags: woocommerce, category, password, protection
Requires at least: 4.7
Tested up to: 5.9
Requires PHP: 5.6
Stable tag: 2.5.4
License: GNU General Public License v3.0
License URI: http://www.gnu.org/licenses/gpl-3.0.html

The only password protection plugin to lock down entire categories in your WooCommerce store.

== Description ==

The WooCommerce Protected Categories plugin lets you protect entire shop categories in your WooCommerce store.

You can protect categories using a simple password, or lock them to specific user roles or accounts.

Do you add products for different clients or customers and want each client to only see their products?
Or maybe you need a trade or wholesale area which is not visible to the public?

Now you can do this and more with WooCommerce Protected Categories.

== Installation ==

1. Go to Plugins -> Add New -> Upload and select the plugin ZIP file (see link in Purchase Confirmation Email).
1. Activate the plugin
1. Enter your license key under WooCommerce -> Settings -> Products -> Protected categories
1. Go to Products -> Categories and select an existing category or create a new one
1. Set the 'Visibility' to either Public, Protected or Private.
1. If you select 'Protected', you can choose whether to protect by password, user role or user account (or a combination of each).
1. If you select 'Private' only Administrators and Store Managers (i.e. users who can also view private posts) will be able to access the category.

== Frequently Asked Questions ==

Please refer to our [Knowledge Base](https://barn2.co.uk/kb-categories/wppc-kb/).

== Changelog ==

= 2.5.4 =
Release date 10 February 2022

 * Fix: fixed an issue that prevented passwords from being displayed when changing/switching protection type.
 * Test: Compatibility with WooCommerce 6.2.0.

= 2.5.3 =
Release date 08 February 2022

 * Deprecated: "Private categories" option. Private categories will continue to work, but it's recommend to switch to the more user-friendly "Role" option.
 * Tweak: Added a deprecation notice inside the category editing page.
 * Tweak: adjusted the order of certain options inside the setup wizard.
 * Tweak: adjusted the order of sections inside the plugin's settings page.
 * Tweak: updated language files.

<!--more-->

= 2.5.2 =
Release date 13 January 2022

 * Fix: ajax user search not firing due to invalidated nonce.
 * Test: Compatibility with WooCommerce 6.1.0.

= 2.5.1 =
Release date 06 January 2022

 * Tweak: search users via ajax when protecting categories by "users".
 * Fix: product category visibility settings displayed the text-domain instead of the real labels.
 * Test: Compatibility with WooCommerce 6.0.0.
 * Dev: Updated library code.

= 2.5.0 =
Release date 07 October 2021

 * New: Added setup wizard.
 * Tweak: Added compatibility with the upcoming WooCommerce admin menu.
 * Tweak: Javascript code consistency update.
 * Tweak: Updated language files.
 * Dev: Updated library code.

= 2.4.2 =
Release date 20 July 2021

 * Test: Compatibility with WooCommerce 5.5 and WordPress 5.8.
 * Dev: Updated library code.

= 2.4.1 =
Release date 1 May 2020

 * Test: Compatibility with WooCommerce 4.1 and WordPress 5.4.1.
 * Dev: Added Composer support.

= 2.4 =
Release date 1 April 2020

 * Fix: Change loading of stylesheet for login page to ensure it's always loaded correctly.
 * Fix: Bug with page title when main Shop page is used as central login page.
 * Fix: Minor bug in product categories list table in Dashboard.
 * Dev: Refactor plugin to use new architecture; deprecate old classes and functions for backwards compatibility.
 * Dev: Add new Barn2 license system and library.
 * Dev: Remove is_admin() checks on file includes.

= 2.3.3 =
Release date 12 March 2020

 * Tested up to WooCommerce 4.0 and WordPress 5.4.

= 2.3.2 =
Release date 21 January 2020

 * Fully tested with WordPress 5.3.2 and WooCommerce 3.9.
 * Move position of Visibility setting on Edit Category screen.

= 2.3.1 =
Release date 30 October 2019

 * Tested up to WordPress 5.3 and WooCommerce 3.8.

= 2.3 =
Release date 19 August 2019

 * Tested up to WooCommerce 3.7.
 * Removed backwards compatibility for old versions of WordPress and WooCommerce (WP < 4.4 and WC < 3.0).
 * Various minor changes to Barn2 library code.
 * Tweak to wording on settings page.

= 2.2.3 =
Release date 16 April 2019

 * Tested with WooCommerce 3.6, and replaced deprecated function warning.

= 2.2.2 =
Release date 19 March 2019

 * Fix: Bug when creating/editing categories if using an older version of WooCommerce (3.1 and below).

= 2.2.1 =
Release date 4 March 2019

 * Fix: Update to latest version of common code to prevent conflict with other Barn2 plugins.

= 2.2 =
Release date 21 February 2019

 * New: Improve category protection logic and provide better support for products in multiple categories.
 * New: Compatibility with WooCommerce Quick View Pro.
 * Fix: When 'Show protected products in store' was disabled, products in protected categories could sometimes still appear if the parent category was unlocked.
 * Fix: Products in multiple categories where one was unlocked could not be purchased from the shop page or archives.
 * Fix: Remove 'pass by reference' for query in pre_get_posts hook to prevent possible PHP warning.
 * Fix: Wrong protection type set when creating categories in admin.
 * Tweak: Added category-password-required class to password login page (body class).

= 2.1 =
Release date 10 January 2019

 * Fix: 'exclude_tree' option in get_terms is no longer overridden, but merged with the list of protected categories.
 * Fix: Issue which prevented the category_login shortcode unlocking some categories when used in a sidebar.
 * Fix: License activation bug for older versions of WooCommerce.
 * Various minor fixes and improvements.
 * Tested up to WordPress 5.0.3 and WooCommerce 3.5.3.

= 2.0 =
Release date 27 July 2018

 * New: User role and user account protection features. Product categories can now be protected by password, user role or user account, or a combination of all three.
 * New: Plugin renamed 'WooCommerce Protected Categories'.
 * New: Updated plugin settings page, including new user protection options.
 * New: Prevent search engine indexing for protected categories (previously set only for private categories).
 * New: Prevent caching for protected and private categories when using cache plugins (e.g. WP Rocket).
 * New: Updated display of password login form to improve compatibility across different themes.
 * New: Category visibility in Products > Categories menu now shows 'inherited' status when parent category is protected.
 * Fix: Prevent accidental login to multiple categories when two or more categories share the same password.
 * Fix: Central password login page - prevent access to categories which have changed status from 'protected' to 'public' or 'private'.
 * Fix: Products in two or more protected categories can now be unlocked by unlocking any one of its categories.
 * Fix: Ensure protected products are not purchasable from product tables in WooCommerce Product Table.
 * Tweak: Update HTML in woocommerce_template_loop_category_title to match WooCommerce.
 * Dev: Apply BEM CSS standards for password entry form and category visibility settings.
 * Dev: Tested up to WP 4.9.8 and WooCommerce 3.4.4.
 * Dev: Various new actions and filters.
 * Dev: Code restructure and improvements.

= 1.7.3 =
Release date 13 June 2018

 * New: Allow shortcodes to be used in login form message.
 * Tweak: Added license.txt for GPL.
 * Fix: Fatal error setting Category login page in plugin settings.

= 1.7.2 =
Release date 4 June 2018

 * New: Add separate stylesheet for front-end and remove inline styles from login form.
 * New: Added WPML config file.
 * New: Tested up to WP 4.9.6 and WC 3.4.1.
 * Tweak: Various code improvements; renamed admin classes.
 * Fix: Conflict with Cosmetro theme (and potentially other themes which override the woocommerce_template_loop_category_title function).
 * Fix: Template issue with Flatsome theme for products in protected categories.
 * Dev: Updated license code.

= 1.7.1 =
Release date 18 October 2017

 * Tested with WooCommerce 3.2.1.

= 1.7 =
Release date 6 October 2017

 * Add more options to [category_login] shortcode (button_text, label, etc).
 * Restructured plugin code and object creation - use dependency injection, and move hooks & filters out of constructors.
 * Fix potential issue in category login shortcode.
 * Fix bug in protection for WooCommerce shortcodes.
 * Additional multisite testing.

= 1.6.6 =
Release date 4 October 2017

 * Tested with latest versions of WooCommerce and WordPress.
 * Fix potential issue if category login shortcode runs in admin.

= 1.6.5 =
Release date 5 September 2017

 * Fix: Ensure password cookie is set correctly when no expiry set in plugin options.
 * Tweak: Restructured plugin initialisation and added extra utility functions.
 * Tweak: Updated plugin support links.
 * Tweak: Updated translations.

= 1.6.4 =
Release date 7 June 2017

 * Fix: Bug on product category archives when display type set to subcategories.

= 1.6.3 =
Release date 5 June 2017

 * Fix: Bug in get_terms_args filter which was causing incorrect display of product category pages.
 * Tweak: Tested with WordPress 4.8.

= 1.6.2 =
Release date 22 May 2017

 * Fix: PasswordHash class was not found under certain conditions.

= 1.6.1 =
Release date 5 May 2017

  * Fix: Bug for variable products for WooCommerce below v3.0.

= 1.6 =
Release date 25 April 2017

 * New: Plugin setting to control how long the password entered is valid before it expires.
 * New: Plugin settings to customise the login form - heading, password label, and label placeholder option.
 * New: Login form now shows error messages if no password or incorrect password entered.
 * Fix: The form message in plugin settings is now used if not set in shortcode.
 * Fix: Category login page can now be set to the main shop page.
 * Fix: Compatibility with WooCommerce 3.0.

= 1.5.3 =
Release date 3 February 2017

 * Fix: Revert error with password protected categories introduced in previous version.

= 1.5.2 =
Release date 3 February 2017

 * Fix: Compatibility issue with servers running older versions of PHP.
 * Tweak: Updated license code.

= 1.5.1 =
Release date 28 January 2017

 * New: Plugin option to set CSS class on password form container.
 * Fix: Bug with products in protected categories when 'show protected products' option disabled.
 * Tweak: Ensure category login shortcode works in widgets.
 * Tweak: Update license key code.

= 1.5 =
Release date 26 January 2017

 * New: Category login shortcode which allows customers or clients to login to their own product category by using a category password.
 * New: Plugin option to allow the 'category login' page to be set.
 * Fix: Bug with protected child categories which have a password protected parent.
 * Tweak: Change filter for category password form to 'wp_ppc_password_form' to prevent theme conflicts.
 * Tweak: Update license code and plugin updater.

= 1.4.2 =
Release date 5 January 2017

* Fix fatal error in WC_Category_Prefixer class.
* Update license activation code.
* Tested with WordPress 4.7.

= 1.4.1 =
Release date 21 November 2016

* Revert to default WordPress login code for setting password cookie.
* Styling improvements to category visibility option in admin.

= 1.4 =
Release date 16 November 2016

* New feature: support for multiple passwords for each category. The category is unlocked if any valid password is entered.
* Added plugin option to change button text on protected category form.
* Added Italian translation (credit: Libri Ehret).

= 1.3.4 =
Release date 3 November 2016

* Add protection for built-in WooCommerce shortcodes (recent products, sale products, featured products, best selling, etc)
* Update license validation code and fix error with license key activation
* Add link to documentation from Plugins page

= 1.3.3 =
Release date 16 September 2016

* Fixed PHP error when password protected category contains no products
* Added Spanish translation (credit: Victor Castillejos)

= 1.3.2 =
Release date 8 September 2016

* Fixed bug with filtering of protected & private categories introduced in WordPress 4.6
* Renamed utility functions to prevent conflicts with other themes/plugins
* Updated translations

= 1.3.1 =
Release date 31 August 2016

* Fixed bug with password being reset when using 'quick edit' to edit category
* Fixed bug with license validation code which prevented it working on servers earlier than PHP 5.5

= 1.3 =
Release date 26 August 2016

* Added support for the WooCommerce category shortcode [product_category]. When used on any page, widget, etc. your products will now be protected.
* Added new option to allow the password form to be customised to any wording you choose. Set this under WooCommerce -> Settings -> Products -> Password Protected Categories.
* Updated EDD Updater which handles the plugin updates
* Updated license key code

= 1.2.4 =
Release date 16 August 2016

* Update category protection logic to work with existing taxonomy queries
* Fix problem with category visibility option not working properly in certain themes
* Fix E_NOTICE errors generated on pages in some themes
* Fix error retrieving product categories for WordPress versions prior to 4.5

= 1.2.3 =
Release date 28 June 2016

* Ensure products in password protected categories cannot be added to the cart
* Improve error handling for license activation
* French translation added (credit: Yven Lebreton)
* Fix bug retrieving product category ancestors which resulted in unnecessary DB calls

= 1.2.2 =
Release date 9 May 2016

* New visibility option to show/hide password protected categories in navigation menus (see WooCommerce -> Settings -> Products -> Password Protected Categories)
* Updated main protection hooks to exclude categories during database queries rather than remove products afterwards
* Bug fix for certain themes to display password form correctly

= 1.2 =
Release date 21 April 2016

* Re-write main plugin architecture to improve database performance and caching

= 1.1.3 =
Release date 15 April 2016

* Update plugin licensing to work with servers using older versions of cURL
* Add link to settings from main WordPress Plugins page
* Test with WordPress 4.5 and WooCommerce 2.5.5

= 1.1.1 =
Release date 11 March 2016

* Fix compatibility issue with PHP 5.2

= 1.1 =
Release date 2 March 2016

* Added plugin settings page and license key registration.
* Added plugin options to show/hide password protected categories, and to prefix category names.

= 1.0 =
Release date 1 March 2016

* Initial release.