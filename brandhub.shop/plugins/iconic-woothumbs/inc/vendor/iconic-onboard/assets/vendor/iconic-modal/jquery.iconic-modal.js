/*! Iconic Modal (based on Magnific Popup - v1.1.0)
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
;(function (factory) { 
if (typeof define === 'function' && define.amd) { 
 // AMD. Register as an anonymous module. 
 define(['jquery'], factory); 
 } else if (typeof exports === 'object') { 
 // Node/CommonJS 
 factory(require('jquery')); 
 } else { 
 // Browser globals 
 factory(window.jQuery || window.Zepto); 
 } 
 }(function($) { 

/*>>core*/
/**
 * 
 * Iconic Modal Core JS file
 * 
 */


/**
 * Private static constants
 */
var CLOSE_EVENT = 'Close',
	BEFORE_CLOSE_EVENT = 'BeforeClose',
	AFTER_CLOSE_EVENT = 'AfterClose',
	BEFORE_APPEND_EVENT = 'BeforeAppend',
	MARKUP_PARSE_EVENT = 'MarkupParse',
	OPEN_EVENT = 'Open',
	CHANGE_EVENT = 'Change',
	NS = 'imodal',
	EVENT_NS = '.' + NS,
	READY_CLASS = 'imodal-ready',
	REMOVING_CLASS = 'imodal-removing',
	PREVENT_CLOSE_CLASS = 'imodal-prevent-close';


/**
 * Private vars 
 */
/*jshint -W079 */
var imodal, // As we have only one instance of IconicModal object, we define it locally to not to use 'this'
	IconicModal = function(){},
	_isJQ = !!(window.jQuery),
	_prevStatus,
	_window = $(window),
	_document,
	_prevContentType,
	_wrapClasses,
	_currPopupType;


/**
 * Private functions
 */
var _imodalOn = function(name, f) {
		imodal.ev.on(NS + name + EVENT_NS, f);
	},
	_getEl = function(className, appendTo, html, raw) {
		var el = document.createElement('div');
		el.className = 'imodal-'+className;
		if(html) {
			el.innerHTML = html;
		}
		if(!raw) {
			el = $(el);
			if(appendTo) {
				el.appendTo(appendTo);
			}
		} else if(appendTo) {
			appendTo.appendChild(el);
		}
		return el;
	},
	_imodalTrigger = function(e, data) {
		imodal.ev.triggerHandler(NS + e, data);

		if(imodal.st.callbacks) {
			// converts "imodalEventName" to "eventName" callback and triggers it if it's present
			e = e.charAt(0).toLowerCase() + e.slice(1);
			if(imodal.st.callbacks[e]) {
				imodal.st.callbacks[e].apply(imodal, Array.isArray(data) ? data : [data]);
			}
		}
	},
	_getCloseBtn = function(type) {
		if(type !== _currPopupType || !imodal.currTemplate.closeBtn) {
			imodal.currTemplate.closeBtn = $( imodal.st.closeMarkup.replace('%title%', imodal.st.tClose ) );
			_currPopupType = type;
		}
		return imodal.currTemplate.closeBtn;
	},
	// Initialize Iconic Modal only when called at least once
	_checkInstance = function() {
		if(!$.iconicModal.instance) {
			/*jshint -W020 */
			imodal = new IconicModal();
			imodal.init();
			$.iconicModal.instance = imodal;
		}
	},
	// CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
	supportsTransitions = function() {
		var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
			v = ['ms','O','Moz','Webkit']; // 'v' for vendor

		if( s['transition'] !== undefined ) {
			return true; 
		}
			
		while( v.length ) {
			if( v.pop() + 'Transition' in s ) {
				return true;
			}
		}
				
		return false;
	};



/**
 * Public functions
 */
