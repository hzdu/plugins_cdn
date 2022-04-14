/**
 * Internal dependencies
 */
import './editor.scss';
import getIcon from '../../utils/get-icon';

/**
 * WordPress dependencies
 */
import {
	__,
} from '@wordpress/i18n';

import {
	Component,
	Fragment,
} from '@wordpress/element';

import {
	BaseControl,
	ToggleControl,
	TextControl,
	PanelBody,
	SelectControl,
	Button,
	Tooltip,
} from '@wordpress/components';

/**
 * Typography Component
 */
class GlobalStylePicker extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			globalStyleLocked: true,
		};
	}

	componentDidMount() {
		if ( generateBlocksPro.isGlobalStyle && ! this.props.attributes.isGlobalStyle ) {
			this.props.setAttributes( {
				isGlobalStyle: true,
			} );

			this.setState( {
				globalStyleLocked: false,
			} );
		}

		if ( ! generateBlocksPro.isGlobalStyle && this.props.attributes.isGlobalStyle ) {
			this.props.setAttributes( {
				isGlobalStyle: false,
			} );
		}
	}

	render() {
		const {
			name,
			attributes,
			setAttributes,
			options,
		} = this.props;

		const {
			uniqueId,
			useGlobalStyle,
			globalStyleId,
		} = attributes;

		const {
			globalStyleLocked,
		} = this.state;

		let idPrefix = '';
		let defaultStyles = {};

		if ( 'generateblocks/button' === name ) {
			idPrefix = 'gb-button-';

			defaultStyles = {
				backgroundColor: generateBlocksStyling.button.backgroundColor,
				textColor: generateBlocksStyling.button.textColor,
				backgroundColorHover: generateBlocksStyling.button.backgroundColorHover,
				textColorHover: generateBlocksStyling.button.textColorHover,
				paddingTop: generateBlocksStyling.button.paddingTop,
				paddingRight: generateBlocksStyling.button.paddingRight,
				paddingBottom: generateBlocksStyling.button.paddingBottom,
				paddingLeft: generateBlocksStyling.button.paddingLeft,
			};
		}

		if ( 'generateblocks/container' === name ) {
			idPrefix = 'gb-container-';

			defaultStyles.paddingTop = generateBlocksDefaults.container.paddingTop;
			defaultStyles.paddingRight = generateBlocksDefaults.container.paddingRight;
			defaultStyles.paddingBottom = generateBlocksDefaults.container.paddingBottom;
			defaultStyles.paddingLeft = generateBlocksDefaults.container.paddingLeft;

			if ( attributes.isGrid ) {
				defaultStyles.width = 50;
				defaultStyles.widthMobile = 100;
				defaultStyles.paddingTop = generateBlocksStyling.container.gridItemPaddingTop;
				defaultStyles.paddingRight = generateBlocksStyling.container.gridItemPaddingRight;
				defaultStyles.paddingBottom = generateBlocksStyling.container.gridItemPaddingBottom;
				defaultStyles.paddingLeft = generateBlocksStyling.container.gridItemPaddingLeft;
			}
		}

		if ( 'generateblocks/headline' === name ) {
			idPrefix = 'gb-headline-';
		}

		if ( 'generateblocks/button-container' === name ) {
			idPrefix = 'gb-button-wrapper-';
		}

		if ( 'generateblocks/grid' === name ) {
			idPrefix = 'gb-grid-wrapper-';

			defaultStyles = {
				horizontalGap: generateBlocksDefaults.gridContainer.horizontalGap,
			};
		}

		return (
			<Fragment>
				{ !! generateBlocksPro.isGlobalStyle &&
					<PanelBody
						title={ __( 'Global Style', 'generateblocks-pro' ) }
						initialOpen={ true }
						icon={ getIcon( 'globe' ) }
						className="gblocks-panel-label"
					>
						<BaseControl
							id="gblocks-global-style-id-field"
							help={ __( 'Name your global style something short, easy to remember, and unique to this type of block.', 'generateblocks-pro' ) }
						>
							<div className="gblocks-global-style-id-field">
								<span className="gblocks-global-style-id-prefix">
									{ idPrefix }
								</span>

								<div className="gblocks-global-style-id-wrap">
									<TextControl
										type="text"
										disabled={ !! globalStyleLocked }
										value={ uniqueId }
										onChange={ ( value ) => {
											// No special characters allowed.
											value = value.replace( /[^\w]/gi, '-' );

											setAttributes( {
												uniqueId: value,
											} );
										} }
										onBlur={ () => this.setState( { globalStyleLocked: true } ) }
									/>

									{ !! globalStyleLocked &&
										<Tooltip text={ __( 'Change Global Style ID', 'generateblocks-pro' ) }>
											<Button
												icon={ getIcon( 'lock' ) }
												onClick={ () => {
													// eslint-disable-next-line
													if ( window.confirm( __( 'Changing this ID will remove the styling from existing blocks using this Global Style.', 'generateblocks-pro' ) ) ) {
														this.setState( { globalStyleLocked: false } );

														setTimeout( () => {
															document.querySelector( '.gblocks-global-style-id-wrap input' ).focus();
														}, 10 );
													}
												} }
											/>
										</Tooltip>
									}
								</div>
							</div>
						</BaseControl>
					</PanelBody>
				}

				{ ! generateBlocksPro.isGlobalStyle &&
					<PanelBody>
						<ToggleControl
							className="gblocks-use-global-style"
							label={ __( 'Use Global Style', 'generateblocks-pro' ) }
							checked={ !! useGlobalStyle }
							onChange={ ( value ) => {
								setAttributes( {
									useGlobalStyle: value,
								} );
							} }
						/>

						{ !! useGlobalStyle &&
							<Fragment>
								<SelectControl
									className="gblocks-choose-global-style"
									value={ globalStyleId }
									options={ options }
									onChange={ ( value ) => {
										const newAttributes = {
											globalStyleId: value,
										};

										// Clear some common style values or add back their defaults.
										if ( Object.keys( defaultStyles ).length ) {
											Object.keys( defaultStyles ).forEach( ( style ) => {
												if ( '' === value ) {
													newAttributes[ style ] = defaultStyles[ style ];
												} else {
													newAttributes[ style ] = '';
												}
											} );
										}

										setAttributes( newAttributes );
									} }
								/>
							</Fragment>
						}
					</PanelBody>
				}
			</Fragment>
		);
	}
}

export default GlobalStylePicker;
