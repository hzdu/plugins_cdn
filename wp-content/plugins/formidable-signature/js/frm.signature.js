/* global __FRMSIG, frmSigs, jQuery, frmFrontForm */

require( 'jspolyfill-array.prototype.find' );
import SignaturePad from 'signature_pad';
import domReady from '@wordpress/dom-ready';

/**
 * Shared methods across the app.
 *
 * @since 3.0
 */
const Helpers = {
	/**
	 * Get signature attributes from global variable.
	 *
	 * @since 3.0.1
	 */
	attributes() {
		if ( typeof __FRMSIG !== 'undefined' ) {
			return __FRMSIG;
		}
		return frmSigs;
	},
	/**
	 * Resize signature on different DPI.
	 *
	 * @since 3.0
	 * @param {Object} signaturePad
	 */
	resizeCanvas( signaturePad ) {
		const ratio = Math.max( window.devicePixelRatio || 1, 1 );
		signaturePad.canvas.width = signaturePad.canvas.offsetWidth * ratio;
		signaturePad.canvas.height = signaturePad.canvas.offsetHeight * ratio;
		signaturePad.canvas.getContext( '2d' ).scale( ratio, ratio );
		signaturePad.clear();
	},
	/**
	 * Get linked attributes from __FRMSIG and merge with default.
	 *
	 * @since 3.0
	 * @param {string} id
	 * @return {Object} Merged attributes.
	 */
	getAttr( id ) {
		if ( this.attributes().length === 0 ) {
			return;
		}
		const defaultAttr = this.attributes().find( ( x ) => x.id === id );
		return {
			id,
			backgroundColor: defaultAttr.bgColour,
			penColor: defaultAttr.text_color,
			dotSize: 1.5,
			maxWidth: defaultAttr.line_width,
			defaultTab: defaultAttr.default_tab,
			width: defaultAttr.width,
			lineWidth: defaultAttr.line_width,
			lineColor: defaultAttr.line_color,
			lineMargin: defaultAttr.line_margin,
			lineTop: defaultAttr.line_top,
		};
	},
	/**
	 * Draw line for signature pad and typed.
	 *
	 * @since 3.0
	 * @param {Element} sigPad
	 * @param {Object}  settings
	 */
	drawSigLine( sigPad, settings ) {
		const { width, lineMargin, lineTop, lineColor } = settings;
		let offsetWidth = sigPad.querySelector( '.sigNav' ).offsetWidth;
		// In case of tabs are hidden use left offset
		if ( offsetWidth === 0 ) {
			offsetWidth = lineMargin;
		}

		const n = sigPad.querySelector( '.frm-typed-drawline' );

		n.style.cssText = `
			left: ${ lineMargin }px;
			top: ${ lineTop }px;
			width: ${ Number( width ) - lineMargin - offsetWidth }px;
			height: 1px;
			background-color: ${ lineColor };
		`;
	},
	/**
	 * Fill canvas with provided bg color(This color will be affected on output).
	 *
	 * @since 3.0.1
	 * @param {Element} sigPad
	 * @param {string}  bgColor
	 */
	drawSigBackgroundColor( sigPad, bgColor ) {
		// if Bg color is default return
		if ( 'rgba(0,0,0,0)' === bgColor ) {
			return;
		}

		const n = sigPad.querySelector( '.sigWrapper' );

		n.style.cssText += `
		--bg-color: ${ bgColor };
		`;
	},
	/**
	 * Demonstrate draw pad.
	 *
	 * @since 3.0
	 * @param {Object}  sigInstance
	 * @param {Element} n
	 */
	displayDrawIt( sigInstance, n ) {
		sigInstance.options.defaultTab = 'drawIt';
		n.querySelector( '.pad' ).style.visibility = 'Visible';
		n.querySelector( '.typed' ).style.visibility = 'hidden';
		n.querySelector( '.typeIt a' ).setAttribute( 'class', '' );
		n.querySelector( '.drawIt a' ).setAttribute( 'class', 'frm-active-sig-type' );
		n.querySelector( '.clearButton' ).style.visibility = 'Visible';
	},

	/**
	 * Demonstrate typed field.
	 *
	 * @since 3.0
	 * @param {Object}  sigInstance
	 * @param {Element} n
	 */
	displayTypeIt( sigInstance, n ) {
		sigInstance.options.defaultTab = 'typeIt';
		n.querySelector( '.pad' ).style.visibility = 'hidden';
		n.querySelector( '.typed' ).style.visibility = 'Visible';
		n.querySelector( '.drawIt a' ).setAttribute( 'class', '' );
		n.querySelector( '.typeIt a' ).setAttribute( 'class', 'frm-active-sig-type' );
		n.querySelector( '.clearButton' ).style.visibility = 'hidden';
	},
	/**
	 * Remove js validation error and notices.
	 *
	 * @since 3.0
	 * @param {Element} canvas
	 */
	jsValidation( canvas ) {
		const form = canvas.closest( 'form' );
		const container = canvas.closest( '.frm_form_field' );
		container.classList.remove( 'frm_blank_field', 'has-error' );

		if ( container.querySelector( '.form-field .frm_error' ) !== null ) {
			container.querySelector( '.form-field .frm_error' ).remove();
		}

		if ( container.querySelector( '.frm_error_style' ) !== null ) {
			container.querySelector( '.frm_error_style' ).remove();
		}

		frmFrontForm.validateFormSubmit( form );
	},
};

