**v5.2.2** (1 Jun 2023)  
[new] Declared compatibility with WooCommerce's HPOS feature  
[fix] Fixed a bug affecting attribute images when attribute terms contain diacratic characters  

**v5.2.1** (12 May 2023)  
[fix] Fixed bug where default selections influenced by 3rd party plugins fail in some contexts.  
[fix] Fixed an attribute images bug relating to attribute value spacing.  

**v5.2.0** (26 Apr 2023)  
[update] Updated Plyr JS config to match PHP for consistency.  
[update] Force the slider to re-calculate position after lazy loading for improved compatibility.  
[update] Fire JS logic for visible variations forms only to cater for sites using additional mobile/tablet variations forms as part of adaptive layouts.  
[update] Calculate the aspect ratio of the global product video separately to other media embeds.  
[update] Several minor changes to improve video loading in fullscreen and on mobile.  
[update] Added a fallback to the "full" image size when calculating aspect ratios, if a particular size does not exist.  
[update] Improved window resize logic/performance for a better experience when changing/resizing the viewport.  
[update] Several minor changes to variation/attribute images JS to make it more robust.  
[fix] Honour the 'no' value of the "maintain slide index" setting on variation change.  
[fix] Ignore global aspect ratio if the image is narrower than the image size width setting.  
[fix] Calculate thumbnail slide image aspect ratio based on the thumbnail size rather than the original image size.  
[fix] Enforced integer values when modifying gallery thumbnail image size data.  
[fix] Check for youtu.be URLs when retreiving media embeds to display in the gallery.  
[fix] Removed source map reference from the Plyr video library to prevent missing source map error in the console.  
[fix] Prevented global product video from being generated as an iFrame when the source file is MP4.  
[fix] Enforced a sensible default aspect ratio to catch empty ratio values.  
[fix] Fixed a regression to prevent an unnecessary gallery refresh when no variation/attribute images are available.  
[fix] Prevented placeholder slides from generating empty thumbnails.  
[fix] Resolved WPML compatibility issues causing attribute images to not load in other languages.  
[fix] Restored missing srcset attribute for first gallery slider image.  
[fix] Silenced an error in the dashboard when image size settings are set to 0.  

**v5.1.1** (15 Feb 2023)  
[fix] Issue affecting Divi theme compatibility  

**v5.1.0** (15 Feb 2023)  
[update] Improvements relating to image lazy loading and aspect ratio calculations  
[update] Products with un-cached galleries containing videos will now load even faster than before  
[update] Minor updates to WooThumbs layout templates; please update your copies accordingly  
[update] Setting Relocated: `Use Gallery Images for Variations and Attributes` has been relocated to the `Display` tab  
[update] Setting Relocated: `Maintain Slide Index` has been relocated to the `Slider` tab  
[update] Settings Tab Renamed: `Images` is now known as `Stacked` due to recent settings changes  
[fix] Resolved issue causing slow page load performance when using multiple videos  
[fix] Improved potential CLS score by switching from CSS `display` to `visibility` to modify the visibility of the main gallery images container  
[fix] Forked the Slick JavaScript library used to power the Slider layout and patched several small issues  
[fix] Resolved several small PHP issues causing notices/errors; including some specific to PHP 8.1  
[fix] Variation image thumbnails no longer disappear when editing product variations in some contexts  
[fix] Prevented vertical stretching of slides when using the Stacked Layout  
[fix] Added compatibility with the BB Themer plugin  
[fix] Resolved issues with the loading of variation/attribute images in certain contexts  
[fix] Thumbnail slider arrows are no longer vertical in Slider mode on mobile  
[fix] Prevented a JavaScript error when no attribute images data is available  
[fix] Refactored logic powering the `Maintain Slide Index` setting to fix several minor issues  
[fix] Prevented the active thumbnail border fading in when the thumbnails load  
[fix] Resolved two JavaScript logic issues affecting variation/attribute image loading on the front-end  
[fix] Check for Divi theme before running the relevant compatibility logic  
[fix] Changed the inline placeholder GIF image from white to transparent to prevent the "white flash" during lazy loading in some contexts  
[fix] Resolved the issue preventing Stacked thumbnails from being clickable in some contexts  
[fix] Long gallery titles/captions no longer bleed into the slide content in fullscreen mode  
[fix] Fullscreen icon visibility issues resolved for media slides in Slider mode  
[fix] Silenced notices generated when running WP CLI commands  

