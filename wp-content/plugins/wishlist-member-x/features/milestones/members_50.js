/**
 * Milestone - members reached 50
 *
 * @package WishListMember\Features\Milestones
 */

jQuery(
	function($) {
		$( 'body' ).on(
			'click.wlm3global',
			'#members-reached-50',
			function() {
				$.post(
					ajaxurl,
					{
						action: 'wishlistmember_milestones_members_reached_50_dismiss'
					}
				)
			}
		);
	}
);
