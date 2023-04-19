(function( $, document ) {

	var iconic_cffv = {

		/**
		 * Cache: common elements and vars
		 */
		cache: function() {
			iconic_cffv.els = {};
			iconic_cffv.vars = {};
			iconic_cffv.tpl = {};

			// common vars
			//iconic_cffv.vars.a_variable = 1;

			// common elements
			iconic_cffv.els.fields_table = $( '.iconic-cffv-fields' );
			iconic_cffv.els.fields_table_body = iconic_cffv.els.fields_table.find( 'tbody' );

			var searchParams         = new URLSearchParams( location.search );
			iconic_cffv.vars.post_id = searchParams.get( 'post' );

			var meta_field = iconic_cffv.vars.post_id ?
				'<p>' +
				'<label><strong>Meta ID</strong></label><br>' +
				'<input type="text" class="large-text" value="{{meta_key}}" name="meta_key" readonly>' +
				'<p>'
				:
				'';

			// common templates
			iconic_cffv.tpl.field_editor_layout =
				'<form class="iconic-cffv-field-editor">' +
				'<h2>{{field_action}} Field</h2>' +
				'<p>' +
				'<label><strong>Field Label</strong></label><br>' +
				'<input type="text" class="large-text" value="{{label}}" name="label">' +
				'</p>' +

				meta_field +

				// Field ID is not used anymore but kept it here hidden for debugging purpose.
				'<p style="display:none">' +
				'<label><strong>Field ID</strong></label><br>' +
				'<input type="text" class="large-text" value="{{id}}" name="id" readonly>' +
				'</p>' +
				'<p>' +
				'<label><strong>Field Type</strong></label><br>' +
				'<select class="iconic-cffv-field-editor__type" name="type">' +
				'<option value="text">Text</option>' +
				'<option value="textarea">Textarea</option>' +
				'<option value="select">Select</option>' +
				'<option value="checkboxes">Checkboxes</option>' +
				'<option value="radio_buttons">Radio Buttons</option>' +
				'</select>' +
				'</p>' +
				'<div class="iconic-cffv-placeholder--options"></div>' +
				'<p>' +
				'<label><strong>Field Description</strong></label><br>' +
				'<textarea class="large-text" rows="5" name="description">{{description}}</textarea>' +

				'</p>' +
				'<p>' +
				'<label><strong>Default Value</strong></label><br>' +
				'<input type="text" class="large-text" name="default" value="{{default}}">' +
				'<p>' +
			
				'<h3>Product Page Display Options</h3>' +
				'<p>Choose how the variation data is displayed on the frontend to the customer.</p>' +
				'<p>' +
				'<label><strong>Show on Frontend?</strong></label><br>' +
				'<select class="iconic-cffv-field-editor__display_frontend" name="display_frontend">' +
				'<option value="yes">Yes</option>' +
				'<option value="no">No</option>' +
				'</select>' +
				'</p>' +
				'<p>' +
				'<label><strong>Show Label?</strong></label><br>' +
				'<select class="iconic-cffv-field-editor__display_label" name="display_label">' +
				'<option value="yes">Yes</option>' +
				'<option value="no">No</option>' +
				'</select>' +
				'</p>' +
				'<div class="iconic-cffv-placeholder--display-as"></div>' +
				'<div class="iconic-cffv-placeholder--label-position"></div>' +
				'<a href="javascript: void(0);" class="button button-primary iconic-cffv-save-field" data-save-type="{{field_action}}" data-index="{{field_index}}">{{field_action}} Field</a>' +
				'</form>';

			iconic_cffv.tpl.field_row =
				'<tr class="iconic-cffv-fields__field" data-index="{{index}}">' +
				'<td>' +
				'<strong>{{order}}</strong>' +
				'<input type="hidden" class="iconic-cffv-field-data" name="iconic-cffv-field-data[{{index}}]" value="{{json}}">' +
				'</td>' +

				'<td class="title column-title has-row-actions column-primary page-title">' +
				'<strong><a href="#" class="row-title iconic-cffv-edit-field iconic-cffv-field-label">{{label}}</a></strong>' +
				'<div class="row-actions">' +
				'<a href="javascript: void(0);" class="iconic-cffv-edit-field" title="Edit Field">Edit</a> |' +
				// '<a href="javascript: void(0);" class="iconic-cffv-duplicate-field" title="Duplicate Field">Duplicate</a> |' +
				'<span class="trash"><a href="javascript: void(0);" class="iconic-cffv-delete-field" title="Delete Field">Bin</a></span>' +
				'</div>' +
				'</td>' +

				'<td class="iconic-cffv-field-type">{{type}}</td>' +
				'<td class="iconic-cffv-field-shortcode"><input type="text" readonly value="{{shortcode}}"/></td>' +
				'</tr>';

			iconic_cffv.tpl.options =
				'<div class="iconic-cffv-field-editor__options-wrapper">' +
				'<strong>Field Options</strong><br>' +
				'Enter each option on a new line.<br>' +
				'<textarea class="large-text iconic-cffv-field-editor__options" rows="5" name="options">{{options}}</textarea>' +
				'</div>';

			iconic_cffv.tpl.display_as =
				'<p>' +
				'<label><strong>Display as</strong></label><br>' +
				'<select class="iconic-cffv-field-editor__display_as" name="display_as">' +
				'<option value="list">List</option>' +
				'<option value="comma_separated">Comma Separated</option>' +
				'</select>' +
				'</p>';

			iconic_cffv.tpl.label_position =
				'<p>' +
				'<label><strong>Label Position</strong></label><br>' +
				'<select class="iconic-cffv-field-editor__label_position" name="label_position">' +
				'<option value="above">Above</option>' +
				'<option value="left">Left</option>' +
				'</select>' +
				'</p>';

		},

		on_ready: function() {

			iconic_cffv.cache();
			iconic_cffv.setup_field_groups_edit_page();
			iconic_cffv.setup_product_edit_page();

		},

		/**
		 * All methods for the field groups edit page
		 */
		setup_field_groups_edit_page: function() {

			iconic_cffv.setup_field_editor();

		},

		/**
		 * All methods for the product edit page
		 */
		setup_product_edit_page: function() {

			iconic_cffv.setup_help_tips();

		},

		/**
		 * Setup the magnific field editor
		 */
		setup_field_editor: function() {

			/**
			 * Edit label.
			 */
			$( document ).on( 'keyup', ".iconic-cffv-field-editor [name='label']", function() {
				var $label_field = $( this ),
					label = $label_field.val(),
					$form = $label_field.closest( '.iconic-cffv-field-editor' ),
					$slug_field = $form.find( "[name='id']" ),
					slug = iconic_cffv.slugify( label );

				$slug_field.val( slug );
			} );

			/**
			 * Edit/Add field
			 */
			$( document ).on( 'click', '.iconic-cffv-edit-field', function() {

				var field_data = iconic_cffv.get_field_data_from_row( $( this ) ),
					$contents = null,
					contents = "",
					options = "",
					display_as = field_data && typeof field_data.json.display_as !== 'undefined' ? field_data.json.display_as : false;

				if ( field_data ) {

					contents = iconic_cffv.tpl.field_editor_layout
						.replace( /{{field_action}}/g, "Edit" )
						.replace( '{{field_index}}', field_data.index )
						.replace( '{{label}}', field_data.json.label )
						.replace( '{{id}}', field_data.json.id )
						.replace( '{{default}}', field_data.json.default ? field_data.json.default : '' )
						.replace( '{{description}}', iconic_cffv.br2nl( field_data.json.description ) )
						.replace( '{{meta_key}}', iconic_cffv.generate_field_meta_key( field_data ) );

					// Insert options
					if ( field_data.json.options ) {

						// Insert options into the options textarea
						options = iconic_cffv.tpl.options
							.replace( '{{options}}', field_data.json.options );

					} else {

						contents = contents
							.replace( '{{options}}', "" );

					}

					// Convert to element so we can select options
					$contents = $( contents );

					// Insert conditional fields into layout

					if ( iconic_cffv.has_display_as( field_data.json.type ) ) {
						iconic_cffv.add_to_placeholder( 'display-as', iconic_cffv.tpl.display_as, $contents );
					}

					if ( iconic_cffv.has_options( field_data.json.type ) ) {
						iconic_cffv.add_to_placeholder( 'options', options, $contents );
					}

					if ( iconic_cffv.has_label_position( field_data.json.type, display_as ) ) {
						iconic_cffv.add_to_placeholder( 'label-position', iconic_cffv.tpl.label_position, $contents );
					}

					// Select "select" field options
					var selects = [ 'type', 'display_frontend', 'display_label', 'label_position', 'display_as' ];

					$.each( selects, function( index, select ) {
						$contents.find( 'select[name="' + select + '"] option[value="' + field_data.json[ select ] + '"]' ).attr( 'selected', true );
					} );

				} else {

					var rows = $( '.iconic-cffv-fields__field' ).length;

					contents = iconic_cffv.tpl.field_editor_layout
						.replace( /{{field_action}}/g, "Add" )
						.replace( '{{field_index}}', rows )
						.replace( '{{label}}', "" )
						.replace( '{{id}}', "" )
						.replace( '{{default}}', "" )
						.replace( '{{description}}', "" )
						.replace( '{{meta_key}}', "" );

					// Convert to element so we can select options
					$contents = $( contents );

					iconic_cffv.add_to_placeholder( 'label-position', iconic_cffv.tpl.label_position, $contents );

				}

				// Convert back to string
				contents = $contents[ 0 ].outerHTML;

				$.magnificPopup.open( {
					items: {
						src: '<div class="white-popup">' + contents + '</div>',
						type: 'inline'
					}
				}, 0 );

				return false;

			} );

			/**
			 * Save field
			 */
			$( document ).on( 'click', '.iconic-cffv-save-field', function () {

				var index = parseInt( $( this ).attr( 'data-index' ) ),
					save_type = $( this ).attr( 'data-save-type' ),
					field_data = iconic_cffv.get_edit_field_data(),
					field_data_json = JSON.stringify( field_data ),
					$row = false;

				if ( save_type === "Edit" ) {

					$row = $( '.iconic-cffv-fields__field' ).eq( index );

					$row.find( '.iconic-cffv-field-data' ).val( field_data_json );
					$row.find( '.iconic-cffv-field-label' ).html( field_data.label );
					$row.find( '.iconic-cffv-field-type' ).html( field_data.type );

				} else {

					var shortcode = "[iconic-variation-fields fields='" + iconic_cffv.generate_field_meta_key( field_data ) + "']";

					$row = $( iconic_cffv.tpl.field_row
						.replace( /{{index}}/g, index )
						.replace( '{{order}}', index + 1 )
						.replace( '{{label}}', field_data.label )
						.replace( '{{type}}', field_data.type )
						.replace( '{{default}}', field_data.default )
						.replace( '{{shortcode}}', shortcode  ) );

					$row.find( '.iconic-cffv-field-data' ).val( field_data_json );

					iconic_cffv.els.fields_table_body.append( $row );

				}

				$.magnificPopup.close();

				return false;

			} );

			/**
			 * Field Type Selection
			 */
			$( document ).on( 'change', '.iconic-cffv-field-editor__type', function() {

				var $form = $( this ).closest( '.iconic-cffv-field-editor' ),
					value = $( this ).val(),
					$options = $( '.iconic-cffv-field-editor__options' );

				// add display as
				if ( iconic_cffv.has_display_as( value ) ) {

					iconic_cffv.add_to_placeholder( 'display-as', iconic_cffv.tpl.display_as, $form );

				} else {

					iconic_cffv.empty_placeholder( 'display-as', $form );

				}

				// add label position
				if ( iconic_cffv.has_label_position( value ) ) {

					iconic_cffv.add_to_placeholder( 'label-position', iconic_cffv.tpl.label_position, $form );

				} else {

					iconic_cffv.empty_placeholder( 'label-position', $form );

				}

				// add options
				if ( iconic_cffv.has_options( value ) ) {

					if ( $options.length <= 0 ) {

						iconic_cffv.add_to_placeholder( 'options', iconic_cffv.tpl.options.replace( '{{options}}', "" ), $form );

					}

				} else {

					iconic_cffv.empty_placeholder( 'options', $form );

				}

			} );

			/**
			 * Display as selection
			 */
			$( document ).on( 'change', '.iconic-cffv-field-editor__display_as', function() {

				var $form = $( this ).closest( '.iconic-cffv-field-editor' );

				if ( $( this ).val() === "comma_separated" ) {

					iconic_cffv.add_to_placeholder( 'label-position', iconic_cffv.tpl.label_position, $form );

				} else {

					iconic_cffv.empty_placeholder( 'label-position', $form );

				}

			} );

			/**
			 * Delete field
			 */
			$( document ).on( 'click', '.iconic-cffv-delete-field', function() {

				var $this = $( this ),
					$parent_row = $this.closest( 'tr' );

				$parent_row.remove();

				iconic_cffv.update_field_orders();

			} );

		},

		/**
		 * Helper: Update field orders
		 */
		update_field_orders: function() {

			var $field_orders = $( '.iconic-cffv-fields__field-order' );

			$field_orders.each( function( index, el ) {

				$( el ).html( index + 1 );

			} );

		},

		/**
		 * Get field data from row
		 *
		 * @param int $link The link that was clicked to open the modal
		 * @return object|bool
		 */
		get_field_data_from_row: function( $link ) {
			var $row = $link.closest( 'tr' ),
				field_data = false;

			if ( $row.length <= 0 ) {
				return field_data;
			}

			var json_data = $row.find( '.iconic-cffv-field-data' ).val();

			if ( typeof json_data === "undefined" ) {
				return field_data;
			}

			var index = $row.attr( 'data-index' );

			field_data = {
				index: index,
				json: $.parseJSON( json_data )
			};

			if ( typeof field_data.json.id === 'undefined' ) {
				field_data.json.id = iconic_cffv.slugify( field_data.json.label );
			}

			return field_data;
		},

		/**
		 * Get edit field data in json format
		 *
		 * @return array
		 */
		get_edit_field_data: function() {

			var $field_editor_form = $( '.iconic-cffv-field-editor' );

			return iconic_cffv.serialize_assoc( $field_editor_form );

		},

		/**
		 * Get form data as assoc array
		 *
		 * @param obj form
		 * @return array
		 */
		serialize_assoc: function( $form ) {

			// Grab a set of name:value pairs from the form dom.
			var set = $form.serializeArray();
			var output = {};

			for ( var field in set ) {

				if ( ! set.hasOwnProperty( field ) ) {
					continue;
				}

				// Split up the field names into array tiers
				var parts = set[ field ].name
					.split( /\]|\[/ );

				// We need to remove any blank parts returned by the regex.
				parts = $.grep( parts, function( n ) {
					return n !== '';
				} );

				// Start ref out at the root of the output object
				var ref = output;

				for ( var segment in parts ) {
					if ( ! parts.hasOwnProperty( segment ) ) {
						continue;
					}

					// set key for ease of use.
					var key = parts[ segment ];
					var value = {};

					// If we're at the last part, the value comes from the original array.
					if ( parseInt( segment ) === parts.length - 1 ) {
						value = set[ field ].value;
					}

					// Create a throwaway object to merge into output.
					var objNew = {};
					objNew[ key ] = value;

					// Extend output with our temp object at the depth specified by ref.
					$.extend( true, ref, objNew );

					// Reassign ref to point to this tier, so the next loop can extend it.
					ref = ref[ key ];
				}

			}

			return output;

		},

		/**
		 * New line to <br>
		 *
		 * @param str str
		 * @return bool is_xhtml
		 */
		nl2br: function( str, is_xhtml ) {

			var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
			return (str + '').replace( /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag );

		},

		/**
		 * <br> to New line
		 *
		 * @param str str
		 */
		br2nl: function( str ) {

			return (str + '').replace( /<br \/>/g, "\r\n" );

		},

		/**
		 * Convert string to slug.
		 *
		 * @param str
		 * @return {string|*}
		 */
		slugify: function( str ) {
			str = str.replace( /^\s+|\s+$/g, '' ); // trim
			str = str.toLowerCase();

			// remove accents, swap ñ for n, etc
			var from = "àáäâèéëêìíïîòóöôùúüûñç·/,:;";
			var to = "aaaaeeeeiiiioooouuuunc_____";

			for ( var i = 0, l = from.length; i < l; i ++ ) {
				str = str.replace( new RegExp( from.charAt( i ), 'g' ), to.charAt( i ) );
			}

			str = iconic_cffv.sanitize_str( str ) // remove invalid chars
				.replace( /\s+/g, '_' ) // collapse whitespace and replace by -
				.replace( /\.+/g, '_' ) // replace periods
				.replace( /-+/g, '_' ) // collapse dashes
				.replace( /_+/g, '_' ); // collapse underscores

			return str;
		},

			
		sanitize_str: function( str ){
			var map = {
				"À": "A",
				"Á": "A",
				"Â": "A",
				"Ã": "A",
				"Ä": "A",
				"Å": "A",
				"Æ": "AE",
				"Ç": "C",
				"È": "E",
				"É": "E",
				"Ê": "E",
				"Ë": "E",
				"Ì": "I",
				"Í": "I",
				"Î": "I",
				"Ï": "I",
				"Ð": "D",
				"Ñ": "N",
				"Ò": "O",
				"Ó": "O",
				"Ô": "O",
				"Õ": "O",
				"Ö": "O",
				"Ø": "O",
				"Ù": "U",
				"Ú": "U",
				"Û": "U",
				"Ü": "U",
				"Ý": "Y",
				"ß": "s",
				"à": "a",
				"á": "a",
				"â": "a",
				"ã": "a",
				"ä": "a",
				"å": "a",
				"æ": "ae",
				"ç": "c",
				"è": "e",
				"é": "e",
				"ê": "e",
				"ë": "e",
				"ì": "i",
				"í": "i",
				"î": "i",
				"ï": "i",
				"ñ": "n",
				"ò": "o",
				"ó": "o",
				"ô": "o",
				"õ": "o",
				"ö": "o",
				"ø": "o",
				"ù": "u",
				"ú": "u",
				"û": "u",
				"ü": "u",
				"ý": "y",
				"ÿ": "y",
				"Ā": "A",
				"ā": "a",
				"Ă": "A",
				"ă": "a",
				"Ą": "A",
				"ą": "a",
				"Ć": "C",
				"ć": "c",
				"Ĉ": "C",
				"ĉ": "c",
				"Ċ": "C",
				"ċ": "c",
				"Č": "C",
				"č": "c",
				"Ď": "D",
				"ď": "d",
				"Đ": "D",
				"đ": "d",
				"Ē": "E",
				"ē": "e",
				"Ĕ": "E",
				"ĕ": "e",
				"Ė": "E",
				"ė": "e",
				"Ę": "E",
				"ę": "e",
				"Ě": "E",
				"ě": "e",
				"Ĝ": "G",
				"ĝ": "g",
				"Ğ": "G",
				"ğ": "g",
				"Ġ": "G",
				"ġ": "g",
				"Ģ": "G",
				"ģ": "g",
				"Ĥ": "H",
				"ĥ": "h",
				"Ħ": "H",
				"ħ": "h",
				"Ĩ": "I",
				"ĩ": "i",
				"Ī": "I",
				"ī": "i",
				"Ĭ": "I",
				"ĭ": "i",
				"Į": "I",
				"į": "i",
				"İ": "I",
				"ı": "i",
				"Ĳ": "IJ",
				"ĳ": "ij",
				"Ĵ": "J",
				"ĵ": "j",
				"Ķ": "K",
				"ķ": "k",
				"Ĺ": "L",
				"ĺ": "l",
				"Ļ": "L",
				"ļ": "l",
				"Ľ": "L",
				"ľ": "l",
				"Ŀ": "L",
				"ŀ": "l",
				"Ł": "l",
				"ł": "l",
				"Ń": "N",
				"ń": "n",
				"Ņ": "N",
				"ņ": "n",
				"Ň": "N",
				"ň": "n",
				"ŉ": "n",
				"Ō": "O",
				"ō": "o",
				"Ŏ": "O",
				"ŏ": "o",
				"Ő": "O",
				"ő": "o",
				"Œ": "OE",
				"œ": "oe",
				"Ŕ": "R",
				"ŕ": "r",
				"Ŗ": "R",
				"ŗ": "r",
				"Ř": "R",
				"ř": "r",
				"Ś": "S",
				"ś": "s",
				"Ŝ": "S",
				"ŝ": "s",
				"Ş": "S",
				"ş": "s",
				"Š": "S",
				"š": "s",
				"Ţ": "T",
				"ţ": "t",
				"Ť": "T",
				"ť": "t",
				"Ŧ": "T",
				"ŧ": "t",
				"Ũ": "U",
				"ũ": "u",
				"Ū": "U",
				"ū": "u",
				"Ŭ": "U",
				"ŭ": "u",
				"Ů": "U",
				"ů": "u",
				"Ű": "U",
				"ű": "u",
				"Ų": "U",
				"ų": "u",
				"Ŵ": "W",
				"ŵ": "w",
				"Ŷ": "Y",
				"ŷ": "y",
				"Ÿ": "Y",
				"Ź": "Z",
				"ź": "z",
				"Ż": "Z",
				"ż": "z",
				"Ž": "Z",
				"ž": "z",
				"ſ": "s",
				"ƒ": "f",
				"Ơ": "O",
				"ơ": "o",
				"Ư": "U",
				"ư": "u",
				"Ǎ": "A",
				"ǎ": "a",
				"Ǐ": "I",
				"ǐ": "i",
				"Ǒ": "O",
				"ǒ": "o",
				"Ǔ": "U",
				"ǔ": "u",
				"Ǖ": "U",
				"ǖ": "u",
				"Ǘ": "U",
				"ǘ": "u",
				"Ǚ": "U",
				"ǚ": "u",
				"Ǜ": "U",
				"ǜ": "u",
				"Ǻ": "A",
				"ǻ": "a",
				"Ǽ": "AE",
				"ǽ": "ae",
				"Ǿ": "O",
				"ǿ": "o",
				
				// extra
				' ': '_',
				"'": '',
				'?': '',
				'/': '',
				'\\': '',
				'.': '',
				',': '',
				'`': '',
				'>': '',
				'<': '',
				'"': '',
				'[': '',
				']': '',
				'|': '',
				'{': '',
				'}': '',
				'(': '',
				')': ''
			};
			
			// vars
			var nonWord = /\W/g;
			var mapping = function (c) {
				return (map[c] !== undefined) ? map[c] : c;
			};
			
			// replace
			str = str.replace(nonWord, mapping);
			
			// lowercase
			str = str.toLowerCase();
			
			// return
			return str;	
		},
	

		/**
		 * Helper: Add to placeholder
		 *
		 * @param str type
		 * @param str contents
		 * @param str $element
		 */
		add_to_placeholder: function( type, contents, $element ) {

			$element.find( '.iconic-cffv-placeholder--' + type ).html( contents );

		},

		/**
		 * Helper: Empty placeholder
		 *
		 * @param str type
		 * @param str $element
		 */
		empty_placeholder: function( type, $element ) {

			$element.find( '.iconic-cffv-placeholder--' + type ).html( '' );

		},

		/**
		 * Helper: If this field type has options
		 *
		 * @param str type
		 * @return bool
		 */
		has_options: function( type ) {

			return ( type === "checkboxes" || type === "radio_buttons" || type === "select" ) ? true : false;

		},

		/**
		 * Helper: If this field type has "display as"
		 *
		 * @param str type
		 * @return bool
		 */
		has_display_as: function( type ) {

			return ( type === "checkboxes" ) ? true : false;

		},

		/**
		 * Helper: If this field type has "label position"
		 *
		 * @param str type
		 * @return bool
		 */
		has_label_position: function( type, display_as ) {

			display_as = typeof display_as !== 'undefined' ? display_as : false;

			return ( type === "text" || type === "radio_buttons" || type === "select" || ( type === "checkboxes" && display_as === "comma_separated" ) ) ? true : false;

		},

		/**
		 * Setup help tips
		 *
		 * Moves help tooltips to a better position
		 */
		setup_help_tips: function() {

			$( document.body ).on( 'wc-enhanced-select-init', function() {

				var $help_tips = $( '.iconic-cffv-field-groups .woocommerce-help-tip' );

				if ( $help_tips.length <= 0 ) {
					return;
				}

				$help_tips.each( function() {

					var $form_row = $( this ).closest( '.form-row' ),
						$legend = $form_row.find( 'legend' ),
						$label = $legend.length <= 0 ? $form_row.find( 'label:first' ) : $legend;

					if ( $label.length <= 0 ) {
						return;
					}

					$label.append( $( this ) );

				} );

			} );

		},

		/**
		 * Generate meta key for the field.
		 *
		 * @param Object field_data
		 *
		 * @returns string
		 */
		generate_field_meta_key: function ( field_data ) {
			return 'iconic_cffv_' + iconic_cffv.vars.post_id + '_' + ( field_data.json ? field_data.json.id : field_data.id );
		}

	};

	$( document ).ready( iconic_cffv.on_ready() );

}( jQuery, document ));