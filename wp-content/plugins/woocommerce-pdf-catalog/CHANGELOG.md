# Changelog
======
1.16.7
======
- NEW:	PDF Catalog Builder
		https://www.welaunch.io/en/knowledge-base/faq/pdf-builder-for-woocommerce/
- FIX:	Added 2 checks for cover & backcover image URL exists
- FIX:	PHP notice
- FIX:	Updated all language files

======
1.16.6
======
- NEW:	Added new template 13 (Restaurant Menu Like)
- NEW:	Added new template 14 (Restaurant Menu Like with 2 columns)
- NEW:	Added a text field for product title prefix
		https://imgur.com/a/RkHWnjq
- NEW:	Default WC Sorting order gets respected in the PDF Generation
- FIX:	PHP Issue
- FIX:	Cached files PDF name not correct on download

======
1.16.5
======
- NEW:	Show parent categories
		https://imgur.com/a/a523ZoV
- NEW:	Added support for Rank Math
- NEW:	Export wishlist products grouped by their product category
		https://imgur.com/a/9RflGZ1
- NEW:	2 Options to disable CURL SSL validation & follow 302 Redirects

======
1.16.4
======
- NEW:	Added poppins font
- NEW:	Exclude products which contain a category
		https://imgur.com/a/ojRgrmf
- NEW:	Option to set a text on cover & backcover
- FIX:	Wrong product image showed for products with no image

======
1.16.3
======
- NEW:	Move attributes below SKU
		https://imgur.com/a/37PSK52
- FIX:	Image background color removed

======
1.16.2
======
- NEW:	Added an option to show only in stock sale products
		https://imgur.com/a/S3yVpcA
- NEW:	Added support for 3rd & 4 levels in ToC
		https://imgur.com/a/QfNpWEa
- FIX:	PHP Notice

======
1.16.1
======
- NEW:	Added DIV wrappers for pdf catalog Type AND categories
- NEW:	Added Mulish Font
- NEW:	Filter Hook for Product image size:
		woocommerce_pdf_catalog_product_image_size
- FIX:	Index letter not working
- FIX:	German translation
- FIX:	PHP Error on category class

======
1.16.0
======
- NEW:	Product Tag PDF Export support
		https://imgur.com/a/FumlW7X
- NEW:	Show Products in Table of Contents
		https://imgur.com/a/SlxNMPs
- NEW:	Category Layout 6
		https://imgur.com/a/luH2D7k
- NEW:	Custom Taxonomy PDF Export Support (e.g. Brands)
		https://imgur.com/a/7S62wG7
- NEW:	Custom PDF category image & Text
		This you can use to have different PDF & normal Category texts
		https://imgur.com/a/rMP5gJx
- NEW:	Custom Product & CAtegory layouts per Categories
		https://imgur.com/a/3JCbEew
- NEW:	Filter for MPDF Settings
		woocommerce_pdf_catalog_mpdf_config
- FIX:	Images in backend of categories size corrected
		https://imgur.com/a/jnpCUKP
- FIX:	Split chunks enabled by default now
- FIX:	ToC Alignment of categories & subcategories
- FIX:	ToC Level 1 and 2 not bold or italic anymore

======
1.15.10
======
- FIX:	QR code size not working
- FIX:	Barcode size not working

======
1.15.9
======
- NEW:	Custom Backcover image per category
- FIX:	Backcover always showed

======
1.15.8
======
- FIX:	Custom meta keys / ACF not showing correctly or duplicate
- FIX:	Backend preview could not be closed
- FIX:	Custom tabs broke layout

======
1.15.7
======
- FIX:	Send catalog not working

======
1.15.6
======
- NEW:	Added support for our Ultimate Tabs plugin
		https://imgur.com/a/6VNHb9V
		https://www.welaunch.io/en/product/woocommerce-ultimate-tabs/
- NEW:	Show cart quantity in cart PDF Export
		https://imgur.com/a/14ZC83Q
- NEW:	Added Translation files for
		Italian, German, French, Spanish, Dutch
- NEW:	Upgraded Font Awesome to 5.15.3 and added an option to disable loading
- NEW:	Added shortcode explanation in plugin settings > buttons
- NEW:	When debug mode enabled caching is turned off
- NEW:	Added a filter on price HTML
		apply_filters('woocommerce_pdf_catalog_product_price', $price, $this->product );
