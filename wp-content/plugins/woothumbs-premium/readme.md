## Docs

For more detailed documentation, please visit: http://docs.iconicwp.com/category/6-woothumbs

## Installation

To install the plugin:

1. Open wp-admin and navigate to `Plugins > Add New > Upload`.
2. Click Choose File, and choose the file `jck_woothumbs.zip` from your CodeCanyon download zip.
3. Once uploaded, click activate plugin.
4. The plugin is now installed and activated.

Once installed you can find the options panel under `WooCommerce > WooThumbs`.

## Configuration

WooThumbs offers you a great deal of flexibility when it comes to presenting your product imagery in WooCommerce.

Once installed, navigate to `WooCommerce > WooThumbs`. 

Here you will find the following sections:

### Display Settings

These are just general settings for how the images should appear to the user.

* **Width**  
  By default, this is set to 48% as that is the most common width of the image section in WooCommerce themes. You may need to change this to 100%, or even less, depending on your theme.
* **Position**  
  Float the image display to the left, right, or not at all.
* **Large Image Size**  
  Choose a size for large images. Hover zoom and fullscreen will both use the size you select here.
* **Icon Colours**  
  The colour of the icons that may be present over the image, for example the previous/next icons.
* **Show Icons on Hover?**  
  When enabled, icons will only be visible when the image is hovered.
* **Show Icon Tooltips?**  
  When icons are hovered, a tooltip will be displayed.
  
### Carousel Settings

These settings apply to the main image display (i.e. not the thumbnails).

* **Mode**  
  This defines the way in which the main images transition as the user browses your product imagery. The options are Horizontal, Vertical, and Fade.
* **Transition Speed (ms)**  
  This is the speed at which the above transition will take place.
* **Autoplay?**  
  When enabled, the slider images will automatically transition.
* **Slide Duration (ms)**  
  If you have autoplay set to true, then you can set the slide duration for each slide.
* **Enable Infinite Loop?**  
  When you get to the last image, loop back to the first.

### Navigation Settings

These settings allow you to alter the way additional product images are displayed; whether you want them to slide, stack, or not show them at all - the settings are here.

#### General Navigation Settings

* **Enable Prev/Next Arrows?**  
  Whether to show the left and right arrow icons over the main image.
  
#### Thumbnail Settings

* **Enable Thumbnails?**  
  Whether to enable the thumbnail navigation.
* **Thumbnails Type**  
  If navigation was enabled, you can choose the type of navigation:
  * **Sliding Thumbnails**  
    Sliding Thumbnails will show the images in a single row, and slide through them when you near the end of each row.
  * **Stacked Thumbnails**  
    Stacked Thumbnails will simply stack the thumbnails into columns of your choosing.
* **Enable Thumbnail Controls?**  
  Enables left/right or down/up arrows (depending on the layout below) for the thumbnails.
* **Thumbnails Position**  
  Choose whether the thumbnails are displayed above, below, to the left, or to the right of the main image.
* **Width (%)**  
  If you chose the left or right thumbnail layout, you can set the width of the thumbnail column. This is a percentage value.
* **Thumbnails Count**  
  How many thumbnails to display in a row.
* **Thumbnails Transition Speed (ms)**  
  The speed at which the thumbnail navigation moves in milliseconds.
* **Thumbnails Spacing**  
  The space in pixels between each thumbnail.

#### Bullets Settings

* **Enable Bullets?**  
  Choose whether to enable the bullet navigation.

### Zoom Settings

WooThumbs comes with a fantastic built in zoom feature, with a variety of options:

* **Enable Hover Zoom?**
* **Zoom Type**  
  * **Inner**  
    Inner fills the space of your main image with the zoomed image, as long as the main image is smaller than the current size of the main image.
  * **Outside**  
    Ouside displays the zoomed image next to the main image.
  * **Follow**  
    Follow creates a magnifying glass effect and follows the cursor around the main image.

The following settings depend on which *Zoom Type* you selected.

#### Outside and Follow Zoom Settings

These settings only apply if you chose Outside or Follow as "Zoom Type".

* **Lens Width**  
  Set the width in pixels for the zoomed image lens.
* **Lens Height**  
  Set the height in pixels for the zoomed image lens.
  
#### Outside Zoom Settings

* **Zoom Position**  
  Position the zoomed image to the right or left of the main image.
* **Lens Colour**  
  As you hover over the main image, the zoomed portion will be display in this colour.
