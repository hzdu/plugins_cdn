( function( $ ) {
	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.scale = {
		init: function() {
			this.type = this.$el.data( 'happyforms-type' );

			if ( document.readyState != 'loading' ) {
				if ( typeof multirange !== undefined ) {
					multirange.init();
				}
			}

			if ( $( 'input', this.$el ).length > 1 ) {
				this.initRangeSlider();
			} else {
				this.initSingleSlider();
			}
		},

		initSingleSlider: function() {
			this.$input = $( 'input', this.$el );
			this.$output = $( 'output', this.$el );

			this.$input.on( 'input change', this.refreshSingleOutput.bind(this) );
			this.$input.on( 'input change', this.updateTrackerColor.bind(this) );

			this.$input.trigger('input');
		},

		initRangeSlider: function() {
			this.$input = $( 'input:first', this.$el );
			this.$output = $( 'output:first', this.$el );
			this.$ghostInput = $( 'input:last', this.$el );
			this.$ghostOutput = $( 'output:last', this.$el );

			this.$ghostInput.on( 'input change', this.refreshMultiOutput.bind(this) );
			this.$input.on( 'input change', this.refreshMultiOutput.bind(this) );

			this.$input.trigger( 'input' );
		},

		refreshSingleOutput: function( e ) {
			var inputVal = this.$input.val();
			var outputPosition = this.getOutputPosition();

			outputPosition = `calc(${outputPosition}% + (${8 - outputPosition * 0.15}px))`;

			this.$output.css( 'left', outputPosition ).text( inputVal );
		},

		refreshMultiOutput: function( e ) {
			var inputVal = this.$input.val().split(',');
			var outputPosition = this.getOutputPosition();

			var originalPosition = `calc(${outputPosition['original']}% + (${8 - outputPosition['original'] * 0.15}px))`;
			var ghostPosition    = `calc(${outputPosition['ghost']}% + (${8 - outputPosition['ghost'] * 0.15}px))`;

			this.$output.css( 'left', originalPosition ).text( inputVal[0] );
			this.$ghostOutput.css( 'left', ghostPosition ).text( inputVal[1] );
		},

		getOutputPosition: function() {
			var data;
			var value = this.$input.val();
			var min   = this.$input.attr( 'min' ) ? this.$input.attr( 'min' ) : 0;
			var max   = this.$input.attr( 'max' ) ? this.$input.attr( 'max' ) : 100;

			if ( -1 !== value.indexOf( ',' ) ) {
				value = value.split( ',' );

				var originalOutputPosition = Number( ( ( value[0] - min ) * 100 ) / ( max - min ) );
				var ghostOutputPosition    = Number( ( ( value[1] - min ) * 100 ) / ( max - min ) );

				data = {
					'original': originalOutputPosition,
					'ghost': ghostOutputPosition
				};
			} else {
				data = Number( ( ( value - min ) * 100 ) / ( max - min ) );
			}

			return data;
		},

		updateTrackerColor: function() {
			var value = this.$input.val();
			var min = this.$input.attr( 'min' ) ? this.$input.attr( 'min' ) : 0;
			var max = this.$input.attr( 'max' ) ? this.$input.attr( 'max' ) : 100;

			var percentValue = 100 * ( ( value - min ) / ( max - min ) );

			this.$input.css( {
				'background': 'linear-gradient(to right, var(--happyforms-color-part-value) ' + percentValue + '%, var(--happyforms-color-part-border) ' + percentValue + '%, var(--happyforms-color-part-border) 100%)'
			} );
		}
	};
} )( jQuery );