- FIX:	Exclude parent categories not showed the paret categories itself
- FIX:	Attributes table supports variations
- FIX:	Cart variations exported now also
- FIX:	Updated MPDF library to support PHP 8.0

======
1.15.5
======
- NEW:	Support for our Single Variations plugin to export variations as own 
		products in the PDF and leave out the variable main one
		https://imgur.com/a/nmmLnBf
- NEW:	After many hours of trial & error we finally 
		made it possible to show the backcover without header & footer
		https://imgur.com/a/0JmOtHo
- NEW:	Custom wishlist & sale cover images
		https://imgur.com/a/mYq4NYh
- NEW:	Category catalog pre selected when on category
		https://imgur.com/a/PqmRXCV
- NEW:	Email Sending: When select field hidden + category catalog it sends current catalog PDF
- FIX:	IMPORTANT
		Removed the ? parameter from URL parameter in order to support variation links
		Please save your tracking link WITHOUT starting ?
		https://imgur.com/a/qbjK3Ze
- FIX:	Email sending select field not opened when only one choice

======
1.15.4
======
- FIX:	Updated POT & PO files
- FIX:	Sale & Wishlist catalogs not working

======
1.15.3
======
- NEW:	Add link parameters like UTM Campaign parameters to track usage
		https://imgur.com/a/BU2b6FQ
- FIX:	Updated POT & PO files
- FIX:	PHP Notice "temp not defined"

======
1.15.2
======
- FIX:	Performance optimizations in backend

======
1.15.1
======
- NEW:	Extra texts execute shortcodes now
- FIX:	Layout issue when attributes enabled

======
1.15.0
======
- NEW:	Added support for our attribute images plugin
		https://www.welaunch.io/en/product/woocommerce-attribute-images/
		https://imgur.com/a/xJ94NZU
- NEW:	Show custom product data (including ACF fields)
		https://imgur.com/a/T3ZMcxJ
- NEW:	Option to hide / Show weight or dimensions	
- NEW:	Added 2 options for QR and Bar Code Size
- FIX:	jQUery load deprecated
- FIX:	Back to Table of content not working
- FIX:	Updated POT / PO files

======
1.14.6
======
- FIX:	Moved updater into weLaunch framework

======
1.14.5
======
- NEW:	Dropped Redux Framework support and added our own framework 
		Read more here: https://www.welaunch.io/en/2021/01/switching-from-redux-to-our-own-framework
		This ensure auto updates & removes all gutenberg stuff
		You can delete Redux (if not used somewhere else) afterwards
		https://www.welaunch.io/updates/welaunch-framework.zip
		https://imgur.com/a/BIBz6kz
- FIX:	PHP 5.6 issue

======
1.14.4
======
- FIX:	undefined ß contstant php warning

======
1.14.3
======
- NEW:	Watermark option HAPPY CHRIStMAS
		When watermark enabled, you should set productsbackground to transparent
		https://imgur.com/a/PEH8AMT
- FIX:	Preview on wrong menu item

======
1.14.2
======
- FIX:	Background cache generation stopped working

======
1.14.1
======
- NEW:	Option to hide category description
- NEW:	Option to hide the email select type field when there is only one enabled

======
1.14.0
======
- NEW:	Send catalogs as Email
		https://imgur.com/a/Wx0hpcO
- NEW:	AJAX WOOF Filter support
- NEW:	Shortcode category parameter accepts "email" 
- NEW:	All button texts can now be set in settings panel

======
1.13.7
======
- NEW:	WOOF Filter plugin support:
		https://imgur.com/a/RkuV0pg
- NEW:	Index columns:
		https://imgur.com/a/UdBUynp
- NEW:	Added more filters (before container, image and after container)

======
1.13.6
======
- FIX:	Sale export not working
- FIX:	Using wc_get_product_ids_on_sale() function to get on sale products now
- FIX:	Robot font missing
- FIX:	Wishlist product validation

======
1.13.5
======
- NEW:	Query sort by regular price, sale price and normal price options
		If you have variable products you need to sort by price
- FIX:	Added suppress filters false to get_posts query

======
1.13.4
======
- NEW:	moved read more in tweltv layout to 2nd column

======
1.13.3
======
- FIX:	Fatal error setTitle
- FIX:	Updated MPDF

