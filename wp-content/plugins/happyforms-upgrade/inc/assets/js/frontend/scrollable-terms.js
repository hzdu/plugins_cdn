( function ( $ ) {

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.scrollable_terms = {
		init: function() {
			this.type = this.$el.data( 'happyforms-type' );
			this.$input = $( 'input', this.$el );
			this.$scrollBox = $( '.scrollbox', this.$el );
			this.$contentBox = $( '.scrollbox .content', this.$el );

			if ( this.$input.length > 0 ) {
				var self = this;
				this.$scrollBox.bind( 'scroll', { part: this }, this.isScrolledToBottom );

				var observeScrollboxResize = new ResizeObserver( function( e ) {
					var scrollBox = self.$scrollBox[0];
					var contentBox = self.$contentBox[0];

					var scrollBoxContentHeight = ( scrollBox.clientHeight - 20 );

					if ( scrollBoxContentHeight >= contentBox.clientHeight ) {
						self.$input.val( '1' );
					}
				} );

				observeScrollboxResize.observe( this.$scrollBox[0] );
			}
		},

		isScrolledToBottom: function( e ) {
			var elem = $( e.currentTarget );
			var part = e.data.part;

			if ( elem[0].scrollHeight - elem.scrollTop() < elem.outerHeight() ){
				part.$input.val( '1' );
			}
		},

		serialize: function() {
			var serialized = $( 'input', this.$el ).map( function( i, input ) {
				var $input = $( input );

				return {
					name: $input.attr( 'name' ),
					value: $input.val(),
				}
			} ).toArray();

			return serialized;
		},
	}

} )( jQuery );
