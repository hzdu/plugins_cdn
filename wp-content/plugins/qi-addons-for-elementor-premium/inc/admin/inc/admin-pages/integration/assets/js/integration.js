(function ( $ ) {
	'use strict';

	var dashboard = {};

	dashboard.qodefOnDocumentReady = qodefOnDocumentReady;

	$( document ).ready( qodefOnDocumentReady );

	/**
	 *  All functions to be called on $(document).ready() should be in qodefImport function
	 **/
	function qodefOnDocumentReady() {
		qodefIntegration.init();
	}

	var qodefIntegration = {
		init: function () {
			this.formHolder    = $( '.qodef-admin-integration-page' );

			if ( this.formHolder.length ) {
				this.saveForm( this.formHolder );
			}
		},
		saveForm: function ( $adminPage ) {
			this.widgetsForm = $adminPage.find( '#qi_addons_for_elementor_integration_framework_ajax_form' );

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
								action: 'qi_addons_for_elementor_premium_action_framework_save_options'
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
		}
	};

})( jQuery );