IconicModal.prototype = {

	constructor: IconicModal,

	/**
	 * Initializes Iconic Modal plugin. 
	 * This function is triggered only once when $.fn.iconicModal or $.iconicModal is executed
	 */
	init: function() {
		var appVersion = navigator.appVersion;
		imodal.isLowIE = imodal.isIE8 = document.all && !document.addEventListener;
		imodal.isAndroid = (/android/gi).test(appVersion);
		imodal.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
		imodal.supportsTransition = supportsTransitions();

		// We disable fixed positioned lightbox on devices that don't handle it nicely.
		// If you know a better way of detecting this - let me know.
		imodal.probablyMobile = (imodal.isAndroid || imodal.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent) );
		_document = $(document);

		imodal.popupsCache = {};
	},

	/**
	 * Opens popup
	 * @param  data [description]
	 */
	open: function(data) {

		var i;

		if(data.isObj === false) { 
			// convert jQuery collection to array to avoid conflicts later
			imodal.items = data.items.toArray();

			imodal.index = 0;
			var items = data.items,
				item;
			for(i = 0; i < items.length; i++) {
				item = items[i];
				if(item.parsed) {
					item = item.el[0];
				}
				if(item === data.el[0]) {
					imodal.index = i;
					break;
				}
			}
		} else {
			imodal.items = Array.isArray(data.items) ? data.items : [data.items];
			imodal.index = data.index || 0;
		}

		// if popup is already opened - we just update the content
		if(imodal.isOpen) {
			imodal.updateItemHTML();
			return;
		}
		
		imodal.types = []; 
		_wrapClasses = '';
		if(data.mainEl && data.mainEl.length) {
			imodal.ev = data.mainEl.eq(0);
		} else {
			imodal.ev = _document;
		}

		if(data.key) {
			if(!imodal.popupsCache[data.key]) {
				imodal.popupsCache[data.key] = {};
			}
			imodal.currTemplate = imodal.popupsCache[data.key];
		} else {
			imodal.currTemplate = {};
		}



		imodal.st = $.extend(true, {}, $.iconicModal.defaults, data ); 
		imodal.fixedContentPos = imodal.st.fixedContentPos === 'auto' ? !imodal.probablyMobile : imodal.st.fixedContentPos;

		if(imodal.st.modal) {
			imodal.st.closeOnContentClick = false;
			imodal.st.closeOnBgClick = false;
			imodal.st.showCloseBtn = false;
			imodal.st.enableEscapeKey = false;
		}
		

		// Building markup
		// main containers are created only once
		if(!imodal.bgOverlay) {

			// Dark overlay
			imodal.bgOverlay = _getEl('bg').on('click'+EVENT_NS, function() {
				imodal.close();
			});

			imodal.wrap = _getEl('wrap').attr('tabindex', -1).on('click'+EVENT_NS, function(e) {
				if(imodal._checkIfClose(e.target)) {
					imodal.close();
				}
			});

			imodal.container = _getEl('container', imodal.wrap);
		}

		imodal.contentContainer = _getEl('content');
		if(imodal.st.preloader) {
			imodal.preloader = _getEl('preloader', imodal.container, imodal.st.tLoading);
		}


		// Initializing modules
		var modules = $.iconicModal.modules;
		for(i = 0; i < modules.length; i++) {
			var n = modules[i];
			n = n.charAt(0).toUpperCase() + n.slice(1);
			imodal['init'+n].call(imodal);
		}
		_imodalTrigger('BeforeOpen');


		if(imodal.st.showCloseBtn) {
			// Close button
			if(!imodal.st.closeBtnInside) {
				imodal.wrap.append( _getCloseBtn() );
			} else {
				_imodalOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
					values.close_replaceWith = _getCloseBtn(item.type);
				});
				_wrapClasses += ' imodal-close-btn-in';
			}
		}

		if(imodal.st.alignTop) {
			_wrapClasses += ' imodal-align-top';
		}

	

		if(imodal.fixedContentPos) {
			imodal.wrap.css({
				overflow: imodal.st.overflowY,
				overflowX: 'hidden',
				overflowY: imodal.st.overflowY
			});
		} else {
			imodal.wrap.css({ 
				top: _window.scrollTop(),
				position: 'absolute'
			});
		}
		if( imodal.st.fixedBgPos === false || (imodal.st.fixedBgPos === 'auto' && !imodal.fixedContentPos) ) {
			imodal.bgOverlay.css({
				height: _document.height(),
				position: 'absolute'
			});
		}

		

		if(imodal.st.enableEscapeKey) {
			// Close on ESC key
			_document.on('keyup' + EVENT_NS, function(e) {
				if(e.keyCode === 27) {
					imodal.close();
				}
			});
		}

		_window.on('resize' + EVENT_NS, function() {
			imodal.updateSize();
		});


		if(!imodal.st.closeOnContentClick) {
			_wrapClasses += ' imodal-auto-cursor';
		}
		
		if(_wrapClasses)
			imodal.wrap.addClass(_wrapClasses);


		// this triggers recalculation of layout, so we get it once to not to trigger twice
		var windowHeight = imodal.wH = _window.height();

		
		var windowStyles = {};

		if( imodal.fixedContentPos ) {
            if(imodal._hasScrollBar(windowHeight)){
                var s = imodal._getScrollbarSize();
                if(s) {
                    windowStyles.marginRight = s;
                }
            }
        }

		if(imodal.fixedContentPos) {
			if(!imodal.isIE7) {
				windowStyles.overflow = 'hidden';
			} else {
				// ie7 double-scroll bug
				$('body, html').css('overflow', 'hidden');
			}
		}

		
		
		var classesToadd = imodal.st.mainClass;
		if(imodal.isIE7) {
			classesToadd += ' imodal-ie7';
		}
		if(classesToadd) {
			imodal._addClassToIMODAL( classesToadd );
		}

		// add content
		imodal.updateItemHTML();

		_imodalTrigger('BuildControls');

		// remove scrollbar, add margin e.t.c
		$('html').css(windowStyles);
		
		// add everything to DOM
		imodal.bgOverlay.add(imodal.wrap).prependTo( imodal.st.prependTo || $(document.body) );

		// Save last focused element
		imodal._lastFocusedEl = document.activeElement;
		
		// Wait for next cycle to allow CSS transition
		setTimeout(function() {
			
			if(imodal.content) {
				imodal._addClassToIMODAL(READY_CLASS);
				imodal._setFocus();
			} else {
				// if content is not defined (not loaded e.t.c) we add class only for BG
				imodal.bgOverlay.addClass(READY_CLASS);
			}
			
			// Trap the focus in popup
			_document.on('focusin' + EVENT_NS, imodal._onFocusIn);

		}, 16);

		imodal.isOpen = true;
		imodal.updateSize(windowHeight);
		_imodalTrigger(OPEN_EVENT);

		return data;
	},

	/**
	 * Closes the popup
	 */
	close: function() {
		if(!imodal.isOpen) return;
		_imodalTrigger(BEFORE_CLOSE_EVENT);

		imodal.isOpen = false;
		// for CSS3 animation
		if(imodal.st.removalDelay && !imodal.isLowIE && imodal.supportsTransition )  {
			imodal._addClassToIMODAL(REMOVING_CLASS);
			setTimeout(function() {
				imodal._close();
			}, imodal.st.removalDelay);
		} else {
			imodal._close();
		}
	},

	/**
	 * Helper for close() function
	 */
	_close: function() {
		_imodalTrigger(CLOSE_EVENT);

		var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';

		imodal.bgOverlay.detach();
		imodal.wrap.detach();
		imodal.container.empty();

		if(imodal.st.mainClass) {
			classesToRemove += imodal.st.mainClass + ' ';
		}

		imodal._removeClassFromIMODAL(classesToRemove);

		if(imodal.fixedContentPos) {
			var windowStyles = {marginRight: ''};
			if(imodal.isIE7) {
				$('body, html').css('overflow', '');
			} else {
				windowStyles.overflow = '';
			}
			$('html').css(windowStyles);
		}
		
		_document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
		imodal.ev.off(EVENT_NS);

		// clean up DOM elements that aren't removed
		imodal.wrap.attr('class', 'imodal-wrap').removeAttr('style');
		imodal.bgOverlay.attr('class', 'imodal-bg');
		imodal.container.attr('class', 'imodal-container');

		// remove close button from target element
		if(imodal.st.showCloseBtn &&
		(!imodal.st.closeBtnInside || imodal.currTemplate[imodal.currItem.type] === true)) {
			if(imodal.currTemplate.closeBtn)
				imodal.currTemplate.closeBtn.detach();
		}


		if(imodal.st.autoFocusLast && imodal._lastFocusedEl) {
			$(imodal._lastFocusedEl).trigger( 'focus' ); // put tab focus back
		}
		imodal.currItem = null;	
		imodal.content = null;
		imodal.currTemplate = null;
		imodal.prevHeight = 0;

		_imodalTrigger(AFTER_CLOSE_EVENT);
	},
	
	updateSize: function(winHeight) {

		if(imodal.isIOS) {
			// fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
			var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
			var height = window.innerHeight * zoomLevel;
			imodal.wrap.css('height', height);
			imodal.wH = height;
		} else {
			imodal.wH = winHeight || _window.height();
		}
		// Fixes #84: popup incorrectly positioned with position:relative on body
		if(!imodal.fixedContentPos) {
			imodal.wrap.css('height', imodal.wH);
		}

		_imodalTrigger('Resize');

	},

	/**
	 * Set content of popup based on current index
	 */
	updateItemHTML: function() {
		var item = imodal.items[imodal.index];

		// Detach and perform modifications
		imodal.contentContainer.detach();

		if(imodal.content)
			imodal.content.detach();

		if(!item.parsed) {
			item = imodal.parseEl( imodal.index );
		}

		var type = item.type;

		_imodalTrigger('BeforeChange', [imodal.currItem ? imodal.currItem.type : '', type]);
		// BeforeChange event works like so:
		// _imodalOn('BeforeChange', function(e, prevType, newType) { });

		imodal.currItem = item;

		if(!imodal.currTemplate[type]) {
			var markup = imodal.st[type] ? imodal.st[type].markup : false;

			// allows to modify markup
			_imodalTrigger('FirstMarkupParse', markup);

			if(markup) {
				imodal.currTemplate[type] = $(markup);
			} else {
				// if there is no markup found we just define that template is parsed
				imodal.currTemplate[type] = true;
			}
		}

		if(_prevContentType && _prevContentType !== item.type) {
			imodal.container.removeClass('imodal-'+_prevContentType+'-holder');
		}

		var newContent = imodal['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, imodal.currTemplate[type]);
		imodal.appendContent(newContent, type);

		item.preloaded = true;

		_imodalTrigger(CHANGE_EVENT, item);
		_prevContentType = item.type;

		// Append container back after its content changed
		imodal.container.prepend(imodal.contentContainer);

		_imodalTrigger('AfterChange');
	},


	/**
	 * Set HTML content of popup
	 */
	appendContent: function(newContent, type) {
		imodal.content = newContent;

		if(newContent) {
			if(imodal.st.showCloseBtn && imodal.st.closeBtnInside &&
				imodal.currTemplate[type] === true) {
				// if there is no markup, we just append close button element inside
				if(!imodal.content.find('.imodal-close').length) {
					imodal.content.append(_getCloseBtn());
				}
			} else {
				imodal.content = newContent;
			}
		} else {
			imodal.content = '';
		}

		_imodalTrigger(BEFORE_APPEND_EVENT);
		imodal.container.addClass('imodal-'+type+'-holder');

		imodal.contentContainer.append(imodal.content);
	},


	/**
	 * Creates Iconic Modal data object based on given data
	 * @param  {int} index Index of item to parse
	 */
	parseEl: function(index) {
		var item = imodal.items[index],
			type;

		if(item.tagName) {
			item = { el: $(item) };
		} else {
			type = item.type;
			item = { data: item, src: item.src };
		}

		if(item.el) {
			var types = imodal.types;

			// check for 'imodal-TYPE' class
			for(var i = 0; i < types.length; i++) {
				if( item.el.hasClass('imodal-'+types[i]) ) {
					type = types[i];
					break;
				}
			}

			item.src = item.el.attr('data-imodal-src');
			if(!item.src) {
				item.src = item.el.attr('href');
			}
		}

		item.type = type || imodal.st.type || 'inline';
		item.index = index;
		item.parsed = true;
		imodal.items[index] = item;
		_imodalTrigger('ElementParse', item);

		return imodal.items[index];
	},


	/**
	 * Initializes single popup or a group of popups
	 */
	addGroup: function(el, options) {
		var eHandler = function(e) {
			e.imodalEl = this;
			imodal._openClick(e, el, options);
		};

		if(!options) {
			options = {};
		}

		var eName = 'click.iconicModal';
		options.mainEl = el;

		if(options.items) {
			options.isObj = true;
			el.off(eName).on(eName, eHandler);
		} else {
			options.isObj = false;
			if(options.delegate) {
				el.off(eName).on(eName, options.delegate , eHandler);
			} else {
				options.items = el;
				el.off(eName).on(eName, eHandler);
			}
		}
	},
	_openClick: function(e, el, options) {
		var midClick = options.midClick !== undefined ? options.midClick : $.iconicModal.defaults.midClick;


		if(!midClick && ( e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ) ) {
			return;
		}

		var disableOn = options.disableOn !== undefined ? options.disableOn : $.iconicModal.defaults.disableOn;

		if(disableOn) {
			if($.isFunction(disableOn)) {
				if( !disableOn.call(imodal) ) {
					return true;
				}
			} else { // else it's number
				if( _window.width() < disableOn ) {
					return true;
				}
			}
		}

		if(e.type) {
			e.preventDefault();

			// This will prevent popup from closing if element is inside and popup is already opened
			if(imodal.isOpen) {
				e.stopPropagation();
			}
		}

		options.el = $(e.imodalEl);
		if(options.delegate) {
			options.items = el.find(options.delegate);
		}
		imodal.open(options);
	},


	/**
	 * Updates text on preloader
	 */
	updateStatus: function(status, text) {

		if(imodal.preloader) {
			if(_prevStatus !== status) {
				imodal.container.removeClass('imodal-s-'+_prevStatus);
			}

			if(!text && status === 'loading') {
				text = imodal.st.tLoading;
			}

			var data = {
				status: status,
				text: text
			};
			// allows to modify status
			_imodalTrigger('UpdateStatus', data);

			status = data.status;
			text = data.text;

			imodal.preloader.html(text);

			imodal.preloader.find('a').on('click', function(e) {
				e.stopImmediatePropagation();
			});

			imodal.container.addClass('imodal-s-'+status);
			_prevStatus = status;
		}
	},


	/*
		"Private" helpers that aren't private at all
	 */
	// Check to close popup or not
	// "target" is an element that was clicked
	_checkIfClose: function(target) {

		if($(target).hasClass(PREVENT_CLOSE_CLASS)) {
			return;
		}

		var closeOnContent = imodal.st.closeOnContentClick;
		var closeOnBg = imodal.st.closeOnBgClick;

		if(closeOnContent && closeOnBg) {
			return true;
		} else {

			// We close the popup if click is on close button or on preloader. Or if there is no content.
			if(!imodal.content || $(target).hasClass('imodal-close') || (imodal.preloader && target === imodal.preloader[0]) ) {
				return true;
			}

			// if click is outside the content
			if(  (target !== imodal.content[0] && !$.contains(imodal.content[0], target))  ) {
				if(closeOnBg) {
					// last check, if the clicked element is in DOM, (in case it's removed onclick)
					if( $.contains(document, target) ) {
						return true;
					}
				}
			} else if(closeOnContent) {
				return true;
			}

		}
		return false;
	},
	_addClassToIMODAL: function(cName) {
		imodal.bgOverlay.addClass(cName);
		imodal.wrap.addClass(cName);
	},
	_removeClassFromIMODAL: function(cName) {
		this.bgOverlay.removeClass(cName);
		imodal.wrap.removeClass(cName);
	},
	_hasScrollBar: function(winHeight) {
		return (  (imodal.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()) );
	},
	_setFocus: function() {
		(imodal.st.focus ? imodal.content.find(imodal.st.focus).eq(0) : imodal.wrap).trigger( 'focus' );
	},
	_onFocusIn: function(e) {
		if( e.target !== imodal.wrap[0] && !$.contains(imodal.wrap[0], e.target) ) {
			imodal._setFocus();
			return false;
		}
	},
	_parseMarkup: function(template, values, item) {
		var arr;
		if(item.data) {
			values = $.extend(item.data, values);
		}
		_imodalTrigger(MARKUP_PARSE_EVENT, [template, values, item] );

		$.each(values, function(key, value) {
			if(value === undefined || value === false) {
				return true;
			}
			arr = key.split('_');
			if(arr.length > 1) {
				var el = template.find(EVENT_NS + '-'+arr[0]);

				if(el.length > 0) {
					var attr = arr[1];
					if(attr === 'replaceWith') {
						if(el[0] !== value[0]) {
							el.replaceWith(value);
						}
					} else if(attr === 'img') {
						if(el.is('img')) {
							el.attr('src', value);
						} else {
							el.replaceWith( $('<img>').attr('src', value).attr('class', el.attr('class')) );
						}
					} else {
						el.attr(arr[1], value);
					}
				}

			} else {
				template.find(EVENT_NS + '-'+key).html(value);
			}
		});
	},

	_getScrollbarSize: function() {
		// thx David
		if(imodal.scrollbarSize === undefined) {
			var scrollDiv = document.createElement("div");
			scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
			document.body.appendChild(scrollDiv);
			imodal.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
			document.body.removeChild(scrollDiv);
		}
		return imodal.scrollbarSize;
	}

}; /* IconicModal core prototype end */




