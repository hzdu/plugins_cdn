jQuery(function($) {
	$('body').on(
		'click.wishlist-member-woocommerce',
		'#wishlist-member-woo-pricing .add-price',
		/**
		 * Add price click handler
		 * @param  object e Event object.
		 */
		function(e) {
			e.preventDefault();
			var level = $('#wishlist_member_woo_pricing_levels').val();
			if (!level) {
				alert('Choose a Membership Level');
				return;
			}
			var level_name = $('#wishlist_member_woo_pricing_levels option[value="' + level + '"]')[0].text;
			if ('new' === level) {
				var level_name = window.prompt('Enter level name');
				$.post(
					ajaxurl, {
						action: 'wishlistmember_woocommerce_add_level',
						level_name: level_name,
						nonce: wlm4woo.nonce
					}
				).done((result) => {
					if (result.success) {
						$('<option value="' + result.data.level_id + '">' + result.data.level_name + '</option>').insertBefore('#wishlist_member_woo_pricing_levels option[value="new"]');
						$('#wishlist_member_woo_pricing_levels').val(result.data.level_id);
						$(e.target).click();
					} else {
						alert(result.data.message);
					}
				});
			} else {
				$(e.target).prop('disabled', true);
				$.post(
					ajaxurl, {
						action: 'wishlistmember_woocommerce_get_global_pricing_item_view',
						level_id: level,
						level_name: level_name,
						product_id: wlm4woo.product_id,
						open: 1,
						nonce: wlm4woo.nonce
					}
				).done((result) => {
					$('#wishlist_member_woo_pricing_levels').val('');
					if('all' == level) {
						$('.wishlist_member_woo_pricing_items').prepend(result);
					} else {
						$('.wishlist_member_woo_pricing_items').append(result);
					}
					$('body').trigger('reset_wlm4woo_pricing_dropdown.wishlist-member-woocommerce');
					$(e.target).prop('disabled', false);
				});
			}
		}
	);

	$('body').on(
		'click.wishlist-member-woocommerce',
		'.wishlist_member_woo_pricing_items .edit-price',
		/**
		 * Edit price click handler
		 * @param  object e Event object.
		 */
		function(e) {
			e.preventDefault();
			$(this).blur().closest('.-pricing-item').toggleClass('-open');
		}
	);

	$('body').on(
		'click.wishlist-member-woocommerce',
		'.wishlist_member_woo_pricing_items .delete-price',
		/**
		 * Delete price click handler
		 * @param  object e Event object.
		 */
		function(e) {
			e.preventDefault();
			var $item = $(this).closest('.-pricing-item');
			var $form = $(this).closest('form');				
			if (confirm('Delete price for ' + $item.data('level-name') + '?')) {
				$item.remove();
				$('body').trigger('reset_wlm4woo_pricing_dropdown.wishlist-member-woocommerce');
				var data = $form.serializeArray();
				data.push({name:'action',value:'wishlistmember_woocommerce_delete_global_pricing_item'});
				data.push({name:'nonce',value:wlm4woo.nonce});
				$.post(ajaxurl, data);
			}
			$(this).blur();
		}
	);

	$('body').on(
		'click.wishlist-member-woocommerce',
		'.wishlistmember_woo_pricing_type :radio',
		function() {
			var container = $(this).closest('.-pricing-item ');
			container.data('pricing-type', this.value);
			container.attr('class', container[0].className.replace(/(?:^|\s)pricing-type-.+?(?!\S)/g, ''))
			container.addClass('pricing-type-' + this.value);
		}
	);

	$('body').on(
		'reset_wlm4woo_pricing_dropdown.wishlist-member-woocommerce',
		function() {
			$('#wishlist_member_woo_pricing_levels option').prop('disabled', false);
			$('.wishlist_member_woo_pricing_items .-pricing-item').each(function() {
				$('#wishlist_member_woo_pricing_levels option[value="' + $(this).data('level') + '"]').prop('disabled', true);
			});
		}
	);

	// sortable product pricing.
	$('.wishlist_member_woo_pricing_items').sortable({
		axis: 'y',
		handle: '.move-price, h3',
		cancel: 'span a',
		items: '> :not(.nosort)'
	});

	$('body').trigger('reset_wlm4woo_pricing_dropdown.wishlist-member-woocommerce');
	$('.wishlistmember_woo_pricing_type :radio:checked').trigger('click.wishlist-member-woocommerce');

})