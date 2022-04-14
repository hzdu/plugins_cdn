import DOMPurify from 'dompurify';
import addToCSS from '../../../utils/add-to-css';
import getIcon from '../../../utils/get-icon';
import './editor.scss';

/**
 * WordPress Dependencies
 */
import {
	__,
} from '@wordpress/i18n';

import {
	addFilter,
	applyFilters,
} from '@wordpress/hooks';

import {
	Fragment,
} from '@wordpress/element';

import {
	URLInput,
	BlockControls,
} from '@wordpress/block-editor';

import {
	TextControl,
	SelectControl,
	ToolbarGroup,
	ToolbarButton,
	Dropdown,
	ToggleControl,
	BaseControl,
} from '@wordpress/components';

import {
	createHigherOrderComponent,
} from '@wordpress/compose';

/**
 * Add custom attribute for mobile visibility.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
function addAttributes( settings ) {
	if ( typeof settings.attributes !== 'undefined' && 'generateblocks/container' === settings.name ) {
		settings.attributes = Object.assign( settings.attributes, {
			linkType: {
				type: 'string',
				default: 'hidden-link',
			},
			url: {
				type: 'string',
				default: '',
			},
			hiddenLinkAriaLabel: {
				type: 'string',
				default: '',
			},
			target: {
				type: 'boolean',
			},
			relNoFollow: {
				type: 'boolean',
			},
			relSponsored: {
				type: 'boolean',
			},
		} );
	}

	return settings;
}

function addHiddenLink( output, attributes ) {
	const {
		url,
		linkType,
		hiddenLinkAriaLabel,
		relNoFollow,
		target,
		relSponsored,
	} = attributes;

	const relAttributes = [];

	if ( relNoFollow ) {
		relAttributes.push( 'nofollow' );
	}

	if ( target ) {
		relAttributes.push( 'noopener', 'noreferrer' );
	}

	if ( relSponsored ) {
		relAttributes.push( 'sponsored' );
	}

	return (
		<Fragment>
			{ '' !== url && 'hidden-link' === linkType &&
				<a
					href={ url }
					className={ 'gb-container-link' }
					aria-label={ '' !== hiddenLinkAriaLabel ? hiddenLinkAriaLabel : undefined }
					rel={ relAttributes && relAttributes.length > 0 ? relAttributes.join( ' ' ) : null }
					onClick={ ( e ) => {
						e.preventDefault();
					} }
				>

				</a>
			}

			{ output }
		</Fragment>
	);
}

function addLinkWrapper( htmlAttributes, id, attributes ) {
	if ( 'generateblocks/container' !== id ) {
		return htmlAttributes;
	}

	if ( '' !== attributes.url && 'wrapper' === attributes.linkType ) {
		const relAttributes = [];

		if ( attributes.relNoFollow ) {
			relAttributes.push( 'nofollow' );
		}

		if ( attributes.target ) {
			relAttributes.push( 'noopener', 'noreferrer' );
		}

		if ( attributes.relSponsored ) {
			relAttributes.push( 'sponsored' );
		}

		htmlAttributes = Object.assign( htmlAttributes, {
			href: attributes.url,
			onClick: ( e ) => {
				e.preventDefault();
			},
			rel: relAttributes && relAttributes.length > 0 ? relAttributes.join( ' ' ) : null,
		} );
	}

	return htmlAttributes;
}

function changeTagName( tagName, attributes ) {
	if ( '' !== attributes.url && 'wrapper' === attributes.linkType ) {
		tagName = 'a';
	}

	return tagName;
}

function addMainCSS( css, props, name ) {
	const allowedAreas = [ 'container' ];

	if ( ! allowedAreas.includes( name ) ) {
		return css;
	}

	const attributes = applyFilters( 'generateblocks.editor.cssAttrs', props.attributes, props );

	const {
		uniqueId,
		url,
		linkType,
		textColor,
		textColorHover,
		isGrid,
		minHeight,
	} = attributes;

	let wrapperDisplay = 'block';

	if ( !! isGrid || minHeight ) {
		wrapperDisplay = 'flex';
	}

	if ( '' !== url && 'hidden-link' === linkType ) {
		addToCSS( css, '.gb-container-' + uniqueId, {
			position: 'relative',
		} );
	}

	if ( '' !== url && 'wrapper' === linkType ) {
		addToCSS( css, '.gb-container-' + uniqueId, {
			display: wrapperDisplay,
		} );

		addToCSS( css, '.block-editor-block-list__block a.gb-container-' + uniqueId + ', .block-editor-block-list__block a.gb-container-' + uniqueId + ':visited', {
			color: textColor,
		} );

		addToCSS( css, '.block-editor-block-list__block a.gb-container-' + uniqueId + ':hover, .block-editor-block-list__block a.gb-container-' + uniqueId + ':focus, .block-editor-block-list__block a.gb-container-' + uniqueId + ':active', {
			color: textColorHover,
		} );
	}

	return css;
}

/**
 * Add controls to the Container block toolbar.
 *
 * @param {Function} BlockEdit Block edit component.
 *
 * @return {Function} BlockEdit Modified block edit component.
 */
