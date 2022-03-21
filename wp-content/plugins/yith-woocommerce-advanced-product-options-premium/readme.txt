=== YITH WooCommerce Product Add-ons & Extra Options ===

Contributors: yithemes
Tags: woocommerce, woocommerce product add-ons, woocommerce product add ons, woocommerce advanced product option, product add ons, product add-ons, option, radio, checkbox, text, woocommerce product addons
Requires at least: 5.4
Tested up to: 5.9
Stable tag: 3.0.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

== Changelog ==

= 3.0.2 – Released on 15 March 2022 =

* Update: YITH plugin framework
* Update: language and JS files
* Fix: Calculate total price when product quantity changes
* Fix: fixed 'show_in' option when there are existing categories assigned to the block on the migration process
* Fix: fixed image assigned to each option on the migration process
* Fix: fixed single selection for checkboxes
* Fix: fixed show of products and categories assigned in the block table
* Fix: fixed invalid argument for conditional logic method
* Fix: improved add-ons calculation for free options
* Fix: improved border radius to Color picker attributes
* Fix: previously removed blocks and add-ons are permanently removed
* Dev: added 'replace product image' feature compatibility for Elementor widgets
* Dev: improved add-ons views
* Dev: minor changes

= 3.0.1 – Released on 10 March 2022 =

* Update: YITH plugin framework
* Update: language and JS files updated
* Fix: check free add-on before calculating price in cart
* Fix: updated the documentation link in the Help tab
* Fix: hide select type add-ons in cart if no option was selected
* Fix: fixed addon name when it has a large label
* Fix: fixed add-on type product on responsive mode
* Fix: improved the placeholder option on colorpicker add-on
* Fix: correct update term meta function used for Color and Label module
* Fix: compatibility with YITH Gift Card
* Dev: improved Add-ons calculation moving the JS code to the JS file
* Dev: added default image setting values for each add-on option

= 3.0.0 – Released on 08 March 2022 =

* New: support for WooCommerce 6.3
* New: added color picker add-on to the version
* New: added sold individually feature to the version
* New: added priority to the Blocks table
* Tweak: included quantity option to add-on type product
* Tweak: changed block rules layout
* Update: YITH plugin framework
* Update: language files
* Fix: fixed the conditional logic on the migration process
* Fix: added min/max values to select free options and single or multiple selectable items on the migration process
* Fix: added add-on image replacement on the migration process
* Fix: fixed the date pickers imported on the migration process
* Fix: fixed block visibility on the migration process
* Fix: added option to collapse the add-on or not by default
* Fix: fixed options of the label add-on on the Style tab
* Fix: fixed conditional logic options after adding a new one
* Fix: fixed get_setting function if the option is empty
* Fix: fixed the Color and Label terms when the Color and Label plugin is disabled
* Fix: fixed add-on title of add-on type product on admin side
* Fix: fixed default date on Datepicker add-on
* Fix: fixed accent color on color swatches add-on
* Fix: show Base Price label only when individual add-on exists on the cart
* Fix: fixed found problem with PhotoSwipe images
* Fix: fixed label on order creation for add-on type Uploads
* Fix: fixed block title when add-ons are not displayed as group
* Fix: fixed calculation of add-on price by string length
* Fix: fixed image replacement feature with YITH Badges plugin
* Fix: fixed sell individually feature on the YITH Request a Quote integration
* Fix: fixed Quick View integration (with color picker add-on)
* Fix: fixed add-ons panel on the YITH Multi-Vendor menu
* Dev: changed default 'options per row' to 1
* Dev: created new module for Color and Labels features
* Dev: added the Color and Label tab for all the versions
* Dev: added new constant for script versions
* Dev: added CSS rules for the add-on editor
* Dev: added framework classes to the selector of the plugin options
* Dev: set default values to upload options
* Dev: set default value to blocks background
* Dev: set default value to 'Show options in the cart page' option
* Dev: added short delay to sortable add-ons
* Dev: added 'jpeg' to the default values of Upload extensions’ options
* Dev: added default value to Attribute behavior option from Color and Labels module
* Dev: improved add-on actions with framework
* Dev: improved selector of conditional logic (optgroup)
* Dev: added priority 1 by default to blocks when they are created
* Dev: new filter 'yith_wapo_reduce_conditional_option_name'
* Dev: new filter 'yith_wapo_price_sign'
* Dev: minor changes
* Remove: removed old import export tab

= 2.7.0 – Released on 10 February 2022 =

* New: support for WooCommerce 6.2
* Dev: added new filter 'yith_wapo_table_hide_total_order'
* Dev: added new filter 'yith_wapo_allowed_product_types'
* Dev: updated datepicker to a international date format
* Dev: improved image replacement option
* Fix: addons price calculation after input numbers with value 0
* Fix: add readonly attribute to date add-ons
* Fix: avoid counting 'Select an option' in Select add-ons as a valid option for the min/max rules
* Fix: calculate the file size depending on size type (KB, MB, GB, ... )
* Fix: fixed number addon when value is zero
* Fix: changed the default value with placeholder
* Fix: apply global accent color to the Product-type add-ons when it is selected
* Fix: set minimum value initially in the 'number' addon
* Fix: fixed print of addons when a variation is selected ( also for Quick View integration )
* Fix: hide prices on cart if value is zero
* Fix: number addon when 'multiplied' price type is selected
* Fix: default grid value for free version
* Fix: minor bugs

= 2.6.0 – Released on 03 February 2022 =

