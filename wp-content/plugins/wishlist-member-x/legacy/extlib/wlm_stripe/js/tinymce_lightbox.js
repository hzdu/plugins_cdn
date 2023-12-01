jQuery(document).ready(function($) {
  var stripe_profile_objs = {
  	container : jQuery('#wlmtnmce-stripe-profile-lightbox'),
  	shortcode_text : jQuery('#wlmtnmce-stripe-profile-lightbox').find('.wlmtnmcelbox-preview-text'),
  	insertcode_button : jQuery('#wlmtnmce-stripe-profile-lightbox').find('.wlmtnmcelbox-insertcode'),
  	content_levels : jQuery('#wlmtnmce-stripe-profile-lightbox').find('.wlmtnmcelbox-levels'),
  	lightbox_close : jQuery('#wlmtnmce-stripe-profile-lightbox').find('.media-modal-close'),

  	showlevels : jQuery('#wlmtnmce-stripe-profile-lightbox').find('.wlmtnmcelbox-showlevels'),
  	includepost : jQuery('#wlmtnmce-stripe-profile-lightbox').find('.wlmtnmcelbox-includepost'),

  	init : function() {
  		stripe_profile_objs.content_levels.chosen( { width:'100%', display_disabled_options:false, } );
  		stripe_profile_objs.content_levels.chosen().change( stripe_profile_objs.chosen_change );
  		stripe_profile_objs.insertcode_button.on('click', stripe_profile_objs.insertcode );
  		stripe_profile_objs.lightbox_close.on('click', stripe_profile_objs.close );

  		stripe_profile_objs.showlevels.on('click', stripe_profile_objs.showlevels_click );
  		stripe_profile_objs.includepost.on('click', stripe_profile_objs.includepost_click );

  		//assign the show in this function so that we can call it using our wlmtnmcelbox_vars global object
  		wlmtnmcelbox_vars.stripe_profile_objs = stripe_profile_objs.show_lightbox;
  	},

  	show_lightbox : function() {
  		stripe_profile_objs.container.show();
  		stripe_profile_objs.container.find('.media-modal').show();
  		stripe_profile_objs.container.find('.media-modal-backdrop').show();

  		stripe_profile_objs.showlevels.prop('checked', true);
  		stripe_profile_objs.includepost.prop('checked', false);
  		stripe_profile_objs.update_preview();
  	},

  	update_preview : function() {
  		var selected_levels = "";
  		var include_posts = "";
  		if ( stripe_profile_objs.showlevels.is(':checked') ) {
  			jQuery(".wlmtnmcelbox-levels :selected").each(function(){
  				selected_levels = selected_levels + (selected_levels == "" ? "":",") + jQuery.trim(jQuery(this).val());
  			});
  			if ( selected_levels == "") {
  				selected_levels = "all";
  			}
  		} else {
  			selected_levels = "no";
  		}

  		if ( stripe_profile_objs.includepost.is(':checked') ) {
  			include_posts = "yes"
  		} else {
  			include_posts = "no"
  		}

  		if( selected_levels == "no" && include_posts == "no" ) {
  			stripe_profile_objs.shortcode_text.val('');
  			return;
  		}
  		var text = "[wlm_stripe_profile levels='" +selected_levels +"' include_posts='" +include_posts +"']";
  		stripe_profile_objs.shortcode_text.val(text);
  	},

  	chosen_change : function() {
  		var str_selected = jQuery(this).val();
  		if( str_selected != null ){
  			pos = str_selected.lastIndexOf("all");
  			if ( pos >= 0 ) {
  				jQuery(this).find('option').each(function() {
  					if(jQuery(this).val() == "all"){
  						jQuery(this).prop("selected",false);
  					}else{
  						jQuery(this).prop("selected","selected");
  					}
  					jQuery(this).trigger("chosen:updated");
  				});
  			}
  		}
  		stripe_profile_objs.update_preview();
  	},

  	showlevels_click : function() {
  		if ( jQuery(this).is(':checked') ) {
  			stripe_profile_objs.content_levels.find('option').each(function() {
  				jQuery(this).prop("disabled",false);
  			});
  			stripe_profile_objs.content_levels.prop('disabled', false).trigger("chosen:updated");
  		} else {
  			stripe_profile_objs.content_levels.find('option').each(function() {
  				jQuery(this).prop("selected",false);
  				jQuery(this).prop("disabled",true);
  			});
  			stripe_profile_objs.content_levels.prop('disabled', true).trigger("chosen:updated");
  		}

  		stripe_profile_objs.update_preview();
  	},

  	includepost_click : function() {
  		stripe_profile_objs.update_preview();
  	},

  	insertcode : function() {
  		var text = stripe_profile_objs.shortcode_text.val().replace(/\r\n|\r|\n/g,"<br/>");
  			if (tinyMCE && tinyMCE.activeEditor && text != '') {
  				tinyMCE.activeEditor.execCommand('mceInsertContent', false, text);
  				stripe_profile_objs.shortcode_text.val('');
  			}
  			stripe_profile_objs.reset();
  			stripe_profile_objs.close();
  	},

  	reset : function() {
  		stripe_profile_objs.content_levels.find('option').each(function() {
  			jQuery(this).prop("selected",false);
  		});
  		stripe_profile_objs.showlevels.prop('checked', false);
  		stripe_profile_objs.includepost.prop('checked', false);
  		stripe_profile_objs.shortcode_text.val('');
  	},

  	close : function() {
  		stripe_profile_objs.container.hide();
  		stripe_profile_objs.container.find('.media-modal').hide();
  		stripe_profile_objs.container.find('.media-modal-backdrop').hide();
  	}
  };
  stripe_profile_objs.init();
});