/**
 * Injector for collect signature instances.
 *
 * @since 3.0
 */
const Injector = {
	instances: [],
	/**
	 * Get path of the signature container.
	 *
	 * @since 3.0
	 * @param {Element} e
	 * @return {Element} Sigpad container.
	 */
	getSigPadPath: ( e ) => {
		if ( e.length === 0 ) {
			return;
		}

		if ( e.path === undefined ) {
			return e.target.closest( '.sigPad' );
		}

		return e.path.find( ( x ) => x.classList.contains( 'sigPad' ) );
	},
	/**
	 * Destroy instance of signature.
	 *
	 * @since 3.0
	 * @param {Element} canvas
	 */
	killInstance( canvas ) {
		const instances = this.instances.filter( ( x ) => {
			return x.id !== canvas.dataset.fieldname;
		} );
		this.instances = instances;
	},
	/**
	 * Get single instance of signature.
	 *
	 * @since 3.0
	 * @param {string} id
	 * @return {Object} signature.
	 */
	getInstance( id ) {
		if ( this.instances.length === 0 ) {
			return;
		}
		return this.instances.find( ( x ) => x.id === id );
	},
	/**
	 * Set signature instance.
	 *
	 * @since 3.0
	 */
	set setInstances( name ) {
		this.instances.push( name );
	},
	/**
	 * Initialize signature instance.
	 *
	 * @since 3.0
	 * @param {Element} canvas
	 * @param {boolean} force
	 */
	initInstance( canvas, force = false ) {
		const fieldname = canvas.dataset.fieldname;
		const maybeInstance = this.getInstance( fieldname );
		// Bail if there is a existing signature instance
		if ( force === false && maybeInstance !== undefined ) {
			return;
		}

		// Get options
		let options = Helpers.getAttr( canvas.dataset.fieldid );

		// Reinitialize canvas on force
		if ( force === true && maybeInstance !== undefined ) {
			options = maybeInstance.options;
			this.killInstance( canvas );
		}

		// Init signature pad
		const signaturePad = new SignaturePad( canvas, options );
		// Get save node
		const saveOutput = document.getElementsByName(
			signaturePad.canvas.dataset.fieldname + '[output]'
		);
		// Check value to see if there is any drawing set to the instance for supporting page break
		const saveOutputValue = saveOutput[ 0 ].getAttribute( 'value' );
		if ( saveOutputValue ) {
			Helpers.resizeCanvas( signaturePad );
			signaturePad.fromDataURL( saveOutputValue );
		}

		// Set some property in signature instance
		signaturePad.id = fieldname;
		signaturePad.saveOutputNode = saveOutput;
		signaturePad.options = options;
		// Store signature instance for later usage
		this.setInstances = signaturePad;

		// Trigger default tab
		let containerPath = canvas.closest(
			'.frm_field_' + canvas.dataset.fieldid + '_container'
		);
		if ( containerPath === null ) {
			containerPath = canvas.closest(
				'#frm_field_' + canvas.dataset.fieldid + '_container'
			);
		}

		if ( options.defaultTab === 'typeIt' ) {
			Helpers.displayTypeIt( signaturePad, containerPath );
		} else {
			Helpers.displayDrawIt( signaturePad, containerPath );
		}

		// Draw line
		Helpers.drawSigLine( containerPath, options );
		// Change signature bg Color
		Helpers.drawSigBackgroundColor( containerPath, options.backgroundColor );

		// Initiate event for save the drawing value
		signaturePad.addEventListener( 'endStroke', () => {
			saveOutput[ 0 ].setAttribute( 'value', signaturePad.toDataURL( 'image/png' ) );
			Helpers.jsValidation( canvas );
		} );

		// Event listener for typed value
		const sigPad = canvas.closest( '.sigPad' );
		const typed = sigPad.querySelector( '.typed input' );
		typed.addEventListener( 'input', () => {
			Helpers.jsValidation( canvas );
		} );
	},
};