* New: support for WordPress 5.9
* New: added funcionality to rearrange addon options
* Update: YITH plugin framework
* Dev: default value for addon Number
* Dev: set default values for conditional logic settings
* Dev: exclude addons from grouped products
* Dev: set background color for addon options in admin
* Dev: added a new function to get the label of the addon option
* Dev: changed the method to get the path to replace the images of the product gallery on frontend side
* Dev: added vendor url in the blocks table
* Fix: show add-on price in cart when 'yith_wapo_show_options_grouped_in_cart' filter is applied
* Fix: fixed undefined variable on date rules
* Fix: fixed show image option
* Fix: fixed date addons on "Set a range of days" option
* Fix: variation name in addon product
* Fix: first free options calculation in cart
* Fix: fixed prices on product page with taxes
* Fix: fixed free prices when adding the item to the cart
* Fix: calculate addon price when writting in a input text
* Fix: fixed "Hide options in the order email" option
* Fix: image position option in labels
* Fix: deprecated function is_ajax(), instead using wp_doing_ajax()
* Fix: changed JS variables to enqueue_script function
* Fix: fixed multi vendor integration when saving the vendor id
* Fix: hide help tab for Vendors
* Fix: undefined label variables

= 2.5.0 – Released on 17 January 2022 =

* New: support for WooCommerce 6.1
* Update: YITH plugin framework
* Dev: show alt text image when you show image on addons
* Dev: filter yith_wapo_admin_after_addon_title
* Dev: filter yith_wapo_include_variations_on_conditional_logic
* Dev: new filter 'yith_wapo_block_classes'
* Fix: avoid unexpected value type for separator color variable
* Fix: fixed error displayed when there isn't an exactly match of numbers
* Fix: hide "Base price" message in cart if product has no add-ons
* Fix: fixed addons prices depending on tax configuration
* Fix: number addon calculation ( value per product )
* Fix: fixed deposit calculation on cart
* Fix: price calculation for each addon
* Fix: show addons in the variations when a variable product is selected
* Fix: calculate total price when event is onkeyup on input type number of number addons
* Fix: fixed price with percentage price type
* Fix: minor bugs

= 2.4.1 – Released on 03 January 2022 =

* Update: YITH plugin framework
* Update: translation file for Portuguese
* Dev: the Shop Manager role can manage add-ons
* Dev: new filter 'yith_wapo_select_option_label'
* Dev: new filter 'yith_wapo_table_total_order_label'
* Dev: new filter 'yith_wapo_reduce_conditional_option_name'
* Fix: use the default value when option doesn't exists
* Fix: date restriction when there is more than one date field on addons
* Fix: multiplied input value by sale price
* Fix: selected by default in checkbox addons
* Fix: fixed the display of addons for product variations
* Fix: enable/disable specific days of datepicker addon
* Fix: check if product-type add-ons are valid products
* Fix: calculated amount with percentages
* Fix: plugin option "Total price box" with amount 0
* Fix: force 'Options per row' count only .yith-wapo-option elements
* Fix: load dashicons
* Fix: asterisk in the hidden option labels
* Fix: conditional logic options
* Fix: minor bugs

= 2.4.0 – Released on 16 December 2021 =

* New: support for WooCommerce 6.0
* New: option to show/hide block titles in the cart page
* Update: YITH plugin framework
* Dev: added a loader when uploading files
* Dev: override feature for addon templates
* Dev: override feature for block.php template
* Dev: moved the addon description inside the .options element
* Dev: changed the toggle icon
* Dev: add price display suffix to total price table
* Dev: changed call method for color and labels settings
* Dev: added html element to checkbox template
* Fix: compatibility with quick view and min/max rules
* Fix: extensions check for upload add-ons
* Fix: product bundles integration
* Fix: fixed 'add time slot' and 'add type rule' for new Date options
* Fix: clear option description when "Select an option" is selected
* Fix: price calculation if qty is not grater than 0
* Fix: Check that the cart item price is numeric
* Fix: new block rules view
* Fix: compatibility with WPML
* Fix: additional check to avoid error checking if product has blocks
* Fix: addons main title and description with WPML
* Fix: missing jQuery images
* Fix: improved required error for upload addons
* Fix: Improved required error for checkbox and radio buttons
* Fix: min/max feature
* Fix: "select" class in radio options
* Fix: fatal error on "Call to a member function get_category_ids() on bool"
* Fix: fixed display suffix to the total price table
* Fix: avoid error when the product addon type has a product removed on the site
* Fix: fixed CSS rules for images of select addon
* Fix: value multiplied by product price calculation
* Fix: minor bugs

= 2.3.0 – Released on 09 November 2021 =

* New: support for WooCommerce 5.9
* Update: YITH plugin framework
* Dev: added classes to the labels of radio template
* Dev: product price multiplication by qty in single product page
* Dev: added new filter "yith_wapo_addon_classes"
* Dev: allow the exclusion of products when the category filter is active
* Dev: re-enabled the addon description
* Fix: WPML compatibility
* Fix: price calculation on hidden options
* Fix: toggle feature
* Fix: fixed the information displaying in the block list after the migration
* Fix: fixed tooltip color warning if it doesn't exists
* Fix: tooltip and image replacement compatibility with custom themes
* Fix: avoid show addons in components of YITH Composite Products
* Fix: hide add-on price when the amount is zero
* Fix: compatibility with YITH Multi Vendors
* Fix: replace price was affecting to related products
* Fix: subtotal price duplicated in Product Bundles
* Fix: .change() is not a function (for Divi theme)
* Fix: ajax add to cart feature
* Fix: price calculation for hidden options
* Fix: js code for role based plugin
* Fix: added media queries to avoid hover rules in mobile devices
* Fix: replace product image not working for checkboxes
* Fix: v1 gallery variation of color and labels

= 2.2.7 – Released on 25 October 2021 =

