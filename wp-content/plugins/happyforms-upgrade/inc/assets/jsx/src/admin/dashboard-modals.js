import DashboardModals from '@happyforms/core/jsx/src/admin/dashboard-modals';
import { SlotFillProvider, Button, Modal, Guide, Popover, Notice, ExternalLink, TextControl, CheckboxControl, BaseControl } from '@wordpress/components';
import { useState, useReducer, useRef } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

( function( $, settings ) {

	/**
	 *
	 * Subscription modal
	 *
	 */
	const SubscribeModal = ( props ) => {
		const imageURL = `${settings.pluginURL}/inc/assets/svg/register.svg`;

		const initialState = {
			email: '',
			registrationKey: '',
			step: 'request_key',
			notice: null,
			disabled: false,
		};

		const reducer = ( state, newState ) => {
			return { ...state, ...newState };
		};

		const [state, dispatch] = useReducer(reducer, initialState);

		const requestKey = () => {
			dispatch( {
				notice: null,
				disabled: true,
			} );

			if ( '' === state.email.trim() || state.email.indexOf( '@' ) < 0 ) {
				dispatch( {
					disabled: false,
					notice: {
						status: 'error',
						message: __( 'Please enter an email address.', 'happyforms' ),
					},
					step: 'request_key',
				} );

				return;
			}

			$.post( ajaxurl, {
				action: settings.subscribeModalActionRequestKey,
				_wpnonce: settings.subscribeModalNonceRequestKey,
				product_plan: settings.subscribeModalProductPlan,
				email: state.email,
			}, function( response ) {
				dispatch( {
					disabled: false,
					notice: {
						status: response.success ? 'success' : 'error',
						message: response.data,
					},
					step: response.success ? 'register_key' : 'request_key',
				} );
			} );
		};

		const registerKey = () => {
			dispatch( {
				notice: null,
				disabled: true,
			} );

			$.post( ajaxurl, {
				action: settings.subscribeModalActionAuthorize,
				_wpnonce: settings.subscribeModalNonceAuthorize,
				product_plan: settings.subscribeModalProductPlan,
				license_key: state.registrationKey,
			}, function( response ) {
				if ( response.success ) {
					return props.onRequestCloseAndRemoveBadge();
				}

				dispatch( {
					disabled: false,
					notice: {
						status: response.success ? 'success' : 'error',
						message: response.data,
					},
				} );
			} );
		}

		const getNotice = () => {
			if ( ! state.notice ) {
				return <></>
			} else {
				return <Notice status={ state.notice.status } isDismissible={ false }>{ state.notice.message }</Notice>
			}
		};

		const getStep = () => {
			switch( state.step ) {
				case 'request_key':
					return(
						<>
						<div className="happyforms-modal__body">
							<label>{ __( 'Email address', 'happyforms' ) }</label>
							<input 
								type="email" 
								value={ state.email } 
								onChange={ ( e ) => { dispatch( { email: e.target.value } ) } }
								disabled={ state.disabled }
								autoFocus
							/>
						</div>
						<div className="happyforms-modal__footer">
							<BaseControl
								help={ <>
										{ __( 'Know your registration key?', 'happyforms' ) } <Button 
											isLink={ true } 
											onClick={ () => dispatch( { notice: null, step: 'register_key', email: '', } ) } 
											text={ __( 'Jump ahead', 'happyforms' ) } />
									</> }
							>
								<div className="happyforms-modal__footer-button-group">
									<Button 
										isPrimary={ true } 
										onClick={ requestKey } 
										text={ __( 'Send Registration Key', 'happyforms' ) }
										disabled={ state.disabled }
										className="button-hero"
										key="button-request-key"
									/>
								</div>
							</BaseControl>
						</div>
						</>
					);

				case 'register_key':
					return(
						<>
						<div className="happyforms-modal__body">
							<label>{ __( 'Registration key', 'happyforms' ) }</label>
							<div className="hf-pwd">
								<input 
									type="password"
									className="happyforms-credentials-input" 
									value={ state.registrationKey } 
									onChange={ ( e ) => { dispatch( { registrationKey: e.target.value } ) } }
									disabled={ state.disabled }
									autoFocus
								/>
								<button type="button" className="button button-secondary hf-hide-pw hide-if-no-js" data-toggle="0" aria-label={ __( 'Show credentials', 'happyforms' ) }>
									<span className="dashicons dashicons-visibility" aria-hidden="true"></span>
								</button>
							</div>
						</div>
						<div className="happyforms-modal__footer">
							<BaseControl
								help={ state.email !== '' && ( <>
										{ __( 'Still no email?', 'happyforms' ) } <Button 
											isLink={ true } 
											onClick={ requestKey } 
											text={ __( 'Resend', 'happyforms' ) } />
									</> ) } >
								<div className="happyforms-modal__footer-button-group">
									<Button
										isSecondary={ true } 
										onClick={ () => dispatch( { disabled: false, notice: null, step: 'request_key' } ) } 
										text={ __( 'Cancel', 'happyforms' ) }
										disabled={ state.disabled }
										key="button-cancel"
									/>
									<Button
										isPrimary={ true } 
										onClick={ registerKey } 
										text={ __( 'Register', 'happyforms' ) }
										disabled={ state.disabled }
										key="button-register-key"
									/>
								</div>
							</BaseControl>
						</div>
						</>
					);
			}
		};

		return(
			<Guide
				onFinish={ props.onRequestCloseAndRedirect }
				className="happyforms-modal happyforms-modal--subscribe"
				pages={ [
					{
						image: (
							<picture>
								<img src={imageURL} />
							</picture>
						),
						content: (
							<>
							{ getNotice() }
							<div className="happyforms-modal__header">
								<h1>{ __( 'You\'re unregistered', 'happyforms' ) }</h1>
								<p>
									{ __( 'Add your email address connected with your account and we\'ll send you a registration key. If your membership has expired or your free trial has ended', 'happyforms' ) }, <ExternalLink 
										href="https://happyforms.memberful.com/account/subscriptions">{ __( 'renew immediately to continue', 'happyforms' ) }
										</ExternalLink>
								</p>
							</div>
							{ getStep() }
							</>
						),
					},
				] }
			/>
		);
	}

	const DashboardModalsBaseClass = DashboardModals( $, settings );
	
	class DashboardModalsClass extends DashboardModalsBaseClass {

		openSubscribeModal() {
			var modal = (
				<SubscribeModal 
					onRequestCloseAndRedirect={ this.closeSubscribeModalAndRedirect.bind( this ) } 
					onRequestClose={ this.closeModal.bind( this, 'subscribe' ) }
					onRequestCloseAndRemoveBadge={ this.closeSubscribeModalAndRemoveBadge.bind( this ) } />
			);

			this.openModal( modal );
		}

		closeSubscribeModalAndRedirect() {
			window.location.href = settings.dashboardURL;
		}

		closeSubscribeModalAndRemoveBadge() {
			$( '.happyforms-unregistered-badge' ).hide();
			this.closeModal( 'subscribe' );
		}

	};

	var happyForms = window.happyForms || {};
	window.happyForms = happyForms;
	
	happyForms.modals = new DashboardModalsClass();

} )( jQuery, _happyFormsDashboardModalsSettings );