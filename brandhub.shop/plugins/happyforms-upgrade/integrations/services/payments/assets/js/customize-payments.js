(function ($, _, Backbone, api, paymentsSettings, settings ) {

	happyForms.classes.models.parts.payments = happyForms.classes.models.Part.extend( {
		defaults: function () {
			return _.extend(
				{},
				settings.formParts.payments.defaults,
				_.result( happyForms.classes.models.Part.prototype, 'defaults' ),
			);
		},
	} );

	happyForms.classes.views.parts.payments = happyForms.classes.views.Part.extend( {
		template: '#happyforms-customize-payments-template',
		editor: null,

		events: _.extend( {}, happyForms.classes.views.Part.prototype.events, {
			'change [data-bind=user_price_step]': 'onPaymentStepIntervalChange',
		} ),

		initialize: function() {
			happyForms.classes.views.Part.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:show_user_price_field', this.onUserPriceFieldChange );

			this.listenTo( this.model, 'change:price_label', this.onPriceLabelChange );
			this.listenTo( this.model, 'change:price', this.onPriceChange );
			this.listenTo( this.model, 'change:user_price_placeholder', this.onUserPricePlaceholderChange );
			this.listenTo( this.model, 'change:currency', this.onCurrencyChange );
		},

		ready: function () {
			happyForms.classes.views.Part.prototype.ready.apply(this, arguments);
		},

		onUserPriceFieldChange: function( model, value ) {
			var $labelField = $( '[data-trigger=show_user_price_field]', this.$el );

			if ( 1 == value ) {
				$( '.price-field', this.$el ).hide();
				$( '[data-logic-id=price]', this.$el ).hide();

				$labelField.show();
			} else {
				$( '.price-field', this.$el ).show();
				$( '[data-logic-id=price]', this.$el ).show();

				$labelField.hide();
			}

			this.refreshPart();
		},

		onPriceChange: function() {
			var data = {
				id: this.model.get( 'id' ),
				callback: 'onPaymentsPriceChange'
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onPriceLabelChange: function() {
			var data = {
				id: this.model.get( 'id' ),
				callback: 'onPaymentsPriceLabelChange',
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onUserPricePlaceholderChange: function() {
			var data = {
				id: this.model.get( 'id' ),
				callback: 'onPaymentsUserPricePlaceholderChange'
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onCurrencyChange: function( model, value ) {
			var currencyData = paymentsSettings.currencies[value];
			var symbol = currencyData.symbol;

			var data = {
				id: this.model.get( 'id' ),
				callback: 'onPaymentsCurrencyChange',
				options: {
					symbol: symbol
				}
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

		onPaymentStepIntervalChange: function( e ) {
			if ( $( e.target ).val() <= 0 ) {
				$('[data-bind=user_price_step]', this.$el).val( 1 );
				this.model.set( 'user_price_step', 1 );
			}

			var data = {
				id: this.model.get( 'id' ),
				callback: 'onPaymentStepIntervalChangeCallback',
			};

			happyForms.previewSend( 'happyforms-part-dom-update', data );
		},

	} );

	happyForms.previewer = _.extend( happyForms.previewer, {
		onPaymentsPriceLabelChange: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $label = this.$( '.happyforms-payments__price .label', $part );

			$label.text( part.get( 'price_label' ) );
		},

		onPaymentsPriceChange: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $price = this.$( '.happyforms-payments__price .price strong', $part );
			var $priceInput = this.$( '.happyforms-payments__price input', $part );

			var language = navigator.language ? navigator.language : 'en-US';
			var formattedPrice = new Intl.NumberFormat(
				language,
				{
					style: 'decimal',
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				}
			).format( part.get( 'price' ) );

			$priceInput.attr( 'data-default', part.get( 'price' ) );
			$price.text( formattedPrice );
		},

		onPaymentsMethodChoiceLabelChangeCallback: function( $form ) {
			var label = happyForms.form.get( 'payment_method_choice_label' );

			$( '.happyforms-part--payments [data-subpart="payment_method"] > label span.label', $form ).text( label );
		},

		onPaymentsRedirectHintLabelChangeCallback: function( $form ) {
			var label = happyForms.form.get( 'paypal_redirect_hint' );

			$( '.happyforms-part--payments .happyforms-payments-service--paypal > .happyforms-part-wrap p', $form ).text( label );
		},

		onPayPalOptionLabelChangeCallback: function ( $form ) {
			var label = happyForms.form.get( 'paypal_option_label' );

			$( '.happyforms-payments__choice-paypal .option-label span.label ', $form ).text( label );
		},

		onStripeOptionLabelChangeCallback: function ( $form ) {
			var label = happyForms.form.get( 'stripe_option_label' );

			$( '.happyforms-payments__choice-stripe .option-label span.label ', $form ).text( label );
		},

		onUserPriceLabelChangeCallback: function( $form ) {
			var label = happyForms.form.get( 'user_price_label' );

			$( '[data-subpart="user_price"] .happyforms-part__label span.label ', $form ).text( label );
		},

		cardLabelChangeCallback: function( $form ) {
			var label = happyForms.form.get( 'card_label' );

			$( '.happyforms-payments__card .happyforms-stripe-card-label span.label', $form ).text( label );
		},

		cardNumberLabelChangeCallback: function( $form ) {
			var label = happyForms.form.get( 'card_number_label' );

			$( '.happyforms-payments__card .happyforms-stripe-card-number-label span.label', $form ).text( label );
		},

		cardExpiryLabelChangeCallback: function( $form ) {
			var label = happyForms.form.get( 'card_expiry_label' );

			$( '.happyforms-payments__card .happyforms-stripe-card-expiry-label span.label', $form ).text( label );
		},

		cardCvcLabelChangeCallback: function( $form ) {
			var label = happyForms.form.get( 'card_cvc_label' );

			$( '.happyforms-payments__card .happyforms-stripe-card-cvc-label span.label', $form ).text( label );
		},

		onPaymentsUserPricePlaceholderChange: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $input = this.$( '.happyforms-payments__user-price input', $part );

			$input.attr( 'placeholder', part.get( 'user_price_placeholder' ) );
		},

		onPaymentsCurrencyChange: function( id, html, options ) {
			var $part = this.getPartElement( html );

			var $currencySymbol = this.$( '.happyforms-payments__price .price span', $part );

			if ( $currencySymbol.length ) {
				$currencySymbol.html( options.symbol );
			}

			var $currencySymbolUserPrefix = this.$( '.happyforms-payments__user-price .happyforms-input-group__prefix span', $part );

			if ( $currencySymbolUserPrefix.length ) {
				$currencySymbolUserPrefix.html( options.symbol );
			}
		},

		onPaymentStepIntervalChangeCallback: function( id, html, options ) {
			var part = this.getPartModel( id );
			var $part = this.getPartElement( html );
			var $input = this.$( 'input', $part );

			$input.attr( 'step', part.get( 'user_price_step' ) );
		},
	} );

	var FormBuild = happyForms.classes.views.FormBuild;

	happyForms.classes.views.FormBuild = FormBuild.extend( {
		ready: function() {
			FormBuild.prototype.ready.apply( this, arguments );

			var paymentPart = happyForms.form.get( 'parts' ).findWhere( { type: 'payments' } );

			if ( paymentPart ) {
				this.$el.addClass( 'has-payments-part' );
				this.drawer.$el.addClass( 'has-payments-part' );
			}
		},

		onPartAdd: function( type, options ) {
			if ( 'payments' === type ) {
				var paymentPart = happyForms.form.get( 'parts' ).findWhere( { type: 'payments' } );

				if ( paymentPart ) {
					return;
				}

				this.$el.addClass( 'has-payments-part' );
				this.drawer.$el.addClass( 'has-payments-part' );
			}

			FormBuild.prototype.onPartAdd.apply( this, arguments );
		},

		onPartModelRemove: function( model ) {
			FormBuild.prototype.onPartModelRemove.apply( this, arguments );

			if ( 'payments' === model.get( 'type' ) ) {
				this.$el.removeClass( 'has-payments-part' );
				this.drawer.$el.removeClass( 'has-payments-part' );
			}
		}
	} );

	var FormMessages = happyForms.classes.views.FormMessages;

	happyForms.classes.views.FormMessages = FormMessages.extend ( {

		events: _.extend( {}, FormMessages.prototype.events, {
			'keyup [data-attribute]': 'onInputChange',
			'keyup [data-attribute="payment_method_choice_label"]': 'onPaymentsMethodChoiceLabelChange',
			'keyup [data-attribute="paypal_redirect_hint"]': 'onPaymentsRedirectHintLabelChange',
			'keyup [data-attribute="paypal_option_label"]' : 'onPayPalOptionLabelChange',
			'keyup [data-attribute="stripe_option_label"]' : 'onStripeOptionLabelChange',
			'keyup [data-attribute="user_price_label"]' : 'onUserPriceLabelChange',
			'keyup [data-attribute="card_label"]' : 'cardLabelChange',
			'keyup [data-attribute="card_number_label"]' : 'cardNumberLabelChange',
			'keyup [data-attribute="card_expiry_label"]' : 'cardExpiryLabelChange',
			'keyup [data-attribute="card_cvc_label"]' : 'cardCvcLabelChange',
		} ),

		applyMsgConditionClasses: function() {
			var self = this;

			var hasPayWhatYouWant = happyForms.form.get( 'parts' ).findWhere( {
				show_user_price_field: 1
			} );

			if ( hasPayWhatYouWant ) {
				self.$el.addClass( 'has-pay-what-you-want' );
			}
			FormMessages.prototype.applyMsgConditionClasses.apply( this, arguments );
		},

		onPaymentsMethodChoiceLabelChange: function( e ) {
			var data = {
				callback: 'onPaymentsMethodChoiceLabelChangeCallback',
			};

			happyForms.previewSend( 'happyforms-form-dom-update', data );
		},

		onPaymentsRedirectHintLabelChange: function( e ) {
			var data = {
				callback: 'onPaymentsRedirectHintLabelChangeCallback',
			};

			happyForms.previewSend( 'happyforms-form-dom-update', data );
		},

		onPayPalOptionLabelChange: function( e ) {
			var data = {
				callback: 'onPayPalOptionLabelChangeCallback',
			}

			happyForms.previewSend( 'happyforms-form-dom-update', data );
		},

		onStripeOptionLabelChange: function( e ) {
			var data = {
				callback: 'onStripeOptionLabelChangeCallback',
			}

			happyForms.previewSend( 'happyforms-form-dom-update', data );
		},

		onUserPriceLabelChange: function( e ) {
			var data = {
				callback: 'onUserPriceLabelChangeCallback',
			}

			happyForms.previewSend( 'happyforms-form-dom-update', data );
		},

		cardLabelChange: function( e ) {
			var data = {
				callback: 'cardLabelChangeCallback',
			}

			happyForms.previewSend( 'happyforms-form-dom-update', data );
		},

		cardNumberLabelChange: function( e ) {
			var data = {
				callback: 'cardNumberLabelChangeCallback',
			}

			happyForms.previewSend( 'happyforms-form-dom-update', data );
		},

		cardExpiryLabelChange: function( e ) {
			var data = {
				callback: 'cardExpiryLabelChangeCallback',
			}

			happyForms.previewSend( 'happyforms-form-dom-update', data );
		},

		cardCvcLabelChange: function( e ) {
			var data = {
				callback: 'cardCvcLabelChangeCallback',
			}

			happyForms.previewSend( 'happyforms-form-dom-update', data );
		},

	} );

} )( jQuery, _, Backbone, wp.customize, _happyFormsPaymentsPartSettings, _happyFormsSettings );