/**
 * Public static functions
 */
$.iconicModal = {
	instance: null,
	proto: IconicModal.prototype,
	modules: [],

	open: function(options, index) {
		_checkInstance();

		if(!options) {
			options = {};
		} else {
			options = $.extend(true, {}, options);
		}

		options.isObj = true;
		options.index = index || 0;
		return this.instance.open(options);
	},

	close: function() {
		return $.iconicModal.instance && $.iconicModal.instance.close();
	},

	registerModule: function(name, module) {
		if(module.options) {
			$.iconicModal.defaults[name] = module.options;
		}
		$.extend(this.proto, module.proto);
		this.modules.push(name);
	},

	defaults: {

		// Info about options is in docs:
		// http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

		disableOn: 0,

		key: null,

		midClick: false,

		mainClass: '',

		preloader: true,

		focus: '', // CSS selector of input to focus after popup is opened

		closeOnContentClick: false,

		closeOnBgClick: true,

		closeBtnInside: true,

		showCloseBtn: true,

		enableEscapeKey: true,

		modal: false,

		alignTop: false,

		removalDelay: 0,

		prependTo: null,

		fixedContentPos: 'auto',

		fixedBgPos: 'auto',

		overflowY: 'auto',

		closeMarkup: '<button title="%title%" type="button" class="imodal-close">&#215;</button>',

		tClose: 'Close (Esc)',

		tLoading: 'Loading...',

		autoFocusLast: true

	}
};