/**
 * Get all dom needed for app.
 *
 * @since 3.0
 * @param {Element} form
 * @return {Object} Elements.
 */
const domHelpers = ( form = false ) => {
	const selector = form || document;

	return {
		canvases: selector.getElementsByClassName( 'pad' ),
		clearButtons: selector.getElementsByClassName( 'clearButton' ),
		adminClearButtons: selector.querySelectorAll( '.frm-clear-signature' ),
		drawItButtons: selector.querySelectorAll( '.sigNav .drawIt a' ),
		typeItButtons: selector.querySelectorAll( '.sigNav .typeIt a' ),
	};
};

/**
 * Handle signature field events.
 *
 * @since 3.0
 * @param {Object} attributes
 */
const handleSignature = ( attributes ) => {
	const { form, force } = attributes;
	const {
		canvases,
		clearButtons,
		adminClearButtons,
		drawItButtons,
		typeItButtons,
	} = domHelpers( form );

	/**
	 * Check if requested element has a valid instance.
	 *
	 * @since 3.0
	 * @param {Event} e
	 * @return {boolean} validation result.
	 */
	const isValidSignatureExist = ( e ) => {
		const parent = Injector.getSigPadPath( e );
		const signature = Injector.getInstance( getInstanceName( parent ) );
		if ( signature === undefined ) {
			return false;
		}
		return true;
	};

	/**
	 * Find requested signature instance name.
	 *
	 * @since 3.0
	 * @param {Element} e
	 * @return {string} instance name.
	 */
	const getInstanceName = ( e ) => {
		const pad = e.querySelector( '.pad' );
		if ( pad.length === 0 ) {
			return;
		}
		return pad.dataset.fieldname;
	};

	/**
	 * Clear signature pad on clear button.
	 *
	 * @since 3.0
	 * @param {Element} e
	 */
	const clearPad = ( e ) => {
		const parent = Injector.getSigPadPath( e );
		const signature = Injector.getInstance( getInstanceName( parent ) );
		signature.clear();
		signature.saveOutputNode[ 0 ].setAttribute( 'value', '' );
	};

	/**
	 * Initialize signature field for all existing elements.
	 *
	 * @since 3.0
	 */
	Array.prototype.forEach.call( canvases, ( canvas ) => {
		Injector.initInstance( canvas, force );
	} );

	/**
	 * Signature clear buttons.
	 *
	 * @since 3.0
	 */
	Array.prototype.forEach.call( clearButtons, ( clearButton ) => {
		clearButton.addEventListener( 'click', function( e ) {
			clearPad( e );
		} );
	} );

	/**
	 * Signature draw it button.
	 *
	 * @since 3.0
	 */
	Array.prototype.forEach.call( drawItButtons, ( drawItButton ) => {
		drawItButton.addEventListener( 'click', function( e ) {
			e.preventDefault();
			const sigPad = Injector.getSigPadPath( e );
			const signatureInstance = Injector.getInstance(
				getInstanceName( sigPad )
			);
			Helpers.displayDrawIt( signatureInstance, sigPad );
			Helpers.drawSigLine(
				sigPad,
				Helpers.getAttr( signatureInstance.canvas.dataset.fieldid )
			);
			this.setAttribute( 'class', 'frm-active-sig-type' );
		} );
	} );

	/**
	 * Type it button.
	 *
	 * @since 3.0
	 */
	Array.prototype.forEach.call( typeItButtons, ( typeItButton ) => {
		typeItButton.addEventListener( 'click', function( e ) {
			e.preventDefault();
			if ( ! isValidSignatureExist( e ) ) {
				return;
			}
			const sigPad = Injector.getSigPadPath( e );
			const signatureInstance = Injector.getInstance(
				getInstanceName( sigPad )
			);
			clearPad( e );
			Helpers.displayTypeIt( signatureInstance, sigPad );
			Helpers.drawSigLine(
				sigPad,
				Helpers.getAttr( signatureInstance.canvas.dataset.fieldid )
			);
			this.setAttribute( 'class', 'frm-active-sig-type' );
		} );
	} );

	// Bail if there is any admin clear button.
	if ( adminClearButtons.length === 0 ) {
		return;
	}

	/**
	 * While allow editing is enabled add clear button admin side.
	 *
	 * @since 3.0
	 */
	Array.prototype.forEach.call( adminClearButtons, ( adminClearButton ) => {
		adminClearButton.addEventListener( 'click', function( e ) {
			e.preventDefault();
			let containerPath = adminClearButton.closest(
				'.frm_field_' + adminClearButton.dataset.fieldid + '_container'
			);
			if ( containerPath === null ) {
				containerPath = adminClearButton.closest(
					'#frm_field_' +
                    adminClearButton.dataset.fieldid +
                    '_container'
				);
			}

			containerPath.querySelector( '.frm-delete-saved-image' ).value = 1;
			containerPath
				.querySelector( '.sigPad' )
				.classList.remove( 'frm_hidden' );
			containerPath.querySelector( 'img' ).classList.add( 'frm_hidden' );
			this.classList.add( 'frm_hidden' );
		} );
	} );
};

