/**
 * JavaScript for Media Library List and Grid Views, including
 * taxonomy filtering and sorting.
 *
 * @since 	1.0.0
 *
 * @package Media_Categories_Module
 * @author 	Media Categories Module
 */

/**
 * Define vars for holding:
 * - Uploader instance
 * - Grid View Taxonomy Filters
 * - Grid View Order By Filter
 * - Grid View Order Filter
 * - Grid View Attachments Browser
 */
var mediaLibraryOrganizerUploader       = false, // Uploader instance.
	MediaLibraryOrganizerTaxonomyFilter = {}, // Grid View Taxonomy Dropdown Filters.
	MediaLibraryOrganizerTaxonomyOrderBy, // Grid View Dropdown Order By Filter.
	MediaLibraryOrganizerTaxonomyOrder, // Grid View Dropdown Order Filter.
	MediaLibraryOrganizerAttachmentsBrowser; // Grid View Attachments Browser.

/**
 * Grid View: Define Order By and Order Defaults on wp.media.query calls, which the Media Library
 * uses for Grid Views.
 *
 * If the query specifies either orderby or order, that is honored.
 * If the query is missing either orderby or order, the defaults are used.
 *
 * For Grid Views in the Edit Page/Post Screens (Classic Editor or Gutenberg), this also sets the correct Order By and Order dropdown values
 * based on the User / Plugin Defaults.
 *
 * Whilst this sets the correct Attachment order at Media > Library in the Grid View, it doesn't set the correct Order By
 * and Order doprdown values for the filters on that screen.
 *
 * @since 	1.2.8
 */
function mediaLibraryOrganizerQueryInitialize() {

	( function() {

		wp.media.query = function( props ) {

			return new wp.media.model.Attachments(
				null,
				{
					props: _.extend(
						_.defaults(
							props || {},
							{
								orderby: media_categories_module_media.defaults.orderby,
								order: media_categories_module_media.defaults.order
							}
						),
						{ query: true }
					)
				}
			);

		};

		/**
		 * Extend and override wp.media.model.Query to disable query caching, which prevents
		 * sparodic instances where 'No items found' appears when adding media within Gutenberg.
		 */
		var Query = wp.media.model.Query;
		_.extend(
			Query,
			{

				get: (function(){

					/**
					 * Holds the queries.
					 *
					 * @type Array
					 */
					var queries = [];

					/**
					 * Extend and override wp.media.model.Query to disable query caching, which prevents
					 * sparodic instances where 'No items found' appears when adding media within Gutenberg.
					 *
					 * @returns {Query}
					 */
					return function( props, options ) {

						var args = {},
						orderby  = Query.orderby,
						defaults = Query.defaultProps,
						query,
						cache    = false; // Always disable query.

						// Remove the `query` property. This isn't linked to a query,
						// this *is* the query.
						delete props.query;
						delete props.cache;

						// Fill default args.
						_.defaults( props, defaults );

						// Normalize the order.
						props.order = props.order.toUpperCase();
						if ( 'DESC' !== props.order && 'ASC' !== props.order ) {
							props.order = defaults.order.toUpperCase();
						}

						// Ensure we have a valid orderby value.
						if ( ! _.contains( orderby.allowed, props.orderby ) ) {
							props.orderby = defaults.orderby;
						}

						_.each(
							[ 'include', 'exclude' ],
							function( prop ) {
								if ( props[ prop ] && ! _.isArray( props[ prop ] ) ) {
									props[ prop ] = [ props[ prop ] ];
								}
							}
						);

						// Generate the query `args` object.
						// Correct any differing property names.
						_.each(
							props,
							function( value, prop ) {
								if ( _.isNull( value ) ) {
									return;
								}

								args[ Query.propmap[ prop ] || prop ] = value;
							}
						);

						// Fill any other default query args.
						_.defaults( args, Query.defaultArgs );

						// `props.orderby` does not always map directly to `args.orderby`.
						// Substitute exceptions specified in orderby.keymap.
						args.orderby = orderby.valuemap[ props.orderby ] || props.orderby;

						// Disable query caching.
						cache = false;

						// Search the query cache for a matching query.
						if ( cache ) {
							query = _.find(
								queries,
								function( query ) {
									return _.isEqual( query.args, args );
								}
							);
						} else {
							queries = [];
						}

						// Otherwise, create a new query and add it to the cache.
						if ( ! query ) {
							query = new Query(
								[],
								_.extend(
									options || {},
									{
										props: props,
										args:  args
									}
								)
							);
							queries.push( query );
						}

						// Fire the grid:query event that Addons can hook into and listen.
						wp.media.events.trigger(
							'asenha-media:grid:query',
							{
								query: query
							}
						);

						return query;
					};
				}())

			}
		);

	} )( jQuery, _ );
}

/**
 * Fetches the uploader instance, and fires events for the life cycle of an attachment being uploaded and deleted
 *
 * @since 	1.2.3
 */