======
1.13.2
======
- NEW:	New template twelth:
		https://imgur.com/a/CQY6ZNe
- NEW:	Option to hide variations heading / title
- NEW:	Using swtich instead of checkbox in admin panel
- NEW:	Option to change read more text
- FIX:	Header / Footer "none" element returns blank space now

======
1.13.1
======
- NEW:	Updated MPDF library to 8.0.7
- FIX:	PHP notice

======
1.13.0
======
- NEW:	Big Performance Release 
		!! MAKE SURE YOU ARE ON LATEST VERSION OF REDUX FRAMEWORK !!

- NEW:	Updated Docs
- NEW:	Better support for big catalogs with large products
- FIX:	New Redux Framework finally supports AJAX loading of products in backend
		This fixes major backend loading problems in the backend now.
- FIX:	Split Chunks now get executed even on product level, so no need to increase
		php.ini value

======
1.12.3
======
- FIX:	PHP notices

======
1.12.2
======
- NEW:	Link back to Table of Contents in header & footer:
		https://imgur.com/a/HfMd0d9
- FIX:	Header & footer link colors now match text color

======
1.12.1
======
- NEW:	Exclusions now must be enabled in settings (to avoid performance conflicts)
		See: https://imgur.com/a/R6DTlqJ
- NEW:	Added MPDF QR code Class

======
1.12.0
======
- NEW:	Added PHP 7.4 support
- NEW:	Updated the MPDF Rendering Engine from Version 7 to 8

======
1.11.5
======
- NEW:	ToC now works even when category display is not enabled

======
1.11.4
======
- FIX:	Fixed an issue in template 8 where empty columns breaked the layout

======
1.11.3
======
- FIX:	Empty string as PDF

======
1.11.2
======
- NEW:	Added transient cache for products to improve performance
- NEW:	WPML Support for caching

======
1.11.1
======
- FIX:	Preview function not working
- FIX:	Table of contents should not show for sale, cart or attribute PDF

======
1.11.0
======
- NEW:	Product Attribute Value PDF Exporter
		When you edit attribute terms in wp-admin backend you can generate
		a PDF catalog just of these attribute values. For exampel color > black
		will show a catalog with products in black
- NEW:	Attribute value custom header, footer & cover logo for the PDF 
- NEW:	Added wpautop & do_shortcode to category descriptions
- NEW:	Attribute Products Layout filter: woocommerce_pdf_catalog_attribute_products_layout
- NEW:	Wishlist Products Layout filter: woocommerce_pdf_catalog_wishlist_products_layout
- NEW:	Sale Products Layout filter: woocommerce_pdf_catalog_sale_products_layout
- NEW:	Cart Products Layout filter: woocommerce_pdf_catalog_cart_products_layout


======
1.10.2
======
- NEW:	Option to remove duplicats for flatten products
		General > Flatten Products - Remove Duplicates

======
1.10.1
======
- NEW:	Flatten products option in general settings
- NEW:	Option to define category singular and plural texts in options
- NEW:	Option to define tag singular and plural texts in options

======
1.10.0
======
- NEW:	Added a new template (5 columns)
- FIX:	Gallery options showed even when gallery disabled
- FIX:	Variations options showed when variations were disabled
- FIX:	Moved product image size to "data to show" section

======
1.9.11
======
- NEW:	Added Landscape A4 format
- NEW:	Added backcover image to WPML keys
- NEW:	Support for Yoast Primary Category for Header > Category Description

======
1.9.10
======
- FIX:	Indexentry missing from 2nd product layout

======
1.9.9
======
- NEW:	Option to Create a new row after X variation tables
		See data to show > Create a new row after X variation tables
- NEW:	Option to set a variation table width
- FIX:	Fixed more than 20 PHP notices & bugs
- FIX:	Empty CSS Styles

======
1.9.8
======
- NEW:	Option to show variation stock amount

======
1.9.7
======
- NEW:	Option to move the SKU under product title
- FIX:	Removed full height between cover functions (MPDF Issue)

======
1.9.6
======
- FIX:	Pagebreak after ToC

======
1.9.5
======
- FIX:	Table of Contents on first page, not cover

======
1.9.4
======
- FIX:	Header & Footer not shown
- FIX:	Rewrite of full height cover images

