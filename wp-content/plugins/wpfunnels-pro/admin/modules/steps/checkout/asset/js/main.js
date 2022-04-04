(function($) {
    'use strict';
    /**
     * All of the code for your admin-facing JavaScript source
     * should reside in this file.
     *
     * Note: It has been assumed you will write jQuery code here, so the
     * $ function reference has been prepared for usage within the scope
     * of this function.
     *
     * This enables you to define handlers, for when the DOM is ready:
     *
     * $(function() {
     *
     * });
     *
     * When the window is loaded:
     *
     * $( window ).load(function() {
     *
     * });
     *
     * ...and/or other possibilities.
     *
     * Ideally, it is not considered best practise to attach more than a
     * single DOM-ready or window-load handler for a particular page.
     * Although scripts in the WordPress core, Plugins and Themes may be
     * practising this, we should strive to set a better example in our own work.
     */

    jQuery(document).ready(function() {
        /**
         * edit-field settings tab
         *
         * @since 1.0.0
         */
        $('.edit-field-settings__single-tab-content:first-child').show();

        $('.edit-field-settings__tab-nav a').on('click', function(e) {
            e.preventDefault();
            var dataID = $(this).attr('href');

            $(this).parent('li').addClass('active').siblings().removeClass('active');
            $(this).parents('.checkout-edit-field-tab__content-wrapper').find(dataID).show();
            $(this).parents('.checkout-edit-field-tab__content-wrapper').find(dataID).siblings().hide();
        });


        /**
         * add new checkout field drawer
         *
         * @since 1.0.0
         */
        $('.add-new-checkout-field-btn').on('click', function(e) {
            e.preventDefault();
            $(this).parents('.checkout-edit-field-tab__content-wrapper').find('.add-checkout-field-wrapper').addClass('show-drawer');
        });

        $('.add-checkout-field-close').on('click', function(e) {
            e.preventDefault();
            $(this).parents('.add-checkout-field-wrapper').removeClass('show-drawer');
        });


        /**
         * edit checkout field drawer
         *
         * @since 1.0.0
         */
        // $('button.edit-field').on('click', function(e) {
        $(document).on("click", "button.edit-field", function(e) {
            e.preventDefault();
            $(this).parents('.checkout-edit-field-tab__content-wrapper').find('.edit-checkout-field-wrapper').addClass('show-drawer');
        });

        $('.add-checkout-field-close').on('click', function(e) {
            e.preventDefault();
            $(this).parents('.edit-checkout-field-wrapper').removeClass('show-drawer');
        });

        /**
         * show edit field type options
         *
         * @since 1.0.0
        */
        $('.wpfnl-edit-field-type').on('change', function(e) {
            e.preventDefault();
            var thisVal = $(this).val();

            if( thisVal == 'select' ){
                $(this).parents('.field-body').find('.field-type-options').show();
            } else {
                $(this).parents('.field-body').find('.field-type-options').hide();
            }
        });
    });

        jQuery(document).ready(function() {
            var selectedType = $('.wpfnl-edit-field-type').val();

            if( selectedType == 'select' ){
                $('.wpfnl-edit-field-type').parents('.field-body').find('.field-type-options').show();
            } else {
                $('.wpfnl-edit-field-type').parents('.field-body').find('.field-type-options').hide();
            }

        });

    jQuery(document).ready(function() {
        $('.wpfnl_muliple_select').select2();
        /**
         * get and show billing fields
         * @since 1.0.1
         */
        var stepId = window.CheckoutEditor.stepId;
        var billingFields = window.CheckoutEditor.billingFields;
        var shippingFields = window.CheckoutEditor.shippingFields;
        var additionalFields = window.CheckoutEditor.additionalFields;
        var unique_id ='';
        
        // show_additional_field();

        /**
         * add option field as you need when add checkout field
         * @since 1.0.0
         */
        var i = 2;
        $('.wpfnl_add_option').click(function(e) {
            e.preventDefault();
            i++;
            $('.dynamic_option').append('<div class="wpfnl-fields" id="row' + i + '"><input type="text" value="" name="wpfnl_edit_type_option[]" id="wpfnl_edit_type_option" /><button class="btn-default remove wpfnl_btn_remove" id="' + i + '" title="Remove"><svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.1667 1.72266L1.72223 11.1671" stroke="#842029" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1.72223 1.72266L11.1667 11.1671" stroke="#842029" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>');
        });

        /**
         * remove option field as you need
         */
        $(document).on('click', '.wpfnl_btn_remove', function(e) {
            e.preventDefault();
            var button_id = $(this).attr("id");
            $("#row" + button_id + "").remove();
        });

        /**
         * add checkout field
         * @since 1.0.0
         */
        $('.custom_checkout_add_field').click(function() {
            var id = $(this).data('id');
            if (id == 'additional') {
                $("#wpfnl_name").val("additional_")
                $(".wpfnl_id").val("additional_")
                $("#hidden_field_add").val(id)

            }
            if (id == 'billing') {
                $("#wpfnl_name").val("billing_")
                $(".wpfnl_id").val("billing_")
                $("#hidden_field_add").val(id)
            }
            if (id == 'shipping') {
                $("#wpfnl_name").val("shipping_")
                $(".wpfnl_id").val("shipping_")
                $("#hidden_field_add").val(id)
            }

        });

        /**
         * edit checkout field
         * @since 1.0.0
         */
        // $(document).on("click", ".wpfnl_edit_row", function() {

        //         var id = $(this).data('id');
        //         var type = $(this).data('type');
        //         var parent_id = $(this).parent();
        //         unique_id = $(parent_id).parent().attr("id");

        //         var payload = {
        //             type: type,
        //             data: id,
        //             billing_fields: billingFields,
        //             shipping_fields: shippingFields,
        //             additional_fields: additionalFields,
        //         };

        //         wpAjaxHelperRequest("wpfnl-edit-row", payload)
        //                 .success(function(data) {
        //                     var jsonData = JSON.parse(data);
        //                     var index;
        //                     if (jsonData.index != 'custom') {
        //                         $(".wpfnl_edit_type").prop("disabled", true);
        //                         $("#wpfnl_edit_name").prop("disabled", true);
        //                         $(".wpfnl_add_edit_option").hide();
        //                         index = 'default';

        //                     } else {
        //                         $(".wpfnl_edit_type").prop("disabled", false);
        //                         $(".wpfnl_edit_name").prop("disabled", false);
        //                         index = 'custom';

        //                     }

        //                     $('.wpfnl_edit_type').val(jsonData.data.type);
        //                     $('#wpfnl_edit_name').val(id);
        //                     $('#wpfnl_hidden_array_index').val(id);
        //                     $('#wpfnl_edit_label').val(jsonData.data.label);
        //                     $('#wpfnl_edit_placeholder').val(jsonData.data.placeholder);
        //                     $('#wpfnl_edit_default').val(jsonData.data.default);
        //                     $('#wpfnl_edit_id').val(jsonData.data.id);
        //                     $('#wpfnl_hidden_value').val(index);
        //                     $('#wpfnl_hidden_index').val(id);
        //                     $('#wpfnl_hidden_type').val(type);

        //                     if(jsonData.data.validate){
        //                         var validate_arr = jsonData.data.validate;
        //                         for(var i=0 ;i<validate_arr.length;i++ ){
        //                             $('.edit_validation_select').val(jsonData.data.validate[i]).trigger('change');
        //                         }
        //                     }
        //                     if (jsonData.data.required == true) {
        //                         $(".wpfnl_edit_required").prop("checked", true);
        //                     } else {
        //                         $(".wpfnl_edit_required").prop("checked", false);
        //                     }
        //                     if (jsonData.data.show == 1) {
        //                         $(".wpfnl_edit_show").prop("checked", true);
        //                     } else {
        //                         $(".wpfnl_edit_show").prop("checked", false);
        //                     }
        //                     if (jsonData.data.enable == 1) {
        //                         $(".wpfnl_edit_enable").prop("checked", true);
        //                     } else {
        //                         $(".wpfnl_edit_enable").prop("checked", false);
        //                     }

        //                     var option_text = jsonData.data.option_text;
        //                     var option_value = jsonData.data.option_value;
        //                     if (option_value) {
        //                         length = option_value.length;
        //                     }
        //                     if( "select" == jsonData.data.type || "radio" == jsonData.data.type){
        //                         $('.wpfnl-edit-field-type').parents('.field-body').find('.field-type-options').show();
        //                     }else{
        //                         $('.wpfnl-edit-field-type').parents('.field-body').find('.field-type-options').hide();
        //                     }
        //                     if (option_value) {
        //                         if (length > 0 && option_value[0] != '') {
        //                             $('.edit_field_option').remove();

        //                             for (var i = 0; i < option_text.length; i++) {
        //                                 var field = '<div class="wpfnl-fields edit_field_option" id="row' + i + '"><input type="text" value="' + option_value[i] + '" name="wpfnl_edit_type_option[]" id="wpfnl_edit_type_option" /><button class="btn-default remove wpfnl_btn_remove" id="' + i + '" title="Remove"><svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.1667 1.72266L1.72223 11.1671" stroke="#842029" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1.72223 1.72266L11.1667 11.1671" stroke="#842029" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>'
        //                                 $('.dynamic_option_edit').append(field);
        //                             }
        //                         }
        //                     }

        //                 })
        //                 .error(function(response) {

        //                 });
        //     })


        /**
         * Checkout Edit Field delete alert
         *
         * @since 1.0.0
         */
        // $(document).on("click", ".delete-checkout-field", function() {
        //     $('.wpfnl-delete-alert-wrapper').css('display', 'flex');
        //     var index = $(this).data('id');
        //     var type = $(this).data('type');
        //     var parent_id = $(this).parent();
        //     var parents_id = $(parent_id).parent();
        //     var payload = {
        //         data: index,
        //         type: type,
        //         billing_fields:billingFields,
        //         shipping_fields:shippingFields,
        //         additional_fields:additionalFields,
        //         step_id:stepId
        //     };

        //     $(document).on("click", ".wpfnl-delete-confirm-btn .yes", function() {
        //         wpAjaxHelperRequest("wpfnl-delete-row", payload)
        //             .success(function(data) {
        //                 $('.wpfnl-delete-alert-wrapper').hide();
        //                 $(parents_id).remove();
        //             })
        //     });
        // });

        $(document).on("click", ".wpfnl-delete-confirm-btn .cancel", function() {
            $('.wpfnl-delete-alert-wrapper').hide();
        });


        /**
         * Restore to deafult checkout field for each section
         * @since 1.0.0
         */
        // $('.wpfnl_restore_btn').click(function() {
        //     var payload = {
        //         data: $(this).data('id'),
        //         billing_fields:billingFields,
        //         shipping_fields:shippingFields,
        //         additional_fields:additionalFields,
        //         step_id:stepId
        //     };
        //     var thisAlert = $(this).parents('.restore-btn').find('.wpfnl-alert');
        //     var thisLoader = $(this).parents('.restore-btn').find('.wpfnl-loader');
        //     thisLoader.css('display', 'inline-block');

        //     wpAjaxHelperRequest("wpfnl-restore-default", payload)
        //         .success(function(data) {
        //             thisAlert.text('Successfully Restored').addClass('wpfnl-success').fadeIn();
        //             thisLoader.hide();

        //             if('billing_success' == data){
        //                 show_billing_field();
        //                 setTimeout(function() {
        //                     thisAlert.fadeOut().text('').removeClass('wpfnl-success');
        //                 }, 2000);
        //             }
        //             if('shipping_success' == data){
        //                 show_shipping_field();
        //                 setTimeout(function() {
        //                     thisAlert.fadeOut().text('').removeClass('wpfnl-success');
        //                 }, 2000);
        //             }
        //             if('additional_success' == data){
        //                 show_additional_field();
        //                 setTimeout(function() {
        //                     thisAlert.fadeOut().text('').removeClass('wpfnl-success');
        //                 }, 2000);
        //             }


        //         })
        // });


        /**
         * wpfnl_change_required
         * change required option of each checkout field
         * @since 1.0.0
         */

        $(document).on("click", ".wpfnl_change_required", function() {
            var id = $(this).data('id');
            var type = $(this).data('type');
            var payload = {
                id:id,
                type:type,
                billing_fields:billingFields,
                shipping_fields:shippingFields,
                additional_fields:window.CheckoutEditor.additionalFields,
                step_id:stepId
            }
            wpAjaxHelperRequest("wpfnl-change-required-edit-field", payload)
                    .success(function() {
                    })
        })

        /**
         * wpfnl_change_enable
         * change enable option of each checkout field
         * @since 1.0.0
         */

        

        /**
         * wpfnl_submit
         * Add field for each section
         * @since 1.0.0
         */
        // $(document).on("click", ".wpfnl_submit", function(e) {
        //     e.preventDefault();
        //     e.stopPropagation();
        //     var thisAlert = $(this).parents('.field-footer').find('.wpfnl-alert');
        //     var thisLoader = $(this).parents('.field-footer').find('.wpfnl-loader');
        //     thisLoader.css('display', 'inline-block');
        //     var fields = $('.add_field_form').serialize();
        //     var payload =
        //     {
        //        fields: fields,
        //        billing_fields: billingFields,
        //        shipping_fields: shippingFields,
        //        additional_fields: additionalFields,
        //        step_id:stepId
        //     }
        //     wpAjaxHelperRequest("wpfnl-add-field", payload)
        //     .success(function(data) {
        //         $('.wpfnl_name').val('');
        //         $('.wpfnl_label').val('');
        //         $('.wpfnl_placeholder').val('');
        //         $('.wpfnl_default').val('');
        //         $('.wpfnl_validation').val('');
        //         $('.wpfnl_required').val('');
        //         $('.wpfnl_enable').val('');
        //         $('.wpfnl_show').val('');
        //         $('.wpfnl_edit_type_option').val('');

        //         thisAlert.text('Successfully Saved').addClass('wpfnl-success').fadeIn();
        //         thisLoader.hide();
        //         if('success' == data){
        //             show_additional_field();
        //             show_billing_field();
        //             show_shipping_field();
        //         }
        //         setTimeout(function() {
        //             thisAlert.fadeOut().text('').removeClass('wpfnl-success');
        //         }, 2000);
        //     })
        // })

        /**
         * wpfnl_edit_submit
         * Edit field for each section
         * @since 1.0.0
         */
        $(document).on("click", ".wpfnl_edit_submit", function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('.wpfnl-loader').css('display','inline-block');
            var fields = $('.edit_field_form').serialize();
            var payload = {
                fields:fields,
                billing_fields: billingFields,
                shipping_fields: shippingFields,
                additional_fields: additionalFields,
                step_id:stepId
            }
            wpAjaxHelperRequest("wpfnl-edit-field", payload)
                    .success(function(data) {   
                        $('#'+unique_id).children('.field-label').text($('#wpfnl_edit_label').val())
                        $('#'+unique_id).children('.field-type').text($('.wpfnl_edit_type').val())
                        $('#'+unique_id).children('.field-name').text($('#wpfnl_edit_name').val())
                        $('#'+unique_id).children('.field-placeholder').text($('#wpfnl_edit_placeholder').val())

                        if($(".wpfnl_edit_required").prop("checked") == true){
                            $('#'+unique_id).children('.field-required').children('.wpfnl-switcher').children('.wpfnl_change_required').prop("checked",true)
                        }else{
                            $('#'+unique_id).children('.field-required').children('.wpfnl-switcher').children('.wpfnl_change_required').prop("checked",false)
                        }
                        if($(".wpfnl_edit_enable").prop("checked") == true){
                            $('#'+unique_id).children('.field-required').children('.wpfnl-switcher').children('.wpfnl_change_enable').prop("checked",true)
                        }else{
                            $('#'+unique_id).children('.field-required').children('.wpfnl-switcher').children('.wpfnl_change_enable').prop("checked",false)
                        }

                        var validations = [];
                        $('.edit_validation_select').each(function() {
                            validations.push($(this).val());
                        });
                        $('#'+unique_id).children('.field-validation').text(validations.toString());
                        $('.wpfnl-alert').text('Successfully Updated').addClass('wpfnl-success').fadeIn();
                        $('.wpfnl-loader').css('display','none');
                        setTimeout(function() {
                            $('.wpfnl-alert').fadeOut().text('').removeClass('wpfnl-success');
                        }, 2000);
                    })
        })
    })
})(jQuery);