function mediaLibraryOrganizerUploaderInitializeEvents() {

	( function( $, _ ) {

		if ( typeof wp.Uploader !== 'undefined' ) {

			_.extend(
				wp.Uploader.prototype,
				{
					init: function() {
						wp.media.events.trigger( 'asenha-media:grid:attachment:upload:init' );
					},
					added: function( file_attachment ) {
						wp.media.events.trigger( 'asenha-media:grid:attachment:upload:added', file_attachment );
					},
					progress: function( file_attachment ) {
						wp.media.events.trigger( 'asenha-media:grid:attachment:upload:progress', file_attachment );
					},
					success: function( file_attachment ) {
						wp.media.events.trigger( 'asenha-media:grid:attachment:upload:success', file_attachment );
					},
					error: function( error_message ) {
						wp.media.events.trigger( 'asenha-media:grid:attachment:upload:error', error_message );
					},
					complete: function() {
						wp.media.events.trigger( 'asenha-media:grid:attachment:upload:complete' );
					},
					refresh: function() {
						wp.media.events.trigger( 'asenha-media:grid:attachment:upload:refresh' );
					}
				}
			);

		}

	} )( jQuery, _ );

}

/**
 * Grid View: Initializes Taxonomy Filters
 *
 * @since 	1.3.3
 */
function mediaLibraryOrganizerGridViewInitializeTaxonomyFilters() {

	( function() {

		for ( let taxonomy_name in media_categories_module_media.taxonomies ) {
			mediaLibraryOrganizerGridViewInitializeTaxonomyFilter(
				taxonomy_name,
				media_categories_module_media.taxonomies[ taxonomy_name ].terms,
				media_categories_module_media.taxonomies[ taxonomy_name ].taxonomy.labels.all_items,
				media_categories_module_media.labels.unassigned,
				media_categories_module_media.show_attachment_count
			);
		}

	} )( jQuery, _ );

}

/**
 * Grid View: Initializes Taxonomy Filter for the given Taxonomy Name
 *
 * @since 	1.3.3
 *
 * @param 	string 	taxonomy_name 			Taxonomy Name.
 * @param 	array 	terms 					Taxonomy Terms.
 * @param 	string 	all_items_label 		All Terms Label e.g. "All Media Categories", translated.
 * @param 	string 	unassigned_items_label 	Unassigned Terms Label e.g. "Unassigned", translated.
 * @param 	bool 	show_attachment_count 	Show Attachment Counts for each Term.
 */
function mediaLibraryOrganizerGridViewInitializeTaxonomyFilter( taxonomy_name, terms, all_items_label, unassigned_items_label, show_attachment_count ) {

	( function() {

		// Skip if this Filter isn't enabled in the Plugin Settings.
		if ( media_categories_module_media.settings[ taxonomy_name + '_enabled'] == '0' || ! media_categories_module_media.settings[ taxonomy_name + '_enabled'] ) {
			return;
		}

		// Define Taxonomy Filter.
		MediaLibraryOrganizerTaxonomyFilter[ taxonomy_name ] = wp.media.view.AttachmentFilters.extend(
			{
				id: 'media-attachment-taxonomy-filter-' + taxonomy_name,

				/**
				 * Create Filter
				 *
				 * @since 	1.0.0
				 */
				createFilters: function() {

					var filters = {};

					// Build an array of filters based on the Terms supplied in media_categories_module_media.terms,
					// set by wp_localize_script().
					_.each(
						terms || {},
						function( term, index ) {
							var props              = {};
							props[ taxonomy_name ] = term.slug;

							// Build label, depending on whether to include the Attachment count or not.
							var label = term.name + ( show_attachment_count === '1' ? ' (' + term.count + ')' : '' );

							filters[ index ] = {
								text: label,

								// Key = WP_Query taxonomy name, which ensures that taxonomy-name=1 is sent
								// as part of the search query when the filter is used.
								props: props
							};
						}
					);

					// Define the 'All' filter.
					var props                  = {};
						props[ taxonomy_name ] = '';
					filters.all                = {
						text: all_items_label, // e.g. All Media Categories.
						props: props,
						priority: 10
					};

					// Define the 'Unassigned' filter.
					var props                  = {};
						props[ taxonomy_name ] = '-1';
					filters.unassigned         = {
						text:  unassigned_items_label, // e.g. Unassigned.
						props: props,
						priority: 10
					};

					// Set this filter's data to the terms we've just built.
					this.filters = filters;

				},

				/**
				 * When the selected filter changes, update the Attachment Query properties to match.
				 */
				change: function() {
					var filter = this.filters[ this.el.value ];

					if ( filter ) {
						this.model.set( filter.props );

						// Fire the grid:filter event that Addons can hook into and listen.
						wp.media.events.trigger(
							'asenha-media:grid:filter:change:term',
							{
								taxonomy_name: 	taxonomy_name,
								slug: 			filter.props[ taxonomy_name ]
								}
						);
					}
				},

				/**
				 * Required for the Taxonomy selected option to be defined
				 * when taxonomy-name is in the $_REQUEST via e.g. Tree View
				 */
				select: function() {
					var model = this.model,
						value = 'all',
						props = model.toJSON();

					// Fire the grid:select event that Addons can hook into and listen.
					wp.media.events.trigger(
						'asenha-media:grid:filter:select',
						{
							props: props
						}
					);

					_.find(
						this.filters,
						function( filter, id ) {
							var equal = _.all(
								filter.props,
								function( prop, key ) {
									return prop === ( _.isUndefined( props[ key ] ) ? null : props[ key ] );
								}
							);

							if ( equal ) {
								return value = id;
							}
						}
					);

					this.$el.val( value );
				}

			}
		);

	} )( jQuery, _ );

}

