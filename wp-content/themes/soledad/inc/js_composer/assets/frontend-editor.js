(function ( $ ) {
	window.InlineShortcodeView_penci_container = window.InlineShortcodeView.extend( {
		column_tag: 'vc_column',
		events: {
			'mouseenter': 'removeHoldActive'
		},
		layout: 1,
		addControls: function () {
			this.$controls = $( '<div class="no-controls"></div>' );
			this.$controls.appendTo( this.$el );

			return this;
		},
		render: function () {
			var $content = this.content();
			if ( $content && $content.hasClass( 'vc_row-has-fill' ) ) {
				$content.removeClass( 'vc_row-has-fill' );
				this.$el.addClass( 'vc_row-has-fill' );
			}
			window.InlineShortcodeView_vc_row.__super__.render.call( this );

			return this;
		},
		removeHoldActive: function () {
			vc.unsetHoldActive();
		},
		addColumn: function () {
			vc.builder.create( {
				shortcode: this.column_tag,
				parent_id: this.model.get( 'id' )
			} ).render();
		},
		addElement: function ( e ) {
			if ( e && e.preventDefault ) {
				e.preventDefault();
			}
			this.addColumn();
		},
		changeLayout: function ( e ) {
			if ( e && e.preventDefault ) {
				e.preventDefault();
			}
			this.layoutEditor().render( this.model ).show();
		},
		layoutEditor: function () {
			if ( _.isUndefined( vc.row_layout_editor ) ) {
				vc.row_layout_editor = new vc.RowLayoutUIPanelFrontendEditor( { el: $( '#vc_ui-panel-row-layout' ) } );
			}

			return vc.row_layout_editor;
		},
		convertToWidthsArray: function ( string ) {
			return _.map( string.split( /_/ ), function ( c ) {
				var w = c.split( '' );
				w.splice( Math.floor( c.length / 2 ), 0, '/' );
				return w.join( '' );
			} );
		},
		changed: function () {
			window.InlineShortcodeView_vc_row.__super__.changed.call( this );
			this.addLayoutClass();
		},
		content: function () {
			if ( false === this.$content ) {
				this.$content = this.$el.find( '.vc_container-anchor:first' ).parent();
			}
			this.$el.find( '.vc_container-anchor:first' ).remove();

			return this.$content;
		},
		addLayoutClass: function () {
			this.$el.removeClass( 'vc_layout_' + this.layout );
			this.layout = _.reject( vc.shortcodes.where( { parent_id: this.model.get( 'id' ) } ), function ( model ) {
				return model.get( 'deleted' );
			} ).length;
			this.$el.addClass( 'vc_layout_' + this.layout );
		},
		convertRowColumns: function ( layout, builder ) {
			if ( !layout ) {
				return false;
			}
			var column_params, new_model, columns_contents, columns;
			columns_contents = [];
			columns = this.convertToWidthsArray( layout );
			vc.layout_change_shortcodes = [];
			vc.layout_old_columns = vc.shortcodes.where( { parent_id: this.model.get( 'id' ) } );
			_.each( vc.layout_old_columns, function ( column ) {
				column.set( 'deleted', true );
				columns_contents.push( {
					shortcodes: vc.shortcodes.where( { parent_id: column.get( 'id' ) } ),
					params: column.get( 'params' )
				} );
			} );
			_.each( columns, function ( column ) {
				var prev_settings = columns_contents.shift();
				if ( _.isObject( prev_settings ) ) {
					new_model = builder.create( {
						shortcode: this.column_tag,
						parent_id: this.model.get( 'id' ),
						order: vc.shortcodes.nextOrder(),
						params: _.extend( {}, prev_settings.params, { width: column } )
					} ).last();
					_.each( prev_settings.shortcodes, function ( shortcode ) {
						shortcode.save( {
								parent_id: new_model.get( 'id' ),
								order: vc.shortcodes.nextOrder()
							},
							{ silent: true } );
						vc.layout_change_shortcodes.push( shortcode );
					}, this );
				} else {
					column_params = { width: column };

					new_model = builder.create( {
						shortcode: this.column_tag,
						parent_id: this.model.get( 'id' ),
						order: vc.shortcodes.nextOrder(),
						params: column_params
					} ).last();
				}
			}, this );
			_.each( columns_contents, function ( column ) {
				_.each( column.shortcodes, function ( shortcode ) {
					shortcode.save( {
							parent_id: new_model.get( 'id' ),
							order: vc.shortcodes.nextOrder()
						},
						{ silent: true } );
					vc.layout_change_shortcodes.push( shortcode );
					if ( shortcode.view.rowsColumnsConverted ) {
						shortcode.view.rowsColumnsConverted();
					}
				}, this );
			}, this );
			builder.render( function () {
				_.each( vc.layout_change_shortcodes, function ( shortcode ) {
					shortcode.trigger( 'change:parent_id' );
					if ( shortcode.view.rowsColumnsConverted ) {
						shortcode.view.rowsColumnsConverted();
					}
				} );
				_.each( vc.layout_old_columns, function ( column ) {
					column.destroy();
				} );
				vc.layout_old_columns = [];
				vc.layout_change_shortcodes = [];
			} );

			return columns;
		},
		allowAddControl: function () {
			return 'edit' !== vc_user_access().getState( 'shortcodes' );
		},
		allowAddControlOnEmpty: function () {
			return 'edit' !== vc_user_access().getState( 'shortcodes' );
		}
	} );

	window.InlineShortcodeView_penci_column = window.InlineShortcodeViewContainerWithParent.extend( {
		controls_selector: '#vc_controls-template-vc_column',
		resizeDomainName: 'columnSize',
		_x: 0,
		css_width: 12,
		prepend: false,
		initialize: function ( params ) {
			window.InlineShortcodeView_vc_column.__super__.initialize.call( this, params );
			_.bindAll( this, 'startChangeSize', 'stopChangeSize', 'resize' );
		},
		render: function () {
			var width;
			window.InlineShortcodeView_vc_column.__super__.render.call( this );
			this.prepend = false;
			// Here goes width logic
			$( '<div class="vc_resize-bar"></div>' )
				.appendTo( this.$el )
				.mousedown( this.startChangeSize );
			this.setColumnClasses();
			this.customCssClassReplace();
			return this;
		},
		destroy: function ( e ) {
			var parent_id = this.model.get( 'parent_id' );
			window.InlineShortcodeView_vc_column.__super__.destroy.call( this, e );
			if ( !vc.shortcodes.where( { parent_id: parent_id } ).length ) {
				vc.shortcodes.get( parent_id ).destroy();
			}
		},
		customCssClassReplace: function () {
			var css_classes, css_regex, class_match;

			css_classes = this.$el.find( '.wpb_column' ).attr( 'class' );
			css_regex = /.*(vc_custom_\d+).*/;
			class_match = css_classes && css_classes.match ? css_classes.match( css_regex ) : false;
			if ( class_match && class_match[ 1 ] ) {
				this.$el.addClass( class_match[ 1 ] );
				this.$el.find( '.wpb_column' ).attr( 'class', css_classes.replace( class_match[ 1 ], '' ).trim() );
			}
		},
		setColumnClasses: function () {
			var offset, width, $content;
			offset = this.getParam( 'offset' ) || '';
			width = this.getParam( 'width' ) || '1/1';
			$content = this.$el.find( '> .wpb_column' );
			this.css_class_width = this.convertSize( width );
			if ( this.css_class_width !== width ) {
				this.css_class_width = this.css_class_width.replace( /[^\d]/g, '' );
			}
			$content.removeClass( 'vc_col-sm-' + this.css_class_width );
			if ( !offset.match( /vc_col\-sm\-\d+/ ) ) {
				this.$el.addClass( 'vc_col-sm-' + this.css_class_width );
			}
			if ( vc.responsive_disabled ) {
				offset = offset.replace( /vc_col\-(lg|md|xs)[^\s]*/g, '' );
			}
			if ( !_.isEmpty( offset ) ) {
				$content.removeClass( offset );
				this.$el.addClass( offset );
			}
		},
		startChangeSize: function ( e ) {
			var width = this.getParam( width ) || 12;
			this._grid_step = this.parent_view.$el.width() / width;
			vc.frame_window.jQuery( 'body' ).addClass( 'vc_column-dragging' ).disableSelection();
			this._x = parseInt( e.pageX, 10 );
			vc.$page.bind( 'mousemove.' + this.resizeDomainName, this.resize );
			$( vc.frame_window.document ).mouseup( this.stopChangeSize );
		},
		stopChangeSize: function () {
			this._x = 0;
			vc.frame_window.jQuery( 'body' ).removeClass( 'vc_column-dragging' ).enableSelection();
			vc.$page.unbind( 'mousemove.' + this.resizeDomainName );
		},
		resize: function ( e ) {
			var width, old_width, diff, params = this.model.get( 'params' );
			diff = e.pageX - this._x;
			if ( Math.abs( diff ) < this._grid_step ) {
				return;
			}
			this._x = parseInt( e.pageX, 10 );
			old_width = '' + this.css_class_width;
			if ( 0 < diff ) {
				this.css_class_width += 1;
			} else if ( 0 > diff ) {
				this.css_class_width -= 1;
			}
			if ( 12 < this.css_class_width ) {
				this.css_class_width = 12;
			}
			if ( 1 > this.css_class_width ) {
				this.css_class_width = 1;
			}
			params.width = vc.getColumnSize( this.css_class_width );
			this.model.save( { params: params }, { silent: true } );
			this.$el.removeClass( 'vc_col-sm-' + old_width ).addClass( 'vc_col-sm-' + this.css_class_width );
		},
		convertSize: function ( width ) {
			var prefix, numbers, range, num, dev;
			prefix = 'vc_col-sm-';
			numbers = width ? width.split( '/' ) : [
				1,
				1
			];
			range = _.range( 1, 13 );
			num = !_.isUndefined( numbers[ 0 ] ) && 0 <= _.indexOf( range,
				parseInt( numbers[ 0 ], 10 ) ) ? parseInt( numbers[ 0 ], 10 ) : false;
			dev = !_.isUndefined( numbers[ 1 ] ) && 0 <= _.indexOf( range,
				parseInt( numbers[ 1 ], 10 ) ) ? parseInt( numbers[ 1 ], 10 ) : false;
			// Custom fix for 5 columns grid
			if ( '5' === numbers[ 1 ] ) {
				return width;
			}
			if ( false !== num && false !== dev ) {
				return prefix + (12 * num / dev);
			}
			return prefix + '12';
		},
		allowAddControl: function () {
			return vc_user_access().shortcodeAll( 'vc_column' );
		}
	} );
})( window.jQuery );

