( function( $, data ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.payments = {
		init: function( options ) {
			this.type = this.$el.data( 'happyforms-type' );
			this.$input = $( 'input', this.$el );
			this.$price = $( '[data-subpart=price]', this.$el );

			this.$userPriceInput = $( '[data-subpart=user_price] input', this.$el );
			this.$priceInput = $( '[data-subpart=price] input', this.$el );
			this.$paymentMethod = $( '[data-subpart=payment_method]', this.$el );
			this.price = Number( this.$priceInput.val() );
			this.paymentMethod = $( 'input:checked', this.$paymentMethod ).val();

			var paymentMethod = '';

			if ( this.$paymentMethod.length ) {
				paymentMethod = $( 'input:checked', this.$paymentMethod ).val();
			} else {
				paymentMethod = this.getFirstEnabledService();
			}

			this.setPaymentMethod( paymentMethod );
			this.setPrice();

			this.$input.on( 'keyup', this.triggerChange.bind( this ) );
			this.$input.on( 'change', this.triggerChange.bind( this ) );

			this.$price.on( 'condition-update', this.onPriceConditionUpdate.bind( this ) );
			$( 'input', this.$paymentMethod ).on( 'change', this.onPaymentMethodChange.bind( this ) );
			this.$userPriceInput.on( 'change', this.onUserPriceChange.bind( this ) );

			options.form.trigger( 'payments-ready' );
		},

		getFormattedPrice: function( price ) {
			if ( 'undefined' === typeof price ) {
				price = this.price;
			}

			var language = navigator.language ? navigator.language : 'en-US';
			var formattedPrice = new Intl.NumberFormat( language, { style: 'decimal', minimumFractionDigits: 2 } ).format( price );

			return formattedPrice;
		},

		setPrice: function( price ) {
			if ( price ) {
				this.price = Number( price );
			}

			var formattedPrice = this.getFormattedPrice();

			$( 'strong', this.$price ).text( formattedPrice );
			$( 'input', this.$price ).val( this.price );

			this.$price.trigger( 'price-updated', data );
		},

		onPriceConditionUpdate: function( e, data ) {
			var $input = $( 'input', this.$price );
			var newPrice = $input.attr( 'data-default' );

			if ( 'undefined' !== typeof data.value ) {
				newPrice = data.value;
			}

			this.setPrice( newPrice );
		},

		onUserPriceChange: function( e ) {
			var value = $( e.target ).val();

			if ( ! Number ( value ) ) {
				return;
			}

			this.setPrice( value );
		},

		onPaymentMethodChange: function( e ) {
			var $input = $( e.target );

			this.setPaymentMethod( $input.val() );
			$( '.happyforms-part-error-notice__realtime', this.$el ).hide();
		},

		setPaymentMethod: function( paymentMethod ) {
			this.paymentMethod = paymentMethod;

			this.updateServices();
		},

		getFirstEnabledService: function() {
			for ( var property in data ) {
				if ( '1' == data[property] ) {
					return property;
				}
			}
		},

		updateServices: function() {
			$( '.happyforms-payments-service', this.$el ).removeClass( 'show' );
			$( '.happyforms-payments-service--' + this.paymentMethod, this.$el ).addClass( 'show' );
		}
	};

} )( jQuery, _happyFormsSettings.payments );