* New: option to multiply the numeric fields by the product price
* Update: YITH plugin framework
* Dev: re-enabled the images and descriptions of the "Select" addons
* Dev: hide add-ons price if value is 0
* Fix: required hidden options
* Fix: price not showing on emails when empty or 0
* Fix: option images don't show in "Select" add-ons (v1)
* Fix: HTML code in add-ons description (v1)
* Fix: product attributes description
* Fix: switch version problems
* Fix: minor bugs

= 2.2.6 – Released on 15 October 2021 =

* Update: YITH plugin framework
* Fix: variation requirements field in version 1.x
* Fix: custom add-on style in frontend not working
* Fix: fixed price of addons with empty price
* Fix: description of addons doesn't accept html tags
* Fix: addon price when value is empty or 0 (only on variable products)
* Fix: minor bugs

= 2.2.5 – Released on 13 October 2021 =

* Update: YITH plugin framework
* Fix: images in migration process
* Fix: no addons in order details
* Fix: fixed "Hide options images" on individual add-ons
* Fix: addons not displayed to cart if Label is empty
* Fix: max-length attribute not work (v1)
* Fix: slot time didn't work
* Fix: minor bugs

= 2.2.4 – Released on 12 October 2021 =

* Update: YITH plugin framework
* Fix: saving groups
* Fix: saving addons
* Fix: minor bugs

= 2.2.3 – Released on 09 October 2021 =

* Fix: XSS vulnerabilities

= 2.2.2 – Released on 08 October 2021 =

* Update: YITH plugin framework
* Fix: XSS vulnerabilities
* Fix: replacement image problem
* Fix: text and textarea max length
* Fix: selected options not visible
* Fix: add to cart button layout
* Fix: calendar default date problem
* Fix: value of addons of type "select" to the cart
* Fix: variations tab in product editor
* Fix: minor bugs

= 2.2.1 – Released on 30 September 2021 =

* Update: YITH plugin framework
* Fix: fixed "Add options" button to open the options popup
* Fix: image replacement
* Fix: minor bugs

= 2.2.0 – Released on 28 September 2021 =

* New: support for WooCommerce 5.8
* New: help tab in admin panel
* New: "First available day" option for default calendar date
* New: days of week feature in calendar
* Update: italian and spanish translation
* Update: YITH plugin framework
* Fix: grid tooltip position
* Fix: prevent the selection of out of stock products
* Fix: conditional logic for hidden fields
* Fix: integration with role based prices
* Fix: debug info feature removed for all logged in users
* Fix: minor bugs

= 2.1.0 – Released on 14 September 2021 =

* New: Support for WooCommerce 5.7
* New: Time selector feature in calendars
* New: Option to show add-ons only to guest users
* New: Option to show the SKU of the product
* New: Option to enable the quantity selector of the product
* New: Option to show product stock status
* Update: YITH plugin framework
* Dev: Scroll on top feature if an option is required
* Dev: Enabled the transparent color in colorpickers
* Fix: Product page variation price
* Fix: Min/max feature with request a quote form
* Fix: Required hidden fields submit
* Fix: Currency Switcher calculation
* Fix: Conditional Logic fade out time
* Fix: Add-ons with no labels in WC order
* Fix: Toggle feature with "No title"
* Fix: Replace image reset
* Fix: XSS vulnerability
* Fix: Minor bugs

= 2.0.7 – Released on 30 August 2021 =

* Update: YITH plugin framework
* Fix: Min/max checking for radio type
* Fix: Min/max checking for select type
* Fix: Error related variations in addons type product
* Fix: YITH_WAPO_SECRET_KEY constant

= 2.0.6 – Released on 27 August 2021 =

* Update: YITH plugin framework
* Dev: New filter "yith_wapo_replace_product_price_class"
* Dev: New filter "yith_wapo_show_options_grouped_in_cart"
* Fix: Add-ons visibility for vendors in frontend
* Fix: Flatsome theme layout in product page
* Fix: Undefined constant error
* Fix: Colon of the add-on label in cart, checkout and order view
* Fix: Required option in select type
* Fix: Min/max add to cart problem
* Fix: HTML addons name in backend
* Fix: "Disable globals" option
* Fix: Currency position
* Fix: Minor bugs

= 2.0.5 – Released on 23 August 2021 =

* Dev: New conditional logic variations limit filter
* Fix: First select option not added to cart
* Fix: First installation version check
* Fix: Toggle feature on block title
* Fix: Multiplied by length feature
* Fix: Removed error_log
* Fix: Minor bugs

= 2.0.4 – Released on 17 August 2021 =

* New: Support for WooCommerce 5.6
* New: Date time feature
* Fix: Color swatch addons selection
* Fix: Multi Vendor integration
* Fix: DB tables creation
* Fix: Uploaded file name in cart
* Fix: Replace images compatibility
* Fix: Conditional logic loading
* Fix: Toggle problem
* Fix: Minor bugs

= 2.0.3 – Released on 28 July 2021 =

* New: Hooks before and after addons list
* New: Calendar date format
* Update: IT, ES & FR Translations
* Update: YITH plugin framework
* Dev: Improved replacement image feature
* Fix: Taxes calculation
* Fix: Required addon type "File"
* Fix: Number of decimals in total price table
* Fix: Min & Max feature
* Fix: Backend overlay layout problem
* Fix: Total price number format
* Fix: Price calculation of single label options
* Fix: Included categories problem
* Fix: JS "ajaxurl" variable error
* Fix: Various JS errors
* Fix: Minor bugs

= 2.0.2 – Released on 20 July 2021 =