**v5.0.0** (25 Jan 2023)  
[new] Introducing dynamic image switching — assign images to attribute values and watch your product gallery update instantly as customers make their selections  
[new] Bring your video content to life with our new video player skin! Embed videos from YouTube, Vimeo, and MP4 media with ease, and customize your player with our new settings for an immersive experience  
[new] Unleash the full potential of your product images with our new stacked gallery layout setting! Choose from 7 stunning presets to showcase your products in the most visually appealing way possible  
[new] Effortlessly enhance your product pages with WooThumbs - now fully integrated with the Block Editor (a.k.a Gutenberg) for seamless integration with your website  
Setting to enable poster images for YouTube, Vimeo and MP4 media embeds 
[new] Thumbnail hover navigation setting for stacked thumbnails  
[new] Keyboard arrow navigation support added for Slider galleries  
[new] Image captions are now visible in the fullscreen gallery  
[update] Experience lightning-fast image loading with our refactored image fetching logic - optimized for improved performance  
[update] Setting to completely disable image caching  
[update] Use a dedicated caching table in the database instead of a settings option  
[update] Slider layout galleries now lazy load images progressively  
[update] Migrated settings from the Variations tab to the Images tab  
[update] Removed logic and styles that re-positioned the On Sale element so that it appeared inside WooThumbs  
[update] Updated PhotoSwipe library to version 5 and completely refactored the implementation  
[update] Refactored the way variation images are loaded when editing a product to reduce HTTP requests  
[update] Prevented default gallery images from being re-requested when editing a product to reduce HTTP requests  
[update] Override WooThumbs templates in themes using the `/woocommerce/woothumbs/` directory  
[update] JS/CSS enqueues are now hooked in at a later priority to reduce theme compatibility issues  
[update] Replaced gallery and fullscreen icons with SVGs  
[update] Updates to the settings framework  
[update] Renamed the `Responsive` settings tab to `Mobile`  
[fix] Improvements to Divi compatibility to prevent a PHP notice  
[fix] Maintain Slide Index setting should now be honoured in all contexts  

**v4.16.3** (2 Jan 2023)  
[fix] Prevented a fatal error in certain contexts where the `$product` global variable is not an object  

**v4.16.2** (2 Jan 2023)  
[fix] Resolved a compatibility issue with the Iconic QuickView modal  

**v4.16.1** (7 Oct 2022)  
[update] Settings framework updated  

**v4.16.0** (27 Sep 2022)  
[update] Added additional defensive checks for missing images in the media library  
[fix] Prevent thumbnail play icon from showing when non-video embeds are used  
[fix] Prevent errors when the post object does not exist when rendering a shortcode  
[fix] Fixed incorrect thumbnail navigation direction on mobile in RTL mode  

**v4.15.3** (17 Aug 2022)  
[fix] Prevented broken thumbnail syncing when below the responsive breakpoint in some contexts  

**v4.15.2** (10 Aug 2022)  
[update] Improved compatibility with Flatsome's Quickview feature  

**v4.15.1** (22 Jul 2022)  
[fix] Gallery thumbnails now look and behave correctly in RTL mode  

**v4.15.0** (30 May 2022)  
[new] Added a new filter to show the parent product featured image on variations  
[update] Refactored variations form data output to improve page builder compatibility  

**v4.14.0** (28 Apr 2022)  
[new] Added new filters for modifying MP4/iFrame embed output.  
[new] Added a new getting started tab to the plugin settings.  

**v4.13.0** (7 Apr 2022)  
[update] Added new JS filters to modify carousel functionality  
[update] Modified the JS load event logic to make it more robust  
[update] HTML hex colour setting values are now sanitized on save  
[fix] Enforce 100% width for the gallery on mobile if the responsive thumbnail count is 0  
[fix] Fixed a bug with the product variation tab AJAX request caching  
[fix] Compatibility fix for Flatsome's Quickview feature  

**v4.12.0** (1 Mar 2022)  
[new] New setting to change between dark/light fullscreen icon styles.  
[update] Updated WPML config to include product image gallery field.  
[update] Added a filter for disabling gallery image deduplication.  
[update] Prevent a duplicated onsale element when using Divi theme/builder.  
[update] Updated Freemius SDK.  
[fix] Portrait aspect ratio media is now properly displayed in full screen.  

