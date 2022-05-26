(function( $ ) {
	'use strict';

	/*========================================
	* Load edit review form
	*========================================*/
	$(".rx-edit-btn").on('click', function(){

		let is_recommended  = 0;

		$('#edit-prod-link').attr('href', $(this).attr("product_url"));
		$('#edit-prod-url').attr('href', $(this).attr("product_url"));
		$("#edit-prod-order").text($(this).attr("order_id"));
		$("#edit-prod-order-status").text($(this).attr("order_status"));
		$("#edit-img-thumb").attr("src",$(this).attr("product_img"));
		$("#edit-prod-name").text($(this).attr("product_name"));
		$("#edit-prod-qty").text($(this).attr("product_quantity"));
		$("#edit-prod-price").text($(this).attr("product_price"));
		$("#rx-edit-order-id").val($(this).attr("order_id"));
		$("#rx-edit-product-id").val($(this).attr("product_id"));
		$("#rx-review-id").val($(this).attr("review_id"));

		$("#rx-order-table").hide();
		$("#rx-edit-form").removeClass('rx-hide');
		$(".woocommerce-MyAccount-navigation").hide();
		$(".woocommerce-MyAccount-content").addClass('rx-full-width');
		$(".woocommerce-Pagination").hide();

		let review_id = $(this).attr("review_id");
		
		$.ajax({
			url: rx_ajax_data.ajax_url,
			type: 'post',
			data: {
				action: 'display_review_content',
				review_id: review_id
			},
			success: function (data) {		

				if( data.is_recommended != '' ){
					is_recommended = data.is_recommended; 
				}
				
				if( data != undefined || data != null ) {
						
					$("#rx-edit-title").val(data.rx_title);
					$("#rx-edit-text").val(data.message);
					$("input[name=rx-recommend-status][value=" + is_recommended + "]").attr('checked', 'checked');
					
					if( data.rx_video_source_control == "self" ) {
						
						$("#rx-edit-video-preview").show();
						$("#rx-edit-video-preview").attr("href", data.video_url);
						$("#rx-edit-self-video").show();
						$("#rx-edit-video-source-control").val(data.rx_video_source_control);
						$("#rx-set-edit-video-url").val(data.video_url);   //visual edit input
						$("#rx-edit-video-url").val(data.video_url);
						
						//show upload video note
						$("#rx-note-edit-external-video").hide();

					} else if( data.rx_video_source_control == "external" ) {
							
						$("#rx-edit-self-video").hide();
						$("#rx-edit-external-video-url").show();
						$("#rx-edit-external-video-url").css({'margin-top':'0px'});
						$("#rx-edit-video-source-control").val(data.rx_video_source_control);
						$("#rx-set-edit-video-url").val(data.video_url);   //visual edit input
						$("#rx-edit-video-url").val(data.video_url);

						//show upload video note
						$("#rx-note-edit-external-video").show();	

					} else {

						$("#rx-edit-self-video").show();
						$("#rx-note-edit-external-video").hide();
						$("#rx-note-edit-self-video").show(); //show upload video note
						$("#rx-edit-video-source-control").val('self');
					}

					$("#rx-edit-images").removeClass('rx-hide');					
					$("#rx-edit-images").prepend(data.images);
					$("#rx-edit-criteria").html(data.rating);
					if( data.is_anonymously == 1) {
						$( "#rx-edit-anonymouse-user").prop('checked', true);
					}

					if( data.review_status == "unapproved" ) {
						$(".rx-review-status-notice").show();	
					}
				}
			},
			error:function (err) {
				console.log(err);
			}
		});
	});

	/*========================================
	* Cancel edit review form
	*========================================*/
	$(".rx-edit-cancel").on('click', function(){
		$("#rx-edit-form").addClass('rx-hide');
		$(".woocommerce-MyAccount-navigation").show();
		$(".woocommerce-MyAccount-content").removeClass('rx-full-width');
		$("#rx-order-table").show();
		$(".woocommerce-Pagination").show();
		$("#rx-edit-title").val("");
		$("#rx-edit-video-url").val("");
		$("#rx-edit-text").val("");
		$("#rx-edit-text-error").html("");
		$("#rx-edit-rating-error").html("");
		if($('#rx-edit-images').find('div.rx-edit-image').length !== 0){
			$('.rx-edit-image').remove();
		}
		$(".rx-review-status-notice").hide();
	});

	/*========================================
	* Submit edit review form 
	*========================================*/
	$("#rx-edit").on('click', function(){

		let formInput 			= $("#rx-edit-form input");	 // grab all input field
		let review_title 		= $("#rx-edit-title").val();  // grab review text
		let review_text 		= $("#rx-edit-text").val();  // grab review text

		if( review_title == "" ){
			$("#rx-edit-title").focus();
			$("#rx-review-edit-title-error").html(rx_ajax_data.rx_review_title_error);
		} else if( review_text == '' ){
			$("#rx-edit-text").focus();
			$("#rx-text-error").html(rx_ajax_data.rx_review_text_error);			
		} else {
			$("#rx-edit").attr("disabled", true);
			$("#rx-edit-cancel").attr("disabled", true);
			$(".rx-lds-css").show();

			let data = formInput.serializeArray();
			data.push({ 
				name: 'rx-edit-video-source-control',
				value: $('#rx-edit-video-source-control').val() 
			});	
			
			$.ajax({
				url: rx_ajax_data.ajax_url,
				type: 'post',
				data: {
					action: 'update_review_content',
					forminput: data,
					rx_edit_text: review_text,
					security: $("#rx-edit-nonce").val()
				},
				success: function (data) {
					$(".rx-lds-css").hide();
					$("#rx-edit").attr("disabled", false);
					$(".rx-edit-cancel").attr("disabled", false);

					$("#rx-edit").parent().siblings().closest('.rx-form-submit-status').fadeIn().addClass('success').text(rx_ajax_data.review_success_msg);
					setTimeout(function() { 
						window.location.reload();
					}, 1000);	
				},
				error:function(err){
					// console.log(err);
					$(".rx-lds-css").hide();
					$("#rx-edit").attr("disabled", false);
					$(".rx-edit-cancel").attr("disabled", false);

				}
			});
		}

	});

	/*========================================
	* Remove preview image
	*========================================*/
	$(document).on('click', '#rx_upload_photo i', function () {
		$(this).closest(".rx_upload_photo").remove();
	});	

	/*========================================
	* Helpful
	*========================================*/
	$( document ).on( 'click', '.reviewx_like', function () {	
		let that = $(this);	
		let rx_comment_id 		= $(this).attr('like_id');
		let reviewx_like_val 	= '.reviewx_like_val-'+ rx_comment_id;
		let user_log_in 		= '.user_log_in-'+rx_comment_id;
		$.ajax({
			url: rx_ajax_data.ajax_url,
			type: 'post',
			data: {
				action: 'reviewx_upvoted_downvoted',
				rx_comment_id: rx_comment_id,
				security: $("#rx-voted-nonce").val()
			},
			success: function (data) {			
				if( data.success === true ){
					$(reviewx_like_val).text(data.total_like);
				}
				else{
					$(user_log_in).css("display", "block");
				}
			},
			error:function (err) {
				console.log( err + 'Error....');
			}
		});
	} );

	/*========================================
	* Admin reply
	*========================================*/
	$(document).ready(function () {
		$( document ).on( 'click', '.wc_rx_btns .wc_rx_btns-open', function () {
		//$('.wc_rx_btns .wc_rx_btns-open').on('click', function () {
			$(this).parent().find('.wc_rx_btns_more_buttons').addClass('open');
		});

		// Close more share modal
		$( document ).on( 'click', '.wc_rx_btns-close', function () {
		//$('.wc_rx_btns-close').on('click', function () {
			var parent = $(this).parent().parent().parent();
			$(parent).removeClass('open');
		});

		$( document ).on('click','.wc_rx_btns > ul > li > a, .wc_rx_btns_more_buttons ul > li > a', function (e) {
			e.preventDefault();

			var href = $(this).data('href');

			if ( typeof href != 'undefined' && href.length > 0 )
				window.open(href, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=400,height=400");
		});

		$( document ).on( 'click', '.wc_rx_btns_float_hide', function (e) {
		// $('.wc_rx_btns_float_hide').on('click', function (e) {
			e.preventDefault();

			$(this).parent().parent().parent().addClass('rx-hide');
		});
		$( document ).on( 'click', '.wc_rx_btns_float_show', function (e) {
		// $('.wc_rx_btns_float_show').on('click', function (e) {
			e.preventDefault();

			$(this).parent().parent().parent().removeClass('rx-hide');
		});
		
		//Togle share button
		$( document ).on( 'click', '.rx-share-icon', function () {
		// $(".rx-share-icon").click(function(){
			$(this).siblings().toggle('slow');
		});
	});

	/*========================================
	* Change video source in the add review form
	*========================================*/	
	$( document ).on( 'change', '#rx-video-source-control', function () {	
	// $("#rx-video-source-control").on('change', function(){
		let video_source = $(this).val();
		if( video_source == 'self' ) {
			
			if( $("#rx-video-url").val() != '' ) {
				$("#rx-show-video-preview").show();
			}
			$("#rx-self-video").show();
			$("#rx-external-video-url").hide();

			//Note show/hide
			$("#rx-note-self-video").show();
			$("#rx-note-external-video").hide();

		} else {

			$("#rx-self-video").hide();		
			$("#rx-show-video-preview").hide();
			$("#rx-self-video").hide();
			$("#rx-external-video-url").show();
			
			//Note show/hide
			$("#rx-note-external-video").show();
			$("#rx-note-self-video").hide();

		}
	});	

	$( document ).on( 'keyup', '#rx-set-video-url', function () {
	// $("#rx-set-video-url").on('keyup', function() {
		let external_url = $(this).val();
		$("#rx-video-url").val(external_url);
	})

	/*========================================
	* Change video source in the edit review form
	*========================================*/	
	$( document ).on( 'change', '#rx-edit-video-source-control', function () {
	// $("#rx-edit-video-source-control").on('change', function() {
		let video_source = $(this).val();
		if( video_source == 'self' ) {
			
			if( $("#rx-edit-video-url").val() != '' ) {
				$("#rx-edit-show-video-preview").show();
			}
			$("#rx-edit-self-video").show();
			$("#rx-edit-external-video-url").hide();

			//Note: show/hide
			$("#rx-note-edit-self-video").show();
			$("#rx-note-edit-external-video").hide();			

		} else {

			$("#rx-edit-self-video").hide();		
			$("#rx-edit-show-video-preview").hide();
			$("#rx-edit-external-video-url").show();

			//Note: show/hide
			$("#rx-note-edit-external-video").show();
			$("#rx-note-edit-self-video").hide();

		}
	});	

	$( document ).on( 'keyup', '#rx-set-edit-video-url', function () {
	// $("#rx-set-edit-video-url").on('keyup', function() {
		let external_url = $(this).val();
		$("#rx-edit-video-url").val(external_url);
	})

	/*========================================
	* Start mouse enter the review area 
	* and Highlight button will display
	*========================================*/		
	$(document).on({
		mouseenter: function () {
			$(this).children().find('.rx_admin_heighlights').removeClass('rx-hide');
		},
		mouseleave: function () {
			$(this).children().find('.rx_admin_heighlights').addClass('rx-hide');
		}
	}, '.rx_photo_review_item-content, .rx-review-content');

	/*========================================
	* Admin highlight
	*========================================*/	
	$(document).on('click', ".rx_admin_heighlights", function () {
		let review_id = $(this).data('review-id');
		if( $(this).closest('.rx_review_block').hasClass('reviewx_highlight_comment')) {
			$(this).closest('.rx_review_block').removeClass('reviewx_highlight_comment');
			$(this).children('span').html(rx_ajax_data.highlight_button_text);
		} else {
			$(this).closest('.rx_review_block').addClass('reviewx_highlight_comment');
			$(this).children('span').html(rx_ajax_data.highlight_button_rtext);	
		}
		$.ajax({
			url: rx_ajax_data.ajax_url,
			type: 'post',
			data: {
				action: 'marked_as_highlight',
				review_id: review_id,
				security: $("#rx-highlight-nonce").val()
			},
			success: function (data) {},
			error:function (err) {
				console.log(err);
			}
		});
	});

	/*========================================
	* Admin reply form load
	*========================================*/	
	$(document).on('click', ".rx-admin-reply", function(e){
		e.preventDefault();

		let $this = $(this);
		let review_id = $(this).data('review-id');
		let product_id = $(this).data('product-id');

		let html = `<div class="rx-admin-reply-area">
					<p class="comment-form-comment">
						<label for="rx_comment">
							<span class="admin-reply-form-title">${rx_ajax_data.reply_to_this_review}</span>&nbsp;
						</label>
						<textarea id="rx_comment" class="rx-admin-reply-text" name="rx-admin-reply-text" cols="8" rows="3"></textarea>
					</p> 
					<p class="form-submit">
						<input name="cancel-admin-reply" type="button" class="cancel-admin-reply" value="${rx_ajax_data.review_reply_cancel}">
						<button type="button" name="admin-review-reply" type="button" class="rx-form-btn rx-form-primary-btn rv-btn admin-review-reply">
							<div class="admin-reply-loader"></div> ${rx_ajax_data.review_reply}
						</button>                                               
						<input type="hidden" name="comment_post_ID" value="${product_id}" class="comment_post_ID">
						<input type="hidden" name="comment_parent" class="comment_parent" value="${review_id}">
					</p>                                                   
				</div> `;
		if( $(this).closest('.rx_meta').find('.rx-admin-reply-area').length == 0 ){
			$this.after(html);
			$this.hide();
		}
	});

	/*========================================
	* Cancel admin reply form
	*========================================*/		
	$(document).on('click', ".cancel-admin-reply", function(){
		$(this).parent().parent().siblings().show();
		$(this).parent().parent().remove();
	});

	/*========================================
	* Submit admin reply form
	*========================================*/	
	$(document).on('click', ".admin-review-reply", function(){

		let $this   = $(this);
		let admin_reply = $this.parent().siblings().find('.rx-admin-reply-text').val();
		let review_id   = $this.parent().find('.comment_parent').val();
		let product_id  = $this.parent().find('.comment_post_ID').val();
		if( admin_reply == '' || admin_reply == undefined ){
			$this.parent().siblings().find('.rx-admin-reply-text').focus();
		} else {
			$this.find('.admin-reply-loader').show()
			$.ajax({
				url: rx_ajax_data.ajax_url,
				type: 'post',
				data: {
					action: 'review_admin_reply',
					review_id: review_id,
					product_id: product_id,
					admin_reply: admin_reply,
					security: $("#rx-highlight-nonce").val()
				},
				success: function (data) {					
					$this.find('.admin-reply-loader').hide()					
					if( data.success == true ){				
						$this.closest('.rx_review_wrap').find('.rx-admin-reply-area').hide();		
						$this.closest('.rx_review_wrap').after(data.admin_reply)
					}					
				},
				error:function (err) {
					$this.find('.admin-reply-loader').hide()
					console.log(err);
				}
			});
		}		
	});

	/*========================================
	* Load admin reply edit form
	*========================================*/	
	$(document).on('click', ".admin-reply-edit-icon", function(){
		let $this   		= $(this);
		let review_id 		= $this.data('review-id')
		let product_id 		= $(this).data('product-id')
		let message 		= $(this).parent().parent().siblings().closest('.comment-body').find('p').text();
		let html = `<div class="rx-admin-edit-reply-area">
			<p class="comment-form-comment">
				<label for="comment">
					<span class="admin-reply-form-title">${rx_ajax_data.edit_this_reply}</span>&nbsp;
				</label>
				<textarea class="rx-admin-reply-text" name="rx-admin-reply-text" cols="8" rows="3">${message}</textarea>
			</p> 
			<p class="form-submit">
				<input name="cancel-admin-reply" type="button" class="cancel-admin-edit-reply" value="${rx_ajax_data.review_reply_cancel}">
				<button type="button" name="admin-review-edit-reply" type="button" class="rx-form-btn rx-form-primary-btn rv-btn admin-review-edit-reply">
					<div class="admin-reply-loader"></div> ${rx_ajax_data.reply_update}
				</button>                                               
				<input type="hidden" name="comment_post_ID" value="${product_id}" class="comment_post_ID">
				<input type="hidden" name="comment_parent" class="comment_parent" value="${review_id}">
			</p>                                                   
		</div> `;

		if( $(this).closest('.rx_review_block').find('.rx-admin-edit-reply-area').length == 0 ) {
			$this.closest('.children').hide();
			$this.closest('.children').after(html);
		}
		
	});

	/*========================================
	* Cancel edit admin reply
	*========================================*/		
	$(document).on('click', ".cancel-admin-edit-reply", function(){
		
		let $this = $(this);
		$this.parent().parent().siblings().closest('.children').show();
		$this.closest('.rx-admin-edit-reply-area').remove();

	});

	/*========================================
	* Submit edit admin reply form
	*========================================*/		
	$(document).on('click', ".admin-review-edit-reply", function(){

		let $this   	= $(this);
		let admin_reply = $this.parent().siblings().find('.rx-admin-reply-text').val();
		let review_id   = $this.parent().find('.comment_parent').val();
		if( admin_reply == '' || admin_reply == undefined ){			
			$this.parent().siblings().find('.rx-admin-reply-text').focus();		
		} else {
			$this.find('.admin-reply-loader').show()				
			$.ajax({
				url: rx_ajax_data.ajax_url,
				type: 'post',
				data: {
					action: 'update_review_admin_reply',
					review_id: review_id,
					admin_reply: admin_reply,
					security: $("#rx-highlight-nonce").val()
				},
				success: function (data) {				
					if( data.success == 1 ) {			
						$this.parent().parent().siblings().closest('.children').find('.comment-content').find('p').text(data.admin_reply);
					}
					
					$this.find('.admin-reply-loader').hide()
					$this.parent().parent().siblings().closest('.children').show()
					$this.closest('.rx-admin-edit-reply-area').remove();	
				},
				error:function (err) {
					$this.find('.admin-reply-loader').hide()
					console.log(err);
				}
			});
		}		
	});

	/*========================================
	* Delete admin reply
	*========================================*/		
	$(document).on('click', ".admin-reply-delete-icon", function(){
		let review_id 		= $(this).data('review-id');
		$(this).closest('.children').remove();
		$('.rx-admin-reply').show();
		$.ajax({
			url: rx_ajax_data.ajax_url,
			type: 'post',
			data: {
				action: 'delete_review_admin_reply',
				review_id: review_id,
				security: $("#rx-highlight-nonce").val()
			},
			success: function (data) {	
				if( data.success == true ){
					$(this).closest('.children').remove();		
				}
			},
			error:function (err) {
				console.log(err);
			}
		});	
	});
	
	/*========================================
	* Display helpful login required message
	*========================================*/		
	$('.like_login_required').each(function(){				
		$(this).data('title',$(this).attr('title'));
		$(this).removeAttr('title');	
	});

	$('.like_login_required').mouseover(function() {		
		$('.like_login_required').next('.rx_tooltip').remove();
		$(this).after('<span class="rx_tooltip">' + $(this).data('title') + '</span>');
		var left = $(this).position().left + $(this).width() + 6;
		var top = $(this).position().top - 30;
		$(this).next().css('top',top);				
	});
	
	$( document ).on( 'click', '.like_login_required', function () {
		$(this).mouseover();
		$(this).next().animate({opacity: 0.9},{duration: 2000, complete: function(){
			$(this).fadeOut(1000);
		}});
	});
	
	/*========================================
	* Remove the tooltip on when mouseout
	*========================================*/		
	$('.like_login_required').mouseout(function() {			
		$(this).next('.rx_tooltip').remove();
	});

	$(document).on('change', '#non-logged-rx-upload-video', function(){
		
		let file_data   = $(this).prop('files')[0];
		let file_size   = $(this).prop('files')[0].size/1024/1024;				
		if(file_size>5){
			$('.rx-video-field').find('p.rx-guest-attachment-error').html(rx_ajax_data.rx_max_file_size);
		} else {
			let rx_video 	= new FormData();
			rx_video.append('file', file_data);
			rx_video.append('action', 'rx_guest_review_video');
			rx_video.append('security', rx_ajax_data.ajax_nonce);
			$('.rx-video-field').find('div.rx_image_upload_spinner').show();
			$.ajax({
				url: rx_ajax_data.ajax_url,
				contentType: false,
				processData: false,
				type: 'post',
				data: rx_video,
				success: function (data) {
					if( data.message != '' ) {
						$('.rx-video-field').find('p.rx-guest-attachment-error').text(data.message);
					} else {
						if( data.url != '' ) {
							$("#rx-video-url").val(data.url)
							$("#rx-show-video-preview").attr("href",data.url);
							$("#rx-show-video-preview").show();
						}
						$("#rx-self-video").show();
						$("#rx-external-video-url").hide();
			
						//Note show/hide
						$("#rx-note-self-video").show();
						$("#rx-note-external-video").hide();
					}
					$('.rx-video-field').find('div.rx_image_upload_spinner').hide();
				},
				error:function(error){
					$('.rx-video-field').find('div.rx_image_upload_spinner').hide();
				}
			});
		} 
		
	});

})( window.jQuery, document );

/*========================================
* Video uploader
*========================================*/	
function rx_upload_video() {
	let media_uploader = wp.media({
		frame:    "video",
		state:    "add-video-source",
	});

	media_uploader.on("add-source", function(){
		let video_url = media_uploader.state().media.attachment.attributes.url;
		document.getElementById("rx-video-url").value = video_url;
		jQuery("#rx-show-video-preview").show();
		jQuery("#rx-show-video-preview").attr("href", video_url)
		media_uploader.close();
	});
	media_uploader.open();
}

/*========================================
* Edit video uploader
*========================================*/	
function rx_edit_upload_video() {
	let media_uploader = wp.media({
		frame:    "video",
		state:    "add-video-source",
	});
	media_uploader.on("add-source", function(){
		let video_url = media_uploader.state().media.attachment.attributes.url;
		document.getElementById("rx-edit-video-url").value = video_url;
		jQuery("#rx-edit-video-preview").show();
		jQuery("#rx-edit-video-preview").attr("href", video_url)
		media_uploader.close();	
	});
	media_uploader.open();	
}