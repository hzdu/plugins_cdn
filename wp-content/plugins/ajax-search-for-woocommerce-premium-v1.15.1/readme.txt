=== FiboSearch - Ajax Search for WooCommerce  ===
Contributors: damian-gora, matczar
Tags: woocommerce search, ajax search, search by sku, product search, woocommerce
Requires at least: 5.0
Tested up to: 5.8
Requires PHP: 7.0
Stable tag: 1.13.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

The most popular WooCommerce product search plugin. Gives your users a well-designed advanced AJAX search bar with live search suggestions.

== Description ==

The most popular **WooCommerce product search plugin**. It gives your users a well-designed advanced AJAX search bar with live search suggestions.

By default, WooCommerce provides a very simple search solution, without live product search or even SKU search. FiboSearch (Ajax Search for WooCommerce) provides advanced search with live suggestions.

Who doesn’t love instant, as-you-type suggestions? In 2021, customers expect smart product search. Baymard Institute’s latest UX research reveals that search autocomplete, auto-suggest, or an instant search feature **is now offered on 96% of major e-commerce sites**. It's a must-have feature for every online business that can’t afford to lose customers. Why? FiboSearch helps users save time and makes shopping easier. As a result, Fibo really boosts sales.

= Features =
&#9989; **Search by product title, long and short description**
&#9989; **Search by SKU**
&#9989; Show **product image** in live search results
&#9989; Show **product price** in live search results
&#9989; Show **product description** in live search results
&#9989; Show **SKU** in live search results
&#9989; **Mobile first** – special mobile search mode for better UX
&#9989; **Details panels** with extended information – **“add to cart” button** with a **quantity field** and **extended product** data displayed on hovering over the live suggestion
&#9989; **Easy implementation** in your theme - embed the plugin using a **shortcode**, as a **menu item** or as a **widget**
&#9989; **Terms search** – search for product categories and tags
&#9989; **Limit** displayed suggestions – the number is customizable
&#9989; **The minimum number of characters** required to display suggestions – the number is customizable
&#9989; **Better ordering** – a smart algorithm ensures that the displayed results are as accurate as possible
&#9989; **Support for WooCommerce search results page** - after typing enter, users get the same results as in FiboSearch bar
&#9989; **Grouping instant search results by type** – displaying e.g. first matching categories, then matching products
&#9989; **Google Analytics** support
&#9989; Multilingual support including **WPML**, **Polylang** and **qTranslate-XT**
&#9989; **Personalization** of search bar and autocomplete suggestions - labels, colors, preloader, image and more

= Try the PRO version =
FiboSearch also comes in a Pro version, with a modern, inverted index-based search engine. FiboSearch Pro works up to **10× faster** than the Free version or other popular search solutions for WooCommerce.