/**
 * Grid View: Initializes Order By Filter
 *
 * @since 	1.3.3
 */
function mediaLibraryOrganizerGridViewInitializeOrderByFilter() {

	( function() {

		if ( media_categories_module_media.settings.orderby_enabled == 1 ) {
			MediaLibraryOrganizerTaxonomyOrderBy = wp.media.view.AttachmentFilters.extend(
				{
					id: 'media-attachment-orderby',

					/**
					 * Create Filters
					 *
					 * @since 	1.0.0
					 */
					createFilters: function() {

						var filters = {};

						// Build an array of filters based on the Sorting options supplied in media_categories_module_media.sorting,
						// set by wp_localize_script().
						_.each(
							media_categories_module_media.orderby || {},
							function( value, key ) {
								filters[ key ] = {
									text: value,

									// Key = WP_Query taxonomy name, which ensures that taxonomy-name=1 is sent
									// as part of the search query when the filter is used.
									props: {
										'orderby': key,
									}
								};
							}
						);

						// Set this filter's data to the terms we've just built.
						this.filters = filters;

					},

					/**
					 * This has to be here for the filter dropdown to select the correct Order By
					 * and Order User / Default. wp.media.view.AttachmentFilters calls this.select
					 * from initialize, but doesn't seem to call its own select() function.
					 */
					select: function() {

						var model = this.model,
							value = 'all',
							props = model.toJSON();

						_.find(
							this.filters,
							function( filter, id ) {
								var equal = _.all(
									filter.props,
									function( prop, key ) {
										return prop === ( _.isUndefined( props[ key ] ) ? null : props[ key ] );
									}
								);

								if ( equal ) {
									return value = id;
								}
							}
						);

						this.$el.val( value );
					}

				}
			);
		}

	} )( jQuery, _ );
}

/**
 * Grid View: Initializes Order Filter
 *
 * @since 	1.3.3
 */
function mediaLibraryOrganizerGridViewInitializeOrderFilter() {

	( function() {

		if ( media_categories_module_media.settings.order_enabled == 1 ) {
			MediaLibraryOrganizerTaxonomyOrder = wp.media.view.AttachmentFilters.extend(
				{
					id: 'media-attachment-order',

					/**
					 * Create Filter
					 *
					 * @since 	1.0.0
					 */
					createFilters: function() {

						var filters = {};

						// Build an array of filters based on the Sorting options supplied in media_categories_module_media.sorting,
						// set by wp_localize_script().
						_.each(
							media_categories_module_media.order || {},
							function( value, key ) {
								filters[ key ] = {
									text: value,

									// Key = asc|desc.
									props: {
										'order': key,
									}
								};
							}
						);

						// Set this filter's data to the terms we've just built.
						this.filters = filters;

					},

					/**
					 * This has to be here for the filter dropdown to select the correct Order By
					 * and Order User / Default. wp.media.view.AttachmentFilters calls this.select
					 * from initialize, but doesn't seem to call its own select() function.
					 */
					select: function() {

						var model = this.model,
							value = 'all',
							props = model.toJSON();

						_.find(
							this.filters,
							function( filter, id ) {
								var equal = _.all(
									filter.props,
									function( prop, key ) {
										return prop === ( _.isUndefined( props[ key ] ) ? null : props[ key ] );
									}
								);

								if ( equal ) {
									return value = id;
								}
							}
						);

						this.$el.val( value );
					}

				}
			);
		}

	} )( jQuery, _ );
}

/**
 * Grid View: Adds Taxonomy, Order By and Order Filters to the Toolbar.
 *
 * @since 	1.3.3
 */
