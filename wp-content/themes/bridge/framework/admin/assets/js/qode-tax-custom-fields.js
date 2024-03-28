(function($){
    $(document).ready(function () {
        qode_tax_media_upload('.qode-tax-media-add.button');
        qode_tax_media_remove('.qode-tax-media-remove.button');
        qodeInitTaxColorpicker();
        qodefInitSelectChange();
	    qodefInitTermIconSelectChange();
        qodefSelect2();
    });

    // Thanks: http://stackoverflow.com/questions/15281995/wordpress-create-category-ajax-response
    //remove all thumbs after edit/save taxonomy
    $(document).ajaxComplete(function(event, xhr, settings) {
        if (settings.data) {
            var queryStringArr = settings.data.split('&');
            if ($.inArray('action=add-tag', queryStringArr) !== -1) {
                var xml = xhr.responseXML;
                $response = $(xml).find('term_id').text();
                if ($response != "") {
                    // Clear the thumb image
                    $('.qode-tax-image-wrapper').html('');
                    $('.qode-taxonomy-color-field').val('');
                    $('.qode-taxonomy-color-field').parents('.wp-picker-container').find('.wp-color-result').removeAttr('style');

                }
            }
        }
    });

    function qode_tax_media_upload(button_class) {
        var _custom_media = true,
            _orig_send_attachment = wp.media.editor.send.attachment;
        $('body').on('click', button_class, function(e) {
            var $this = $(this);
            var parent = $this.closest('.form-field');
            _custom_media = true;
            wp.media.editor.send.attachment = function(props, attachment){
                if ( _custom_media ) {
                    if (attachment.sizes.thumbnail !== undefined){
                        attachment_url = attachment.sizes.thumbnail.url;
                    } else {
                        attachment_url = attachment.sizes.full.url;
                    }
                    parent.find('.qode-tax-custom-media-url').val(attachment.id);
                    parent.find('.qode-tax-image-wrapper').html('<img class="custom_media_image" src="" style="margin:0;padding:0;max-height:100px;float:none;" />');
                    parent.find('.qode-tax-image-wrapper .custom_media_image').attr('src',attachment_url).css('display','block');
                } else {
                    return _orig_send_attachment.apply( button_class, [props, attachment] );
                }
            }
            wp.media.editor.open(button_class);
            return false;
        });
    }

    function qode_tax_media_remove(button_class) {
        $('body').on('click', button_class,function(){
            var $this = $(this);
            var parent = $this.closest('.form-field');
            var image = parent.find('.qode-tax-custom-media-url');
            var editTax = $this.parents('#edittag');
            var addTag = $this.parents('#addtag');
            var wpNonce;

            /** Make sure the user didn't hit the button by accident and they really mean to delete the image **/
            if( image.val() !== '' && confirm( 'Are you sure you want to delete this file?' ) ) {
            	if(editTax.length){
		            wpNonce = editTax.find('#_wpnonce').val();
	            } else if(addTag.length) {
		            wpNonce = addTag.find('#_wpnonce_add-tag').val();
	            }

                var result = $.ajax({
                    url: '/wp-admin/admin-ajax.php',
                    type: 'GET',
                    data: {
                        action: 'bridge_qode_tax_del_image',
                        term_id: $this.data('termid'),
                        taxonomy: $this.data('taxonomy'),
                        field_name: image.attr('name'),
	                    delete_tax_nonce: wpNonce
                    },
                    dataType: 'text'
                });

                result.success( function( data ) {
                    $('#qode-uploaded-image').remove();
                });
                result.fail( function( jqXHR, textStatus ) {
                    console.log( "Request failed: " + textStatus );
                });

                image.val('');
                parent.find('.qode-tax-image-wrapper').html('<img class="custom_media_image" src="" style="margin:0;padding:0;max-height:100px;float:none;" />');
            }

        });
    }

    function qodeInitTaxColorpicker() {
        if ($('.qode-taxonomy-color-field').length) {
            $('.qode-taxonomy-color-field').wpColorPicker({
                change: function (event, ui) {
                    $('.qodef-input-change').addClass('yes');
                }
            });
        }
    }

    function qodefInitSelectChange() {
        var selectBox = $('select.dependence');

        selectBox.each(function() {
            initialHide($(this), this);
        });

        selectBox.on('change', function (e) {
            initialHide($(this), this);
        });

        function initialHide(selectField, selectObject) {
            var valueSelected = selectObject.value.replace(/ /g, '');
            $(selectField.data('hide-'+valueSelected)).closest('.form-field').fadeOut();
            $(selectField.data('show-'+valueSelected)).closest('.form-field').fadeIn();
        }
    }

    function qodefSelect2() {
        var holder = $('select.qodef-select2');

        if (holder.length) {
            holder.select2({
                allowClear: true
            });
        }
    }


	function qodefInitTermIconSelectChange() {
		$(document).on('change', 'select.dependence', function (e) {
			var valueSelected = this.value.replace(/ /g, '');

			$('.form-field.qode-icon-collection-holder').fadeOut();
			$('.form-field[data-icon-collection="' + valueSelected + '"]').fadeIn();
		});
	}


})(jQuery);