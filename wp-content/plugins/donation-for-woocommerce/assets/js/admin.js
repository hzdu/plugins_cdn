$ = jQuery;

function copyToClip(el) {
	/* Get the text field */
	var copyText = document.getElementById(el);

	/* Select the text field */
	copyText.select();
	copyText.setSelectionRange(0, 99999); /*For mobile devices*/
  
	/* Copy the text inside the text field */
	document.execCommand("copy");
  
	/* Alert the copied text */
	alert("Copied the text: " + copyText.value);

	return;
}

jQuery(document).ready(function(){

	jQuery( '#wc_donation_sync_data' ).click( function(e) {
		e.preventDefault();
		
		jQuery('#wc-donation-sync-result').html('');

		var data = {
			'action': 'wc_donation_sync_data'
		}

		jQuery.post( wcds.ajaxUrl, data, function( response ) {
			var obj = JSON.parse( response );
			console.log( obj );
			jQuery('#wc-donation-sync-result').html( `<ul class="first"></ul>` );
			jQuery.each( obj, function(i, v) {
				if ( v.status == 'success' ) {
					jQuery('#wc-donation-sync-result').find('ul.first').append( `<li><strong>${v.campaign_name} - (${v.campaign_id})</strong>
						<ul class="inside">
							<li>Total Donors: ${v.total_donars}</li>
							<li>Total Donation: ${v.total_donation_count}</li>
							<li>Total Amount: ${v.total_donation_amount}</li>
						</ul>
						</li>` );
				} else {
					jQuery('#wc-donation-sync-result').find('ul').append( `<li>${v.campaign_name} - (${v.campaign_id}) has failed to update.</li>` );
				}
			});
		});
	});	

	//single_capaign.php
	jQuery('.wc-donation-tablinks').on('click', function(e) {
		e.preventDefault();
		var id = jQuery(this).attr('href');
		jQuery(this).siblings('.wc-donation-tablinks').removeClass('active');
		jQuery(this).addClass('active');
		jQuery('.wc-donation-tabcontent').css('display', 'none');
		jQuery('#' + id).css('display', 'block');
		jQuery(this).siblings('input').val(id);
	});

	var firstTab = jQuery('#wc-donation-tablink').val();
	jQuery('.wc-donation-tablinks').removeClass('active');
	jQuery('a[href="'+ firstTab +'"]').addClass('active');
	jQuery('.wc-donation-tabcontent').css('display', 'none');
	jQuery('#' + firstTab).css('display', 'block');

	//campaign_settings_html.php
	jQuery('#pred-add-more').click(function(e) {
		e.preventDefault();
		var parent = jQuery(this).parent('#wc-donation-predefined-wrapper');
		var count = parent.find('.pred').length;
		//alert(count);
		var next_count = count+1;
		//alert(next_count);
		var html = '';
		html += '<div class="pred" id="pred-'+ next_count +'">';
		html += '<div class="pred-wrapper">';
		html += '<a href="#" class="dashicons dashicons-trash pred-delete"></a>';
		html += '<h4>'+ wcds.donation_level_text +'</h4>';
		html += '<div class="select-wrapper">'
					+'<label class="wc-donation-label" for="pred-amount-'+ next_count +'">'+ wcds.amount_l_text +'</label>'
					+'<input type="text" id="pred-amount-'+ next_count +'" Placeholder="'+ wcds.amount_p_text +'" name="pred-amount[]" value="">'
				+'</div>';
		html += '<div class="select-wrapper">'
					+'<label class="wc-donation-label" for="pred-label-'+ next_count +'">'+ wcds.label_l_text +'</label>'
					+'<input type="text" id="pred-label-'+ next_count +'" Placeholder="'+ wcds.label_p_text +'" name="pred-label[]" value="">'
				+'</div>';
		html += '</div>';
		html += '</div>';
		//alert(count);

		jQuery(html).insertBefore(jQuery(this));
	});

	jQuery(document).on('click', '.pred-delete', function(e) {
		e.preventDefault();
		//alert('test');
		jQuery(this).parents('.pred').remove();
	});

	//donation_tribute_html.php
	jQuery('#tribute-add-more').click(function(e) {
		e.preventDefault();
		var parent = jQuery(this).parent('#wc-donation-tribute-wrapper');
		var count = parent.find('.tribute').length;
		//alert(count);
		var next_count = count+1;
		//alert(next_count);
		var html = '';
		html += '<div class="tribute" id="tribute-'+ next_count +'">';
		html += '<div class="tribute-wrapper">';
		html += '<a href="#" class="dashicons dashicons-trash tribute-delete"></a>';
		html += '<h4>Tribute</h4>';
		html += '<div class="select-wrapper">'
					+'<label class="wc-donation-label" for="tribute-'+ next_count +'">'+ wcds.label_l_text +'</label>'
					+'<input type="text" id="tribute-'+ next_count +'" Placeholder="'+ wcds.label_p_text +'" name="tributes[]" value="">'
				+'</div>';
		html += '</div>';
		html += '</div>';
		//alert(count);

		jQuery(html).insertBefore(jQuery(this));
	});

	jQuery(document).on('click', '.tribute-delete', function(e) {
		e.preventDefault();
		//alert('test');
		jQuery(this).parents('.tribute').remove();
	});

	//donation_cause_html.php
	jQuery('#wcd-add-cause').click(function(e) {
		e.preventDefault();
		var count = 0;
		var parent = jQuery('.causes-table-body');
		jQuery('tr.no-items').remove();
		count = parent.find('tr').length;
		var cause_name = jQuery('#wc-donation-cause-name').val();
		var cause_desc = jQuery('#wc-donation-cause-desc').val();
		var cause_img = jQuery('#wc-donation-cause-thumb').val();
		if ( cause_name == '' ){
			alert('Cause Name cannot be empty');
			return false;
		}
		//alert(count);
		var next_count = count+1;
		//alert(next_count);
		var html = '';
		html += '<tr><th scope="row" class="check-column"><label class="screen-reader-text" for="cb-select-'+next_count+'">Select ' + cause_name + '</label><input id="cb-select-' + next_count + '" type="checkbox" value="' + next_count + '"></th><td class="campaign_cause_img column-campaign_cause_img has-row-actions column-primary"><img src="' + cause_img + '"><input type="hidden" class="causes_img" value="'+ cause_img +'" name="donation-cause-img[]"></td><td class="campaign_cause_name column-campaign_cause_name has-row-actions column-primary"><input type="text" class="causes_name" value="'+ cause_name +'" name="donation-cause-name[]" readonly></td><td class="campaign_cause_desc column-campaign_cause_desc has-row-actions column-primary"><input type="text" class="causes_desc" value="' + cause_desc + '" name="donation-cause-desc[]" readonly></td><td class="actions column-actions" data-colname="Actions"><a href="javascript:void(0);" class="wc-dashicons editIcon cause-edit"> <span class="dashicons dashicons-edit"></span> </a><a href="javascript:void(0);" class="wc-dashicons deleteIcon cause-delete" title="Delete"> <span class="dashicons dashicons-trash"></span></a></td></tr>';
		if( cause_img == '' ){
			var cause_img = wcds.no_cause_img;
			var html = '';
		html += '<tr><th scope="row" class="check-column"><label class="screen-reader-text" for="cb-select-'+next_count+'">Select ' + cause_name + '</label><input id="cb-select-' + next_count + '" type="checkbox" value="' + next_count + '"></th><td class="campaign_cause_img column-campaign_cause_img has-row-actions column-primary"><img src="' + cause_img + '"><input type="hidden" class="causes_img" value="'+ cause_img +'" name="donation-cause-img[]"></td><td class="campaign_cause_name column-campaign_cause_name has-row-actions column-primary"><input type="text" class="causes_name" value="'+ cause_name +'" name="donation-cause-name[]" readonly></td><td class="campaign_cause_desc column-campaign_cause_desc has-row-actions column-primary"><input type="text" class="causes_desc" value="' + cause_desc + '" name="donation-cause-desc[]" readonly></td><td class="actions column-actions" data-colname="Actions"><a href="javascript:void(0);" class="wc-dashicons editIcon cause-edit"> <span class="dashicons dashicons-edit"></span> </a><a href="javascript:void(0);" class="wc-dashicons deleteIcon cause-delete" title="Delete"> <span class="dashicons dashicons-trash"></span></a></td></tr>';
		}
		jQuery(parent).append(html);
		jQuery('#wc-donation-cause-name').val('');
		jQuery('#wc-donation-cause-desc').val('');
		jQuery('#wc-donation-cause-thumb').val('');
		var button = jQuery('a.donation-cause-thumb-rmv');
		button.next().val(''); // emptying the hidden field
		button.hide().prev().prev().addClass('button button-primary').html('Upload Thumbnail');
	});
	jQuery(document).on('click', '.cause-delete', function(e) {
		e.preventDefault();
		jQuery(this).parents('tr').remove();
		var count = 0;
		var parent = jQuery('.causes-table-body');
		count = parent.find('tr').length;
		if ( count == 0 ) {
			var html = '<tr class="no-items"><td class="colspanchange" colspan="8">No Causes found.</td></tr>';
			jQuery(parent).append(html);
		}
	});
	jQuery(document).on('click', '.delete-selected-causes', function(e) {
		e.preventDefault();
		jQuery(".causes-table-body input[type='checkbox']:checked:not('#cb-select-all-1')").closest("tr").remove();
		var count = 0;
		var parent = jQuery('.causes-table-body');
		count = parent.find('tr').length;
		if ( count == 0 ) {
			var html = '<tr class="no-items"><td class="colspanchange" colspan="8">No Causes found.</td></tr>';
			jQuery(parent).append(html);
		}
	});
	jQuery(document).on('click', '.cause-edit', function(e) {
		e.preventDefault();
		var parent = jQuery(this).parents('tr');
		var causes_input = parent.find('input.causes_name');
		var causes_desc_input = parent.find('input.causes_desc');
		if ( causes_input.attr('readonly') && causes_desc_input.attr('readonly') ) {
			jQuery(this).children('span').addClass('dashicons-saved');
			parent.find('input.causes_name').removeAttr('readonly');
			parent.find('input.causes_name').focus();
			parent.find('input.causes_desc').removeAttr('readonly');
			parent.find('img').after('<a class="donation-cause-thumb-chg" href="#" style="display:block;"> Change Thumbnail </a>');
		} else {
			jQuery(this).children('span').removeClass('dashicons-saved');
			parent.find('input.causes_name').attr('readonly',true);
			parent.find('input.causes_desc').attr('readonly',true);
			parent.find('a.donation-cause-thumb-chg').remove();
		}
	});
	jQuery('body').on( 'click', 'td.campaign_cause_img a.donation-cause-thumb-chg', function(event){
 
		event.preventDefault();
 
		var thumb = jQuery(this).parent().find('img.causes-img')
		var thubm_url = jQuery(this).parent().find('input.causes_img'),
		custom_uploader = wp.media({
			title: 'Change Thumbnail',
			library : {
				// uploadedTo : wp.media.view.settings.post.id, // attach to the current post?
				type : 'image'
			},
			button: {
				text: 'Use this image' // button label text
			},
			multiple: false
		}).on('select', function() { // it also has "open" and "close" events
			var attachment = custom_uploader.state().get('selection').first().toJSON();
			thumb.attr('src', attachment.url).next().val(attachment.url).next().show();
			thubm_url.val(attachment.url);
		}).open();
 
	});
	jQuery('body').on( 'click', '.donation-cause-thumb-upl', function(e){
 
		e.preventDefault();
 
		var button = jQuery(this),
		custom_uploader = wp.media({
			title: 'Insert Thumbnail',
			library : {
				// uploadedTo : wp.media.view.settings.post.id, // attach to the current post?
				type : 'image'
			},
			button: {
				text: 'Use this image' // button label text
			},
			multiple: false
		}).on('select', function() { // it also has "open" and "close" events
			var attachment = custom_uploader.state().get('selection').first().toJSON();
			button.removeClass('button button-primary').html('<img width="200px" src="' + attachment.url + '">').next().val(attachment.url).next().show();
		}).open();
 
	});
 
	// on remove button click
	jQuery('body').on('click', '.donation-cause-thumb-rmv', function(e){
 
		e.preventDefault();
 
		var button = jQuery(this);
		button.next().val(''); // emptying the hidden field
		button.hide().prev().prev().addClass('button button-primary').html('Upload Thumbnail');
	});

	jQuery('.display-option').on('click', 'input[type="radio"]', function(){

		if ( jQuery(this).is(':checked') && jQuery(this).val() == 'both' ) {
			jQuery('div[data-id="predefined"]').css('display', 'grid');
			jQuery('div[data-id="free-value"]').css('display', 'grid');
			return;
		}

		if ( jQuery(this).is(':checked') ) {
			var id = jQuery(this).val();
			jQuery('div[data-id="'+ id +'"]').css('display', 'grid');
			jQuery('div[data-id="'+ id +'"]').siblings('.display-wrapper').css('display', 'none');
		}
	});

	if ( jQuery('#predefined').is(':checked') ) {
		jQuery('div[data-id="predefined"]').css('display', 'grid');
		jQuery('div[data-id="free-value"]').css('display', 'none');
	} 
	
	if ( jQuery('#free-value').is(':checked') ) {
		jQuery('div[data-id="free-value"]').css('display', 'grid');
		jQuery('div[data-id="predefined"]').css('display', 'none');
	} 
	
	if ( jQuery('#both').is(':checked') ) {
		jQuery('div[data-id="predefined"]').css('display', 'grid');
		jQuery('div[data-id="free-value"]').css('display', 'grid');
	}

	//recurring_donation_html.php
	jQuery('#wc-donation-recurring').on('change', function(){
		if ( jQuery(this).val() == 'user' ) {
			jQuery('#wc-donation-recurring-text').css('display', 'inline-block');
		} else {
			jQuery('#wc-donation-recurring-text').css('display', 'none');
		}
        if ( jQuery(this).val() == 'enabled') {
            jQuery('#wc-donation-recurring-schedules').css('display', 'inline-block');
        } else {
            jQuery('#wc-donation-recurring-schedules').css('display', 'none');  
        }
    });
	if ( jQuery('#wc-donation-recurring').val() == 'user' ) {
		jQuery('#wc-donation-recurring-text').css('display', 'inline-block');
	} else {
		jQuery('#wc-donation-recurring-text').css('display', 'none');
	}
    if ( jQuery('#wc-donation-recurring').val() == 'enabled' ) {
        jQuery('#wc-donation-recurring-schedules').css('display', 'inline-block');
    } else {
        jQuery('#wc-donation-recurring-schedules').css('display', 'none');
	}

	if ( 'no_of_donation' === jQuery('input[name="wc-donation-goal-display-type"]:checked').val()  ) {		
		jQuery('#blk_no_of_donation').show();
	} else if ( 'no_of_days' === jQuery('input[name="wc-donation-goal-display-type"]:checked').val() ) {
		jQuery('#blk_no_of_days').show();
	} else {
		jQuery('#blk_fixed_amount').show();
	}

	jQuery('.goal-display-type label.cbx').click(function(){
		let donation_target = jQuery(this).siblings('.inp-cbx').val();
		if ( 'no_of_donation' === donation_target  ) {	
			jQuery('#blk_no_of_days').hide();
			jQuery('#blk_fixed_amount').hide();
			jQuery('#blk_no_of_donation').show();
		} else if ( 'no_of_days' === donation_target ) {
			jQuery('#blk_no_of_days').show();
			jQuery('#blk_fixed_amount').hide();
			jQuery('#blk_no_of_donation').hide();
		} else {
			jQuery('#blk_no_of_days').hide();
			jQuery('#blk_fixed_amount').show();
			jQuery('#blk_no_of_donation').hide();
		}	
	});

	if ( 'enabled' === jQuery('input[name="wc-donation-goal-close-form"]:checked').val()  ) {		
		jQuery('#close_msg_text').show();
	} else {
		jQuery('#close_msg_text').hide();
	}

	jQuery('label[for="wc-donation-goal-close-form"]').click(function(){
		if ( jQuery(this).siblings('input.inp-cbx').is(':checked') ) {		
			jQuery('#close_msg_text').hide();
		} else {
			jQuery('#close_msg_text').show();
		}
	});
});

jQuery(document).on('change', '#_subscription_period', function(){

	var $this = jQuery(this);
	var period = $this.val();

	jQuery.ajax({
		url: wcds.ajaxUrl,
		type: "POST",
		dataType: "json",
		data: {
			action: 'wc_donation_get_sub_length_by_sub_period',
			period: period
		},		
		success: function (response) {
			
			if ( response.range != '' ) {
				jQuery('#_subscription_length').html('');
				jQuery.each(response.range, function(index, val) {
					jQuery('#_subscription_length').append('<option value="'+ index +'">'+ val +'</option>');
				} );
			}
		}
	});

});

$( "#wc-donation-goal-no-of-days-field" ).datepicker({ 
	dateFormat: 'd-M-yy',
	minDate: '0'
});
jQuery(document).ready(function(){
	if ( jQuery.isFunction(jQuery.fn.selectWoo)) {
	jQuery('.fee_campaign').selectWoo();
	}
});
// var d = new Date();
// d.setDate(d.getDate() - 1);
// alert();
