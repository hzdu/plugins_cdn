/**
 * Views for the Getty Images plugin
 *
 * @package Getty Images
 * @author  bendoh, thinkoomph
 */
(function($) {
	var media = wp.media;
	var getty = gettyImages;
	var l10n = media.view.l10n;

	// Turn a number string into a comma-separated triplet human-readable number,
	// used a few places throughout.
	Number.prototype.commaString = function() {
		var parts = this.toString().split('.');

		if(parts[0].length == 0)
			return '';
		var result = parts[0].split('').reverse().join('').match(/(\d{1,3})/g).join(',').split('').reverse().join('');

		if(parts[1]) {
			result += '.' + parts[1];
		}

		return result;
	};

	// Turn "CamelCasedString" into "Camel Cased String"
	String.prototype.reverseCamelGirl = function() {
		return this.replace(/(?!^)(?=[A-Z])/g, ' ');
	};

	// Convert various pipe-wrapped links in text to appropriate
	// links
	String.prototype.gettyLinkifyText = function() {
		var result = this,
				matches = result.match(/\|(.+?)\|/),
				link;

		while(matches) {
			if(matches[1] == "More information") {
				link = 'http://www.gettyimages.com/Corporate/ReleaseInfo/Release_May_Not_Be_Required_Popup.en-US.pdf';
			}
			else {
				link = 'http://www.gettyimages.com/Corporate/ContactUs.aspx';
			}

			result = result.replace(matches[0], '<a href="' + link + '" target="_getty">' + matches[1] + '</a>');
			matches = result.match(/\|(.+?)\|/);
		}

		return result;
	}

	/**
	 * Extend both top-level media frames with an additional mode for fetching
	 * and downloading images from Getty Images.
	 */
	var GettyImagesFrame = function(parent) {
		return {
			createStates: function() {
				parent.prototype.createStates.apply( this, arguments );

				this.states.add([
					new media.controller.GettyImages({
						id: 'getty-images',
						title: getty.text.title,
						titleMode: 'getty-title-bar',
						multiple: true,
						content: 'getty-images-browse',
						router: false,
						menu: 'default',
						toolbar: 'getty-images-toolbar',
						sidebar: 'getty-image-settings',
						selection: new media.model.Selection(null, { multiple: true }),
						edge: 120,
						gutter: 8
					}),
				]);
			},
		}
	};

	media.view.MediaFrame.Post = media.view.MediaFrame.Post.extend(GettyImagesFrame(media.view.MediaFrame.Post));

	/**
	 * The Getty Images Browser view
	 */
	media.view.GettyBrowser = media.view.AttachmentsBrowser.extend({
		template: media.template('getty-attachments-browser'),
		className: 'attachments-browser getty-attachments-browser mosaic-view',

		events: {
			'keyup .search': 'searchOnEnter',
			'click .filters-and-sort': 'toggleRefinementOptions',
			'click .getty-images-more': 'more',
			'change .getty-filter-asset-type input': 'modeFlag',
			'click .getty-keyword': 'searchKeyword',
			'click .mosaic-icon': 'setMosaicViewMode',
			'click .grid-icon': 'setGridViewMode',
			'click .go-to-login-button': 'changeModeToLoginPage'
		},

		initialize: function() {
			getty.viewMode = 'mosaicView';

			this.render();

			// The possible refinement categories for a search
			this.refinementCategories = this.options.categories;

			// The set of refinements added to a search
			this.refinements = this.options.refinements;

			// Update possible refinement categories
			this.collection.results.on('change:refinements', this.updateRefinementCategories, this);

			// Handle changes to refinements list
			this.refinements.on('add remove', this.updateSearchRefinements, this);
			this.refinements.on('reset', this.clearSearchRefinements, this);

			// Set various flags whenever the results description model  changes
			this.collection.results.on('change:searched change:total change:refinements', this.updateFlags, this);
			this.collection.results.on('change:searching', this.updateSearching, this);

			// Set search mode flag when ImageFamilies value changes
			this.collection.props.on('change:ImageFamilies', this.updateMode);

			// Trigger search when changing refinements.
			this.collection.propsQueue.on('refinementRemoved', this.search, this);
			this.collection.propsQueue.on('refinementChanged', this.search, this);
			this.collection.facets.on('refinementRemoved', this.search, this);
			this.collection.facets.on('refinementChanged', this.search, this);

			// Set .have-more flag when there're more results to load
			this.collection.on('add remove reset', this.updateHaveMore, this);

			// Update total
			this.collection.results.on('change:total', this.updateTotal, this);

			this.controller.state().on('activate', this.ready, this);

			this.controller.state().on('change:refining', this.addRefiningClass, this);
			this.addRefiningClass();

			this.views.set('.getty-landing-container', new media.view.GettyLandingPage({gettyBrowser: this}));

			media.view.AttachmentsBrowser.prototype.initialize.apply(this, arguments);

			$(window).on('resize', _.bind(this.renderMosaicView, this));
		},

		// Refinement changes will always update the query
		updateSearchRefinements: function() {
			var searchWithin = '';
			var categoryRefinements = [];

			// Concatenate free-form search within fields to search query
			this.refinements.each(function(refinement) {
				if(refinement.get('text') && !refinement.get('id')) {
					searchWithin += refinement.get('text') + ' ';
				}
				else {
					categoryRefinements.push({
						Category: refinement.get('category'),
						Id: refinement.id
					});
				}
			}, this);

			if(searchWithin) {
				this.collection.propsQueue.set('SearchWithin', searchWithin);
			}
			else {
				this.collection.propsQueue.unset('SearchWithin');
			}

			this.collection.propsQueue.set('Refinements', categoryRefinements);

			this.collection.search();
		},

		clearSearchRefinements: function() {
			this.collection.propsQueue.set('Refinements', []);
		},

		/**
		 * Download the selected image to the WordPress install.
		 */
		download: function(callback) {
			var attachment = media.model.GettyAttachments.all.get(this.options.selection.single());
			this.trackDownload(attachment);
			attachment.download(callback);
		},

		/**
		 * Select asset attributes to track
		 */
		 trackDownload: function(asset) {
			getty.tracking.asset.id = asset.get('ImageId');
			getty.tracking.asset.family = asset.get('ImageFamily');
		 },

		/**
		 * Build the set of possible category refinements based on return set from
		 * API.
		 */
		updateRefinementCategories: function() {
			var refinements = this.collection.results.get('refinements');

			// May have gotten here via a reset.
			if(!refinements) {
				return;
			}

			// Add / update possible refinement categories
			refinements.each(function(category) {
				var refinementCategory = this.refinementCategories.get(category.id);

				if(!refinementCategory) {
					// Category exists in search refinements, but not in view. Pop into view
					refinementCategory = new Backbone.Model({
						id: category.id,
						options: new Backbone.Collection()
					});

					this.refinementCategories.add(refinementCategory);
				}

				var options = category.get('options').filter(function(option) {
					return option.get('text') != '(future event)';
				});

				refinementCategory.get('options').set(options);

				// Kill any events that eventually resolve to "(future event)" as text
				refinementCategory.get('options').on('change:text', function(model) {
					if(model.get('text') == "(future event)") {
						refinementCategory.get('options').remove(model);
					}
				});
			}, this);

			// Remove refinement categories that are no longer applicable
			this.refinementCategories.each(function(refinementCategory) {
				if(!refinements.get(refinementCategory.id) || (refinementCategory.get('options').filter(function(model) { return !model.get('active'); })).length == 0) {
					this.refinementCategories.remove(refinementCategory.id);
				}
			}, this);

			this.refinementCategories.trigger('sort');
		},

		/**
		 * When activated, restore any injected content, focus on search field
		 */
		ready: function() {
			this.updateFlags(this.collection.results);
			this.updateTotal();
			this.$el.find('.search-primary').focus();

			$(".getty-landing-container").show();
			$(".getty-landing").show();
			$(".getty-browser").hide();
		},

		// Create attachments view
		updateContent: function() {
			var view = this;

			if( !this.attachments )
				this.createAttachments();
		},

		setMosaicViewMode: function() {
			getty.viewMode = 'mosaicView';
			this.renderMosaicView();
		},

		setGridViewMode: function() {
			getty.viewMode = 'gridView';

			this.collection.each(function(model) {
				model.set('viewMode', 'gridView');
			});
		},

		renderMosaicView: function ()
		{
			var imagePadding = 3;
			if (getty.viewMode == 'mosaicView') {

				var imageList = this.collection.models.map(function(model) {
					return {
						assetId: model.attributes.id,
						height: model.attributes.max_dimensions.height,
						width: model.attributes.max_dimensions.width
						}
					});

				var container = this.$el.find('.getty-browser');
				var containerWidth = container.width() * 0.99;
				var mosaicRows = mosaic.buildMosaicRows(containerWidth, imagePadding * 2, imageList, containerWidth * 1 / 4);
				if(mosaicRows[0].images.length === 0) {
					mosaicRows.shift();  //remove first empty row.
				}

				var rowIndex, imageIndex, height;
				for (rowIndex = 0; rowIndex < mosaicRows.length; rowIndex++) {
					var row = mosaicRows[rowIndex];
					if (row.width >= containerWidth) {
						var totalPad = (row.images.length * imagePadding * 2);
						var scale = (containerWidth - totalPad) / (row.width - totalPad);
						height = Math.floor(row.minHeight * scale);
					}
					else {
						height = Math.floor(row.minHeight);
					}
					for (imageIndex = 0; imageIndex < row.images.length; imageIndex++) {
						var image = row.images[imageIndex];
						var model = this.collection.get(image.assetId);
						model.set({
							'viewMode': getty.viewMode,
							'height': height
						});
					}
				}
			}
		},

		// Start a new search for a keyword
		searchKeyword: function(ev) {
			this.collection.props.set('search', _.unescape($(ev.target).text()));
			this.search();
		},

		// Create sidebar and register hooks on selection
		createSidebar: function() {
			var options = this.options,
				selection = options.selection,
				sidebar = this.sidebar = new media.view.Sidebar({
					controller: this.controller
				});

			this.views.set('.getty-sidebar', sidebar);

			selection.on( 'selection:single', this.createSingle, this );
			selection.on( 'selection:unsingle', this.disposeSingle, this );

			if( selection.single() )
				this.createSingle();
		},

		// Create single attachment detail view for sidebar
		createSingle: function() {
			var sidebar = this.sidebar,
				single = this.options.selection.single();

			var attachment = single.id ? media.model.GettyAttachments.all.get(single.id) : false;

			if(attachment) {
				var displayOptions = {
					model: this.model.display(attachment),
					// for non-logged in users, put the display options higher
					priority: 80,
					userSettings: true
				};

				var details = new media.view.GettyDetails({
					gettyBrowser: this,
					controller: this.controller,
					model: attachment,
					priority:   70,
					displayOptions: displayOptions,
					collection: this.options.selection
				});

				sidebar.set('details',  details);
			}
		},

		// Update total count
		updateTotal: function() {
			var total = 0;

			if(this.model) {
				total = this.collection.results.get('total') || 0;
			}
			//set value for tracking
			getty.tracking.search.results_count = total;

			var separated = new Number(total).commaString();

			if(total > 0) {
				if(total == 1) {
					this.total.$el.text(getty.text.oneResult.replace('%d', separated));
				}
				else {
					this.total.$el.text(getty.text.results.replace('%d', separated));
				}
			}
			else {
				this.total.$el.text(getty.text.noResults);
			}
		},

		// Handle return key in primary search or click on "Search" button
		// This starts a new top-level search
		searchOnEnter: function(ev) {
			if(ev.keyCode == 13) {
				this.collection.props.set('search', _.unescape($(ev.target).val()));
				this.search();
			}
		},

		// Start a new search
		search: function(options) {
			$(".getty-landing-container").hide();
			$(".getty-browser").show();

			this.refinements.reset();
			this.refinementCategories.reset();

			if (options && options.eventIds){
				this.collection.propsQueue.set('EventIds', options.eventIds);
			}
			else {
				this.collection.propsQueue.unset('EventIds');
			}

			if (options && options.assetIds)
			{
				this.collection.propsQueue.set('AssetsIds', options.assetIds);
			}
			else {
				this.collection.propsQueue.unset('AssetsIds');
			}

			this.collection.propsQueue.unset('SearchWithin');
			this.collection.propsQueue.unset('Refinements');

			this.collection.search();
		},

		// Create the Search Toolbar, containing filters
		createToolbar: function() {
			var self = this;

			// Create the toolbar
			this.toolbar = new media.view.Toolbar({
				className: 'getty-images-toolbar',
				controller: this.controller,
				model: this.collection
			});

			// Make primary come first.
			this.toolbar.views.set([ this.toolbar.primary, this.toolbar.secondary ]);

			this.total = new media.View({
				tagName: 'span',
				className: 'search-results-total',
				priority: -20
			});

			// Wrap search input in container because IE10 ignores left/right absolute
			// positioning on input[type="text"]... because.
			this.searchContainer = new media.View({ className: 'getty-search-input-container' });

			this.searchContainer.views.add(new media.view.GettySearch({
				className: 'search search-primary',
				model:      this.collection.propsQueue,
				priority:   0,
				attributes: {
					type: 'search',
					placeholder: getty.text.searchPlaceholder,
					tabindex: 10
				}
			}));

			// Views with negative priority get put in secondary toolbar area
			this.toolbar.set({
				search: this.searchContainer,

				// Plain objects get turned into buttons
				searchButton: {
					click: function() { self.search() },
					priority: 10,
				},

				filterTags: new media.view.GettyImageFilterTagsContainer({
					controller: this.controller,
					model: this.collection,
					priority: 15
				}),

				assetTypeFilters: new media.view.GettyAssetTypeFilter({
					controller: this.controller,
					model: this.collection.propsQueue,
					priority: 25,
				}),

				imageTypeFilters: new media.view.GettyImageTypeFilter({
					controller: this.controller,
					model: this.collection.propsQueue,
					priority: 30,
				}),

				editorialSortOrderFilter: new media.view.GettyEditorialSortOrderFilter({
					controller: this.controller,
					model: this.collection.propsQueue,
					priority: 35
				}),

				creativeSortOrderFilter: new media.view.GettyCreativeSortOrderFilter({
					controller: this.controller,
					model: this.collection.propsQueue,
					priority: 35
				}),

				orientationFilter: new media.view.GettyOrientationFilter({
					controller: this.controller,
					model: this.collection.propsQueue,
					priority: 45
				}),

				nudityFilter: new media.view.GettyNudityFilter({
					controller: this.controller,
					model: this.collection.propsQueue,
					priority: 50
				}),

				refineExpand: new media.View({
					tagName: 'a',
					className: 'getty-refine-toggle',
					priority: -40,
				}),

				filtersBar: new media.View({
					tagName: 'div',
					className: 'getty-filters-bar',
					priority: -40,
				}),

				total: this.total
			});

			// Create collapsable "refine" box for additional filters
			// which vary depending on results
			//this.toolbar.secondary.get('refineExpand').$el.text(getty.text.refine).prepend('<span class="getty-refine-toggle-arrow">&nbsp;</span>');

			this.toolbar.secondary.get('filtersBar').$el.prepend('<div class="filters-and-sort">Filter and Sort <span class="getty-refine-toggle-arrow-up">⋀</span> <span class="getty-refine-toggle-arrow-down">⋁</span> </div>\
					<input type="radio" id="gridView" name="viewMode"/> <label for="gridView" class="grid-icon"></label>\
					<input type="radio" id="mosaicView" name="viewMode" checked="checked" /> <label for="mosaicView" class="mosaic-icon"></label>');

			this.views.set('.getty-search-toolbar', this.toolbar);

			// Refinements are singular and can be stacked
			this.views.set('.getty-refine', new media.view.GettyRefinements({
				tagName: 'div',
				className: 'search-results-refine',
				categories: this.refinementCategories,
				refinements: this.refinements,
				controller: this.controller,
				attachmentsCollection: this.collection
			}));

			this.modeFlag();
		},

		createAttachments: function() {
			// No-op the scroll handler, making paging manual.
			// works better with a slow API.
			media.view.Attachments.prototype.scroll = function(ev) {
				// Don't bubble upwards and out of the modal
				if(ev) {
					ev.stopPropagation();
				}
			};

			this.attachments = new media.view.GettyAttachments({
				controller: this.controller,
				collection: this.collection,
				selection:  this.options.selection,
				model:      this.model,
				sortable:   this.options.sortable,
				refreshThreshold: 2,

				// The single `Attachment` view to be used in the `Attachments` view.
				AttachmentView: this.options.AttachmentView
			});

			this.views.set('.getty-results', this.attachments);

			// Create "More" button, because automatic paging is just too slow with
			// this API.
			this.moreButton = new media.view.GettyMore();
			this.moreButton.render(); // Load in the template, just once.

			// Keep a handy reference to the field to update
			this.moreButton.$remaining = this.moreButton.$el.find('.getty-number-remaining');

			this.collection.on('add reset', this.updateMore, this);
			this.collection.results.on('change', this.updateMore, this);

			this.updateMore();
		},

		// Calculate remainder and update "More..." link
		updateMore: function(model, collection, options) {
			// Always keep add more link at the end of the list
			if(this.attachments) {
				this.attachments.$el.append(this.moreButton.$el);
			}

			// Update the total
			var total = this.collection.results.get('total');

			if(typeof total == "number") {
				this.moreButton.$remaining.text(new Number(total - this.collection.length).commaString());
			}

			this.updateHaveMore();
		},

		// Load more results
		more: function() {
			this.collection.more();
		},

		/**
		 * Toggle refining state
		 */
		toggleRefinementOptions: function() {
			$(".getty-refine-toggle-arrow-up").toggle();
			$(".getty-refine-toggle-arrow-down").toggle();
			this.controller.state().set('refining', !this.controller.state().get('refining'));
		},

		/**
		 * Toggle refining class when refining state changes
		 */
		addRefiningClass: function() {
			this.$el.toggleClass('refining', !!this.controller.state().get('refining'));
		},

		/**
		 * Show loading state
		 */
		updateSearching: function(model) {
			this.$el.toggleClass('search-loading', model.get('searching'));

			var button = this.controller.toolbar.view.$el.find('.media-button-searchButton');
			if(model.get('searching')) {
				button.attr('disabled', 'disabled');

				if(model.spinner) {
					model.spinner.stop();
				}

				var opts = { className: 'getty-spinner', color: '#888' };
				var $el;

				if(this.haveMore()) {
					opts.color = '#ddd';
					$el = this.moreButton.$el.find('.getty-more-spinner');
				}
				else {
					opts.color = '#888';
					opts.lines = 11;
					opts.length = 21;
					opts.width = 9;
					opts.radius = 38;
					$el = this.$el.find('.getty-search-spinner')
				}

				model.spinner = new Spinner(opts);
				model.spinner.spin($el[0]);
			}
			else if(model.spinner) {
				this.renderMosaicView();
				button.removeAttr('disabled');
				model.spinner.stop();
			}
		},

		/**
		 * Add flags to container for various states
		 */
		updateFlags: function(model) {
			var searching = !!model.get('searching');
			var searched = !!model.get('searched');

			this.$el.find('.getty-landing').toggle(!searching && !searched);
			this.$el.find('.getty-browser').toggle(searching || searched);

			this.$el.toggleClass('have-searched', !!model.get('searched'));
			this.$el.toggleClass('have-results', model.get('total') > 0);

			var refinements = model.get('refinements');

			this.$el.toggleClass('have-refinements', true);

			this.$el.removeClass('search-editorial').removeClass('search-creative')
				.addClass('search-' + this.collection.propsQueue.get('ImageFamilies'));
		},

		/**
		 * Add .search-editorial or .search-creative classes to top-level container
		 */
		modeFlag: function() {
			this.$el.removeClass('search-editorial').removeClass('search-creative')
				.addClass('search-' + this.collection.propsQueue.get('ImageFamilies'));
		},

		/**
		 * Are there more images to be loaded?
		 */
		haveMore: function() {
			return this.collection.length > 0 && this.collection.length < this.collection.results.get('total');
		},

		/**
		 * Add .have-more flag to container when there are more results
		 * to be loaded.
		 */
		updateHaveMore: function(model, collection) {
			this.$el.toggleClass('have-more', this.haveMore());
			this.$el.toggleClass('no-more', !this.haveMore());
		},

		changeModeToLoginPage: function() {
			getty.user.logout();
			getty.user.settings.set('mode', 'login');
		},
	});

	/**
	 * Attachments
	 */
	media.view.GettyAttachments = media.view.Attachments.extend({
		prepare: function() {
			// Create all of the Attachment views, and replace
			// the list in a single DOM operation.
			if (this.collection.length) {
				this.views.set(this.collection.map(this.createAttachmentView, this));
			} else {
				this.views.unset();
			}
		}
	});

	/**
	 * View used to display the "More" button
	 */
	media.view.GettyMore = media.View.extend({
		template: media.template('getty-images-more'),
		tagName: 'li',
		className: 'getty-images-more attachment'
	});

	/**
	 * Comp Display Options
	 */
	media.view.GettyAttachmentDisplaySettings = media.view.Settings.extend({
		template: media.template('getty-display-settings'),

		initialize: function() {
			getty.user.on('change:loggedIn', this.render, this);
			this.model.on('change:sizes', this.render, this);
			media.view.Settings.prototype.initialize.apply(this, arguments);
		}
	});

	/**
	 * The title bar, containing the logo, "privacy" and "About" links
	 */
	media.view.GettyTitleBar = media.View.extend({
		template: media.template('getty-title-bar'),
		className: 'getty-title-bar',
		events: {
			'click .getty-about-link': 'showAbout',
			'click .getty-login-toggle': 'toggleUserPanel',
			'click .getty-mode-change': 'changeMode',
			'click .getty-images-title': 'backToLandingPage'
		},

		initialize: function() {
			if(this.controller.get('unsupported')) {
				return;
			}

			// Create user view using the globalized, persistent user model
			if(this.controller.get('mode') == 'login') {
				this.updateMode(this.controller, 'login');
			}

			getty.user.settings.on('change:mode change:omniture-opt-in', this.render, this);
			getty.user.settings.on('change:mode', this.updateMode, this);

			$(document).off('.getty-user-panel-close');
			$(document).on('click.getty-user-panel-close', function(ev) {
				var $target = $(ev.target);
				if($target.closest('.getty-user-session').length == 0 && $target.closest('.getty-login-toggle').length == 0) {
					getty.user.set('promptLogin', false);
				}
			});
		},

		updateMode: function(model, mode) {
			if(!mode) {
				this.views.unset('.getty-user-session');
				delete(this.user);
			}
			else if(mode == 'login' && !this.user) {
				this.user = new media.view.GettyUser({
					controller: this,
					model: getty.user
				});

				this.views.set('.getty-user-session', this.user);
				getty.user.on('change:loggedIn', this.render, this);
			}
		},

		prepare: function() {
			return this.controller.attributes;
		},

		changeMode: function() {
			getty.user.settings.unset('mode');
		},

		toggleUserPanel: function() {
			getty.user.set('promptLogin', !getty.user.get('promptLogin'))
		},

		showAbout: function() {
			this.controller.frame.content.mode('getty-about-text');
		},

		backToLandingPage: function () {
			$('.getty-browser').hide();
			$('.getty-landing-container').show();
			$('.getty-landing').show();
		}
	});

	/**
	 * The primary search field. Refreshes when model changes
	 */
	media.view.GettySearch = media.view.Search.extend({
		initialize: function() {
			this.model.on('change:search', this.render, this);
		},

		ready: function() {
			this.render();
		},

		render: function() {
			media.view.Search.prototype.render.apply(this, arguments);

			var term = this.model.get('search');

			if(typeof term != 'string' || term.match(/^\s*$/)) {
				this.$el.parents('.media-toolbar-primary').find('.media-button-searchButton').attr('disabled', 'disabled');
			}
			else {
				this.$el.parents('.media-toolbar-primary').find('.media-button-searchButton').removeAttr('disabled');
			}
		}
	});

	/**
	 * The "About" screen, containing text and a close button
	 */
	media.view.GettyAbout = media.View.extend({
		template: media.template('getty-about-text'),
		className: 'getty-about-text',

		events: {
			'click .getty-about-close': 'close',
		},

		close: function() {
			this.controller.frame.content.mode('getty-images-browse')
		},

		closeAboutOnEscape: function(ev) {
			if(ev.keyCode == 27) {
				this.close();
				ev.stopPropagation();
			}
		}
	});

	/**
	 * Your browser is unsupported. Wah wah.
	 */
	media.view.GettyUnsupportedBrowser = media.View.extend({
		className: 'getty-unsupported-browser-message',
		template: media.template('getty-unsupported-browser')
	});

	/**
	 * View used to display a single Getty Image thumbnail
	 * in the results grid
	 */
	media.view.GettyAttachment = media.view.Attachment.extend({
		template: media.template('getty-attachment'),

		initialize: function() {
			media.view.Attachment.prototype.initialize.apply(this, arguments);

			this.model.on('change:Status', function() {
				this.$el.addClass('status-' + this.model.get('Status'));
			}, this);
		},
		// Only add to selection, up to 10
		toggleSelection: function( options ) {
			var collection = this.collection,
				selection = this.options.selection,
				model = this.model,
				method = options && options.method,
				single, between, models, singleIndex, modelIndex;

			if ( ! selection )
				return;

			selection.unshift( model );

			// Lop off the end if we're past 10
			while(selection.length > 10) {
				selection.pop();
			}

			selection.single( model );
		},
	});

	/**
	 * Settings / Info for a particular selected getty image
	 * shown in the sidebar
	 */
	media.view.GettyDetails = media.view.Attachment.Details.extend({
		template: media.template('getty-image-details'),
		className: 'getty-image-details',

		events: {
			'change .getty-attachment-details input': 'updateModel', // Propagate changes to Getty Form
		},

		initialize: function() {
			media.view.Attachment.Details.prototype.initialize.apply(this, arguments);

			getty.user.on('change:loggedIn', this.render, this);

			this.views.set('.getty-image-thumbnail', new media.view.GettyDetailImage({
				model: this.model
			}));

			this.views.set('.getty-download-authorizations', new media.view.GettyDownloadAuthorizations({
				gettyBrowser: this.options.gettyBrowser,
				model: this.model,
				controller: this.controller,
				collection: this.collection
			}));

			this.views.set('.getty-image-details-list', new media.view.GettyDetailList({
				model: this.model
			}));

			this.views.set('.getty-display-settings', new media.view.GettyAttachmentDisplaySettings(this.options.displayOptions));

			// Load up additional details
			this.model.fetch();
		},

		/**
		 * Propagate changes to form elements to attachment model
		 */
		updateModel: function() {
			var model = this.model;

			this.$el.find('input, textarea, select').each(function() {
				if(this.type == "radio") {
					if(this.checked) {
						model.set(this.name, this.value);
					}
				}
				else if(this.type == "checkbox") {
					if(this.checked) {
						model.set(this.name, this.value);
					}
					else {
						model.unset(this.name);
					}
				}
				else {
					model.set(this.name, this.value);
				}
			});
		},

		render: function(render){
			media.view.Attachment.Details.prototype.render.apply(this);
		}
	});

	/**
	 * The thumbnail and possible image details for an image
	 */
	media.view.GettyDetailImage = media.View.extend({
		className: 'getty-detail-image',
		template: media.template('getty-detail-image'),

		initialize: function() {
			this.model.on('change:attachment', this.render, this);
		},

		prepare: function() {
			return this.model.attributes;
		},
	});

	/**
	 * The list of image details and possible image details for an image
	 */
	media.view.GettyDetailList = media.View.extend({
		template: media.template('getty-image-details-list'),
		events: {
			'click .details-accordion-header': 'onDetailsAccordionHeaderClick',
			'click .keywords-accordion-header': 'onKeywordsAccordionHeaderClick',
			'click .license-info-accordion-header': 'onLicenseInfoAccordionHeaderClick'
		},

		initialize: function() {
			// Attach changes to login state to this view
			this.model.on('change', this.render, this);
		},

		prepare: function() {
			return this.model.attributes;
		},

		onDetailsAccordionHeaderClick: function (ev) {
			var $content = $(".details-accordion-content"),
				$target = $(ev.target);

			if ($content.hasClass("accordion-closed")) {
				$target.parent().find(".collapse-icon").text("-");
				$content.removeClass("accordion-closed");
				$content.addClass("accordion-open");
			} else if ($content.hasClass("accordion-open")) {
				$target.parent().find(".collapse-icon").text("+");
				$content.removeClass("accordion-open");
				$content.addClass("accordion-closed");
			}
		},
		onKeywordsAccordionHeaderClick: function (ev) {
			var $content = $(".keywords-accordion-content"),
				$target = $(ev.target);

			if ($content.hasClass("accordion-closed")) {
				$target.parent().find(".collapse-icon").text("-");
				$content.removeClass("accordion-closed");
				$content.addClass("accordion-open");
			} else if ($content.hasClass("accordion-open")) {
				$target.parent().find(".collapse-icon").text("+");
				$content.removeClass("accordion-open");
				$content.addClass("accordion-closed");
			}
		},
		onLicenseInfoAccordionHeaderClick: function (ev) {
			var $content = $(".license-info-accordion-content"),
				$target = $(ev.target);

			if ($content.hasClass("accordion-closed")) {
				$target.parent().find(".collapse-icon").text("-");
				$content.removeClass("accordion-closed");
				$content.addClass("accordion-open");
			} else if ($content.hasClass("accordion-open")) {
				$target.parent().find(".collapse-icon").text("+");
				$content.removeClass("accordion-open");
				$content.addClass("accordion-closed");
			}
		}

	});

	/**
	 * The set of image sizes available, and the download button
	 */
	media.view.GettyDetailSizes = media.View.extend({
		className: 'getty-image-sizes',
		template: media.template('getty-images-detail-sizes'),
		initialize: function() {
			// Attach changes to login state to this view
			getty.user.on('change:loggedIn', this.changeLoginState, this);
			this.model.on('change:attachment', this.render, this);
			this.model.on('change:downloading', this.updateDownloading, this);
		},

		/**
		 * Re-fetch image details (with downloadable sizes) when user login
		 * state changes
		 */
		changeLoginState: function(model, loggedIn) {
			if(loggedIn) {
				this.model.fetch();
			}
			else {
				this.model.unset('sizesByAgreement');
				this.model.unset('SelectedDownloadSize');
			}
		},

		prepare: function() {
			return this.model.attributes;
		},
	});

	/**
	 * Download authorizations
	 */
	media.view.GettyDownloadAuthorizations = media.View.extend({
		template: media.template('getty-download-authorizations'),

		events: {
			'change input[name=DownloadProductOffering]': 'updateSelectedProductOffering',
			'change select[name=DownloadSizeKey]': 'updateSelectedDownloadSize',
			'change input[name=download-option]': 'updateSelectedDonwloadOption',
			'change input[name=getty-download-notes]': 'updateDownloadNotes',
			'change select[name=getty-project-code]': 'updateProjectCode',
			'click .agree-insert-comp': 'insertComp',
			'submit .download-form': 'download',
			'click .insert-comp-button': 'insertImage'
		},

		initialize: function() {
			this.model.on('change:attachment change:downloading', this.render, this);

			getty.user.on('change:loggedIn', this.render, this);
			getty.user.on('change:loggedIn', this.model.fetch, this.model);

			this.model.on('change:sizesByAgreement', this.render, this);
		},

		download: function () {
			var self = this,
				downloadOption = $("#download-options-container").find('input[name=download-option]:checked').val();

			this.downloadOption = downloadOption;

			if (downloadOption === "media-only"){
				this.options.gettyBrowser.download();
			}
			else if (downloadOption === "download-as-featured") {
				this.options.gettyBrowser.download(function (response) {
					self.setFeaturedImage(response.id);
					$('.media-modal-close').trigger('click');
					// Clicks the close button; will need to be updated if a case arises where this close button changes
				});
			}
			else if (downloadOption === "download-and-insert") {
				this.options.gettyBrowser.download(function (response) {
					self.insertImage(response.url);
				});
			}
			else if (downloadOption === "download-and-insert-as-featured") {
				this.options.gettyBrowser.download(function (response) {
					self.setFeaturedImage(response.id);
					self.insertImage(response.url);
				});
			}
		},
		
		setFeaturedImage: function(id) {
			if (wp.data) {
				wp.data.dispatch('core/editor').editPost({ featured_media: id });
			} else {
				wp.media.featuredImage.set(id);
			}
		},

		insertImage: function(url) {
			var self = this,
				image = this.collection.single(),
				$licenseDialog = $("#getty-comp-license-dialog");

			getty.tracking.asset.id = image.get('id');
			getty.tracking.asset.family = image.get('asset_family');

			if(this.controller.state().get('mode') != 'embed' && !image.get('attachment')) {
				// Show license agreement for inserting comp
				if(!this.agreement) {

					this.agreement = new media.view.GettyCompAgreement({
						controller: this
					});
				}

				$licenseDialog.dialog({
					modal: true,
					width: "1500px",
					open: function() {
						$licenseDialog.scrollTop(0);
					},
					close: function() {
						$licenseDialog.dialog('destroy');
					},
					buttons: {
						"Agree": function () {
							$licenseDialog.dialog('close');
							self.insertComp();
						},
						"Cancel": function () {
							$licenseDialog.dialog('close');
						}
					}
				});
			}
			else {
				this.insert(url);
			}
		},

		insertComp: function() {
			this.insert();
		},

		insert: function(url) {
			if(this.agreement) {
				this.agreement.$el.remove();
				delete this.agreement;
			}

			this.controller.state().insert(url);
		},

		/**
		 * Show / hide download spinner while attachment is downloading
		 */
		render: function() {
			media.View.prototype.render.apply(this, arguments);

			if(this.model.get('downloading')) {
				new Spinner({
					className: 'getty-spinner',
					color: '#888',
					lines: 7,
					length: 4,
					radius: 5,
				}).spin(this.$el.find('.getty-download-spinner')[0]);
			}
		},

		prepare: function() {
			return this.model.attributes;
		},

		updateSelectedProductOffering: function(ev) {
			var selectedProductOffering = $(ev.target).val();
			this.model.set('ProductOffering', selectedProductOffering);

			var currentlySelectedSize = this.model.get('SelectedDownloadSize');
			var sizesForCurrentlySelectedAgreement = this.model.get('sizesByAgreement')[selectedProductOffering];

			//Select same size for the agreement or first available size.
			if (currentlySelectedSize
				&& _.find(sizesForCurrentlySelectedAgreement, function(size) { return size.name === currentlySelectedSize.name }))
			{
				this.model.set('SelectedDownloadSize', _.find(sizesForCurrentlySelectedAgreement, function(size) { return size.name === currentlySelectedSize.name }));

			} else {
				//auto-select first size from the list.
				this.model.set('SelectedDownloadSize', sizesForCurrentlySelectedAgreement[0]);
			}
			this.render();
		},

		updateSelectedDonwloadOption: function(ev) {
			this.downloadOption = $(ev.target).val();
		},

		updateSelectedDownloadSize: function(ev) {
			var selectedSizeId = $(ev.target).val();

			var sizesByAgreement = this.model.get('sizesByAgreement');

			if(!sizesByAgreement) {
				sizesByAgreement = {};
			}

			var sizesForSelectedAgreement  = sizesByAgreement[this.model.get('ProductOffering')];

			var selectedSize = _.find(sizesForSelectedAgreement, function(size) { return size.id === selectedSizeId; });

			this.model.set('SelectedDownloadSize', selectedSize);

			this.model.set("SelectedDownloadOption", this.downloadOption);

			this.render();
		},
		
		updateDownloadNotes: function(ev) {
			this.model.set('DownloadNotes', $(ev.target).val());
		},
		
		updateProjectCode: function(ev) {
			this.model.set('ProjectCode', $(ev.target).val());
		},
	});

	/**
	 * View representing login session
	 */
	media.view.GettyUser = media.View.extend({
		template: media.template('getty-images-user'),
		className: 'getty-user-container',
		prepare: function() {
			return this.model.attributes;
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
		},

		events: {
			'click .getty-images-logout': 'logout',
			'change [name="getty-login-username"]': 'updateUsername',
			'click .getty-login-button': 'login',
			'keyup input': 'loginOnEnter',
			'keydown input': 'tabSwitch'

		},

		loginOnEnter: function(ev) {
			if(ev.keyCode == 13) {
				ev.preventDefault();
				this.login();
			}
		},

		updateUsername: function(ev) {
			this.model.set('username', ev.currentTarget.value);
		},

		/**
		 * Log in the user, using the password in the password field
		 */
		login: function() {
			var self = this,
				enableTracking = this.$el.find('[id="tracking-checkbox"]')[0].checked;

			getty.user.settings.set('omniture-opt-in', enableTracking);

			this.model.tokenLogin(this.$el.find('[name="getty-login-token"]').val(), enableTracking);
		},

		/**
		 * Log out the user
		 */
		logout: function(ev) {
			getty.user.settings.unset('mode');
			this.model.logout();
		},

		/**
		 * Add spinner when logging in
		 */
		render: function() {
			media.View.prototype.render.apply(this, arguments);

			if(this.model.get('loggingIn')) {
				new Spinner({
					className: 'getty-spinner',
					width: 2,
					lines: 7,
					width: 4,
					length: 3,
					color: '#888',
					radius: 3,
				}).spin(this.$el.find('.getty-login-spinner')[0]);
			}
		}
	});

	media.view.GettyCompAgreement = media.View.extend({
		template: media.template('getty-comp-license-agreement'),
		className: 'getty-comp-license-container'
	});

	/**
	 * Media frame toolbar
	 */
	media.view.GettyToolbar = media.view.Toolbar.extend({
		className: 'getty-toolbar media-toolbar',

		initialize: function(options) {
			var self = this;

			media.view.Toolbar.prototype.initialize.apply(this, arguments);

			this.selection = new media.view.GettySelection({
				controller: this.controller,
				collection: options.collection
			});

			this.secondary.set('selection', this.selection);
		},

	});

	/**
	 * Selection thumbnail
	 */
	media.view.GettyAttachment.Selection = media.view.GettyAttachment.extend({
		className: 'attachment selection',

		// On click, just select the model, instead of removing the model from
		// the selection.
		toggleSelection: function() {
			this.options.selection.single(this.model);
		}
	});

	/**
	 * Selection
	 */
	media.view.GettySelection = media.View.extend({
		tagName:   'div',
		className: 'media-selection',
		template:  media.template('media-selection'),

		events: {
			'click .edit-selection':  'edit',
			'click .clear-selection': 'clear'
		},

		initialize: function() {
			_.defaults( this.options, {
				editable:  false,
				clearable: false
			});

			this.attachments = new media.view.Attachments.Selection({
				controller: this.controller,
				collection: this.collection,
				selection:  this.collection,
				AttachmentView: media.view.GettyAttachment.Selection,
				model:      new Backbone.Model({
					edge:   40,
					gutter: 5
				})
			});

			//this.views.set( '.selection-view', this.attachments );
			this.collection.on( 'add remove reset', this.refresh, this );
			this.controller.state().on( 'content:activate', this.refresh, this );
		},

		ready: function() {
			this.refresh();
		},

		refresh: function() {
			// If the selection hasn't been rendered, bail.
			if ( ! this.$el.children().length )
				return;

			var collection = this.collection,
				editing = 'edit-selection' === this.controller.content.mode();

			// If nothing is selected, display nothing.
			this.$el.toggleClass( 'empty', ! collection.length );
			this.$el.toggleClass( 'one', 1 === collection.length );
			this.$el.toggleClass( 'editing', editing );

			this.$('.count').text( getty.text.recentlyViewed );
		},

		edit: function( event ) {
			event.preventDefault();
			if ( this.options.editable )
				this.options.editable.call( this, this.collection );
		},

		clear: function( event ) {
			event.preventDefault();
			this.collection.reset();
		}
	});

	/**
	 * Welcome screen + opt-in
	 */
	media.view.GettyWelcome = media.View.extend({
		tagName:   'div',
		className: 'getty-welcome',
		template:  media.template('getty-welcome'),

		events: {
			'click .getty-welcome-continue button': 'save',
		},

		save: function() {
			var checked = this.$el.find('.getty-welcome-opt-in input').prop('checked');
			getty.user.settings.set('omniture-opt-in', checked);
		},

		prepare: function() {
			var optIn = getty.user.settings.get('omniture-opt-in');

			if(optIn === undefined) {
				optIn = true;
			}

			return {
				optIn: optIn
			}
		},
	});

	/**
	 * Mode selection
	 */
	media.view.GettyModeSelect = media.View.extend({
		tagName:   'div',
		className: 'getty-choose-mode',
		template:  media.template('getty-choose-mode'),

		events: {
			'click .getty-embedded-mode': 'chooseEmbeddedMode',
			'click .getty-login-mode': 'chooseLoginMode',
			'click .getty-login-cancel-button': 'cancelLogin',
			'click .embed-tacking-opt-in-checkbox': 'onTrackingCheckboxClick',
			'click .stop-propagation': 'stopEventPropagation'
		},

		cancelLogin: function() {
			getty.user.settings.unset('mode');
		},

		initialize: function() {
			media.View.prototype.initialize.apply(this, arguments);

			this.model.set('enableTracking', getty.user.settings.get('omniture-opt-in'));

			this.model.on('change:mode', this.render, this);
		},

		ready: function() {
			this.$el.find('.getty-login-token').focus();
			if (this.model.get('mode') == 'login') this.openLoginWindow();
		},

		render: function() {
			var self = this;

			if(this.model.get('mode') == 'login') {
				this.views.set('.getty-login-panel', new media.view.GettyUser({
					controller: this,
					model: getty.user
				}));

				setTimeout(function() {
					self.$el.find('.getty-login-token textarea').focus();
				}, 20);
			}
			else {
				this.views.unset('.getty-login-panel');
			}

			media.View.prototype.render.apply(this, arguments);
		},

		prepare: function() {
			return this.controller.state().attributes;
		},

		chooseEmbeddedMode: function() {
			getty.user.settings.set('mode', 'embed');
			getty.user.unset('loggedIn');
		},

		chooseLoginMode: function() {
			getty.user.settings.set('mode', 'login');
			if(!getty.user.get('loggedIn')) {
				this.openLoginWindow();
			}
		},

		openLoginWindow: function() {
			var url = 'https://api.gettyimages.com/oauth2/auth?response_type=token&client_id=ytkqdr79qavqfkrnn5z4rsjr&redirect_uri=https://www.gettyimages.com/sign-in/plugin/token';
			window.open(url, 'GILoginWindow', 'width=540,height=720');
		},

		onTrackingCheckboxClick: function(event) {
			event.stopPropagation();

			getty.user.settings.set('omniture-opt-in', event.target.checked);
		},

		stopEventPropagation: function(event) {
			event.stopPropagation();
		}
	});

	/**
	 * Landing Page
	 */
	media.view.GettyLandingPage = media.View.extend({
		className: 'getty-landing',
		template:  media.template('getty-landing-page'),
		events: {
			'click .landing-tab': 'handleTabClick'
		},
		initialize: function() {

			this.creativeTab = new media.view.GettyLandingPageCreativeTab({collection: new media.model.GettyCreativeTabModel(), gettyBrowser: this.options.gettyBrowser});
			this.featuredTab = new media.view.GettyLandingPageFeaturedTab({collection: new media.model.GettyFeaturedTabModel(), gettyBrowser: this.options.gettyBrowser});
			this.eventsTab = new media.view.GettyLandingPageEventsTab({collection: new media.model.GettyEventsTabModel(), gettyBrowser: this.options.gettyBrowser});

			this.currentTab = this.creativeTab;

			this.render();
		},
		render: function() {
			this.$el.html(this.template);
			var tabsContainer = this.$el.find('.landing-content');

			tabsContainer.append(this.creativeTab.$el);
			tabsContainer.append(this.featuredTab.$el);
			tabsContainer.append(this.eventsTab.$el);

			this.eventsTab.$el.hide();
			this.featuredTab.$el.hide();
			this.creativeTab.$el.hide();

			this.currentTab.render();
			this.currentTab.$el.css("display", "inline-block");
		},
		handleTabClick: function(evt) {
			var tabKey = $(evt.target).data('key');

			$(".landing-tab").css('background-color', '#333333');
			$(evt.target).css('background-color', '#000000');

			this.select(tabKey);
		},
		select: function(tabKey) {
			switch (tabKey) {
				case 'creative':
					this.currentTab = this.creativeTab;
					break;
				case 'featured':
					this.currentTab = this.featuredTab;
					break;
				case 'events':
					this.currentTab = this.eventsTab;
					break;
			}
			this.eventsTab.$el.hide();
			this.featuredTab.$el.hide();
			this.creativeTab.$el.hide();

			this.currentTab.render();
			this.currentTab.$el.css("display", "inline-block");
		}
	});

	media.view.GettyLandingPageCreativeTab = media.View.extend({
		template: media.template('getty-landing-page-tab-creative-item'),
		className: 'landing-tab-content creative-tab-content',
		events: {
			'click .grid-item': 'handleItemClick'
		},
		initialize: function () {
			var self = this;
			this.collection.on('change reset add remove',
				function(){
					self.render();
				});
		},
		render: function () {
			this.$el.html(this.template);
			this.collection.forEach(function (item) {
				var item = new media.view.GettyLandingPageCreativeTabItem({model: item});
				this.$el.append(item.render().el);
			}, this);
    		this.delegateEvents();
			return this;
		},
		handleItemClick: function (event)
		{
			$(".getty-landing-container").hide();
			this.options.gettyBrowser.collection.props.set("ImageFamilies", "creative");
			this.options.gettyBrowser.collection.propsQueue.set('search', $(event.currentTarget).data('search-phrase'));
			this.options.gettyBrowser.search();
		}
	});

	media.view.GettyLandingPageCreativeTabItem = media.View.extend({
		template: media.template('getty-landing-page-tab-creative-item'),
		className: 'grid-item',
		attributes: function() {
			if(this.model) {
				return {
					'data-search-phrase': this.model.get('searchPhrase')
				}
			}
			return {}
		},
		render: function () {
			this.$el.html(this.template(this.model));
			return this;
		}
	});

	media.view.GettyLandingPageFeaturedTab = media.View.extend({
		template: media.template('getty-landing-page-tab-featured'),
		className: 'landing-tab-content featured-tab-content',
		events: {
			'click .grid-item': 'handleItemClick'
		},
		initialize: function () {
			var self = this;
			this.collection.on('change reset add remove',
				function(){
					self.render();
				});
		},
		render: function () {
			this.$el.html(this.template);
			this.collection.forEach(function (item) {
				var item = new media.view.GettyLandingPageFeaturedTabItem({model: item});
				this.$el.append(item.render().el);
			}, this);
    		this.delegateEvents();
			return this;
		},
		handleItemClick: function (event)
		{
			$(".getty-landing-container").hide();
			this.options.gettyBrowser.collection.propsQueue.set('search',  _.unescape($(event.currentTarget).find('.display-title-text').text()));
			this.options.gettyBrowser.search({ assetIds: $(event.currentTarget).data('assets') });
		}
	});

	media.view.GettyLandingPageFeaturedTabItem = media.View.extend({
		template: media.template('getty-landing-page-tab-featured-item'),
		className: 'grid-item',
		attributes: function() {
			if(this.model) {
				return {
					'data-assets':  this.model.get('assets')
				}
			}
			return {}
		},
		render: function () {
			this.$el.html(this.template(this.model));
			return this;
		}
	});

	media.view.GettyLandingPageEventsTab = media.View.extend({
		template: media.template('getty-landing-page-tab-events'),
		className: 'landing-tab-content events-tab-content',
		events: {
			'click .grid-item': 'handleItemClick',
			'change #editorial-segment-dropdown': 'onEditorialSegmentDropdownChange'
		},
		initialize: function () {
			var self = this;
			this.viewModel = {};

			this.collection.on('change reset add remove',
				function(){
					self.render();
				});

			this.viewModel.editorialSegment = 'entertainment';
			this.collection.loadData('entertainment');
		},
		render: function () {
			this.$el.html(this.template(this.viewModel));
			this.collection.forEach(function (item) {
				var item = new media.view.GettyLandingPageEventsTabItem({model: item});
				this.$el.find('.items').append(item.render().el);
			}, this);
    		this.delegateEvents();
			return this;
		},
		handleItemClick: function (event)
		{
			$(".getty-landing-container").hide();
			this.options.gettyBrowser.collection.propsQueue.set('search',  _.unescape($(event.currentTarget).find('.display-title-text').text()));
			this.options.gettyBrowser.search({ eventIds: [ $(event.currentTarget).attr('eventId') ]});
		},
		onEditorialSegmentDropdownChange: function ()
		{
			this.viewModel.editorialSegment = $("#editorial-segment-dropdown").val();
			this.collection.loadData($("#editorial-segment-dropdown").val());
		}
	});

	media.view.GettyLandingPageEventsTabItem = media.View.extend({
		template: media.template('getty-landing-page-tab-events-item'),
		className: 'grid-item',
		attributes: function() {
			if(this.model) {
				return {
					eventId: this.model.get('eventId')
				}
			}
			return {}
		},
		render: function () {
			this.$el.html(this.template(this.model));
			return this;
		}
	});
})(jQuery);
