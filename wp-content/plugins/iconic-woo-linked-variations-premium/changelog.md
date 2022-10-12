**v1.4.1** (4 Oct 2022)  
[update] Added `$term_data` parameter to the `iconic_wlv_visual_swatch_data` filter  

**v1.4.0** (21 September 2022)  
[new] Added a new `iconic_wlv_visual_swatch_data` filter to allow modification of visual swatch data for Attribute Swatches  
[update] Improved compatibility between WLV, WAS and Astra Pro  
[fix] Do not modify WAS attribute label if Kadence Shop Kit is installed  
[fix] Only sort Attribute Swatches groups if the default group contains terms  
[fix] Prevent errors when post object does not exist when rendering links  

**v1.3.0** (1 March 2022)  
[update] Include Linked Variations group title to the exported CSV  
[update] Added new filter `iconic_wlv_product_linked_variations_data`  
[update] Added `iconic_wlv_linked_variation_image_args` and `iconic_wlv_linked_variation_image_placeholder` filters  
[update] Update dependencies  
[fix] Improve styling for Divi theme  
[fix] Fix issue where cache would miss for non linked variation products  

**v1.2.0** (13 Oct 2021)  
[new] Export linked variation data  
[update] Add HTML markup to colon in label  
[update] Cross/Fade out-of-stock linked variations when swatch style is inherited   

**v1.1.0** (26 Aug 2021)  
[new] New hooks added: `iconic_wlv_after_attribute_label` and `iconic_wlv_after_attribute_row`  
[update] New filter added `iconic_wlv_linked_variation_image_size`  
[update] Added support for the groups module of WooCommerce Attribute Swatches  
[update] Make sure backorder Linked Variations are visible even when out-of-stock products are hidden from Woo admin settings  
[fix] Fix issue where out-of-stock attribute swatches are not greying out  
[fix] Make LV group post type non queryable  
[fix] Terms with numeric slugs not appearing for "Inherit Swatch Style" setting  
[fix] HTML & CSS formatting improvements  

**v1.0.11** (20 Apr 2021)  
[update] Manually define the Database table collation  
[update] Update dependencies  
[fix] Handle condition where global $product is not available  
[fix] Fix utm parameters trimming issue when Dropdown style is used  

**v1.0.10** (13 Aug 2020)  
[update] Add filter `iconic_wlv_term_button_attributes`  
[update] Compatibility with WordPress 5.5  
[update] Update dependencies  

**v1.0.9** (15 Jun 2020)  
[new] Compatibility with [WooCommerce Attribute Swatches](https://iconicwp.com/products/woocommerce-attribute-swatches/)  
[update] Change data type for post_id column to bigint(20)  
[fix] WPML compatiblity - fix get_terms() issue  
[fix] Fix PHP warnings  

**v1.0.8** (21 Apr 2020)  
[update] Update dependencies  
[fix] Remove double colon when used with WooCommerce Attribute Swatches  
[fix] Ensure correct product ID is used for WPML  
[fix] Exclude `cpt_iconic_wlv` from search  

**v1.0.7** (18 Mar 2020)  
[update] Version compatibility  

**v1.0.6** (26 Sep 2019)  
[new] Added actions iconic_wlv_before_variations_display and iconic_wlv_after_variations_display  
[new] Add [iconic_wlv_links] shortcode to display product links in page builders  
[update] Update dependencies  
[fix] Ensure dropdowns don't reload the page if the location is the same  
[fix] Missing function when importing  
[fix] Issue with attribute label translation when using WPML  
[fix] Issue where active attribute was not being selected for translated WPML products  
[fix] Make sure selected group for product is published  

**v1.0.5** (1 July 2019)  
[fix] Freemius Fix  

**v1.0.4** (2 Mar 2019)  
[fix] Security Fix  

**v1.0.3** (6 Dec 2018)  
[update] Compatibility with WP 5.0  
[update] Compatibility with Woo 3.5.2  
[update] Update dependencies  
[update] Change import class to work with all post meta imports  
[fix] Ensure product IDs are saved in the same format when importing/saving  
[fix] Ensure linked variations only show when the group has a valid status  
[fix] The linked variations meta data was lost when using the wp quick editor  
[fix] Ensure variation options are displayed properly in all themes  
[fix] Linked Variations didn't appear on translated products  

**v1.0.2** (10 Sep 2018)  
[update] Add Iconic core classes  
[update] Skip option group in dropdown if no terms  

**v1.0.1** (14 Aug 2018)  
[new] Display options as dropdown or buttons  
[update] Add stock visibility and new helper classes  
[update] Add WP All Import Compatibility  
[update] Allow import by SKU  
[update] Add WPML Compatibility  
[update] Update Freemius  
[update] Update settings framework  
[update] Add some usable hooks throughout (see docs)  
[fix] Current product sometimes selected more than 1 product

**v1.0.0** (08/01/2018)  
[new] Initial Release