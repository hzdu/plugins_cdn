# Iconic Onboard

## Setup Instructions

1. Add this line to `deps` object in gulpfile.js:

```
'vendor/iconicwp/iconic-onboard/**/*': 'inc/vendor/iconic-onboard'
```

2. run commands: 
```
composer config repositories.iconic-onboard vcs git@bitbucket.org:iconicwp/iconic-onboard.git

composer require iconicwp/iconic-onboard dev-master
```
3. run command `gulp deps`

4. If the above command modifies any of the core files, revert it by `git co` command. Example: `git co inc/class-core-cross-sells.php`

## Usage  
1. In the settings class of plugin, initialise Iconic Onboard like this:

```php
if ( ! Iconic_WooThumbs_Core_Settings::is_settings_page() || defined( 'WC_DOING_AJAX' ) ) {
	if ( empty( $_REQUEST["plugin_slug"] ) || $_REQUEST["plugin_slug"] !== $iconic_woothumbs_class->slug_alt ) {
		return;
	}
}

include_once ICONIC_WOOTHUMBS_INC_PATH . 'vendor/iconic-onboard/class-iconic-onboard.php';

$slides = [
	[
		"header_image" => $iconic_woothumbs_class->plugin_url . "/assets/img/onboarding/graphic-onboarding-start.png",
		"title"        => "Step 1",
		"description"  => "This is the description of step 1",
		"button_text"  => "Begin <span class='dashicons dashicons-arrow-right-alt'></span>",
		"button_icon"  => "",
	],
	[
		"header_image" => $iconic_woothumbs_class->plugin_url . "/assets/img/onboarding/graphic-onboarding-auto.png",
		"title"        => "Select a layout for the Image Gallery",
		"description"  => "This is the description of step 2",
		"button_text"  => "Continue <span class='dashicons dashicons-arrow-right-alt2'></span>",
		"fields"       => [
			[
				'id'      => 'layout',
				'title'   => '',
				'desc'    => '',
				'type'    => 'image_radio',
				'default' => 'bottom',
				'choices' => [
					'bottom' => [
						"text"  => "Bottom",
						"image" => $iconic_woothumbs_class->plugin_url . "/assets/img/onboarding/layout_bottom.png",
					],
					'left'   => [
						"text"  => "Left",
						"image" => $iconic_woothumbs_class->plugin_url . "/assets/img/onboarding/layout_left.png",
					],
					'right'  => [
						"text"  => "Right",
						"image" => $iconic_woothumbs_class->plugin_url . "/assets/img/onboarding/layout_right.png",
					],
					'none'   => [
						"text"  => "None",
						"image" => $iconic_woothumbs_class->plugin_url . "/assets/img/onboarding/layout_none.png",
					],
				],
			],
		],
	],
	[
		"header_image" => $iconic_woothumbs_class->plugin_url . "/assets/img/onboarding/graphic-onboarding-strip_exif.png",
		"title"        => "How should the images transition?",
		"description"  => "This is the description of step 3",
		"button_text"  => "Continue <span class='dashicons dashicons-arrow-right-alt2'></span>",
		"fields"       => [
			[
				'id'      => 'transition',
				'title'   => '',
				'desc'    => '',
				'type'    => 'image_radio',
				'default' => 'horizontal',
				'choices' => [
					'horizontal' => [
						"text"  => "Horizontal Slide",
						"image" => $iconic_woothumbs_class->plugin_url . "/assets/img/onboarding/transition_horizontal_slide.png",
					],
					'vertical'   => [
						"text"  => "Vertical <Slide></Slide>",
						"image" => $iconic_woothumbs_class->plugin_url . "/assets/img/onboarding/transition_vertical_slide.png",
					],
					'fade'       => [
						"text"  => "Fade",
						"image" => $iconic_woothumbs_class->plugin_url . "/assets/img/onboarding/transition_fade.png",
					],
				],
			],
		],
	],
	[
		"header_image" => $iconic_woothumbs_class->plugin_url . "/assets/img/onboarding/graphic-onboarding-strip_exif.png",
		"title"        => "All Done",
		"description"  => "You are all set to use WooThumbs.",
		"button_text"  => "Finish <span class='dashicons dashicons-yes'></span>",
	],
];

Iconic_WooThumbs_Onboard::run(
	array(
		'version'     => $iconic_woothumbs_class->version,
		'plugin_slug' => $iconic_woothumbs_class->slug_alt,
		'plugin_url'  => $iconic_woothumbs_class->plugin_url,
		'plugin_path' => $iconic_woothumbs_class->plugin_path,
		'slides'      => $slides,
	)
);

```

# Saving the data

```php
$plugin_slug = "woothumbs";
add_filter( "iconic_onboard_save_iconic_{$plugin_slug}_result", 'save_onboard_settings' , 10, 2 );

function save_onboard_settings( $result, $fields_arr ) {
    
    /* 
    Save the settings here.
    
    If Validation fails, return false
    else return $result
    */
    
}
```

# Field Types
1. text 
1. number
1. password
1. textarea
1. select (choices required)
1. radio (choices required)
1. checkbox
1. checkboxes (choices required)
1. color
1. file
1. editor

Not supported fields:

1. date
1. time

# Caveats
A function hooking into "iconic_onboard_save_iconic_{$plugin_slug}_result" must return `$data` and not `true` if validation passes. 

# Actions and Filters

### General Hooks/Filter

- iconic_onboard_args 
- iconic_onboard_save_iconic_{$plugin_slug}_result


### Template hooks/Filter

- iconic_onboard_{$plugin_slug}_slide_before_header
- iconic_onboard_{$plugin_slug}_slide_before_header_img
- iconic_onboard_{$plugin_slug}_slide_after_header_img
- iconic_onboard_{$plugin_slug}_slide_body_starts
- iconic_onboard_{$plugin_slug}_slide_settings
- iconic_onboard_{$plugin_slug}_slide_end