* **Lens Opacity**  
  The colour you choose above can be transparent. Choose a decimal between 0 and 1.

#### Follow Zoom Settings

If you chose Follow Zoom, these are the options available to you:

* **Zoom Shape**  
  The shape of the magnifier.

### Fullscreen Settings

WooThumbs comes with a built in fullscreen options.

* **Enable Fullscreen?**
* **Enable Click Anywhere?**  
  When enabled, click anywhere on the main image to trigger fullscreen.
* **Enable Image Title?**  
  When enabled, the image title will be visible when viewing fullscreen.

### Responsive Settings

You can change the layout of your WooThumbs imagery at a certain breakpoint.

* **Enable breakpoint?**
* **Breakpoint (px)**  
  The settings below will be implemented if the screen size is smaller that this pixel value.
* **Width After Breakpoint (%)**  
  The width of the images display after the breakpoint.
* **Position After Breakpoint**  
  Choose a position for the images after the breakpoint.
* **Move Thumbnails Below After Breakpoint?**  
  Choose whether to move the thumbnail navigation below the main image display after the breakpoint.
* **Thumbnail Count after Breakpoint**  
  The number of thumbnails to display in a row after the breakpoint.

## Product Settings

Each product will now have a new settings tab, where you can manipulate WooThumbs on a per-product basis.

![WooThumbs product tab](https://iconicwp.com/documentation/woothumbs/woothumbs-product-tab.png "WooThumbs product tab")

* **Disable WooThumbs?**  
  This will disable the WooThumbs gallery for this aprticular product.
* **Video URL**  
  Enter a video URL to add a video to your product. The video will open in the fullscreen gallery. You can enter most popular video hosting site URLs here, like Vimeo or YouTube.
* **Maintain Slide Index?**  
  When checked, the slide index will be maintained upon changing images. For example, if you're viewing the second image in the slider, and change variation, the second image will be selected from the new images.

## Multiple Images per Variation

Adding multiple images to your product variations is easy.

1. Navigate to a variable product.
2. Click the `Variations` tab.
3. Expand one of the variations.
4. Click the link labelled `Add additional images`. The media gallery will popup.  
   ![WooThumbs add additional images link](https://iconicwp.com/documentation/woothumbs/woothumbs-add-additional-images.png "WooThumbs add additional images link")
5. Select 1 or more additional images, and then click `Add to variation`.  
6. You will now see the additional images listed in your variation tab. It's important to note that you should still add a default "featured" image to your variation.  
   ![WooThumbs additional images](https://iconicwp.com/documentation/woothumbs/woothumbs-additional-images.png "WooThumbs additional images")
7. Once you've done this for all required variations, either `Update` your product, or click the `Save Changes` button.

### Reorder the Additional Images

Once you've added your additional images, you can simply drag and drop to reorder them.

### Remove an Additional Image

If you've changed your mind about an image, simply click it to remove it. You can always add it back again by clicking `Add additional images`.

### WooThumbs Bulk

WooThumbs bulk allows you to add additional images to your variations in bulk. Simply navigate to `WooCommerce > Bulk Edit Images` where you will see the following page:

![WooThumbs bulk edit](https://iconicwp.com/documentation/woothumbs/woothumbs-bulk-edit.png "WooThumbs bulk edit")

You can search for variations by the variable product ID, change the number of variations per page, and easily navigate between pages of variations.

Once you've found the variations you want to edit, simply enter a comma separated list of image attachment IDs, and then click `Update`. No spaces.

![WooThumbs bulk edit field](https://iconicwp.com/documentation/woothumbs/woothumbs-bulk-edit-field.png "WooThumbs bulk edit field")

The bulk page requires that your images have already been uploaded to the WordPress media gallery. This is also where you can find the attachment ID.

![WooThumbs attachment ID](https://iconicwp.com/documentation/woothumbs/woothumbs-attachment-id.png "WooThumbs attachment ID")

## Shortcodes

Currently, WooThumbs has 1 shortcode `woothumbs-gallery`. This shortcode will display the gallery of a product. It can be used like so: `[woothumbs-gallery id="99"]` where 99 is the ID of your product. If you use this for variable products and require that the images change when selecting a final variation, then the shortcode contents and the variations form should be wrapped in a container with a class of `.product`.

## Changelog

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
[udpate] Update transient names  
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
[mod] Disable zoom preloading for speed

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