* New: Support for WordPress 5.8
* New: Product type add-on price calculation method
* Update: IT & ES Translations
* Fix: Currency position in total table
* Fix: Number limits feature
* Fix: Upload required feature
* Fix: Multi upload problem
* Fix: Required files style
* Fix: Min-max feature design
* Fix: Replace image problem
* Fix: Ajax error
* Fix: Minor bugs

= 2.0.1 – Released on 06 July 2021 =

* New: Support for WooCommerce 5.5
* Update: IT translation
* Update: ES translation
* Update: YITH plugin framework
* Fix: Conditional logic notice
* Fix: Fatal error in blocks list
* Fix: Migration function
* Fix: Minor bugs

= 2.0.0 – Released on 01 July 2021 =

* New: Plugin UI/UX restyling
* New: Conditional Logic system
* New: "Product" addon type
* New: "Color Swatch" addon features
* New: "Date" addon features & settings
* New: HTML elements for product page
* New: Layout & grid settings
* New: Automatic upgrade procedure
* New: Cart & Order settings
* New: Style settings
* Update: YITH plugin framework
* Tweak: major code refactoring

= 1.5.39 – Released on 18 June 2021 =

* New: Support for WooCommerce 5.4
* Update: YITH plugin framework
* Dev: New trigger "yith_wapo_miss_required"
* Dev: Filter "yith_wapo_order_item_addon_price"
* Fix: Minor bugs

= 1.5.38 – Released on 17 May 2021 =

* New: Support for WooCommerce 5.3
* Update: YITH plugin framework
* Dev: New filter "yith_wapo_get_item_data"
* Dev: New action "yith_wapo_get_total_by_add_ons_list"
* Fix: Minor bugs

= 1.5.37 – Released on 15 April 2021 =

* New: Support for WooCommerce 5.2
* New: WooCommerce Measurement Price Calculator compatibility
* Update: YITH plugin framework
* Dev: Function to check all inputs checked when the JS load and show the dependencies
* Dev: New trigger parameters on change method
* Dev: New filter "yith_wapo_exclude_global"
* Dev: New JS trigger "yith_wapo_feature_image_updated"
* Dev: New parameters to filter "yith_wapo_option_price_html"
* Fix: Attributes in order info
* Fix: Product price table for YITH booking products
* Fix: Minor bugs

= 1.5.36 – Released on 12 March 2021 =

* New: Support for WordPress 5.7
* New: Support for WooCommerce 5.1
* Update: YITH plugin framework
* Update: Language file
* Dev: New filter "yith_wapo_display_image_alt"
* Fix: Minor bugs

= 1.5.35 – Released on 10 February 2021 =

* New: Support for WooCommerce 5.0
* Tweak: prevent add tax on addons that have tax added in the price
* Tweak: Add a float to prevent errors
* Update: YITH plugin framework
* Fix: Show woocommerce suffix on table if include {price_including_tax}
* Fix: Enable all post status
* Dev: Add quick view support for astra theme
* Dev: New filter yith_wapo_print_options_default_args

= 1.5.34 – Released on 12 January 2021 =

* New: Support for WooCommerce 4.9
* Update: YITH plugin framework
* Fix: Multi currency check
* Fix: WOOCS support
* Fix: Minor bugs

= 1.5.33 – Released on 11 December 2020 =

* New: Support for WordPress 5.6
* New: Support for WooCommerce 4.8
* Fix: Multi labels max items selected
* Fix: Display prices with taxes
* Fix: YITH_WCTM error
* Fix: Minor bugs

= 1.5.32 – Released on 11 November 2020 =

* New: Support for WooCommerce 4.7
* Update: YITH plugin framework
* Fix: Select description if checked
* Fix: Minor bugs

= 1.5.31 – Released on 14 October 2020 =

* New: Support for WooCommerce 4.6
* New: Hide option feature
* New: Auto Update feature
* Update: YITH plugin framework
* Fix: First X options free for multiple labels
* Fix: Admin checkbox problems
* Fix: WPML categories
* Fix: Colorpicker error
* Fix: Wrong filter name
* Fix: Minor bugs

= 1.5.30 – Released on 23 September 2020 =

* Dev: New filter 'yith_wapo_force_enqueue_styles_and_scripts'
* Fix: First X options feature
* Fix: Labels selection
* Fix: Greek translation
* Fix: Multi Labels limit selectable elements
* Fix: Negative percentage discounts
* Fix: Minor bugs

= 1.5.29 – Released on 31 August 2020 =

* New: Support for WordPress 5.5
* New: Support for WooCommerce 4.5
* New: WooCommerce Multi Currency support
* Update: YITH plugin framework
* Dev: Load JS only in product page
* Fix: Gift Cards support
* Fix: Add-ons options position
* Fix: Percentage calculation
* Fix: AND operator in label add-ons
* Fix: Minor bugs

= 1.5.28 – Released on 15 July 2020 =

* New: Support for WooCommerce 4.3
* New: Support for Subscription 2.0
* Dev: New filter to display price without tax
* Dev: new filter 'yith_wapo_product_final_price'
* Update: YITH plugin framework
* Fix: Minor bugs

= 1.5.27 – Released on 03 June 2020 =

* New: Support for WooCommerce 4.2
* Update: Italian language
* Update: Color & Labels features
* Update: YITH plugin framework
* Fix: Variation Image Gallery
* Fix: YITH Quick View add to cart position
* Fix: Minor bugs

= 1.5.26 – Released on 14 May 2020 =

* New: Support for WooCommerce 4.1
* New: Proteo theme integration
* New: New replace image function
* Update: YIT Plugin Framework
* Fix: Error when deleting an order
* Fix: Prevent Google index
* Fix: Dependencies problem
* Fix: Clickable label price
* Fix: Minor bugs

