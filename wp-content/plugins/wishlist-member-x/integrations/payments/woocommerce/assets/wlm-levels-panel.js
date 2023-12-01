$(function() {
	// turn off all .wlm4woo event handlers
	$('body').off('.wlm4woo');

	// tab switch handler.
	$('body').on('click.wlm4woo', '.woo-tab-links', (e) => {
		e.preventDefault();
		$('.woo-tab-links').removeClass('active');
		$('.woo-tab-links[href="' + e.target.hash + '"]').addClass('active');
		$('.woo-tabs').removeClass('active');
		$('.woo-tabs' + e.target.hash).addClass('active');
	});
	
	$('#woocommerce-access-products').allow_select_all()

	// access tab save button.
	$('body').on('click.wlm4woo', '#woocommerce-access-save-button', (e) => {
		var $btn = $(this);
		$btn.prop('disabled', true);
		$.post(
			WLM3VARS.ajaxurl,
			{
				woocommerce_access_products: $('#woocommerce-access-products').val(),
				level_id: wlm4woo.level_id,
				nonce: wlm4woo.nonce,
				action: 'wishlistmember_woocommerce_save_levels_access'
			}
		).done((res) => {
			$btn.prop('disabled', false);
			$('.wlm-message-holder').show_message({
				message: wp.i18n.__( 'Saved.', 'wishlist-member' ),
				type: 'success'
			});

		});
	});

	// global pricing save button.
	$('body').on('click.wlm4woo', '#woocommerce-levels-global-pricing-save-button', (e) => {
		var $btn = $(this);
		$btn.prop('disabled', true);
		$.post(
			WLM3VARS.ajaxurl,
			Object.assign({},
				$('#woo-global-pricing').get_form_data(), {
					level_id: wlm4woo.level_id,
					nonce: wlm4woo.nonce,
					action: 'wishlistmember_woocommerce_save_levels_global_pricing'
				}
			)
		).done((res) => {
			$btn.prop('disabled', false);
			$('.wlm-message-holder').show_message({
				message: wp.i18n.__( 'Global Pricing Saved', 'wishlist-member' ),
				type: 'success'
			});
		});
	});

	// initialize product pricing modal
	new wlm3_modal(
		'#wlm4woo-level-product-pricing-modal', {
			// product pricing save modal
			save_handler: (e) => {
				var $btn = $(e.target);

				$.post(
					WLM3VARS.ajaxurl,
					$('#wlm4woo-level-product-pricing-data :input').serializeArray().concat({
						name: 'level_id',
						value: wlm4woo.level_id
					}, {
						name: 'nonce',
						value: wlm4woo.nonce
					}, {
						name: 'action',
						value: 'wishlistmember_woocommerce_save_levels_product_pricing'
					})
				).done((res) => {
					// get row item
					$.post(
						WLM3VARS.ajaxurl, {
							action: 'wishlistmember_woocommerce_get_level_pricing_item_view',
							nonce: wlm4woo.nonce,
							pricing: res.data.product_pricing[res.data.product_id][wlm4woo.level_id],
							items: woo_products,
							pid: res.data.product_id,
						}
					).done((html) => {
						product_pricing[res.data.product_id] = res.data.product_pricing[res.data.product_id][wlm4woo.level_id];
						var row = $('#woo-product-pricing tbody tr#product-pricing-' + res.data.product_id);
						if (row.length) {
							// replace existing row
							row.replaceWith(html)
						} else {
							// add new row
							$('#woo-product-pricing tbody').append(html);
						}
						// add do_confirm to delete button
						$('body').trigger('product_pricing_do_confirm.wlm4woo');

						// show message
						$('.wlm-message-holder').show_message({
							message: wp.i18n.__( 'Member Pricing Saved', 'wishlist-member' ),
							type: 'success'
						});
					});
				});

				if ($btn.hasClass('-close')) {
					e.data.modal.close();
				}
				return false;
			},
			after_open: (e) => {
				$(e.target).find('[name=pricing_type]:checked').trigger('click');
			},
			before_close: () => {},
			before_open: (e) => {
				$(e.target).find('select[name="product_id"] option').prop('disabled', false);

				var data = {
					'pricing_type': 'fixed-price',
					'pricing_amount': 10,
				}
				if ($(e.relatedTarget).hasClass('new')) {
					$(e.target).find('select[name="product_id"]').prop('disabled', false);
					$(e.target).find(':input').prop('checked', false).val([]).trigger('change');
					$(e.target).find('[name="description"]').val(
						wp.i18n.sprintf(
							// Translators: 1 - Level Name.
							wp.i18n.__( '%1$s pricing', 'wishlist-member' ),
							wpm_levels[wlm4woo.level_id].name
						)
					);
				} else {
					$(e.target).find('select[name="product_id"]').prop('disabled', true);
					data = $(e.relatedTarget).closest('tr').data('pricing');
				}
				$(e.target).set_form_data(data);

				// disable configured products.
				$.each(product_pricing, (pid) => {
					$(e.target).find('select[name="product_id"] option[value="' + pid + '"]').prop('disabled', true);
				});
				$(e.target).find('select[name="product_id"]').first().select2({
					theme: "bootstrap"
				});
			}
		}
	);

	// add confirmation popup to product pricing delete button.
	$('body').on('product_pricing_do_confirm.wlm4woo', (e) => {
		$('.woo-delete-product-price').each(function() {
			$(this).do_confirm({
				confirm_message: wp.i18n.__('Delete member pricing?', 'wishlist-member'),
				yes_button: wp.i18n.__('Delete', 'wishlist-member')
			}).on('yes.do_confirm', (e) => {
				// delete product pricing
				var pid = $(e.target).closest('tr').data('pricing').product_id;
				$.post(
					WLM3VARS.ajaxurl, {
						action: 'wishlistmember_woocommerce_delete_levels_product_pricing',
						nonce: wlm4woo.nonce,
						product_id: pid,
						level_id: wlm4woo.level_id
					}
				).done((res) => {
					if (res.success) {
						// update js data
						delete product_pricing[pid];
						// remove row
						$(e.target).closest('tr').remove();
					}
				})
			});
		});
	}).trigger('product_pricing_do_confirm.wlm4woo');

	// show pricing details only if a product is selected.
	$('body').on('change.wlm4woo', '[name=product_id]', (e) => {
		$(e.target).closest('.modal').toggleClass('product-selected', !!$(e.target).val());
	});

	// initialize category pricing modal.
	new wlm3_modal(
		'#wlm4woo-level-category-pricing-modal', {
			// category pricing save modal
			save_handler: (e) => {
				var $btn = $(e.target);

				$.post(
					WLM3VARS.ajaxurl,
					$('#wlm4woo-level-category-pricing-data :input').serializeArray().concat({
						name: 'level_id',
						value: wlm4woo.level_id
					}, {
						name: 'nonce',
						value: wlm4woo.nonce
					}, {
						name: 'action',
						value: 'wishlistmember_woocommerce_save_levels_category_pricing'
					})
				).done((res) => {
					// get row item
					$.post(
						WLM3VARS.ajaxurl, {
							action: 'wishlistmember_woocommerce_get_level_pricing_item_view',
							nonce: wlm4woo.nonce,
							pricing: { ...res.data.category_pricing[res.data.category_id][wlm4woo.level_id], catview: true },
							items: woo_cats,
							pid: res.data.category_id,
						}
					).done((html) => {
						category_pricing[res.data.category_id] = res.data.category_pricing[res.data.category_id][wlm4woo.level_id];
						var row = $('#woo-category-pricing tbody tr#category-pricing-' + res.data.category_id);
						if (row.length) {
							// replace existing row
							row.replaceWith(html)
						} else {
							// add new row
							$('#woo-category-pricing tbody').append(html);
						}
						// add do_confirm to delete button
						$('body').trigger('category_pricing_do_confirm.wlm4woo');

						// show message
						$('.wlm-message-holder').show_message({
							message: wp.i18n.__( 'Member Pricing Saved', 'wishlist-member' ),
							type: 'success'
						});
					});
				});

				if ($btn.hasClass('-close')) {
					e.data.modal.close();
				}
				return false;
			},
			after_open: (e) => {
				$(e.target).find('[name=pricing_type]:checked').trigger('click');
			},
			before_close: () => {},
			before_open: (e) => {
				$(e.target).find('select[name="category_id"] option').prop('disabled', false);

				var data = {
					'pricing_type': 'fixed-price',
					'pricing_amount': 10,
				}
				if ($(e.relatedTarget).hasClass('new')) {
					$(e.target).find('select[name="category_id"]').prop('disabled', false);
					$(e.target).find(':input').prop('checked', false).val([]).trigger('change');
					$(e.target).find('[name="description"]').val(
						wp.i18n.sprintf(
							// Translators: 1 - Level Name.
							wp.i18n.__( '%1$s pricing', 'wishlist-member' ),
							wpm_levels[wlm4woo.level_id].name
						)
					);
				} else {
					$(e.target).find('select[name="category_id"]').prop('disabled', true);
					data = $(e.relatedTarget).closest('tr').data('pricing');
				}
				$(e.target).set_form_data(data);

				// disable configured categorys.
				$.each(category_pricing, (pid) => {
					$(e.target).find('select[name="category_id"] option[value="' + pid + '"]').prop('disabled', true);
				});
				$(e.target).find('select[name="category_id"]').first().select2({
					theme: "bootstrap"
				});
			}
		}
	);

	// add confirmation popup to product pricing delete button.
	$('body').on('category_pricing_do_confirm.wlm4woo', (e) => {
		$('.woo-delete-category-price').each(function() {
			$(this).do_confirm({
				confirm_message: wp.i18n.__('Delete member pricing?', 'wishlist-member'),
				yes_button: wp.i18n.__('Delete', 'wishlist-member')
			}).on('yes.do_confirm', (e) => {
				// delete category pricing
				var pid = $(e.target).closest('tr').data('pricing').category_id;
				$.post(
					WLM3VARS.ajaxurl, {
						action: 'wishlistmember_woocommerce_delete_levels_category_pricing',
						nonce: wlm4woo.nonce,
						category_id: pid,
						level_id: wlm4woo.level_id
					}
				).done((res) => {
					if (res.success) {
						// update js data
						delete category_pricing[pid];
						// remove row
						$(e.target).closest('tr').remove();
					}
				})
			});
		});
	}).trigger('category_pricing_do_confirm.wlm4woo');

	// show pricing details only if a category is selected
	$('body').on('change.wlm4woo', '[name=category_id]', (e) => {
		$(e.target).closest('.modal').toggleClass('category-selected', !!$(e.target).val());
	});

	// hide/show percent sign to the right of the product/category price based on pricing-type
	$('body').on('click.wlm4woo', '[name=pricing_type]', (e) => {
		$(e.target).closest('.modal').attr('data-pricing-type', e.target.value);
	});

});