function mediaLibraryOrganizerGridViewAddFiltersToToolbar() {

	( function() {

		var AttachmentsBrowser           = wp.media.view.AttachmentsBrowser;
		wp.media.view.AttachmentsBrowser = wp.media.view.AttachmentsBrowser.extend(
			{
					/**
					 * When the toolbar is created, add our custom filters to it, which
					 * are rendered as select dropdowns.
					 *
					 * @since 	1.0.0
					 */
				createToolbar: function() {

					// Make sure to load the original toolbar.
					AttachmentsBrowser.prototype.createToolbar.call( this );

					// Bail if search is not included in the toolbar, as this means we're on a grid view
					// that doesn't display filters, such as Edit Gallery.
					if ( ! this.options.search ) {
						return;
					}

					// Define the priority order at which these filters should begin output in the Grid View Toolbar.
					var priority = -75;

					// Add the taxonomy filters to the toolbar.
					// MediaLibraryOrganizerTaxonomyFilter is populated with Taxonomy Filters that are enabled in the Plugin Settings,
					// so no need to check media_categories_module_media.settings.
					for ( let taxonomy_name in MediaLibraryOrganizerTaxonomyFilter ) {
						this.toolbar.set(
							taxonomy_name,
							new MediaLibraryOrganizerTaxonomyFilter[ taxonomy_name ](
								{
									controller: this.controller,
									model:      this.collection.props,
									priority: 	priority
									}
							).render()
						);

							// Increment priority so the order of filters remains the same
							// if they're subsequently updated by calling mediaLibraryOrganizerGridViewInitializeTaxonomyFilter().
							priority++;
					}

						// Add the orderby filter to the toolbar.
					if ( media_categories_module_media.settings.orderby_enabled == 1 ) {
						this.toolbar.set(
							'MediaLibraryOrganizerTaxonomyOrderBy',
							new MediaLibraryOrganizerTaxonomyOrderBy(
								{
									controller: this.controller,
									model:      this.collection.props,
									priority: 	priority
								}
							).render()
						);

						// Increment priority so the order of filters remains the same
						// if they're subsequently updated by calling mediaLibraryOrganizerGridViewInitializeTaxonomyFilter().
						priority++;
					}

						// Add the order filter to the toolbar.
					if ( media_categories_module_media.settings.order_enabled == 1 ) {
						this.toolbar.set(
							'MediaLibraryOrganizerTaxonomyOrder',
							new MediaLibraryOrganizerTaxonomyOrder(
								{
									controller: this.controller,
									model:      this.collection.props,
									priority: 	priority
								}
							).render()
						);

						// Increment priority so the order of filters remains the same
						// if they're subsequently updated by calling mediaLibraryOrganizerGridViewInitializeTaxonomyFilter().
						priority++;
					}

						// Fire the asenha-media:grid:filters:add event that Addons can hook into and add their own Filters now.
						wp.media.events.trigger(
							'asenha-media:grid:filters:add',
							{
								attachments_browser: this,
								priority: priority
							}
						);

						// Fire the asenha-media:grid:bulk_select:enabled event that Addons can hook into and listen
						// when Bulk select is enabled by clicking the Bulk Select button.
						this.controller.on(
							'select:activate',
							function() {
								wp.media.events.trigger( 'asenha-media:grid:bulk_select:enabled' );
							}
						);

						// Fire the asenha-media:grid:bulk_select:disabled event that Addons can hook into and listen
						// when Bulk select is disabled by clicking the Cancel button.
						this.controller.on(
							'select:deactivate',
							function() {
								wp.media.events.trigger( 'asenha-media:grid:bulk_select:disabled' );
							}
						);

						// Fire the asenha-media:grid:attachments:bulk_actions:done event that Addons can hook into and listen
						// when a Bulk select action (e.g. Delete) completes.
						this.controller.on(
							'selection:action:done',
							function() {
								wp.media.events.trigger( 'asenha-media:grid:attachments:bulk_actions:done' );
							}
						);

						// Store the toolbar in a var so we can interact with it later.
						MediaLibraryOrganizerAttachmentsBrowser = this;

				},

				createAttachmentsHeading: function() {

					// Make sure to load the original attachments heading. Check if we still need this function.
					AttachmentsBrowser.prototype.createAttachmentsHeading.call( this );

				},

					/**
					 * Set attachment wrapper view top to match the height of the toolbar, so attachments
					 * are not cut off.
					 */
				createAttachmentsWrapperView: function() {

					// Make sure to load the original attachments wrapper view.
					AttachmentsBrowser.prototype.createAttachmentsWrapperView.call( this );

					// Set wrapper offset on load.
					setTimeout(
						function() {
							MediaLibraryOrganizerAttachmentsBrowser.attachmentsWrapper.el.style.top = ( MediaLibraryOrganizerAttachmentsBrowser.toolbar.el.clientHeight + 10 ) + 'px';
						},
						500
					);

					// Update wrapper offset on window resize.
					window.onresize = function() {
						MediaLibraryOrganizerAttachmentsBrowser.attachmentsWrapper.el.style.top = ( MediaLibraryOrganizerAttachmentsBrowser.toolbar.el.clientHeight + 10 ) + 'px';
					}

				},

			}
		);

	} )( jQuery, _ );

}

/**
 * Grid View: Initialize Edit Attachment Listeners
 *
 * @since 	1.3.3
 */