**v4.11.0** (2 Feb 2022)  
[new] Compatibility with page-based products when using the Divi theme builder  
[new] Compatibility with Hello Elementor theme to resolve "on sale" element styling  
[update] Duplicated images will no longer be included in the gallery  
[update] Compatibility with JetWoo Popup plugin's quick view feature  
[fix] Prevent disabling WooThumbs from breaking the gallery in Divi builder  
[fix] Prevent fatal errors during execution of dynamic styles when using PHP 8.1  

**v4.10.0** (21 Dec 2021)  
[new] Added support for customising image HTML output via a new `iconic_woothumbs_js_tpl` filter  
[update] Improve default sale badge positioning  
[fix] Prevented FVPlayer's legacy browser JavaScript from breaking WooThumbs carousel on variation change  
[fix] Fixed issue with Product Badges compatibility relating to visibility logic  
[fix] Added video iframe compatibility with Salient theme  
[fix] Prevent third party plugins/scripts from triggering duplicate click events on video play  

**v4.9.0** (27 Oct 2021)  
[new] Woostify compatibility  
[new] Add compatibility with ShortPixel Adaptive Images  
[update] Compatibility with WCPB Product Badges  
[update] Update dependencies  
[fix] Fix issue where fullscreen would automatically close after fullscreen button is clicked on MP4 videos  

**v4.8.12** (9 Sep 2021)  
[fix] Ensure has_thumbnail check uses variation ID  

**v4.8.11** (8 Sep 2021)  
[fix] Minor issue where settings page wasn't showing some settings as "selected"  

**v4.8.10** (8 Sep 2021)  
[update] Update dependencies  
[update] Change gallery images setting description  
[fix] Delete legacy variation images meta field to prevent conflicts when saving variations  
[fix] Fix gallery images when variation has no images  

**v4.8.9** (13 Aug 2021)  
[update] Update dependencies  
[fix] Add variation image gallery from legacy meta field  

**v4.8.8** (10 Aug 2021)  
[update] Move gallery and index settings to global settings page  
[fix] Update legacy logic to add parent gallery  
[fix] Fix Flatsome lightbox issue where `$product` is undefined  

**v4.8.7** (28 Jul 2021)  
[update] Update the data-slide-count value in the DOM dynamically  
[update] Update dependencies  
[fix] Auto hide sticky play/pause button on mobile devices  
[fix] Remove code which removes auto WooThumbs gallery when using Elementor  
[fix] Prevent adding parent gallery to variation edit screen  
[fix] Fix timeout issue when setting thumbnail count to 0 on mobile  

**v4.8.6** (1 Jul 2021)  
[fix] Missing onboarding files  

**v4.8.5** (1 Jul 2021)  
[new] Allow variation images to be imported using the product importer  
[update] Update dependencies  
[update] Respect Divi product selection setting in Woo Images Module  
[fix] Escaping issue when attribute values have quotes in them  
[fix] Issue on Edge Browser where video starts from 3 seconds instead of beginning  
[fix] Fix division by zero warning when thumbnail count setting was set to zero  
[fix] Gallery issue on resizing window and changing screen orientation  
[fix] Fix ghost click issue when close button is clicked on the photoswipe gallery  
[fix] Fix video play icon not working on iOS devices  

**v4.8.4** (24 Feb 2021)  
[update] Add filter `iconic_woothumbs_is_admin`  
[update] Update dependencies  
[update] Update POT file  
[fix] Blank placeholder issue  
[fix] Browser crash when Thumbnails Count After Breakpoint is zero  
[fix] Youtube/Vimeo video fullscreen issue  
[fix] Fix issue with embed video having quote  

**v4.8.3** (14 Dec 2020)  
[new] Swipe Threshold setting  
[update] Compatibility with WP 5.6  
[update] Add skip-lazy class to prevent lazy-loading images  
[update] Update dependencies  
[update] Update POT file  
[fix] Issue when shortcode is used outside the Product loop  
[fix] Prevent vertical pixel line at some browser sizes  
[fix] Phantom video opening when using the play icon  
[fix] Astra theme's quickview bug  
[fix] Fix database Deadlock issue  

**v4.8.2** (13 Aug 2020)  
[new] Lazyload option for MP4 videos  
[fix] Replace `$.live` function with `$.on` function  
[update] Compatibility with WordPress 5.5  
[update] Update dependencies  