/**
 * Handle start over button for signature.
 *
 * @since 3.0
 */
const handleStartOver = () => {
	/**
	 * Reset signature draw on start over event.
	 *
	 * @since 3.0
	 * @param {Event} e
	 */
	const onClick = ( e ) => {
		const form = document.querySelector(
			'#frm_form_' + e.frmData.formId + '_container'
		);
		Array.prototype.forEach.call(
			form.getElementsByClassName( 'pad' ),
			( canvas ) => {
				Injector.killInstance( canvas );
			}
		);
		handleSignature( { form, force: false } );
	};

	document.addEventListener( 'frm_after_start_over', onClick );
};

/**
 * Custom polyfill for closest path.
 *
 * @since 3.0
 */
function maybeAddPolyfills() {
	if ( ! Element.prototype.matches ) {
		// IE9 supports matches but as msMatchesSelector instead.
		Element.prototype.matches = Element.prototype.msMatchesSelector;
	}

	if ( ! Element.prototype.closest ) {
		Element.prototype.closest = function( s ) {
			let el = this;

			do {
				if ( el.matches( s ) ) {
					return el;
				}
				el = el.parentElement || el.parentNode;
			} while ( el !== null && el.nodeType === 1 );

			return null;
		};
	}
}

/**
 * Handle signature on repeater field.
 *
 * @since 3.0
 */
const handleSignatureRepeater = () => {
	handleSignature( { form: false, force: true } );
};

/**
 * Fire the app on dom ready.
 *
 * @since 3.0
 */
domReady( function() {
	maybeAddPolyfills();
	handleSignature( { form: false, force: false } );
	// Since jquery trigger is different from vanilla custom event we have to use jquery for now.
	jQuery( document ).on(
		'frmAfterAddRow frmPageChanged frmFormComplete',
		handleSignatureRepeater
	);
	handleStartOver();
} );
