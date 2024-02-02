"use strict";

function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof = function _typeof(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
    }
    return _typeof(obj);
}

window.wfch = function ($) {
    return {
        "ajax": function ajax(cls, is_form, cb) {
            var self = this;
            var element = null;
            var handler = {};
            var prefix = "wfch_";
            this.action = null;

            this.data = function (form_data) {
                var formEl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                return form_data;
            };

            this.before_send = function (formEl) {
            };

            this.async = function (bool) {
                return bool;
            };

            this.method = function (method) {
                return method;
            };

            this.success = function (rsp, fieldset, loader, jqxhr, status) {
            };

            this.complete = function (rsp, fieldset, loader, jqxhr, status) {
            };

            this.error = function (rsp, fieldset, loader, jqxhr, status) {
            };

            this.action = function (action) {
                return action;
            };

            function reset_form(action, fieldset, loader, rsp, jqxhr, status) {
                if (fieldset.length > 0) {
                    fieldset.prop('disabled', false);
                }

                loader.remove();
                var loader2;
                loader2 = $("#offer_settings_btn_bottom .wfch_save_funnel_offer_products_ajax_loader ");
                loader2.removeClass('ajax_loader_show');

                if (self.hasOwnProperty(action) === true && typeof self[action] === 'function') {
                    self[action](rsp, fieldset, loader, jqxhr, status);
                }
            }

            function form_post(action) {
                var formEl = element;
                var ajax_loader = null;
                var ajax_loader2 = null;
                var form_data = new FormData(formEl);
                form_data.append('action', action);
                form_data.append('wfch_nonce', wfch_secure.nonce);
                var form_method = $(formEl).attr('method');
                var method = form_method !== "undefined" && form_method !== "" ? form_method : 'POST';

                if ($(formEl).find("." + action + "_ajax_loader").length === 0) {
                    $(formEl).find(".wfch_form_submit").prepend("<span class='" + action + "_ajax_loader spinner" + "'></span>");
                    ajax_loader = $(formEl).find("." + action + "_ajax_loader");
                } else {
                    ajax_loader = $(formEl).find("." + action + "_ajax_loader");
                }

                ajax_loader2 = $("#offer_settings_btn_bottom .wfch_save_funnel_offer_products_ajax_loader ");
                ajax_loader.addClass('ajax_loader_show');
                ajax_loader2.addClass('ajax_loader_show');
                var fieldset = $(formEl).find("fieldset");

                if (fieldset.length > 0) {
                    fieldset.prop('disabled', true);
                }

                self.before_send(formEl, action);
                var data = self.data(form_data, formEl);
                var request = {
                    url: ajaxurl,
                    async: self.async(true),
                    method: self.method('POST'),
                    data: data,
                    processData: false,
                    contentType: false,
                    //       contentType: self.content_type(false),
                    success: function success(rsp, jqxhr, status) {
                        if (_typeof(rsp) === 'object' && rsp.hasOwnProperty('nonce')) {
                            wfch_secure.nonce = rsp.nonce;
                            delete rsp.nonce;
                        }

                        reset_form(action + "_ajax_success", fieldset, ajax_loader, rsp, jqxhr, status);
                        self.success(rsp, jqxhr, status, fieldset, ajax_loader);
                    },
                    complete: function complete(rsp, jqxhr, status) {
                        reset_form(action + "_ajax_complete", fieldset, ajax_loader, rsp, jqxhr, status);
                        self.complete(rsp, jqxhr, status, fieldset, ajax_loader);
                    },
                    error: function error(rsp, jqxhr, status) {
                        reset_form(action + "_ajax_error", fieldset, ajax_loader, rsp, jqxhr, status);
                        self.error(rsp, jqxhr, status, fieldset, ajax_loader);
                    }
                };

                if (handler.hasOwnProperty(action)) {
                    clearTimeout(handler[action]);
                } else {
                    handler[action] = null;
                }

                handler[action] = setTimeout(function (request) {
                    $.ajax(request);
                }, 200, request);
            }

            function send_json(action) {
                var formEl = element;
                var data = self.data({}, formEl);

                if (_typeof(data) === 'object') {
                    data.action = action;
                } else {
                    data = {
                        'action': action
                    };
                }

                self.before_send(formEl, action);
                data.wfch_nonce = wfch_secure.nonce;
                var request = {
                    url: ajaxurl,
                    async: self.async(true),
                    method: self.method('POST'),
                    data: data,
                    success: function success(rsp, jqxhr, status) {
                        if (_typeof(rsp) === 'object' && rsp.hasOwnProperty('nonce')) {
                            wfch_secure.nonce = rsp.nonce;
                            delete rsp.nonce;
                        }

                        self.success(rsp, jqxhr, status, element);
                    },
                    complete: function complete(rsp, jqxhr, status) {
                        self.complete(rsp, jqxhr, status, element);
                    },
                    error: function error(rsp, jqxhr, status) {
                        self.error(rsp, jqxhr, status, element);
                    }
                };

                if (handler.hasOwnProperty(action)) {
                    clearTimeout(handler[action]);
                } else {
                    handler[action] = null;
                }

                handler[action] = setTimeout(function (request) {
                    $.ajax(request);
                }, 200, request);
            }

            this.ajax = function (action, data) {
                if (_typeof(data) === 'object') {
                    data.action = action;
                } else {
                    data = {
                        'action': action
                    };
                }

                data.action = prefix + action;
                self.before_send(document.body, action);
                data.wfch_nonce = wfch_secure.nonce;

                wfch.hooks.doAction('wfch_before_ajax_running', action, data);
                var request = {
                    url: ajaxurl,
                    async: self.async(true),
                    method: self.method('POST'),
                    data: data,
                    success: function success(rsp, jqxhr, status) {
                        if (_typeof(rsp) === 'object' && rsp.hasOwnProperty('nonce')) {
                            wfch_secure.nonce = rsp.nonce;
                            delete rsp.nonce;
                        }

                        wfch.hooks.doAction('wfch_success_notification', rsp, action);
                        self.success(rsp, jqxhr, status, action);

                    },
                    complete: function complete(rsp, jqxhr, status) {

                        wfch.hooks.doAction('wfch_complete_notification', rsp, action);
                        self.complete(rsp, jqxhr, status, action);

                    },
                    error: function error(rsp, jqxhr, status) {
                        wfch.hooks.doAction('wfch_error_notification', action, jqxhr, status);
                        self.error(rsp, jqxhr, status, action);

                    }
                };

                if (handler.hasOwnProperty(action)) {
                    clearTimeout(handler[action]);
                } else {
                    handler[action] = null;
                }

                handler[action] = setTimeout(function (request) {
                    $.ajax(request);
                }, 200, request);
            };

            function form_init(cls) {
                if ($(cls).length > 0) {
                    $(cls).on("submit", function (e) {
                        e.preventDefault();
                        var action = $(this).data('wfoaction');

                        if (action !== 'undefined') {
                            action = prefix + action;
                            action = action.trim();
                            element = this;
                            self.action = action;
                            form_post(action);
                        }
                    });

                    if (typeof cb === 'function') {
                        cb(self);
                    }
                }
            }

            function click_init(cls) {
                if ($(cls).length > 0) {
                    $(cls).on("click", function (e) {
                        console.log(e);
                        e.preventDefault();
                        var action = $(this).data('wfoaction');

                        if (action !== 'undefined') {
                            action = prefix + action;
                            action = action.trim();
                            element = this;
                            self.action = action;
                            send_json(action);
                        }
                    });

                    if (typeof cb === 'function') {
                        cb(self);
                    }
                }
            }

            if (is_form === true) {
                form_init(cls, cb);
                return this;
            }

            if (is_form === false) {
                click_init(cls, cb);
                return this;
            }

            return this;
        },
        "hooks": {
            hooks: {
                action: {},
                filter: {}
            },
            addAction: function addAction(action, callable, priority, tag) {
                this.addHook('action', action, callable, priority, tag);
            },
            addFilter: function addFilter(action, callable, priority, tag) {
                this.addHook('filter', action, callable, priority, tag);
            },
            doAction: function doAction(action) {
                this.doHook('action', action, arguments);
            },
            applyFilters: function applyFilters(action) {
                return this.doHook('filter', action, arguments);
            },
            removeAction: function removeAction(action, tag) {
                this.removeHook('action', action, tag);
            },
            removeFilter: function removeFilter(action, priority, tag) {
                this.removeHook('filter', action, priority, tag);
            },
            addHook: function addHook(hookType, action, callable, priority, tag) {
                if (undefined == this.hooks[hookType][action]) {
                    this.hooks[hookType][action] = [];
                }

                var hooks = this.hooks[hookType][action];

                if (undefined == tag) {
                    tag = action + '_' + hooks.length;
                }

                if (priority == undefined) {
                    priority = 10;
                }

                this.hooks[hookType][action].push({
                    tag: tag,
                    callable: callable,
                    priority: priority
                });
            },
            doHook: function doHook(hookType, action, args) {
                // splice args from object into array and remove first index which is the hook name
                args = Array.prototype.slice.call(args, 1);

                if (undefined != this.hooks[hookType][action]) {
                    var hooks = this.hooks[hookType][action],
                        hook; //sort by priority

                    hooks.sort(function (a, b) {
                        return a.priority - b.priority;
                    });

                    for (var i = 0; i < hooks.length; i++) {
                        hook = hooks[i].callable;

                        if (typeof hook != 'function') {
                            hook = window[hook];
                        }

                        if ('action' == hookType) {
                            hook.apply(null, args);
                        } else {
                            args[0] = hook.apply(null, args);
                        }
                    }
                }

                if ('filter' == hookType) {
                    return args[0];
                }
            },
            removeHook: function removeHook(hookType, action, priority, tag) {
                if (undefined != this.hooks[hookType][action]) {
                    var hooks = this.hooks[hookType][action];

                    for (var i = hooks.length - 1; i >= 0; i--) {
                        if ((undefined == tag || tag == hooks[i].tag) && (undefined == priority || priority == hooks[i].priority)) {
                            hooks.splice(i, 1);
                        }
                    }
                }
            }
        },
        "tools": {
            /**
             * get keys length of object and array
             * @param obj
             * @returns {number}
             */
            ol: function ol(obj) {
                var c = 0;

                if (obj != null && _typeof(obj) === "object") {
                    c = Object.keys(obj).length;
                }

                return c;
            },
            isEmpty: function isEmpty(obj) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        return false;
                    }
                }

                return true;
            },

            /**
             * Check property exist in object or Array
             * @param obj
             * @param key
             * @returns {boolean}
             */
            hp: function hp(obj, key) {
                var c = false;

                if (_typeof(obj) === "object" && key !== undefined) {
                    c = obj.hasOwnProperty(key);
                }

                return c;
            },

            /**
             * Convert destroy refresh and reconvert into in json without refrence
             * @param obj
             * @returns {*}
             */
            jsp: function jsp(obj) {
                if (_typeof(obj) === 'object') {
                    var doc = JSON.stringify(obj);
                    doc = JSON.parse(doc);
                    return doc;
                } else {
                    return obj;
                }
            },

            /**
             * get object keys array
             * @param obj
             * @returns Array
             */
            kys: function kys(obj) {
                if (_typeof(obj) === 'object' && obj != null && this.ol(obj) > 0) {
                    return Object.keys(obj);
                }

                return [];
            },
            ucfirst: function ucfirst(string) {
                return string.replace(/^\w/, function (c) {
                    return c.toUpperCase();
                });
            },
            stripHTML: function stripHTML(dirtyString) {
                var dirty = $("<div>" + dirtyString + "</div>");
                return dirty.text();
            },
            string_to_bool: function string_to_bool() {
                var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

                if ('' === content || 'false' == content) {
                    return false;
                }

                return typeof content === "boolean" ? content : 'yes' === content || 1 === content || 'true' === content || '1' === content;
            },
            is_object: function is_object(options) {
                if (options == null) {
                    return false;
                }

                if (_typeof(options) === 'object') {
                    return true;
                }

                return false;
            },
            is_bool: function is_bool(mixed_var) {
                mixed_var = wfch.tools.string_to_bool(mixed_var);
                return typeof mixed_var === 'boolean';
            }
        },
        "swal": function swal(property) {
            return wfch_swal($.extend({
                title: '',
                text: "",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#0073aa',
                cancelButtonColor: '#e33b3b',
                confirmButtonText: ''
            }, property));
        },
        "model": {
            'add_product': function add_product() {
                var modal_add_add_product = $("#modal-add-product");

                if (modal_add_add_product.length > 0) {
                    modal_add_add_product.iziModal({
                        title: 'Add Product',
                        headerColor: '#6dbe45',
                        background: '#efefef',
                        borderBottom: false,
                        width: 600,
                        overlayColor: 'rgba(0, 0, 0, 0.6)',
                        transitionIn: 'fadeInDown',
                        transitionOut: 'fadeOutDown',
                        navigateArrows: "false",
                        onOpening: function onOpening(modal) {
                            modal.startLoading();
                        },
                        onOpened: function onOpened(modal) {
                            modal.stopLoading(); // product_search_setting(modal);
                        },
                        onClosed: function onClosed(modal) {// console.log('onClosed');
                        }
                    });
                }
            }
        },
        'sortable': function sortable(ui_class, _start, _stop, hover) {
            var item_class = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '.wfch_item_drag';
            var non_drag_class = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '.ui-state-disabled';
            var placeholder = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '';
            var sortable = $(ui_class);
            if (sortable.length === 0) return;
            sortable.off('sortable');
            var options = {
                connectWith: ui_class,
                start: function start(event, ui) {
                    _start(event, ui);
                },
                stop: function stop(event, ui) {
                    _stop(event, ui);
                },
                over: function over(event, ui) {
                    hover('in', event, ui);
                },
                out: function out(event, ui) {
                    hover('out', event, ui);
                }
            };
            var drag_item_class = '.wfch_item_drag';
            // console.log(sortable);
            // if (sortable.find('.ui-sortable-handle').length > 0) {
            //     console.log('yyyy');
            //     options.handle = ".ui-sortable-handle";
            // }


            if (item_class !== '') {
                drag_item_class = item_class;
            }

            if (non_drag_class !== '') {
                drag_item_class += ':not(' + non_drag_class + ')';
            }

            options.items = drag_item_class;

            if ('' !== placeholder) {
                options.placeholder = placeholder;
            }

            sortable.sortable(options);
            sortable.disableSelection();
        },
        'addClass': function addClass(el, cl) {
            $(el).addClass(cl);
        },
        'removeClass': function removeClass(el, cl) {
            $(el).removeClass(cl);
        },
        show_spinner: function show_spinner() {
            var spinner = $('.wfch_spinner.spinner');

            if (spinner.length > 0) {
                spinner.css("visibility", "visible");
            }
        },
        hide_spinner: function hide_spinner() {
            var spinner = $('.wfch_spinner.spinner');

            if (spinner.length > 0) {
                spinner.css("visibility", "hidden");
            }
        },
        show_data_save_model: function show_data_save_model() {
            var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            if ('' !== title) {
                wfch.show_saved_model.iziModal('setTitle', title);
                wfch.show_saved_model.iziModal('open');
            }
        }
    };
}(jQuery);