= 1.5.25 – Released on 10 March 2020 =

* New: Support for WooCommerce 4.0
* New: WooFood plugin compatibility
* New: Popups compatibility
* Update: YIT Plugin Framework
* Update: Dutch language
* Dev: Show product options check
* Dev: New filter to show the add-on type select images
* Fix: Variations dependencies ignored
* Fix: Variations dependencies in popup
* Fix: Radio buttons price calculation
* Fix: Min value calculation for numeric add-ons
* Fix: Calendar date format
* Fix: Collapse feature
* Fix: Minor bugs

= 1.5.24 – Released on 9 January 2020 =

* New: Support for WooCommerce 3.9
* New: Description and image after selecting an add-on type "select"
* New: Minimum product quantity feature
* Update: YIT Plugin Framework
* Update: Spanish language
* Dev: New filter to limit the variations loading
* Dev: New filter to disable colorpicker files
* Dev: New filter to show/hide "sold individually" label
* Fix: Collapsed by default option
* Fix: WPML direct translation feature
* Fix: WPML translations of long strings
* Fix: Enter key in add-ons type number
* Fix: Checked options on loading
* Fix: Add-ons price table with totals at 0
* Fix: Minor bugs

= 1.5.23 – Released on 5 November 2019 =

* New: Support for WordPress 5.3
* New: Support for WooCommerce 3.8
* Update: YIT Plugin Framework
* Dev: Increased add-ons options db size
* Fix: Variations dependencies loading time
* Fix: Elementor compatibility
* Fix: WPML check if actived
* Fix: WPML strings strip
* Fix: Minor bugs

= 1.5.22 – Released on 9 October 2019 =

* New: WPML options direct translation
* New: Price suffix to the total table
* New: Grouped products support
* Update: YIT Plugin Framework
* Dev: New filter 'yith_wapo_get_translated_products'
* Dev: New hook 'yith_wapo_start_addon_list'
* Dev: New filter 'yith_wapo_get_thumbnail_for_addons_image'
* Fix: Attributes selection in loop pages
* Fix: Issue when showing hidden field for Bundle integration
* Fix: Uppercase file extensions problem
* Fix: Duplicate groups problem
* Fix: Add-on description links
* Fix: Sold individually add-ons with Role Based plugin
* Fix: Minor bugs

= 1.5.21 - Released on 12 August 2019 =

* New: WooCommerce 3.7 support
* New: 7up themes compatibility
* Update: YIT Plugin Framework
* Fix: Keypress problem
* Fix: AND operator
* Fix: All add-ons collapses by default
* Fix: Minor bugs

= 1.5.20 - Released on 27 June 2019 =

* New: WC Embed Product support
* New: Replace image method for Divi theme
* New: Option to disable the "labels" features
* New: Option to enable again the "add to cart" feature in loop
* New: Alternate collapse feature
* Update: YIT Plugin Framework 3.3.5
* Fix: WooCommerce attribute name conflict
* Fix: Cart numeric price error
* Fix: File validation with Request a Quote plugin
* Fix: Options position
* Fix: First X free options feature
* Fix: Replacing image size
* Fix: jQuery UI filter
* Fix: QuickView Pro support
* Fix: Minor bugs

= 1.5.19 - Released on 28 May 2019 =

* New: WordPress 5.2 support
* Update: Italian language
* Update: YIT Plugin Framework 3.2.1
* Fix: Calculate quantity by values amount
* Fix: Request a Quote error message
* Fix: Undefined offset notice
* Fix: Minor bugs

= 1.5.18 - Released on 11 April 2019 =

* New: WordPress 5.1 support
* New: WooCommerce 3.6 support
* New: WooCommerce bundle products support
* New: Filter to change the add-ons title HTML tag
* New: Scroll product page when required options are not selected
* New: "Replace Image" method sent by the customer Paul McWalters
* Update: YIT Plugin Framework 3.1.28
* Dev: Tax included string
* Fix: Collapsed feature in Quick View
* Fix: Add-ons negative percentage values and variations
* Fix: Missing description-field.php template notice
* Fix: Image replacement
* Fix: Options images size
* Fix: Minor bugs

= 1.5.17 - Released on 20 February 2019 =

* New: TheGem theme support
* Tweak: Add-ons panel loading speed optimization
* Update: YITH plugin framework 3.1.21
* Fix: Missing variation-gallery.php template
* Fix: Grouped products support
* Fix: Minor bugs

= 1.5.16 - Released on 28 January 2019 =

* New: WooCommerce Currency Switcher support
* Update: Language file
* Update: YIT Plugin Framework 3.1.15
* Dev: Allow external plugins to save custom options array
* Fix: Composite Product component variation price reset
* Fix: Required options
* Fix: Admin menu
* Fix: Minor bugs

= 1.5.15 - Dic 05, 2018 =

* New: WordPress 5.0 support
* New: Plugin options to enable compatibiliy
* Dev: Improved Woo Layout Injector support
* Fix: Minor bugs

= 1.5.14 - Dic 05, 2018 =

* New: Divi theme support
* New: Woo Layout Injector plugin support
* Update: All .po files
* Update: YIT Plugin Framework 3.1.5
* Dev: Improved WPML support with required variations
* Fix: Number add-ons "min" value problem
* Fix: Variations and attributes disappear after saving
* Fix: Minor bugs

= 1.5.13 - Nov 07, 2018 =

* New: Alternative "Replace Image" method for non standard themes support
* Update: YIT Plugin Framework 3.0.35
* Update: Dutch language
* Fix: Elementor support
* Fix: Deprecated .size() method of jQuery 1.8
* Fix: Quick View
* Fix: Minor bugs

