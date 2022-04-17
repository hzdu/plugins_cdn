(function ($) {
    $(document).ready(
        function () {
            tinymce.PluginManager.add('cl_mce_button', function(editor, url) {
                var editor_id = editor['id'];

                if ( editor_id == 'cl_email_body' ) {
                    editor.addButton(
                        'cl_mce_button', {
                            type: 'menubutton',
                            text: 'Cart lift fields',
                            icon: false,
                            menu: [
                                {
                                    text: 'Site URL',
                                    value: '{{site.url}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Site Title',
                                    value: '{{site.title}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Customer First Name',
                                    value: '{{customer.firstname}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Customer Last Name',
                                    value: '{{customer.lastname}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Customer Full Name',
                                    value: '{{customer.fullname}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Product Information/Cart Content',
                                    value: '{{cart.product.table}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Product Names',
                                    value: '{{cart.product.names}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Coupon Code',
                                    value: '{{cart.coupon_code}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Checkout URL',
                                    value: '{{cart.checkout_url}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Checkout Button',
                                    value: '{{cart.checkout_btn}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Related Products',
                                    value: '{{cart.related_products}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Unsubscribe Link',
                                    value: '{{cart.unsubscribe}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                }
                            ]
                        }
                    )
                }
                else if ( editor_id == 'cl_twilio_sms_body' ) {
                    editor.addButton(
                        'cl_mce_button', {
                            type: 'menubutton',
                            text: 'Cart lift fields',
                            icon: false,
                            menu: [
                                {
                                    text: 'Site URL',
                                    value: '{{site.url}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Site Title',
                                    value: '{{site.title}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Customer First Name',
                                    value: '{{customer.firstname}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Customer Last Name',
                                    value: '{{customer.lastname}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Customer Full Name',
                                    value: '{{customer.fullname}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Product Names',
                                    value: '{{cart.product.names}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Coupon Code',
                                    value: '{{cart.coupon_code}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                },
                                {
                                    text: 'Checkout URL',
                                    value: '{{cart.checkout_url}}',
                                    onclick: function() {
                                        editor.insertContent(this.value());
                                    }
                                }
                            ]
                        }
                    )
                }
            })
        }
    );

})(jQuery);
