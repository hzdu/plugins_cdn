(function ($) {

	/**
	 * Helper class for header layout logic.
	 *
	 * @since 1.4.15
	 * @class PPHeaderLayout
	 */
	PPHeaderLayout = {

		/**
		 * A reference to the window object for this page.
		 *
		 * @since 1.4.15
		 * @property {Object} win
		 */
		win: null,

		/**
		 * A reference to the body object for this page.
		 *
		 * @since 1.4.15
		 * @property {Object} body
		 */
		body: null,

		/**
		 * A reference to the header object for this page.
		 *
		 * @since 1.4.15
		 * @property {Object} header
		 */
		header: null,

		/**
		 * Whether this header overlays the content or not.
		 *
		 * @since 1.4.15
		 * @property {Boolean} overlay
		 */
		overlay: false,

		/**
		 * Whether the page has the WP admin bar or not.
		 *
		 * @since 1.4.15
		 * @property {Boolean} hasAdminBar
		 */
		hasAdminBar: false,

		/**
		 * Initializes header layout logic.
		 *
		 * @since 1.4.15
		 * @method init
		 */
		init: function () {
			var isEditMode = false,
				header = $('.pp-elementor-header[data-type=header]');

			if (elementorFrontend.isEditMode()) {
				var isEditMode = true;
			}

			if (!isEditMode && header.length) {
				header.imagesLoaded($.proxy(function () {

					this.win = $(window);
					this.body = $('body');
					this.header = header.eq(0);
					this.overlay = !!Number(header.attr('data-overlay'));
					this.hasAdminBar = !!$('body.admin-bar').length;

					if (Number(header.attr('data-sticky'))) {

						this.header.data('original-top', this.header.offset().top);
						//this.win.on( 'resize', $.throttle( 500, $.proxy( this._initSticky, this ) ) );
						this._initSticky();

						if (Number(header.attr('data-shrink'))) {
							this.header.data('original-height', this.header.outerHeight());
							//this.win.on( 'resize', $.throttle( 500, $.proxy( this._initShrink, this ) ) );
							this._initShrink();
						}
					}

				}, this));
			}
		},

		/**
		 * Initializes sticky logic for a header.
		 *
		 * @since 1.4.15
		 * @access private
		 * @method _initSticky
		 */
		_initSticky: function () {

			var breakpoint = this.header.data("breakpoint");

			if (this._matchDevice(breakpoint)) {
				this.win.on('scroll.pp-header-sticky', $.proxy(this._doSticky, this));
				this._doSticky();
			} else {
				this.win.off('scroll.pp-header-sticky');
				this.header.removeClass('pp-header-sticky');
				this.body.css('padding-top', '0');
			}
		},

		/**
		 * Matches the current device for set breakpoint.
		 *
		 * @since 1.4.15
		 * @access private
		 * @method _matchDevice
		 */
		_matchDevice: function (breakpoint) {

			var breakpoints = elementorFrontend.config.breakpoints;

			var match = false;

			if ('all' === breakpoint) {
				match = true;
			} else if ('large' === breakpoint) {
				match = window.innerWidth > breakpoints.md;
			} else if ('large-medium' === breakpoint) {
				match = window.innerWidth > breakpoints.sm;
			} else if ('medium' === breakpoint) {
				match = window.innerWidth > breakpoints.sm && window.innerWidth <= breakpoints.md;
			} else if ('medium-responsive' === breakpoint) {
				match = window.innerWidth <= breakpoints.md;
			} else if ('responsive' === breakpoint) {
				match = window.innerWidth <= breakpoints.sm;
			}

			return match;
		},

		/**
		 * Sticks the header when the page is scrolled.
		 *
		 * @since 1.4.15
		 * @access private
		 * @method _doSticky
		 */
		_doSticky: function () {
			var winTop = this.win.scrollTop(),
				headerTop = this.header.data('original-top'),
				hasStickyClass = this.header.hasClass('pp-header-sticky'),
				hasScrolledClass = this.header.hasClass('pp-header-scrolled');

			if (this.hasAdminBar) {
				winTop += 32;
			}

			if (winTop >= headerTop) {
				if (!hasStickyClass) {
					this.header.addClass('pp-header-sticky');
					if (!this.overlay) {
						this.body.css('padding-top', this.header.outerHeight() + 'px');
					}
				}
			}
			else if (hasStickyClass) {
				this.header.removeClass('pp-header-sticky');
				this.body.css('padding-top', '0');
			}

			if (winTop > headerTop) {
				if (!hasScrolledClass) {
					this.header.addClass('pp-header-scrolled');
				}
			} else if (hasScrolledClass) {
				this.header.removeClass('pp-header-scrolled');
			}
		},

		/**
		 * Initializes shrink logic for a header.
		 *
		 * @since 1.4.15
		 * @access private
		 * @method _initShrink
		 */
		_initShrink: function () {
			//elementorBreakpoints = elementorFrontend.config.breakpoints
			var breakpoint = this.header.data("breakpoint");

			if (this._matchDevice(breakpoint)) {
				this.win.on('scroll.pp-header-shrink', $.proxy(this._doShrink, this));
				this._setImageMaxHeight();
			} else {
				this.body.css('padding-top', '0');
				this.win.off('scroll.pp-header-shrink');
				this._removeShrink();
				this._removeImageMaxHeight();
			}
		},

		/**
		 * Shrinks the header when the page is scrolled.
		 *
		 * @since 1.4.15
		 * @access private
		 * @method _doShrink
		 */
		_doShrink: function () {
			var winTop = this.win.scrollTop(),
				headerTop = this.header.data('original-top'),
				headerHeight = this.header.data('original-height'),
				hasClass = this.header.hasClass('pp-header-shrink');

			if (this.hasAdminBar) {
				winTop += 32;
			}

			if (winTop > headerTop + headerHeight) {

				if (!hasClass) {

					this.header.addClass('pp-header-shrink');

					this.header.find('.elementor-section').each(function () {

						var row = $(this);

						if (parseInt(row.css('padding-bottom')) > 5) {
							row.addClass('pp-header-shrink-row-bottom');
						}

						if (parseInt(row.css('padding-top')) > 5) {
							row.addClass('pp-header-shrink-row-top');
						}
					});

					this.header.find('.elementor-column-wrap').each(function () {

						var module = $(this);

						if (parseInt(module.css('margin-bottom')) > 5) {
							module.addClass('pp-header-shrink-module-bottom');
						}

						if (parseInt(module.css('margin-top')) > 5) {
							module.addClass('pp-header-shrink-module-top');
						}
					});
				}
			} else if (hasClass) {
				this._removeShrink();
			}
		},

		/**
		 * Removes the header shrink effect.
		 *
		 * @since 1.4.15
		 * @access private
		 * @method _removeShrink
		 */
		_removeShrink: function () {
			var rows = this.header.find('.elementor-section'),
				modules = this.header.find('.elementor-column-wrap');

			rows.removeClass('pp-header-shrink-row-bottom');
			rows.removeClass('pp-header-shrink-row-top');
			modules.removeClass('pp-header-shrink-module-bottom');
			modules.removeClass('pp-header-shrink-module-top');
			this.header.removeClass('pp-header-shrink');
		},

		/**
		 * Adds max height to images in modules for smooth scrolling.
		 *
		 * @since 1.4.15
		 * @access private
		 * @method _setImageMaxHeight
		 */
		_setImageMaxHeight: function () {
			var head = $('head'),
				stylesId = 'pp-header-styles-' + this.header.data('header-id'),
				styles = '',
				images = this.header.find('.elementor-element img');

			if ($('#' + stylesId).length) {
				return;
			}

			images.each(function (i) {
				var image = $(this),
					height = image.height(),
					node = image.closest('.elementor-element').data('id'),
					className = 'elementor-element-' + node + '-img-' + i;

				image.addClass(className);
				image.attr('data-no-lazy', 1);
				styles += '.' + className + ' { max-height: ' + height + 'px }';
			});

			if ('' !== styles) {
				head.append('<style id="' + stylesId + '">' + styles + '</style>');
			}
		},

		/**
		 * Removes max height on images in modules for smooth scrolling.
		 *
		 * @since 1.4.15
		 * @access private
		 * @method _removeImageMaxHeight
		 */
		_removeImageMaxHeight: function () {
			$('#pp-header-styles-' + this.header.data('header-id')).remove();
		},
	};

	$(function () { PPHeaderLayout.init(); });

})(jQuery);
