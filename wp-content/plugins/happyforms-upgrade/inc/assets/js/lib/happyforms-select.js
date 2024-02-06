(function ($) {
	'use strict';

	var HappyFormsSelect = function( el, options ) {
		this.el = el;
		this.$el = $( this.el );

		this.required = options.required;
		this.keepFocus = false;
		this.$input = options.$input;
		this.$select = options.$select;
		this.$placeholder = $( 'li.happyforms-custom-select-dropdown__placeholder', this.$select );
		this.$noResults = $( 'li.happyforms-custom-select-dropdown__not-found', this.$select );
		this.searchable = options.searchable;
		this.$clicked = null;

		var autocompleteDefaults = {
			url: '',
			apiKey: '',
			source: '',
			trigger: '',
			minLength: 3,
			delay: 0,
			partial: false
		};

		this.autocompleteOptions = $.extend( {}, autocompleteDefaults, options.autocompleteOptions );

		this.defaultValue = '';
		this.defaultLabel = '';
		this.placeholderText = this.$placeholder.text();
		this.autocompleteTimeout = null;

		this.init();
	}

	HappyFormsSelect.prototype.init = function() {
		this.$el.prop( 'readonly', true );

		if ( this.searchable && 'false' !== this.searchable ) {
			this.$el.prop( 'readonly', false );
		}

		this.defaultValue = this.$input.val();
		this.defaultLabel = this.$el.val();

		if ( '' === this.defaultLabel && '' === this.defaultValue && this.$placeholder.length ) {
			this.defaultLabel = this.placeholderText;
		}

		this.$el.on( 'keyup keypress', this.handleKeyUp.bind( this ) );
		this.$el.on( 'keydown', this.handleKeyDown.bind( this ) );
		this.$el.on( 'focus', this.handleFocus.bind( this ) );
		this.$el.on( 'blur', this.handleBlur.bind( this ) );
		this.$select.on( 'click', 'li', this.onItemSelect.bind( this ) );
		this.$el.on( 'change', this.onChange.bind( this ) );
		$( window ).on( 'click', this.onOutsideClick.bind( this ) );

		if ( 'autocomplete' !== this.searchable ) {
			this.$el.on( 'click', this.handleClick.bind( this ) );
			this.$el.parent().on( 'click', this.handleClick.bind( this ) );
		}

	    $( document ).on( 'mousedown', this.mouseClickDown.bind( this ) );

	    this.$el.on( 'happyFormsSelect.submitted', this.navigateDropdown.bind( this ) );
	}

	HappyFormsSelect.prototype.mouseClickDown = function( e ) {
		var parent = $( e.target ).parents( '.happyforms-form');

		if ( parent.length ) {
			this.$clicked = $(e.target);
		}
	}

	HappyFormsSelect.prototype.handleClick = function( e ) {
		e.stopPropagation();

		this.$el.trigger( 'focus' );
		this.toggleDropdown();
	}

	HappyFormsSelect.prototype.handleFocus = function( e ) {
		this.keepFocus = true;
		var searchVal = this.$el.val();

		this.$el.val('');

		if ( 'autocomplete' !== this.searchable ) {
			this.hideAllInstances();
		}

		this.$el.val( searchVal );
	}

	HappyFormsSelect.prototype.handleBlur = function( e ) {
		var $parent = this.$clicked.parents( '.happyforms-custom-select-dropdown' );

		if( ! $parent.length ){
			this.keepFocus = false;
			window.setTimeout( this.hideDropdown.bind( this ), 200 );
		}
	}

	HappyFormsSelect.prototype.hideAllInstances = function() {
		$( '.happyforms-custom-select-dropdown' ).not( this.$select ).hide();
	}

	HappyFormsSelect.prototype.toggleDropdown = function() {
		if ( ! this.$select.is( ':visible' ) ) {
			this.hideAllInstances();

			this.$input.trigger( 'focus' );
			this.$select.show();

			this.keepFocus = true;
		} else {
			this.hideDropdown();
		}
	}

	HappyFormsSelect.prototype.onOutsideClick = function( e ) {
		if ( ! this.el.contains(e.target).length && this.$select.is( ':visible' ) ) {
			this.hideDropdown();
		}
	}

	HappyFormsSelect.prototype.hideDropdown = function() {
		if ( ! this.keepFocus ) {
			this.$select.hide();

			if ( 'true' === this.searchable ) {
				var searchText = this.$el.val();

				if( '' === searchText && ! this.required ) {
					this.$el.val( '' );
					this.$input.val( '' );
				} else if( '' !== searchText && '' === this.defaultValue ) {
					this.$el.val( '' );
				} else if ( '' !== this.defaultValue && this.defaultLabel !== searchText ) {
					this.$el.val( this.defaultLabel );
				}

				$( 'li', this.$select ).removeClass( 'active' );
				$( 'li.happyforms-dropdown-item', this.$select ).show();
				this.$noResults.hide();
			}
		}
	}

	HappyFormsSelect.prototype.onItemSelect = function( e ) {
		e.stopPropagation();

		var $li = $( e.currentTarget );

		if ( 'undefined' !== typeof $li.attr( 'data-select-disabled' ) ) {
			return;
		}

		if ( 'undefined' !== typeof $li.attr( 'data-value' ) ) {
			this.setValue( $li.data('value').toString() );
		}
		this.keepFocus = false;
		this.hideDropdown();
	}

	HappyFormsSelect.prototype.handleKeyDown = function( e ) {
		switch ( e.keyCode ) {
			case 38:
			case 40:
				e.preventDefault();
				break;
			default:
				break;
		}
	}

	HappyFormsSelect.prototype.navigateDropdown = function ( e, windowEvent ) {
		this.handleKeyUp( windowEvent );
	}

	HappyFormsSelect.prototype.handleKeyUp = function( e ) {
		switch ( e.keyCode ) {
			case 27:
			this.keepFocus = false;
				this.hideDropdown();
				break;
			case 40:
				if ( ! this.$select.is( ':visible' ) ) {
					this.toggleDropdown();
				}

				this.navigateOptions( 'down' );
				break;
			case 38:
				if ( ! this.$select.is( ':visible' ) ) {
					this.toggleDropdown();
				}

				this.navigateOptions( 'up' );
				break;
			case 13:
				e.preventDefault();

				var $focusedItem = $( 'li.active', this.$select );

				if ( $focusedItem.length ) {
					this.setValue( $focusedItem.data('value').toString() );
				}

				this.handleBlur();
				break;
			case 9:
			case 16:
				e.preventDefault();

				break;
			default:
				if ('autocomplete' === this.searchable) {
					var trigger = this.autocompleteOptions.trigger;

					if ( trigger.length && trigger !== e.key ) {
						break;
					}

					this.getSuggestions();
				} else if ( "true" === this.searchable ) {
					this.searchOptions();
				} else {
					if( 'keyup' === e.type ){
						this.gotoOption( e );
					}
				}
				break;
		}
	}

	HappyFormsSelect.prototype.onChange = function( e ) {
		var value = $( e.target ).val();

		if ( 'autocomplete' === this.searchable ) {
			this.$el.val( value );
			this.$input.val( value );
		}
	}

	HappyFormsSelect.prototype.getSuggestions = function() {
		var self = this;
		var value = this.getValue();

		if ( ! value.length ) {
			this.hideDropdown();
			this.clearOptions();

			return;
		}

		if ( value.length < this.autocompleteOptions.minLength ) {
			return;
		}

		var trigger = this.autocompleteOptions.trigger;
		var delay = this.autocompleteOptions.delay;

		if ( trigger.length ) {
			if ( -1 === value.indexOf( trigger ) ) {
				this.hideDropdown();
				this.clearOptions();

				return;
			}

			delay = 0;
		}

		var source = this.autocompleteOptions.source;
		var partial = this.autocompleteOptions.partial;
		var autocompleteData = [];

		if ( 'string' === typeof source ) {
			if ( ! this.autocompleteTimeout ) {
				clearTimeout( this.autocompleteTimeout );

				this.autocompleteTimeout = setTimeout( function() {
					self.autocompleteTimeout = null;

					$.get( self.autocompleteOptions.url, {
						action: source,
						key: self.autocompleteOptions.apiKey,
						term: self.getValue()
					}, function( data ) {
						autocompleteData = data;

						self.clearOptions();
						self.handleAutocomplete( autocompleteData, partial, trigger );

						return;
					} );
				}, delay );
			}
		}

		if ( 'object' === typeof source ) {
			autocompleteData = source;

			if ( ! this.autocompleteTimeout ) {
				clearTimeout( this.autocompleteTimeout );

				this.autocompleteTimeout = setTimeout( function() {
					self.autocompleteTimeout = null;

					if ( ! partial ) {
						autocompleteData = $.grep( autocompleteData, function( n, i ) {
							return ( -1 !== n.toLowerCase().indexOf( self.$el.val().toLowerCase() ) );
						} );
					}

					self.clearOptions();
					self.handleAutocomplete( autocompleteData, partial, trigger );
				}, delay );
			}
		}
	}

	HappyFormsSelect.prototype.handleAutocomplete = function( data, partial, trigger ) {
		if ( ! data.length ) {
			return;
		}

		var suggestions = [];

		if ( partial ) {
			var value = this.getValue().split( trigger );
			var baseValue = value[0];

			for ( var i = 0; i < data.length; i++ ) {
				suggestions.push( baseValue + trigger + data[i] );
			}
		} else {
			suggestions = data;
		}

		var liTemplate = '<li class="happyforms-dropdown-item happyforms-custom-select-dropdown__item" data-value="%value%" data-label="">%value%</li>';

		for ( var i = 0; i < suggestions.length; i++ ) {
			this.$select.append( liTemplate.replace( /%value%/g, suggestions[i] ) );
		}

		this.$select.show();
		this.bindAutocomplete();
	}

	HappyFormsSelect.prototype.bindAutocomplete = function() {
		this.$el.on( 'click.autocomplete', this.handleAutocompleteInputClick.bind(this) );
		this.$el.on( 'keyup.autocomplete', this.handleAutocompleteInputKeyUp.bind(this) );
	}

	HappyFormsSelect.prototype.handleAutocompleteInputClick = function( e ) {
		e.stopPropagation();

		this.toggleDropdown();
	}

	HappyFormsSelect.prototype.handleAutocompleteInputKeyUp = function( e ) {
		if ( 13 === e.keyCode ) {
			return;
		}

		this.searchOptions();
	}

	HappyFormsSelect.prototype.searchOptions = function() {
		var self = this;
		var value = this.$el.val();
		var $allItems = $( 'li.happyforms-dropdown-item', this.$select );
		var foundItems = 0;

		self.$noResults.hide();

		if ( value ) {
			$allItems.hide();

			$allItems.each( function( index, li ) {
				var $li = $( li );
				var liValue = 'undefined' === typeof $li.data( 'value' ) ? '' : $li.data( 'value' );
				var labelValue = 'undefined' === typeof $li.data( 'label' ) ? '' : $li.data( 'label' );
				if ( 'string' == typeof labelValue ) {
					var liLabel = ( labelValue.length ) ? labelValue.toLowerCase() : '';
				} else {
					var liLabel = labelValue.toString();
				}

				liValue = liValue.toString().toLowerCase();
				value = value.toString().toLowerCase();

				if ( -1 !== liLabel.indexOf( value ) ) {
					$li.show();
					foundItems = foundItems + 1;
				}

				if ( foundItems > 0 ) {
					self.$noResults.hide();
					self.$select.show();
				} else {
					self.$noResults.show();
				}
			} );
		} else {
			$allItems.show();
		}
	}

	HappyFormsSelect.prototype.gotoOption = function( e ) {
		var inputKey = String.fromCharCode( e.keyCode );

		var filteredOptions = $( 'li:not( [data-value=""] )', this.$select ).filter( function() {
			var text = this.textContent.toLowerCase();
			return text.charAt(0) === inputKey.toLowerCase();
		});

		var $currentItem = $( 'li.active', this.$select );
		var setActiveNext = false;
		var filteredLength = filteredOptions.length - 1;

		$.each( filteredOptions, function( index, li ) {
			if( setActiveNext ){
				$( li ).addClass( 'active' );
				return false;
			}

			if( filteredLength != index && $( li ).hasClass( 'active' ) ) {
				setActiveNext = true;
			}
		} );

		$currentItem.removeClass( 'active' );

		if( ! setActiveNext ) {
			$( filteredOptions[0] ).addClass( 'active' );
		}
	}

	HappyFormsSelect.prototype.navigateOptions = function( direction ) {
		if ( ! direction ) {
			return;
		}

		var $currentItem = $( 'li.active', this.$select );

		if ( ! $currentItem.length ) {
			$currentItem = $( 'li:first', this.$select );
		}

		var $prevItem = $currentItem.prev( ':not( [data-value=""] )' );
		var $nextItem = $currentItem.nextAll(':visible').first();

		if ( 'down' === direction ) {
			if ( $nextItem.length ) {
				this.$select.show();
				$currentItem.removeClass( 'active' );
				$nextItem.trigger( 'focus' ).addClass( 'active' );
			}
		}

		if ( 'up' === direction && $prevItem.length ) {
			this.$select.show();
			$currentItem.removeClass( 'active' );
			$prevItem.trigger( 'focus' ).addClass( 'active' );
		}

		$( 'li.active', this.$select )[0].scrollIntoView( { behavior: 'smooth', block: 'nearest', inline: 'nearest' } );
	}

	HappyFormsSelect.prototype.clearOptions = function() {
		var $allItems = $( 'li.happyforms-dropdown-item', this.$select );

		$allItems.remove();
	}

	HappyFormsSelect.prototype.setValue = function( value ) {
		if ( 'undefined' !== typeof value ) {
			var $li = $( 'li[data-value="' + value + '"]', this.$select );

			if ( $li.length ) {
				if ( $li.data('label') ) {
					this.$el.val( $li.data( 'label' ) );
				} else {
					this.$el.val( $li.data( 'value' ) );
				}

				this.$input.val( $li.data( 'value' ) );
				this.setDefaults( $li.data( 'value' ), $li.data( 'label' ) );
			} else {
				this.$el.val( this.defaultLabel );
				this.$input.val( this.defaultValue );
			}
		}

		this.hideDropdown();
		this.$input.trigger( 'blur' );
		this.$input.trigger( 'happyforms-change' );
	}

	HappyFormsSelect.prototype.getValue = function() {
		return this.$el.val();
	}

	HappyFormsSelect.prototype.setDefaults = function( value, label ) {
			this.defaultValue = value;
			this.defaultLabel = label;
	}

	$.fn.happyFormsSelect = function( method ) {
		this.each(function() {
			if ( 'object' === typeof method ) {
				$.data( this, 'HappyFormSelect', new HappyFormsSelect( this, method ) );
			} else {
				var methods = $.data( this, 'HappyFormSelect' );

				if ( methods && methods[method] ) {
					return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
				}
			}
		});
	}
} )( jQuery );
