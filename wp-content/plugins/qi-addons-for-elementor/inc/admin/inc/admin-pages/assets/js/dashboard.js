(function ( $ ) {
	'use strict';

	if ( typeof qodefFramework !== 'object' ) {
		window.qodefFramework = {};
	}

	qodefFramework.scroll      = 0;
	qodefFramework.windowWidth = $( window ).width();

	$( document ).ready(
		function () {
			qodefAdminOptionsPanel.init();
			qodefSearchWidgets.init();
			qodefWidgets.init();
		}
	);

	$( window ).scroll(
		function () {
			qodefFramework.scroll = $( window ).scrollTop();
		}
	);

	$( window ).resize(
		function () {
			qodefFramework.windowWidth = $( window ).width();

			if ( qodefFramework.windowWidth > 600 &&
				typeof qodefAdminOptionsPanel.adminPage !== 'undefined' &&
				qodefAdminOptionsPanel.adminPage.length ) {
				qodefAdminOptionsPanel.adminHeader.width( qodefAdminOptionsPanel.adminPage.width() );
			}
		}
	);

	var qodefAdminOptionsPanel = {
		init: function () {
			this.adminPage = $( '.qodef-admin-page' );
			this.adminHeaderPosition();
		},
		adminHeaderPosition: function () {
			if ( this.adminPage.length && qodefFramework.windowWidth > 600 ) {
				this.adminBarHeight         = $( '#wpadminbar' ).height();
				this.adminHeader            = $( '.qodef-admin-header' );
				this.adminHeaderHeight      = this.adminHeader.outerHeight( true );
				this.adminHeaderTopPosition = this.adminHeader.offset().top - parseInt( this.adminBarHeight );
				this.adminContent           = $( '.qodef-admin-content' );

				this.adminHeader.width( this.adminPage.width() );

				$( window ).on(
					'scroll load',
					function () {
						if ( qodefFramework.scroll >= qodefAdminOptionsPanel.adminHeaderTopPosition ) {
							qodefAdminOptionsPanel.adminHeader.addClass( 'qodef-fixed' ).css(
								'top',
								parseInt( qodefAdminOptionsPanel.adminBarHeight )
							);
							qodefAdminOptionsPanel.adminContent.css(
								'marginTop',
								qodefAdminOptionsPanel.adminHeaderHeight
							);
						} else {
							qodefAdminOptionsPanel.adminHeader.removeClass( 'qodef-fixed' ).css(
								'top',
								0
							);
							qodefAdminOptionsPanel.adminContent.css(
								'marginTop',
								0
							);
						}
					}
				);
			}
		},
	};

	var qodefSearchWidgets = {
		init: function () {
			this.searchField    = $( '.qodef-search-widget-field' );
			this.adminContent   = $( '.qodef-admin-content' );
			this.sectionHolder  = $( '.qodef-widgets-section' );
			this.fieldHolder    = $( '.qodef-widgets-item' );

			if ( this.searchField.length ) {
				var searchLoading = this.searchField.next( '.qodef-search-widget-loading' ),
					searchRegex,
					keyPressTimeout;

				this.searchField.on(
					'keyup paste',
					function () {
						var field = $( this );
						field.attr(
							'autocomplete',
							'off'
						);
						searchLoading.removeClass( 'qodef-hidden' );
						clearTimeout( keyPressTimeout );

						keyPressTimeout = setTimeout(
							function () {
								var searchTerm = field.val();
								searchRegex    = new RegExp(
									field.val(),
									'gi'
								);
								searchLoading.addClass( 'qodef-hidden' );

								if ( searchTerm.length < 3 ) {
									qodefSearchWidgets.resetSearchView();
								} else {
									qodefSearchWidgets.resetSearchView();
									qodefSearchWidgets.adminContent.addClass( 'qodef-apply-search' );
									qodefSearchWidgets.fieldHolder.each(
										function () {
											var thisFieldHolder = $( this );
											if ( thisFieldHolder.find( '.qodef-widgets-title' ).text().search( searchRegex ) !== -1 ) {
												thisFieldHolder.parents( '.qodef-widgets-section' ).addClass( 'qodef-search-show' );
											} else {
												thisFieldHolder.addClass( 'qodef-search-hide' );
											}
										}
									);
								}
							},
							500
						);
					}
				);

			}
		},
		resetSearchView: function () {
			this.adminContent.removeClass( 'qodef-apply-search' );
			this.sectionHolder.removeClass( 'qodef-search-show' );
			this.fieldHolder.removeClass( 'qodef-search-hide' );

		},
		resetSearchField: function () {
			this.searchField.val( '' );
		}
	};

	var qodefWidgets = {
		init: function () {
			this.formHolder    = $( '.qodef-admin-widgets-page' );

			if ( this.formHolder.length ) {
				this.saveWidgetsValues( this.formHolder );
				this.switchWidgetsValuesByControler( this.formHolder );
				this.switchControlerValuesByWidget( this.formHolder );

			}
		},
		saveWidgetsValues: function ( $adminPage ) {
			this.widgetsForm = $adminPage.find( '#qi_addons_for_elementor_widgets_framework_ajax_form' );

			var buttonPressed,
				$saveResetLoader = $( '.qodef-save-reset-loading' ),
				$saveSuccess     = $( '.qodef-save-success' );

			if ( this.widgetsForm.length ) {

				this.widgetsForm.on(
					'submit',
					function ( e ) {
						e.preventDefault();
						e.stopPropagation();
						$saveResetLoader.addClass( 'qodef-show-loader' );
						$adminPage.addClass( 'qodef-save-reset-disable' );

						var form          = $( this ),
							ajaxData      = {
								action: 'qi_addons_for_elementor_action_framework_save_options'
						};

						$.ajax(
							{
								type: 'POST',
								url: ajaxurl,
								cache: ! 1,
								data: $.param(
									ajaxData,
									! 0
								) + '&' + form.serialize(), success: function () {
									$saveResetLoader.removeClass( 'qodef-show-loader' );
									$adminPage.removeClass( 'qodef-save-reset-disable' );
									$saveSuccess.fadeIn( 300 );
									setTimeout(
										function () {
											$saveSuccess.fadeOut( 200 );
										},
										2000
									);
								}
							}
						);
					}
				);
			}
		},
		switchWidgetsValuesByControler: function ( $adminPage ) {
			this.optionsForm = $adminPage.find( '#qi_addons_for_elementor_widgets_framework_ajax_form' );

			var $sections = $adminPage.find( '.qodef-widgets-section' );

			$sections.each(
				function () {

					var $section          = $( this ),
						$sectionControler = $section.find( '.qodef-section-enable' );

					$sectionControler.on(
						'click',
						function ( e ) {
							$section.find( '.qodef-widgets-item input:checkbox' ).prop(
								'checked',
								$sectionControler.is( ':checked' )
							);
						}
					);
				}
			);

		},
		switchControlerValuesByWidget: function ( $adminPage ) {
			this.optionsForm = $adminPage.find( '#qi_addons_for_elementor_widgets_framework_ajax_form' );

			var $sections = $adminPage.find( '.qodef-widgets-section' );

			$sections.each(
				function () {
					var $section          = $( this ),
						$sectionControler = $section.find( '.qodef-section-enable' ),
						$sectionWidgets   = $section.find( '.qodef-widgets-item input:checkbox' );

					$sectionWidgets.each(
						function () {
							var $widget = $( this );

							$widget.on(
								'click',
								function ( e ) {
									// if( ! $widget.is(':checked') ){
									// 	$sectionControler.prop('checked', false);
									// }

									if ( $sectionWidgets.not( ':checked' ).length > 0 ) {
										$sectionControler.prop(
											'checked',
											false
										);
									} else {
										$sectionControler.prop(
											'checked',
											true
										);
									}
								}
							);

						}
					);
				}
			);

		},
		allWidgetsEnabled: function ( $section ) {
			var $sectionWidgets = $section.find( '.qodef-widgets-item input:checkbox' );

			$sectionWidgets.each(
				function () {
					var $widget = $( this );

					if ( ! $widget.is( ':checked' ) ) {
						return false;
					}
				}
			);

			return true;

		}

	};

})( jQuery );