**v4.8.1** (28 Jul 2020)  
[update] Improved security  
[update] Compatibility with Divi Theme Builder  
[update] Swipe to thumbnail instead of one at a time  
[fix] Spinner loading indefinitely for variations  
[fix] Thumbnail slider issue in RTL sites  

**v4.8.0** (21 Apr 2020)  
[new] Compatiblity with Elementor plugin  
[new] Compatiblity with Divi theme  
[new] Flatsome Theme - Automatically replace Product Gallery Widget with WooThumbs  
[new] Allow media to be embedded as an iframe  
[update] Add `iconic_woothumbs_load_assets` filter for enabling assets  
[update] Allow media to embedded as an iframe  
[update] Ensure iframes aren't lazyloaded to prevent loading issues  
[update] Fullscreen styling and transitions  
[update] Updated Dependencies  
[fix] Type check thumbnail image size to prevent errors  
[fix] use flex for stacked thumbnails to prevent stacking issues  
[fix] Nested ternary warning in settings framework  
[fix] Type check thumbnail image size to prevent errors  
[fix] Ensure videos load in fullscreen mode  
[fix] Fix Attach MP4 button style in media library  
[fix] Ensure video icon appears during zoom  

**v4.7.2** (16 Mar 2020)  
[update] Version compatibility  

**v4.7.1** (11 Feb 2020)  
[new] Compatibility with WooCommerce Subscriptions  
[new] Onboarding on settings page  
[update] Add button to make inserting MP4s easier  
[update] Added default gallery widths for popular themes  
[fix] Ignore intrinsic video settings in twentytwenty theme  
[fix] Add CSS to fix width issue in Avada theme  
[fix] Reduce height of slider arrows so video controls are accessible  

**v4.7.0** (9 Dec 2019)  
[new] Use product title as image alt if none is set  
[new] Allow direct embeds of .mp4 files (local media uploads allowed!)  
[update] Add `iconic_woothumbs_get_product_setting` filter  
[update] Add `iconic_woothumbs_is_enabled` filter  
[update] Clear variation image cache on wp-all-import  
[update] Cache image size data for same page loads  
[update] Refresh after images loaded for slower connections  
[update] Compatibility with WP Smush Lazyload  
[update] Update dependencies  
[update] Change active thumbnail styling  
[fix] Don't allow missing images to be displayed  
[fix] Prevent WooThumbs from loading if WooCommerce is deactivated  
[fix] $product object being overwritten when fetching props  
[fix] Ensure imagesloaded works for iframes and media too  

**v4.6.23** (19 Nov 2019)  
[update] Version compatiblity  

**v4.6.22** (1 July 2019)  
[fix] Update for Freemius.  

**v4.6.21** (1 Mar 2019)  
[fix] Security fix  

**v4.6.20** (6 Dec 2018)  
[update] Compatibility with WP 5.0  
[update] Compatibility with Woo 3.5.2  
[update] Update dependencies  
[fix] Check if "product" before getting gallery IDs  

**v4.6.19** (5 Nov 2018)  
[fix] Issue with image regeneration causing timeout  
[fix] Yith Wishlist double icon showing  

**v4.6.18** (30 Oct 2018)  
[update] Ensured compatibility with Woo 3.5.0  
[update] Compatibility with Flatsome theme's product quickview  
[update] Ensured compatibility with jQuery 3.0.0+  
[update] Update dependencies  
[update] Ensure image size defaults are as per theme  
[fix] Blurry product images in Woo 3.5.0  
[fix] Regeneration error when saving options if regeneration is disabled  

**v4.6.17** (12 Sep 2018)  
[fix] Ensure the active slide is targeted correctly  

**v4.6.16** (10 Sep 2018)  
[update] Implement new Iconic Core classes  
[update] Update deps  
[fix] Don't get cloned slides in fullscreen gallery  
[fix] Ensure zoom loads on first image and configurator  
[fix] Don't cache variations to avoid issues with dynamic data  

**v4.6.15** (21 Aug 2018)  
[fix] Fix Safari imagesloaded issue  

