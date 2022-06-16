'use strict';

( function ( $ ) {
	let doc = $( document );

	doc.ready( function () {
		if ( typeof FSPObject.metabox_js_loaded === 'undefined' )
		{
			doc.on( 'click', '.fsp-metabox-account-remove', function () {
				$( this ).parent().slideUp( 200, function () {
					$( this ).remove();

					saveMetabox();
				} );
			} ).on( 'change', 'textarea[name^="fs_post_text_message_"]', function () {
				saveMetabox();
			} ).on( 'click', '.fsp-metabox-modal-accounts > .fsp-metabox-account:not(.fsp-is-disabled)', function () {
				let _this = $( this );
				let dataID = _this.data( 'id' );
				//let cover = _this.find( '.fsp-metabox-account-image > img' ).attr( 'src' );
				let name = _this.find( '.fsp-metabox-account-text' ).text().trim();
				let link = _this.find( '.fsp-metabox-account-text' ).prop( 'href' ).trim();

				let cover = '';

				if(_this.find( '.fsp-metabox-account-image > img' ).length > 0)
				{
					cover = _this.find( '.fsp-metabox-account-image > img' ).attr( 'src' );
				}
				else
				{
					cover = _this.find( '.fsp-metabox-account-badge' ).css( 'background-color' );
				}

				FSPAddToList( dataID, cover, name, link );

				_this.slideUp( 200, function () {
					$( this ).remove();
				} );
			} ).on( 'keyup', '.fsp-search-account', function () {
				let val = $( this ).val().trim().toLowerCase();

				if ( val !== '' )
				{
					$( '.fsp-metabox-modal-accounts > .fsp-metabox-account' ).filter( function () {
						let _this = $( this );

						if ( _this.text().toLowerCase().indexOf( val ) > -1 )
						{
							_this.slideDown( 200 );
						}
						else
						{
							_this.slideUp( 200 );
						}
					} );
				}
				else
				{
					$( '.fsp-metabox-modal-accounts > .fsp-metabox-account' ).slideDown( 200 );
				}
			} ).on( 'click', '.fsp-metabox-clear', function () {
				FSPoster.confirm( fsp__( 'Do you want to empty share list?' ), function () {
					$( '.fsp-metabox-account' ).slideUp( 200, function () {
						$( this ).remove();

						saveMetabox();
					} );
				} );
			} ).on( 'click', '.fsp-metabox-add', function () {
				let ignore = [];

				$( '#fspMetaboxAccounts' ).find( 'input[name="share_on_nodes[]"]' ).each( function () {
					ignore.push( $( this ).val() );
				} );

				FSPoster.loadModal( 'add_node_to_list', { dont_show: ignore } );
			} ).on( 'change', '#fspMetaboxShare', function () {
				if ( $( this ).is( ':checked' ) )
				{
					$( '#fspMetaboxShareContainer' ).slideDown( 200 );
				}
				else
				{
					$( '#fspMetaboxShareContainer' ).slideUp( 200 );
				}

				saveMetabox();
			} ).on( 'click', '.fsp-metabox-tab', function () {
				let _this = $( this );

				$( '.fsp-metabox-tab.fsp-is-active' ).removeClass( 'fsp-is-active' );
				_this.addClass( 'fsp-is-active' );

				let driver = _this.data( 'tab' );

				if ( driver == 'all' )
				{
					$( '.fsp-metabox-accounts > .fsp-metabox-account' ).slideDown( 200 );
					$( '#fspMetaboxCustomMessages > div' ).slideUp( 200 );
				}
				else
				{
					$( `.fsp-metabox-accounts > .fsp-metabox-account[data-driver!="${ driver }"]` ).slideUp( 200 );
					$( `.fsp-metabox-accounts > .fsp-metabox-account[data-driver="${ driver }"]` ).slideDown( 200 );
					$( `#fspMetaboxCustomMessages > div[data-driver!="${ driver }"]` ).slideUp( 200 );
					$( `#fspMetaboxCustomMessages > div[data-driver="${ driver }"]` ).slideDown( 200 );
				}

				if ( driver == 'fsp' )
				{
					$( '.fsp-metabox-accounts > .fsp-metabox-accounts-empty' ).html( fsp__( 'Please select a group' ) );
				}
				else
				{
					$( '.fsp-metabox-accounts > .fsp-metabox-accounts-empty' ).html( fsp__( 'Please select an account' ) );
				}
			} ).on( 'click', '.fsp-metabox-custom-message-label', function () {
				$( this ).next().slideToggle( 200 );
			} );

			FSPObject.metabox_js_loaded = true;
		}

		$( '.fsp-metabox-tab' ).eq( 0 ).click();
		//$( '.fsp-metabox-custom-message-label' ).click();
		$( '#fspMetaboxShare' ).trigger( 'change' );
	} );
} )( jQuery );

