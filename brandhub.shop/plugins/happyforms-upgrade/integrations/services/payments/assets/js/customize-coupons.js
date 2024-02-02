( function( $, _, Backbone, api, settings ) {

	var FormMessages = happyForms.classes.views.FormMessages;

	happyForms.classes.views.FormMessages = FormMessages.extend ( {

		events: _.extend( {}, FormMessages.prototype.events, {
			'keyup [data-attribute="coupon_label"]' : 'onCouponLabelChange',
			'keyup [data-attribute="coupon_apply_label"]' : 'onCouponApplyLabelChange',
		} ),

		applyMsgConditionClasses: function() {
			var self = this;

			var acceptCoupons = happyForms.form.get( 'parts' ).findWhere( {
				accept_coupons: 1
			} );

			if ( acceptCoupons ) {
				self.$el.addClass( 'accept-coupons' );
			}
			FormMessages.prototype.applyMsgConditionClasses.apply( this, arguments );
		},

		onCouponLabelChange: function() {
			var data = {
				callback: 'onCouponLabelChangeCallback',
			}

			happyForms.previewSend( 'happyforms-form-dom-update', data );
		},

		onCouponApplyLabelChange: function() {
			var data = {
				callback: 'onCouponApplyLabelChangeCallback',

			};

			happyForms.previewSend( 'happyforms-form-dom-update', data );
		},
	} );

	var PaymentsView = happyForms.classes.views.parts.payments;

	happyForms.classes.views.parts.payments = PaymentsView.extend( {
		events: _.extend( {}, PaymentsView.prototype.events, {} ),

		initialize: function() {
			PaymentsView.prototype.initialize.apply( this, arguments );

			this.listenTo( this.model, 'change:accept_coupons', this.onAcceptCouponChange );
		},

		onAcceptCouponChange: function( e ) {
			var model = this.model;

			this.model.set( 'accept_coupons', this.model.get( 'accept_coupons' ) );

			this.model.fetchHtml( function( response ) {
				var data = {
					id: model.get( 'id' ),
					html: response,
				};

				happyForms.previewSend( 'happyforms-form-part-refresh', data );
			} );
		}
	} );

	happyForms.previewer = _.extend( happyForms.previewer, {
		onCouponLabelChangeCallback: function( $form ) {
			var label = happyForms.form.get( 'coupon_label' );

			$( '.happyforms-payments__coupon label.happyforms-part__label span.label', $form ).text( label );
		},
		onCouponApplyLabelChangeCallback: function( $form ) {
			var label = happyForms.form.get( 'coupon_apply_label' );

			$( '.happyforms-payments__coupon #happyforms_coupon_apply', $form ).text( label );
		},
	} );

} ) ( jQuery, _, Backbone, wp.customize, _happyFormsSettings );