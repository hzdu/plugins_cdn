import { SlotFillProvider, Button, Modal, Guide, Popover, Notice, ExternalLink, TextControl, CheckboxControl, BaseControl } from '@wordpress/components';
import { useState, useReducer, useRef } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 *
 * Modal handler class
 *
 */
export default function( $, settings ) {

	const { render } = wp.element;

	/**
	 *
	 * Modal wrapper
	 *
	 */
	const ModalProvider = ( props ) => {
		return (
			<SlotFillProvider>
				{ props.modal }
				<Popover.Slot />
			</SlotFillProvider>
		);
	};
	
	return class DashboardModals {

		area = null;
		
		constructor() {
			this.area = document.getElementById( 'happyforms-modals-area' );
		}

		openModal( modal ) {
			render( <ModalProvider modal={modal}></ModalProvider>, this.area );
		}

		closeModal( modal ) {
			render( <></>, this.area );

			$.post( ajaxurl, {
				action: settings.actionModalDismiss,
				id: modal, 
			} );
		}

	};

}