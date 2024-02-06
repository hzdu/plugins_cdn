( function( $ ) {

	// String.padStart polyfill
	String.prototype.padStart||(String.prototype.padStart=function(t,i){return t>>=0,i=String(void 0!==i?i:" "),this.length>=t?String(this):((t-=this.length)>i.length&&(i+=i.repeat(t/i.length)),i.slice(0,t)+String(this))});

	HappyForms.parts = HappyForms.parts || {};

	HappyForms.parts.client_info = {
		init: function() {
			this.$date = $( '[name="client_info[date]"]', this.$el );
			this.$timezone = $( '[name="client_info[timezone]"]', this.$el );
			this.$platform = $( '[name="client_info[platform]"]', this.$el );
			this.$language = $( '[name="client_info[language]"]', this.$el );
			this.$referer = $( '[name="client_info[referer]"]', this.$el );
			this.$input = $( 'input', this.$el );

			this.$date.val( this.getDate() );
			this.$timezone.val( this.getTimezone() );
			this.$platform.val( this.getPlatform() );
			this.$language.val( this.getLanguage() );
			this.$referer.val( this.getReferer() );
		},

		getDate: function() {
			var now = new Date();
			var year = ( 1900 + now.getYear() ).toString();
			var month = ( now.getMonth() + 1 ).toString().padStart( 2, '0' );
			var day = now.getDate().toString().padStart( 2, '0' );
			var hours = now.getHours().toString().padStart( 2, '0' );
			var minutes = now.getMinutes().toString().padStart( 2, '0' );
			var seconds = now.getSeconds().toString().padStart( 2, '0' );
			var date = [
				year, '-', month, '-', day, ' ',
				hours, ':', minutes, ':', seconds
			].join( '' );

			return date;
		},

		getTimezone: function() {
			var now = new Date();
			var offset = (-now.getTimezoneOffset() / 60);
			var sign = ( 0 === offset ? '' : ( 0 < offset ) ? '+' : '-' );
			var timezone = sign + offset;

			return timezone;
		},

		getPlatform: function() {
			if ( ( 'undefined' !== typeof window.orientation )
					|| -1 !== navigator.userAgent.indexOf( 'IEMobile' ) ) {
				return 'mobile'
			}

			return 'desktop';
		},

		getLanguage: function() {
			return navigator.language.toLowerCase();
		},

		getReferer: function() {
			return window.location.href;
		},
	};

} )( jQuery );