$.fn.iconicModal = function(options) {
	_checkInstance();

	var jqEl = $(this);

	// We call some API method of first param is a string
	if (typeof options === "string" ) {

		if(options === 'open') {
			var items,
				itemOpts = _isJQ ? jqEl.data('iconicModal') : jqEl[0].iconicModal,
				index = parseInt(arguments[1], 10) || 0;

			if(itemOpts.items) {
				items = itemOpts.items[index];
			} else {
				items = jqEl;
				if(itemOpts.delegate) {
					items = items.find(itemOpts.delegate);
				}
				items = items.eq( index );
			}
			imodal._openClick({imodalEl:items}, jqEl, itemOpts);
		} else {
			if(imodal.isOpen)
				imodal[options].apply(imodal, Array.prototype.slice.call(arguments, 1));
		}

	} else {
		// clone options obj
		options = $.extend(true, {}, options);

		/*
		 * As Zepto doesn't support .data() method for objects
		 * and it works only in normal browsers
		 * we assign "options" object directly to the DOM element. FTW!
		 */
		if(_isJQ) {
			jqEl.data('iconicModal', options);
		} else {
			jqEl[0].iconicModal = options;
		}

		imodal.addGroup(jqEl, options);

	}
	return jqEl;
};

/*>>core*/

/*>>inline*/

