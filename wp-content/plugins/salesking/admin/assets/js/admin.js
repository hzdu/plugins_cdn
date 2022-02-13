(function($){

	"use strict";

	$( document ).ready(function() {

		/**
		* General Functions
		*/

		// Initialize SemanticUI Menu Functions

		// radio buttons
		$('.ui.checkbox').checkbox();
		
		// Tab transition effect
		var previous = $('.ui.tab.segment.active');
	    $(".menu .item").tab({
	        onVisible: function (e) {
	            var current = $('.ui.tab.segment.active');
	            // hide the current and show the previous, so that we can animate them
	            previous.show();
	            current.hide();

	            // hide the previous tab - once this is done, we can show the new one
	            previous.find('.salesking_attached_content_wrapper').css('opacity','0');
	            current.find('.salesking_attached_content_wrapper').css('opacity','0');
	            setTimeout(function(){
	            	previous.hide();
	            	current.show();
	            	setTimeout(function(){
		            	current.find('.salesking_attached_content_wrapper').css('opacity','1');
		            	// remember the current tab for next change
		            	previous = current;
		            },10);
	            },150);
	            
	        }
	    });
	    
		$('.ui.dropdown').dropdown();
		$('.salesking_purchase_lists_language_setting').dropdown('set selected', salesking.purchase_lists_language_option);
	
		$('.message .close').on('click', function() {
		    $(this).closest('.message').transition('fade');
		});

		// On Submit (Save Settings), Get Current Tab and Pass The Tab as a Setting. 
		$('#salesking_admin_form').on('submit', function() {
			let tabInput = document.querySelector('#salesking_current_tab_setting_input');
		    tabInput.value = document.querySelector('.active').dataset.tab;
		    return true; 
		});

		// Logo Upload
		$('#salesking-upload-btn').on('click', function(e) {
	       e.preventDefault();

	       var image = wp.media({ 
	           title: 'Upload Image',
	           multiple: false
	       }).open()
	       .on('select', function(e){
	           // This will return the selected image from the Media Uploader, the result is an object
	           var uploaded_image = image.state().get('selection').first();
	           // Convert uploaded_image to a JSON object 
	           var salesking_image_url = uploaded_image.toJSON().url;
	           // Assign the url value to the input field
	           $('#salesking_logo_setting').val(salesking_image_url);
	           $('.salesking_email_preview_logo').attr('src', salesking_image_url);
	       });
	   	});


	});

})(jQuery);
