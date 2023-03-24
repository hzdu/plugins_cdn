document.addEventListener('DOMContentLoaded', function(event) {
	document.querySelectorAll('.formidable_zapier_migration').forEach(function(a){
		a.addEventListener('click', updateZapierDatabase)
	});

	function updateZapierDatabase() {
		var data =  {
			'action': 'convert_zapier_posts',
			'nonce': frmGlobal.nonce
		};
		postAjax( data, function ( response ) {
			var x = document.getElementsByClassName('formidable_zapier_migration');
			for (var i = 0; i < x.length; i++) {
				x[i].parentElement.innerHTML = 'Zapier database successfully updated!';
			}
		} );
	}

	function postAjax( data, success ) {
		var response, params,
			xmlHttp = new XMLHttpRequest();

		params = typeof data === 'string' ? data : Object.keys( data ).map(
			function( k ) {
				return encodeURIComponent( k ) + '=' + encodeURIComponent( data[k]);
			}
		).join( '&' );

		xmlHttp.open( 'post', ajaxurl, true );
		xmlHttp.onreadystatechange = function() {
			if ( xmlHttp.readyState > 3 && xmlHttp.status == 200 ) {
				response = xmlHttp.responseText;
				try {
					response = JSON.parse( response );
				} catch ( e ) {
					// The response may not be JSON, so just return it.
				}
				success( response );
			}
		};
		xmlHttp.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
		xmlHttp.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
		xmlHttp.send( params );
		return xmlHttp;
	}
} );