function mediaLibraryOrganizerGridViewInitializeEditAttachmentListeners() {

	( function( $, _ ) {

		/**
		 * Grid View: Edit Attachment: Show Add New Taxonomy Form.
		 */
		$( 'body' ).on(
			'click',
			'table.compat-attachment-fields a.taxonomy-add-new',
			function( e ) {

				e.preventDefault();

				mediaLibraryOrganizerEditAttachmentToggleTaxonomyTermForm( $( this ).data( 'taxonomy' ) );

			}
		);

		/**
		 * Grid View: Edit Attachment: Add new Taxonomy Term.
		 */
		$( 'body' ).on(
			'click',
			'table.compat-attachment-fields div.asenha-media-taxonomy-term-add-fields input[type=button]',
			function( e ) {

				e.preventDefault();

				mediaLibraryOrganizerEditAttachmentAddTerm(
					$( this ).data( 'taxonomy' ),
					$( 'input[type=text]', $( this ).parent() ).val()
				);

			}
		);

		/**
		 * Extend wp.media.view.AttachmentCompat to add an Event Listener to the initialize() function.
		 *
		 * @since 	1.5.0
		 */
		_.extend(
			wp.media.view.AttachmentCompat.prototype,
			{
				render: function() {
					var compat = this.model.get( 'compat' );
					if ( ! compat || ! compat.item ) {
						return;
					}

					this.views.detach();
					this.$el.html( compat.item );
					this.views.render();

					// Hacky; the view isn't yet loaded, so we have to wait.
					// Frustratingly, trying to extend e.g. wp.media.view.MediaFrame.EditAttachments
					// results in numerous JS errors.
					var mediaLibraryOrganizerModel = this.model;
					setTimeout(
						function() {
							wp.media.events.trigger(
								'asenha-media:grid:edit-attachment:edit',
								{
									attachment_id: 			mediaLibraryOrganizerModel.id, 			// Attachment ID.
									attachment: 			mediaLibraryOrganizerModel.attributes,	// Attachment.
								}
							);
						},
						1000
					);

					return this;
				},
			}
		);

		/**
		 * Extend wp.media.view.Attachment to add an Event Listener to the save() function.
		 *
		 * @since 	1.3.3
		 */
		var mediaLibraryOrganizerAttachmentStatus;
		_.extend(
			wp.media.view.Attachment.prototype,
			{
				/**
				 * Fire the asenha-media:grid:edit-attachment:edited event if the Attachment is saved.
				 *
				 * @since 	1.3.3
				 *
				 * @param {string} status
				 * @return {wp.media.view.Attachment} Returns itself to allow chaining.
				 */
				updateSave: function( status ) {
					var save = this._save = this._save || { status: 'ready' };

					if ( status && status !== save.status ) {
						this.$el.removeClass( 'save-' + save.status );
						save.status = status;
					}

					this.$el.addClass( 'save-' + save.status );

					// If the save status changed from waiting --> ready/complete, fire an event now
					// We check this because this function will be called a lot with repetitive 'ready'
					// statuses when an Attachment is first edited.
					if ( mediaLibraryOrganizerAttachmentStatus == 'waiting' && ( save.status == 'ready' || save.status == 'complete' ) ) {
						// Fire the asenha-media:grid:edit-attachment:edited event that Addons can hook into and listen.
						wp.media.events.trigger(
							'asenha-media:grid:edit-attachment:edited',
							{
								attachment_id: 			this.model.id, 			// Attachment ID.
								attachment: 			this.model.attributes,	// Attachment.
								changed: 				this.model.changed,		// Attachment Attributes Changed.
								taxonomy_term_changed: ( typeof this.model.changed.compat !== 'undefined' ? true : false ), // 'compat' exists when Tax Terms are changed.
							}
						);
					}
					mediaLibraryOrganizerAttachmentStatus = save.status;

					return this;
				},

			}
		);

		/**
		 * Extend wp.media.view.Attachment.Details to add an Event Listener to the moveFocus() function,
		 * which is called when an Attachment is Trashed or Deleted.
		 *
		 * @since 	1.3.3
		 */
		_.extend(
			wp.media.view.Attachment.Details.prototype,
			{

				moveFocus: function() {

					// Fire the asenha-media:grid:edit-attachment:deleted event that Addons can hook into and listen.
					wp.media.events.trigger( 'asenha-media:grid:edit-attachment:deleted' );

					if ( this.previousAttachment.length ) {
						this.previousAttachment.focus();
						return;
					}

					if ( this.nextAttachment.length ) {
						this.nextAttachment.focus();
						return;
					}

					// Fallback: move focus to the "Select Files" button in the media modal.
					if ( this.controller.uploader && this.controller.uploader.$browser ) {
						this.controller.uploader.$browser.focus();
						return;
					}

					// Last fallback.
					this.moveFocusToLastFallback();
				}

			}
		);

	} )( jQuery, _ );

}


/**
 * Grid View: Replace the given Taxonomy's Filter, if it exists.
 *
 * @since 	1.3.3
 *
 * @param 	string 	taxonomy_name 			Taxonomy Name.
 * @param 	array 	terms 					Taxonomy Terms.
 * @param 	string 	all_items_label 		All Terms Label e.g. "All Media Categories", translated.
 * @param 	string 	unassigned_items_label 	Unassigned Terms Label e.g. "Unassigned", translated.
 * @param 	bool 	show_attachment_count 	Show Attachment Counts for each Term.
 */
