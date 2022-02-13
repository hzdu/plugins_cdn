import { __ } from '@wordpress/i18n'
import { addAction, addFilter } from "@wordpress/hooks";
import WithForm from '../../vendor/barn2/setup-wizard/resources/js/steps/with-form';
import { has, get, isEmpty } from 'lodash';
import axios from "axios";
import qs from 'qs';

import { SetupWizardSettings, getParsedAjaxError } from '../../vendor/barn2/setup-wizard/resources/js/utilities'

/**
 * Make sure at least one option is selected.
 */
 class AccessTypes extends WithForm {
	constructor( props ) {
		super( props );
	}

	/**
	 * Automatically toggle steps on mount if required.
	 */
	componentDidMount() {

		const step = this.props.step
		const fields = step.fields

		const anyone = get( fields.anyone, 'value', false );
		const logged = get( fields.logged, 'value', false );

		if ( anyone === true && logged === true ) {
			this.props.showStep( 'password-protection' )
			this.props.showStep( 'user-protection' )
		} else if ( anyone === true ) {
			this.props.showStep( 'password-protection' )
			this.props.hideStep( 'user-protection' )
		} else if ( logged === true ) {
			this.props.hideStep( 'password-protection' )
			this.props.showStep( 'user-protection' )
		}

	}

	/**
	 * Submit the form via ajax
	 */
	onSubmit( values ) {
		
        // Reset the steps so we make sure the hidden ones stay hidden.
		this.props.resetSteps()

		this.setErrorMessage( false ); // reset the error message.

        const anyone = get( values, 'anyone', false );
		const logged = get( values, 'logged', false );

        // Make sure at least one option is clicked.
		if ( anyone === false && logged === false ) {
			this.setErrorMessage( 'Please select at least one option.' );
			return;
		}

		if ( anyone === true && logged === true ) {
			this.props.showStep( 'password-protection' )
			this.props.showStep( 'user-protection' )
		} else if ( anyone === true ) {
			this.props.showStep( 'password-protection' )
			this.props.hideStep( 'user-protection' )
		} else if ( logged === true ) {
			this.props.hideStep( 'password-protection' )
			this.props.showStep( 'user-protection' )
		}

        super.onSubmit(values)

	}
}

/**
 * Override the components of the pages.
 */
 addFilter( 'barn2_setup_wizard_steps', 'wpc-wizard', ( steps ) => {
	steps[ 2 ].container = AccessTypes
	return steps
} );

/**
 * Handle the wizard restart request.
 */
 addAction( 'barn2_wizard_on_restart', 'wpc-wizard', ( wizard ) => {

	wizard.setState( { wizard_loading: true, wizard_complete: true } );

	axios.post( SetupWizardSettings.ajax, qs.stringify(
		{
			action: `barn2_wizard_${ SetupWizardSettings.plugin_slug }_on_restart`,
			nonce: SetupWizardSettings.nonce,
		}
	 ) )
	.then(function (response) {

		if ( has( response, 'data.data.toggle' ) ) {
			const toToggle = response.data.data.toggle

			const anyone = toToggle.includes( 'anyone' )
			const logged = toToggle.includes( 'logged' )

			if ( anyone === false && logged === false ) {
				wizard.setState( { wizard_loading: false } );
				return;
			}

			if ( anyone === true && logged === true ) {
				wizard.showStep( 'password-protection' )
				wizard.showStep( 'user-protection' )
			} else if ( anyone === true ) {
				wizard.showStep( 'password-protection' )
				wizard.hideStep( 'user-protection' )
			} else if ( logged === true ) {
				wizard.hideStep( 'password-protection' )
				wizard.showStep( 'user-protection' )
			}

			wizard.setState( { wizard_loading: false } );

			wizard.setStepsCompleted( true )

		}
	})
	.catch(function (error) {
		console.log(error)
		if ( error.response ) {
			if ( ! isEmpty( getParsedAjaxError( error.response ) ) ) {
				wizard.setErrorMessage( getParsedAjaxError( error.response ) );
			} else {
				wizard.setErrorMessage( error.response.statusText );
			}
		} else if (error.request) {
			wizard.setErrorMessage( __( 'The request was made but no response was received.' ) );
		} else {
			wizard.setErrorMessage( __( 'Something went wrong while making the request.' ) );
		}
	});

} )