[Upgrade to PRO and boost your sales!](https://fibosearch.com/pricing/?utm_source=readme&utm_medium=referral&utm_content=pricing&utm_campaign=asfw)

= PRO features =

&#9989; **Ultra-fast search engine** based on the inverted index – works very fast, even with 100,000+ products
&#9989; **Fuzzy search** – works even with minor typos
&#9989; **Search in custom fields** with dedicated support for ACF
&#9989; **Search in attributes**
&#9989; **Search in categories**. Supports category thumbnails.
&#9989; **Search in tags**
&#9989; **Search in brands** (We support WooCommerce Brands, Perfect Brands for WooCommerce, Brands for WooCommerce, YITH WooCommerce Brands). Supports brand thumbnails.
&#9989; **Search by variation product SKU** – also shows variable products in live search after typing in the exact matching SKU
&#9989; **Search for posts** – also shows matching posts in live search
&#9989; **Search for pages** – also shows matching posts in live search
&#9989; **Synonyms**
&#9989; **Conditional exclusion of products**
&#9989; **TranslatePress** compatible
&#9989; Professional and fast **help with embedding** or replacing the search bar in your theme
&#9989; and more...
&#9989; SEE ALL PRO [FEATURES](https://fibosearch.com/pro-vs-free/?utm_source=readme&utm_medium=referral&utm_content=features&utm_campaign=asfw)!

= Showcase =
See how it works for others: [Showcase](https://fibosearch.com/showcase/?utm_source=readme&utm_medium=referral&utm_campaign=asfw&utm_content=showcase&utm_gen=utmdc).

= Feedback =
Any suggestions or comments are welcome. Feel free to contact us via the [contact form](https://fibosearch.com/contact/?utm_source=readme&utm_medium=referral&utm_campaign=asfw&utm_content=contact&utm_gen=utmdc).

== Installation ==

1. Install the plugin from within the Dashboard or upload the directory `ajax-search-for-woocommerce` and all its contents to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Go to `WooCommerce → FiboSearch` and set your preferences.
4. Use a shortcode `[fibosearch]` or go to the `Appearance → Menu` and add menu item `FiboSearch` or go to the `Appearance → Widgets` and choose `FiboSearch`

== Frequently Asked Questions ==

= How do I embed the search bar in my theme? =
There are five easy ways to display the FiboSearch bar in your theme:

– **As a menu item** - in your WordPress admin panel, go to `Appearance → Menu` and add `FiboSearch bar` as a menu item
– **Using a shortcode**

`[fibosearch]`

– **As a widget** - in your WordPress admin panel, go to `Appearance → Widgets` and choose `FiboSearch`

– **Using PHP**

`<?php echo do_shortcode('[fibosearch]'); ?>`

– **We will do it for you!** - we offer free search bar implementation for Pro users. Become one now!

Or insert this function inside a PHP file (often, it is used to insert a form inside page template files):

= How do I replace the existing search bar in my theme with FiboSearch? =
We have prepared a one-click replacement of the search bar for the following themes:

*  Storefront
*  Divi
*  Flatsome
*  OceanWP
*  Astra
*  Avada
*  Sailent
*  and 30 more... See a complete list of integrated themes on [our documentation](https://fibosearch.com/documentation/themes-integrations/?utm_source=readme&utm_medium=referral&utm_campaign=asfw&utm_content=theme-integrations).


If you want to replace your search bar in another theme, please [contact our support team](https://fibosearch.com/contact/?utm_source=readme&utm_medium=referral&utm_campaign=asfw&utm_content=contact&utm_gen=utmdc).
We will assist with replacing the search bar in your theme for free after you upgrade to the Pro version.

= Can I add the search bar as a WordPress menu item? =
**Yes, you can!** Go to `Appearance → Menu`. You will see a new menu item called “FiboSearch”. Select it and click “Add to menu”. Done!

= How can I ask a question? =
You can submit a ticket on the plugin [website](https://fibosearch.com/contact/?utm_source=readme&utm_medium=referral&utm_campaign=asfw&utm_content=contact&utm_gen=utmdc) and the support team will get in touch with you shortly. We also answer questions on the [WordPress Support Forum](https://wordpress.org/support/plugin/ajax-search-for-woocommerce/).

= Do you offer customization support? =
Depending on the theme you use, sometimes the search bar requires minor improvements in appearance. We guarantee fast CSS corrections for all Pro plugin users, but we also help Free plugin users.

= Where can I find plugin settings? =
In your WordPress dashboard, go to `WooCommerce → FiboSearch`. The FiboSearch settings page is a submenu of the WooCommerce menu.

= Who is the Pro plugin version for? =
The Pro plugin version is for all online sellers looking to **increase sales** by providing an ultra-fast smart search engine to their clients.

The main difference between the Pro and Free versions is search speed and search scope. The Pro version has a new fast smart search engine. For some online stores that offer a lot of products for sale, search speed can be increased **up to 10×**, providing a whole new experience to end users.

All in all, the Pro version is dedicated to all WooCommerce shops where autocomplete suggestions work too slowly.

You can read more and compare Pro and Free features here: [Full comparison - Pro vs Free](https://fibosearch.com/pro-vs-free/).

== Screenshots ==

1. Search suggestions with a details panel
2. Search suggestions
3. Search suggestions with a details panel
4. Settings page
5. Settings page

== Changelog ==

= 1.13.0, July 27, 2021 =
* ADD: Integration with "eStore" theme
* ADD: Allow to open search result in new tab with Ctrl+left mouse key
* ADD: Integration with "Custom Product Tabs for WooCommerce" plugin
* ADD: Ability to search in the content generated by the specified shortcodes
* ADD: Integration with WooCommerce Memberships plugin
* ADD: New filter to manipulating products score
* ADD: Integration with "Premmerce Brands for WooCommerce" plugin
* ADD: New test for the troubleshooting module - add test if MySQL server has support to InnoDB engine
* FIX: Disappearing suggestions and details panel on click when there were more search bars.
* FIX: Improved integration with "Avada" theme
* FIX: Improved mobile search in new version of "Rehub" theme
* FIX: Unable to use context menu and middle mouse button on search results
* FIX: "Eletro" theme - Support cases when the search overlay is disabled
* FIX: Identifying error "MySQL server has gone away"
* FIX: Brand related filters can now be used in a theme
* FIX: Change empty DB_HOST for IPv4 address
* FIX: PHP Warning in the indexer logs (rare case): array_values() expects parameter 1 to be array, null given
* FIX: TranslatePress - randomly untranslated URLs of objects as they were added to the index
* REFACTOR: Clean up composer files

= 1.12.0, June 22, 2021 =
* ADD: Integration with Electro theme
* ADD: New test for the troubleshooting module - test language codes
* ADD: New test for the troubleshooting module - check if the Elementor Pro has defined correct template for search results
* ADD: Support for “ACF” fields in the “Search in custom fields” list
* ADD: Support for “ACF Table” field in the “Search in custom fields” list
* ADD: New test for the troubleshooting module - test if the index was built by the current plugin version
* ADD: New test for the troubleshooting module - test "Out of stock" relationships
* ADD: Compatibility with “Permalink Manager for WooCommerce” plugin
* ADD: Support for qTranslate-XT
* FIX: “WOOF – Products Filter for WooCommerce” - disappearing filters if “Dynamic recount” and “Hide empty terms” was enabled and other issues
* FIX: Remove unnecessary AJAX request on select “See all products ... (X)”
* FIX: The search form is now generated without random ID, to be compatible with the LiteSpeed Cache plugin
* FIX: TranslatePress v1.9.8 and higher - results on the search page were different from the results in the autocomplete
* FIX: Order terms by total_products if there is the same score
* FIX: Better index rebuild enforcement when the plugin version changes
* FIX: PHP WARNING json_decode() expects parameter 1 to be string, array given
* FIX: Not using the getmypid() function when it has been disabled
* FIX: Do not index term if isn't associated with any object
* FIX: The "Search in description" option now also applies to variations of products
* FIX: Reindex related products after edit/delete term. Applies to category, tag, brand and attribute
* FIX: Add another alternative location of wp-load.php file: wordpress/wp-load.php
* REFACTOR: Change .dgwt-wcas-suggestion element from &lt;div&gt; to &lt;a&gt; to allow open a suggestion in a new tab

= 1.11.0, May 24, 2021 =
* ADD: Integration with Goya theme
* ADD: Integration with Top and Top Store Pro theme
* ADD: Keep the state of a details panel in memory instead of replacing it every time using jQuery.html() method. Doesn't clear quantity and "add to cart" states.
* ADD: Prevent submit empty form 
* ADD: Possibility to index only products belonging to the indicated categories, tags or groups of attributes
* ADD: Show category thumbnails in autocomplete suggestions
* ADD: Show brand thumbnails in autocomplete suggestions
* FIX: W3 validator warning: The type attribute for the style element is not needed and should be omitted.
* FIX: Search terms with apostrophes
* FIX: Synchronization with the native WooCommerce option "Out of stock visibility" 
* FIX: Hiding an unnecessary line in the product details when there is no description
* FIX: Adding polyfill for supporting “includes” in Internet Explorer 11
* FIX: Better elements positioning on the "Starting" tab on the plugin settings page
* FIX: Support for custom Google Analytics object name
* FIX: Better handling “plus” and “minus” buttons for a quantity field
* FIX: Uncaught Error: Call to a member function get_review_count() on null
* FIX: Displaying the search box off screen on mobile devices
* FIX: Correct way for rebuilding autocomplete feature on an input by manually recalling dgwtWcasAutocomplete(). Remove more events on dispose method
* FIX: Highlight single chars in autocomplete results
* FIX: Add trim on query value
* FIX: Clear search title and phrase from escape characters
* FIX: Indexer errors when only one language is active in WPML
* FIX: Rebuilding index when WPML active languages change
* FIX: Composer - allow to use PHP 7.0.x
* FIX: Variations are also excluded when the "Exclude 'out of stock' products" option is active
* FIX: AJAX endpoint search.php now send a proper empty response if language is invalid
* FIX: Identifying an indexer error related to a database connection limit
* FIX: Indexing variations when updating a single product
* FIX: Logging indexer timeout warning and show solution for it when indexer stuck
* FIX: Exclude terms in search result matched by "Exclude/include products" option
* FIX: “WOOF – Products Filter for WooCommerce” - correct results after using filter or pagination and counters next to the filters
* FIX: InnoDB engine forcing in index tables
* REFACTOR: Standardize filters name and define indexer set items count in one place
* CHANGE: Decrease searchable indexer set items count from 100 to 50

= 1.10.0, April 22, 2021 =
* ADD: Possibility to disable select event on suggestions (click and hit the Enter key)
* ADD: Possibility to disable submit a search form via a filter
* ADD: New tool for debugging a indexer
* ADD: Notifying user (via icon) of an indexer error or index build delay
* ADD: Improving a search index build in the background
* ADD: New light method for building a search index - synchronously mode
* FIX: Not working click event on suggestions after using “back arrow” on a Safari browser
* FIX: Allow to recognize Chinese lang codes such as zh-hant and zh-hans
* FIX: Error on PHP 8. Wrong format for printf function
* FIX: When searching for something and then clicking “back arrow”, the “✕” for closing remained
* FIX: Wrong path in restoration theme
* FIX: Better checking of nonces
* FIX: Handle efficiently long queries by limiting characters and tokens when searching
* FIX: Correct handling of terms in which characters can be written differently eg. “läßt” and “lässt”
* FIX: Sort search results by popularity - “desc” instead “asc”
* FIX: Better detection when the indexer is stuck
* FIX: Skip collecting irrelevant MySQL errors by Query Monitor
* FIX: Troubleshooting - improvement of checking database connection by PDO
* FIX: Duplicate attributes in the variant title
* FIX: Indexer errors when only one language is active in TranslatePress
* FIX: Integration with WooCommerce Product Filter by WooBeWoo - no products with AJAX filtering
* FIX: Unnecessary sorting when fetching products with search results
* FIX: Allow to delete product from an index after making order
* FIX: Limit the search scope for multiple keywords as single letters
* REFACTOR: Troubleshooting - improved detection of problems with WP-Cron
* REFACTOR: Better indexer error handling
* REFACTOR: Build an index for variants in a separate background process
* REFACTOR: Build an index for taxonomies in a separate background process
* REMOVE: Excessive scheduler actions fixer was removed


= 1.9.0, March 15, 2021 =
* ADD: Support for WooCommerce Private Store plugin
* ADD: TranslatePress integration
* ADD: New test for the troubleshooting module - test if PDO can connect to DB
* ADD: Support for search products, post and pages with no translation in WPML (WPML settings: "Translatable - use translation if available or fallback to default language")
* CHANGE: Plugin rebranding -  Replace the plugin name AJAX Search for WooCommerce with new name FiboSearch
* CHANGE: Plugin rebranding -  Replace the old domain ajaxsearch.pro with new fibosearch.com
* CHANGE: Plugin rebranding -  Update visual assets 
* CHANGE: Updated Freemius SDK to v2.4.2
* CHANGE: New alternate shortcode [fibosearch] instead of [wcas-search-form]
* CHANGE: Min supported version of PHP is 7.0
* FIX: Fixed Chrome lighthouse insights
* FIX: Missing of dgwt-wcas-active class when the search was focused too early
* FIX: Grammar and spelling errors in texts
* FIX: Not firing jQuery onLoad event for some browsers
* FIX: Fixed PHP Warning: json_decode() expects parameter 1 to be string, array given
* FIX: Speed up placeholder search engine when 
* REMOVE: Removed useless dgwt-wcas-search-submit name attribute
* REMOVE: Removed unused search forms from a Avada theme
* REFACTOR: Move product related logic from Updater.php to Product.php

= 1.8.2, February 06, 2021 =
* ADD: Support for Astra theme
* ADD: Support for Avada theme - replacing a fusion search form
* ADD: Support for Open Shop theme
* ADD: Support for Divi - menu in custom header and hiding search results when opening a search overlay
* ADD: Support for CiyaShop theme
* ADD: Support for BigCart theme
* FIX: Increase the clickable area of the 'back button' in the overlay mobile mode
* FIX: Disappearing search bar especially on Firefox
* FIX: Hide new aggressive admin notices added by other plugins
* FIX: Hide shortcodes in the Details Panel
* FIX: Divi theme integration - Prevent to focus input if it isn't empty. Fix case with more search bars in #main-header selector
* FIX: Adaptation to the new class name convention of WooCommerce Product Table plugin
* FIX: Fixed display of category names and tags in the Details Panel when the name contains an apostrophe
* ADD: New option to exclude products belonging to the indicated categories, tags or groups of attributes
* ADD: New test for the troubleshooting module - valid search results
* ADD: New test for the troubleshooting module - check if WooCommerce Multilingual is active when site uses WPML
* ADD: New test for the troubleshooting module - check if conflicted plugin YITH WooCommerce Ajax Search is installed
* ADD: Integration with WooCommerce Catalog Visibility Options plugin
* ADD: Integration with B2BKing plugin
* ADD: Integration with Brands for WooCommerce plugin by BeRocket
* ADD: Integration with brands solution delivered by WP Bingo themes
* ADD: Limit the number of fields to be searched using the native engine when the search index is not ready
* FIX: Support for other language code like xx-xx
* FIX: Add attributes names of variations for search suggestions
* FIX: Easiest way of removing the search index from the database
* FIX: Bug related to run the search index process in loop for timezone GMT+11 and similar
* FIX: Incorrect language for post/pages
* FIX: Avoiding infinite index rebuilding when there are no products
* FIX: Add alternate WP loading path for Themosis Framework

= 1.8.1, December 04, 2020 =
* ADD: Support for Rehub theme
* ADD: Support for Supro theme
* FIX: Troubleshooting module improvements
* FIX: Blinking suggestions
* FIX: Bug in icon colors
* FIX: Flatsome theme - quantity buttons issue
* FIX: Divi theme - hide extra search bar in footer
* FIX: Mobile overlay improvements for iPhones
* FIX: Better suggestion order for non latin letters
* FIX: Action URL in search form when Polylang is active
* REMOVE: Mobile Detect library 
* FIX: Performance - prevent queuing redundant actions in Action Scheduler and remove unnecessary
* FIX: Undefined function admin_url() during some search request

= 1.8.0, October 23, 2020 =
* ADD: Support for Sober theme
* ADD: Support for Divi theme
* ADD: Support for Block Shop theme
* ADD: Support for Enfold theme
* ADD: Support for Restoration theme
* ADD: Support for Salient theme
* ADD: Support for Konte theme
* ADD: New filter and action hooks
* ADD: &lt;br&gt; to HTML whitelist for search suggestions
* ADD: Allow to add search icon as menu item
* ADD: Allow to change colors of search icon
* CHANGE: Updated Freemius SDK to v2.4.1
* CHANGE: Replace old close "x" icon with Material Design icons
* FIX: Empty search results on search results page 
* FIX: Support Touchpad click for some devices
* FIX: Mixed Content on the plugin settings page in some cases
* FIX: Integration with Flatsome theme
* FIX: Broken translations via WPML String Translation
* ADD: Troubleshooting module on the plugin settings page
* ADD: Support for Hyyan WooCommerce Polylang Integration plugin
* ADD: Integration with WooCommerce Wholesale Prices plugin - visibility of products and prices
* FIX: Wrong time in Scheduling Indexing feature
* FIX: Bug in synonyms regex
* FIX: Add primary keys to few DB tables to improve compatibility with DigitalOcean hosting
* FIX: Automatic select variation suggestion after submit the form
* FIX: Support for WooCommerce Products Visibility - show products if there are no rules yet
* FIX: Improved integration with JetSmartFilters and JetWooBuilder plugins
* FIX: Support for adoptive options feature in Product Filter for WooCommerce (by XforWooCommerce) plugin
* FIX: Issues related to high CPU usage
* FIX: Improved checking if Polylang plugin is active
* FIX: Bug with DB collation in specific cases


= 1.7.2, July 12, 2020 =
* ADD: Integration with FacetWP plugin
* ADD: Support for Shopkeeper theme
* ADD: Support for The7 theme
* ADD: Support for Avada theme
* ADD: Support for Shop Isle theme
* ADD: Support for Shopical theme
* ADD: Support for Ekommart theme
* ADD: Support for Savoy theme
* ADD: Support for Sober theme
* ADD: Support for Bridge theme
* ADD: Possibility to change search icon color
* ADD: New filter hook for a search form value
* ADD: Support for Site Search module in Google Analytics
* FIX: Add CSS border-box for each elements in search bar, suggestions and details panel
* FIX: Sending events to Google Tag Manager
* FIX: Remove &lt;b&gt; from product title
* FIX: Search in categories and tags for Russian terms
* FIX: Duplicated category in breadcrumb
* FIX: No results when searching for phrase included apostrophe or double quote
* FIX: Details panel - Remove HTML from titles attribute
* FIX: Fixed for integration with Woo Product Filter plugin by WooBeWoo
* FIX: Fixed for integration with XforWooCommerce plugin
* FIX: Error: Undefined index: is_taxonomy in some cases
* ADD: Support fro brand served via Martfury Addons plugin, the part of the Martfury theme
* ADD: Integration with WooCommerce Products Visibility plugin
* FIX: Better relevancy for exact match product title or SKU
* FIX: Displaying product variation in the Details Panel

= 1.7.1, May 17, 2020 =
* FIX: Selecting suggestions issue

= 1.7.0, May 17, 2020 =
* ADD: Icon search instead of search bar (beta)
* ADD: Improvements on search results pages
* ADD: Integration with native WooCommerce filters
* ADD: Integration with Advanced AJAX Product Filters plugin by BeRocket
* ADD: Integration with WOOF – Products Filter for WooCommerce plugin by realmag777
* ADD: Integration with Product Filters for WooCommerce plugin by Automattic developed by Nexter
* ADD: Integration with Woo Product Filter plugin by WooBeWoo
* ADD: Integration with WooCommerce Product Table plugin by Barn2 media
* ADD: Support for TheGem theme
* ADD: Support for Impreza theme
* ADD: Support for Medicor theme
* ADD: Support for WoodMart theme
* ADD: Support for Polylang
* ADD: New filter and action hooks
* ADD: Dynamically loaded prices for WPML Multi-currency feature
* FIX: Mobile search - don't hide suggestions on blur
* FIX: Bug related to highlight keywords. For some cases it displayed &lt;strong&gt; tag.
* FIX: Delay on mouse hover effect
* FIX: Minor CSS improvements
* FIX: Broken mobile view on cart page in some cases
* ADD: Update search index for parent product on variation change
* ADD: New filter hook to search products by category description
* ADD: New filter hook to disable updater. Useful when importing large dataset.
* FIX: AJAX endpoint - support for WP directory structure of Flywheel hosting.
* FIX: Synonyms feature - better replacement special chars
* FIX: Synonyms feature - support for Cyrillic
* FIX: Synonyms feature - more matching synonyms to single text
* FIX: Press ENTER key on "See all products..."
* FIX: Loading unexpected PorterStemmer
* FIX: Better search order - extra score for exact match
* FIX: Admin settings - better manage custom fields (Selectize)
* FIX: Redirect to product variation with preselected attributes instead of open search results page (on submit)
* FIX: Wrong search expression when special chars exist
* FIX: Displaying no results when search engine found nothing
* FIX: Not working action scheduler
* CHANGE: Remove outdated backward compatibility system
* CHANGE: Move wp_register_style under the wp_enqueue_scripts hook

= 1.6.3, March 11, 2020 =
* ADD: Details panel - display stock quantity
* FIX: Better support for the Elementor including popups and sticky menu
* FIX: Better support for page builders. Late initialization.
* FIX: Disabling automatic regenerate thumbnails. Conditionally images regeneration.
* FIX: HTTP 500 on getResultDetails for some cases
* FIX: Too long description in live suggestions
* FIX: Add non-breaking space for prices
* FIX: JS errors Failed to execute 'getComputedStyle' on 'Window' (for some cases)
* CHANGE: Rename jQuery object from Autocomplete to DgwtWcasAutocompleteSearch because of namespaces conflicts
* ADD: Support for YITH WooCommerce Brands Add-on (free version)
* ADD: Support for Perfect WooCommerce Brands support
* ADD: Better search for phrases include special chars
* ADD: Update a product info in search index after make changes via WooCommerce REST API
* FIX: Better sync on search results page
* FIX: Support for Advanced AJAX Product Filters by BeRocket
* FIX: Synonyms in Vietnamese
* FIX: Issues related to multi currencies in WPML
* FIX: Issues related to "out of stock" status
* FIX: Non-indexing products in WPML (for some cases)
* FIX: Search issues when fuzzy search feature is disabled

= 1.6.2, February 18, 2020 =
* ADD: Details Panel - new layout for product overview and other UX improvements
* ADD: Automatically regenerates images after first plugin activation
* ADD: Synonyms
* ADD: Search in tags
* ADD: Filter for all labels for easier overwriting
* ADD: Action hook on indexer completed
* FIX: Minor issues in search preview in the settings
* FIX: Details panel - hide "add to cart" button after adding - fix for some themes
* FIX: Details panel - display overview for post and page suggestion type
* FIX: Details panel - display overview for brand suggestion type
* FIX: Better product short descriptions for suggestion and details panel
* FIX: Repair the index rebuild after changing settings
* FIX: Highlighted no results suggestion
* FIX: Better security

= 1.6.1, January 26, 2020 =
* ADD: Scheduling Indexing via the plugin settings
* ADD: Builds the index asynchronously after save or delete products. Does not block the product edit logic
* ADD: Support for Bedrock default ABSPATH
* ADD: Search debugger
* ADD: Update a search index after call create/update and delete methods via WooCommerce REST API
* ADD: Details Panel - grouped load, faster load
* ADD: New way to embed search box - embedding by menu
* ADD: Details panel - show "more products..." link for taxonomy type suggestion
* ADD: Add &lt;form&gt; to quantity elements in a details panel
* ADD: New filters and actions hook
* FIX: Always submit form on press ENTER key
* FIX: Switch to Native WP search engine when the index isn't completed
* FIX: Exclude from cache update_option in the indexer
* FIX: Stemmer - Backward compatibility
* FIX: Product variations exact match
* FIX: Better order by score for post and pages
* FIX: Permalink for variable products
* FIX: Indexer progress bar percent overload in some cases
* FIX: Table dgwt_wcas_tax_index - SQL error for CREATE INDEX Statement
* FIX: Minor indexer errors
* FIX: Variable products SKU exact match - show variant only if it has own SKU
* FIX: Search in meta fields - better meta key validation
* FIX: WPML - Support for hidden languages
* FIX: Automatic index update after changing settings: show pages, show posts
* FIX: Better rules for checking "out of stock" products
* FIX: MySQL connector - fix bug related to empty charset
* FIX: Issue related to colors in plugin settings
* FIX: Suggestions groups - improved limits
* FIX: Pricing for taxonomy term in a details panel
* FIX: Show a details panel on keys UP and DOWN
* FIX: Mobile search overlay - block scroll of &lt;html&gt; tag (issue on iPhones)
* FIX: Better data-wcas-context ID, bypasses opcache
* FIX: W3C - Accessibility errors
* FIX: Storefront mobile search - more time for input autofocus
* FIX: Disable quantity for Astra Pro theme - there were broken buttons
* FIX: Minor CSS improvements
* CHANGE: Increase limit for GROUP_CONCAT (group_concat_max_len) to 100000
* CHANGE: Disable search in title for post/pages by default
* CHANGE:  Decrease debounce time for better speed effect
* CHANGE: Updated Freemius SDK v2.3.2

= 1.6.0, December 08, 2019 =
* ADD: Search in variation products description
* ADD: WPML support
* ADD: Support for booster.io - Visibility by Country
* ADD: Support for booster.io - Prices by Country
* ADD: New translations
* ADD: Non-product search - posts
* ADD: Non-product search - pages
* ADD: Possibility to change collation
* ADD: Wptexturize support
* FIX: Custom attributes support
* FIX: Indexer improvements
* FIX: Post IDs bigger than 2147483647
* FIX: Support for unexpected and bad output from methods of WC_Product class
* CHANGE: Removing all custom DB tables and options after removing the plugin
* CHANGE: Removing all custom DB tables before build new search index
* CHANGE: Rename class Buildier to Builder
* REMOVE: Search engine based on SQLite
* ADD: Suggestions groups
* ADD: Hide advanced settings
* ADD: Better grouping of settings
* ADD: Support for Google Analytics events
* ADD: Search bar preview in settings
* ADD: New action and filters hooks
* FIX: Flatsome theme support for [search] shortcode
* FIX: Images in details panel
* CHANGE: Updated Freemius SDK
* REMOVE: Remove ontouch event from mobile detect

= 1.5.1, September 21, 2019 =
* FIX: Infinite loop after plugin activation (for some users)
* FIX: Updating brands in the search index after saving product
* FIX: Updating custom fields in the search index after saving product

= 1.5.0, September 16, 2019 =
* ADD  Search in custom fields
* ADD  Search in brands (support for WooCommerce Brands and YITH WooCommerce Brands Add-on Premium)
* ADD  Show also matching brands in the autocomplete suggestions similar to category and tags
* FIX: Indexer issues with shared hosting and PHP FPM limitations
* FIX: Empty plugin logo in the optin form
* FIX: Bug with post ID larger that 8388607
* ADD: Integration with the Flatsome theme. It is possible to replace the Flatsome search form via one checbox in the plugin settings page.
* FIX: Overload servers. Optimalization for chain AJAX requests. Creates a debounced function that delays invoking func until after wait milliseconds have elapsed since the last time the debounced function was invoked
* FIX: Better support for HTML entities in products title and description
* FIX: Issues with mobile search version on Storefront theme for iPhones
* CHANGE: Update/sync fork of devbridge/jQuery-Autocomplete to the latest version
* CHANGE: Settings design

= 1.4.1, August 05, 2019 =
* ADD: Filter for search results output
* FIX: Improvements in MySQL connections
* FIX: Support for SSL MySQL connections
* FIX: Increase term column size to 127 chars
* FIX: Add DEFAULT value for lang table in DB
* FIX: Update index after changes in terms
* FIX: Show terms even there are no relevant products
* CHANGE: Improving the logger
* CHANGE: Reduction of supported operators for the boolean search feature to only '&' and '|'
* CHANGE: More relevant results for SKUs
* ADD: French translations
* FIX: Better support for fixed menu
* FIX: Add box-sizing to the search input to better implementation for some themes
* FIX: Duplicated class Mobile_Detect in some cases
* FIX: Submit button position in some cases
* FIX: Zoom in iPhones on focused input
* FIX: Size of images for categories and tags in the Details panel
* CHANGE: Updated Freemius SDK

= 1.4.0, May 04, 2019 =
* FIX: Problem with duplicated SKU
* FIX: Error with empty attributes
* FIX: Minor search improvements
* FIX: Support for &lt;sup&gt; tag
* FIX: Support or HTML entities in categories and terms names
* CHANGE: Migration from SQLite to MySQL
* CHANGE: Remove unimportant files from vendor
* ADD: New modern mobile search UX (beta, disabled by default, enabled only for Storefront theme)
* ADD: Italian translations
* ADD: Spain translations
* FIX: Error with WP Search WooCommerce Integration
* FIX: Conflict with the Divi theme for some cases
* CHANGE: Implementing flexbox grid (CSS)

= 1.3.3, March 02, 2019 =
* CHANGE: Longer search time limit for searchable index building proccess
* FIX: Indexer improvements
* FIX: Support for tikenizer after updating a product
* FIX: Multiple SKU variations
* FIX: Deactivate browser native "X" icon for search input
* FIX: Products images for tags and categories in Details panel
* FIX: Security fix
* ADD: New logos
* CHANGE: Updated Freemius SDK

= 1.3.2.1, February 17, 2019 =
* FIX: Order by price on the search results page

= 1.3.2, February 16, 2019 =
* ADD: Add the tokenizer. Better support for "-" and "." in the search terms
* ADD: Emergency mode for the indexer
* ADD: Better errors logging (only for PHP 7)
* ADD: Filters support in the SHORTINIT mode
* ADD: The WP Background Processing package hosted independently
* FIX: Infinite loop in the indexer in some cases
* FIX: Better highlighting results
* FIX: Wrong scoring by SKU
* FIX: PHP error with $_SERVER variable
* FIX: The errors with indexing products with the status "Out of the stock"
* FIX: The error with artificially duplicated search forms occurred in the Mega Menu plugin and some themes.
* FIX: The error with missing Apache "headers" extension
* CHANGE: Add the "booleanSearch" as a default search mode
* ADD: The text "No results" and "See all results..." can be customized in the plugin settings
* ADD: New filters and hooks
* FIX: Hide the "Account" link in the free plugin versions
* FIX: The error with the appearance of the tags suggestion
* FIX: Problem with artificially duplicated search forms occurred in the Mega Menu plugin and some themes.
* CHANGE: Enforcing use "box-sizing: border-box" within the search form
* CHANGE: Updated Freemius SDK

= 1.3.1, January 06, 2019 =
* FIX: PHP error with widget

= 1.3.0, January 06, 2019 =
* ADD: Speed up search by new search engine based on inverted index
* ADD: Fuzzy search
* ADD: Search in variation products SKUs
* ADD: Search in product attributes
* ADD: If there are more results than limit, the "See all results..." link will appear
* ADD: Information about the PRO features
* ADD: Breadcrumbs for nested product categories
* FIX: Better synchronization between the ajax search results and the search page
* FIX: Improvements in the scoring system
* FIX: Image placeholder for products without image
* FIX: Add SKU label translatable in the suggestions
* CHANGE: Updated Freemius SDK

= 1.2.1, October 26, 2018 =
* ADD: Storefront support as a option. Allows to replace the native Storefront search form
* FIX: Improving the relevance of search results by adding score system
* FIX: Problem with too big images is some cases
* FIX: Support for HTML entities in the search results
* FIX: Bugs with the blur event on mobile devices

= 1.2.0, August 24, 2018 =
* ADD: Backward compatibility system
* ADD: Support of image size improvements in Woocommerce 3.3
* ADD: Dynamic width of the search form
* ADD: Option to set max width of the search form
* ADD: DISABLE_NAG_NOTICES support for admin notices
* ADD: More hooks for developers
* ADD: Minified version of CSS and JS
* ADD: Label for taxonomy suggestions
* ADD: Quantity input for a add to cart button in the Details panel
* FIX: Problem with covering suggestions by other HTML elements of themes.
* FIX: Details panel in RTL
* FIX: Improvements for the IE browser
* CHANGE: Code refactor for better future development. Composer and PSR-4 support (in part).
* CHANGE: Better settings organization
* CHANGE: Updated Freemius SDK

= 1.1.7, April 22, 2018 =
* FIX: Removed duplicate IDs
* CHANGE: PHP requires tag set to PHP 5.5
* CHANGE: Woocommerce requires tags
* CHANGE: Updated Freemius SDK
* REMOVE: Removed uninstall.php

= 1.1.6, October 01, 2017 =
* FIX: Disappearing some categories and tags in suggestions
* FIX: Hidden products were shown in search

= 1.1.5, September 05, 2017 =
* ADD: Requires PHP tag in readme.txt
* FIX: PHP Fatal error for PHP &lt; 5.3

= 1.1.4, September 03, 2017 =
* ADD: Admin notice if there is no WooCommerce installed
* ADD: Admin notice for better feedback from users
* FIX: Deleting the 'dgwt-wcas-open' class after hiding the suggestion
* FIX: Allows to display HTML entities in suggestions title and description
* FIX: Better synchronizing suggestions and resutls on a search page
* CHANGE: Move menu item to WooCommerce submenu

= 1.1.3, July 12, 2017 =
* ADD: New WordPress filters
* FIX: Repetitive search results
* FIX: Extra details when there are no results

= 1.1.2, June 7, 2017 =
* FIX: Replace deprecated methods and functions in WC 3.0.x

= 1.1.1, June 6, 2017 =
* ADD: Added Portable Object Template file
* ADD: Added partial polish translation
* FIX: WooCommerce 3.0.x compatible
* FIX: Menu items repeated in a search page
* FIX: Other minor bugs

= 1.1.0, October 5, 2016 =
* NEW: Add WPML compatibility
* FIX: Repeating search results for products in a admin dashboard
* FIX: Overwrite default input element rounding for Safari browser

= 1.0.3.1, July 24, 2016 =
* FIX: Disappearing widgets
* FIX: Trivial things in CSS

= 1.0.3, July 22, 2016 =
* FIX: Synchronization WP Query on a search page and ajax search query
* CHANGE: Disable auto select the first suggestion
* CHANGE: Change textdomain to ajax-search-for-woocommerce

= 1.0.2, June 30, 2016 =
* FIX: PHP syntax error with PHP version &lt; 5.3

= 1.0.1, June 30, 2016 =
* FIX: Excess AJAX requests in a detail mode
* FIX: Optimization JS mouseover event in a detail mode
* FIX: Trivial things in CSS

= 1.0.0, June 24, 2016 =
* ADD: [Option] Exclude out of stock products from suggestions
* ADD: [Option] Overwrite a suggestion container width
* ADD: [Option] Show/hide SKU in suggestions
* ADD: Add no results note
* FIX: Search in products SKU
* FIX: Trivial things in CSS and JS files

= 0.9.1, June 5, 2016 =
* ADD: Javascript and CSS dynamic compression
* FIX: Incorrect dimensions of the custom preloader

= 0.9.0, May 17, 2016 =
* ADD: First public release