var INLINE_NS = 'inline',
	_hiddenClass,
	_inlinePlaceholder,
	_lastInlineElement,
	_putInlineElementsBack = function() {
		if(_lastInlineElement) {
			_inlinePlaceholder.after( _lastInlineElement.addClass(_hiddenClass) ).detach();
			_lastInlineElement = null;
		}
	};

$.iconicModal.registerModule(INLINE_NS, {
	options: {
		hiddenClass: 'hide', // will be appended with `imodal-` prefix
		markup: '',
		tNotFound: 'Content not found'
	},
	proto: {

		initInline: function() {
			imodal.types.push(INLINE_NS);

			_imodalOn(CLOSE_EVENT+'.'+INLINE_NS, function() {
				_putInlineElementsBack();
			});
		},

		getInline: function(item, template) {

			_putInlineElementsBack();

			if(item.src) {
				var inlineSt = imodal.st.inline,
					el = $(item.src);

				if(el.length) {

					// If target element has parent - we replace it with placeholder and put it back after popup is closed
					var parent = el[0].parentNode;
					if(parent && parent.tagName) {
						if(!_inlinePlaceholder) {
							_hiddenClass = inlineSt.hiddenClass;
							_inlinePlaceholder = _getEl(_hiddenClass);
							_hiddenClass = 'imodal-'+_hiddenClass;
						}
						// replace target inline element with placeholder
						_lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
					}

					imodal.updateStatus('ready');
				} else {
					imodal.updateStatus('error', inlineSt.tNotFound);
					el = $('<div>');
				}

				item.inlineElement = el;
				return el;
			}

			imodal.updateStatus('ready');
			imodal._parseMarkup(template, {}, item);
			return template;
		}
	}
});

/*>>inline*/

/*>>ajax*/
var AJAX_NS = 'ajax',
	_ajaxCur,
	_removeAjaxCursor = function() {
		if(_ajaxCur) {
			$(document.body).removeClass(_ajaxCur);
		}
	},
	_destroyAjaxRequest = function() {
		_removeAjaxCursor();
		if(imodal.req) {
			imodal.req.abort();
		}
	};

$.iconicModal.registerModule(AJAX_NS, {

	options: {
		settings: null,
		cursor: 'imodal-ajax-cur',
		tError: '<a href="%url%">The content</a> could not be loaded.'
	},

	proto: {
		initAjax: function() {
			imodal.types.push(AJAX_NS);
			_ajaxCur = imodal.st.ajax.cursor;

			_imodalOn(CLOSE_EVENT+'.'+AJAX_NS, _destroyAjaxRequest);
			_imodalOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
		},
		getAjax: function(item) {

			if(_ajaxCur) {
				$(document.body).addClass(_ajaxCur);
			}

			imodal.updateStatus('loading');

			var opts = $.extend({
				url: item.src,
				success: function(data, textStatus, jqXHR) {
					var temp = {
						data:data,
						xhr:jqXHR
					};

					_imodalTrigger('ParseAjax', temp);

					imodal.appendContent( $(temp.data), AJAX_NS );

					item.finished = true;

					_removeAjaxCursor();

					imodal._setFocus();

					setTimeout(function() {
						imodal.wrap.addClass(READY_CLASS);
					}, 16);

					imodal.updateStatus('ready');

					_imodalTrigger('AjaxContentAdded');
				},
				error: function() {
					_removeAjaxCursor();
					item.finished = item.loadError = true;
					imodal.updateStatus('error', imodal.st.ajax.tError.replace('%url%', item.src));
				}
			}, imodal.st.ajax.settings);

			imodal.req = $.ajax(opts);

			return '';
		}
	}
});

/*>>ajax*/

/*>>image*/
var _imgInterval,
	_getTitle = function(item) {
		if(item.data && item.data.title !== undefined)
			return item.data.title;

		var src = imodal.st.image.titleSrc;

		if(src) {
			if($.isFunction(src)) {
				return src.call(imodal, item);
			} else if(item.el) {
				return item.el.attr(src) || '';
			}
		}
		return '';
	};

