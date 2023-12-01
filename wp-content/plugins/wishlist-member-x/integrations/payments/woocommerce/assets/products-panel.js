jQuery(function($) {
	// enable select2.
	$('#wishlist_member_woo_levels').select2();

	// turn off all of our handlers to prevent duplicate handlers.
	$('body').off('.wishlist-member-woocommerce');

	$('body').on(
		'click.wishlist-member-woocommerce',
		'.wishlist-member-subtabs a',
		/**
		 * Sub-tabs click handler
		 * @param  object e Event object.
		 */
		function(e) {
			e.preventDefault();
			var link = $(this);

			$('.wishlist-member-subtabs a').removeClass('active');
			link.addClass('active');

			$('.wishlist-member-subtabs-panel').hide();
			$(link.attr('href')).show();

			return false;
		}
	);

	$('body').on(
		'click.wishlist-member-woocommerce',
		'#wishlist-member-subtabs-pricing .add-price',
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
						action: 'wishlistmember_woocommerce_get_pricing_item_view',
						level_id: level,
						level_name: level_name,
						product_id: wlm4woo.product_id,
						open: 1,
						nonce: wlm4woo.nonce
					}
				).done((result) => {
					$('#wishlist_member_woo_pricing_levels').val('');
					$('.wishlist_member_woo_pricing_items').append(result);
					$('body').trigger('reset_wlm4woo_pricing_dropdown.wishlist-member-woocommerce');
					$(e.target).prop('disabled', false);
					add_final_price_markup();
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
			if (confirm('Delete price for ' + $item.data('level-name') + '?')) {
				$item.remove();
				$('body').trigger('reset_wlm4woo_pricing_dropdown.wishlist-member-woocommerce');
			}
			$(this).blur();
		}
	);

	$('body').on(
		'click.wishlist-member-woocommerce',
		'#wishlist-member-save-pricing',
		function(e) {
			e.preventDefault();
			$(e.target).prop('disabled', true);
			var data = $('.wishlist_member_woo_pricing_items :input').serializeArray();
			data.push({
				name: 'action',
				value: 'wishlistmember_woocommerce_save_pricing'
			}, {
				name: 'product_id',
				value: wlm4woo.product_id
			}, {
				name: 'nonce',
				value: wlm4woo.nonce
			})
			$.post(
				ajaxurl,
				data
			).done((result) => {
				if (!result.success) {
					alert(result.data.message)
				} else {
					$('#wishlist-member-woo-pricing-saved').show().delay(1500).fadeOut();
				}
				$(e.target).prop('disabled', false);
			});
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
			update_pricing_math(container.find('.wishlistmember_woo_pricing_amount :input').first());
		}
	);

	$('body').on(
		'change.wishlist-member-woocommerce',
		'.wishlistmember_woo_pricing_amount :input',
		function() {
			this.value = Math.abs(this.value) || 0;
			update_pricing_math(this);
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

	add_final_price_markup();

	// sortable product pricing.
	$('.wishlist_member_woo_pricing_items').sortable({
		axis: 'y',
		handle: '.move-price, h3',
		cancel: 'span a'
	});

	$('body').trigger('reset_wlm4woo_pricing_dropdown.wishlist-member-woocommerce');
	
	/**
	 * Adds markup to display final price
	 */
	function add_final_price_markup() {
		$('.wishlistmember_woo_pricing_amount :input').each((index, obj) => {
			if(!$(obj).siblings('.pricing-math').length) {
				$(obj).before('<span class="pricing-math"><span class="regular-price">' + $(obj).closest('.-pricing-item').data('regular-price-formatted') + '</span>&nbsp;-&nbsp;</span>');
				$(obj).after('<span class="pricing-math"><span class="percent-symbol">%</span>&nbsp;=&nbsp;<span class="final-price"></span></span>');
				update_pricing_math(obj);
			}
			if(!$(obj).siblings('.original-price').length) {
				$(obj).after('<span class="original-price">&nbsp;' + wp.i18n.__( 'Original Price:' ) + ' ' + $(obj).closest('.-pricing-item').data('regular-price-formatted') + '</span>');
				update_pricing_math(obj);
			}
		});
	}

	/**
	 * Updates the pricing calculation for the member price
	 * @param  object obj Price input field.
	 */
	function update_pricing_math(obj) {
		var container = $(obj).closest('.-pricing-item')
		var discounted_price = 0;
		var discount = Math.abs($(obj).val()) || 0;
		switch (container.data('pricing-type')) {
			case 'fixed-discount':
				discounted_price = container.data('regular-price') - discount;
				break;
			case 'percentage-discount':
				discounted_price = container.data('regular-price') * (1 - discount / 100);
				break;
		}
		if (container.data('pricing-type') != 'fixed-price') {
			if (discounted_price < 0) {
				container.find('.final-price').html('Result is less than zero');
			} else {
				container.find('.final-price').html(format_price(discounted_price));
			}
		}
	}

	/**
	 * Formats the price
	 * @param  string|number price Price
	 * @return string Formatted price
	 */
	function format_price(price) {
		if (typeof price === 'string') {
			price = parseFloat(price);
		}
		var result = price.toLocaleString('en-US', {
			maximumFractionDigits: wlm4woo.decimals,
			minimumFractionDigits: wlm4woo.decimals
		});
		var pieces = result.split('.');
		pieces[0] = pieces[0].split(',').join(wlm4woo.thousand_separator);

		price = pieces.join(wlm4woo.decimal_separator);
		return wlm4woo.price_format.replace('%1$s', wlm4woo.currency).replace('%2$s', price);
	}
});