======
1.9.3
======
- NEW:	Category Cover images between categories are now full page size
- FIX:	Issue where cover image overrides the backcover with activated ToC

======
1.9.2
======
- FIX:	Caching issue

======
1.9.1
======
- FIX:	False code deploy for 1.9.0  

======
1.9.0
======
- NEW:	Sale Catalog PDF now respects the Category e.g. 
		?pdf-catalog=sale&sale-category=X
		The button on the category page aligns automatically
- NEW:	Backcover functionality
		You can now show a backcover at the end of the catalog
- NEW:	Set a custom Sale PDF cover image
		Settings > button > Sale Cover image 

======
1.8.5
======
- NEW:	Create a Sale Catalog PDF with all sale products
		?pdf-catalog=sale
- NEW:	Show sale catalog PDF button (see settings > buttons)

======
1.8.4
======
- FIX:	Updated MPDF library from v7.1.6 => v7.1.8

======
1.8.3
======
- NEW:	Added support for guest wishlist PDF export
		https://welaunch.io/plugins/woocommerce-wishlist/
- FIX:	Removed deprecated exclude options

======
1.8.2
======
- NEW:	Options to add a pagebreak after each product (row)
		Settings > Products Layout
- FIX:	Updated POT file

======
1.8.1
======
- NEW:	Added a Live Preview function, that will show your
		catalog PDFs in Real Time to easy get your styling done
		> Admin Panel > Preview
- NEW:	Added a button to manually regenerate cached files
- NEW:	Added chmod to set correct file
- NEW:	Added Title Tag Meta Data to PDF
- FIX:	Bug Fixes

======
1.8.0
======
- NEW:	Include Children Products
		E.g. if Hoodie is assigned to Hoodies category, 
		but not in Clothing, it can show in both. 
		Disable this to show the Hoodie only in Hoodies.
- NEW:	Auto Generate Caching files every day 
		See Performance > Regenerate Cache Daily
- NEW:	Set a Basic auth for Regenerate Caching
- NEW:	Added a Report Option to Mail Regeneration Report
- NEW:	Option to remove pagebreak after each category
- NEW:	Moved Cached Files to a folder in wp-content/uploads/woocommerce-pdf-catalogs/
- NEW:	Updated MPDF library to 1.7.6
- FIX:	Index Page number wrong when using cover
- FIX:	Reduced Plugin folder size

======
1.7.3
======
- NEW:	Some more filters:
		apply_filters('woocommerce_pdf_catalog_before_product_information_container', '', $this->data->ID);
		apply_filters('woocommerce_pdf_catalog_after_product_information_container', '', $this->data->ID);
- FIX:	Colon in product name not escaped for index

======
1.7.2
======
- NEW:	Performance Increase
- NEW:	Added more Filters:

		// Category HTML
		apply_filters( 'woocommerce_pdf_catalog_category_html', $categoryTemplate->get_template($categoryLayout), $category_id);

		// Product HTML
		apply_filters('woocommerce_pdf_catalog_single_product_html', $html, $this->data->ID)
- FIX:	Updated Documentation

======
1.7.2
======
- NEW:	Added Multiple Filters to add custom Data
		// All Product Data
		apply_filters('woocommerce_pdf_catalog_product_data', $this->data);

		// Product Information Filters - return $HTML
		apply_filters('woocommerce_pdf_catalog_before_product_information', '', $this->data->ID);
		apply_filters('woocommerce_pdf_catalog_before_product_information_start', '', $this->data->ID);
		apply_filters('woocommerce_pdf_catalog_before_product_information_read_more', '', $this->data->ID);
		apply_filters('woocommerce_pdf_catalog_before_product_information_categories', '', $this->data->ID);
		apply_filters('woocommerce_pdf_catalog_before_product_information_end', '', $this->data->ID);
		apply_filters('woocommerce_pdf_catalog_after_product_information', '', $this->data->ID);

- FIX:	Text font size not applied when gallery images applied


======
1.7.0
======
- NEW:	Layout 9 (List layout in 2 columns)

======
1.6.11
======
- FIX:	Custom Fonts not working
- FIX:	Undefined Index term_id

======
1.6.10
======
- FIX:	SKU now gets ordered by meta_value while price & stock
		get ordered by meta_value_num
- FIX:	Performance increase of non admin users & frontend