= 1.5.12 - Oct 23, 2018 =

* Update: YIT Plugin Framework 3.0.27
* Fix: Required options
* Fix: Minor bugs

= 1.5.11 - Oct 18, 2018 =

* New: WordPress 4.9.8 support
* New: WooCommerce 3.5 support
* Update: YIT Plugin Framework 3.0.24
* Dev: New "wapo_print_option_price" filter
* Fix: Hide Label option in add-ons type "labels" and "multi labels"
* Fix: Required "select" add-ons
* Fix: Add-on types in "new" form
* Fix: Minor bugs

= 1.5.10 - Sep 28, 2018 =

* New: Portuguese translation
* Fix: Table columns in ThickBox
* Fix: Undefined variable "collapsed"

= 1.5.9 - Sep 25, 2018 =

* Fix: Fatal error adding to cart a gift card product
* Dev: Double price in percentage amount
* Update: YIT Plugin Framework 3.0.23
* Update: Language files
* Fix: Missing options problem
* Fix: Minor bugs

= 1.5.8 - Sep 14, 2018 =

* Fix: Activation function
* Fix: Free version compatibility
* Fix: Minor bugs

= 1.5.7 - Sep 06, 2018 =

* New: German translation
* Tweak: Improved Multi Vendor compatibility
* Update: YIT Plugin Framework 3.0.21
* Fix: Avoid undefined "first_options_free_container" variable
* Fix: Add-ons position in variable products
* Fix: Required single textarea
* Fix: Strings translation bug
* Fix: Vendor in group settings
* Fix: Data js error
* Fix: Minor bugs

= 1.5.6 - Aug 17, 2018 =

* New: "First X options free" feature
* New: "Hide Label" setting for add-on options
* New: Support to "Variable subscription" products
* Update: YIT Plugin Framework 3.0.20
* Tweak: Improved WPML compatibility
* Fix: Add-ons position in variable products
* Fix: Vendor settings in groups
* Fix: Show Options shortcode
* Fix: Main image replacement
* Fix: Filter to disable the plugin init
* Fix: Groups categories with WPML
* Fix: Minor bugs

= 1.5.5 - Jun 22, 2018 =

* New: Option to enable/disable general "collapse" feature
* New: Option to collapse each single add-on
* Dev: New filter to disable the plugin init
* Dev: New filter to disable the jQuery UI loading
* Dev: New filter to hide add-ons group container
* Dev: New filter "yith_wapo_show_group_container"
* Update: Dutch language file
* Fix: Check for catalog mode hiding price
* Fix: Fatal error after update
* Fix: Minor bugs

= 1.5.4 - May 24, 2018 =

* New: WordPress 4.9.6 support
* New: WooCommerce 3.4 support
* New: Support to GDPR compliance
* New: Privacy class
* Update: Spanish translation
* Update: Italian translation
* Update: Dutch translation
* Fix: Options image placeholder
* Fix: "Required" title in add-on name
* Fix: Add-ons image replacement
* Fix: Plugin localization loading
* Fix: Price percentage of a variable product with "Select" type
* Fix: Translation required title
* Fix: Minor bugs

= 1.5.3 - Apr 30, 2018 =

* Fix: Dashicons in frontend
* Fix: Add-ons taxes calculation
* Fix: "class.divi-et-builder_module.php" include error
* Fix: "function.yith-wccl-activation.php" include error
* Fix: Minor bugs

= 1.5.2 - Apr 23, 2018 =

* New: Textarea Editor feature
* New: Add-ons type number style
* New: Alt tag in options images
* Update: YIT Plugin Framework 3.0.15
* Fix: Upload fields without labels problem
* Fix: Upload problems with Request a Quote
* Fix: Wrong upload extension notice
* Fix: Add-on type number with value "0"
* Fix: Variations attributes type label
* Fix: Tax calculation for Price Suffix
* Fix: Tooltip bottom margin
* Fix: WPML Variations Requirements select
* Fix: Group creation in product edit page
* Fix: Error required fields
* Fix: Minor bugs

= 1.5.1 - Apr 13, 2018 =

* New: WooCommerce 3.3.5 support
* New: Show add-ons collapsed option
* Tweak: Improved add-ons admin open/close
* Update: YIT Plugin Framework 3.0.14
* Fix: Tooltip, placeholder and description fields
* Fix: WPML translation and missing strings
* Fix: Duplication of deleted components
* Fix: Variations Requirements with WPML
* Fix: New add-on "Cancel" button
* Fix: Price sign position
* Fix: Minor bugs

= 1.5.0 - Apr 05, 2018 =

* New: WordPress 4.9.5 support
* New: WooCommerce 3.3.4 support
* New: Group duplication feature
* New: Add-on duplication feature
* New: Option duplication feature
* New: Placeholder and Tooltip fields
* New: Divi ET Builder Module integration
* New: Unero theme support
* Tweak: Improved options table
* Update: Language files
* Fix: Tooltip options
* Fix: SelectWoo error
* Fix: Docs URL
* Fix: Minor bugs

= 1.3.5 - Mar 15, 2018 =

* New: WooCommerce 3.3.3 support
* New: Filters to edit price table strings
* New: Fields placeholders
* New: Addons price suffix
* Update: YIT Plugin Framework 3.0.13
* Fix: YITH WooCommerce Role Based Prices integration
* Fix: Compatibility with Frontend Manager
* Fix: Minor bugs

= 1.3.4 - Feb 21, 2018 =

* New: WordPress 4.9.4 support
* New: WooCommerce 3.3.2 support
* New: [yith_wapo_show_options] shortcode
* Dev: New "wapo_wpml_default_language" filter
* Fix: Uploaded files link in order details
* Fix: Subscription support
* Fix: Add-ons for WPML translations
* Fix: Options price calculated in cart
* Fix: Fields style

