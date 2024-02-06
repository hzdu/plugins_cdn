( function( $, settings ) {

	var All = wp.media.view.AttachmentFilters.All;
	var Uploaded = wp.media.view.AttachmentFilters.Uploaded;
	var AttachmentsBrowser = wp.media.view.AttachmentsBrowser;

	var FiltersExtension = {
		createFilters: function() {
			All.prototype.createFilters.apply( this, arguments );

			var mine = this.filters.mine ? this.filters.mine : null;

			if ( mine ) {
				delete this.filters.mine;
			}

			this.filters.happyforms = {
				text: settings.label,
				props: {
					type: 'happyforms',
				},
				priority: 50,
			};

			if ( mine ) {
				this.filters.mine = mine;
			}
		},
	};

	wp.media.view.AttachmentFilters.All = All.extend( FiltersExtension );
	wp.media.view.AttachmentFilters.Uploaded = Uploaded.extend( FiltersExtension );

	var FormFilter = wp.media.view.AttachmentFilters.extend( {
		id: 'media-attachment-forms-filters',

		createFilters: function() {
			var filters = {};
			_.each( settings.forms || {}, function( value, index ) {
				filters[ index ] = {
					text: value.name,
					props: {
						happyforms_form_id: value.id,
					}
				};
			} );

			filters.all = {
				text:  'All forms',
				props: {
					happyforms_form_id: ''
				},
				priority: 10
			};

			this.filters = filters;
		},
	});

	wp.media.view.FormFilter = FormFilter;

	wp.media.view.AttachmentsBrowser = AttachmentsBrowser.extend( {
		createToolbar: function() {
			AttachmentsBrowser.prototype.createToolbar.apply( this, arguments );

			var Filters = wp.media.view.AttachmentFilters.All;

			if ( 'uploaded' === this.options.filters ) {
				Filters = wp.media.view.AttachmentFilters.Uploaded;
			}

			var filters = new Filters( {
				controller: this.controller,
				model: this.collection.props,
				priority: -80
			} );

			this.toolbar.set( 'filters', filters.render() );

			this.toolbar.set( 'formsFilter', new wp.media.view.FormFilter({
				controller: this.controller,
				model: this.collection.props,
				priority: -75
			}).render() );
		}
	} );

	$( document ).on( 'change', '#media-attachment-filters', function( e ) {
		var value = $( e.target ).val();

		if ( 'happyforms' == value ) {
			$( '#media-attachment-forms-filters' ).show();
		} else {
			$( '#media-attachment-forms-filters' ).hide();
		}
	} );

} )( jQuery, _happyFormsAdminMediaSettings );