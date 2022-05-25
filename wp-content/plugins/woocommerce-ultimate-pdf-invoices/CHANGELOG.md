# Changelog
======
1.4.8
======
- FIX:	When only completed status was checked for invoice generation
		it did not inserted the invocie number on PDFs sent out
- FIX:	Stripe refunds caused 500 error
- FIX:	Description field translation not visible in admin panel

======
1.4.7
======
- NEW:	Added a new variable "coupons_used" showing all coupon names applied
- FIX:	Fatal error for creating order in backend

======
1.4.6
======
- NEW:	Set a custom Invoice Start Number
		https://imgur.com/a/cPhJ286
- NEW:	Choose bar code value: invoice number or QR code
		https://imgur.com/a/cPhJ286
- NEW:	Show old invoices
- FIX:	Invoice not created on order emial sent
- FIX:	Arabic support in backend

======
1.4.5
======
- NEW:	Added support for our delivery plugin:
		https://www.welaunch.io/en/product/woocommerce-delivery/
- NEW:	Totals data enable
		https://imgur.com/a/A5AtOuK
- NEW:	Multi Currency support
- NEW:	Show QR code in Invoice {{qr_code}}
- NEW:	Show Barc in Invoice {{barcode}}
- NEW:	Added Shipping excl. Taxes totals option
- NEW:	Added Shipping Taxes totals option
- FIX:	Subtotal wrong when products shown without taxes
- FIX:	Custom fonts PHP array issue

======
1.4.4
======
- FIX:	Invoice not attached to emails

======
1.4.3
======
- NEW:	Option to create invoices & numbers only on certain Order status
		https://imgur.com/a/QtGpMTo
- FIX:	Invoice created for orders with excluded status
- FIX:	Invoice number wrong created
- FIX:	Undefined index title php notice

======
1.4.2
======
- NEW:	Show refunded total
		https://imgur.com/a/RYUScZu
- NEW:	In- and Exclude user roles
		https://imgur.com/a/djxAfgY
- NEW:	Show discounted line items:
		https://imgur.com/a/DQu0aJh
- NEW:	Updated all translations
		Italian, German, French, Spanish, Dutch, Swedish etc.
- FIX:	Single discount column shows negative value now instead of positive discount

======
1.4.1
======
- NEW:	Added discount / coupon to order total data to show settings
- FIX:	Line total wrong calculated

======
1.4.0
======
!!! IMPORTANT Check & Save your Settings after update IMPORTANT !!!

- NEW:	Reveamped data to show sections
		https://imgur.com/a/tnA2uFs
		You can not reorder item & total data and enable / disable it
		New fields for sub & total with or without Tax introduced
- NEW:	Moved item row color settings to layout section
- NEW:	Moved outro text to top
- FIX:	Product item taxes show tax label now (only when more than 1 tax rate applied)
- FIX:	Price TH not aligned right
- FIX:	Removed QR code option

======
1.3.18
======
- NEW:	Tax including text now contains variables
		IMPORTANT: Check this setting after update
		https://imgur.com/a/udImE8k
- FIX:	Updated MPDF library to support PHP 8.0
- FIX:	Added MPDF QR Code library
- FIX:	weLaunch framework load prio 1

======
1.3.17
======
- NEW:	Dropped Redux Framework support and added our own framework 
		Read more here: https://www.welaunch.io/en/2021/01/switching-from-redux-to-our-own-framework
		This ensure auto updates & removes all gutenberg stuff
		You can delete Redux (if not used somewhere else) afterwards
		https://www.welaunch.io/updates/welaunch-framework.zip
		https://imgur.com/a/BIBz6kz
- FIX:	IMPORTANT! Renamed the original file name ! IMPORTANT
		YOU NEED TO REACTIVATE THE PLUGIN
- FIX:	jQUery load deprecated


======
1.3.16
======
- NEW:	Added an option to show discount / coupon total amount
- NEW:	Saved value now contains sale + coupon amount

======
1.3.15
======
- NEW:	Added an option to show long & short description
- NEW:	Added an option to show saved price for sale products in total
- FIX:	Removed Help taks

======
1.3.14
======
- NEW:	Add a invoice number suffix
- FIX:	Shipping tax costs not showed in tax rates

======
1.3.13
======
- NEW:	Better wc item lable styling
- NEW:	Bulk download also now contains invoice number as PDF file
- FIX:	if date variable not used invoice number wrong

======
1.3.12
======
- NEW:	Hide cart subtotal, payment or shipping method:
		https://imgur.com/a/8dTko3a
- FIX:	Products missing from pdf invoice

======
1.3.11
======
- NEW:	If invoice number exists, the invoice file will also be named like this
- FIX:	Manual order creation now also creates invoice number & invoice pdf

======
1.3.10
======
- FIX:	Create order manually issue

======
1.3.9
======
- NEW:	Guest users can download PDF from Thank you page through hash key check

======
1.3.8
======
- NEW:	Added PHP 7.4 support
- NEW:	Updated the MPDF Rendering Engine from Version 7 to 8
- NEW:	Added date format compatiblity for date_completed & date_paid

======
1.3.7
======
- FIX:	Updated POT File
- FIX:	Updated WPML Keys with lastest added features

