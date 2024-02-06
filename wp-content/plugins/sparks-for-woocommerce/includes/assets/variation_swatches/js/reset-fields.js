/* global XMLHttpRequest, CustomEvent */
( function () {
	const send = XMLHttpRequest.prototype.send;
	XMLHttpRequest.prototype.send = function () {
		this.addEventListener( 'load', function () {
			if (
				this &&
				4 === this.readyState &&
				200 === this.status &&
				this.responseText &&
				0 <= this.responseText.indexOf( "action='add-tag" )
			) {
				const resetEvent = new CustomEvent( 'term-submited', {
					detail: true,
				} );
				document.dispatchEvent( resetEvent );
			}
		} );
		return send.apply( this, arguments );
	};
} )();