$.iconicModal.registerModule('image', {

	options: {
		markup: '<div class="imodal-figure">'+
					'<div class="imodal-close"></div>'+
					'<figure>'+
						'<div class="imodal-img"></div>'+
						'<figcaption>'+
							'<div class="imodal-bottom-bar">'+
								'<div class="imodal-title"></div>'+
								'<div class="imodal-counter"></div>'+
							'</div>'+
						'</figcaption>'+
					'</figure>'+
				'</div>',
		cursor: 'imodal-zoom-out-cur',
		titleSrc: 'title',
		verticalFit: true,
		tError: '<a href="%url%">The image</a> could not be loaded.'
	},

	proto: {
		initImage: function() {
			var imgSt = imodal.st.image,
				ns = '.image';

			imodal.types.push('image');

			_imodalOn(OPEN_EVENT+ns, function() {
				if(imodal.currItem.type === 'image' && imgSt.cursor) {
					$(document.body).addClass(imgSt.cursor);
				}
			});

			_imodalOn(CLOSE_EVENT+ns, function() {
				if(imgSt.cursor) {
					$(document.body).removeClass(imgSt.cursor);
				}
				_window.off('resize' + EVENT_NS);
			});

			_imodalOn('Resize'+ns, imodal.resizeImage);
			if(imodal.isLowIE) {
				_imodalOn('AfterChange', imodal.resizeImage);
			}
		},
		resizeImage: function() {
			var item = imodal.currItem;
			if(!item || !item.img) return;

			if(imodal.st.image.verticalFit) {
				var decr = 0;
				// fix box-sizing in ie7/8
				if(imodal.isLowIE) {
					decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'),10);
				}
				item.img.css('max-height', imodal.wH-decr);
			}
		},
		_onImageHasSize: function(item) {
			if(item.img) {

				item.hasSize = true;

				if(_imgInterval) {
					clearInterval(_imgInterval);
				}

				item.isCheckingImgSize = false;

				_imodalTrigger('ImageHasSize', item);

				if(item.imgHidden) {
					if(imodal.content)
						imodal.content.removeClass('imodal-loading');

					item.imgHidden = false;
				}

			}
		},

		/**
		 * Function that loops until the image has size to display elements that rely on it asap
		 */
		findImageSize: function(item) {

			var counter = 0,
				img = item.img[0],
				imodalSetInterval = function(delay) {

					if(_imgInterval) {
						clearInterval(_imgInterval);
					}
					// decelerating interval that checks for size of an image
					_imgInterval = setInterval(function() {
						if(img.naturalWidth > 0) {
							imodal._onImageHasSize(item);
							return;
						}

						if(counter > 200) {
							clearInterval(_imgInterval);
						}

						counter++;
						if(counter === 3) {
							imodalSetInterval(10);
						} else if(counter === 40) {
							imodalSetInterval(50);
						} else if(counter === 100) {
							imodalSetInterval(500);
						}
					}, delay);
				};

			imodalSetInterval(1);
		},

		getImage: function(item, template) {

			var guard = 0,

				// image load complete handler
				onLoadComplete = function() {
					if(item) {
						if (item.img[0].complete) {
							item.img.off('.imodalloader');

							if(item === imodal.currItem){
								imodal._onImageHasSize(item);

								imodal.updateStatus('ready');
							}

							item.hasSize = true;
							item.loaded = true;

							_imodalTrigger('ImageLoadComplete');

						}
						else {
							// if image complete check fails 200 times (20 sec), we assume that there was an error.
							guard++;
							if(guard < 200) {
								setTimeout(onLoadComplete,100);
							} else {
								onLoadError();
							}
						}
					}
				},

				// image error handler
				onLoadError = function() {
					if(item) {
						item.img.off('.imodalloader');
						if(item === imodal.currItem){
							imodal._onImageHasSize(item);
							imodal.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
						}

						item.hasSize = true;
						item.loaded = true;
						item.loadError = true;
					}
				},
				imgSt = imodal.st.image;


			var el = template.find('.imodal-img');
			if(el.length) {
				var img = document.createElement('img');
				img.className = 'imodal-img';
				if(item.el && item.el.find('img').length) {
					img.alt = item.el.find('img').attr('alt');
				}
				item.img = $(img).on('load.imodalloader', onLoadComplete).on('error.imodalloader', onLoadError);
				img.src = item.src;

				// without clone() "error" event is not firing when IMG is replaced by new IMG
				// TODO: find a way to avoid such cloning
				if(el.is('img')) {
					item.img = item.img.clone();
				}

				img = item.img[0];
				if(img.naturalWidth > 0) {
					item.hasSize = true;
				} else if(!img.width) {
					item.hasSize = false;
				}
			}

			imodal._parseMarkup(template, {
				title: _getTitle(item),
				img_replaceWith: item.img
			}, item);

			imodal.resizeImage();

			if(item.hasSize) {
				if(_imgInterval) clearInterval(_imgInterval);

				if(item.loadError) {
					template.addClass('imodal-loading');
					imodal.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
				} else {
					template.removeClass('imodal-loading');
					imodal.updateStatus('ready');
				}
				return template;
			}

			imodal.updateStatus('loading');
			item.loading = true;

			if(!item.hasSize) {
				item.imgHidden = true;
				template.addClass('imodal-loading');
				imodal.findImageSize(item);
			}

			return template;
		}
	}
});

/*>>image*/

/*>>zoom*/
var hasMozTransform,
	getHasMozTransform = function() {
		if(hasMozTransform === undefined) {
			hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
		}
		return hasMozTransform;
	};

