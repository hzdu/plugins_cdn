jQuery(document).ready(function ($) {
    /* global wpdiscuzAjaxObj */
    $(document).on('click', 'body', function (e) {
        var container = $('#wcaiInfoShort');

        if (container.is(':visible')) {
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                container.fadeOut(300);
                $('#wcaiInfoShort').html('');
            }
        }
    });

    $(document).on('click', '.wcai-list-item', function () {
        var parent = $(this).parents('.wcai-wrapper');
        var infoType = $('.wcai-info-type', parent).val();
        var relValue = $('input.wcai-rel', this).val();
        var $this = $(this);
        if (!$('#wcaiInfo #' + relValue).html().length) {
            var data = new FormData();
            data.append('action', $this.attr('data-action'));
            data.append('page', 0);
            data.append('commentId', $('#wcaiInfo .wcai-wrapper .wcai-comment-id').val());
            wpdiscuzAjaxObj.getAjaxObj(true, true, data).done(function (r) {
                if (r) {
                    $('#' + infoType + ' .wcai-list-item').removeClass('wcai-active');
                    $('#' + infoType + ' .wcai-content-item').removeClass('wcai-active');
                    $this.addClass('wcai-active');
                    $('#' + infoType + ' #' + relValue).addClass('wcai-active');
                    $('#wcaiInfo #' + relValue).html(r);
                }
                $('#wpdiscuz-loading-bar').hide();
            });
        } else {
            $('#' + infoType + ' .wcai-list-item').removeClass('wcai-active');
            $('#' + infoType + ' .wcai-content-item').removeClass('wcai-active');
            $(this).addClass('wcai-active');
            $('#' + infoType + ' #' + relValue).addClass('wcai-active');
        }
    });

    $(document).on('mouseover', '.wcai-short-info.wcai-not-clicked', function (e) {
        e.preventDefault();
        var elem = $(this);
        var attrId = elem.parents('.wpd-comment').attr('id');
        var commentId = attrId.substring(attrId.lastIndexOf('-') + 1, attrId.lastIndexOf('_'));
        var popupCurrentCommentId = $('.wcai-comment-id', '#wcaiInfoShort').val();
        var wpdir = (document.dir != undefined) ? document.dir : document.getElementsByTagName("html")[0].getAttribute("dir");
        if (commentId != popupCurrentCommentId) {
            var elemPosition = elem.offset();
            var elemW = elem.outerWidth();
            var elemH = elem.outerHeight();
            elem.removeClass('wcai-not-clicked');
            var data = new FormData();
            data.append('action', 'wcaiGetShortInfo');
            data.append('commentId', commentId);
            wpdiscuzAjaxObj.getAjaxObj(true, true, data).done(function (resp) {
                elem.addClass('wcai-not-clicked');
                if (resp) {
                    $('#wcaiInfoShort').html(resp);
                    $('#wcaiInfoShort').fadeIn(300);
                    $('#wcaiInfoShort').css('top', elemPosition.top - elemH * 0.08);
                    if( wpdir == 'rtl' ){
                        $('#wcaiInfoShort').css('left', elemPosition.left - 210);
                    } else {
                        $('#wcaiInfoShort').css('left', elemPosition.left + elemW);
                    }
                }
                $('#wpdiscuz-loading-bar').hide();
            });
        }
        return false;
    });

    $(document).on('click', '.wcai-uname-info.wcai-not-clicked', function (e) {
        e.preventDefault();
        var elem = $(this);
        elem.removeClass('wcai-not-clicked');
        var attrId = elem.parents('.wpd-comment-right').attr('id');
        var commentId = attrId.substring(attrId.lastIndexOf('-') + 1);
        var data = new FormData();
        data.append('commentId', commentId);
        wcaiFullInfo(elem, data);
        return false;
    });

    $(document).on('click', '.wcai-info.wcai-not-clicked', function (e) {
        var elem = $(this);
        elem.removeClass('wcai-not-clicked');
        var attrId = elem.attr('id');
        var commentId = attrId.substring(attrId.lastIndexOf('_') + 1);
        var data = new FormData();
        data.append('commentId', commentId);
        wcaiFullInfo(elem, data);
        e.preventDefault();
        return false;
    });

    $(document).on('click', '.wcai-finfo.wcai-not-clicked', function (e) {
        var elem = $(this);
        elem.removeClass('wcai-not-clicked');
        var commentId = $('#wcaiInfoShort .wcai-wrapper .wcai-comment-id').val();
        $('#wcaiInfoShort').html('');
        $('#wcaiInfoShort').hide('');
        var data = new FormData();
        data.append('commentId', commentId);
        wcaiFullInfo(elem, data);
        e.preventDefault();
        return false;
    });

    function wcaiFullInfo(elem, data) {
        data.append('action', 'wcaiGetInfo');
        wpdiscuzAjaxObj.getAjaxObj(true, true, data).done(function (resp) {
            elem.addClass('wcai-not-clicked');
            if (resp) {
                $('#wcaiInfo').html(resp);
                $('#wcaiInfo ul.wcai-list .wcai-list-item:first-child').addClass('wcai-active');
                $('#wcaiInfo div.wcai-content .wcai-content-item:first-child').addClass('wcai-active');

                if (!($('#wcaiInfo').is(':visible'))) {
                    $('#wcaiInfoAnchor').trigger('click');
                }
            }
            $('#wpdiscuz-loading-bar').hide();
        });
    }

    $(document).on('click', '.wcai-page-link.wcai-not-clicked', function (e) {
        e.preventDefault();
        var button = $(this);
        button.removeClass('wcai-not-clicked');
        var goToPage = button.data('wcai-page');
        var commentId = $('#wcaiInfo .wcai-wrapper .wcai-comment-id').val();
        var action = $('.wcai-active .wcai-pagination .wcai-action').val();
        var data = new FormData();
        data.append('action', action);
        data.append('commentId', commentId);
        data.append('page', goToPage);
        wpdiscuzAjaxObj.getAjaxObj(true, true, data).done(function (resp) {
            button.addClass('wcai-not-clicked');
            if (resp) {
                $('.wcai-content-item.wcai-active').html(resp);
            }
            $('#wpdiscuz-loading-bar').hide();
        });
    });

    $(document).on('click', '.wcai-unsubscribe.wcai-not-clicked', function (e) {
        e.preventDefault();
        var button = $(this);
        var sId = button.data('wcai-sid');
        var commentId = $('#wcaiInfo .wcai-wrapper .wcai-comment-id').val();
        var goToPage = $('.wcai-wrapper .wcai-page-number').val();
        var childCount = $('.wcai-content-item.wcai-active').children('.wcai-item').length;
        if (childCount == 1 && goToPage > 0) {
            goToPage = goToPage - 1;
        }
        var data = new FormData();
        data.append('action', 'wcaiUnsubscribe');
        data.append('sId', sId);
        data.append('commentId', commentId);
        data.append('page', goToPage);
        wpdiscuzAjaxObj.getAjaxObj(true, true, data).done(function (resp) {
            $('.wcai-content-item.wcai-active').html(resp);
            $('#wpdiscuz-loading-bar').hide();
        });
    });

    $(document).on('click', '.wcai-unfollow.wcai-not-clicked', function (e) {
        e.preventDefault();
        var button = $(this);
        var fId = button.data('wcai-fid');
        var commentId = $('#wcaiInfo .wcai-wrapper .wcai-comment-id').val();
        var goToPage = $('.wcai-wrapper .wcai-page-number').val();
        var childCount = $('.wcai-content-item.wcai-active').children('.wcai-item').length;
        if (childCount == 1 && goToPage > 0) {
            goToPage = goToPage - 1;
        }
        var data = new FormData();
        data.append('action', 'wcaiUnfollow');
        data.append('fId', fId);
        data.append('commentId', commentId);
        data.append('page', goToPage);
        wpdiscuzAjaxObj.getAjaxObj(true, true, data).done(function (resp) {
            $('.wcai-content-item.wcai-active').html(resp);
            $('#wpdiscuz-loading-bar').hide();
        });
    });

});
/*! Lity - v2.2.2 - 2016-12-14
 * http://sorgalla.com/lity/
 * Copyright (c) 2015-2016 Jan Sorgalla; Licensed MIT */(function (window, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function ($) {
            return factory(window, $)
        })
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(window, require('jquery'))
    } else {
        window.lity = factory(window, window.jQuery || window.Zepto)
    }
}(typeof window !== "undefined" ? window : this, function (window, $) {
    'use strict';
    var document = window.document;
    var _win = $(window);
    var _deferred = $.Deferred;
    var _html = $('html');
    var _instances = [];
    var _attrAriaHidden = 'aria-hidden';
    var _dataAriaHidden = 'lity-' + _attrAriaHidden;
    var _focusableElementsSelector = 'a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,object,embed,[contenteditable],[tabindex]:not([tabindex^="-"])';
    var _defaultOptions = {handler: null, handlers: {image: imageHandler, inline: inlineHandler, youtube: youtubeHandler, vimeo: vimeoHandler, googlemaps: googlemapsHandler, facebookvideo: facebookvideoHandler, iframe: iframeHandler}, template: '<div class="lity" role="dialog" aria-label="Dialog Window (Press escape to close)" tabindex="-1"><div class="lity-wrap" data-lity-close role="document"><div class="lity-loader" aria-hidden="true">Loading...</div><div class="lity-container"><div class="lity-content"></div><button class="lity-close" type="button" aria-label="Close (Press escape to close)" data-lity-close>&times;</button></div></div></div>'};
    var _imageRegexp = /(^data:image\/)|(\.(png|jpe?g|gif|svg|webp|bmp|ico|tiff?)(\?\S*)?$)/i;
    var _youtubeRegex = /(youtube(-nocookie)?\.com|youtu\.be)\/(watch\?v=|v\/|u\/|embed\/?)?([\w-]{11})(.*)?/i;
    var _vimeoRegex = /(vimeo(pro)?.com)\/(?:[^\d]+)?(\d+)\??(.*)?$/;
    var _googlemapsRegex = /((maps|www)\.)?google\.([^\/\?]+)\/?((maps\/?)?\?)(.*)/i;
    var _facebookvideoRegex = /(facebook\.com)\/([a-z0-9_-]*)\/videos\/([0-9]*)(.*)?$/i;
    var _transitionEndEvent = (function () {
        var el = document.createElement('div');
        var transEndEventNames = {WebkitTransition: 'webkitTransitionEnd', MozTransition: 'transitionend', OTransition: 'oTransitionEnd otransitionend', transition: 'transitionend'};
        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return transEndEventNames[name]
            }
        }
        return false
    })();
    function transitionEnd(element) {
        var deferred = _deferred();
        if (!_transitionEndEvent || !element.length) {
            deferred.resolve()
        } else {
            element.one(_transitionEndEvent, deferred.resolve);
            setTimeout(deferred.resolve, 500)
        }
        return deferred.promise()
    }
    function settings(currSettings, key, value) {
        if (arguments.length === 1) {
            return $.extend({}, currSettings)
        }
        if (typeof key === 'string') {
            if (typeof value === 'undefined') {
                return typeof currSettings[key] === 'undefined' ? null : currSettings[key]
            }
            currSettings[key] = value
        } else {
            $.extend(currSettings, key)
        }
        return this
    }
    function parseQueryParams(params) {
        var pairs = decodeURI(params.split('#')[0]).split('&');
        var obj = {}, p;
        for (var i = 0, n = pairs.length; i < n; i++) {
            if (!pairs[i]) {
                continue
            }
            p = pairs[i].split('=');
            obj[p[0]] = p[1]
        }
        return obj
    }
    function appendQueryParams(url, params) {
        return url + (url.indexOf('?') > -1 ? '&' : '?') + $.param(params)
    }
    function transferHash(originalUrl, newUrl) {
        var pos = originalUrl.indexOf('#');
        if (-1 === pos) {
            return newUrl
        }
        if (pos > 0) {
            originalUrl = originalUrl.substr(pos)
        }
        return newUrl + originalUrl
    }
    function error(msg) {
        return $('<span class="lity-error"/>').append(msg)
    }
    function imageHandler(target, instance) {
        var desc = (instance.opener() && instance.opener().data('lity-desc')) || 'Image with no description';
        var img = $('<img src="' + target + '" alt="' + desc + '"/>');
        var deferred = _deferred();
        var failed = function () {
            deferred.reject(error('Failed loading image'))
        };
        img.on('load', function () {
            if (this.naturalWidth === 0) {
                return failed()
            }
            deferred.resolve(img)
        }).on('error', failed);
        return deferred.promise()
    }
    imageHandler.test = function (target) {
        return _imageRegexp.test(target)
    };
    function inlineHandler(target, instance) {
        var el, placeholder, hasHideClass;
        try {
            el = $(target)
        } catch (e) {
            return false
        }
        if (!el.length) {
            return false
        }
        placeholder = $('<i style="display:none !important"/>');
        hasHideClass = el.hasClass('lity-hide');
        instance.element().one('lity:remove', function () {
            placeholder.before(el).remove();
            if (hasHideClass && !el.closest('.lity-content').length) {
                el.addClass('lity-hide')
            }
        });
        return el.removeClass('lity-hide').after(placeholder)
    }
    function youtubeHandler(target) {
        var matches = _youtubeRegex.exec(target);
        if (!matches) {
            return false
        }
        return iframeHandler(transferHash(target, appendQueryParams('https://www.youtube' + (matches[2] || '') + '.com/embed/' + matches[4], $.extend({autoplay: 1}, parseQueryParams(matches[5] || '')))))
    }
    function vimeoHandler(target) {
        var matches = _vimeoRegex.exec(target);
        if (!matches) {
            return false
        }
        return iframeHandler(transferHash(target, appendQueryParams('https://player.vimeo.com/video/' + matches[3], $.extend({autoplay: 1}, parseQueryParams(matches[4] || '')))))
    }
    function facebookvideoHandler(target) {
        var matches = _facebookvideoRegex.exec(target);
        if (!matches) {
            return false
        }
        if (0 !== target.indexOf('http')) {
            target = 'https:' + target
        }
        return iframeHandler(transferHash(target, appendQueryParams('https://www.facebook.com/plugins/video.php?href=' + target, $.extend({autoplay: 1}, parseQueryParams(matches[4] || '')))))
    }
    function googlemapsHandler(target) {
        var matches = _googlemapsRegex.exec(target);
        if (!matches) {
            return false
        }
        return iframeHandler(transferHash(target, appendQueryParams('https://www.google.' + matches[3] + '/maps?' + matches[6], {output: matches[6].indexOf('layer=c') > 0 ? 'svembed' : 'embed'})))
    }
    function iframeHandler(target) {
        return'<div class="lity-iframe-container"><iframe frameborder="0" allowfullscreen src="' + target + '"/></div>'
    }
    function winHeight() {
        return document.documentElement.clientHeight ? document.documentElement.clientHeight : Math.round(_win.height())
    }
    function keydown(e) {
        var current = currentInstance();
        if (!current) {
            return
        }
        if (e.keyCode === 27) {
            current.close()
        }
        if (e.keyCode === 9) {
            handleTabKey(e, current)
        }
    }
    function handleTabKey(e, instance) {
        var focusableElements = instance.element().find(_focusableElementsSelector);
        var focusedIndex = focusableElements.index(document.activeElement);
        if (e.shiftKey && focusedIndex <= 0) {
            focusableElements.get(focusableElements.length - 1).trigger('focus');
            e.preventDefault()
        } else if (!e.shiftKey && focusedIndex === focusableElements.length - 1) {
            focusableElements.get(0).trigger('focus');
            e.preventDefault()
        }
    }
    function resize() {
        $.each(_instances, function (i, instance) {
            instance.resize()
        })
    }
    function registerInstance(instanceToRegister) {
        if (1 === _instances.unshift(instanceToRegister)) {
            _html.addClass('lity-active');
            _win.on({resize: resize, keydown: keydown})
        }
        $('body > *').not(instanceToRegister.element()).addClass('lity-hidden').each(function () {
            var el = $(this);
            if (undefined !== el.data(_dataAriaHidden)) {
                return
            }
            el.data(_dataAriaHidden, el.attr(_attrAriaHidden) || null)
        }).attr(_attrAriaHidden, 'true')
    }
    function removeInstance(instanceToRemove) {
        var show;
        instanceToRemove.element().attr(_attrAriaHidden, 'true');
        if (1 === _instances.length) {
            _html.removeClass('lity-active');
            _win.off({resize: resize, keydown: keydown})
        }
        _instances = $.grep(_instances, function (instance) {
            return instanceToRemove !== instance
        });
        if (!!_instances.length) {
            show = _instances[0].element()
        } else {
            show = $('.lity-hidden')
        }
        show.removeClass('lity-hidden').each(function () {
            var el = $(this), oldAttr = el.data(_dataAriaHidden);
            if (!oldAttr) {
                el.removeAttr(_attrAriaHidden)
            } else {
                el.attr(_attrAriaHidden, oldAttr)
            }
            el.removeData(_dataAriaHidden)
        })
    }
    function currentInstance() {
        if (0 === _instances.length) {
            return null
        }
        return _instances[0]
    }
    function factory(target, instance, handlers, preferredHandler) {
        var handler = 'inline', content;
        var currentHandlers = $.extend({}, handlers);
        if (preferredHandler && currentHandlers[preferredHandler]) {
            content = currentHandlers[preferredHandler](target, instance);
            handler = preferredHandler
        } else {
            $.each(['inline', 'iframe'], function (i, name) {
                delete currentHandlers[name];
                currentHandlers[name] = handlers[name]
            });
            $.each(currentHandlers, function (name, currentHandler) {
                if (!currentHandler) {
                    return true
                }
                if (currentHandler.test && !currentHandler.test(target, instance)) {
                    return true
                }
                content = currentHandler(target, instance);
                if (false !== content) {
                    handler = name;
                    return false
                }
            })
        }
        return{handler: handler, content: content || ''}
    }
    function Lity(target, options, opener, activeElement) {
        var self = this;
        var result;
        var isReady = false;
        var isClosed = false;
        var element;
        var content;
        options = $.extend({}, _defaultOptions, options);
        element = $(options.template);
        self.element = function () {
            return element
        };
        self.opener = function () {
            return opener
        };
        self.options = $.proxy(settings, self, options);
        self.handlers = $.proxy(settings, self, options.handlers);
        self.resize = function () {
            if (!isReady || isClosed) {
                return
            }
            content.css('max-height', (winHeight() - 60) + 'px').trigger('lity:resize', [self])
        };
        self.close = function () {
            if (!isReady || isClosed) {
                return
            }
            isClosed = true;
            removeInstance(self);
            var deferred = _deferred();
            if (activeElement && (document.activeElement === element[0] || $.contains(element[0], document.activeElement))) {
                try {
                    activeElement.trigger('focus')
                } catch (e) {
                }
            }
            content.trigger('lity:close', [self]);
            element.removeClass('lity-opened').addClass('lity-closed');
            transitionEnd(content.add(element)).always(function () {
                content.trigger('lity:remove', [self]);
                element.remove();
                element = undefined;
                deferred.resolve()
            });
            return deferred.promise()
        };
        result = factory(target, self, options.handlers, options.handler);
        element.attr(_attrAriaHidden, 'false').addClass('lity-loading lity-opened lity-' + result.handler).appendTo('body').trigger('focus').on('click', '[data-lity-close]', function (e) {
            if ($(e.target).is('[data-lity-close]')) {
                self.close()
            }
        }).trigger('lity:open', [self]);
        registerInstance(self);
        $.when(result.content).always(ready);
        function ready(result) {
            content = $(result).css('max-height', (winHeight() - 60) + 'px');
            element.find('.lity-loader').each(function () {
                var loader = $(this);
                transitionEnd(loader).always(function () {
                    loader.remove()
                })
            });
            element.removeClass('lity-loading').find('.lity-content').empty().append(content);
            isReady = true;
            content.trigger('lity:ready', [self])
        }
    }
    function wcaiLity(target, options, opener) {
        if (!target.preventDefault) {
            opener = $(opener)
        } else {
            target.preventDefault();
            opener = $(this);
            target = opener.data('lity-target') || opener.attr('href') || opener.attr('rel') || opener.attr('src')
        }
        var instance = new Lity(target, $.extend({}, opener.data('lity-options') || opener.data('lity'), options), opener, document.activeElement);
        if (!target.preventDefault) {
            return instance;
        }
    }
    wcaiLity.version = '2.2.2';
    wcaiLity.options = $.proxy(settings, wcaiLity, _defaultOptions);
    wcaiLity.handlers = $.proxy(settings, wcaiLity, _defaultOptions.handlers);
    wcaiLity.current = currentInstance;
    $(document).on('click.lity', '[data-wcai-lity]', wcaiLity);
    return wcaiLity;
}));