======
1.6.9
======
- FIX:	Added compatibility to ATUM plugin
- FIX:	Cannot find TTF TrueType font file DejaVuSans-Bold.ttf

======
1.6.8
======
- FIX:	Strange ?> character after title

======
1.6.7
======
- NEW:	Show Product Stock Status
- FIX:	Sub-Sub Categories in ToC

======
1.6.6
======
- NEW:	Added Support for our Group Attributes Plugin:
		https://codecanyon.net/item/woocommerce-group-attributes/15467980

======
1.6.5
======
- NEW:	Set Image Size Types (e.g. medium, large, full etc.) for
		- product image
		- gallery images
		- category images
- NEW: 	Added integration to our Wishlist Plugin:
		https://codecanyon.net/item/woocommerce-wishlist/22003411
- NEW:	Published an How To Generate Large Catalogs FAQ:
		https://www.welaunch.io/en/product/woocommerce-pdf-catalog//woocommerce-pdf-catalog/faq/generating-large-pdf-catalogs/
- FIX:	Variation images now use "thumbnail" size
- FIX:	Code Refactoring

======
1.6.4
======
- NEW:	Show 1st Category Description before each product
		See Data to Show > Show 1st Product Category Description
- NEW:	Option to split HTML Code into smaller chunks to fix prce.traceback limit issue
		See Settings 
- FIX:	Index not working
- FIX:	Updated MPDF Vendor from 7.0.3 to 7.1.0
		https://github.com/mpdf/mpdf/releases

======
1.6.3
======
- FIX:	Moved div folder for caching breaks

======
1.6.2
======
- NEW:	Added an option to use Tables again
		See Advances > Use Tables
- NEW:	Added an option to set products container height
		Important to avoid page overflows
- FIX:	Updated MPDF to 7.0.4
- FIX:	PHP notices

======
1.6.1
======
- NEW:	Option for Header & Footer Font Size
- NEW:	Option for Header & Footer Line Height
- FIX:	Two column issue
- FIX:	Added more clear
- FIX:	Removed more inline Styles

======
1.6.0
======
- NEW:	Moving away form Tables to DIVs
		This allows more control over HTML elements via custom CSS
		This also disabled automatic table shrinking: means that,
		content can go over more than 2 pages if too long. 
		!! KEEEP an BACKUP of the OLD plugin before installing this update !!
- NEW:	Created New Buttons Section
- NEW:	Created New Exlusions Section
- NEW:	Moved Category Settings before Product Settings
- NEW:	Set your own width for image + content (in %)
- FIX:	Removed all uncontrolled BR tags
- FIX:	Disabled Caching for Cart PDF
- FIX:	Added locally images for gallery images also
- FIX:	Removed Valign 

======
1.5.8
======
- NEW:	Performance Section 
		Be carefull with belows settings and test your catalog!
		Disable Substitutions => This may add significantly to the processing time for large files.
		Use Simple Tables => Reduces memory use and increasing processing speed by approximately 30%
		Use Pack Table Data => Increases Time, Decreases Memory Usage
		Use Images Locally => Saves around 30%
- FIX:	Moved Caching Option to Performance Section

======
1.5.7
======
- NEW:	Generate a BarCode in the PDF
		See Data to Show Barcode. There you can set barcode type, 
		barcode meta key.
- NEW:	Filter for barcode: woocommerce_pdf_catalog_barcode
- FIX:	Added missing WPML key ids

======
1.5.6
======
- FIX:  Updated Tax meta class

======
1.5.5
======
- NEW:  Long waited now here: PDF Cart Export
		See Settings > General > Cart PDF Export Link
- NEW:  2 New filters for Changing the Layouts for differnent categories:
		woocommerce_pdf_catalog_category_layout
		woocommerce_pdf_catalog_products_layout
		See: https://www.welaunch.io/en/product/woocommerce-pdf-catalog//woocommerce-pdf-catalog/faq/modify-category-products-layout/
- FIX:	QR Code error when put in header / footer

======
1.5.4
======
- NEW:  Shortcode now accepts multiple categories 
		Example: [pdf_catalog category="19,23" text="Clothing Category (PDF)"]

======
1.5.3
======
- FIX:  PHP Notices

======
1.5.2
======
- NEW:  List Layout / Template for products