$.iconicModal.registerModule('zoom', {

	options: {
		enabled: false,
		easing: 'ease-in-out',
		duration: 300,
		opener: function(element) {
			return element.is('img') ? element : element.find('img');
		}
	},

	proto: {

		initZoom: function() {
			var zoomSt = imodal.st.zoom,
				ns = '.zoom',
				image;

			if(!zoomSt.enabled || !imodal.supportsTransition) {
				return;
			}

			var duration = zoomSt.duration,
				getElToAnimate = function(image) {
					var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('imodal-animated-image'),
						transition = 'all '+(zoomSt.duration/1000)+'s ' + zoomSt.easing,
						cssObj = {
							position: 'fixed',
							zIndex: 9999,
							left: 0,
							top: 0,
							'-webkit-backface-visibility': 'hidden'
						},
						t = 'transition';

					cssObj['-webkit-'+t] = cssObj['-moz-'+t] = cssObj['-o-'+t] = cssObj[t] = transition;

					newImg.css(cssObj);
					return newImg;
				},
				showMainContent = function() {
					imodal.content.css('visibility', 'visible');
				},
				openTimeout,
				animatedImg;

			_imodalOn('BuildControls'+ns, function() {
				if(imodal._allowZoom()) {

					clearTimeout(openTimeout);
					imodal.content.css('visibility', 'hidden');

					// Basically, all code below does is clones existing image, puts in on top of the current one and animated it

					image = imodal._getItemToZoom();

					if(!image) {
						showMainContent();
						return;
					}

					animatedImg = getElToAnimate(image);

					animatedImg.css( imodal._getOffset() );

					imodal.wrap.append(animatedImg);

					openTimeout = setTimeout(function() {
						animatedImg.css( imodal._getOffset( true ) );
						openTimeout = setTimeout(function() {

							showMainContent();

							setTimeout(function() {
								animatedImg.remove();
								image = animatedImg = null;
								_imodalTrigger('ZoomAnimationEnded');
							}, 16); // avoid blink when switching images

						}, duration); // this timeout equals animation duration

					}, 16); // by adding this timeout we avoid short glitch at the beginning of animation


					// Lots of timeouts...
				}
			});
			_imodalOn(BEFORE_CLOSE_EVENT+ns, function() {
				if(imodal._allowZoom()) {

					clearTimeout(openTimeout);

					imodal.st.removalDelay = duration;

					if(!image) {
						image = imodal._getItemToZoom();
						if(!image) {
							return;
						}
						animatedImg = getElToAnimate(image);
					}

					animatedImg.css( imodal._getOffset(true) );
					imodal.wrap.append(animatedImg);
					imodal.content.css('visibility', 'hidden');

					setTimeout(function() {
						animatedImg.css( imodal._getOffset() );
					}, 16);
				}

			});

			_imodalOn(CLOSE_EVENT+ns, function() {
				if(imodal._allowZoom()) {
					showMainContent();
					if(animatedImg) {
						animatedImg.remove();
					}
					image = null;
				}
			});
		},

		_allowZoom: function() {
			return imodal.currItem.type === 'image';
		},

		_getItemToZoom: function() {
			if(imodal.currItem.hasSize) {
				return imodal.currItem.img;
			} else {
				return false;
			}
		},

		// Get element postion relative to viewport
		_getOffset: function(isLarge) {
			var el;
			if(isLarge) {
				el = imodal.currItem.img;
			} else {
				el = imodal.st.zoom.opener(imodal.currItem.el || imodal.currItem);
			}

			var offset = el.offset();
			var paddingTop = parseInt(el.css('padding-top'),10);
			var paddingBottom = parseInt(el.css('padding-bottom'),10);
			offset.top -= ( $(window).scrollTop() - paddingTop );


			/*

			Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

			 */
			var obj = {
				width: el.width(),
				// fix Zepto height+padding issue
				height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
			};

			// I hate to do this, but there is no another option
			if( getHasMozTransform() ) {
				obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
			} else {
				obj.left = offset.left;
				obj.top = offset.top;
			}
			return obj;
		}

	}
});



/*>>zoom*/

/*>>iframe*/

var IFRAME_NS = 'iframe',
	_emptyPage = '//about:blank',

	_fixIframeBugs = function(isShowing) {
		if(imodal.currTemplate[IFRAME_NS]) {
			var el = imodal.currTemplate[IFRAME_NS].find('iframe');
			if(el.length) {
				// reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
				if(!isShowing) {
					el[0].src = _emptyPage;
				}

				// IE8 black screen bug fix
				if(imodal.isIE8) {
					el.css('display', isShowing ? 'block' : 'none');
				}
			}
		}
	};

$.iconicModal.registerModule(IFRAME_NS, {

	options: {
		markup: '<div class="imodal-iframe-scaler">'+
					'<div class="imodal-close"></div>'+
					'<iframe class="imodal-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>'+
				'</div>',

		srcAction: 'iframe_src',

		// we don't care and support only one default type of URL by default
		patterns: {
			youtube: {
				index: 'youtube.com',
				id: 'v=',
				src: '//www.youtube.com/embed/%id%?autoplay=1'
			},
			vimeo: {
				index: 'vimeo.com/',
				id: '/',
				src: '//player.vimeo.com/video/%id%?autoplay=1'
			},
			gmaps: {
				index: '//maps.google.',
				src: '%id%&output=embed'
			}
		}
	},

	proto: {
		initIframe: function() {
			imodal.types.push(IFRAME_NS);

			_imodalOn('BeforeChange', function(e, prevType, newType) {
				if(prevType !== newType) {
					if(prevType === IFRAME_NS) {
						_fixIframeBugs(); // iframe if removed
					} else if(newType === IFRAME_NS) {
						_fixIframeBugs(true); // iframe is showing
					}
				}// else {
					// iframe source is switched, don't do anything
				//}
			});

			_imodalOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
				_fixIframeBugs();
			});
		},

		getIframe: function(item, template) {
			var embedSrc = item.src;
			var iframeSt = imodal.st.iframe;

			$.each(iframeSt.patterns, function() {
				if(embedSrc.indexOf( this.index ) > -1) {
					if(this.id) {
						if(typeof this.id === 'string') {
							embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
						} else {
							embedSrc = this.id.call( this, embedSrc );
						}
					}
					embedSrc = this.src.replace('%id%', embedSrc );
					return false; // break;
				}
			});

			var dataObj = {};
			if(iframeSt.srcAction) {
				dataObj[iframeSt.srcAction] = embedSrc;
			}
			imodal._parseMarkup(template, dataObj, item);

			imodal.updateStatus('ready');

			return template;
		}
	}
});



