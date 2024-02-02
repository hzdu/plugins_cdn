( function ( $ ) {

	$(document).ready(function()
	{	
		$('.mwb_wpr_common_table').css('display','none');
		jQuery( '.mwb_table' ).addClass('mwb_table_full_width');
		$('.mwb_points_update').click(function(){
			var user_id = $(this).data('id');
			var user_points = $(document).find("#add_sub_points"+user_id).val();
			var sign = $(document).find("#mwb_sign"+user_id).val();
			var reason = $(document).find("#mwb_remark"+user_id).val();
			user_points = Number(user_points);
			
			if(user_points > 0 && user_points === parseInt(user_points, 10)){
				if( reason != '' ){
					jQuery("#mwb_wpr_loader").show();	
					var data = {
						action:'mwb_wpr_points_update',
						points:user_points,
						user_id:user_id,
						sign:sign,
						reason:reason,
						mwb_nonce:mwb_wpr.mwb_wpr_nonce,
					};
			      	$.ajax({
			  			url: mwb_wpr.ajaxurl, 
			  			type: "POST",  
			  			data: data,
			  			success: function(response) 
			  			{
			  				jQuery("#mwb_wpr_loader").hide();
			  				location.reload();
			  			}
			  		});
				}else{
					alert(mwb_wpr.reason);
				}
	      }
	      else
	      {
	      	alert(mwb_wpr.validpoint);
	      }
			
		});
		if(jQuery('#mwb_wpr_general_product_list').length>0)
		{
			jQuery(document).find('#mwb_wpr_general_product_list').select2();
		}
		window.onload = function(){
			var count = $('.mwb_wpr_repeat:last').data('id');
			for(var i=0; i<=count; i++)
			{
				jQuery(document).find('#mwb_wpr_membership_category_list_'+i).select2();
				jQuery(document).find('#mwb_wpr_membership_product_list_'+i).select2();
			}
		};
		$(document).on("change",".mwb_wpr_common_class_categ",function(){
			var count = $(this).data('id');
    			var mwb_wpr_categ_list = $('#mwb_wpr_membership_category_list_'+count).val();
				if(mwb_wpr_categ_list.length){
    			jQuery("#mwb_wpr_loader").show();
				var data = {
					action:'mwb_wpr_select_category',
					mwb_wpr_categ_list:mwb_wpr_categ_list,
					mwb_nonce:mwb_wpr.mwb_wpr_nonce,
				};
		      	$.ajax({
		  			url: mwb_wpr.ajaxurl, 
		  			type: "POST",  
		  			data: data,
		  			dataType :'json',
		  			success: function(response) 
		  			{	
		  				
			  			if(response.result == 'success')
	                    {
	                        var product = response.data;	                        
	                        var option = '';
	                        for(var key in product)
	                        {
	                            option += '<option value="'+key+'">'+product[key]+'</option>';
	                        } 
	                        jQuery("#mwb_wpr_membership_product_list_"+count).html(option);
	                        jQuery("#mwb_wpr_membership_product_list_"+count).select2();
	                        jQuery("#mwb_wpr_loader").hide();
	                    }
		  			}
		  		});
			}
		});
    	jQuery(document).on('click','.mwb_wpr_repeat_button',function(){
    		var error = false;
    		var empty_message = '';
    		var count = $('.mwb_wpr_repeat:last').data('id');
    		var LevelName = $('#mwb_wpr_membership_level_name_'+count).val();
    		var LevelPoints = $('#mwb_wpr_membership_level_value_'+count).val();
    		var CategValue = $('#mwb_wpr_membership_category_list_'+count).val();
    		var ProdValue = $('#mwb_wpr_membership_product_list_'+count).val();
    		var Discount = $('#mwb_wpr_membership_discount_'+count).val();
    		if(!(LevelName) || !(LevelPoints) ||  !(CategValue)  || !(Discount))
    		{	
    			
    			if(!(LevelName))
    			{
    				error = true;
    				empty_message+= '<div class="notice notice-error is-dismissible"><p><strong>'+mwb_wpr.LevelName_notice+'</strong></p></div>'; 
    				$('#mwb_wpr_membership_level_name_'+count).addClass('mwb_wpr_error_notice');

    			}
    			else
    			{
    				$('#mwb_wpr_membership_level_name_'+count).removeClass('mwb_wpr_error_notice');	
    			}
    			if(!(LevelPoints))
    			{
    				error = true;
    				empty_message+= '<div class="notice notice-error is-dismissible"><p><strong>'+mwb_wpr.LevelValue_notice+'</strong></p></div>'; 
    				$('#mwb_wpr_membership_level_value_'+count).addClass('mwb_wpr_error_notice');

    			}
    			else
    			{
    				$('#mwb_wpr_membership_level_value_'+count).removeClass('mwb_wpr_error_notice');
    			}
    			if(!(CategValue))
    			{
    				error = true;
    				empty_message+= '<div class="notice notice-error is-dismissible"><p><strong>'+mwb_wpr.CategValue_notice+'</strong></p></div>';
    				$('#mwb_wpr_membership_category_list_'+count).addClass('mwb_wpr_error_notice');
    			}
    			else
    			{
    				$('#mwb_wpr_membership_category_list_'+count).removeClass('mwb_wpr_error_notice');
    			}
    			if(!(Discount))
    			{
    				error = true;
    				empty_message+= '<div class="notice notice-error is-dismissible"><p><strong>'+mwb_wpr.Discount_notice+'</strong></p></div>';
    				$('#mwb_wpr_membership_discount_'+count).addClass('mwb_wpr_error_notice');
    			}
    			else
    			{
    				$('#mwb_wpr_membership_discount_'+count).removeClass('mwb_wpr_error_notice');
    			}
    		}
    		if(error)
    		{
	        	$('.notice.notice-error.is-dismissible').each(function(){
                	$(this).remove();
	            });
	            $('.notice.notice-success.is-dismissible').each(function(){
	                $(this).remove();
	            });
	            $('html, body').animate({
                	scrollTop: $(".mwb_wpr_setting").offset().top
            	}, 800);
				$(empty_message).insertAfter($('h1.mwb_wpr_setting'));
    		}
    		else
    		{	
    	
    			count = parseInt(count)+1; 
	    		var html = ""; var cat_options = "";
	    		var Categ_option = mwb_wpr.Categ_option;
	    		var cat_name = [];
	    		
	    		for(var key in Categ_option)
	    		{
	    			cat_name = Categ_option[key].cat_name;
	    			cat_id = Categ_option[key].id;
	    			console.log(cat_id);
	    			cat_options+='<option value="'+cat_id+'">'+cat_name+'</option>';
	    		}
	    	
	    		html+='<div id ="mwb_wpr_parent_repeatable_'+count+'" data-id="'+count+'" class="mwb_wpr_repeat">';
	    		html+='<table class="mwb_wpr_repeatable_section">';
	    		html+='<tr valign="top"><th scope="row" class="titledesc"><label for="mwb_wpr_membership_level_name">'+mwb_wpr.Labeltext+'</label></th>';
	    		html+='<td class="forminp forminp-text"><label for="mwb_wpr_membership_level_name"><input type="text" name="mwb_wpr_membership_level_name_'+count+'" value="" id="mwb_wpr_membership_level_name_'+count+'" class="text_points" required>'+mwb_wpr.Labelname+'</label><input type="button" value='+mwb_wpr.Remove_text+' class="button-primary woocommerce-save-button mwb_wpr_remove_button" id="'+count+'"></td></tr>';
	    		html+='<tr valign="top"><th scope="row" class="titledesc"><label for="mwb_wpr_membership_level_value">'+mwb_wpr.Points+'</label></th><td class="forminp forminp-text"><label for="mwb_wpr_membership_level_value"><input type="number" min="1" value="" name="mwb_wpr_membership_level_value_'+count+'" id="mwb_wpr_membership_level_value_'+count+'" class="input-text" required></label></td></tr>';
	    		html+='<tr valign="top"><th scope="row" class="titledesc"><label for="mwb_wpr_membership_expiration">'+mwb_wpr.Exp_period+'</label></th><td class="forminp forminp-text"><input type="number" min="1" value="" name="mwb_wpr_membership_expiration_'+count+'"id="mwb_wpr_membership_expiration_'+count+'" class="input-text"><select id="mwb_wpr_membership_expiration_days_'+count+'" name="mwb_wpr_membership_expiration_days_'+count+'"><option value="days">'+mwb_wpr.Days+'</option><option value="weeks">'+mwb_wpr.Weeks+'</option><option value="months">'+mwb_wpr.Months+'</option><option value="years">'+mwb_wpr.Years+'</option>';
	    		html+='<tr valign="top"><th scope="row" class="titledesc"><label for="mwb_wpr_membership_category_list">'+mwb_wpr.Categ_text+'</label></th><td class="forminp forminp-text"><select id="mwb_wpr_membership_category_list_'+count+'" required="true" class="mwb_wpr_common_class_categ" data-id="'+count+'" multiple="multiple" name="mwb_wpr_membership_category_list_'+count+'[]">'+cat_options+'</select></td></tr>';
	    		html+='<tr valign="top"><th scope="row" class="titledesc"><label for="mwb_wpr_membership_product_list">'+mwb_wpr.Prod_text+'</label></th><td class="forminp forminp-text"><select id="mwb_wpr_membership_product_list_'+count+'" multiple="multiple" name="mwb_wpr_membership_product_list_'+count+'[]"></select></td></tr>';
	    		html+='<tr valign="top"><th scope="row" class="titledesc"><label for="mwb_wpr_membership_discount">'+mwb_wpr.Discounttext+'</label></th><td class="forminp forminp-text"><label for="mwb_wpr_membership_discount"><input type="number" min="1" max="100" value="" name="mwb_wpr_membership_discount_'+count+'" id="mwb_wpr_membership_discount_'+count+'" class="input-text" required></label></td><input type = "hidden" value="'+count+'" name="hidden_count"></tr></table></div>';
	    		$('.parent_of_div').append(html);
	    		$('#mwb_wpr_parent_repeatable_'+count+'').find('#mwb_wpr_membership_category_list_'+count).select2();
	    		$('#mwb_wpr_parent_repeatable_'+count+'').find('#mwb_wpr_membership_product_list_'+count).select2();
    		}
    	});

    	jQuery(document).on('click','.mwb_wpr_remove_button',function(){
    		var curr_div = $(this).attr('id');
    		if(curr_div == 0)
    		{
    			$(document).find('.mwb_wpr_repeat_button').hide();
    			$('#mwb_wpr_membership_setting_enable').attr('checked',false);
    		}
    		$('#mwb_wpr_parent_repeatable_'+curr_div).remove();
    		
    	});
		$(document).on('click','.mwb_wpr_email_wrapper_text',function(){
			$(this).siblings('.mwb_wpr_email_wrapper_content').slideToggle();
		});
		$(document).on("click",".mwb_wpr_submit_per_category",function(){
    			var mwb_wpr_categ_id = $(this).attr('id');
    			var mwb_wpr_categ_point = $('#mwb_wpr_points_to_per_categ_'+mwb_wpr_categ_id).val();
    			var data = [];
    			if(mwb_wpr_categ_point.length > 0)
    			{
    				if(mwb_wpr_categ_point % 1 === 0 && mwb_wpr_categ_point > 0)
	    			{
	    				jQuery("#mwb_wpr_loader").show();
						data = {
							action:'mwb_wpr_per_pro_category',
							mwb_wpr_categ_id:mwb_wpr_categ_id,
							mwb_wpr_categ_point:mwb_wpr_categ_point,
							mwb_nonce:mwb_wpr.mwb_wpr_nonce,
						};
				      	$.ajax({
				  			url: mwb_wpr.ajaxurl, 
				  			type: "POST",  
				  			data: data,
				  			dataType :'json',
				  			success: function(response) 
				  			{	
				  				
					  			if(response.result == 'success')
			                    {	var category_id = response.category_id;
			                    	var categ_point = response.categ_point;
		                        	jQuery('#mwb_wpr_points_to_per_categ_'+category_id).val(categ_point);
		                        	$('.notice.notice-error.is-dismissible').each(function(){
									$(this).remove();
									});
									$('.notice.notice-success.is-dismissible').each(function(){
										$(this).remove();
									});
									
									$('html, body').animate({
								        scrollTop: $(".woocommerce_page_mwb-wpr-setting").offset().top
								    }, 800);
								    var assing_message = '<div class="notice notice-success is-dismissible"><p><strong>'+mwb_wpr.success_assign+'</strong></p></div>';
								    $(assing_message).insertAfter($('h1.mwb_wpr_setting'));
			                        jQuery("#mwb_wpr_loader").hide();
			                    }
				  			}
				  		});	
	    			}
	    			else
	    			{
	    				$('.notice.notice-error.is-dismissible').each(function(){
						$(this).remove();
						});
						$('.notice.notice-success.is-dismissible').each(function(){
							$(this).remove();
						});
						
						$('html, body').animate({
					        scrollTop: $(".woocommerce_page_mwb-wpr-setting").offset().top
					    }, 800);
					    var valid_point = '<div class="notice notice-error is-dismissible"><p><strong>'+mwb_wpr.error_assign+'</strong></p></div>';
					    $(valid_point).insertAfter($('h1.mwb_wpr_setting'));
	    			}
    			}
    			else
    			{	
    				jQuery("#mwb_wpr_loader").show();
					data = {
						action:'mwb_wpr_per_pro_category',
						mwb_wpr_categ_id:mwb_wpr_categ_id,
						mwb_wpr_categ_point:mwb_wpr_categ_point,
						mwb_nonce:mwb_wpr.mwb_wpr_nonce,
					};
			      	$.ajax({
			  			url: mwb_wpr.ajaxurl, 
			  			type: "POST",  
			  			data: data,
			  			dataType :'json',
			  			success: function(response) 
			  			{	
			  				
				  			if(response.result == 'success')
		                    {	var category_id = response.category_id;
		                    	var categ_point = response.categ_point;
	                        	jQuery('#mwb_wpr_points_to_per_categ_'+category_id).val(categ_point);
	                        	$('.notice.notice-error.is-dismissible').each(function(){
								$(this).remove();
								});
								$('.notice.notice-success.is-dismissible').each(function(){
									$(this).remove();
								});
								
								$('html, body').animate({
							        scrollTop: $(".woocommerce_page_mwb-wpr-setting").offset().top
							    }, 800);
							    var remove_message = '<div class="notice notice-success is-dismissible"><p><strong>'+mwb_wpr.success_remove+'</strong></p></div>';
							    $(remove_message).insertAfter($('h1.mwb_wpr_setting'));
		                        jQuery("#mwb_wpr_loader").hide();
		                    }
			  			}
			  		});
    			}
		});

		//Begains

		$(document).on("click",".mwb_wpr_submit_purchase_points_per_category",function(){			
    			var mwb_wpr_categ_id = $(this).attr('id');
    			var mwb_wpr_categ_point = $('#mwb_wpr_purchase_points_cat'+mwb_wpr_categ_id).val();
    			var data = [];    			
    			if(mwb_wpr_categ_point.length > 0)
    			{
    				if(mwb_wpr_categ_point % 1 === 0 && mwb_wpr_categ_point > 0)
	    			{
	    				jQuery("#mwb_wpr_loader").show();
						data = {
							action:'mwb_wpr_per_pro_pnt_category',
							mwb_wpr_categ_id:mwb_wpr_categ_id,
							mwb_wpr_categ_point:mwb_wpr_categ_point,
							mwb_nonce:mwb_wpr.mwb_wpr_nonce,

						};
				      	$.ajax({
				  			url: mwb_wpr.ajaxurl, 
				  			type: "POST",  
				  			data: data,
				  			dataType :'json',
				  			success: function(response) 
				  			{	
				  				
					  			if(response.result == 'success')
			                    {	
			                    	var category_id = response.category_id;
			                    	var categ_point = response.categ_point;
		                        	jQuery('#mwb_wpr_purchase_points_cat'+category_id).val(categ_point);
		                        	$('.notice.notice-error.is-dismissible').each(function(){
									$(this).remove();
									});
									$('.notice.notice-success.is-dismissible').each(function(){
										$(this).remove();
									});
									
									$('html, body').animate({
								        scrollTop: $(".woocommerce_page_mwb-wpr-setting").offset().top
								    }, 800);
								    var assing_message = '<div class="notice notice-success is-dismissible"><p><strong>'+mwb_wpr.success_assign+'</strong></p></div>';
								    $(assing_message).insertAfter($('h1.mwb_wpr_setting'));
			                        jQuery("#mwb_wpr_loader").hide();
			                    }
				  			}
				  		});	
	    			}
	    			else
	    			{
	    				$('.notice.notice-error.is-dismissible').each(function(){
						$(this).remove();
						});
						$('.notice.notice-success.is-dismissible').each(function(){
							$(this).remove();
						});
						
						$('html, body').animate({
					        scrollTop: $(".woocommerce_page_mwb-wpr-setting").offset().top
					    }, 800);
					    var valid_point = '<div class="notice notice-error is-dismissible"><p><strong>'+mwb_wpr.error_assign+'</strong></p></div>';
					    $(valid_point).insertAfter($('h1.mwb_wpr_setting'));
	    			}
    			}
    			else
    			{	
    				jQuery("#mwb_wpr_loader").show();
					data = {
						action:'mwb_wpr_per_pro_pnt_category',
						mwb_wpr_categ_id:mwb_wpr_categ_id,
						mwb_wpr_categ_point:mwb_wpr_categ_point,
						mwb_nonce:mwb_wpr.mwb_wpr_nonce,
					};
			      	$.ajax({
			  			url: mwb_wpr.ajaxurl, 
			  			type: "POST",  
			  			data: data,
			  			dataType :'json',
			  			success: function(response) 
			  			{	
				  			if(response.result == 'success')
		                    {	var category_id = response.category_id;
		                    	var categ_point = response.categ_point;
	                        	jQuery('#mwb_wpr_purchase_points_cat'+category_id).val(categ_point);
	                        	$('.notice.notice-error.is-dismissible').each(function(){
								$(this).remove();
								});
								$('.notice.notice-success.is-dismissible').each(function(){
									$(this).remove();
								});
								
								$('html, body').animate({
							        scrollTop: $(".woocommerce_page_mwb-wpr-setting").offset().top
							    }, 800);
							    var remove_message = '<div class="notice notice-success is-dismissible"><p><strong>'+mwb_wpr.success_remove+'</strong></p></div>';
							    $(remove_message).insertAfter($('h1.mwb_wpr_setting'));
		                        jQuery("#mwb_wpr_loader").hide();
		                    }
			  			}
			  		});
    			}
		});


		//END


		$(document).find('#mwb_wpr_restrictions_for_purchasing_cat').select2();
		$(document).find('#mwb_wpr_restrictions_for_purchasing_pro').select2();
		$(document).on('change','select#product-type',function() {
     		var product_type = $( 'select#product-type' ).val();
     		if(product_type == 'variable'){
     			$('.mwb_points_product_value_field ').remove();
     		}
      	});

      	//Slide toggle on tables
		$(document).on('click','.mwb_wpr_common_slider',function(){
			$(this).siblings('.mwb_wpr_common_table').slideToggle("fast");
			$(this).children('.mwb_wpr_open_toggle').toggleClass('mwb_wpr_plus_icon');
		});

		/////////////// License Activation ////////////////
	  	$('#mwb_wpr_license_save').on('click',function(){
	  		var data = [];
	    	$('.licennse_notification').html('');
		    var mwb_license = $('#mwb_wpr_license_key').val();
		    if( mwb_license == '' )
		    {
		      $('#mwb_wpr_license_key').css('border','1px solid red');
		      return false;
		    }
		    else
		    {
		      $('#mwb_wpr_license_key').css('border','none');
		    }
		    $('.loading_image').show();
		    $.ajax({
		      url: mwb_wpr.ajaxurl, 
		      type: "POST",  
		      dataType: 'json',
		      data:{
		      'action':'mwb_wpr_register_license',
		      'mwb_nonce':mwb_wpr.mwb_wpr_nonce,
		      'license_key':mwb_license
		      },success: function(response) 
		      {
		        if( response.msg == '' ){
		          response.msg = mwb_wpr.license_error_msg;
		        }
		        $('.loading_image').hide();
		        console.log(response);
		        if(response.status == true )
		        {
		          $('.licennse_notification').css('color','green');
		          $('.licennse_notification').html(response.msg);
		          window.location.href = mwb_wpr.mwb_wpr_url;
		        }
		        else
		        { 
		          $('.licennse_notification').css('color','red');
		          $('.licennse_notification').html(response.msg);
		        }
		      }
		    });
	  	});
  		////////////////End License authentication///////////////

  		////////   ADDON SUGGESTION FORM  /////////////////

		  $(document).on('click','.mwb_wpr_addon_suggestion',function(){
		  	$(".mwb_suggestion_form").css('display','block');
		  });
		  $(document).on('click','.mwb_wpr_close_modal',function(){
		  	$(".mwb_suggestion_form").css('display','none');
		  });
  		///////  END OF ADDON SUGGESTION FORM ////////

  		////==========Custmization=====================
  		$(document).on('click','#mwb_wpr_add_more',function()
		{
			if($('#mwb_wpr_thankyouorder_enable').prop("checked") == true)
			{
				var response = check_validation_setting();
				if( response == true)
				{
					var tbody_length = $('.mwb_wpr_thankyouorder_tbody > tr').length;
					var new_row = '<tr valign="top"><td class="forminp forminp-text"><label for="mwb_wpr_thankyouorder_minimum"><input type="text" name="mwb_wpr_thankyouorder_minimum[]" class="mwb_wpr_thankyouorder_minimum input-text wc_input_price" required=""></label></td><td class="forminp forminp-text"><label for="mwb_wpr_thankyouorder_maximum"><input type="text" name="mwb_wpr_thankyouorder_maximum[]" class="mwb_wpr_thankyouorder_maximum"></label></td><td class="forminp forminp-text"><label for="mwb_wpr_thankyouorder_current_type"><input type="text" name="mwb_wpr_thankyouorder_current_type[]" class="mwb_wpr_thankyouorder_current_type input-text wc_input_price" required=""></label></td><td class="mwb_wpr_remove_thankyouorder_content forminp forminp-text"><input type="button" value="' + mwb_wpr.remove_button + '" class="mwb_wpr_remove_thankyouorder button" ></td></tr>';
					
					if( tbody_length == 2 )
					{
						$( '.mwb_wpr_remove_thankyouorder_content' ).each( function() {
							$(this).show();
						});
					}
					$('.mwb_wpr_thankyouorder_tbody').append(new_row);
				}			
			}
		});
		// added code start.
		if ( $('#notify_user_wp_color').length > 0 ) {
			$('#notify_user_wp_color').wpColorPicker();
		}
		// added code end.
		$(document).on('click','.mwb_wpr_remove_thankyouorder',function()
		{

			if($('#mwb_wpr_thankyouorder_enable').prop("checked") == true)
			{
				$(this).closest('tr').remove();
				var tbody_length = $('.mwb_wpr_thankyouorder_tbody > tr').length;
				
				if( tbody_length == 2 ){
					$( '.mwb_wpr_remove_thankyouorder_content' ).each( function() {
						$(this).hide();
					});
				}
			}
		});	
		if($('#mwb_wpr_thankyouorder_enable').prop("checked") == true){
			$('.mwb_wpr_thankyouorder_row').show();
		}	
		if($('.mwb_wpr_thankyouorder_tbody > tr').length == 2){
			$( '.mwb_wpr_remove_thankyouorder_content' ).each( function() {
				$(this).hide();
			});
		}
  		////==========Custmization=====================

});
var check_validation_setting = function(){
		if($('#mwb_wpr_thankyouorder_enable').prop("checked") == true){
			var tbody_length = $('.mwb_wpr_thankyouorder_tbody > tr').length;
			var i = 1;
			var min_arr = []; var max_arr = [];
			var empty_warning = false;
			var is_lesser = false;
			var num_valid = false;
			$('.mwb_wpr_thankyouorder_minimum').each(function(){
				min_arr.push($(this).val());		
			});
		
			var i = 1;
			
			$('.mwb_wpr_thankyouorder_maximum').each(function(){
				max_arr.push($(this).val());
				i++;			
			});
			var i = 1;
			var thankyouorder_arr = [];
			$('.mwb_wpr_thankyouorder_current_type').each(function(){
				thankyouorder_arr.push($(this).val());
				
				if(!$(this).val()){				
					$('.mwb_wpr_thankyouorder_tbody > tr:nth-child('+(i+1)+') .mwb_wpr_thankyouorder_current_type').css("border-color", "red");
					empty_warning = true;
				}
				else {
					$('.mwb_wpr_thankyouorder_tbody > tr:nth-child('+(i+1)+') .mwb_wpr_thankyouorder_current_type').css("border-color", "");				
				}
				i++;			
			});
			if(empty_warning) {
				$('.notice.notice-error.is-dismissible').each(function(){
					$(this).remove();
				});
				$('.notice.notice-success.is-dismissible').each(function(){
					$(this).remove();
				});
				
				$('html, body').animate({
			        scrollTop: $(".woocommerce_page_mwb-wpr-setting").offset().top
			    }, 800);
			    var empty_message = '<div class="notice notice-error is-dismissible"><p><strong>' + mwb_wpr.empty_field_msg + '</strong></p></div>';
			    $(empty_message).insertAfter($('h1.mwb_wpr_setting'));
				return;
			}
			var minmaxcheck = false;
			if(max_arr.length >0 && min_arr.length > 0)
			{
				if( min_arr.length == max_arr.length && max_arr.length == thankyouorder_arr.length) {
				
					for ( var j = 0; j < min_arr.length; j++) {
						
						if(parseInt(min_arr[j]) > parseInt(max_arr[j])) {
							minmaxcheck = true;
							$('.mwb_wpr_thankyouorder_tbody > tr:nth-child('+(j+2)+') .mwb_wpr_thankyouorder_minimum').css("border-color", "red");
							$('.mwb_wpr_thankyouorder_tbody > tr:nth-child('+(j+2)+') .mwb_wpr_thankyouorder_minimum').css("border-color", "red");
						}
						else{
							$('.mwb_wpr_thankyouorder_tbody > tr:nth-child('+(j+2)+') .mwb_wpr_thankyouorder_minimum').css("border-color", "");
							$('.mwb_wpr_thankyouorder_tbody > tr:nth-child('+(j+2)+') .mwb_wpr_thankyouorder_minimum').css("border-color", "");
						}
					}
				}
				else{
					$('.notice.notice-error.is-dismissible').each(function(){
						$(this).remove();
					});
					$('.notice.notice-success.is-dismissible').each(function(){
						$(this).remove();
					});
					
					$('html, body').animate({
				        scrollTop: $(".woocommerce_page_mwb-wpr-setting").offset().top
				    }, 800);
				    var empty_message = '<div class="notice notice-error is-dismissible"><p><strong>' + mwb_wpr.empty_field_msg + '</strong></p></div>';
				    $(empty_message).insertAfter($('h1.mwb_wpr_setting'));
					return;
				}
			}
			if(minmaxcheck) {
				$('.notice.notice-error.is-dismissible').each(function(){
					$(this).remove();
				});
				$('.notice.notice-success.is-dismissible').each(function(){
					$(this).remove();
				});
				
				$('html, body').animate({
			        scrollTop: $(".woocommerce_page_mwb-wpr-setting").offset().top
			    }, 800);
			    var empty_message = '<div class="notice notice-error is-dismissible"><p><strong>' + mwb_wpr.min_max_error_msg + '</strong></p></div>';
			    $(empty_message).insertAfter($('h1.mwb_wpr_setting'));
				return;
			}
			return true;
		}
		else {
			return false;
		}
	};

	// This function is used to remove member from user when click on remove button.
	jQuery(document).on('click', '.mwb_wpr_remove_button', function(){
		var count      = $(this).attr('id');
		var level_name = $('#mwb_wpr_membership_level_name_'+count).val();

		var data = {
			action     : 'mwb_wpr_remove__membership',
			level_name : level_name,
			mwb_nonce  : mwb_wpr.mwb_wpr_nonce,
		};

		$.ajax({
			url: mwb_wpr.ajaxurl,
			type: "POST",  
			data: data,
			success: function(response) 
			{
				console.log(response);
			}
		});
	});

	// This function is used to Preview csv data before importing csv file.
	jQuery(document).on('click', '#mwb_wpr_preview_csv_file_data', function(){
		
		jQuery('.mwb_wpr_preview_csv_loader').show();
		jQuery('.mwb_preview_csv_main_wrapper').hide();
		var form_data = new FormData( jQuery('form#mainform')[0] );
		form_data.append( 'action', 'mwb_wpr_preview_csv_data_action' );
		form_data.append( 'mwb_nonce', mwb_wpr.mwb_wpr_nonce );
		form_data.append( 'start_limit', 80 );
		form_data.append( 'end_limit', 80 );

		jQuery.ajax({
			method      : 'POST',
			url         : mwb_wpr.ajaxurl,
			data        : form_data,
			contentType : false,
			processData : false,
			success     : function( response ){
				jQuery('.mwb_wpr_preview_csv_loader').hide();
				if ( false === response.result ) {
					alert( response.msg );
				} else if ( 'undefined' === response.result ) {
					alert( response.msg );
				} else {
					jQuery('.mwb_preview_csv_main_wrapper').show();
					jQuery('.mwb_wpr_show_preview_data').html(response);
				}
			},
			error : function( error ) {
				jQuery('.mwb_wpr_preview_csv_loader').hide();
				alert('Invalid File');
			},
		});
	});

	// Close preview modal.
	jQuery(document).on('click', '.mwb-csv-close-btn', function(){
		jQuery('.mwb_preview_csv_main_wrapper').hide();
	});

	// closing saved success msg.
	jQuery(document).on('click', '.notice-dismiss', function(){
		jQuery('.notice-success').hide();
	});

} ( jQuery ) );