jQuery( function ( $ ) {
	'use strict';
	$( document ).on( 'click', '.penci-image-select', function () {
		var $this = $( this );

		$this.parent().siblings( '.wpb_vc_param_value' ).attr("value", $this.data( 'value' ) ).change();
		$this.addClass( 'penci-image-select--active' )
		     .siblings().removeClass( 'penci-image-select--active' );
	} );

	$( document ).on( 'change', '.penci-number-input, .penci-number-suffix', function () {
		var $number = $( this ).parent(),
			input = $number.find( '.penci-number-input' ).val(),
			unit = $number.find( '.penci-number-suffix' ).val();

		$number.find( '.wpb_vc_param_value' ).val( input + unit );
	} );
} );

(function ( $ ) {
	window.InlineShortcodeView_penci_sliders = window.InlineShortcodeView.extend( {
		render: function () {
			var model_id = this.model.get( 'id' );
			return window.InlineShortcodeView_penci_sliders.__super__.render.call(this),
				vc.frame_window.vc_iframe.addActivity(function() {
					this.vc_iframe.penciSliders(model_id);
				}),
				this
		}
	} );

	vc.atts.penci_google_fonts = {
		parse: function(param) {
			var string_pieces, $field = this.content().find(".wpb_vc_param_value[name=" + param.param_name + "]"),
				$block = $field.parent(),
				options = {};
			return options.font_family = $block.find(".vc_google_fonts_form_field-font_family-select > option:selected").val(), options.font_style = $block.find(".vc_google_fonts_form_field-font_style-select > option:selected").val(), string_pieces = _.map(options, function(value, key) {
				if (_.isString(value) && 0 < value.length) return key + ":" + encodeURIComponent(value)
			}), $.grep(string_pieces, function(value) {
				return _.isString(value) && 0 < value.length
			}).join("|")
		},
		init: function(param, $field) {

		}
	};
})( window.jQuery );