function mediaLibraryOrganizerGridViewReplaceTaxonomyFilter( taxonomy_name, terms, all_items_label, unassigned_items_label, show_attachment_count ) {

	( function( $ ) {

		// Bail if the Taxonomy isn't enabled as a filter.
		if ( ! MediaLibraryOrganizerTaxonomyFilter.hasOwnProperty( taxonomy_name ) ) {
			return;
		}

		// Populate MediaLibraryOrganizerTaxonomyFilter[ taxonomy_name ] class with new Terms.
		mediaLibraryOrganizerGridViewInitializeTaxonomyFilter( taxonomy_name, terms, all_items_label, unassigned_items_label, show_attachment_count );

		// Render updated Filter in Toolbar.
		MediaLibraryOrganizerAttachmentsBrowser.toolbar.set(
			taxonomy_name,
			new MediaLibraryOrganizerTaxonomyFilter[ taxonomy_name ](
				{
					controller: MediaLibraryOrganizerAttachmentsBrowser.controller,
					model:      MediaLibraryOrganizerAttachmentsBrowser.collection.props,
					priority: 	-75
				}
			).render()
		);

	} )( jQuery );

}

/**
 * Grid View: Replace all Taxonomy Filters by
 * - fetching Taxonomies and their Terms via an AJAX call,
 * - calling mediaLibraryOrganizerGridViewReplaceTaxonomyFilter() with the updated Term list
 *
 * @since 	1.3.3
 *
 * @param 	string 	taxonomy_name 	Taxonomy Name.
 */
function mediaLibraryOrganizerGridViewUpdateTaxonomyFilters() {

	( function( $ ) {

		// Send request.
		$.post(
			media_categories_module_media.ajaxurl,
			{
				'action':                media_categories_module_media.get_taxonomies_terms.action,
				'nonce':                 media_categories_module_media.get_taxonomies_terms.nonce
			},
			function( response ) {

				// Bail if an error occured.
				if ( ! response.success ) {
					alert( response.data );
					return;
				}

				// Replace all Taxonomy Filters.
				for ( let taxonomy_name in response.data ) {
					mediaLibraryOrganizerGridViewReplaceTaxonomyFilter(
						response.data[ taxonomy_name ].taxonomy.name,
						response.data[ taxonomy_name ].terms,
						response.data[ taxonomy_name ].taxonomy.labels.all_items,
						media_categories_module_media.labels.unassigned
					);
				}

			}
		);

	} )( jQuery );

}

/**
 * Grid View: Replace the given Taxonomy's Filter by
 * - fetching the list of Terms via an AJAX call,
 * - calling mediaLibraryOrganizerGridViewReplaceTaxonomyFilter() with the updated Term list
 *
 * @since 	1.3.3
 *
 * @param 	string 	taxonomy_name 	Taxonomy Name.
 */
function mediaLibraryOrganizerGridViewUpdateTaxonomyFilter( taxonomy_name ) {

	( function( $ ) {

		// Send request.
		$.post(
			media_categories_module_media.ajaxurl,
			{
				'action':                media_categories_module_media.get_taxonomy_terms.action,
				'nonce':                 media_categories_module_media.get_taxonomy_terms.nonce,
				'taxonomy_name': 		 taxonomy_name
			},
			function( response ) {

				// Bail if an error occured.
				if ( ! response.success ) {
					alert( response.data );
					return;
				}

				// Replace Taxonomy Filter.
				mediaLibraryOrganizerGridViewReplaceTaxonomyFilter(
					response.data.taxonomy.name,
					response.data.terms,
					response.data.taxonomy.labels.all_items,
					media_categories_module_media.labels.unassigned
				);

			}
		);

	} )( jQuery );

}

/**
 * List View: Replace the given Taxonomy's Filter with the supplied <select> HTML
 *
 * @since 	1.3.3
 *
 * @param 	string 	taxonomy_name 	Taxonomy Name.
 * @param 	string 	html 			<select> HTML.
 * @param 	int 	selected_term 	Currently selected / viewed Taxonomy Term (if any).
 */
function mediaLibraryOrganizerListViewReplaceTaxonomyFilter( taxonomy_name, html, selected_term ) {

	( function( $ ) {

		// Replace <select> Taxonomy dropdown to reflect changes.
		$( 'select#' + taxonomy_name ).replaceWith( html );
		if ( selected_term.length > 0 ) {
			$( 'select#' + taxonomy_name ).val( selected_term );
		}

	} )( jQuery );

}

/**
 * List View: Update Attachment Terms for Attachments in the List.
 *
 * @since 	1.3.3
 *
 * @param 	string 		taxonomy_name 	Taxonomy Name.
 * @param 	WP_Term 	old_term 		Old Term (either the Term that was edited or deleted), WP_Term structure.
 * @param 	WP_Term 	new_term 		New Term (either the New Term information after editing, or false if deleted.
 */
function mediaLibraryOrganizerListViewUpdateAttachmentTerms( taxonomy_name, old_term, new_term ) {

	( function( $ ) {

		$( 'td.taxonomy-' + taxonomy_name + ' a' ).each(
			function() {
				// If this Term matches the one just updated, update it in the DOM.
				if ( $( this ).text() == old_term.name ) {
					// If new_term is false, old_term was deleted, so remove it from this Attachment.
					if ( ! new_term ) {
						$( this ).remove();
					} else {
						$( this ).text( new_term.name );
						$( this ).attr( 'href', 'upload.php?taxonomy=' + taxonomy_name + '&term=' + new_term.slug );
					}
				}
			}
		);

		// Remove leading and trailing commas which may appear as a result of updating/removing a Term.
		$( 'td.taxonomy-' + taxonomy_name ).each(
			function() {
				$( this ).html( $( this ).html().replace( /(^\s*,)|(,\s*$)/g, '' ) );
			}
		);

	} )( jQuery );

}

