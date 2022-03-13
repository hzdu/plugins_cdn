jQuery(document).ready(function($) {
//"use strict";
//alert('hey');
	var $container = $('.tw-tab-main-wrap');

    $('.tw-color-picker').wpColorPicker();
    $('.tw-icon-picker').iconPicker();
    
    $('.tw-backend-settings .tw-ns-active').niceSelect();
    $('.tw_individual_product_settings .tw-ns-active').niceSelect();
    $('.tw-each-tab-column .tw-ns-active').niceSelect();
    $('.tw-main-settings-wrapper .tw-ns-active').niceSelect();
    $('.tw-each-tab-column .tw-ns-ajax-active').niceSelect();

	$container.on('click', '.tw-add-tab-button', function(e){
        var $this = $(this),
        $parent = $this.closest('.tw-tab-main-wrap').find('.tw-add-tab-wrap'),
        action = $this.data('action'),
        append_div = $parent.find('.tw-add-append-wrap');

        $('.tw-loader-image').show();
 
        $.ajax({
            url : tw_backend_js_obj.ajax_url,
            type : 'post',
            data : {
                action : 'tw_add_tab',
                _wpnonce : tw_backend_js_obj.ajax_nonce
                },
            success : function( response ) {
                append_div.append(response);
                $('.tw-add-tab-wrap .tw-color-picker').wpColorPicker();
                $('.tw-add-tab-wrap .tw-icon-picker').iconPicker();
                $('.tw-loader-image').hide();
            }
        });
    });

    $('.tw-tab-sort').css('cursor', 'pointer');
    $('.tw-item-header').css('cursor', 'pointer');
    $('.tw-add-append-wrap').sortable({
        items: '.tw-each-tab-column',
        handle: '.tw-item-header'
    });

    $container.on('keyup','.tw_label_class', function(){
        var currentText = $(this).val();
        $(this).closest('.tw-each-tab-column').find(".tw_label_keyup").text(currentText);
    });

    $('body').on('click', '.tw-tab-delete', function () {
        var del = tw_backend_js_obj.delete_message;
        if (confirm(del)) {
            $(this).closest('.tw-each-tab-column').fadeOut(500, function () {
                $(this).remove();
            });
        }
    });

    $('ul.tw-nav-tabs li').click(function () {
        var tab_id = $(this).attr('data-id');
        $('ul.tw-nav-tabs li').removeClass('tw-active');
        $(this).addClass('tw-active');
        $('.tw-tab-content').hide().removeClass('tw-tab-content-active');
        $("#" + tab_id).show().addClass('tw-tab-content-active');
    });

    $('body').on('click', '.tw-item-header-title,.tw-tab-hide-show', function () {
        $(this).closest('.tw-tab-item-inner').find('.tw-tab-item-options').slideToggle('slow', function () {
            $(this).closest('.tw-tab-item-inner').find('.tw-tab-hide-show').toggleClass('tw-active', $(this).is(':visible'));
            $(this).closest('.tw-each-tab-column').toggleClass('tw-active-column');
        });
    });

        /*
         * Enable Tab Description 
         */
        $container.on('change', '.tw-show-description', function () {
            if ($(this).prop('checked') == true) {
                $(this).closest('.tw-each-tab-column').find('.tw-enable-description-options').slideDown('slow');
            } else {
                $(this).closest('.tw-each-tab-column').find('.tw-enable-description-options').slideUp('slow');
            }
        });

        $container.on('change', '.tw-tab_icon-type', function () {
            var icon_type = $(this).val();
            if (icon_type == 'available_icon') {
                $(this).closest('.tw-each-tab-column').find('.tw_selection_icontype_wrapper .tw_available_icon').fadeIn();
                $(this).closest('.tw-each-tab-column').find('.tw_selection_icontype_wrapper .tw_upload_own_icon').fadeOut();
            } else if (icon_type == 'upload_own') {
                $(this).closest('.tw-each-tab-column').find('.tw_selection_icontype_wrapper .tw_upload_own_icon').fadeIn();
                $(this).closest('.tw-each-tab-column').find('.tw_selection_icontype_wrapper .tw_available_icon').fadeOut();
            } else {
                $(this).closest('.tw-each-tab-column').find('.tw_selection_icontype_wrapper .tw_upload_own_icon').fadeOut();
                $(this).closest('.tw-each-tab-column').find('.tw_selection_icontype_wrapper .tw_available_icon').fadeOut();
            }
        });
        
        $container.on('change', '.tw-tab_components-type', function () {
            var comp_type = $(this).val();
            var id = $(this).attr('id');
            var splitid = id.split('_');
            $(this).closest('.tw-each-tab-column').find('.tw_compontents_wrapper .tw_tab_comp').hide();

            if (comp_type == "editor") {
                $('#editor_' + splitid[1]).slideDown('slow');
            } else if (comp_type == "external_shortcode") {
                $('#external_shortcode_' + splitid[1]).slideDown('slow');
            } else if (comp_type == "product") {
                $('#product_' + splitid[1]).slideDown('slow');
            } else if (comp_type == "download") {
                $('#download_' + splitid[1]).slideDown('slow');
            } else if (comp_type == "photo_gallery") {
                $('#photo_gallery_' + splitid[1]).slideDown('slow');
            } else if (comp_type == "video_gallery") {
                $('#video_gallery_' + splitid[1]).slideDown('slow');
            } else if (comp_type == "custom_link") {
                $('#custom_link_' + splitid[1]).slideDown('slow');
            } else if (comp_type == "map") {
                $('#map_' + splitid[1]).slideDown('slow');
            } else if (comp_type == "faq") {
                $('#faq_' + splitid[1]).slideDown('slow');
            }
        });

        $('body').on('change', '.tw-select-layout', function () {
            var type = $(this).val();
            $(this).closest('.tw-options-wrap').find('.tw-layout').hide();
            $(this).closest('.tw-options-wrap').find('.tw-' + type).show();
        });

        $('body').on('change', '.tw-assign-to', function () {
            var type = $(this).val();
            $(this).closest('.tw-each-tab-column').find('.tw-assign').hide();
            $(this).closest('.tw-each-tab-column').find('.tw-' + type).show();
        });

        $('body').on('change', '.tw-cat', function () {
            var type = $(this).val();
            if (type=="specific"){
                $(this).closest('.tw-each-tab-column').find('.tw-cat-show').show();
            }else{
                $(this).closest('.tw-each-tab-column').find('.tw-cat-show').hide();
            }
        });

        $('body').on('change', '.tw-show-content', function () {
            if ($(this).val() == 'yes'){
                $(this).closest('.tw_product_type_cat').find('.tw-excerpt-length').show();
            } else{
                $(this).closest('.tw_product_type_cat').find('.tw-excerpt-length').hide();
            }
        });

        $('body').on('change', '.tw-pro', function () {
            var type = $(this).val();
            if (type == "specific"){
                $(this).closest('.tw-each-tab-column').find('.tw-pro-show').show();
            }else{
                $(this).closest('.tw-each-tab-column').find('.tw-pro-show').hide();
            }
        });

        $('body').on('change', '.tw-tab-width', function () {
            var type = $(this).val();
            if (type=="2"){
                $(this).closest('.tw-tab-cbody').find('.tw-width-value').show();
            }else{
                $(this).closest('.tw-tab-cbody').find('.tw-width-value').hide();
            }
        });

        $('body').on('click', '.tw_product_type', function () {
            var type = $(this).val();
            if (type=="category"){
                $(this).closest('.tw-options-wrap').find('.tw_product_type_cat').show();
            }else{
                $(this).closest('.tw-options-wrap').find('.tw_product_type_cat').hide();
            }
        });

        $('body').on('change', '.tw_orientation_type', function () {
            var type = $(this).val();
            $('.tw-orient').hide();
            if (type=="horizontal"){
                $('.tw-o-horizontal').show();
            }else{
                $('.tw-o-vertical').show();
            }
        });

        $('body').on('change', '.tw-video-select-option', function () {
            var type = $(this).val();

            $(this).closest('.tw-video-gallery-wrapper').find('.tw-video').hide();
            if (type=="youtube"){
                $(this).closest('.tw-video-gallery-wrapper').find('.tw-youtube').show();
            }else{
                $(this).closest('.tw-video-gallery-wrapper').find('.tw-viemo').show();
            }
        });
   
        $('body').on('click', '.tw-add-faq-block', function () {
            var key = $(this).data('key');
            var type = $(this).data('type');

            if (type == 'tab-component'){
                var html = '<div class="tw-faq-wrap">'+
                            '<div class="tw-faq-inner-wrap">'+
                                '<span class="tw-drag fa fa-arrows"></span>'+
                                '<a href="javascript:void(0)" class="tw-faq-remover"> <i class="fa fa-trash"></i> </a>'+
                                '<div class="tw-faq-question">'+
                                    '<input type="text" name="tab_set_items[tab][' + key + '][faq][question][]" value="">'+
                                '</div>'+
                                '<div class="tw-faq-answer">'+
                                    '<textarea name="tab_set_items[tab][' + key + '][faq][answer][]" ></textarea>'+
                                '</div>'+
                            '</div>'+
                            
                        '</div>';
                        
            }else{
                var html ='<div class="tw-faq-wrap">'+
                            '<div class="tw-faq-inner-wrap">'+
                            '<span class="tw-drag fa fa-arrows"></span>'+
                            '<a href="javascript:void(0)" class="tw-faq-remover"> <i class="fa fa-trash"></i> </a>'+
                            '<div class="tw-faq-question">'+
                                '<input type="text" name="single_product_settings[faq][question][]" value="">'+
                            '</div>'+
                            '<div class="tw-faq-answer">'+
                                '<textarea name="single_product_settings[faq][answer][]" ></textarea>'+
                            '</div>'+
                            '</div>'+
                            
                        '</div>';
            }

            console.log(html);
                $(this).closest('.tw_options_wrap').find('.tw-faq-wrapper').append(html);
                $('.tw-faq-wrapper').find('.tw-faq-wrap').last().find('input[type="text"]').first().focus();
            
        });

        // for making the faq inside the element sortable
        $('.tw-drag').css('cursor', 'pointer');
        $('.tw-faq-inner-wrap').css('cursor', 'pointer');
        $('.tw-faq-wrapper').sortable({
            items: '.tw-faq-wrap',
            handle: '.tw-faq-inner-wrap'
        });

        // for deleting faq inside the element sortable
        $('body').on('click', '.tw-faq-remover', function () {
            var del = tw_backend_js_obj.delete_message;
            if (confirm(del)) {
                $(this).closest('.tw-faq-wrap').fadeOut(500, function () {
                    $(this).remove();
                });
            }
        });

        $container.on('click', '.tw-upload-icon-btn', function (e) {
            e.preventDefault();
            var $this = $(this);
            var image = wp.media({
                title: 'Upload Icon',
                multiple: false
            }).open()
                .on('select', function (e) {
                    var uploaded_icon = image.state().get('selection').first();
                    var img_url = uploaded_icon.toJSON().url;
                    $($this).closest('.tw-field-wrap').find('.tw-image-url').val(img_url);
                    $($this).closest('.tw-field-wrap').find('.tw-iconpreview img').attr('src', img_url);
                });
        });

        // Code for Photo Gallery

        $('body').on('click', '.tw-upload-gallery-btn', function (e) {
            e.preventDefault();
            var $this = $(this);
            var key = $(this).data('key');
            var type = $(this).data('type');
            var image = wp.media({
                title: 'Upload Images',
                multiple: true
            }).open()
                .on('select', function (e) {
                    var uploaded_image = image.state().get('selection');
                    uploaded_image.map(function(attachment) {
                        attachment = attachment.toJSON();
                        console.log(attachment);

                        var image_id = attachment.id;
                        var image_url = attachment.url;
                        var data = {
                                'action': 'tw_multi_upload_image',
                                '_wpnonce': tw_backend_js_obj.ajax_nonce,
                                'image_url': image_url,
                                'image_id': image_id,
                                'key':key,
                                'type':type
                            };
                        
                        $.ajax({
                            url: tw_backend_js_obj.ajax_url,
                            data: data,
                            type: "POST",
                            success: function(response) {
                                console.log(response);
                                $this.closest(".tw_options_wrap").find(".tw-uploaded-gallery-items").append(response);
                            }
                        });
                    });
                });
        });

        $('body').on('click', '.tw-delete-gallery-item', function() {
            var delete_picture = confirm('Are you sure you want to delete this image?');
            if (delete_picture) {
                $(this).closest('.tw-gallery-item-preview').fadeOut(500, function() {
                    $(this).remove();
                });
            }
        });

        $('.tw-move-gallery-item').css('cursor', 'pointer');
        $('.tw-inner-gallery-item-preview').css('cursor', 'pointer');
        $('.tw-uploaded-gallery-items').sortable({
            items: '.tw-gallery-item-preview',
            handle: '.tw-inner-gallery-item-preview'
        });

        // End Code For Photo Gallery

        // Code for Download Component
        
        $('body').on('click', '.tw-upload-download-btn', function (e) {

            e.preventDefault();
            var $this = $(this);
            var key = $(this).data('key');
            var type = $(this).data('type');
           // alert(type);
            var file = wp.media({
                title: 'Upload File',
                multiple: true
            }).open()
                .on('select', function (e) {
                    var uploaded_file = file.state().get('selection');
                    uploaded_file.map(function(attachment) {
                        attachment = attachment.toJSON();
                        console.log(attachment);

                        var file_id = attachment.id;
                        var file_url = attachment.url;
                        var file_name = attachment.filename;
                        var data = {
                                'action': 'tw_multi_upload_file',
                                '_wpnonce': tw_backend_js_obj.ajax_nonce,
                                'file_url': file_url,
                                'file_id': file_id,
                                'file_name': file_name,
                                'key': key,
                                'type': type
                            };
                        $.ajax({
                            url: tw_backend_js_obj.ajax_url,
                            data: data,
                            type: "POST",
                            success: function(response) {
                                console.log(response);
                                $this.closest(".tw_options_wrap").find(".tw-uploaded-files").append(response);
                            }
                        });
                    });
                });
        });

        $('body').on('click', '.tw-delete-item', function() {
            var delete_file = confirm('Are you sure you want to delete this file?');
            if (delete_file) {
                $(this).closest('.tw-downloadable-file-preview').fadeOut(500, function() {
                    $(this).remove();
                });
            }
        });

        $('.tw-move-item').css('cursor', 'pointer');
        $('.tw-inner-downloadable-file-preview').css('cursor', 'pointer');
        $('.tw-uploaded-files').sortable({
            items: '.tw-downloadable-file-preview',
            handle: '.tw-inner-downloadable-file-preview'
        });

        // End Code For Download Componenet

        // Start code for Product Component


        $('body').on('change', '.tw-select-taxonomy', function(e) {
        e.preventDefault();
            var select_tax = $(this).val();
            $.ajax({
                url: tw_backend_js_obj.ajax_url,
                data: {
                    select_tax: select_tax,
                    _wpnonce:  tw_backend_js_obj.ajax_nonce,
                    action: 'tw_selected_taxonomy_terms',
                    beforeSend: function() {
                        $(".tw-loader-preview").show();
                    }
                },
                type: "POST",
                success: function(response) {

                    console.log(response);
                    $(".tw-loader-preview").hide();
                    $(".tw-simple-taxonomy-term").html(response);
                    $('.tw-each-tab-column .tw-ns-ajax-active').niceSelect('destroy');
                    $('.tw-each-tab-column .tw-ns-ajax-active').niceSelect();
                }
            });
        });

        // End code for Product Component

        $( "#tw_search_product" ).autocomplete({
            source: function( request, response ) {
                var searchText = extractLast(request.term);
                addedProducts = $('.tw-product-append input');
                exclusion=[];
                for (j = 0; j<addedProducts.length ; j++){
                    exclusion.push(addedProducts[j].value);
                }
                console.log(exclusion);
                $.ajax({
                    url : tw_backend_js_obj.ajax_url,
                    type : 'post',
                    dataType: "json",
                    data : {
                        action : 'tw_search_product',
                        _wpnonce : tw_backend_js_obj.ajax_nonce,
                        search: searchText,
                        exclude: exclusion
                    },
                    success : function( data ) {
                        response( data );
                    }
                });
            },
            select: function( event, selected_item ) {
                console.log(selected_item);
                $('#tw_search_product').val(" ");
                var html = '<div class = "tw-ind-product">'+
                                '<span class="tw-pro-label">' +
                                    selected_item.item.label +
                                '</span>'+
                                '<span class="tw-del-pro">Delete</span>'+
                                '<input type="hidden" name="tab_set_items[assigned_to][product][]" value="'+ selected_item.item.value +'">' +
                            '</div>';

                $(this).closest('.tw-product').find('.tw-product-append').append(html);

                return false;           }
        });

        $('body').on('click', '.tw-del-pro', function() {
            var delete_file = confirm("Are you sure you don't want to assign this tab set to this particular product ?");
            if (delete_file) {
                $(this).closest('.tw-ind-product').fadeOut(500, function() {
                    $(this).remove();
                });
            }
        });


        function split( val ) {
           return val.split( /,\s*/ );
        }

        function extractLast( term ) {
           return split( term ).pop();
        }

        //Horizontal tab preview
        $(".tw-horizontal-template-preview").first().addClass("slider-active");
        $('.tw-hor-template').on('change', function() {
            var template_value = $(this).val();
            $('.tw-horizontal-template-preview').hide();
            $('#tw-hor-' + template_value).show();
        });
        if ($(".tw-hor-template option:selected").length > 0) {
            var list_view = $(".tw-hor-template option:selected").val();
            $('.tw-horizontal-template-preview').hide();
            $('#tw-hor-' + list_view).show();
        }

        //Vertical tab preview
        $(".tw-vertical-template-preview").first().addClass("slider-active");
        $('.tw-ver-template').on('change', function() {
            var template_value = $(this).val();
            $('.tw-vertical-template-preview').hide();
            $('#tw-ver-' + template_value).show();
        });
        if ($(".tw-ver-template option:selected").length > 0) {
            var list_view = $(".tw-ver-template option:selected").val();
            $('.tw-vertical-template-preview').hide();
            $('#tw-ver-' + list_view).show();
        }
});