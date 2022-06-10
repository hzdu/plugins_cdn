(function ($) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.date = {
		init: function () {
			this.type = this.$el.data( 'happyforms-type' );
			this.spinnerInterval = '';
			this.spinnerIntervalLength = 150;
			this.required = 'undefined' === typeof this.$el.data( 'happyforms-required' ) ? false : true;
			this.$input = $('input, select', this.$el);
			this.$numbers = $('.happyforms-part-date__time-input input', this.$el);
			this.$spinnerUpArrow = $('.happyforms-spinner-arrow--up', this.$el);
			this.$spinnerDownArrow = $('.happyforms-spinner-arrow--down', this.$el);

			this.$numbers.on('keydown', this.onKeyDown.bind(this));
			this.$numbers.on('change', this.onChange.bind(this));
			this.$input.on( 'change', this.triggerChange.bind( this ) );

			this.$spinnerUpArrow.on('mousedown touchstart', this.onSpinnerUpClick.bind(this));
			this.$spinnerUpArrow.on('mouseup mouseleave touchend', this.clearSpinnerInterval.bind(this));
			this.$spinnerDownArrow.on('mousedown touchstart', this.onSpinnerDownClick.bind(this));
			this.$spinnerDownArrow.on('mouseup mouseleave touchend', this.clearSpinnerInterval.bind(this));
		},

		clearSpinnerInterval: function() {
			clearInterval(this.spinnerInterval);
		},

		onSpinnerUpClick: function(e) {
			var self = this;

			this.clearSpinnerInterval();

			var callback = function() {
				var $input = $(e.target).prev('input');
				var step = ($input.attr('step')) ? parseInt($input.attr('step'), 10) : 1;

				var value = self.getIncreasedValue(parseInt($input.val(), 10), step);

				self.setValue($input, value);
			};

			callback();
			this.spinnerInterval = setInterval( callback, this.spinnerIntervalLength );
		},

		onSpinnerDownClick: function (e) {
			var self = this;

			this.clearSpinnerInterval();

			var callback = function() {
				var $input = $(e.target).prevAll('input');
				var step = ($input.attr('step')) ? parseInt($input.attr('step'), 10) : 1;

				var value = self.getDecreasedValue(parseInt($input.val(), 10), step);

				self.setValue($input, value);
			}

			callback();
			this.spinnerInterval = setInterval( callback, this.spinnerIntervalLength );
		},

		setValue: function($input, value) {
			if ( 'undefined' === typeof $input ) {
				return;
			}

			var pattern = $input.attr('pattern');
			var intNewValue = parseInt(value, 10);
			var intMin = parseInt($input.attr('min'), 10);
			var intMax = parseInt($input.attr('max'), 10);
			var step = ($input.attr('step')) ? parseInt( $input.attr('step'), 10 ) : 1;

			if (intNewValue > intMax) {
				intNewValue = intMin;
			}

			if (intNewValue < intMin) {
				if (step) {
					intNewValue = (intMax + 1 - step);
				} else {
					intNewValue = intMax;
				}
			}

			if (intNewValue !== 0 && intNewValue % step !== 0) {
				intNewValue = step;
			}

			var validatedValue = this.validateNumber(intNewValue, pattern);

			if (validatedValue) {
				$input.val(validatedValue);
			}

			this.$el.trigger( 'happyforms-change' );
		},

		isFilled: function() {
			var filledInputs = this.$input.filter( function() {
				return '' !== $( this ).val();
			} );

			return filledInputs.length === this.$input.length;
		},

		validateNumber: function (number, pattern) {
			if (isNaN(number) || !number) {
				return '00';
			}

			if (number.toString().match(pattern)) {
				return number.toString();
			} else {
				var leadingZeroValue = '0' + number;

				if (2 === leadingZeroValue.length && leadingZeroValue.match(pattern)) {
					return leadingZeroValue;
				}
			}
		},

		getIncreasedValue: function(value, step) {
			if ( 'undefined' === typeof value || !step ) {
				return;
			}

			var newValue = (value + step).toString();

			return newValue;
		},

		getDecreasedValue: function(value, step) {
			if ( 'undefined' === typeof value || !step ) {
				return;
			}

			var newValue = (value - step).toString();

			return newValue;
		},

		onKeyDown: function(e) {
			var $input = $(e.target);
			var intValue = (parseInt($input.val(), 10)) ? parseInt($input.val(), 10) : parseInt($input.attr('min'), 10);
			var newValue = '0';
			var max = $input.attr('max');
			var min = $input.attr('min');
			var step = parseInt($input.attr('step'), 10) ? parseInt($input.attr('step'), 10) : 1;

			if ( isNaN(intValue) && isNaN(parseInt(e.key, 10)) ) {
				return false;
			}

			if ( e.keyCode !== 38 && e.keyCode !== 40 ) {
				return;
			}

			if ( 38 === e.keyCode ) {
				newValue = this.getIncreasedValue(intValue, step);

				if ('undefined' === typeof newValue) {
					newValue = min;
				}
			}

			if (40 === e.keyCode) {
				newValue = this.getDecreasedValue(intValue, step);

				if ('undefined' === typeof newValue) {
					newValue = max;
				}
			}

			this.setValue($input, newValue);
		},

		onChange: function (e) {
			var $input = $(e.target);
			var value = $input.val();

			this.setValue($input, value);
		},

		serialize: function() {
			var serialized = $( 'input, select', this.$el ).map( function( i, input ) {
				var $input = $( input );

				var value = $input.val();
				if ( null == value ) {
					value = '';
				}

				return {
					name: $input.attr( 'name' ),
					value: value,
				}
			} ).toArray();

			return serialized;
		},

		numberInputOnly: function( e ) {
			$input = $( e.target );
			value = $input.val();
			$input.val(  value.replace( /[^0-9]/gu, '' ) );
		},

		lettersInputOnly: function( e ) {
			$input = $( e.target );
			value = $input.val();
			$input.val( value.replace( /[^\p{L}]/gu, '' ) );
		},
	};

})(jQuery);
