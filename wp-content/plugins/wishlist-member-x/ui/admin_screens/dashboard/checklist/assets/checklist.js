/**
 * Checklist JS file
 *
 * @package WishListMember/Wizard
 */

/**
 * Checklist Checkbox handler
 */
$( 'body' ).on(
	'click',
	'.checklist-checkbox:not(.checklist-checkbox-disabled)',
	function() {
		let h4 = $( this ).closest( 'h4' );
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wishlistmember_toggle_checklist_done',
				id: h4.attr( 'id' ),
				status: + ! h4.hasClass( 'checklist-done' ),
			},
			function() {
				h4.removeClass( '-is-saving', 100, 'linear' );
			}
		);
		h4.toggleClass( 'checklist-done' ).addClass( '-is-saving' );
		wlm_checklist_sort();
	}
);

/**
 * Checklist Archive handler
 */
$( 'body' ).on(
	'click',
	'.checklist-archive-btn',
	function() {
		let h4 = $( this ).closest( 'h4' );
		$.post(
			WLM3VARS.ajaxurl,
			{
				action: 'wishlistmember_toggle_checklist_archived',
				id: h4.attr( 'id' ),
				status: + ! h4.hasClass( 'checklist-archived' ),
			},
			function() {
				h4.removeClass( '-is-saving', 100, 'linear' );
			}
		);
		h4.toggleClass( 'checklist-archived' ).addClass( '-is-saving' );
		wlm_checklist_sort();
	}
);

$( 'body' ).on(
	'click',
	'#activate-license-key',
	function() {
		$( '#wlm-license-nag input#license-key' ).addClass( '-is-highlighted' ).focus();
	}
);
$( 'body' ).on(
	'keydown',
	'#license-key',
	function() {
		$( this ).removeClass( '-is-highlighted',0 )
	}
);

/**
 * Sort WishList Member Checklist
 */
function wlm_checklist_sort() {
	$( 'h4.checklist-item' ).each(
		function() {
			$( this ).removeClass( 'collapse' );
			$( this ).removeClass( 'show' );
			if ($( this ).hasClass( 'checklist-archived' )) {
				$( this ).detach().appendTo( '.checklist-group.checklist-archived' );
			} else if ($( this ).hasClass( 'checklist-done' )) {
				$( this ).detach().appendTo( '.checklist-group.checklist-done' );
			} else {
				$( this ).detach().appendTo( '.checklist-group.checklist-todo' );
			}
			$( '.checklist-done h4.checklist-item' ).addClass( 'collapse' ).toggleClass( 'show', ! $( '.checklist-done h4:first' ).hasClass( 'collapsed' ) )
			$( '.checklist-archived h4.checklist-item' ).addClass( 'collapse' ).toggleClass( 'show', ! $( '.checklist-archived h4:first' ).hasClass( 'collapsed' ) )
		}
	);
	$( '.checklist-group' ).each(
		function(){
			let h4 = $( this ).find( 'h4' );
			if ( ! h4.length) {
				$( this ).html( '' );
			} else {
				[].sort.call(
					h4,
					function(a, b) {
						return +$( a ).data( 'importance' ) - +$( b ).data( 'importance' );
					}
				)
				$( this ).append( h4 );
			}
		}
	);
	$( '.checklist-group:has(h4.checklist-item)' ).addClass( '-has-items' );
	$( '.checklist-group:not(:has(h4.checklist-item))' ).removeClass( '-has-items' );
}

/**
 * Onload handler
 */
$(
	function() {
		// Sort and show checklist.
		wlm_checklist_sort();
		$( '#membership-success-checklist' ).removeClass( 'd-none' );

		// Checklist video modal.
		var checklist_video_modal = new wlm3_modal( '#wlm-checklist-video-modal' );
		$( '#wlm-checklist-video .auto-open-checklist' ).length && checklist_video_modal.open();

		// Checklist toggle.
		$( '.checklist-group.checklist-done>.checklist-item:first' ).on(
			'show.bs.collapse hide.bs.collapse',
			function(e){
				console.log( e.target.innerText )
				$.post(
					WLM3VARS.ajaxurl,
					{
						action:'wishlistmember_toggle_dashboard_checklist',
						key: 'dashboard_checklist_done_closed',
						value:e.type
					}
				)
			}
		);
		$( '.checklist-group.checklist-archived>.checklist-item:first' ).on(
			'show.bs.collapse hide.bs.collapse',
			function(e){
				$.post(
					WLM3VARS.ajaxurl,
					{
						action:'wishlistmember_toggle_dashboard_checklist',
						key: 'dashboard_checklist_archived_closed',
						value:e.type
					}
				)
			}
		);
		$( '#membership-success-checklist' ).on(
			'show.bs.collapse hide.bs.collapse',
			function(e){
				if ( ! $( e.target ).filter( '#membership-success-checklist' ).length) {
					return;
				}
				$.post(
					WLM3VARS.ajaxurl,
					{
						action:'wishlistmember_toggle_dashboard_checklist',
						value:e.type
					}
				)
			}
		);
		$( '#wlm-checklist-panel' ).removeClass( 'd-none' );
		$( '#wlm-checklist-video' ).on(
			'shown.bs.modal',
			function(){
				(function wlm_vimeo_play_checklist_video() {
					if (typeof Vimeo !== 'undefined') {
						$( '#wlm-checklist-vimeo' ).each(
							function() {
								(new Vimeo.Player( this )).play();
							}
						);
					} else {
						setTimeout( arguments.callee,500 );
					}
				})();
			}
		);
		$( '#wlm-checklist-video' ).on(
			'hide.bs.modal',
			function(){
				$( '#wlm-checklist-vimeo' ).each(
					function() {
						(new Vimeo.Player( this )).pause();
					}
				);
				if ($( '#wlm-checklist-video .auto-open-checklist' ).length) {
					$( '#wlm-checklist-panel' ).addClass( '-is-saving' ).delay( 1000 ).removeClass( '-is-saving', 100, 'linear' );
				}
				$( '#wlm-checklist-video .auto-open-checklist' ).removeClass( 'auto-open-checklist' );
			}
		);
	}
)