**v4.6.14** (16 Aug 2018)  
[update] Settings framework  
[update] Freemius  
[update] Added getting started links to dashboard  
[update] Add filter to enable/disable fullscreen `iconic_woothumbs_enable_fullscreen`  
[fix] Stop sliding/jump in FireFox when changing images  
[fix] Fix vertical sliding thumbnails height in FF  
[fix] Fix PHP warning when no cropping ratios set  

**v4.6.13** (13 Jun 2018)  
[fix] Fix "non-numeric" error message  

**v4.6.12** (11 Jun 2018)  
[update] Clean up admin scripts  
[update] Add product object to `iconic_woothumbs_images_loaded` trigger  
[update] Add product ID to `iconic_woothumbs_single_image_data` filter  
[update] Change active thumbnail styling  
[update] Update Freemius  
[update] Update POT  
[update] Compatibility with WooCommerce Product Configurator by Iconic  
[fix] Prevent meta transition from querying meta on every load  
[fix] Allow no cropping on thumbnails  
[fix] Only run script resize if window has changed size  
[fix] Zoom cursor style before loaded  
[fix] Configurator - ensure media thumbnail doesn't display after changing variation  

**v4.6.11** (18 Apr 2018)  
[update] Prevent slider images from blurring  
[update] Add Yith Badge Management compatibility  
[update] Cache matching variation request  
[update] Ability to set single image size and crop  
[update] Ability to set thumbnails size and crop  
[update] Update Freemius  
[update] Compatibility with Astra theme  
[update] Update WP ALl Import compat class  
[fix] Modify youtube video URLs when using youtu.be sharing URL  
[fix] Allow woothumbs-gallery shortcode to run during ajax  

**v4.6.10** (9 Feb 2018)  
[update] Update method of fetching image props  
[update] Add image size setting to WooCommerce > WooThumbs > Display  
[update] Auto regenerate images and clear cache on size change  
[update] Update settings framework  
[update] Reposition YITH Wishlist buttons  

**v4.6.9** (7 Feb 2018)  
[update] Update Freemius  
[update] Update settings framework  
[update] Update POT file  
[fix] Make sure thumbnails load for variation with no images  
[fix] Make sure imagesloaded account for srcset  
[fix] Use BC method for gallery IDs  
[fix] Make sure settings are gained from parent product  
[fix] PHP Error for < 5.5 "Can't use function return value in write context"  
[fix] Fix aspect ratio calculation for Woo 3.3.1  

**v4.6.8** (09/10/2017)  
[update] Make sure additional images are loaded when using get_gallery_image_ids()  
[update] Update Freemius  
[update] increase fullscreen video size  
[update] Add non-inline video functionality back in  
[update] Add option to maintain parent image gallery  
[fix] Update WPML filter for image IDs  
[fix] Fix click anywhere fullscreen mode when zooming  

**v4.6.7** (07/08/2017)  
[update] imagesLoaded script update  
[fix] srcset and sizes for thumbnails  

**v4.6.6** (04/07/2017)  
[update] Update Freemius framework  
[update] Add media (youtube/vimeo/soundcloud/etc) to any image and embed in the gallery  
[fix] Minor admin styling  
[fix] Dramatically increase speed to get default variation. Was causing timeout issues on some installs.  
[fix] WPML config was not being compiled with the plugin  
[fix] Don't run shortcodes in admin  
[fix] Selected thumbnail when infinite slide is enabled  
[fix] Namespace imagesLoaded script to prevent conflicts  

**v4.6.5** (05/05/2017)  
[update] Add new licensing  
[update] Disable pinning of duplicate images  
[fix] Prevent image replace conflicts if switched too quickly  

**v4.6.4** (02/04/2017)  
[update] WooCommerce 3.0.0 compatibility  
[fix] PHP7 shortcode error  

**v4.6.3** (27/02/2017)  
[update] Only add hoverIntent to follow zoom  
[fix] issue where images disappear when no variation image set  
[fix] aspect ratio styling was echoed instead of printed  

**v4.6.2** (19/02/2017)  
[update] Add shortcode for images only (see docs)  
[update] Added WooCommerce 2.7 compatibility  
[fix] Make sure thumbnails have no margin bottom  
[fix] Issues with RTL have been fixed  
[fix] Image loop issue when no image is set  
[fix] Hide fullscreen and disable zoom if placeholder image  
[fix] Variable image issue if no thumbnail set for variation and parent  

**v4.6.1** (23/12/2016)  
[fix] Make sure wp-util is loaded  

