/* global bya_admin_params, ajaxurl */

jQuery(function ($) {
    'use strict';

    var BYA_Admin = {
        init: function () {
            this.trigger_on_page_load();
            //Advanced Settings
            $(document).on('change', '#bya_advanced_allow_products', this.toggle_allow_products);
            $(document).on('change', '#bya_advanced_allow_users', this.toggle_allow_users);
            $(document).on('change', '#bya_advanced_allow_filter_btn', this.toggle_show_filter_button);
            //General Settings
            $(document).on('change', '#bya_general_show_buy_again_notice', this.toggle_buy_again_notice);
            // Localization Settings
            $(document).on('change', '#bya_localization_allow_product_image_col', this.toggle_allow_product_image_col);
            $(document).on('change', '#bya_localization_allow_product_name_col', this.toggle_allow_product_name_col);
            $(document).on('change', '#bya_localization_allow_product_price_col', this.toggle_allow_product_price_col);
            $(document).on('change', '#bya_localization_allow_product_quantity_col', this.toggle_allow_product_quantity_col);
            $(document).on('change', '#bya_localization_allow_action_col', this.toggle_allow_action_col);
            $(document).on('change', '#bya_localization_allow_add_to_cart_col', this.toggle_allow_add_to_cart_col);
            $(document).on('change', '#bya_advanced_buy_again_table_product_img_disp', this.toggle_image_disp_type);
            $(document).on('change', '#bya_localization_allow_order_count_col', this.toggle_display_order_count_col);
            $(document).on('change', '#bya_localization_allow_last_purchased_order_id_col', this.toggle_display_order_id_col);
            $(document).on('change', '#bya_localization_allow_stock_col', this.toggle_display_stock_count_col);

        }, trigger_on_page_load: function () {
            this.allow_products('#bya_advanced_allow_products');
            this.allow_users('#bya_advanced_allow_users');
            this.buy_again_notice('#bya_general_show_buy_again_notice');
            this.allow_add_to_cart_col('#bya_localization_allow_add_to_cart_col');
            this.allow_product_image_col('#bya_localization_allow_product_image_col');
            this.allow_product_name_col('#bya_localization_allow_product_name_col');
            this.allow_product_price_col('#bya_localization_allow_product_price_col');
            this.allow_product_quantity_col('#bya_localization_allow_product_quantity_col');
            this.allow_action_col('#bya_localization_allow_action_col');
            this.image_disp_type('#bya_advanced_buy_again_table_product_img_disp');
            this.show_filter_button_opt('#bya_advanced_allow_filter_btn');
            this.display_order_count_col('#bya_localization_allow_order_count_col');
            this.display_order_id_col('#bya_localization_allow_last_purchased_order_id_col');
            this.display_stock_count_col('#bya_localization_allow_stock_col');
        }, 

        toggle_show_filter_button: function(event){
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Admin.show_filter_button_opt($this);
        },show_filter_button_opt: function($this){
            if( true === $($this).prop('checked')){
                $('#bya_localization_allow_search_box').closest('tr').show();
                $('#bya_advanced_allow_filter_by').closest('tr').show();
            } else {
                $('#bya_localization_allow_search_box').closest('tr').hide();
                $('#bya_advanced_allow_filter_by').closest('tr').hide();
            }
        },
        
        toggle_allow_products: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Admin.allow_products($this);
        }, allow_products: function ($this) {
            $('.bya_allow_product_option').closest('tr').hide();
            if ($($this).val() === '2') {
                $('#bya_advanced_include_product').closest('tr').show();
            } else if ($($this).val() === '3') {
                $('#bya_advanced_exclude_product').closest('tr').show();
            } else if ($($this).val() === '4') {
                $('#bya_advanced_include_category').closest('tr').show();
            } else if ($($this).val() === '5') {
                $('#bya_advanced_exclude_category').closest('tr').show();
            }
        },
        
        toggle_allow_users: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Admin.allow_users($this);
        }, allow_users: function ($this) {
            $('.bya_allow_user_option').closest('tr').hide();
            if ($($this).val() === '2') {
                $('#bya_advanced_include_user').closest('tr').show();
            } else if ($($this).val() === '3') {
                $('#bya_advanced_exclude_user').closest('tr').show();
            } else if ($($this).val() === '4') {
                $('#bya_include_user_role').closest('tr').show();
            } else if ($($this).val() === '5') {
                $('#bya_exclude_user_role').closest('tr').show();
            }
        }, 
        
        toggle_buy_again_notice: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Admin.buy_again_notice($this);
        }, buy_again_notice: function ($this) {
            if (true == $($this).prop("checked")) {
                $('#bya_general_buy_again_message').closest('tr').show();
                $('#bya_general_order_detail_link_caption').closest('tr').show();
            } else {
                $('#bya_general_buy_again_message').closest('tr').hide();
                $('#bya_general_order_detail_link_caption').closest('tr').hide();
            }
        }, 
        
        toggle_allow_product_image_col: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Admin.allow_product_image_col($this);
        }, allow_product_image_col: function ($this) {
            if (true == $($this).prop("checked")) {
                $('#bya_localization_product_image_label').closest('tr').show();
            } else {
                $('#bya_localization_product_image_label').closest('tr').hide();
            }
        }, 
        
        toggle_allow_product_name_col: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Admin.allow_product_name_col($this);
        }, allow_product_name_col: function ($this) {
            if (true == $($this).prop("checked")) {
                $('#bya_localization_product_name_label').closest('tr').show();
            } else {
                $('#bya_localization_product_name_label').closest('tr').hide();
            }
        }, 

        toggle_allow_product_price_col: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Admin.allow_product_price_col($this);
        }, allow_product_price_col: function ($this) {
            if (true == $($this).prop("checked")) {
                $('#bya_localization_product_price_label').closest('tr').show();
            } else {
                $('#bya_localization_product_price_label').closest('tr').hide();
            }
        },
        
        toggle_allow_product_quantity_col: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Admin.allow_product_quantity_col($this);
        }, allow_product_quantity_col: function ($this) {
            if (true == $($this).prop("checked")) {
                $('#bya_localization_product_quantity_label').closest('tr').show();
            } else {
                $('#bya_localization_product_quantity_label').closest('tr').hide();
            }
        },

        toggle_allow_action_col: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Admin.allow_action_col($this);
        }, allow_action_col: function ($this) {
            if (true == $($this).prop("checked")) {
                $('#bya_localization_action_label').closest('tr').show();
            } else {
                $('#bya_localization_action_label').closest('tr').hide();
            }
        },

        toggle_allow_add_to_cart_col: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Admin.allow_add_to_cart_col($this);
        }, 
        
        allow_add_to_cart_col: function ($this) {
            if (true == $($this).prop("checked")) {
                $('#bya_localization_add_to_cart_label').closest('tr').show();
            } else {
                $('#bya_localization_add_to_cart_label').closest('tr').hide();
            }
        },
        
        toggle_image_disp_type: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Admin.image_disp_type($this);
        }, image_disp_type: function ($this) {
            if ('1' == $($this).val()) {
                $('.bya_product_img_size').closest('tr').hide();
            } else {
                $('.bya_product_img_size').closest('tr').show();
            }
        },

        toggle_display_order_count_col: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Admin.display_order_count_col($this);
        }, display_order_count_col: function ($this) {
            if (true == $($this).prop("checked")) {
                $('#bya_localization_order_count_label').closest('tr').show();
                $('#bya_localization_order_count_val').closest('tr').show();
            } else {
                $('#bya_localization_order_count_label').closest('tr').hide();
                $('#bya_localization_order_count_val').closest('tr').hide();
            }
        },

        toggle_display_order_id_col: function (event) {
            event.preventDefault();
            var $this = $(event.currentTarget);
            BYA_Admin.display_order_id_col($this);
        }, display_order_id_col: function ($this) {
            if (true == $($this).prop("checked")) {
                $('#bya_localization_last_purchased_order_id_label').closest('tr').show();
            } else {
                $('#bya_localization_last_purchased_order_id_label').closest('tr').hide();
            }
        },

        toggle_display_stock_count_col(e){
            e.preventDefault();
            BYA_Admin.display_stock_count_col(this);
        }, display_stock_count_col($this){
            if ($($this).is(':checked')) {
                $('#bya_localization_stock_label').closest('tr').show();
            } else {
                $('#bya_localization_stock_label').closest('tr').hide();
            }
        },
        
        block: function (id) {
            $(id).block({
                message: null,
                overlayCSS: {
                    background: '#fff',
                    opacity: 0.7
                }
            });
        }, unblock: function (id) {
            $(id).unblock();
        },
    };
    BYA_Admin.init();
});