function FSPAddToList ( dataID, cover, name, link )
{
	if ( typeof jQuery !== 'undefined' )
	{
		$ = jQuery;
	}

	if ( name.length > 27 )
	{
		name = name.slice( 0, 23 ) + '...';
	}

	dataID = dataID.split( ':' );

	let tab = dataID[ 0 ];
	let nodeType = dataID[ 1 ];
	let sn_names = {
		fb: 'FB',
		twitter: 'Twitter',
		instagram: 'Instagram',
		linkedin: 'Linkedin',
		vk: 'VK',
		pinterest: 'Pinterest',
		reddit: 'Reddit',
		tumblr: 'Tumblr',
		ok: 'OK',
		google_b: 'GMB',
		blogger: 'Blogger',
		telegram: 'Telegram',
		medium: 'Medium',
		wordpress: 'WordPress',
		plurk: 'Plurk',
		xing: 'Xing',
		fsp: 'FSP'
	};
	let tabName = sn_names[ tab ];

	let cover_html = '';

	if(tab === 'fsp')
	{
		cover_html = '<span class="fsp-metabox-account-badge" style="background-color: ' + cover + ';"></span>';
	}
	else{
		cover_html = '<div class="fsp-metabox-account-image"><img src="' + cover +'" onerror="FSPoster.no_photo( this );"></div>';
	}

	$( `<div data-driver="${ tab }" class="fsp-metabox-account">
		<input type="hidden" name="share_on_nodes[]" value="${ dataID.join( ':' ) }">
		${cover_html}
		<div class="fsp-metabox-account-label">
			<a target="_blank" href="${ link }" class="fsp-metabox-account-text">
				${ name }
			</a>
			<div class="fsp-metabox-account-subtext">
				${ tabName }&nbsp;>&nbsp;${ nodeType }
			</div>
		</div>
		<div class="fsp-metabox-account-remove">
			<i class="fas fa-times"></i>
		</div>
	</div>` ).hide().appendTo( '#fspMetaboxAccounts' );

	FSPoster.toast( fsp__( 'Added to list!' ), 'success' );

	$( '.fsp-metabox-tab.fsp-is-active' ).click();

	saveMetabox();
}

function saveMetabox ()
{
	if ( typeof jQuery !== 'undefined' )
	{
		$ = jQuery;
	}

	if ( $( '#fs_poster_meta_box' ).length )
	{
		$( '#fspSavingMetabox' ).removeClass( 'fsp-hide' );

		let id = FSPObject.id;
		let share_checked = $( '#fspMetaboxShare' ).is( ':checked' ) ? 1 : 0;
		let accounts = [];
		let custom_messages = {
			'fb': $( 'textarea[name="fs_post_text_message_fb"]' ).val(),
			'fb_h': $( 'textarea[name="fs_post_text_message_fb_h"]' ).val(),
			'twitter': $( 'textarea[name="fs_post_text_message_twitter"]' ).val(),
			'instagram': $( 'textarea[name="fs_post_text_message_instagram"]' ).val(),
			'instagram_h': $( 'textarea[name="fs_post_text_message_instagram_h"]' ).val(),
			'linkedin': $( 'textarea[name="fs_post_text_message_linkedin"]' ).val(),
			'vk': $( 'textarea[name="fs_post_text_message_vk"]' ).val(),
			'pinterest': $( 'textarea[name="fs_post_text_message_pinterest"]' ).val(),
			'reddit': $( 'textarea[name="fs_post_text_message_reddit"]' ).val(),
			'tumblr': $( 'textarea[name="fs_post_text_message_tumblr"]' ).val(),
			'ok': $( 'textarea[name="fs_post_text_message_ok"]' ).val(),
			'google_b': $( 'textarea[name="fs_post_text_message_google_b"]' ).val(),
			'blogger': $( 'textarea[name="fs_post_text_message_blogger"]' ).val(),
			'telegram': $( 'textarea[name="fs_post_text_message_telegram"]' ).val(),
			'medium': $( 'textarea[name="fs_post_text_message_medium"]' ).val(),
			'wordpress': $( 'textarea[name="fs_post_text_message_wordpress"]' ).val(),
			'plurk': $( 'textarea[name="fs_post_text_message_plurk"]' ).val(),
			'xing': $( 'textarea[name="fs_post_text_message_xing"]' ).val(),
		};

		$( 'input[name^="share_on_nodes"]' ).each( function () {
			accounts.push( $( this ).val() );
		} );

		FSPoster.ajax( 'save_metabox', {
			id, share_checked, accounts, custom_messages
		}, function () {
			$( '#fspSavingMetabox' ).addClass( 'fsp-hide' );
		}, true, function () {
			$( '#fspSavingMetabox' ).addClass( 'fsp-hide' );
		} );
	}
}