**v4.6.0** (22/12/2016)  
[update] Remove images when queued with priority 10  
[update] Remove Dashboard (Decided against it)  
[update] Make zoom utilise retina images  
[update] Update srcset and sizes for images for better retina  
[update] Remove related videos from youtube embeds  
[update] Change to Slick slider  
[update] nicer transitions between images changing  
[update] new loader icon for better compatibility  
[update] Hover intent on zoom  
[update] Fade in zoom on hover  
[update] Zoom cursor to indicate zoom is going to happen  
[fix] Issue with index when images were replace in FireFox  
[fix] Remove whitespace on initial plugin load  
[fix] Move photoswipe toolbar if admin bar is active  
[fix] Max width for zoom in some themes being set to 100%  
[fix] only echo srcset, sizes, and caption, if they exist  
[fix] Compatibility issue with Bundled Products - main image was changing when it shouldn't  
[fix] Make sure correct images are selected after adding to cart  
[fix] Escape image attributes  
[fix] Fix issue when photoswipe is opened multiple times  
[fix] Fix check which sometimes fails to see if product is variable in JS  
[fix] Fix shrinking height issue when thumbs aligned left or right  
[fix] Fix YITH wishlist button  

**v4.5.2** (12.09.2016)  
[fix] Get selected variation  
[fix] Wrong name for outside zoom setting - will need to be set back to "Outside" after updating  
[update] Add clear image cache button back to settings page  
[update] Add Iconic dashboard  
[update] Update transient names  
[update] Add more filters  

**v4.5.1** (04.09.2016)  
[update] Added some additional hooks/filters  
[update] Transition old meta from previous WooThumbs version  
[fix] Stop image changing for bundled product  
[update] Make sure only variable products are watched  
[fix] Get selected variation when defaults are set too  
[fix] WPML - make sure image attachment is translated  
[fix] Fix WP All Import when variations are new  

**v4.5.0** (22.08.2016)  
[update] Plugin has been renamed to iconic-woothumbs - finally!  
[update] Remove redux framework requirement. Current settings will be transitioned.  
[update] Better selection of image when no featured is set for a variation  
[fix] Issue on frontend when clearing fields by deselecting swatch  
[update] Ability to import variation images when using WP All Import  

**v4.4.15** (15.06.2016)  
[fix] Fix resize timeout issue  
[update] Tidy JS  
[update] Disable zoom preloading for speed  

**v4.4.14** (15.06.2016)  
[update] Added SCRIPT_DEBUG code  
[update] Option to "maintain slider index" on image change  
[fix] Stacked thumbnails not loading  
[update] Delay reset incase variation hasn't populated yet  
[update] Add all images to "Large Image Size" option  
[update] Compatibility with WooCommerce shortcodes  
[update] Compatibility with Quickview  
[update] Relative admin_url  

**v4.4.13** (14.06.2016)  
[update] Remove Freemius  
[update] Do not load thumbnail images if thumbnails aren't enabled  
[update] Disable touch on slider if only 1 image  
[fix] Do not zoom if large image is smaller than current slide  
[update] add filter for "woothumbs_enabled"  
[fix] Play button whilst zooming  
[update] Add WPML config file  
[update] Envato market class updated  

**v4.4.12** (08.05.2016)  
[fix] Thumbnail controls when spaced and positioned  
[fix] Control z-index on FF when set to fade  
[fix] Scroll when set to vertical on touch devices  
[update] Added variation images to the API  
[fix] Icon fade issue in FF  
[fix] Wishlist icon z-index issue in FF  
[update] Disable WooThumbs link in admin bar  
[fix] Flash of default images when WooCommerce uses Ajax  
[update] Change name of additional_images to try and avoid conflicts  
[update] Delete transients more efficiently  
[fix] Remove thumbnail opacity transition to fix flickering in FF on Windows  
[fix] Fullscreen index issue when slider is set to fade and infinite loop  
[update] Bulk: Add filter for parent product  
[fix] Clear cache action  
[update] Implemented Freemius to help improve WooThumbs  

**v4.4.11** (23.02.2016)  
[fix] Issue with WooCommerce Warranties plugin  
[fix] FF loading images issue  
[update] Auto slide - added options to auto start image slider  
[update] Allow thumbnails to be moved below slider at breakpoint  
[fix] updated Envato class to remove error  
[fix] Some icons being replaced by WooThumbs icons  