======
1.5.1
======
- FIX: Variation image size error
- FIX: Index not working anymore

======
1.5.0
======
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!! MPDF 7 requires at least PHP 5.6 				!!!!
!!!! Do NOT update if you are on a lower Version 	!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
- NEW:  PHP 7.2. Support
- NEW:  Moved MPDF to vendor folder for composer support
- NEW:  Option to enable MPDF Debugging (images, fonts)
- FIX:  Upgraded MPDF Rendering Engine to Version 7.0.3

======
1.4.8
======
- NEW:	Remove the link on product images
		See Data to Show > Link Image to product page
- NEW:  Split variations into multiple tables
		See Data to Show > Split Variations into multiple tables
		See Data to Show > Create a new table after X variations
- FIX:  Filename issue with cached files

======
1.4.7
======
- NEW:	Added an option to strip shortcodes from Short description
		See > Data to Show > Strip Shortcodes of Short Description
- NEW:	Added an option to strip shortcodes from Long description
		See > Data to Show > Strip Shortcodes of Description

======
1.4.6
======
- FIX:  Issue with categories where PHP version was below PHP 7

======
1.4.5
======
- NEW:  Option to order categories
- NEW:  Complete rewrite of how categories are fetched

======
1.4.4
======
- NEW:  Option to limit Variations
		When you have many variations the PDF breaks because of
		the height of the table. Now you can set a variations 
		limit. If limit reaches, then a link to the product page
		appears in the catalog

======
1.4.3
======
- NEW:  Moved variation price to the end of table
- FIX:  Gallery WooCommerce < 3.0 issues

======
1.4.2
======
- NEW:  Support for gallery images
- NEW:  Gallery Options:
	    - Show Gallery Images
	    - Gallery Image size
	    - Gallery Image Column
	    - Include Feature image in Gallery
- NEW:  Product template 7 (full width product pages)

======
1.4.1
======
- NEW:  Improved Variations Table
		New css classes
		Attribute names now do not repeat anymore
		Example: https://www.welaunch.io/en/product/woocommerce-pdf-catalog//wp-content/uploads/2017/10/variations-table.png
- NEW:  Option to set a variation image size

======
1.4.0
======
- FIX:  Columns adjusted themselves if not enough products were in category
		specially for layouts 4-6 

======
1.3.9
======
- NEW:  Show product category cover between categories in the PDF
- FIX:  Product container padding did not work for layouts 2-5

======
1.3.8
======
- FIX: PHP warnings

======
1.3.7
======
- NEW:  Filter for Product Title (woocommerce_pdf_catalog_product_title)
- NEW:  Filter for Product Short Description (woocommerce_pdf_catalog_product_short_description)
- NEW:  Filter for Product Description (woocommerce_pdf_catalog_product_description)

======
1.3.6
======
- NEW: 	Set a custom cover image for product categories
		See admin panel > Product Categories > Edit a product category > Custom Cover Image
- NEW: 	Filter for category descriptions
		See: https://www.welaunch.io/en/product/woocommerce-pdf-catalog//woocommerce-pdf-catalog/faq/modify-category-description/
- NEW:  Revert category exclusions to include categories
- FIX:  Notice error on line 243
- FIX:  wpcolorpicker is not a function

======
1.3.5
======
- FIX: Index Letters not sorted correctly
- FIX: Debug mode now after index / toc
- FIX: Removed the Yellow Notes on links

======
1.3.4
======
- NEW: WooCommerce Layerd Nav Filters now apply to the PDF Catalog
	   Example: Filtering for color > black.
	   Demo: https://www.welaunch.io/en/product/woocommerce-pdf-catalog//product-category/clothing/hoodies/?filter_color=black
	   Turn this off in Settings > General > "Enable Filtering"
- FIX: Do not show categories when no products are inside

======
1.3.3
======
- NEW: CSS classes for "Index":
		index_before
		index_after
- FIX: Cover page looks blurred in Firefox

======
1.3.2
======
- NEW: WPML Support (see string translation > admin_texts_woocommerce_pdf_catalog_options)
- FIX: Exclude parent category products issue

======
1.3.1
======
- FIX: Caching Issue

======
1.3.0
======
- NEW: Add a cover page to your catalog pages
- NEW: Remove footer / header on Table of Contents Page
	   Only when Cover page is turned off
