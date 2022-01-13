=== Fake Pay For WooCommerce ===

Contributors: agraddy
Author URI: https://www.dashboardq.com
Plugin URI: https://github.com/agraddy/wp-woo-fake-pay
Requires PHP:  5.6
Requires at least: 4.0
Tested up to: 5.6
Tags: woocommerce, payment gateway, payment gateways, test, fake
Stable tag: trunk
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

A simple pass-through WooCommerce payment gateway that can be used for testing orders with an admin account.

== Description ==

The WooCommerce Fake Pay plugin is a payment gateway for WooCommerce that allows admin users to checkout without having to enter any payment information. Simply choose the "Fake Pay" payment option on checkout and it will process the order as if you had paid with a real payment gateway.

This plugin is useful for testing a WooCommerce checkout flow on a production site where real users are making payments with real payment gateways. The real users will not see the Fake Pay option but logged in admin users will be able to use the Fake Pay option.

== Installation ==

1. Upload wp-woo-fake-pay to the `/wp-content/plugins` directory.
2. Make WooCommerce is installed.
3. Login to the Wordpress admin panel and go to the the plugins page. On the plugins page, activate the WooCommerce Fake Pay plugin.
4. Navigate to the WooCommerce > Settings > Checkout > Fake Pay page.
5. Enable the Fake Pay payment gateway and press the "Save changes" button.
6. The Fake Pay payment gateway is now active for admin users.

== Changelog ==

= 1.0.0 =
* Initial release