**v4.4.10** (11.01.2016)  
[fix] Make sure images are ltr so they work on rtl languages  

**v4.4.9** (11.01.2016)  
[fix] Move video icon so it doesn't interfere with the loading icon  

**v4.4.8** (07.01.2016)  
[fix] get_selected_varaiton not looking up correctly  
[update] Disable close fullscreen on scroll  
[update] Videos! Add a video to your product  
[update] Product specific options moved to "WooThumbs" tab on product edit page  
[update] Added .po file for translation  

**v4.4.7** (02.01.2016)  
[update] WPML Compatibility  
[update] Add version to scripts and styles  

**v4.4.6** (31.12.2015)  
[fix] Thumbnails not loading in firefox - updated imagesloaded script  
[fix] update srcset method so it works with imagesloaded  

**v4.4.5** (30.12.2015)  
[update] "WP Retina 2x" compatibility  
[update] Added button in options page to manually clear image cache  
[fix] Delete image cache in all scenarios necessary  

**v4.4.4** (17.12.2015)  
[update] Name featured image so it can easily be removed via a filter  
[update] Add hooks to image layout  
[update] Show icons on hover  
[update] Tooltips for icons  
[update] Yith wishlist integration  
[fix] Switch back to window load to prevent some issues in certain browsers  
[fix] Change lazy load src so it does not conflict with others  
[fix] bullets shown in zoom when only 1 slide  
[fix] Issue when infinitescroll was enabled on mobile devices  
[fix] Fullscreen z-index issue when bullets enabled  
[fix] Couldn't scroll page on mobile if over image  
[update] move large image size into display settings, as zoom and fullscreen both use it.  
[fix] Don't add attachment if image is now missing from media library  
[update] Longer hover transition speed  
[update] Remove filter on shop_single image size  
[update] Auto updates!  

**v4.4.3** (07.12.2015)  
[fix] Fullscreen image size was incorrect  
[fix] Zoom was disabled if using a touch laptop  

**v4.4.2** (01.12.2015)  
[fix] Enable the new "Save Changes" button for variations  

**v4.4.1** (28.11.2015)  
[update] Remove saved image IDs on product/variation save  
[fix] Issue with lazy load when using vertical slides  
[fix] Issue with thumbnail arrows if main slider has not yet loaded  

**v4.4.0** (24.11.2015)  
[update] Added filter so you can modify images assigned to a variation on the frontend  
[update] Completely rewritten scripts for optimisation and compatibility - should work with all swatch plugins now  
[update] Implemented photoswipe, which will allow for pinch zooming on mobile  
[fix] Issue with new Flatsome release  
[fix] Click anywhere activated when fullscreen was not  

**v4.3.10** (17.11.2015)  
[update] use shop_thumbnail instead of media thumbnail size  
[update] Improve image load time on page load perception  
[update] Improve loading when changing variation  
[update] Thumbnail controls (prev/next)  

**v4.3.9** (14.11.2015)  
[update] Remove sourcemap to reduce min.js filesize  
[update] Optimise get_selected_varaiton function  
[fix] $updatedImages named incorrectly  
[fix] Index issue when *not* infinite loop  
[update] Added show title option for fullscreen mode  
[update] Added option to position fullscreen prev/next arrows  
[fix] Stop it loading every time an attribute changes  

**v4.3.8** (11.11.2015)  
[fix] Fullscreen index issue  

**v4.3.7** (10.11.2015)  
[update] Tidy code throughout  
[update] Infinite loop option for slider  
[update] Choose zoom image size in settings  
[update] Limit the fullscreen image to the height of browser option  

**v4.3.6** (20.09.2015)  
[update] Allow TGM to be dismissed  
[update] update TGM  
[fix] stacked thumbnail opacity after image load  

**v4.3.5** (13.09.2015)  
[update] Plugin Header  
[update] Translation slugs  

**v4.3.4** (06.09.2015)  
[fix] Reinstate query string functionality, lost on previous update  

**v4.3.3** (06.09.2015)  
[fix] Issue when there are more than 25 variations  

**v4.3.2** (06.09.2015)  
[update] Load images if set via query string  
[fix] Compatibility with product_page shortcode  

**v4.3.1** (03.09.2015)  
[fix] Remove loading wait to allow for direct URL trigger  

