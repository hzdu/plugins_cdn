/**
 * bootbox.js v3.0.0
 *
 * http://bootboxjs.com/license.txt
 */
var bootbox = window.bootbox || (function(document, $) {

    var _animate       = true,
        _backdrop      = 'static',
        _defaultHref   = 'javascript:;',
        _classes       = '',
        _icons         = {},
        /* last var should always be the public object we'll return */
        that           = {};


    that.setIcons = function(icons) {
        _icons = icons;
        if (typeof _icons !== 'object' || _icons == null) {
            _icons = {};
        }
    };

    that.alert = function(/*str, label, cb*/) {
        var str   = "",
            label = _translate('Ok'),
            cb    = null;

        switch (arguments.length) {
            case 1:
                // no callback, default button label
                str = arguments[0];
                break;
            case 2:
                // callback *or* custom button label dependent on type
                str = arguments[0];
                if (typeof arguments[1] == 'function') {
                    cb = arguments[1];
                } else {
                    label = arguments[1];
                }
                break;
            case 3:
                // callback and custom button label
                str   = arguments[0];
                label = arguments[1];
                cb    = arguments[2];
                break;
            default:
                throw new Error("Incorrect number of arguments: expected 1-3");
                break;
        }

        return that.dialog(str, {
            // only button (ok)
            "label"   : label,
            "icon"    : _icons.OK,
            "callback": cb
        }, {
            // ensure that the escape key works; either invoking the user's
            // callback or true to just close the dialog
            "onEscape": cb || true
        });
    };

    that.confirm = function(/*str, labelCancel, labelOk, cb*/) {
        var str         = "",
            labelCancel = _translate('Cancel'),
            labelOk     = _translate('Confirm'),
            cb          = null;

        switch (arguments.length) {
            case 1:
                str = arguments[0];
                break;
            case 2:
                str = arguments[0];
                if (typeof arguments[1] == 'function') {
                    cb = arguments[1];
                } else {
                    labelCancel = arguments[1];
                }
                break;
            case 3:
                str         = arguments[0];
                labelCancel = arguments[1];
                if (typeof arguments[2] == 'function') {
                    cb = arguments[2];
                } else {
                    labelOk = arguments[2];
                }
                break;
            case 4:
                str         = arguments[0];
                labelCancel = arguments[1];
                labelOk     = arguments[2];
                cb          = arguments[3];
                break;
            default:
                throw new Error("Incorrect number of arguments: expected 1-4");
                break;
        }

        var cancelCallback = function() {
            if (typeof cb === 'function') {
                cb(false);
            }
        };

        var confirmCallback = function() {
            if (typeof cb === 'function') {
                cb(true);
            }
        };

        return that.dialog(str, [{
            // first button (cancel)
            "label"   : labelCancel,
            "icon"    : _icons.CANCEL,
            "callback": cancelCallback
        }, {
            // second button (confirm)
            "label"   : labelOk,
            "icon"    : _icons.CONFIRM,
            "callback": confirmCallback
        }], {
            // escape key bindings
            "onEscape": cancelCallback
        });
    };

    that.prompt = function(/*str, labelCancel, labelOk, cb, defaultVal*/) {
        var str         = "",
            labelCancel = _translate('Cancel'),
            labelOk     = _translate('Confirm'),
            cb          = null,
            defaultVal  = "";

        switch (arguments.length) {
            case 1:
                str = arguments[0];
                break;
            case 2:
                str = arguments[0];
                if (typeof arguments[1] == 'function') {
                    cb = arguments[1];
                } else {
                    labelCancel = arguments[1];
                }
                break;
            case 3:
                str         = arguments[0];
                labelCancel = arguments[1];
                if (typeof arguments[2] == 'function') {
                    cb = arguments[2];
                } else {
                    labelOk = arguments[2];
                }
                break;
            case 4:
                str         = arguments[0];
                labelCancel = arguments[1];
                labelOk     = arguments[2];
                cb          = arguments[3];
                break;
            case 5:
                str         = arguments[0];
                labelCancel = arguments[1];
                labelOk     = arguments[2];
                cb          = arguments[3];
                defaultVal  = arguments[4];
                break;
            default:
                throw new Error("Incorrect number of arguments: expected 1-5");
                break;
        }

        var header = str;

        // let's keep a reference to the form object for later
        var form = $("<form></form>");
        form.append("<input autocomplete=off type=text value='" + defaultVal + "' />");

        var cancelCallback = function() {
            if (typeof cb === 'function') {
                // yep, native prompts dismiss with null, whereas native
                // confirms dismiss with false...
                cb(null);
            }
        };

        var confirmCallback = function() {
            if (typeof cb === 'function') {
                cb(form.find("input[type=text]").val());
            }
        };

        var div = that.dialog(form, [{
            // first button (cancel)
            "label"   : labelCancel,
            "icon"    : _icons.CANCEL,
            "callback":  cancelCallback
        }, {
            // second button (confirm)
            "label"   : labelOk,
            "icon"    : _icons.CONFIRM,
            "callback": confirmCallback
        }], {
            // prompts need a few extra options
            "header"  : header,
            // explicitly tell dialog NOT to show the dialog...
            "show"    : false,
            "onEscape": cancelCallback
        });

        // ... the reason the prompt needs to be hidden is because we need
        // to bind our own "shown" handler, after creating the modal but
        // before any show(n) events are triggered
        // @see https://github.com/makeusabrew/bootbox/issues/69

        div.on("shown", function() {
            form.find("input[type=text]").focus();

            // ensure that submitting the form (e.g. with the enter key)
            // replicates the behaviour of a normal prompt()
            form.on("submit", function(e) {
                e.preventDefault();
                div.find(".button-primary").click();
            });
        });

        div.modal("show");
div.fadeIn();
        return div;
    };

    that.dialog = function(str, handlers, options) {
        var buttons    = "",
            callbacks  = [],
            options    = options || {};

        // check for single object and convert to array if necessary
        if (handlers == null) {
            handlers = [];
        } else if (typeof handlers.length == 'undefined') {
            handlers = [handlers];
        }

        var i = handlers.length;
        while (i--) {
            var label    = null,
                href     = null,
                _class   = null,
                icon     = '',
                callback = null;

            if (typeof handlers[i]['label']    == 'undefined' &&
                typeof handlers[i]['class']    == 'undefined' &&
                typeof handlers[i]['callback'] == 'undefined') {
                // if we've got nothing we expect, check for condensed format

                var propCount = 0,      // condensed will only match if this == 1
                    property  = null;   // save the last property we found

                // be nicer to count the properties without this, but don't think it's possible...
                for (var j in handlers[i]) {
                    property = j;
                    if (++propCount > 1) {
                        // forget it, too many properties
                        break;
                    }
                }

                if (propCount == 1 && typeof handlers[i][j] == 'function') {
                    // matches condensed format of label -> function
                    handlers[i]['label']    = property;
                    handlers[i]['callback'] = handlers[i][j];
                }
            }

            if (typeof handlers[i]['callback']== 'function') {
                callback = handlers[i]['callback'];
            }

            if (handlers[i]['class']) {
                _class = handlers[i]['class'];
            } else if (i == handlers.length -1 && handlers.length <= 2) {
                // always add a primary to the main option in a two-button dialog
                _class = 'button-primary';
            }

            if (handlers[i]['label']) {
                label = handlers[i]['label'];
            } else {
                label = "Option "+(i+1);
            }

            if (handlers[i]['icon']) {
                icon = "<i class='"+handlers[i]['icon']+"'></i> ";
            }

            if (handlers[i]['href']) {
                href = handlers[i]['href'];
            }
            else {
                href = _defaultHref;
            }

            buttons = "<a data-handler='"+i+"' class='button "+_class+"' href='" + href + "'>"+icon+""+label+"</a>" + buttons;

            callbacks[i] = callback;
        }

        // @see https://github.com/makeusabrew/bootbox/issues/46#issuecomment-8235302
        // and https://github.com/twitter/bootstrap/issues/4474
        // for an explanation of the inline overflow: hidden
        // @see https://github.com/twitter/bootstrap/issues/4854
        // for an explanation of tabIndex=-1

        var parts = ["<div class='bootbox modal' tabindex='-1' style='overflow:hidden;'>"];

        if (options['header']) {
            var closeButton = '';
            if (typeof options['headerCloseButton'] == 'undefined' || options['headerCloseButton']) {
                closeButton = "<a href='"+_defaultHref+"' class='close'>&times;</a>";
            }

            parts.push("<div class='modal-header'>"+closeButton+"<h3>"+options['header']+"</h3></div>");
        }

        // push an empty body into which we'll inject the proper content later
        parts.push("<div class='modal-body'></div>");

        if (buttons) {
            parts.push("<div class='modal-footer'>"+buttons+"</div>");
        }

        parts.push("</div>");

        var div = $(parts.join("\n"));

        // check whether we should fade in/out
        var shouldFade = (typeof options.animate === 'undefined') ? _animate : options.animate;

        if (shouldFade) {
            div.addClass("fade");
        }

        var optionalClasses = (typeof options.classes === 'undefined') ? _classes : options.classes;
        if (optionalClasses) {
            div.addClass(optionalClasses);
        }

        // now we've built up the div properly we can inject the content whether it was a string or a jQuery object
        div.find(".modal-body").html(str);

        div.on('hidden', function() {
            div.remove();
        });

        // hook into the modal's keyup trigger to check for the escape key
        div.on('keyup.dismiss.modal', function(e) {
            // any truthy value passed to onEscape will dismiss the dialog...
            if (e.which == 27 && options.onEscape) {
                if (typeof options.onEscape === 'function') {
                    // ... but only a function will be invoked (obviously)
                    options.onEscape();
                }

                div.modal('hide');
            }
        });

        // well, *if* we have a primary - give the first dom element focus
        div.on('shown', function() {
            div.find("a.button-primary:first").focus();
        });

        // wire up button handlers
        div.on('click', '.modal-footer a, a.close', function(e) {

            var handler   = $(this).data("handler"),
                cb        = callbacks[handler],
                hideModal = null;

            // sort of @see https://github.com/makeusabrew/bootbox/pull/68 - heavily adapted
            // if we've got a custom href attribute, all bets are off
            if (typeof handler                   !== 'undefined' &&
                typeof handlers[handler]['href'] !== 'undefined') {

                return;
            }

            e.preventDefault();

            if (typeof cb == 'function') {
                hideModal = cb();
            }

            // the only way hideModal *will* be false is if a callback exists and
            // returns it as a value. in those situations, don't hide the dialog
            // @see https://github.com/makeusabrew/bootbox/pull/25
            if (hideModal !== false) {
                div.modal("hide");
                $('.modal-backdrop').remove();
            }
        });

        // stick the modal right at the bottom of the main body out of the way
        $("#wpfd-core").append(div);

        div.modal({
            // unless explicitly overridden take whatever our default backdrop value is
            backdrop : (typeof options.backdrop  === 'undefined') ? _backdrop : options.backdrop,
            // ignore bootstrap's keyboard options; we'll handle this ourselves (more fine-grained control)
            keyboard : false,
            // @ see https://github.com/makeusabrew/bootbox/issues/69
            // we *never* want the modal to be shown before we can bind stuff to it
            // this method can also take a 'show' option, but we'll only use that
            // later if we need to
            show     : false
        });

        // @see https://github.com/makeusabrew/bootbox/issues/64
        // @see https://github.com/makeusabrew/bootbox/issues/60
        // ...caused by...
        // @see https://github.com/twitter/bootstrap/issues/4781
        div.on("show", function(e) {
            $(document).off("focusin.modal");
        });

        if (typeof options.show === 'undefined' || options.show === true) {
            div.modal("show");
            div.addClass('in');
        }

        return div;
    };

    /**
     * #modal is deprecated in v3; it can still be used but no guarantees are
     * made - have never been truly convinced of its merit but perhaps just
     * needs a tidyup and some TLC
     */
    that.modal = function(/*str, label, options*/) {
        var str;
        var label;
        var options;

        var defaultOptions = {
            "onEscape": null,
            "keyboard": true,
            "backdrop": _backdrop
        };

        switch (arguments.length) {
            case 1:
                str = arguments[0];
                break;
            case 2:
                str = arguments[0];
                if (typeof arguments[1] == 'object') {
                    options = arguments[1];
                } else {
                    label = arguments[1];
                }
                break;
            case 3:
                str     = arguments[0];
                label   = arguments[1];
                options = arguments[2];
                break;
            default:
                throw new Error("Incorrect number of arguments: expected 1-3");
                break;
        }

        defaultOptions['header'] = label;

        if (typeof options == 'object') {
            options = $.extend(defaultOptions, options);
        } else {
            options = defaultOptions;
        }

        return that.dialog(str, [], options);
    };


    that.hideAll = function() {
        $(".bootbox").modal("hide");
    };

    that.animate = function(animate) {
        _animate = animate;
    };

    that.backdrop = function(backdrop) {
        _backdrop = backdrop;
    };

    that.classes = function(classes) {
        _classes = classes;
    };

    function _translate(str) {
        return str;
    }

    return that;

}(document, window.jQuery));

// @see https://github.com/makeusabrew/bootbox/issues/71
window.bootbox = bootbox;
