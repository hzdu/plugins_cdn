'use strict';

(($) => {
	if (typeof elementor === 'undefined' || typeof elementorCommon === 'undefined') {
		return;
	}

	elementor.on('preview:loaded', () => {
		let dialog = null;
		// Add Penci Template button
		let buttons = $('#tmpl-elementor-add-section');

		const text = buttons.text().replace(
			'<div class="elementor-add-section-drag-title',
			'<div class="elementor-add-section-area-button penci-library-modal-btn" title="Penci Templates">Penci Templates</div><div class="elementor-add-section-drag-title'
		);

		buttons.text(text);

		// Call modal.
		$(elementor.$previewContents[0].body).on('click', '.penci-library-modal-btn', () => {
			if (dialog) {
				dialog.show();
				return;
			}

			var modalOptions = {
				id: 'penci-library-modal',
				headerMessage: $('#tmpl-elementor-penci-library-modal-header').html(),
				message: $('#tmpl-elementor-penci-library-modal').html(),
				className: 'elementor-templates-modal',
				closeButton: true,
				draggable: false,
				hide: {
					onOutsideClick: true,
					onEscKeyPress: true
				},
				position: {
					my: 'center',
					at: 'center'
				}
			};
			dialog = elementorCommon.dialogsManager.createWidget('lightbox', modalOptions);
			dialog.show();

			loadTemplates();
		});

		// Load items.
		function loadTemplates() {
			showLoader();

			$.ajax({
				url: 'https://library.pencidesign.net/wp-json/penci-blocks/v1/templates',
				method: 'GET',
				dataType: 'json',
				success: function (response) {
					if (response && response.elements) {
						var itemTemplate = wp.template('elementor-penci-library-modal-item');
						var itemOrderTemplate = wp.template('elementor-penci-library-modal-order');

						$(itemTemplate(response)).appendTo($('#penci-library-modal #elementor-template-library-templates-container'));
						$(itemOrderTemplate(response)).appendTo($('#penci-library-modal #elementor-template-library-filter-toolbar-remote'));

						importTemplate();
						hideLoader();
					} else {
						$('<div class="penci-notice penci-error">The library can\'t be loaded from the server.</div>').appendTo($('#penci-library-modal #elementor-template-library-templates-container'));
						hideLoader();
					}
				},
				error: function () {
					$('<div class="penci-notice penci-error">The library can\'t be loaded from the server.</div>').appendTo($('#penci-library-modal #elementor-template-library-templates-container'));
					hideLoader();
				}
			});
		}

		function showLoader() {
			$('#penci-library-modal #elementor-template-library-templates').hide();
			$('#penci-library-modal .elementor-loader-wrapper').show();
		}

		function hideLoader() {
			$('#penci-library-modal #elementor-template-library-templates').show();
			$('#penci-library-modal .elementor-loader-wrapper').hide();
		}

		function activateUpdateButton() {
			$('#elementor-panel-saver-button-publish').toggleClass('elementor-disabled');
			$('#elementor-panel-saver-button-save-options').toggleClass('elementor-disabled');
		}

		function importTemplate() {
			$('#penci-library-modal .elementor-template-library-template-insert').on('click', function () {
				showLoader();

				$.ajax({
                    type: "POST",
                    dataType: "html",
                    url: ajaxurl,
                    data: {
						action: 'penci_import_library_template',
						source: 'penci',
						edit_mode: true,
						display: true,
						check_permissions: false,
						template_id: $(this).data('id'),
						with_page_settings: false
					},
					success: function success(res) {
						res = JSON.parse(res);
						if (res.data && res.data.content) {
							elementor.getPreviewView().addChildModel(res.data.content);
							dialog.hide();
							setTimeout(function () {
								hideLoader();
							}, 2000);
							activateUpdateButton();
						} else {
							$('<div class="penci-notice penci-error">The element can\'t be loaded from the server.</div>').prependTo($('#penci-library-modal #elementor-template-library-templates-container'));
							hideLoader();
						}
					},
					error: function () {
						$('<div class="penci-notice penci-error">The element can\'t be loaded from the server.</div>').prependTo($('#penci-library-modal #elementor-template-library-templates-container'));
						hideLoader();
					}
				});
			});

			$('#penci-library-modal .elementor-templates-modal__header__close').on('click', () => {
				dialog.hide();
				hideLoader();
			});

			$('#penci-library-modal #elementor-template-library-filter-text').on('keyup', function () {
				var search = $(this).val().toLowerCase();
				var activeTab = document.querySelector('#elementor-penci-library-header-menu .elementor-active').getAttribute('data-tab');

				$('#penci-library-modal').find('.elementor-template-library-template').each(function () {
					const $this = $(this);
					let slug = $this.data('slug');
					const type = $this.data('type');

					// Remove - from slug
					slug = slug.replaceAll('-', ' ');
					slug = slug.replaceAll('_', ' ');
					
					if (slug.includes(search) && type.includes(activeTab)) {
						$this.show();
					} else {
						$this.hide();
					}
				});
			});

			// Filter by tag
			$('#penci-library-modal #elementor-template-library-filter-subtype').on('change', function () {
				var tag = $(this).val();

				$('#penci-library-modal').find('.elementor-template-library-template').each(function () {
					var $this = $(this);

					const itemTags = $this.data('tag').toLowerCase();
					if ((itemTags.includes(tag) || tag === 'all') && itemTags.includes('block')) {
						$this.show();
					} else {
						$this.hide();
					}
				});
			});

			function setActiveTab (tab) {
				$('#penci-library-modal .elementor-template-library-menu-item').removeClass('elementor-active');
				const activeTab = $('#penci-tab-' + tab);
				activeTab.addClass('elementor-active');

				document.querySelectorAll('#penci-library-modal .elementor-template-library-template').forEach(e => {
					const type = e.getAttribute('data-type');
					e.style.display = type === tab ? 'block' : 'none';
					
					if (tab === 'template') {
						$('#elementor-template-library-filter').hide();
					} else {
						$('#elementor-template-library-filter').show();
					}
				});
			}

			setActiveTab('block');

			// Filter by type
			$('#penci-library-modal .elementor-template-library-menu-item').on('click', function () {
				setActiveTab($(this).data('tab'));
			});
		}
	});
})(jQuery);