= 1.3.3 - Feb 05, 2018 =

* Update: YIT Plugin Framework 3.0.12
* Fix: Options are not shown after vendor check
* Fix: Missing options after the update to version 1.3.2
* Fix: Image replacement with standard WooCommerce template

= 1.3.2 - Jan 30, 2018 =

* New: WordPress 4.9.2 support
* New: WooCommerce 3.3.x support
* New: Filter 'yith_wapo_show_uploaded_file_name' to show the uploaded file name in cart and order details
* Update: YIT Plugin Framework 3.0.11
* Tweak: New options sign filters
* Fix: Multi Vendor support
* Fix: Booking post type support
* Fix: Minor bugs

= 1.3.1 - Jan 18, 2018 =

* New: Filter 'wapo_select_variations_in_loop' to manage the variations in loop
* Tweak: Template yith-wapo-form-option-type.php loaded by wc_get_template function
* Tweak: Added the add-on $title to the "ywapo_empty_option_text" filter
* Update: YIT Plugin Framework 3.0.9
* Fix: Group doesn't saving
* Fix: Image replacement
* Fix: WooCommerce 2.6 compatibility
* Fix: And operator dependencies
* Fix: Minor bugs

= 1.3.0 - Dec 12, 2017 =

* New: AND/OR operators for Options Requirements
* New: Negative value in options price
* New: Possibility to reset add-ons type file
* New: Unero theme quick view support
* New: 'yith_wapo_allow_frontend_free_price' filter to show free options price "+ $0.00"
* New: HTML options container
* New: French translation
* Update: YIT Plugin Framework 3
* Fix: Deprecated 'woocommerce_add_order_item_meta' action
* Fix: Options not shown in checkout
* Fix: Options not shown in order details
* Fix: Options not shown in order emails
* Fix: Options not shown in order again
* Fix: Variations fields in shop page
* Fix: Options textarea freeze after press enter key
* Fix: Product Bundles plugin compatibility
* Fix: Select2 and SelectWoo problems
* Fix: Product attributes types
* Fix: Multi Vendor user error
* Fix: Minor bugs

= 1.2.8 - Oct 12, 2017 =
* New: WooCommerce 3.2.0 support
* New: Flatsome product lightbox compatibility
* Update: language file
* Fix: Removed 'Color and Label Variations' item from YITH Plugins menu in admin
* Fix: Illegal string offset in order again feature
* Fix: Quick View compatibility
* Fix: Minor bugs

= 1.2.7 - Aug 31, 2017 =

* New: es_ES translations files
* New: nl_NL translations files
* Update: Core files
* Fix: Increased Type Description length
* Fix: Minor bugs

= 1.2.6 - Jul 21, 2017 =

* New: "Toggle" function on options group (frontend)
* New: HTML code in option label
* New: 'yith_wapo_frontend_price_html' filter
* New: 'yith_wapo_cart_item_addon_price' filter
* Update: Core files
* Update: Language files
* Fix: Blank page with WooCommerce 3.0
* Fix: Type "Color" attributes and variations problem
* Fix: "Mixed Content" error with SSL images
* Fix: "Sold individually" cart price
* Fix: WooCommerce select2 error
* Fix: Order again errors
* Fix: Hidden variations in options editor
* Fix: Base price before options in variable products
* Fix: JavaScript errors in backend
* Fix: Prevent "add to cart" at the press "enter" in product options fields
* Fix: Call to undefined method WC_Product_Variable::get_default_attributes()
* Fix: Compatibility with YITH WooCommerce Role-based Prices Premium
* Fix: Deprecated 'woocommerce_add_order_item_meta' hook
* Fix: Limit selectable elements with Multi Labels type
* Fix: Fatal error: Cannot unset string offsets in class.yith-wapo-frontend.php
* Fix: Prevent "Manage" popup open in other tab
* Fix: Type text "max length"
* Fix: Fatal error after activation
* Fix: Minor bugs

= 1.2.5 - Apr 07, 2017 =

* New: WooCommerce 3.0.x support
* New: Dutch language files
* Dev: Added yith_wapo_product_price_updated trigger
* Dev: Added query operator for category filter
* Dev: Added product id in group list
* Fix: Special chars in label
* Fix: Change featured image problem
* Fix: Minor bugs
* Fix: Variations query when categories are filtered in the edit group
* Fix: Flolat value for sum + avada style for dropdown
* Fix: Add to cart layout with Avada
* Fix: Variation query with categories

= 1.2.4 =

* New: Add-Ons options "Minimum and Maximum sum value amount"
* Fix: Featured image does not changed when an add-on was hided by a dependence
* Fix: Calculate totals after quantity value is changed by minum and maximum rules
* Fix: Calculate totals after product quantity changed.

= 1.2.3 =

* New: Add-Ons type "Multiple Labels".
* New: Option "Always show the price table" allows the admin to always show the price table even if the amount of the add-ons is 0 in the single product page.
* Fix: "Limit selectable elements" now works with "Number" Add-On.
* Fix: Integration with "YITH WooCommerce Product Bundle Premium".

= 1.2.1.1 =

* New: Option "All options required" that allow the admin to decide if a required add-on must have all options required or just one.
* Fix: Dependece conflict between add-ons and variations requirements.
* Fix: Some price types not shown in the "new option" template.

= 1.2.1 =

* New: Added two price type "Price multiplied by value" and "Price multiplied by string length".
* New: Now the options list are sortable with drag & drop in the back-end.
* New: Option "calculate quantity by values amout" that allow the user to set the quantity value as the sum of the total amount of the add-on options.
* Fix: Mobile layout in single product page

