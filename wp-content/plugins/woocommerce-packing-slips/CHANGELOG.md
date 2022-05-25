# Changelog
======
1.2.8
======
- NEW:	Show QR code in packing slip {{qr_code}}
- NEW:	Show Barc in packing slip {{barcode}}

======
1.2.7
======
- FIX:	Arabic support
- FIX:	Preview Order ID select field appeard on other admin pages
- FIX:	REmoved QR code option

======
1.2.6
======
- FIX:	Updated MPDF library to support PHP 8.0
- FIX:	Added MPDF QR Code library

======
1.2.5
======
- NEW:	Add a custom Email where packing slips will be sent to
		https://imgur.com/a/EuadKb9

======
1.2.4
======
- NEW:	Dropped Redux Framework support and added our own framework 
		Read more here: https://www.welaunch.io/en/2021/01/switching-from-redux-to-our-own-framework
		This ensure auto updates & removes all gutenberg stuff
		You can delete Redux (if not used somewhere else) afterwards
		https://www.welaunch.io/updates/welaunch-framework.zip
		https://imgur.com/a/BIBz6kz

======
1.2.3
======
- FIX:	Manual order creation also creates packing slip

======
1.2.2
======
- NEW:	Added PHP 7.4 support
- NEW:	Updated the MPDF Rendering Engine from Version 7 to 8
- NEW:	Added date format compatiblity for date_completed & date_paid

======
1.2.1
======
- FIX:	Added support for vars in header / footer

======
1.2.0
======
- NEW:	Added more than 10 options to set a custom Colum Name and Width for all data
- NEW:	Show price in packing slips
- NEW:	Created a hook for data to show (saved as an array now) or columns in the PDF for custom Data
		Filter woocommerce_packing_slips_data_to_show
		Filter value: woocommrce_packing_slips_data_to_show_custom_value_{{KEY Set in array above}}
- FIX:	Updated POT File

======
1.1.6
======
- FIX:	If a product is variation and has not an own image assigned it uses the main products image

======
1.1.5
======
- NEW:	Added an option to set an own time format (see advanced settings)

======
1.1.4
======
- NEW:	Added an option to set the image size

======
1.1.3
======
- NEW:	Show Product Image in Invoices
- NEW:	Show Product Dimensions in Invoices
- FIX:	Added a check if product really exists otherwise an error occured
		Note: deleted products can not show Image, SKU or Weight data

======
1.1.2
======
- FIX:	Added support for partially refunded order new

======
1.1.1
======
- FIX:	PHP Error when order not found

======
1.1.0
======
- NEW:	Added an option to enable / disable product links

======
1.0.11
======
- NEW:	State & Country fields are now written out (instead of code)
		if you still want to use the code, then use {{_billing_country}} 
		instead of {{billing_country}}

======
1.0.10
======
- NEW:	Use variables in header & footer

======
1.0.9
======
- NEW:	Added 24 formats (like A5, A4, A4 Landscape etc)

======
1.0.8
======
- FIX:	Update PDF not possible from admin > single order page

======
1.0.7
======
- FIX:	Issue with custom order status plugin by WooCommerce

======
1.0.6
======
- NEW:	Added German translations
- FIX:	Updated POT 

======
1.0.5
======
- FIX:	Total was 12
- FIX:	Date not translated
- FIX:	Columns not ordered

======
1.0.4
======
- FIX:	Preview frame opened in theme options when ID exists

======
1.0.3
======
- FIX:	Packing slip attached to email attachment

======
1.0.2
======
- NEW:	Set your own order status types for sending email pdf attachments
- NEW:	Added user Meta Data to variables you can use in the PDF Invoice

======
1.0.1
======
- FIX:	Multiple PHP Notices

======
1.0.0
======
- Inital release

# Future features
- NONE