/*>>iframe*/

/*>>gallery*/
/**
 * Get looped index depending on number of slides
 */
var _getLoopedId = function(index) {
		var numSlides = imodal.items.length;
		if(index > numSlides - 1) {
			return index - numSlides;
		} else  if(index < 0) {
			return numSlides + index;
		}
		return index;
	},
	_replaceCurrTotal = function(text, curr, total) {
		return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
	};

$.iconicModal.registerModule('gallery', {

	options: {
		enabled: false,
		arrowMarkup: '<button title="%title%" type="button" class="imodal-arrow imodal-arrow-%dir%"></button>',
		preload: [0,2],
		navigateByImgClick: true,
		arrows: true,

		tPrev: 'Previous (Left arrow key)',
		tNext: 'Next (Right arrow key)',
		tCounter: '%curr% of %total%'
	},

	proto: {
		initGallery: function() {

			var gSt = imodal.st.gallery,
				ns = '.imodal-gallery';

			imodal.direction = true; // true - next, false - prev

			if(!gSt || !gSt.enabled ) return false;

			_wrapClasses += ' imodal-gallery';

			_imodalOn(OPEN_EVENT+ns, function() {

				if(gSt.navigateByImgClick) {
					imodal.wrap.on('click'+ns, '.imodal-img', function() {
						if(imodal.items.length > 1) {
							imodal.next();
							return false;
						}
					});
				}

				_document.on('keydown'+ns, function(e) {
					if (e.keyCode === 37) {
						imodal.prev();
					} else if (e.keyCode === 39) {
						imodal.next();
					}
				});
			});

			_imodalOn('UpdateStatus'+ns, function(e, data) {
				if(data.text) {
					data.text = _replaceCurrTotal(data.text, imodal.currItem.index, imodal.items.length);
				}
			});

			_imodalOn(MARKUP_PARSE_EVENT+ns, function(e, element, values, item) {
				var l = imodal.items.length;
				values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
			});

			_imodalOn('BuildControls' + ns, function() {
				if(imodal.items.length > 1 && gSt.arrows && !imodal.arrowLeft) {
					var markup = gSt.arrowMarkup,
						arrowLeft = imodal.arrowLeft = $( markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left') ).addClass(PREVENT_CLOSE_CLASS),
						arrowRight = imodal.arrowRight = $( markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right') ).addClass(PREVENT_CLOSE_CLASS);

					arrowLeft.click(function() {
						imodal.prev();
					});
					arrowRight.click(function() {
						imodal.next();
					});

					imodal.container.append(arrowLeft.add(arrowRight));
				}
			});

			_imodalOn(CHANGE_EVENT+ns, function() {
				if(imodal._preloadTimeout) clearTimeout(imodal._preloadTimeout);

				imodal._preloadTimeout = setTimeout(function() {
					imodal.preloadNearbyImages();
					imodal._preloadTimeout = null;
				}, 16);
			});


			_imodalOn(CLOSE_EVENT+ns, function() {
				_document.off(ns);
				imodal.wrap.off('click'+ns);
				imodal.arrowRight = imodal.arrowLeft = null;
			});

		},
		next: function() {
			imodal.direction = true;
			imodal.index = _getLoopedId(imodal.index + 1);
			imodal.updateItemHTML();
		},
		prev: function() {
			imodal.direction = false;
			imodal.index = _getLoopedId(imodal.index - 1);
			imodal.updateItemHTML();
		},
		goTo: function(newIndex) {
			imodal.direction = (newIndex >= imodal.index);
			imodal.index = newIndex;
			imodal.updateItemHTML();
		},
		preloadNearbyImages: function() {
			var p = imodal.st.gallery.preload,
				preloadBefore = Math.min(p[0], imodal.items.length),
				preloadAfter = Math.min(p[1], imodal.items.length),
				i;

			for(i = 1; i <= (imodal.direction ? preloadAfter : preloadBefore); i++) {
				imodal._preloadItem(imodal.index+i);
			}
			for(i = 1; i <= (imodal.direction ? preloadBefore : preloadAfter); i++) {
				imodal._preloadItem(imodal.index-i);
			}
		},
		_preloadItem: function(index) {
			index = _getLoopedId(index);

			if(imodal.items[index].preloaded) {
				return;
			}

			var item = imodal.items[index];
			if(!item.parsed) {
				item = imodal.parseEl( index );
			}

			_imodalTrigger('LazyLoad', item);

			if(item.type === 'image') {
				item.img = $('<img class="imodal-img" />').on('load.imodalloader', function() {
					item.hasSize = true;
				}).on('error.imodalloader', function() {
					item.hasSize = true;
					item.loadError = true;
					_imodalTrigger('LazyLoadError', item);
				}).attr('src', item.src);
			}


			item.preloaded = true;
		}
	}
});

/*>>gallery*/

/*>>retina*/

var RETINA_NS = 'retina';

$.iconicModal.registerModule(RETINA_NS, {
	options: {
		replaceSrc: function(item) {
			return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
		},
		ratio: 1 // Function or number.  Set to 1 to disable.
	},
	proto: {
		initRetina: function() {
			if(window.devicePixelRatio > 1) {

				var st = imodal.st.retina,
					ratio = st.ratio;

				ratio = !isNaN(ratio) ? ratio : ratio();

				if(ratio > 1) {
					_imodalOn('ImageHasSize' + '.' + RETINA_NS, function(e, item) {
						item.img.css({
							'max-width': item.img[0].naturalWidth / ratio,
							'width': '100%'
						});
					});
					_imodalOn('ElementParse' + '.' + RETINA_NS, function(e, item) {
						item.src = st.replaceSrc(item, ratio);
					});
				}
			}

		}
	}
});

/*>>retina*/
 _checkInstance(); }));