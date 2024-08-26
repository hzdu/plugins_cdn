/**
 * JavaScript for interacting with Selectize instances.
 *
 * @since 	1.0.0
 *
 * @package Media_Categories_Module
 * @author 	Media Categories Module
 */

/**
 * Initializes selectize instances
 *
 * @since 	1.0.7
 *
 * @param 	string 	container 	Only initialize selectize instances within the given DOM element ID/class (optional)
 */
function mediaLibraryOrganizerSelectizeInit( container ) {

	var media_categories_module_selectize_container = ( typeof container != 'undefined' ? container : 'body' );

	( function( $ ) {

		/**
		 * Selectize Instances: Simple
		 */
		$( media_categories_module_selectize.selectors.simple.join( ', ' ), $( media_categories_module_selectize_container ) ).each(
			function() {

				var delimiter = ',';
				if ( typeof $( this ).data( 'delimiter' ) !== 'undefined' ) {
					delimiter = $( this ).data( 'delimiter' );
				}

				$( this ).selectize(
					{
						delimiter: delimiter
					}
				);

			}
		);

		/**
		 * Selectize Instances: Multiple Values
		 */
		$( media_categories_module_selectize.selectors.multiple.join( ', ' ), $( media_categories_module_selectize_container ) ).each(
			function() {

				var delimiter = ( typeof $( this ).data( 'delimiter' ) !== 'undefined' ? $( this ).data( 'delimiter' ) : ',' );

				$( this ).selectize( {
					plugins: [ 'drag_drop', 'remove_button' ],
					delimiter: delimiter,
				    persist: false,
				    create: function( input ) {
				        return {
				            value: input,
				            text: input
				        }
				    }
				} );

			}
		);

		/**
		 * Selectize Instances: WordPress AJAX Search
		 */
		$( media_categories_module_selectize.selectors.ajax.join( ', ' ), $( media_categories_module_selectize_container ) ).each(
			function() {

				var action    = $( this ).data( 'action' ),
				nonce 		  = $( this ).data( 'nonce' ),
				args          = $( this ).data( 'args' ),
				name          = $( this ).attr( 'name' ),
				name_field    = $( this ).data( 'name-field' ),
				value_field   = $( this ).data( 'value-field' ),
				method        = $( this ).data( 'method' ),
				output_fields = $( this ).data( 'output-fields' ).split( ',' ),
				plugins       = $( this ).data( 'plugins' ).split( ',' );

				$( this ).selectize(
					{
						plugins: 		plugins,
						delimiter: 		',',
						valueField: 	value_field, // The value to store in the select when the form is submitted.
						labelField: 	name_field,  // What to display on the output?
						searchField: 	name_field,  // For some reason, this has to be specified.
						options: 		[],
						create: 		false,
						render: {
							option: function( item, escape ) {

								// Build string.
								var output_string        = [],
									output_fields_length = output_fields.length;
								for ( var i = 0; i < output_fields_length; i++ ) {
									output_string.push( item[ output_fields[ i ] ] );
								}

								// Return output.
								return '<div>' + output_string.join( ', ' ) + '</div>';

							}
						},
						load: function( query, callback ) {

							// Bail if the query is too short.
							if ( ! query.length || query.length < 3 ) {
								return callback();
							}

							// Send request to Plugin's AJAX endpoint.
							$.ajax(
								{
									url: 		ajaxurl,
									type: 		method,
									dataType: 	'json',
									data: 	{
										'action': 		action,
										'nonce': 		nonce,
										'query': 		query,
										'args': 		args
									},
									error: function() {

										callback();

									},
									success: function( result ) {

										// If an error occured from the request, output it now.
										if ( ! result.success ) {
											alert( result.data );
										}

										callback( result.data );

									}
								}
							);
						},

						/**
						 * Copy values to hidden field as a comma separated string, which might be used
						 */
						onChange: function( value ) {

							// Bail if no hidden field.
							if ( ! $( 'input[type=hidden]', this.$input.parent() ).length ) {
								return;
							}

							if ( value === null || ! value.length ) {
								$( 'input[type=hidden]', this.$input.parent() ).val( '' );
								return;
							}

							// Implode into comma separated string.
							$( 'input[type=hidden]', this.$input.parent() ).val( value.join() );
						}
					}
				);
			}
		);

	} )( jQuery );

}

/**
 * Destroys selectize instances
 *
 * @since 	1.0.7
 *
 * @param 	string 	container 	Destroy selectize instances within the given DOM element ID/class (optional)
 */
function mediaLibraryOrganizerSelectizeDestroy( container ) {

	var media_categories_module_selectize_container = ( typeof container != 'undefined' ? container : 'body' );

	( function( $ ) {

		/**
		 * Selectize Instances: Simple
		 */
		$( media_categories_module_selectize.selectors.simple.join( ', ' ), $( media_categories_module_selectize_container ) ).each(
			function() {

				if ( typeof this.selectize !== 'undefined' ) {
					this.selectize.destroy();
				}

			}
		);

		/**
		 * Selectize Instances: Multiple Values
		 */
		$( media_categories_module_selectize.selectors.multiple.join( ', ' ), $( media_categories_module_selectize_container ) ).each(
			function() {

				if ( typeof this.selectize !== 'undefined' ) {
					this.selectize.destroy();
				}

			}
		);

		/**
		 * Selectize Instances: WordPress AJAX Search
		 */
		$( media_categories_module_selectize.selectors.ajax.join( ', ' ), $( media_categories_module_selectize_container ) ).each(
			function() {

				if ( typeof this.selectize !== 'undefined' ) {
					this.selectize.destroy();
				}

			}
		);

	} )( jQuery );

}
