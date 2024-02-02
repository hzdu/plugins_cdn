/*global wfacp_frontend*/

(function () {
    if (!(/MSIE \d|Trident.*rv:/.test(navigator.userAgent))) {
        window.WFACP_Event = Event;
        return;
    }

    function WFACP_Event(event, params) {
        params = params || {bubbles: false, cancelable: false, detail: null};
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    window.WFACP_Event = WFACP_Event;
})();


(function ($) {
    window.refresh_page_data_load_trigger = false;
    wfacp_frontend.hooks = {
        hooks: {
            action: {},
            filter: {}
        },
        addAction: function (action, callable, priority, tag) {
            this.addHook('action', action, callable, priority, tag);
        },
        addFilter: function (action, callable, priority, tag) {
            this.addHook('filter', action, callable, priority, tag);
        },
        doAction: function (action) {
            this.doHook('action', action, arguments);
        },
        applyFilters: function (action) {
            return this.doHook('filter', action, arguments);
        },
        removeAction: function (action, tag) {
            this.removeHook('action', action, tag);
        },
        removeFilter: function (action, priority, tag) {
            this.removeHook('filter', action, priority, tag);
        },
        addHook: function (hookType, action, callable, priority, tag) {
            if (undefined == this.hooks[hookType][action]) {
                this.hooks[hookType][action] = [];
            }
            let hooks = this.hooks[hookType][action];
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
        doHook: function (hookType, action, args) {

            // splice args from object into array and remove first index which is the hook name
            args = Array.prototype.slice.call(args, 1);
            if (undefined != this.hooks[hookType][action]) {
                let hooks = this.hooks[hookType][action],
                    hook;
                //sort by priority
                hooks.sort(
                    function (a, b) {
                        return a.priority - b.priority;
                    }
                );

                for (let i = 0; i < hooks.length; i++) {
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
        removeHook: function (hookType, action, priority, tag) {
            if (undefined != this.hooks[hookType][action]) {
                let hooks = this.hooks[hookType][action];
                for (let i = hooks.length - 1; i >= 0; i--) {
                    if ((undefined == tag || tag == hooks[i].tag) && (undefined == priority || priority == hooks[i].priority)) {
                        hooks.splice(i, 1);
                    }
                }
            }
        }
    };
    wfacp_frontend.is_valid_email = function (email) {
        let pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
        return pattern.test(email);
    };
    wfacp_frontend.blocked_element = [];
    wfacp_frontend.call_backs = {};
    $.wfacp_step_scrolling = function (scrollElement) {
        if (scrollElement.length) {
            $('html, body').animate({
                scrollTop: (scrollElement.offset().top - 100)
            }, 700);
        }
    };
    if (typeof $.fn.block === "undefined") {
        $.fn.block = function (opts) {
        };
        // plugin method for unblocking element content
        $.fn.unblock = function (opts) {
        };
        $.scroll_to_notices = function () {
        };
    }

    $.fn.aero_block = function (opts) {
        if (this.length == 0) {
            return;
        }

        if (false == refresh_page_data_load_trigger) {
            //console.trace();
            return;
        }
        let body = $('body');
        if (!body.hasClass('wfacp_editor_active') && !body.hasClass('wfacp_anim_active')) {
            body.addClass("wfacp_anim_active");

        }


    };
    $.fn.aero_unblock = function () {
        let body = $('body');
        if (body.hasClass('wfacp_anim_active')) {
            body.removeClass("wfacp_anim_active");
        }

    };

    function unblockElements() {
        $('.blockUI').remove();
    }

    $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
        if (settings.hasOwnProperty('url') && settings.url.indexOf('wc-ajax') > -1) {
            if (0 == jqxhr.readyState) {
                return;
            }

            if (jqxhr.status != 200) {
                unblockElements();
                wfacp_frontend.hooks.doAction('wfacp_ajax_error_response', event, jqxhr, settings, thrownError);
            }
        }
    });

    $(document.body).on('updated_checkout', function (e, data) {

        jQuery('.blockUI').remove();
        if (typeof data == "object" && data.hasOwnProperty('fragments')) {


            let fragments = data.fragments;
            if (data.fragments.hasOwnProperty('wfacp_ajax_data') && '' !== data.fragments.wfacp_ajax_data.action) {
                let action = data.fragments.wfacp_ajax_data.action;
                let aero_data = data.fragments.wfacp_ajax_data;
                wfacp_frontend.hooks.doAction('wfacp_ajax_response', aero_data, fragments);
                wfacp_frontend.hooks.doAction('wfacp_ajax_' + action, aero_data, fragments);
                let callback_id = data.fragments.wfacp_ajax_data.callback_id;
                if ('' !== callback_id && wfacp_frontend.call_backs.hasOwnProperty(callback_id) && typeof wfacp_frontend.call_backs[callback_id] == "function") {
                    wfacp_frontend.call_backs[callback_id](data.fragments.wfacp_ajax_data, data.fragments);
                }
            } else {
                wfacp_frontend.hooks.doAction('wfacp_update_order_review_response', fragments, fragments);
            }

            if (data.hasOwnProperty('messages') && '' !== data.messages) {
                $('.wfacp-notices-wrapper').html('');
            }

            if (fragments.hasOwnProperty('place_order_text') && '' !== fragments.place_order_text) {
                let place_order_btn = $('#place_order');
                place_order_btn.val(fragments.place_order_text)
                place_order_btn.html(fragments.place_order_text);
                place_order_btn.attr('data-value', fragments.place_order_text);
            }

            unblockElements();
        }
    });
    $(document.body).on('wfacp_updated_checkout', function (e, data) {
        if (typeof data == "object" && data.hasOwnProperty('fragments') && data.fragments.hasOwnProperty('wfacp_ajax_data') && '' !== data.fragments.wfacp_ajax_data.action) {

            let action = data.fragments.wfacp_ajax_data.action;
            let aero_data = data.fragments.wfacp_ajax_data;
            let fragments = data.fragments;
            wfacp_frontend.hooks.doAction('wfacp_ajax_response', aero_data, fragments);
            wfacp_frontend.hooks.doAction('wfacp_ajax_' + action, aero_data, fragments);
            let callback_id = data.fragments.wfacp_ajax_data.callback_id;
            if ('' !== callback_id && wfacp_frontend.call_backs.hasOwnProperty(callback_id) && typeof wfacp_frontend.call_backs[callback_id] == "function") {
                wfacp_frontend.call_backs[callback_id](data.fragments.wfacp_ajax_data, data.fragments);
            }
            unblockElements();
        }
    });
})(jQuery);
