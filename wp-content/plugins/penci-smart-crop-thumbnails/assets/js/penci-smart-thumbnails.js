jQuery(document).ready(function($) {
var helper = {
    isObject: function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    },
    isUndefined: function (obj) {

        return obj === void 0;
    },

    notify: function ($el, message) {

        $el.append("<div class='penci-st-user-message success' style='display: none;'>" + message + "</div>");

        $(".penci-st-user-message", $el).fadeIn().delay(5e3).queue(function (n) {

            $(this).fadeOut(function () {
                $(this).remove();
            });
            n();
        });
    },

    defaultFocusPoint: function (imageWidth, imageHeight) {

        if (loc.get('portrait_default_top') &&
            this.isImagePortrait(imageWidth, imageHeight)) {

            return [0.5, 0];
        }

        return loc.get('default_fp');
    },

    isImagePortrait: function (imageWidth, imageHeight) {

        return ( imageWidth + ( imageHeight * 0.14 ) ) < imageHeight;
    }
};
var cache = {
    storage: {},

    add: function (name, data, group) {

        if (helper.isUndefined(cache[group]))
            cache[group] = {};

        cache[group][name] = data;
    },

    get: function (name, group) {

        if (this.exist(name, group)) {

            return cache[group][name];
        }
    },

    exist: function (name, group) {

        return !helper.isUndefined(cache[group]) && !helper.isUndefined(cache[group][name]);
    }
};


var UI = {

    is_blocked: function ($element) {

        return !!$element.data('pencist-blocked');
    },

    block: function ($element) {

        if (this.is_blocked($element)) {
            return;
        }

        $element.data('pencist-blocked', true);

        $element.prepend('<div class="pencist-block-overlay" style="z-index:10;display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0;display:none;position: absolute;background:rgba(255,255,255,0.4)"></div>');

        $(".pencist-block-overlay").fadeIn();
    },


    unblock: function ($element) {

        if (!this.is_blocked($element)) {
            return;
        }

        $element.data('pencist-blocked', false);

        $(".pencist-block-overlay").fadeOut(function () {
            $(this).remove();
        });
    },
};


var loc = {

    get: function (loc) {

        if (!loc) {
            return;
        }

        if (loc.indexOf('.') == -1) {

            return st_loc[loc];
        }

        var _v = loc.split('.');
        var current = st_loc[_v[0]];
        _v = _v.splice(1);

        var len = _v.length - 1;

        for (var i = 0; i <= len; i++) {

            if (typeof current[_v[i]] !== 'object' && i !== len) {
                return;
            }

            current = current[_v[i]];
        }

        return current;
    },

    translate: function (index) {

        return this.get('translate.' + index);
    }
};
var previewData = {

    get: function (attachmentId, securityNonce) {

        return $.Deferred(function (deferred) {

            if (cache.exist(attachmentId, 'selector-data')) {

                deferred.resolveWith(this, [cache.get(attachmentId, 'selector-data')]);

                return;
            }

            var ajax = wp.ajax.post('penci-st-preview-thumbnails', {
                thumbnail_id: attachmentId,
                nonce: securityNonce
            });

            ajax.done(function (res) {
                cache.add(attachmentId, res, 'selector-data');
                deferred.resolveWith(this, [res]);
            });

            ajax.fail(function () {

                deferred.rejectWith(this);
            });
        }).promise();
    },
};
var previewModal = {

    info: {},

    setup: function (info) {

        this.info = info;

        this.open();
    },

    open: function () {

        var self = this;

        if (!self.info.images) {
            return;
        }


        $.penci_st_selector_modal({
            bsModal: {
                destroyHtml: true,
                show: true
            },

            noSidebar: true,

            id: 'penci-st-thumb-selector',
            modalClass: 'penci-st-modal',

            itemInnerHtml: '<div class="penci-st-item-container">\n    <figure>\n        <img src="{{img}}"\n             alt="{{label}}"\n             class="bs-style-thumbnail" data-current-image="{{current_img}}">\n    </figure>\n</div>',

            content: self.info.l10n,
            items: self.info.images.map(self.noCacheImage),

            itemsGroupSize: 9,

            events: {}
        }, {
            initialZIndex: 209901
        });
    },

    noCacheImage: function (obj) {

        obj.img += "?" + new Date().getTime();

        return obj;
    }
};
var focusPoint = {

    markerArea: 10,

    isMouseDown: false,
    $element: false,
    $container: false,

    options: {},

    events: {},

    setup: function (options, events) {

        this.events = events || {};
        this.options = options || {};

        if (this.prepare()) {

            this.bindEvents();

            return true;
        }

        return false;
    },

    prepare: function () {
        if (!this.options.$el || !this.options.$el.length) {
            return false;
        }

        this.$element = this.options.$el;
        this.$element.wrap("<div class='penci-st-focus-point'></div>");
        this.$container = this.$element.parent();
        this.$container.append('<div class="penci-st-focus-point-marker"></div>');

        if (this.options.defaultPosition) {
            this.fixMarkerPosition(this.options.defaultPosition);
        }

        if (this.options.grid) {
            this.appendGrid();
        }

        return true;
    },

    handle_event: function (event) {
        var args = Array.prototype.slice.call(arguments, 1);

        if (typeof this.events[event] === 'function')
            return this.events[event].apply(this, args);
    },

    appendGrid: function () {

        var $grid = $("<div>", {"class": "grid"}).insertAfter(this.$container.find('img'));

        $grid.html('<div class="x1"></div>\n<div class="x2"></div>\n\n<div class="y1"></div>\n<div class="y2"></div>');
    },

    fixMarkerPosition: function (pos) {

        var x = parseFloat(pos[0]),
            y = parseFloat(pos[1]);

        if (!(x >= 0 && x <= 1)) {
            return;
        }

        if (!(y >= 0 && y <= 1)) {
            return;
        }

        var $img = this.$container.find('img');
        var markerArea = this.markerArea;

        $(".penci-st-focus-point-marker", this.$container).css({
            top: Math.floor($img.height() * y) - markerArea,
            left: Math.floor($img.width() * x) - markerArea
        });
    },

    bindEvents: function () {

        var self = this;

        var markerArea = this.markerArea,
            $marker = $(".penci-st-focus-point-marker", this.$container);

        var $markerWrapper = (function () {

            var $m = self.options.parentSelector ? $(".penci-st-focus-point-marker", this.$container).closest(self.options.parentSelector) : '';

            if ($m && $m.length) {
                return $m;
            }

            return $(".penci-st-focus-point-marker", this.$container);

        })();

        $marker.mousedown(function () {

            self.isMouseDown = true;
        });

        $(".penci-st-focus-point").mousedown(function (e) {

            self.isMouseDown = true;

            $(document).trigger('mousemove.penci-st-focus-point', [e.pageX, e.pageY]);
        });


        $markerWrapper.mouseup(function () {

            if (!self.isMouseDown) {
                return;
            }

            self.isMouseDown = false;


            var top = parseInt($marker.css('top').replace('px', '')),
                left = parseInt($marker.css('left').replace('px', ''));

            var topPercent = Math.ceil((top + markerArea) / (self.$container.find('img').height() / 100)),
                leftPercent = Math.ceil((left + markerArea) / (self.$container.find('img').width() / 100));


            self.handle_event('done', Math.min(leftPercent, 100), Math.min(topPercent, 100));
        });

        var offset = this.$container.offset();

        if (!offset) {
            throw 'cannot initialize image focus point';
        }

        $(document).on('mousemove.penci-st-focus-point', function (e, pageX, pageY) {

            if (!self.isMouseDown) {
                return;
            }

            pageX = pageX || e.pageX;
            pageY = pageY || e.pageY;

            var x = pageX - offset.left - markerArea,
                y = pageY - offset.top - markerArea;


            var $img = self.$container.find('img'),
                box = {

                    top: $img.height() - markerArea,
                    left: $img.width() - markerArea,
                };

            y = Math.max(-markerArea, y);
            y = Math.min(box.top, y);

            x = Math.max(-markerArea, x);
            x = Math.min(box.left, x);

            $marker.css({
                top: Math.floor(y),
                left: Math.floor(x),
            });
        });
    }
};
var mediaModal = {

    initialized: false,
    $context: '',

    setup: function () {

        if (!wp || !wp.media) {
            return;
        }

        

        var self = this;

        if (wp.media.featuredImage && wp.media.featuredImage.frame) {

            this.initFeaturedImageModal();
        }

        if (wp.media.frames && self.isUploadPage()) {
            
            wp.media.view.Modal.prototype.on('open',function(e){
                
                var interval = setInterval(function () {

                    if (self.initFocusPoint()) {

                        clearInterval(interval);
                    }

                }, 200);
            });

            
        }
    },

    initFeaturedImageModal: function () {

        var self = this;

        var frame = wp.media.featuredImage.frame();
    
        frame.on('ready', function () {
            
            if (self.initialized) {
                return;
            }

            self.$context = this.models[0].frame.$el;
            self.initialized = true;

            wp.Uploader.queue.on('reset', function () { // Upload completed

                setTimeout(function () {
                    self.initFocusPoint();
                });
            });
        });
        
        frame.on('selection:toggle', function () { // Image selected
            self.initFocusPoint();
        });

        frame.on('uploader:ready', function (a) { // Image selected

            var interval = setInterval(function () {

                if (self.initFocusPoint()) {

                    clearInterval(interval);
                }

            }, 200);
        });

        if ( $('body').hasClass('block-editor-page') ) {
            

            wp.media.view.Modal.prototype.on('open',function(e){

                var interval = setInterval(function () {

                    if (self.initFocusPoint()) {

                        clearInterval(interval);
                    }

                }, 200);
                
            });

            $(document).on('click','.attachment.save-ready',function(event){
                
                self.initFocusPoint();
            });
        }

    },

    initMediaLibraryModal: function () {

        var self = this;

        wp.media.frames.edit.on('refresh', function (e) {
            self.initFocusPoint();
        });
    },

    initFocusPoint: function () {
        return focusPoint.setup({
                $el: $(".thumbnail-image img", this.$context),
                parentSelector: ".media-frame-content",
                grid: loc.get("grid"),
                defaultPosition: this.getFocusPoint()
            },
            {
                done: $.proxy(this.saveFocusPoint, this)
            }
        );
    },
    
    appendPreviewButton: function ($afterEl) {

        var self = this,
            link = "<input type='button' class='button preview-images-btn' value='" + loc.translate('preview') + "'>";

        var $link = $(link).insertAfter($afterEl);

        $link.on('click', function (e) {
            e.preventDefault();

            self.previewModal();
        });
    },

    previewModal: function () {

        var self = this;

        self.loading('start');

        var ajax = previewData.get(self.attachmentId(), self.securityNonce());

        ajax.done(function (res) {

            if (!helper.isUndefined(res.data))
                previewModal.setup(res.data);
        });

        ajax.always(function () {

            self.loading('stop');
        });

    },

    saveFocusPoint: function (topPercent, leftPercent) {

        this.regenerateThumbnails(topPercent, leftPercent);
        this.setFocusPoint(topPercent / 100, leftPercent / 100);
    },

    regenerateThumbnails: function (topPercent, leftPercent) {

        var self = this;

        var attachment_id = self.attachmentId();

        self.loading('start');

        var ajax = wp.ajax.post('penci-st-regenerate-thumbnails', {
            thumbnail_id: attachment_id,
            nonce: self.securityNonce(),
            focus_x: topPercent,
            focus_y: leftPercent,
        });

        ajax.done(function (res) {

            if (!helper.isUndefined(res.message)) {

                var $msgParent = self.isUploadPage() ? $(".thumbnail-image", self.$context) : $(".attachment-info", self.$context);

                helper.notify($msgParent, res.message);
            }
        });

        ajax.always(function () {

            self.loading('stop');
        });
    },

    loading: function (state) {

        switch (state) {

            case 'start':

                UI.block($(".attachment-info", this.$context));

                break;

            case 'stop':
                UI.unblock($(".attachment-info", this.$context));

                break;
        }
    },

    attachmentId: function () {

        if (this.isUploadPage()) {

            return this.getUrlParameter('item');

        } else {

            return $(".attachment.selected", this.$context).data('id');
        }
    },

    isUploadPage: function () {
        return $(document.body).hasClass('post-type-attachment');
    },
    
    isGutenberg: function() {
        return $(document.body).hasClass('block-editor-page');
    },

    securityNonce: function () {
        return $(".penci-st-regenerate-nonce", this.$context).val();
    },

    getFocusPoint: function () {

        var $attachment = $(".attachment.selected", this.$context),
            point = $attachment.data('focus-point'),
            dfp = this.isUploadPage() ? this.getMediaLibDefaultFocusPoint() : this.getDefaultFocusPoint(),
            cpoint;

            if ( this.getUrlParameter('item') ) {
                cpoint = this.getCookie('pcsct-' + this.getUrlParameter('item'));
                point = cpoint ? cpoint : point;
            };

        return point ? point.split('-') : dfp;

    },
    
    setFocusPoint: function (top, left) {

        $(".attachment.selected", this.$context).data("focus-point", top + "-" + left);

    },
    
    getDefaultFocusPoint: function () {

        var point = $(".penci-st-focus-point-xy", this.$context).val(),
            cpoint,
            $img = $(".thumbnail-image img", this.$context);

        return point && point.indexOf('-') > -1 ? point.split('-') : helper.defaultFocusPoint($img.width(), $img.height());
    },

    getMediaLibDefaultFocusPoint: function () {

        var point = $(".penci-st-focus-point-xy", this.$context).val(),
            $img = $(".attachment-details img.details-image", this.$context);

        return point && point.indexOf('-') > -1 ? point.split('-') : helper.defaultFocusPoint($img.width(), $img.height());
    },

    getUrlParameter: function(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    },

    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
};


mediaModal.setup();

});