======
1.3.6
======
- NEW:	Show product attributes below product name
		Example: https://imgur.com/a/edCuvqt

======
1.3.5
======
- FIX:	Total table head not right aligned
- FIX:	Option name in backend wrong for VAT in Percent
- FIX:	VAT percentage calculation not working when tax class empty

======
1.3.4
======
- NEW:	Added 2 new fields:
		- one for show total price without VAT
		- one for VAT in percentage

======
1.3.3
======
- NEW: 	Show product price without taxes setting
		Demo: https://imgur.com/a/jFk3Ati
- FIX:	Select order preview shown on all admin pages

======
1.3.2
======
- NEW:	You can add custom PDFs now to mail attachments & Customer thank you / order page
		Examples: https://imgur.com/a/Gk34zFz
- FIX:	Added CSS classes to download PDF in thank you page
- FIX:	Updated POT

======
1.3.1
======
- NEW:	Added classes to all td and th table cells
- FIX:	Total column options not working
- FIX:	Key filter not working

======
1.3.0
======
- NEW:	Added more than 10 options to set a custom Colum Name and Width for all data
- NEW:	Show price in packing slips
- NEW:	Created a hook for data to show (saved as an array now) or columns in the PDF for custom Data
		Filter woocommerce_pdf_invoices_data_to_show
		Filter value: woocommrce_pdf_invoices_data_to_show_custom_value_{{KEY Set in array above}}
- FIX:	Updated POT File

======
1.2.9
======
- NEW:	Added an option to show total taxes before total order amount
		See General > Show Taxes before Total
		Example: https://imgur.com/a/TXcJPZM

- NEW:	Added a new field for invoice due date (see general > Invoice Due Date Days)
		Use {{invoice_due_date}} as the variable
		Example: https://imgur.com/a/K4SnrUI

======
1.2.8
======
- NEW:	Show VAT / taxes per product line
		See Settings > Content > Show Product VAT

======
1.2.7
======
- FIX:	If a product is variation and has not an own image assigned it uses the main products image

======
1.2.6
======
- NEW:	Added an option to set an own time format (see advanced settings)

======
1.2.5
======
- NEW:	Added an option to set the image size

======
1.2.4
======
- NEW:	Show Product Image in Invoices
- NEW:	Show Product Dimensions in Invoices
- FIX:	Added a check if product really exists otherwise an error occured
		Note: deleted products can not show Image, SKU or Weight data

======
1.2.3
======
- FIX:	Added support for partially refunded order new

======
1.2.2
======
- FIX:	Added support for partially refunded order
- FIX:	Invoice not created for on hold orders

======
1.2.1
======
- FIX:	PHP Error when order not found

======
1.2.0
======
- NEW:	Added an option to enable / disable product links

======
1.1.6
======
- FIX:	Manual created orders do not created invoice numbers

======
1.1.5
======
- NEW:	State & Country fields are now written out (instead of code)
		if you still want to use the code, then use {{_billing_country}} 
		instead of {{billing_country}}

======
1.1.4
======
- NEW:	Use variables in header & footer

======
1.1.3
======
- NEW:	Added 24 formats (like A5, A4, A4 Landscape etc)

======
1.1.2
======
- FIX:	Update PDF not possible from admin > single order page

======
1.1.1
======
- FIX:	Issue with custom order status plugin by WooCommerce

======
1.1.0
======
- NEW:	Invoice Numbers are now possible
		See settings > Invoice Numbers
		After defining your invoice data you should regenerate invoice numbers
		In PDF invoice data you can then use {{invoice_number}} as a variable

======
1.0.8
======
- FIX:	Updated POT translations

======
1.0.7
======
- FIX:	Date not translated

======
1.0.6
======
- FIX:	Preview frame opened in theme options when ID exists

======
1.0.5
======
- NEW:	Set your own order status types for sending email pdf attachments
- NEW:	Added user Meta Data to variables you can use in the PDF Invoice

======
1.0.4
======
- NEW:	Hide or show sku, price, quantity etc.
- FIX:	Multiple PHP Notices

======
1.0.3
======
- FIX:	PHP Notice
- NEW:	Added Packing Slips plugin as seperate plugin

======
1.0.2
======
- NEW:	Credit Note PDFs supported and attached 
		to refunded order Emails
- NEW:	Filters for apply_filters function
		woocommerce_pdf_invoices_header
		woocommerce_pdf_invoices_address
		woocommerce_pdf_invoices_content
		woocommerce_pdf_invoices_footer
		woocommerce_pdf_invoices_address_left
		woocommerce_pdf_invoices_address_right
		woocommerce_pdf_invoices_content_intro
		woocommerce_pdf_invoices_content_outro
- FIX:	Security fix for logged in customers

======
1.0.1
======
- NEW: 	Added translation languages:
		-> da_DK
		-> de_DE
		-> en_US
		-> en_US
		-> es_ES
		-> fr_FR
		-> it_IT
		-> nl_NL
		-> pt_PT
		-> ru_RU
		-> sv_SE
- FIX:	Updated POT File
- FIX:	Updated WPML config

======
1.0.0
======
- Inital release