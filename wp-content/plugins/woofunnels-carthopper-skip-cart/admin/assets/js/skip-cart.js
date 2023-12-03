(($) => {
    "use strict";

    function model_show() {
        $("#tmpl-wfch-modal-add-rules-method").show();
        $('.modal-close').show();
    }


    function model_hide() {
        $("#tmpl-wfch-modal-add-rules-method").hide();
        $('.modal-close').hide();
    }


    class WFCH_Admin {
        constructor() {
            this.vue = null;
            this.rulesVue = null;
            this.initVue();
            this.RulesVue();
            this.Notification();

        }

        initVue() {
            if (null !== this.vue) {
                return this.vue;
            }
            let self = this;
            this.vue = new Vue({
                'el': '#wfch_skip_cart_container',
                created: function () {
                    wfch.hooks.doAction('wfch_admin_ui_created', this);

                    this.sortable();

                },
                components: {
                    Multiselect: window.VueMultiselect.default
                },
                methods: {
                    sortable() {

                        setTimeout(() => {
                            let $tbody = $('.wfch_rules_table_body');
                            $tbody.sortable({
                                items: 'tr',
                                cursor: 'move',
                                axis: 'y',
                                handle: 'td.wc-shipping-zone-sort',
                                scrollSensitivity: 40,
                                stop: (event, ui) => {
                                    this.StopSortable(event, ui);
                                },
                            });
                            jQuery('.woocommerce-help-tip').tipTip({
                                'attribute': 'data-tip',
                                'fadeIn': 50,
                                'fadeOut': 50,
                                'delay': 200
                            });
                        }, 800);
                    },
                    StopSortable(event, element) {
                        let i = 0;
                        let tempRules = [];
                        let rules = wfch.tools.jsp(this.rules);
                        let s = this;

                        $('.wfch_item_drag').each(function (i, e) {
                            let index = parseInt($(this).attr('index'));
                            let rule = rules[index];

                            s.rules[i] = rules[index];
                        });


                        setTimeout(() => {
                            let menu_order = [];
                            $('.wfch_item_drag').each(function (i, e) {
                                menu_order.push($(this).attr('rule-id'));
                            });
                            let wp_ajax = new wfch.ajax();
                            let add_query = {
                                'menu_order': menu_order,
                            };
                            wp_ajax.ajax('save_menu_order', add_query);

                            wp_ajax.success = (rsp) => {
                            };

                        }, 1000);

                        element.item.removeClass('hoverDrag');
                    },

                    changeDetect() {
                        this.changesHappend = true;
                    },
                    addRule() {
                        self.rulesVue.addRule();
                    },
                    editRule(id, rule) {
                        self.rulesVue.editRule(id, rule);
                    },
                    deleteRule(index, rule) {
                        if (null != index) {
                            let status = confirm(wfch_localization.delete_message);
                            if (status) {
                                let wp_ajax = new wfch.ajax();
                                let add_query = {
                                    'wfch_id': rule.id,
                                };
                                wp_ajax.ajax('delete_skip_rules', add_query);
                                wp_ajax.success = (rsp) => {
                                    if (rsp.status == true) {
                                        this.rules.splice(index, 1);
                                    }
                                };
                            }
                        }
                    },
                    updateRuleStatus(rule, event) {
                        if (event.target.checked) {
                            rule.published = 'publish';
                        } else {
                            rule.published = 'draft';
                        }
                        let wp_ajax = new wfch.ajax();

                        let add_query = {
                            'wfch_id': rule.id,
                            'post_status': rule.published
                        };
                        wp_ajax.ajax('update_page_status', add_query);

                        wp_ajax.success = (rsp) => {

                        };
                    },

                    asyncFindExcludes(query) {
                        if (query !== "") {
                            clearTimeout(this.search_excludes_timeout);
                            this.search_excludes_timeout = setTimeout((query) => {
                                let wp_ajax = new wfch.ajax();
                                let product_query = {'term': query};
                                wp_ajax.ajax('product_search', product_query);
                                wp_ajax.success = (rsp) => {
                                    this.excludes = rsp;
                                    this.isExcludesLoading = false;
                                };
                                wp_ajax.complete = () => {
                                    this.isExcludesLoading = false;
                                };
                            }, 1000, query);
                        } else {
                            this.isExcludesLoading = false;
                        }
                    },
                    saveRules() {
                        let wp_ajax = new wfch.ajax();
                        let add_query = {
                            'skip_cart': this.skip_cart,
                            'category': this.selectedCategory,
                            'excludes': this.selectedExcludes,
                            'add_cart_button_text': this.add_cart_button_text,
                        };
                        wfch.show_spinner();
                        wp_ajax.ajax('save_skip_cart_setting', add_query);

                        wp_ajax.success = (rsp) => {
                            this.changesHappend = false;
                        };
                    }
                },
                data: {
                    search_term: '',
                    search_products: [],
                    editForm: {
                        product: [],
                        edit_id: 0,
                        match: 'all',
                        skip_cart: false
                    },
                    rules: wfch.tools.jsp(wfch_data.rules),
                    skip_cart: (wfch_data.skip_cart == 'true' || wfch_data.skip_cart == true),
                    selectedCategory: wfch.tools.jsp(wfch_data.category),
                    selectedExcludes: wfch.tools.jsp(wfch_data.excludes),
                    category: wfch.tools.jsp(wfch_data.category_list),
                    excludes: [],
                    temp_data: {},
                    changesHappend: false,
                    search_category_timeout: null,
                    search_excludes_timeout: null,
                    isCategoryLoading: false,
                    isExcludesLoading: false,
                    add_cart_button_text: wfch.tools.jsp(wfch_data.add_cart_button_text),
                    wfch_products_search: null,


                }
            });
            return this.vue;
        }

        RulesVue() {
            if (this.rulesVue === true) {
                return;
            }

            let self = this;

            this.rulesVue = new Vue({
                'el': '#tmpl-wfch-modal-add-edit-rules-method',
                components: {
                    Multiselect: window.VueMultiselect.default
                },
                data: {
                    index: 0,
                    wfch_id: 0,
                    isLoading: false,
                    products: [],
                    is_single: '',
                    match: '0',
                    skip_cart: false,
                    add_to_cart_text: '',
                    checkout: 0,
                    selectedProducts: []
                },
                methods: {

                    addRule() {
                        $("#tmpl-wfch-modal-add-rules-method .multiselect").removeClass('wfch_error');
                        model_show();
                    },
                    editRule(index, rule) {
                        $("#tmpl-wfch-modal-add-rules-method .multiselect").removeClass('wfch_error');
                        rule = wfch.tools.jsp(rule);
                        this.index = index;
                        this.wfch_id = rule.id;
                        this.selectedProducts = Object.values(rule.products);
                        this.match = rule.match;
                        this.skip_cart = (rule.skip_cart == 'true' || rule.skip_cart == true);
                        this.add_to_cart_text = rule.add_to_cart_text;

                        if (wfch.tools.ol(wfch_data.aero_checkout_pages) > 0 && null !== rule.checkout) {
                            if (typeof rule.checkout == 'object') {
                                this.checkout = rule.checkout.id;
                            } else {
                                this.checkout = 0;
                            }
                        } else {
                            this.checkout = 0;
                        }

                        model_show();
                    },

                    onSubmit() {
                        let wp_ajax = new wfch.ajax();
                        // start loading
                        let selected_products = [];
                        let products = this.selectedProducts;
                        if (wfch.tools.ol(this.selectedProducts) > 0) {
                            for (let pid in products) {
                                selected_products.push(products[pid].id);
                            }
                        } else {
                            $("#tmpl-wfch-modal-add-rules-method .multiselect").addClass('wfch_error');
                            return;
                        }

                        this.isLoading = true;
                        let add_query = {
                            'wfch_id': this.wfch_id,
                            'products': selected_products,
                            'match': this.match,
                            'skip_cart': this.skip_cart,
                            'checkout': this.checkout,
                            'add_to_cart_text': this.add_to_cart_text,
                        };
                        wp_ajax.ajax('create_skip_rules', add_query);
                        wp_ajax.success = (rsp) => {
                            if (rsp.status == true) {
                                rsp.data.skip_cart = wfch.tools.string_to_bool(rsp.data.skip_cart);
                                if (wfch.tools.hp(rsp, 'update') && rsp.update == 'yes') {
                                    Vue.set(wfch.instance.initVue().rules, this.index, rsp.data);
                                } else {
                                    wfch.instance.initVue().rules.unshift(rsp.data);
                                }
                                this.isLoading = false;
                                wfch.instance.initVue().sortable();
                            } else {
                            }
                        };
                        wp_ajax.complete = () => {
                            this.closeModel();
                        };
                    },
                    asyncFind(query) {

                        this.isLoading = true;
                        $("#tmpl-wfch-modal-add-rules-method .multiselect").removeClass('wfch_error');
                        if (query !== "") {
                            clearTimeout(self.search_timeout);
                            self.search_timeout = setTimeout((query) => {
                                let wp_ajax = new wfch.ajax();
                                let product_query = {'term': query};
                                wp_ajax.ajax('product_search', product_query);
                                wp_ajax.success = (rsp) => {
                                    this.products = rsp;
                                    this.isLoading = false;
                                };
                                wp_ajax.complete = () => {
                                    this.isLoading = false;
                                };
                            }, 1000, query);
                        } else {
                            this.isLoading = false;
                        }
                    },
                    clearAll() {
                        this.index = 0;
                        this.wfch_id = 0;
                        this.checkout = 0;
                        this.products = [];
                        this.selectedProducts = [];
                        this.isLoading = false;
                        this.add_to_cart_text = '';
                        this.match = '0';
                        this.skip_cart = false;

                    },
                    closeModel() {
                        model_hide();
                        this.clearAll();
                    }
                }
            });
            return this.rulesVue;
        }

        Notification() {
            wfch.show_saved_model = $("#modal-saved-data-success");
            if (wfch.show_saved_model.length > 0) {


                wfch.show_saved_model.iziModal({
                        title: 'saving',
                        icon: 'icon-check',
                        headerColor: '#6dbe45',
                        background: '#6dbe45',
                        borderBottom: false,
                        width: 600,
                        timeout: 4000,
                        timeoutProgressbar: true,
                        transitionIn: 'fadeInUp',
                        transitionOut: 'fadeOutDown',
                        bottom: 0,
                        loop: true,
                        pauseOnHover: true,
                        overlay: false,
                        onOpening: (modal) => {
                            wfch.hide_spinner();
                        },
                        onClosed: () => {
                            wfch.show_saved_model.iziModal('setTitle', wfch_localization.data_saving);
                        }
                    }
                );
            }


            wfch.hooks.addAction('wfch_before_ajax_running', function () {

            });

            wfch.hooks.addAction('wfch_success_notification', function (rsp, action) {
                if ('' != rsp.msg) {
                    wfch.show_data_save_model(rsp.msg);
                }
            });
            window.addEventListener('load', function () {
                $('.wfch_loader').hide();
            });
        }

    }

    wfch.instance = new WFCH_Admin();
})(jQuery);