- NEW: Reset the page number after ToC 
- FIX: Added classes to header / footer
- FIX: Improved Chaching Process

======
1.2.2
======
- NEW: 	Added ability to choose a padding for 
		product / category information container
- FIX: Removed all inline styles for custom CSS
- FIX: Font settings can now be better overwritten
- FIX: Issue with Table of contents font family
- FIX: Added many classes to the HTML categeory 

======
1.2.1
======
- NEW: Shortcode support for header / footer text option
- FIX: Added many classes to the HTML rendering

======
1.2.0
======
- NEW:	Add a Table of contents section to show a ToC
		- Enable ToC
		- Enable Paging
		- Enable Linking
		- Choose position (first or last Page)
		- Only show in Full Catalog only
		- Add a text before ToC
		- Add a text after ToC
		- Choose custom Font settings
- NEW:	Add an Index at the end of your catalog
		- Enable Index
		- Choose Key
		- Enable Letter Dividing
		- Enable Linking
		- Only show in Full Catalog only
		- Add a text before ToC
		- Add a text after ToC
		- Choose custom Font settings
- NEW:	Created a new section "Defaults" (PDF & font settings)
- NEW:	Choose an Format (A1, A2, A3, A4 ... A10, Letter, Legal, Executive, Folio)
- NEW:	Choose an Orientation (Portrait or Landscape)
- NEW:	Footer Padding
- NEW:	Header Padding
- NEW:  Hide Categories
- FIX:	Removed Container Padding (see Footer & Header Padding instead)
- FIX:	Adjusted the defaults values of the settings like demo
- FIX:	Product categories in full Catalog did not match menu order

=====
1.1.0
======
- NEW: Set a custom Font Family for category headings
- NEW: Set a custom Font Family for product headings
- NEW: Set a custom default Font Family for all texts
- NEW:	Added New Font Families: 
		Droid Sans, Droid Serif, Lato, Lora, Merriweather, 
		Montserrat, Open sans, Open Sans Condensed, Oswald, 
		PT Sans, Source Sans Pro, Slabo, Raleway
- FIX: Category layout 1 & 2 width

=====
1.0.16
======
- NEW: Exclude products, that are out of stock

=====
1.0.15
======
- FIX: WooCommerce 3.0 variable products compatibility

=====
1.0.14
======
- NEW: Render shortcode for short description

=====
1.0.13
======
- NEW:  Caching for PDF catalogs
		Will create a static PDF file in the "cache folder of plugin" everytime a user tries to generate a plugin
		Use the delete cache button to delete all files!

=====
1.0.12
======
- FIX: Plugin activation check
- FIX: WooCommerce 3.0 compatibility

=====
1.0.11
======
- NEW: Show product long description

=====
1.0.10
======
- FIX: Removed comments from PDF file when viewed in Chrome

=====
1.0.9
======
- NEW: Debug mode (see advanced settings > Debug Mode) – this will output the plain HTML
- NEW: show Attributes on the product

=====
1.0.8
======
- NEW: Updated MPDF Library to Version 6.1 (this also removes PHP 7 errors)
- NEW: decreased plugin size by 10MB (removed 2 fonts)

=====
1.0.7
======
- NEW: Better plugin activation
- FIX: Better advanced settings page (ACE Editor for CSS and JS )
- FIX: array key exists

=====
1.0.6
======
- FIX: Redux Error

=====
1.0.5
======
- NEW: Removed the embedded Redux Framework for update consistency
//* PLEASE MAKE SURE YOU INSTALL THE REDUX FRAMEWORK PLUGIN *//

======
1.0.4.1
======
- FIX: Order / Order by products

======
1.0.4
======
- NEW: Show Variations now possible (see data to show settings)
- NEW: Order / Order by products

======
1.0.3
======
- NEW: Exclude Product Categories
- NEW: Exclude Product Categories Products only
- NEW: Exclude Products
- NEW: Product Image is now linked to product URL
- NEW: Read More text with link to product URL (see Data Tab)

======
1.0.2
======
- NEW: removed unnecessary files to reduze plugin size

======
1.0.1
======
- NEW: limit access to administrators
- FIX: don't show category catalog on start Shop page

======
1.0.0
======
- Inital release

# Future features
=====
- Link to products inside PDF
- Different Font-Types
- Product variations