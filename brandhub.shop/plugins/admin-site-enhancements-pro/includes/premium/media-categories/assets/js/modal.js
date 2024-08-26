/**
 * JavaScript for creating and showing a Backbone Modal.
 *
 * @since 	1.0.0
 *
 * @package Media_Categories_Module
 * @author 	Media Categories Module
 */

/**
 * Listen for click events on .media-categories-module-modal elements,
 * and show the Backbone Modal.
 *
 * @since   1.0.7
 */
( function( $ ) {

	$( '.media-categories-module-modal' ).on(
		'click',
		function( e ) {

			e.preventDefault();

			// Get the action.
			var contentView = $( this ).data( 'content-view' ),
			sidebarView     = $( this ).data( 'sidebar-view' ),
			title           = $( this ).data( 'title' ),
			buttonLabel     = $( this ).data( 'button-label' ),
			output          = $( this ).data( 'output' ),
			model           = $( this ).data( 'model' );

			// Define the modal's view.
			MediaLibraryOrganizerModalWindow.content(
				new MediaLibraryOrganizerViewContainer(
					{
						contentView:   contentView,
						sidebarView:   sidebarView,
						title:         title,
						buttonLabel:   buttonLabel,
						model:         model,
					}
				)
			);

			// Open the modal window.
			MediaLibraryOrganizerModalWindow.open();

			// Initialize any Selectize instances now.
			mediaLibraryOrganizerSelectizeInit();

		}
	);

} )( jQuery );

/**
 * Define the global modal window object to use.
 *
 * @since 	1.0.7
 */
var MediaLibraryOrganizerModalWindow = new wp.media.view.Modal(
	{
		controller: {
			trigger: function() {
			}
		}
	}
);

/**
 * Define the global view container to use.  Addons specify the content and sidebar
 * views to load into this view container, as well as the view container's title
 * and insert button label text.
 *
 * @since 	1.0.7
 */
var MediaLibraryOrganizerViewContainer = wp.Backbone.View.extend(
	{

		/**
		 * The Tag Name
		 *
		 * @since   1.0.7
		 *
		 * @var     string
		 */
		tagName:    'div',

		/**
		 * The Class Name
		 *
		 * @since   1.0.7
		 *
		 * @var     string
		 */
		className:  'media-frame mode-select wp-core-ui hide-router hide-menu',

		/**
		 * The template to load inside the above tagName element
		 *
		 * @since   1.0.7
		 *
		 * @var     wp.template
		 */
		template:   wp.template( 'media-categories-module-content-view' ),

		/**
		 * Functions to call when specific events occur
		 *
		 * @since   1.0.7
		 */
		events: {
			// Update Form Field.
			'keyup input':                      'updateItem',
			'keyup textarea':                   'updateItem',
			'change input':                     'updateItem',
			'change textarea':                  'updateItem',
			'blur textarea':                    'updateItem',
			'change select':                    'updateItem',

			// Insert Button.
			'click button.media-button-insert': 'insert',
		},

		/**
		 * Stores the arguments in this class
		 *
		 * @param    object  args:
		 * - contentView: Content View Name
		 * - sidebarView: Sidebar View Name
		 * - title: Modal Title
		 * - buttonLabel: Button Label
		 * - model: object comprising of key/value pairs
		 *
		 * @since   1.0.7
		 */
		initialize: function( args ) {

			this.contentView = args.contentView;
			this.sidebarView = args.sidebarView;
			this.title       = args.title;
			this.buttonLabel = args.buttonLabel;
			this.model       = new Backbone.Model( args.model );

		},

		/**
		 * Renders the view
		 *
		 * @since   1.0.7
		 */
		render: function() {

			// Load template into HTML.
			this.$el.html(
				this.template(
					{
						title:          this.title,
						buttonLabel:    this.buttonLabel,
						}
				)
			);

			// Load Content View.
			this.$el.find( 'div.media-content' ).append( wp.media.template( this.contentView ) );

			// Load Sidebar View.
			this.$el.find( 'div.media-sidebar' ).append( wp.media.template( this.sidebarView ) );

			// Return.
			return this;

		},

		/**
		 * Updates the model whenever a form field's value is changed.
		 *
		 * @since   1.0.7
		 *
		 * @param   obj     event   Event
		 */
		updateItem: function( event ) {

			// Check if the target has a name. If not, it's not a model value we want to store.
			if ( event.target.name == '' ) {
				return;
			}

			// Update the model's value, depending on the input type.
			switch ( event.target.type ) {
				case 'checkbox':
					value = ( event.target.checked ? event.target.value : 0 );
					break;

				default:
					// event.target.value is stale and out of date when using e.g. selectize.
					value = jQuery( event.target ).val();
					break;
			}

			// Update the model.
			this.model.set( event.target.name, value );

		},

		/**
		 * Called when the Insert button is clicked
		 *
		 * @since   1.0.7
		 */
		insert: function() {

			MediaLibraryOrganizerModalWindow.close();

		}

	}
);


/**
 * Define the global sidebar view container to use.  Addons specify sidebar
 * view to load into this view container.
 *
 * @since 	1.0.7
 */
var MediaLibraryOrganizerSidebarViewContainer = wp.Backbone.View.extend(
	{

		/**
		 * The Tag Name and Tag's Class(es)
		 *
		 * @since    1.0.7
		 */
		tagName:    'div',
		className:  'sidebar',

		/**
		 * Template
		 * - The template to load inside the above tagName element
		 *
		 * @since    1.0.7
		 */
		template:   wp.template( 'media-categories-module-sidebar-view' ),

		/**
		 * Stores the view name to render in the class
		 *
		 * @since    1.0.7
		 *
		 * @param    string     view    View to render
		 */
		initialize: function( args ) {

			this.view = args.view;

		},

		/**
		 * Renders the view
		 *
		 * @since   1.0.7
		 */
		render: function() {

			// Get HTML.
			this.$el.html( wp.template( this.args.view ) );

			// Return.
			return this;

		}

	}
);
