var paypal_common = {
    pp_currencies: {
        USD: {
            value: 'USD',
            text: 'U.S. Dollar'
        },
        AUD: {
            value: 'AUD',
            text: wp.i18n.__( 'Australian Dollar', 'wishlist-member' )
        },
        BRL: {
            value: 'BRL',
            text: wp.i18n.__( 'Brazilian Real', 'wishlist-member' )
        },
        CAD: {
            value: 'CAD',
            text: wp.i18n.__( 'Canadian Dollar', 'wishlist-member' )
        },
        CZK: {
            value: 'CZK',
            text: wp.i18n.__( 'Czech Koruna', 'wishlist-member' )
        },
        DKK: {
            value: 'DKK',
            text: wp.i18n.__( 'Danish Krone', 'wishlist-member' )
        },
        EUR: {
            value: 'EUR',
            text: wp.i18n.__( 'Euro', 'wishlist-member' )
        },
        HKD: {
            value: 'HKD',
            text: wp.i18n.__( 'Hong Kong Dollar', 'wishlist-member' )
        },
        HUF: {
            value: 'HUF',
            text: wp.i18n.__( 'Hungarian Forint', 'wishlist-member' )
        },
        ILS: {
            value: 'ILS',
            text: wp.i18n.__( 'Israeli New Sheqel', 'wishlist-member' )
        },
        INR: {
            value: 'INR',
            text: wp.i18n.__( 'Indian Rupee', 'wishlist-member' )
        },
        JPY: {
            value: 'JPY',
            text: wp.i18n.__( 'Japanese Yen', 'wishlist-member' )
        },
        MYR: {
            value: 'MYR',
            text: wp.i18n.__( 'Malaysian Ringgit', 'wishlist-member' )
        },
        MXN: {
            value: 'MXN',
            text: wp.i18n.__( 'Mexican Peso', 'wishlist-member' )
        },
        NOK: {
            value: 'NOK',
            text: wp.i18n.__( 'Norwegian Krone', 'wishlist-member' )
        },
        NZD: {
            value: 'NZD',
            text: wp.i18n.__( 'New Zealand Dollar', 'wishlist-member' )
        },
        PHP: {
            value: 'PHP',
            text: wp.i18n.__( 'Philippine Peso', 'wishlist-member' )
        },
        PLN: {
            value: 'PLN',
            text: wp.i18n.__( 'Polish Zloty', 'wishlist-member' )
        },
        GBP: {
            value: 'GBP',
            text: wp.i18n.__( 'Pound Sterling', 'wishlist-member' )
        },
        RUB: {
            value: 'RUB',
            text: wp.i18n.__( 'Russian Ruble', 'wishlist-member' )
        },
        SGD: {
            value: 'SGD',
            text: wp.i18n.__( 'Singapore Dollar', 'wishlist-member' )
        },
        SEK: {
            value: 'SEK',
            text: wp.i18n.__( 'Swedish Krona', 'wishlist-member' )
        },
        CHF: {
            value: 'CHF',
            text: wp.i18n.__( 'Swiss Franc', 'wishlist-member' )
        },
        TWD: {
            value: 'TWD',
            text: wp.i18n.__( 'Taiwan New Dollar', 'wishlist-member' )
        },
        THB: {
            value: 'THB',
            text: wp.i18n.__( 'Thai Baht', 'wishlist-member' )
        }
    },
    pp_billing_cycle: [{
        value: wp.i18n.__( 'Day', 'wishlist-member' ),
        text: wp.i18n.__( 'Day(s)', 'wishlist-member' )
    }, {
        value: wp.i18n.__( 'Week', 'wishlist-member' ),
        text: wp.i18n.__( 'Week(s)', 'wishlist-member' )
    }, {
        value: wp.i18n.__( 'Month', 'wishlist-member' ),
        text: wp.i18n.__( 'Month(s)', 'wishlist-member' )
    }, {
        value: wp.i18n.__( 'Year', 'wishlist-member' ),
        text: wp.i18n.__( 'Year(s)', 'wishlist-member' )
    }],
    payflow_billing_cycle: [{
        value: "DAY",
        text: wp.i18n.__( 'Day(s)', 'wishlist-member' )
    }, {
        value: "WEEK",
        text: wp.i18n.__( 'Weekly', 'wishlist-member' )
    }, {
        value: "BIWK",
        text: wp.i18n.__( 'Every Two Weeks', 'wishlist-member' )
    }, {
        value: "SMMO",
        text: wp.i18n.__( 'Twice Every Month', 'wishlist-member' )
    }, {
        value: "FRWK",
        text: wp.i18n.__( 'Every Four Weeks', 'wishlist-member' )
    }, {
        value: "MONT",
        text: wp.i18n.__( 'Monthly', 'wishlist-member' )
    }, {
        value: "QTER",
        text: wp.i18n.__( 'Quarterly', 'wishlist-member' )
    }, {
        value: "SMYR",
        text: wp.i18n.__( 'Twice Every Year', 'wishlist-member' )
    }, {
        value: "YEAR",
        text: wp.i18n.__( 'Yearly', 'wishlist-member' )
    }],
    levels_select_group: [],
    pp_stop_after: [],

    prefix : '',

    fxn : {
        // settings tab
        settings_handlers : function (obj) {
            $(obj).off('change.wlm3', '#' + paypal_common.prefix + '-enable-sandbox');
            $(obj).on('change.wlm3', '#' + paypal_common.prefix + '-enable-sandbox', function() {
                if ($(this).is(':checked')) {
                    $('#' + paypal_common.prefix + '-sandbox-settings').slideDown(300);
                } else {
                    $('#' + paypal_common.prefix + '-sandbox-settings').slideUp(300);
                }
            });
            $('#' + paypal_common.prefix + '-enable-sandbox').trigger('change.wlm3');
        },
        cleantbody : function() {
            if ($('#' + paypal_common.prefix + '-products tbody').find('tr').length < 1) {
                $('#' + paypal_common.prefix + '-products tbody').html('').text('');
            }
        },
        load_products : function (products, append) {
            if(typeof products == 'object') {
                var tmpl = _.template($('script#' + paypal_common.prefix + '-products-template').html(), {
                    variable: 'data'
                });
                var html = tmpl(products);
                if(!append) $('#' + paypal_common.prefix + '-products tbody').empty()
                $('#' + paypal_common.prefix + '-products tbody').append(html);

                $( '#' + paypal_common.prefix + '-products .-del-btn' ).do_confirm( { confirm_message : wp.i18n.__( 'Delete this Product?', 'wishlist-member' ), yes_button : wp.i18n.__( 'Delete', 'wishlist-member' ) } ).on( 'yes.do_confirm', function() {
                    var pid = $(this).closest('tr').data('id');
                    var edit = $('#' + paypal_common.prefix + '_edit_product_' + pid);
                    edit.remove();

                    var tbody = $(this).closest('tbody');
                    $(this).closest('tr').fadeOut(300, function() {
                        $(this).remove();
                        paypal_common.fxn.cleantbody();
                    });

                    $.post( WLM3VARS.ajaxurl, {
                        action : paypal_common.prefix + '_delete_product',
                        id : pid
                    } );

                    delete paypal_common.products[pid];
                    return false;
                } );

                // generate modals
                if(!$('body').hasClass('modal-open')) {
                    var tmpl = _.template($('script#' + paypal_common.prefix + '-products-edit-template').html(), {
                        variable: 'data'
                    });
                    var html = tmpl(products);
                    if(!append) $('#' + paypal_common.prefix + '-products-edit').empty();
                    $('#' + paypal_common.prefix + '-products-edit').append(html);

                    $('#' + paypal_common.prefix + '-products-edit [data-process="modal"]').each(function() {
                        new wlm3_modal(
                            '#' + $(this)[0].id
                        );
                    });
                }
            }
            paypal_common.fxn.cleantbody();
        },
        edit_form : function(id) {
            var modal = $('#' + paypal_common.prefix + '_edit_product_' + id);

            modal.transformers();

            var data = {};
            data[paypal_common.products_option] = paypal_common.products;
            modal.set_form_data(data);

            modal.find('.-paypal-recurring-toggle, .-paypal-trial1-toggle, .-paypal-trial2-toggle').change();
            modal.modal('show');
        },
        products_handlers : function (obj) {

            // toggle recurring
            $(obj).on('change.wlm3', '.-paypal-recurring-toggle', function() {
                if(!this.checked) return;
                if (this.value == '1') {
                    $(this).closest('.' + paypal_common.prefix + '-product-form').addClass('-is-recurring').removeClass('-is-onetime');
                } else {
                    $(this).closest('.' + paypal_common.prefix + '-product-form').addClass('-is-onetime').removeClass('-is-recurring');
                }
            });
            // toggle trial
            $(obj).on('change.wlm3', '.-paypal-trial1-toggle', function() {
                var checked = $(this).prop('checked');
                if (checked) {
                    $(this).closest('.' + paypal_common.prefix + '-product-form').addClass('-has-trial1');
                } else {
                    $(this).closest('.' + paypal_common.prefix + '-product-form').removeClass('-has-trial1');
                }
            });
            // toggle trial2
            $(obj).on('change.wlm3', '.-paypal-trial2-toggle', function() {
                var checked = $(this).prop('checked');
                if (checked) {
                    $(this).closest('.' + paypal_common.prefix + '-product-form').addClass('-has-trial2');
                } else {
                    $(this).closest('.' + paypal_common.prefix + '-product-form').removeClass('-has-trial2');
                }
            });
            
            $('#' + paypal_common.prefix + '-products')
            .off('click.wlm3', '.-add-btn') // add new button
            .on('click.wlm3', '.-add-btn', function() {
                var _id = (Date.now() + 1).toString(36).toUpperCase();
                var data = {}
                data[_id] = $.extend(
                    {
                        id: _id,
                        new_product: true,
                        name: wp.i18n.__( 'Product #', 'wishlist-member' ) + parseInt(window.performance.now()),
                    },
                    paypal_common.new_product
                );

                $.extend(paypal_common.products, data);
                paypal_common.fxn.load_products(data, true);

                paypal_common.fxn.edit_form(_id);
                return false;
            })
            .off('click.wlm3', '.-edit-btn') // edit button
            .on('click.wlm3', '.-edit-btn', function() {
                paypal_common.fxn.edit_form($(this).closest('tr').data('id'));
                return false;
            })
            .off('click.wlm3', '.paypal-copy-form')
            .on('click.wlm3', '.paypal-copy-form', function() {
                if(!$(this).data('text')) {
                    var _this = this;
                    $(_this).data('text', 'loading...');
                    $.post(WLM3VARS.ajaxurl, {
                        action: 'wlm_paypalps_get-product-form',
                        product_id: $(this).data('id')
                    }, function(r) {
                        $(_this).data('text', r);
                        $(_this).popover('show');
                    });
                }
            });
        },
        after_modal_save : function(me, settings_data, jqXHR, textStatus) {
            var data = {};

            $.each(settings_data, function(index, value) {
                try {
                    var x = index.match(/\[([^\[\]]+?)\]$/)[1];
                    data[x] = value;
                } catch(e) {}
            });

            paypal_common.products[data.id] = data;
            paypal_common.fxn.load_products(paypal_common.products);

        },
        init : function(obj) {
            paypal_common.fxn.settings_handlers(obj);
            paypal_common.fxn.cleantbody();
            paypal_common.fxn.load_products(paypal_common.products, false);
            paypal_common.fxn.products_handlers(obj);
        }
    }
}

$.each(all_levels, function(group, levels) {
    var group = {
        name: post_types[group].labels.name,
        options: []
    };
    $.each(levels, function(level_id, level) {
        group.options.push({
            value: level.id,
            text: level.name
        });
    });
    paypal_common.levels_select_group.push(group);
});

var cycle = wp.i18n.__( ' cycle', 'wishlist-member' );
for (var i = 1; i <= 52; i++) {
    paypal_common.pp_stop_after.push({
        value: i,
        text: (i < 2 ? wp.i18n.__( 'Never', 'wishlist-member' ) : i + cycle)
    });
    cycle = wp.i18n.__( ' cycles', 'wishlist-member' );
}