**v4.3.0** (19.08.2015)  
[update] delay show_variaiton on first load  
[fix] Re-align loading icon  
[fix] Compatibility with wptouch pro  
[update] Background on zoomed images, just in case  
[fix] Show Images only once loaded  

**v4.2.9** (18.08.2015)  
[fix] Safari bug  

**v4.2.8** (18.08.2015)  
[fix] WooCommerce fetches variations in a different way now, had to change JS  
[update] Paginate bulk page  
[fix] bulk edit save action  

**v4.2.7** (15.08.2015)  
[fix] z.reloadSlider is not a funciton  
[update] Added width/height to hopefully fix safari issues  
[fix] Fullscreen gallery index  

**v4.2.6** (12.08.2015)  
[fix] missing "add additional images" button in 2.4.2  
[fix] Show arrows on reloadslider, if required  
[update] Fullscreen gallery  

**v4.2.5** (10.08.2015)  
[fix] parseJSON undefined issue on simple products  

**v4.2.4** (23.07.2015)  
[update] Documentation  

**v4.2.3** (19.06.2015)  
[fix] No controls on zoom if only 1 slide  

**v4.2.2** (02.06.2015)  
[fix] Destroy zoom on load js error  

**v4.2.1** (01.06.2015)  
[update] Add "click anywhere" option for fullscreen  
[update] If only one image, don't show thumbs  

**v4.2.0** (01.06.2015)  
[update] No more AJAX! Images are fetched on page load  
[update] New slider and styling  
[update] Theme specific styling capabilities, out of the box  
[fix] If zoom is smaller than current image size, it does not load  
[update] New and easier to understand options  
[fix] Disable zoom on mobile  
[update] Enable swipe on mobile  
[update] Fullscreen now uses magnific  
[update] New design and design options  
[update] Auto-height slider for different size imagery  

**v4.1.1** (31.03.2015)  
[update] Allow WooThumbs to be disabled per product  

**v4.1.0** (08.02.2015)  
[update] fix admin-ajax request when SSL is being used  
[update] TGM script  
[fix] Remove Mr. Tailor Images  
[fix] fix admin delete image styles  
[update] Add additional images button to variations list only (not swatches)  
[fix] Link all variations fixed  
[fix] Admin styling of additional images  

**v4.0.9** (06.08.2014)  
[fix] Compatibility with Quickview plugin when on single product page  
[fix] Changed .loading class on wrap to prevent conflicts  
[update] Disallow TGM to be dismissed  
[update] Remove Redux demo link  

**v4.0.8** (23.07.2014)  
[update] Get the selected var as default if passed via the URL  
[update] Load more images by default  

**v4.0.7** (21.07.2014)  
[fix] Removed tgmpa_load_bulk_installer error  

**v4.0.6** (12.06.2014)  
[update] Added TGM for Redux, rather than including it in the plugin files  
[update] Added Bulk Editor for variation images (Additional images only)  

**v4.0.5** (11.05.2014)  
[update] Only trigger WooThumbs if the image div is found  

**v4.0.4** (11.05.2014)  
[update] Add "tabs" back in for slider  

**v4.0.3** (05.05.2014)  
[fix] fix Image fallbacks if variation has no image  

**v4.0.1** (20.02.2014)  
[fix] fix Stack Size Issue on non product pages  

**v4.0.0** (01.02.2014)  
[update] New Slider  
[update] New Zoomer  
[update] Repsonsive  
[update] Tonnes of new options  

**v3.0.3** (30.10.2013)  
[fix] Added a fix to check if the swatches plugin is active  

**v3.0.2** (28.10.2013)  
[update] Added some JS to trigger show_variation on page load, if it hasn't already happened  
[update] Made it so the images don't try and load again if the variation ID is the same  

**v3.0.1** (25.10.2013)  
[update] Changed the zoom class to avoid conflicts  

**v3.0.0** (25.10.2013)  
[update] Removed the need for custom templates.  
[update] The full product imagery area is now replaced, to improve theme compatibility.  
[update] There are now 3 different layout modes to choose from; Lightbox, Slides, and Zoom.  
[update] The plugin now uses more effective AJAX methods.  

**v2.0.2**  
[update] Added a template for the WooCommerce Professor Zoom Extension.  
[update] Moved the callback to the end of the footer.  
