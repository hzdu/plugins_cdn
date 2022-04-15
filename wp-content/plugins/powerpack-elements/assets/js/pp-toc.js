(function ($) {
	var PPToCHandler = elementorModules.frontend.handlers.Base.extend({
		stretchElement: null,

		getDefaultSettings: function () {
			var elementSettings = this.getElementSettings(),
				listWrapperTag =
					"numbers" === elementSettings.marker_view ? "ol" : "ul";

			return {
				selectors: {
					widgetContainer: ".pp-toc",
					container:
						'.elementor:not([data-elementor-type="header"]):not([data-elementor-type="footer"])',
					expandButton: ".pp-toc__header",
					collapseButton: ".pp-toc__header",
					body: ".pp-toc__body",
					headerTitle: ".pp-toc__header-title",
					scrollTop: ".pp-toc__scroll-to-top--container",
				},
				classes: {
					anchor: "pp-toc-menu-anchor",
					listWrapper: "pp-toc__list-wrapper",
					listItem: "pp-toc__list-item",
					listTextWrapper: "pp-toc__list-item-text-wrapper",
					firstLevelListItem: "pp-toc__top-level",
					listItemText: "pp-toc__list-item-text",
					activeItem: "pp-toc-item-active",
					headingAnchor: "pp-toc__heading-anchor",
					collapsed: "pp-toc--collapsed",
				},
				listWrapperTag: listWrapperTag,
			};
		},

		getDefaultElements: function getDefaultElements() {
			var settings = this.getSettings(),
				elementSettings = this.getElementSettings();

			return {
				$pageContainer: jQuery(
					elementSettings.container || settings.selectors.container
				),
				$widgetContainer: this.$element.find(
					settings.selectors.widgetContainer
				),
				$expandButton: this.$element.find(settings.selectors.expandButton),
				$collapseButton: this.$element.find(settings.selectors.collapseButton),
				$tocBody: this.$element.find(settings.selectors.body),
				$listItems: this.$element.find("." + settings.classes.listItem),
				$scrollTop: this.$element.find(settings.selectors.scrollTop),
			};
		},

		bindEvents: function bindEvents() {
			var self = this;

			var elementSettings = this.getElementSettings();

			if (elementSettings.minimize_box) {
				this.elements.$expandButton.on("click", function () {
					if (
						!$(self.$element).hasClass(
							self.getSettings("classes.collapsed")
						)
					) {
						return self.collapseBox();
					} else {
						return self.expandBox();
					}
				});
			}

			if (elementSettings.collapse_subitems) {
				this.elements.$listItems.hover(function (event) {
					return jQuery(event.target).slideToggle();
				});
			}

			if (elementSettings.sticky_toc_toggle) {
				elementorFrontend.elements.$window.on("resize", this.handleStickyToc);
			}

			if (elementSettings.scroll_to_top_toggle) {
				this.elements.$scrollTop.on("click", function () {
					self.scrollToTop();
				});
			}
		},

		getHeadings: function getHeadings() {
			// Get all headings from document by user-selected tags
			var elementSettings = this.getElementSettings(),
				tags = elementSettings.headings_by_tags.join(","),
				selectors = this.getSettings("selectors"),
				excludedSelectors = elementSettings.exclude_headings_by_selector;

			return this.elements.$pageContainer
				.find(tags)
				.not(selectors.headerTitle)
				.filter(function (index, heading) {
					return !jQuery(heading).closest(excludedSelectors).length; // Handle excluded selectors if there are any
				});
		},

		addAnchorsBeforeHeadings: function addAnchorsBeforeHeadings() {
			// Add an anchor element right before each TOC heading to create anchors for TOC links
			var classes = this.getSettings("classes");

			this.elements.$headings.before(function (index) {
				return (
					'<span id="' +
					classes.headingAnchor +
					"-" +
					index +
					'" class="' +
					classes.anchor +
					' "></span>'
				);
			});
		},

		activateItem: function activateItem($listItem) {
			var classes = this.getSettings("classes");

			this.deactivateActiveItem($listItem);

			$listItem.addClass(classes.activeItem);

			this.$activeItem = $listItem;

			if (!this.getElementSettings("collapse_subitems")) {
				return;
			}

			var $activeList = void 0;

			if ($listItem.hasClass(classes.firstLevelListItem)) {
				$activeList = $listItem.parent().next();
			} else {
				$activeList = $listItem.parents("." + classes.listWrapper).eq(-2);
			}

			if (!$activeList.length) {
				delete this.$activeList;

				return;
			}

			this.$activeList = $activeList;

			this.$activeList.stop().slideDown();
		},

		deactivateActiveItem: function deactivateActiveItem($activeToBe) {
			if (!this.$activeItem || this.$activeItem.is($activeToBe)) {
				return;
			}

			var _getSettings = this.getSettings(),
				classes = _getSettings.classes;

			this.$activeItem.removeClass(classes.activeItem);

			if (
				this.$activeList &&
				(!$activeToBe || !this.$activeList[0].contains($activeToBe[0]))
			) {
				this.$activeList.slideUp();
			}
		},

		followAnchor: function followAnchor($element, index) {
			var self = this;

			var anchorSelector = $element[0].hash;

			var $anchor = void 0;

			try {
				// `decodeURIComponent` for UTF8 characters in the hash.
				$anchor = jQuery(decodeURIComponent(anchorSelector));
			} catch (e) {
				return;
			}

			if (0 === index) {
				elementorFrontend.waypoint(
					$anchor,
					function (direction) {
						if (self.itemClicked) {
							return;
						}

						if ("down" === direction) {
							self.activateItem($element);
						} else {
							self.deactivateActiveItem();
						}
					},
					{ offset: "bottom-in-view", triggerOnce: false }
				);
			}

			elementorFrontend.waypoint(
				$anchor,
				function (direction) {
					if (self.itemClicked) {
						return;
					}

					if ("down" === direction) {
						self.activateItem(self.$listItemTexts.eq(index + 1));
					} else {
						self.activateItem($element);
					}
				},
				{ offset: 0, triggerOnce: false }
			);
		},

		followAnchors: function followAnchors() {
			var self = this;

			this.$listItemTexts.each(function (index, element) {
				return self.followAnchor(jQuery(element), index);
			});
		},

		setOffset: function setOffset($listItem) {
			var self = this;

			var settings = this.getSettings();
			var list = this.$element.find("." + settings.classes.listItem);

			var offset = this.getCurrentDeviceSetting("scroll_offset");

			list.each(function () {
				$('a', this).on('click', function (e) {
					e.preventDefault();
					var hash = this.hash;

					$('html, body').animate({
						scrollTop: ($(hash).offset().top - parseInt(offset.size))
					}, 800);
				});
			});
		},

		populateTOC: function populateTOC() {

			var self = this;

			this.listItemPointer = 0;

			var elementSettings = this.getElementSettings();

			if (elementSettings.hierarchical_view) {
				this.createNestedList();
			} else {
				this.createFlatList();
			}

			this.$listItemTexts = this.$element.find(".pp-toc__list-item-text");

			this.$listItemTexts.on("click", this.onListItemClick.bind(this));

			if (!elementorFrontend.isEditMode()) {
				this.followAnchors();
			}

			$(window).on('scroll', function(){

				if ("window_top" === elementSettings.scroll_to_top_option) {

					if( $(window).scrollTop() > 0 ){
						self.elements.$scrollTop.show();
					} else {
						self.elements.$scrollTop.hide();
					}
				} else {

					var $id = self.getID().parents('.elementor-widget-wrap');

					if( $id.offset().top >= $(window).scrollTop() ) {
						self.elements.$scrollTop.hide();
					} else {
						self.elements.$scrollTop.show();
					}
				}
			});
		},

		createNestedList: function createNestedList() {
			var self = this;

			this.headingsData.forEach(function (heading, index) {
				heading.level = 0;

				for (var i = index - 1; i >= 0; i--) {
					var currentOrderedItem = self.headingsData[i];

					if (currentOrderedItem.tag <= heading.tag) {
						heading.level = currentOrderedItem.level;

						if (currentOrderedItem.tag < heading.tag) {
							heading.level++;
						}

						break;
					}
				}
			});

			this.elements.$tocBody.html(this.getNestedLevel(0));
		},

		createFlatList: function createFlatList() {
			this.elements.$tocBody.html(this.getNestedLevel());
		},

		getNestedLevel: function getNestedLevel(level) {
			var settings = this.getSettings(),
				elementSettings = this.getElementSettings(),
				icon = this.getElementSettings("icon");

			// Open new list/nested list
			var html =
				"<" +
				settings.listWrapperTag +
				' class="' +
				settings.classes.listWrapper +
				'">';

			// for each list item, build its markup.
			while (this.listItemPointer < this.headingsData.length) {
				var currentItem = this.headingsData[this.listItemPointer];

				var listItemTextClasses = settings.classes.listItemText;

				if (0 === currentItem.level) {
					// If the current list item is a top level item, give it the first level class
					listItemTextClasses += " " + settings.classes.firstLevelListItem;
				}

				if (level > currentItem.level) {
					break;
				}

				if (level === currentItem.level) {
					html +=
						'<li class="' +
						settings.classes.listItem +
						" " +
						"level-" +
						level +
						'">';

					html += '<div class="' + settings.classes.listTextWrapper + '">';

					var liContent =
						'<a href="#' +
						settings.classes.headingAnchor +
						"-" +
						this.listItemPointer +
						'" class="' +
						listItemTextClasses +
						'">' +
						currentItem.text +
						"</a>";

					// If list type is bullets, add the bullet icon as an <i> tag
					if ("bullets" === elementSettings.marker_view && icon) {
						liContent = '<i class="' + icon.value + '"></i>' + liContent;
					}

					html += liContent;

					html += "</div>";

					this.listItemPointer++;

					var nextItem = this.headingsData[this.listItemPointer];

					if (nextItem && level < nextItem.level) {
						// If a new nested list has to be created under the current item,
						// this entire method is called recursively (outside the while loop, a list wrapper is created)
						html += this.getNestedLevel(nextItem.level);
					}

					html += "</li>";
				}
			}

			html += "</" + settings.listWrapperTag + ">";

			return html;
		},

		handleNoHeadingsFound: function handleNoHeadingsFound() {
			
			var _messages = ppToc;

			if (elementorFrontend.isEditMode()) {
				return this.elements.$tocBody.html(
					_messages.no_headings_found
				);
			}
		},

		collapseOnInit: function collapseOnInit() {
			self = this;
			var minimizedOn = this.getElementSettings("minimized_on"),
				currentDeviceMode = elementorFrontend.getCurrentDeviceMode();

			if ("" !== minimizedOn && "array" !== typeof minimizedOn) {
				minimizedOn = [minimizedOn];
			}

			if ( 0 !== minimizedOn.length  && "object" === typeof minimizedOn ) {
				minimizedOn.forEach(function (value) {
					if (
						( "desktop" === value[0] && "desktop" == currentDeviceMode && $(window).width() < elementorFrontend.config.breakpoints.xxl ) ||
						( "tablet" === value[0] && "tablet" === currentDeviceMode && $(window).width() < elementorFrontend.config.breakpoints.lg ) ||
						( "mobile" === value[0] && "mobile" === currentDeviceMode && $(window).width() < elementorFrontend.config.breakpoints.md )
					) {
						self.collapseBox();
					}
				});
			}
		},

		setHeadingsData: function setHeadingsData() {
			var self = this;

			this.headingsData = [];

			// Create an array for simplifying TOC list creation
			this.elements.$headings.each(function (index, element) {
				self.headingsData.push({
					tag: +element.nodeName.slice(1),
					text: element.textContent,
				});
			});
		},

		run: function run() {

			elementSettings = this.getElementSettings();

			this.elements.$headings = this.getHeadings();

			if (!this.elements.$headings.length) {
				return this.handleNoHeadingsFound();
			}

			this.setHeadingsData();

			if (!elementorFrontend.isEditMode()) {
				this.addAnchorsBeforeHeadings();
			}

			this.populateTOC();

			if (elementSettings.minimize_box) {
				this.collapseOnInit();
			}

			if (elementSettings.sticky_toc_toggle) {
				this.handleStickyToc();
			}

			if ( "" !== elementSettings.scroll_offset.size && undefined !== elementSettings.scroll_offset.size ) {
				this.setOffset();
			}
		},

		expandBox: function expandBox() {
			var boxHeight = this.getCurrentDeviceSetting("min_height");

			this.$element.removeClass(this.getSettings("classes.collapsed"));

			this.elements.$tocBody.slideDown();

			// return container to the full height in case a min-height is defined by the user
			this.elements.$widgetContainer.css(
				"min-height",
				boxHeight.size + boxHeight.unit
			);
		},

		collapseBox: function collapseBox() {
			this.$element.addClass(this.getSettings("classes.collapsed"));

			this.elements.$tocBody.slideUp();

			// close container in case a min-height is defined by the user
			this.elements.$widgetContainer.css("min-height", "0px");
		},

		onInit: function onInit() {
			var self = this;

			this.initElements();
			this.bindEvents();

			jQuery(document).ready(function () {
				return self.run();
			});
		},

		onListItemClick: function onListItemClick(event) {
			var self = this;

			this.itemClicked = true;

			setTimeout(function () {
				return (self.itemClicked = false);
			}, 2000);

			var $clickedItem = jQuery(event.target),
				$list = $clickedItem.parent().next(),
				collapseNestedList = this.getElementSettings("collapse_subitems");

			var listIsActive = void 0;

			if (
				collapseNestedList &&
				$clickedItem.hasClass(this.getSettings("classes.firstLevelListItem"))
			) {
				if ($list.is(":visible")) {
					listIsActive = true;
				}
			}

			this.activateItem($clickedItem);

			if (collapseNestedList && listIsActive) {
				$list.slideUp();
			}
		},

		handleStickyToc: function handleStickyToc() {

			var self = this;

			var elementSettings = this.getElementSettings();

			var currentDeviceMode = elementorFrontend.getCurrentDeviceMode();

			var $devices = elementSettings.sticky_toc_disable_on;

			var target = this.getID();			

			var type = elementSettings.sticky_toc_type;

			if ("in-place" === type) {				
				
				var parentWidth = target.parent().parent().outerWidth();

				target.css("width", parentWidth);
				tocWidth = parentWidth;
			} else if( "custom-position" === type ) {
				target.css("width", "");
			}

			if (-1 !== $.inArray(currentDeviceMode, $devices) ) {

				target.removeClass('floating-toc');
				$(window).off('scroll', this.stickyScroll);

				return;
			}		

			$(window).on('scroll', $.proxy( this.stickyScroll, this ));		
		},

		stickyScroll: function (){

			var target = this.getID();
			var elementSettings = this.getElementSettings();
			var item = document.querySelector(".elementor-widget-pp-table-of-contents");			

			var bound, tocHeight;

			bound = item.getBoundingClientRect();

			tocHeight = target.outerHeight();

			if (target.hasClass("floating-toc")) {
				target.parent().parent().css("height", tocHeight);
			} else {
				target.parent().parent().css("height", '');
			}

			if (bound.y + bound.height / 2 < 0) {
				
				if(target.hasClass('floating-toc')){
					return;
				}

				target.fadeOut(250, function(){
					target.addClass("floating-toc");
					target.fadeIn();
				});

			} else {
				
				if(!target.hasClass('floating-toc')){
					return;
				}

				target.fadeOut(250, function(){
					target.removeClass("floating-toc");
					target.fadeIn();
				});
			}
		},
	

		scrollToTop: function scrollToTop() {
			var self = this;

			var scrollTo = this.getElementSettings("scroll_to_top_option");

			if ("window_top" === scrollTo) {
				$("html, body").animate({
					scrollTop: 0
				}, 250 );
			} else {

				var $id = this.getID().parents('.elementor-widget-pp-table-of-contents');

				$("html, body").animate({
					scrollTop: $($id).offset().top - 60,
				}, 250 );
			}
		},

		getID: function getID() {
			return $("#pp-toc-" + this.$element[0].attributes["data-id"].nodeValue);
		},
	});

	jQuery(window).on("elementor/frontend/init", function () {
		var addHandler = function ($element) {
			elementorFrontend.elementsHandler.addHandler(PPToCHandler, {
				$element: $element,
			});
		};
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/pp-table-of-contents.default",
			addHandler
		);
	});
})(jQuery);