/**
 * Grid View: Taxonomy Term: Show or Hide the 'Add New' Form
 */
function mediaLibraryOrganizerEditAttachmentToggleTaxonomyTermForm( taxonomy_name ) {

	( function( $ ) {

		if ( $( '.asenha-media-taxonomy-term-add-fields.' + taxonomy_name ).hasClass( 'hidden' ) ) {
			$( '.asenha-media-taxonomy-term-add-fields.' + taxonomy_name ).removeClass( 'hidden' );
		} else {
			$( '.asenha-media-taxonomy-term-add-fields.' + taxonomy_name ).addClass( 'hidden' );
		}

	} )( jQuery );

}

/**
 * Grid View: Taxonomy Term: Clear the Taxonomy Term Form's value.
 */
function mediaLibraryOrganizerEditAttachmentResetTaxonomyTermForm( taxonomy_name ) {

	( function( $ ) {

		$( '.asenha-media-taxonomy-term-add-fields.' + taxonomy_name + 'input[type=text]' ).val( '' );

	} )( jQuery );

}

/**
 * Grid View: Edit Attachment: Add Term.
 */
function mediaLibraryOrganizerEditAttachmentAddTerm( taxonomy_name, term_name, parent_term_id ) {

	( function( $ ) {

		// Build args.
		var args = {
			'action':                media_categories_module_media.create_term.action,
			'nonce':                 media_categories_module_media.create_term.nonce,
			'taxonomy_name': 		 taxonomy_name,
			'term_name':             term_name,
			'term_parent_id':        parent_term_id
		};

		// Send request.
		$.post(
			media_categories_module_media.ajaxurl,
			args,
			function( response ) {

				// Bail if an error occured.
				if ( ! response.success ) {
					alert( response.data );
					return;
				}

				// Fire the asenha-media:grid:edit-attachmentadded:term event that Addons can hook into and listen.
				wp.media.events.trigger( 'asenha-media:grid:edit-attachment:added:term', response.data );

				// Add the Term to the list of Terms.
				$( 'ul#' + response.data.term.taxonomy + 'checklist' ).prepend( response.data.checkbox );

				// Reset the form.
				mediaLibraryOrganizerEditAttachmentResetTaxonomyTermForm( taxonomy_name );

				// Trigger a save of the Attachment, so the Attachment is assigned to the newly created Term that's checked.
				$( 'ul#' + response.data.term.taxonomy + 'checklist li:first input[type="checkbox"]' ).trigger( 'change' );
			}
		);

	} )( jQuery );

}

/**
 * Refreshes the grid view to show an up to date version, based on
 * any additions, changes or deletions of Attachments.
 *
 * @since 	1.4.0
 */
function mediaLibraryOrganizerGridViewRefresh() {

	if ( typeof wp.media.frame.library !== 'undefined' ) {
		wp.media.frame.library.props.set( {ignore: (+ new Date())} );
	} else {
		wp.media.frame.content.get().collection.props.set( {ignore: (+ new Date())} );
	}

}

/**
 * Update multipart_params when the uploader is first initialized.
 *
 * @since 	1.2.3
 */
wp.media.events.on(
	'asenha-media:grid:attachment:upload:init',
	function() {

		// Fetch wp.media.frame.uploader, so we persist it when the user switches
		// between grid view and inline editing in grid view.
		if ( ! mediaLibraryOrganizerUploader && typeof wp.media.frame.uploader !== 'undefined' ) {
			mediaLibraryOrganizerUploader = wp.media.frame.uploader;
		}

		if ( mediaLibraryOrganizerUploader && typeof mediaLibraryOrganizerUploader.uploader !== 'undefined' ) {
			var selected_terms = {};
			for ( let taxonomy_name in media_categories_module_media.taxonomies ) {
				selected_terms[ taxonomy_name ] = media_categories_module_media.taxonomies[ taxonomy_name ].selected_term;
			}

			mediaLibraryOrganizerUploader.uploader.uploader.settings.multipart_params.media_categories_module = selected_terms;
		}

	}
);


/**
 * Update multipart_params when a Taxonomy filter is changed,
 * so that any files uploaded will be assigned to the Taxonomy Term
 * chosen in the Taxonomy filter.
 *
 * @since 	1.2.3
 *
 * @param 	obj 	atts 	Attributes.
 */
wp.media.events.on(
	'asenha-media:grid:filter:change:term',
	function( atts ) {

		if ( mediaLibraryOrganizerUploader && typeof mediaLibraryOrganizerUploader.uploader !== 'undefined' ) {
			mediaLibraryOrganizerUploader.uploader.uploader.settings.multipart_params.media_categories_module[ atts.taxonomy_name ] = atts.slug;
		}

	}
);

/**
 * Grid View: When an attachment completes successful upload to the Grid View, refresh the Grid View.
 *
 * @since   1.2.3
 *
 * @param   obj   attachment  Uploaded Attachment.
 */
