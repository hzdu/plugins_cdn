=== Admin Language Per User ===
Contributors: unclego
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=6G9LJ5H8GHQ3S
Tags: translation, translations, i18n, admin, english, localization, backend, multisite
Requires at least: 3.0.1
Tested up to: 5.4
Stable tag: master
License: GPLv3 or later
License URI: http://www.gnu.org/licenses/gpl.html

Switch your backend administration panel in any installed language per user basis.

== Description ==

Lets you have your backend administration panel in english or any installed language, even if the rest of your blog is translated into another language. Language preferences can be set per user basis in user profile screen.

**Tested on MultiSite.**

**Deals with frontend ajax requests**

**Notice:** 
After release of WordPress 4.7 this plugin is a bit obsolete. 

In WordPress 4.7 users are able to select their preferred locale (language) when editing their profile. Plugin add exact same functionality to pre 4.7 WordPress.

I still maintain it for people with outdated WordPress sites. And the plugin is still usefull for sites with outdated plugins that not obey get_user_locale().
[More info](https://make.wordpress.org/core/2016/11/07/user-admin-languages-and-locale-switching-in-4-7/) 


== Installation ==

1. Download `admin-language-per-user.zip`
1. Unzip `admin-language-per-user.zip`
1. Upload the `admin-language-per-user` directory **(not its contents, the whole directory)** to `WP_PLUGIN_DIR` ( `/wp-content/plugins/` on common WP instalation )
1. Activate the plugin through the `Plugins` menu in WordPress
1. Go to user profile and choose backend language

== Frequently Asked Questions ==

No FAQ yet

== Screenshots ==
1. Wordpress admin screen

== Changelog ==
= 1.0.12 =
= Release date: April 8th, 2020 =
* compatible with Wordpress 5.4

= 1.0.11 =
= Release date: August 19th, 2018 =
* compatible with Wordpress 4.9.8

= 1.0.10 =
= Release date: June 18th, 2017 =
* compatible with Wordpress 4.8

= 1.0.9 =
= Release date: March 10th, 2017 =
* compatible with Wordpress 4.7.3
* Add obsolete notice to description

= 1.0.8 =
= Release date: December 16th, 2016 =
* compatible with Wordpress 4.7

= 1.0.7 =
= Release date: October 20th, 2016 =
* Fix user registration email notification. When user created from admin panel email send in default language
* add HR to highlight user profile admin language section
* add multisite tag

= 1.0.6 =
= Release date: September 8th, 2016 =
* compatible with Wordpress 4.6.1
* add H2 to user profile admin language section

= 1.0.5 =
= Release date: August 18th, 2016 =
* compatible with Wordpress 4.6

= 1.0.4 =
= Release date: July 4th, 2016 =
* compatible with Wordpress 4.5.3

= 1.0.3 =
= Release date: May 5th, 2016 =
* compatible with Wordpress 4.5.1 

= 1.0.2 =
= Release date: February 29th, 2016 =
* Cleanup user data on uninstall
* Minimum Wordpress version check on activation
* Disallow direct HTTP access.

= 1.0.1 =
= Release date: February 29th, 2016 =
* Don't add locale filter when not displaying wordpress admin panel

= 1.0.0 =
= Release date: February 2th, 2016 =
* Initial version.

== Upgrade Notice ==

= 1.0.2 =
Just do it!