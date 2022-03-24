=== Donation For WooCommerce ===
Contributors: wpexpertsio
Tags: WooCommerce, Donation, Product
Requires at least: 4.9
Tested up to: 5.2
Requires PHP: 5.6
Stable tag: 2.0.0
License: GNU General Public License v3.0
License URI: http://www.gnu.org/licenses/gpl-3.0.html

== Description ==
A powerful WooCommerce Donation Extension which lets you collect donations easily without any transaction fee. User have an option to Generate multiple campaigns and raise funds for multiple causes. Provide the option to your donors at the cart page to donate instantly along with another product purchase.

== Installation ==
1- Download Donation For WooCommerce from WooCommerce.com
2- Go to: WordPress Admin > Plugins > Add New and Upload Plugin with the file you downloaded with Choose File.
3- Install Now and Activate the extension.

== Changelog ==	
Version 1.0
1- Initial release.


== wc donation action filters ==
* wc_donation_before_product_update, array $prod
* wc_donation_before_product_create, array $prod
* wc_donation_get_campaign_id_by_product_id, array $args
* wc_donation_get_campaign, array $campaigs, $campaign_id (opt)
* wc_donation_total_donation_count, $total_donations_count, $product_id (opt)
* wc_donation_total_donation_amount, $total_donation_amount, $product_id (opt)
* wc_donation_total_donation_count_on_renewal, $total_donations_count, $product_id (opt)
* wc_donation_total_donation_amount_on_renewal, $total_donation_amount, $product_id (opt)
* wc_donation_alter_donate_response, array $response
* wc_donation_localize_script, array $parameters
* wc_donation_other_amount_placeholder, $placeholder, $min_amount, $max_amount

== wc donation action hooks ==
* wc_donation_before_save_product_meta, $campaign_id, $product_id
* wc_donation_after_save_product_meta, $campaign_id, $product_id
* wc_donation_before_archive_add_donation_button
* wc_donation_after_archive_add_donation_button
* wc_donation_before_single_add_donation, $campaign_id
* wc_donation_after_single_add_donation, $campaign_id
* wc_donation_before_shortcode_add_donation, $campaign_id
* wc_donation_after_shortcode_add_donation, $campaign_id
* wc_donation_before_save_campaign_meta, $campaign_id
* wc_donation_after_save_campaign_meta, $campaign_id
* wc_donation_before_display_meta_on_cart, $item_data, $cart_item
* wc_donation_before_donate
* wc_donation_after_donate
* add_popup_before_order
* wc_donation_before_checkout_add_donation, $campaign_id
* wc_donation_after_checkout_add_donation, $campaign_id
* wc_donation_before_cart_add_donation, $campaign_id
* wc_donation_after_cart_add_donation, $campaign_id
* wc_donation_before_widget_add_donation, $campaign_id
* wc_donation_after_widget_add_donation, $campaign_id