wp.media.events.on(
	'asenha-media:grid:attachment:upload:success',
	function( attachment ) {

		mediaLibraryOrganizerGridViewRefresh();

	}
);

/**
 * Grid View: When an attachment is edited in the Grid View, and has a Taxonomy Term added to it using the
 * inline 'Add New' option, reload the Taxonomy Filter.
 *
 * @since   1.3.3
 *
 * @param   obj   atts  Attributes.
 */
wp.media.events.on(
	'asenha-media:grid:edit-attachment:added:term',
	function( atts ) {

		// Replace Taxonomy Filter to reflect changes.
		mediaLibraryOrganizerGridViewReplaceTaxonomyFilter(
			atts.taxonomy.name,
			atts.terms,
			atts.taxonomy.labels.all_items,
			media_categories_module_media.labels.unassigned
		);

	}
);

/**
 * Grid View: When Taxonomy Term(s) are assigned or unassigned to an Attachment in the Grid View:
 * - reload the Taxonomy Filter for the Taxonomy where changes were made
 * - reload the underlying Grid View, so that if viewing by Taxonomy Term and the Attachment
 * was removed from said Taxonomy Term, this is reflected in the grid
 *
 * @since   1.3.3
 *
 * @param   obj   atts  Attributes.
 */
wp.media.events.on(
	'asenha-media:grid:edit-attachment:edited',
	function( atts ) {

		( function( $ ) {

			// Bail if no Taxonomy Terms were changed in the Attachment.
			if ( ! atts.taxonomy_term_changed ) {
				return;
			}

			// Update Taxonomy Filters.
			mediaLibraryOrganizerGridViewUpdateTaxonomyFilters();

			// Refresh Grid View.
			mediaLibraryOrganizerGridViewRefresh();

		} )( jQuery );

	}
);

/**
 * Grid View: When an attachment is deleted in the Grid View > Edit Attachment modal,
 * reload all Taxonomy Filters so their Term Counts are updated.
 *
 * @since   1.3.3
 *
 * @param   obj   atts  Attributes.
 */
wp.media.events.on(
	'asenha-media:grid:edit-attachment:deleted',
	function( atts ) {

		mediaLibraryOrganizerGridViewUpdateTaxonomyFilters();

	}
);

/**
 * Grid View: When Bulk select is disabled i.e. either Deletion completed or the user clicked Cancel,
 * reload all Taxonomy Filters so their Term Counts are updated.
 *
 * We don't do this on asenha-media:grid:attachments:bulk_actions:done, as we might still be in Bulk select mode,
 * therefore reloading the Taxonomy Filters isn't necessary as they're not being displayed.
 *
 * @since   1.3.3.
 */
wp.media.events.on(
	'asenha-media:grid:bulk_select:disabled',
	function() {

		mediaLibraryOrganizerGridViewUpdateTaxonomyFilters();

	}
);

/**
 * Main function to call initialization functions in this
 * file, covering
 * - Registering various wp.media.events that can be listened to by this Plugin and Addons
 * - Registering Taxonomy, Order by and Order Filters
 * - Adding Filters to the Toolbar
 * - wp.media.query fixes
 */
function mediaLibraryOrganizerInitialize() {

	// Initialize Order By and Order Defaults on wp.media.query calls.
	mediaLibraryOrganizerQueryInitialize();

	// Initialize Uploader Instance Events.
	mediaLibraryOrganizerUploaderInitializeEvents();

	// Initialize Grid View Taxonomy Filters.
	mediaLibraryOrganizerGridViewInitializeTaxonomyFilters();

	// Initialize Grid View Order By Filter.
	mediaLibraryOrganizerGridViewInitializeOrderByFilter();

	// Initialize Grid View Order Filter.
	mediaLibraryOrganizerGridViewInitializeOrderFilter();

	// Add Grid View Filters to Toolbar.
	mediaLibraryOrganizerGridViewAddFiltersToToolbar();

	// Initialize Grid View Edit Attachment Listeners.
	mediaLibraryOrganizerGridViewInitializeEditAttachmentListeners();

	// Initialize List View Selectize.
	jQuery( document ).ready(
		function( $ ) {
			if ( typeof mediaLibraryOrganizerSelectizeInit !== 'undefined' ) {
				mediaLibraryOrganizerSelectizeInit();
			}
			
			// Hide "The grid view for the Media Library requires Javascript" notice
			$('.error.hide-if-js').remove();

			// Hide the media category select dropdown coming from ASE Enhance List Table module, if it exists
			var mediaCategoriesSelects = $('select[name="asenha-media-category"]');
			// console.log(mediaCategoriesSelects);
			// console.log(mediaCategoriesSelects.length);
			if ( mediaCategoriesSelects.length > 1 ) {
				// console.log('There are two category selector');
				mediaCategoriesSelects[0].remove();
			}
			
			$('<div class="media-library-vertical-spacer"></div>').insertAfter('#screen-meta');
		}
	);

}

// Finally, initialize Media Categories Module.
mediaLibraryOrganizerInitialize();