= 1.2.0.9 =

* New: Product Add-Ons is now integrated with YITH WooCommerce Product Bundle Premium(with versions grather than 1.1.3).
* New: Add-Ons option "replace the product image" works now with YITH WooCommerce Zoom Magnifier.
* Fix: Error with category field on variation requirements.
* Fix: Output error after plugin activation.
* Fix: Wrong arguments using the filter 'woocommerce_cart_item_thumbnail'.
* Fix: Argument missed with YITH WooCommerce Catalog mode.
* Fix: If more then one add-on checked "replace the product image" option the product image was reset.

= 1.2.0.8 =

* New: WordPress 4.7 support.
* New: Product Add-Ons is now integrated with YITH Composite Products for WooCommerce Premium(with versions grather than 1.0.3).
* New: Product Add-Ons is now integrated with YITH WooCommerce Subscrition Premium(with versions grather than 1.1.6).
* Fix: Total box was duplicated with Avada theme and variable product.
* Fix: Prevent variations limit for the "Variation Requirements" field.

= 1.2.0.7 =

* Fix: The Add-ons order can' t be saved in the backend.
* Fix: The Add-ons price get 0 when decimal separator is not the point.

= 1.2.0.6 =

* New: Option "Replace the product image" that allows the customer to replace the product featured image when the add-on is selected.
* Fix: Min and Max option values doesn' t appear in the administration panel after saving.
* Fix: Required field not works for checkboxes when the option "max item selected" is set.

= 1.2.0.5 =

* Fix: Add option doesn' t work with some configurations.

= 1.2.0.4 =

* New: Administration restyling.
* Fix: Add to cart button was disabled with Flatsome theme.

= 1.2.0.3 =

* Fix: Total preview was not updated right after variations was changed.
* Fix: First element with the add-ons "select" was not stored in the cart.

= 1.2.0.2 =

* New: Hide price feature with YITH WooCommerce Catalog Mode Premium and YITH WooCommerce Requeste a Quote Premium.
* Fix: Labels and descriptions of the Add-Ons were not translated on the customer email even if translation was complete on WPML String Translations.

= 1.2.0.1 =

* Fix: Add-on with dependence doesn' t appear even if the correct variation was selected.
* Fix: Prevent notice in the back-end when a new add-on was inserted.

= 1.2.0 =

= Add-Ons =

* New: Possibility to hide add-ons until a specified option or variation is selected.
* New: Integration with YITH WooCommerce Role Based Price.
* New: Flatsome quick view compatibility.
* New: Exclude products field on group
* Fix: Click doesn' t fire on radio button label.
* Fix: Error was printed when a customer receives YITH WooCommerce Request a quote email.
* Fix: Add-ons name and value was not translated by WPML on the Cart

= Variations =

* New: Change product image on hover (only for one attirbute).
* New: Option to show custom attributes style also on "Additional Information" Tab.
* New: Compatibility with WooCommerce Products Filter.
* New: Compatibility with YITH Composite Products For WooCommerce.
* New: Compatibility with WooCommerce Quick View by WooThemes.
* Fix: Reset attribute type on plugin deactivation.
* Fix: Description and default variations on archive pages.
* Update: Language files.
* Update: Core plugin.

= 1.1.4 = Released on Jul 08, 2016

* Update:  Language files.
* Fix: Wrong total price preview when variation is changed
* Fix: Default variation on single product pages for products with only one attribute
* Fix: Issue when there were two labels in two different group

= 1.1.3 =

* New:  WooCommerce 2.6 support.
* New:  Option "Max Items Selected" for checkboxes add ons

= 1.1.2 =

* Update:  Language files.
* Fix:    jQuery event not triggered with "The Edge / Internet Explorer" browser
* Fix:    Product Add-On Group is not saved because of mysql error

= 1.1.1 =

* Fix: error on add to cart when add-on is not "sold individually"

= 1.1.0 =

* New: Support to WordPress 4.5.2.
* New: Support to WooCommerce 2.6 Beta2.

= Add-Ons =

* New: "Sold individually" add-ons option that allow user to sell an add-on lonely(* the price will not increases by cart quantity)
* New: "Upoad File size" option on settings that allow the administrator to set max uploaded file size
* New: "Vendor" option on group that allow administrator to change the vendor previously store
* New: Option "Show product price on 'cart page'" that allow you to show the product base price on the cart item
* Fix: minor bugs

= Variations =

* New: Compatibility with YITH WooCommerce Added to Cart Popup.
* New: Set dual color such as blue-white (half box blue and half box white).
* New: Show a preview of the attribute image in the tooltip (available only for image attributes).
* Fix: Variations now work with Owl Carousel 2 when infinite loop option is set.
* Fix: Clicking on selected attribute before selecting another one is no longer necessary.
* Update: Language files.
* Update: Core plugin.

= 1.0.9 =

* Fix: prevent localize domain issue

= 1.0.8 =

* New: support to YITH WooCommerce Request a Quote - 1.4.7 version

= 1.0.7 =

* Update: Text Domain
* Fix: minor bugs

= 1.0.6 =

* Fix: Prevent notice on products loop

= 1.0.5 =

* New: WordPress 4.5 support

= 1.0.4 =

* Fix: Request a quote button not working in the products loop
* Fix: Removed unuseless query execution

= 1.0.3 =

* New: WPML support
* Fix: Options total price was not correct when user change quantity on single product page

= 1.0.2 =

* Fix: Options are not saved when a quote was inserted inside a label

= 1.0.1 =

* Fix: Price total doesn' t change after option is selected on quick view

= 1.0.0 =

Initial Release