const addContainerLinkToolbar = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const {
			name,
			attributes,
			isSelected,
			setAttributes,
		} = props;

		const {
			url,
			linkType,
			hiddenLinkAriaLabel,
			target,
			relSponsored,
			relNoFollow,
		} = attributes;

		const POPOVER_PROPS = {
			className: 'block-editor-block-settings-menu__popover',
			position: 'bottom right',
		};

		let typeMessage = __( 'This makes your Element Tag a link element. It uses valid HTML5 coding but will break if you add interative elements (links or buttons) inside the container.', 'generateblocks-pro' );

		if ( 'hidden-link' === linkType ) {
			typeMessage = __( 'This adds a hidden link inside your container and tells it to cover the entire element. It is less prone to breakage, but is not as clean as the wrapper method.', 'generateblocks-pro' );
		}

		return (
			<Fragment>
				<BlockEdit { ...props } />

				{ isSelected && 'generateblocks/container' === name &&
					<Fragment>
						<BlockControls>
							<ToolbarGroup>
								<Dropdown
									contentClassName="gblocks-container-link-dropdown"
									popoverProps={ POPOVER_PROPS }
									renderToggle={ ( { isOpen, onToggle } ) => (
										<ToolbarButton
											icon={ getIcon( 'link' ) }
											label={ ! url ? __( 'Set Container Link', 'generateblocks-pro' ) : __( 'Change Container Link', 'generateblocks-pro' ) }
											onClick={ onToggle }
											aria-expanded={ isOpen }
											isPressed={ !! url }
										/>
									) }
									renderContent={ () => (
										<Fragment>
											<BaseControl
												className="gblocks-container-link-wrapper"
											>
												<URLInput
													className={ 'gblocks-container-link' }
													value={ url }
													onChange={ ( value ) => {
														setAttributes( {
															url: value,
														} );
													} }
												/>
											</BaseControl>

											{ '' !== url &&
												<Fragment>
													<ToggleControl
														label={ __( 'Open link in a new tab', 'generateblocks-pro' ) }
														checked={ target || '' }
														onChange={ ( value ) => {
															setAttributes( {
																target: value,
															} );
														} }
													/>

													<ToggleControl
														label={ __( 'Add rel="nofollow"', 'generateblocks-pro' ) }
														checked={ relNoFollow || '' }
														onChange={ ( value ) => {
															setAttributes( {
																relNoFollow: value,
															} );
														} }
													/>

													<ToggleControl
														label={ __( 'Add rel="sponsored"', 'generateblocks-pro' ) }
														checked={ relSponsored || '' }
														onChange={ ( value ) => {
															setAttributes( {
																relSponsored: value,
															} );
														} }
													/>

													<SelectControl
														label={ __( 'Link Type', 'generateblocks-pro' ) }
														help={ typeMessage }
														value={ linkType }
														options={ [
															{ label: __( 'Hidden Link', 'generateblocks-pro' ), value: 'hidden-link' },
															{ label: __( 'Wrapper', 'generateblocks-pro' ), value: 'wrapper' },
														] }
														onChange={ ( value ) => {
															setAttributes( {
																linkType: value,
															} );
														} }
													/>
												</Fragment>
											}

											{ '' !== url && 'hidden-link' === linkType &&
												<TextControl
													label={ __( 'Aria Label', 'generateblocks-pro' ) }
													help={ __( 'Help screen readers understand what this link does.', 'generateblocks-pro' ) }
													type={ 'text' }
													value={ hiddenLinkAriaLabel }
													onChange={ ( value ) => {
														setAttributes( {
															hiddenLinkAriaLabel: DOMPurify.sanitize( value ),
														} );
													} }
												/>
											}
										</Fragment>
									) }
								/>
							</ToolbarGroup>
						</BlockControls>
					</Fragment>
				}
			</Fragment>
		);
	};
}, 'addContainerLinkToolbar' );

addFilter(
	'blocks.registerBlockType',
	'generateblocks-pro/container-link/add-attributes',
	addAttributes
);

addFilter(
	'generateblocks.frontend.htmlAttributes',
	'generateblocks-pro/container-link/add-href-attribute',
	addLinkWrapper
);

addFilter(
	'generateblocks.frontend.containerTagName',
	'generateblocks-pro/container-link/add-tag-name',
	changeTagName
);

addFilter(
	'generateblocks.frontend.insideContainer',
	'generateblocks-pro/container-link/add-hidden-link',
	addHiddenLink
);

addFilter(
	'generateblocks.editor.mainCSS',
	'generateblocks-pro/container-link/add-main-css',
	addMainCSS
);

addFilter(
	'editor.BlockEdit',
	'generateblocks-pro/container-link/toolbar',
	addContainerLinkToolbar
);
