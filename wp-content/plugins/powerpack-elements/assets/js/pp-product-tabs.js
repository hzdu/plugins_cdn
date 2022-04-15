(function ($) {
	var PPWooTabsHandler = elementorModules.frontend.handlers.Base.extend({
		stretchElement: null,

		getDefaultSettings: function () {
			var elementSettings = this.getElementSettings();

			return {
				selectors: {
					widgetContainer: ".pp-woo-product-tabs-wrapper",
					tabWrapper: ".woocommerce-tabs",
					tabListWrapper: ".wc-tabs-wrapper",
					tabList: ".wc-tabs",
					tabItem: ".wc-tabs li",
				},
				classes: {
					tabListWrapper: "wc-tabs-wrapper",
					tabList: "wc-tabs",
					itemActive: "active",
				},
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
				$tabList: this.$element.find(settings.selectors.tabList),
				$tabWrapper: this.$element.find(settings.selectors.tabWrapper),
				$tabItem: this.$element.find(settings.selectors.tabItem),
			};
		},

		bindEvents: function bindEvents() {
			var self = this;

			this.elements.$tabItem.hover(
				function () {
					$(this).toggleClass("hover");
				},
				function (event) {
					$(this).toggleClass("hover");
				}
			);
		},

		activeTabIndicator: function activeTabIndicator() {
			var self = this;

			var mode =
				this.getElementSettings(
					"woo_products_tab__active_tab_indicator_horizontal"
				) ||
				this.getElementSettings(
					"woo_products_tab__active_tab_indicator_vertical"
				);
			var position =
				this.getElementSettings(
					"woo-products-tab__active-tab-indicator-position-horizontal"
				) ||
				this.getElementSettings(
					"woo-products-tab__active-tab-indicator-position-vertical"
				) ||
				"";

			this.elements.$tabList.toggleClass(mode);
			this.elements.$tabList.toggleClass(position);
		},

		setActiveTab: function setActiveTab(id) {
			// Select tabs container and run click event on it
			$(".wc-tabs, ul.tabs li:nth-child(" + id + ") a").click();
		},

		tabMode: function tabMode() {
			// Check position of icon and add tab flex-class top, bottom, left, right.

			var iconPosition = this.getElementSettings(
				"woo-product-tabs__icon-position"
			);
			this.elements.$tabList.toggleClass(iconPosition);
		},

		layoutMode: function layoutMode() {
			var mode = this.getElementSettings("woo_product_tabs__tab_layout");

			this.elements.$tabWrapper.toggleClass(mode);
		},

		addIcons: function addIcons() {
			//Check Mode

			if (
				"icon" ===
				this.getElementSettings("woo-product-tabs__tab-style")
			) {
				this.elements.$tabItem.each(function () {
					this.childNodes[1].childNodes[0].data = "";
				});
			}

			//Declare variables
			var icon, iconType;

			// Get Repeater Control's settings

			var x = this.getElementSettings("product_tabs--repeater-section");

			// Iterate over all the elements in the tab list to get the right icon

			this.elements.$tabList.children().each(function () {
				var id = $(this).attr("id").replace("tab-title-", "");

				x.forEach(function (item, index) {
					if (item._id === id) {
						icon = item.product_tab_icon.value;
						iconType = item.product_tab_icon.library;
					}
				});

				// Add the icon to the element
				var y = this.firstElementChild;
				y.insertAdjacentHTML(
					"afterbegin",
					'<i class="pp-icon ' + icon + " " + iconType + '"></i>'
				);
			});
		},

		responsiveMode: function responsiveMode() {
			//Swtich off default click action by WooCommerce's JS
			$(".wc-tabs li a, ul.tabs li a").off("click");

			// Hide tab list
			$("ul.tabs.wc-tabs").empty();

			// Append tab titles to content panels

			// 1. Get repeater IDs
			var $repeater = this.getElementSettings('product_tabs--repeater-section');

			// 2. Get Panel IDs
			var $panels = $('.woocommerce-Tabs-panel');
			$panels.css('display', 'block');

			var $repeater = this.getElementSettings(
				"product_tabs--repeater-section"
			);

			// Compare IDs

			_.each($repeater, function ($r) {
				$panels.each(function () {
					if ("tab-" + $r._id === $(this).attr("id")) {
						var html =
							'<div id="tab-title-' +
							$r._id +
							'" role="tab" ><a href="#tab-' +
							$r._id +
							'">' +
							$r.title +
							"</a></div>";

						this.insertAdjacentHTML("afterbegin", html);

						$("#tab-" + $r.id).on("click", function () {
							event.preventDefault();
						})
					}
				});
			});
		},

		initJS: function initJS() {
			// Trigger WooCommerce's Single Product JS manually on widget load
			this.elements.$tabWrapper.trigger("init");
		},

		run: function run() {
			// Initialize WooCommerce JS for Tabs
			this.initJS();

			//Add icons to tabs

			if (
				"title" !==
				this.getElementSettings("woo-product-tabs__tab-style")
			) {
				this.addIcons();
			}

			//Add layout class
			this.layoutMode();

			//Add icon class
			this.tabMode();

			//Init active tab indicator
			if (
				"" !==
				this.getElementSettings(
					"woo-products-tab__active-tab-indicator"
				)
			) {
				this.activeTabIndicator();
			}

			// Activate default tab
			if (this.getElementSettings("woo-product-tabs__default-tab") > 0) {
				this.setActiveTab(
					this.getElementSettings("woo-product-tabs__default-tab")
				);
			}
		},

		onInit: function onInit() {
			var self = this;

			this.initElements();
			this.bindEvents();

			$(document).ready(function () {
				return self.run();
			});
		},
	});

	jQuery(window).on("elementor/frontend/init", function () {
		var addHandler = function ($element) {
			elementorFrontend.elementsHandler.addHandler(PPWooTabsHandler, {
				$element: $element,
			});
		};
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/pp-woo-product-tabs.default",
			addHandler
		);
	});
})(jQuery);
