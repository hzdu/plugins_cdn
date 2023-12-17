( function( $, settings ) {

	var HappyformsCoupon = function( el ) {
		this.el = el;
		this.$el = $( el );
		this.$form = $( 'form', this.$el );
		this.$input = $( '#happyforms_payment_coupon', this.$form );
		this.$apply = $( '#happyforms_coupon_apply', this.$form );
		this.$price = $( '.happyforms-payments__price input[type="hidden"]', this.$form );
		this.$pricePart = $( '[data-subpart=price]', this.$el );
		this.$coupon = $( '.happyforms-payments__coupon input[type="hidden"]', this.$form );

		this.init();
	}

	HappyformsCoupon.prototype.init = function() {
		this.$apply.on( 'click', this.applyClicked.bind( this ) );
		this.$pricePart.on( 'price-updated', this.onPriceUpdate.bind( this ) );
	},

	HappyformsCoupon.prototype.applyClicked = function( e ) {
		e.preventDefault();
		if ( '' === this.$input.val() ) {
			return false;
		}

		this.applyCoupon( 'input' );
	},

	HappyformsCoupon.prototype.applyCoupon = function ( type ) {
		var c = '';
		var cid = '';
		var $input = this.$input;
		if ( 'input' === type ) {
			c = $input.val();
		} else {
			c = this.$coupon.val();
			cid = c;
		}

		if ( '' === c ) {
			return false;
		}

		var $noticeWrap = $( '.happyforms-coupon-notice', this.$form );
		var $noticeText = $( '.happyforms-coupon-notice span', this.$form );
		var $priceText = $( '.happyforms-payments__price .price', this.$form );
		var $price = this.$price;
		var $coupon = this.$coupon;
		var p = this.$coupon.data( 'price' );

		if ( p == '' ) {
			$( '.happyforms-payments__price [type="hidden"]', this.$form ).val();
		}

		var data = {
			action: settings.action,
			coupon: c,
			couponid: cid,
			price: p,
			formid: $( '[name="happyforms_form_id"]', this.$form ).val(),
			nonce: settings.nonce,
		}

		$noticeWrap.hide();
		$noticeWrap.removeClass( 'error' )
		$noticeWrap.html( '' );

		$.post( settings.ajaxurl, data, function( r ) {
			if ( r.success ) {
				$price.val( r.data.amount );
				$coupon.data( 'discounted', r.data.amount );
				$coupon.val( r.data.coupon );
				$input.val( '' );
				$priceText.addClass( 'strikethrough' );

				var $discountedText = $( '.discounted-price.coupons', this.$form );
				$discountedText.text( r.data.amount_display );
			} else {
				$noticeWrap.html( r.data.message );
				$noticeWrap.addClass( 'error' );
				$noticeWrap.show();
			}
		} );
	},

	HappyformsCoupon.prototype.onPriceUpdate = function ( e, data ) {
		var $coupon = this.$coupon;

		if ( 0 == $coupon.length ) {
			return;
		}

		if ( this.$price.val() == this.$coupon.data( 'price' ) && '' != this.$coupon.data( 'discounted' ) ) {
				this.$price.val( this.$coupon.data( 'discounted' ) );
		} else {
			this.$coupon.data( 'price', this.$price.val() )

			var $noticeWrap = $( '.happyforms-coupon-notice', this.$form );
			var $noticeText = $( '.happyforms-coupon-notice span', this.$form );
			var $priceText = $( '.happyforms-payments__price .price', this.$form );

			$priceText.removeClass( 'strikethrough' );
			$noticeWrap.hide();
			$noticeWrap.removeClass( 'error' )
			$noticeWrap.html( '' );

			var $discountedText = $( '.discounted-price.coupons', this.$form );
			$discountedText.text( '' );
			this.applyCoupon( 'auto' );
		}
	}


	$.fn.happyformsCoupon = function( method ) {
		if ( 'string' === typeof method ) {
			var instance = $( this ).data( 'HappyformsCoupon' );

			if ( instance && instance[method] ) {
				return instance[method].apply( instance, Array.prototype.slice.call( arguments, 1 ) );
			}
		} else {
			this.each( function() {
				$.data( this, 'HappyformsCoupon', new HappyformsCoupon( this ) );
			} );
		}
	}

	$( document ).on( 'happyforms-init', '.happyforms-form', function( e ) {
		$( this ).happyformsCoupon();
	} );

} )( jQuery, _happyFormsSettings.coupons );
