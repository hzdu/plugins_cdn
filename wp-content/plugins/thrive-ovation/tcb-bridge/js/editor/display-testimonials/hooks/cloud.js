const actions = {
		/**
		 * when we have an empty element, we want to move to testimonial selections
		 *
		 * @param {string} elementType
		 * @param {Object} modalInstance
		 */
		'tcb.cloud_templates.before_modal_open': ( elementType, modalInstance ) => {
			if ( elementType === 'display_testimonials' ) {
				if ( modalInstance.applyTo.hasClass( 'tcb-elem-placeholder' ) ) {
					modalInstance.showConfirm = true;
				} else {
					modalInstance.$el.removeAttr( 'data-element-type' );
				}

				modalInstance.$el.find( '.tcb-modal-footer' ).toggle( modalInstance.showConfirm );
			}
		},

		/**
		 * Add button that takes us to the testimonial filter logic
		 *
		 * @param {Object} modalInstance
		 */
		'tcb.cloud_templates.after_init': modalInstance => {
			modalInstance.$footer.append( `<button type="button" style="display:none" class="tcb-right tve-button green white-text click" data-fn="showDisplaySettings">Display settings</button>` );

			modalInstance.showDisplaySettings = () => {
				modalInstance.applyTo.attr( 'data-cloud-template', modalInstance.selected );

				modalInstance.close();

				TVE.Components.display_testimonials.filterTestimonials( modalInstance, true );
			};
		},
		/**
		 * After importing a cloud template, we apply the carousel layout if needed
		 *
		 * @param {jQuery} $element
		 */
		'tcb_after_cloud_template_css_inserted': $element => {
			if ( $element.is( TVE.identifier( 'display_testimonials' ) ) ) {
				/* If we imported a display testimonial with a carousel, we need to reinitialize the carousel */
				if ( $element.attr( 'data-type' ) === 'carousel' ) {
					const $carouselElement = $element.find( '.tcb-carousel-container' );

					$carouselElement.attr( 'data-carousel-settings', decodeURI( $carouselElement.attr( 'data-carousel-settings' ) ) );
				}

				TVE.PostList.layout.applyLayout( $element );
			}
		},
	},
	filters = {
		'tcb.cloud_templates.change_main_wrapper_data_css': elements => [ ...elements, ...[ 'display_testimonials' ] ],
	};

module.exports = { actions, filters };
