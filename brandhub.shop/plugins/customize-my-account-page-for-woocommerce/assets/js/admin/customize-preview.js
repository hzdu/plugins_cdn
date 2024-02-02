/* global _tgwcCustomizePreviewL10n */
( function( $, api, data ) {
	var parentApi        = parent.window.wp.customize,
		defaultUnit      = 'px',
		setting          = 'tgwc_customize',
		$container       = $( '#tgwc-woocommerce' ),
		$anchors         = $container.find( 'a' ),
		$avatar          = $container.find( '.tgwc-user-avatar' ),
		$avatarType      = $container.find( '.tgwc-user-avatar-image-wrap' ),
		$buttons         = $container.find( 'button, a.woocommerce-Button, a.button' ),
		$inputs          = $container.find( '.woocommerce-Input' ),
		$nav             = $container.find( 'nav' ),
		$navWrapper      = $container.find( '.tgwc-woocommerce-MyAccount-navigation-wrap' ),
		$navContent      = $container.find( '.woocommerce-MyAccount-content' ),
		$controlsWrapper = $( parent.document ).find( '#customize-controls' ),
		$previewButtons  = $controlsWrapper.find( '#customize-footer-actions .devices button' ),
		$editShortcut    = $container.find( '.customize-partial-edit-shortcut' );

	$editShortcut.on(
		'mouseover',
		function() {
			$( this ).parent().css( { outline: '1px solid #3582c4', outlineOffset: '-1px' } );
		}
	);

	$editShortcut.on(
		'mouseleave',
		function() {
			$( this ).parent().css( { outline: '', outlineOffset: '' } );
		}
	);

	$editShortcut.on(
		'click',
		function( e ) {
			e.preventDefault();
			var $parent = $( this ).parent();
			switch ( true ) {
				case $parent.hasClass( 'tgwc-woocommerce-MyAccount-navigation-wrap' ):
					parentApi.section( 'tgwc_customize[navigation]' ).focus();
					break;
				case $parent.hasClass( 'woocommerce' ):
					parentApi.section( 'tgwc_customize[wrapper]' ).focus();
					break;
				case $parent.hasClass( 'tgwc-user-avatar' ):
					parentApi.section( 'tgwc_customize[avatar]' ).focus();
					break;
				case $parent.hasClass( 'woocommerce-MyAccount-content' ):
					parentApi.section( 'tgwc_customize[content]' ).focus();
					break;
			}
		}
	);

	/**
	 * Add Google font link into header.
	 *
	 * @param {string} font_name Google Font Name.
	 */
	function addGoogleFont( font_name ) {
		var font_plus = '',
			font_name = font_name.split( ' ' );

		if ( $.isArray( font_name ) ) {
			font_plus = font_name[0];
			for ( var i = 1; i < font_name.length; i++ ) {
				font_plus = font_plus + '+' + font_name[ i ];
			}
		}

		$( '<link href="https://fonts.googleapis.com/css?family=' + font_plus + '" rel="stylesheet" type="text/css">' ).appendTo( 'head' );
	}

	/**
	 * Wrapper: menu style (navigation style).
	 */
	api(
		setting + '[wrapper][menu_style]',
		function( value ) {
			var $ul      = undefined;
			$container.attr( 'data-menu-style', value.get() );

			if ( 'tab' === value.get() ) {
				$ul = $navWrapper.find( 'ul' ).first().scrollTabs();
			}

			value.bind(
				function( newValue ) {
					$container.attr( 'data-menu-style', newValue );

					if ( 'tab' === newValue ) {
						$navWrapper.find( 'a' ).off();
						$ul = $navWrapper.find( 'ul' ).first().scrollTabs();
						$navWrapper.find( '.tgwc-group > a > .tgwc-icon' ).hide();
					} else {
						$navWrapper.find( 'a' ).find( 'a' ).off();
						$navWrapper.find( '.tgwc-group > a > .tgwc-icon' ).show();
						if ( undefined === $ul ) {
							var $navContainer = $nav.find( '.scroll_tab_inner' ).clone();
							$navContainer.find( 'li' ).removeAttr( 'style' );

							$lis = $navContainer.children().filter(
								function( index, li ) {
									return $( li ).prop( 'tagName' ) === 'LI';
								}
							);

							$navWrapper.find( '.scroll_tabs_container' ).remove();
							$navWrapper.html( '<ul>' );
							$nav.find( 'ul' ).append( $lis );

						} else {
							$ul.destroy();
						}
					}

					// When menu style is changed from tab to sidebar,
					// apply all the navigation normal styles.
					var setting              = 'tgwc_customize[navigation][normal]',
					navColor                 = parentApi.control( setting + '[color]' ),
					navBackgroundColor       = parentApi.control( setting + '[background_color]' ),
					navBorderStyle           = parentApi.control( setting + '[border_style]' ),
					navBorderWidth           = parentApi.control( setting + '[border_width]' ),
					navBorderColor           = parentApi.control( setting + '[border_color]' ),
					navHoverColor            = parentApi.control( 'tgwc_customize[navigation][hover][color]' ),
					navHoverBackgroundColor  = parentApi.control( 'tgwc_customize[navigation][hover][background_color]' ),
					navHoverBorderStyle      = parentApi.control( 'tgwc_customize[navigation][hover][border_style]' ),
					navHoverBorderWidth      = parentApi.control( 'tgwc_customize[navigation][hover][border_width]' ),
					navHoverBorderColor      = parentApi.control( 'tgwc_customize[navigation][hover][border_color]' ),
					navActiveColor           = parentApi.control( 'tgwc_customize[navigation][active][color]' ),
					navActiveBackgroundColor = parentApi.control( 'tgwc_customize[navigation][active][background_color]' ),
					navActiveBorderStyle     = parentApi.control( 'tgwc_customize[navigation][active][border_style]' ),
					navActiveBorderWidth     = parentApi.control( 'tgwc_customize[navigation][active][border_width]' ),
					navActiveBorderColor     = parentApi.control( 'tgwc_customize[navigation][active][border_color]' ),
					navWrapperPadding        = parentApi.control( 'tgwc_customize[navigation][general][wrapper_padding]' ),
					navWrapperMargin         = parentApi.control( 'tgwc_customize[navigation][general][wrapper_margin]' ),
					previewedDevice          = parentApi.previewedDevice();

					if ( navWrapperPadding.setting._dirty ) {
						var padding = navWrapperPadding.setting.get();

						if ( 'sidebar' === newValue ) {
							if ( padding.hasOwnProperty( previewedDevice ) ) {
								$.each( padding[ previewedDevice ], function( prop, val ) {
									$nav.css( 'padding-' + prop, val + 'px' );
								} );
							}
						} else {
							$.each( [ 'top', 'right', 'bottom', 'left' ], function( _, val ) {
								$nav.css( 'padding-' + val, '' );
							} )
						}
					}

					if ( navWrapperMargin.setting._dirty ) {
						var margin = navWrapperMargin.setting.get();

						if ( 'tab' === newValue ) {
							if ( margin.hasOwnProperty( previewedDevice ) ) {
								$.each( margin[ previewedDevice ], function( prop, val ) {
									$navWrapper.css( 'margin-' + prop, val + 'px' );
								} );
							}
						} else {
							$.each( [ 'top', 'right', 'bottom', 'left' ], function( _, val ) {
								$navWrapper.css( 'margin-' + val, '' );
							} );
						}
					}

					if ( navHoverColor.setting._dirty ) {
						$navWrapper.find( 'a' ).mouseenter(
							function( e ){
								$( this ).css( 'color', navHoverColor.setting.get() );
							}
						);
					}

					if ( navHoverBackgroundColor.setting._dirty ) {
						$navWrapper.find( 'a' ).mouseenter(
							function( e ){
								$( this ).css( 'background-color', navHoverBackgroundColor.setting.get() );
							}
						);
					}

					if ( navHoverBorderStyle.setting._dirty ) {
						$navWrapper.find( 'a' ).mouseenter(
							function( e ){
								$( this ).css( 'border-style', navHoverBorderStyle.setting.get() );
							}
						);
					}

					if ( navHoverBorderColor.setting._dirty ) {
						$navWrapper.find( 'a' ).mouseenter(
							function( e ){
								$( this ).css( 'border-color', navHoverBorderColor.setting.get() );
							}
						);
					}

					if (navHoverBorderWidth.setting._dirty ) {
						let newValue = navHoverBorderWidth.setting.get();

						if ( typeof newValue != 'object' ) {
							newValue = JSON.parse( newValue );
						}

						$navWrapper.find( 'a' ).mouseenter(
							function( e ) {
								$.each(
									newValue,
									$.proxy(
										function( prop, val ) {
											$( this ).css( 'border-' + prop + '-width', val + 'px' );
										},
										this
									)
								);
							}
						);
					}

					if ( navColor.setting._dirty ) {
						$navWrapper.find( 'a' ).css( 'color', navColor.setting.get() );
						$navWrapper.find( 'a' ).mouseleave(
							function( e ){
								$( this ).css( 'color', navColor.setting.get() );
							}
						);
					}

					if ( navBackgroundColor.setting._dirty ) {
						$navWrapper.find( 'a' ).css( 'background-color', navBackgroundColor.setting.get() );
						$navWrapper.find( 'a' ).mouseleave(
							function( e ){
								$( this ).css( 'background-color', navBackgroundColor.setting.get() );
							}
						);
					}

					if ( navBorderStyle.setting._dirty ) {
						$navWrapper.find( 'a' ).css( 'border-style', navBorderStyle.setting.get() );
						$navWrapper.find( 'a' ).mouseleave(
							function( e ){
								$( this ).css( 'border-style', navBorderStyle.setting.get() );
							}
						);
					}

					if ( navBorderColor.setting._dirty ) {
						$navWrapper.find( 'a' ).css( 'border-color', navBorderColor.setting.get() );
						$navWrapper.find( 'a' ).mouseleave(
							function( e ){
								$( this ).css( 'border-color', navBorderColor.setting.get() );
							}
						);
					}

					if (navBorderWidth.setting._dirty ) {
						let newValue = navBorderWidth.setting.get();

						if ( typeof newValue != 'object' ) {
							newValue = JSON.parse( newValue );
						}

						$.each(
							newValue,
							function( prop, val ) {
								$navWrapper.find( 'a' ).css( 'border-' + prop + '-width', val + defaultUnit );
							}
						);

						$navWrapper.find( 'a' ).mouseleave(
							function( e ) {
								$.each(
									newValue,
									$.proxy(
										function( prop, val ) {
											$( this ).css( 'border-' + prop + '-width', val + 'px' );
										},
										this
									)
								);
							}
						);

						$navWrapper.find( 'a' ).mouseleave(
							function( e ){
								let newValue = navBorderWidth.setting.get();

								if ( typeof newValue != 'object' ) {
									newValue = JSON.parse( newValue );
								}

								$.each(
									newValue,
									function( prop, val ) {
										$navWrapper.find( 'a' ).css( 'border-' + prop + '-width', val + defaultUnit );
									}
								);

								$navWrapper.find( 'a' ).mouseleave(
									function( e ) {
										$.each(
											newValue,
											$.proxy(
												function( prop, val ) {
														$( this ).css( 'border-' + prop + '-width', val + 'px' );
												},
												this
											)
										);
									}
								);
							}
						);
					}
				}
			);
		}
	);

	/**
	 * Wrapper: sidebar position.
	 */
	api(
		setting + '[wrapper][sidebar_position]',
		function( value ) {
			$container.attr( 'data-sidebar-position', value.get() );

			value.bind(
				function( newValue ) {
					$container.attr( 'data-sidebar-position', newValue );
				}
			);
		}
	);

	/**
	 * Wrapper: font family.
	 */
	api(
		setting + '[wrapper][font_family]',
		function ( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				addGoogleFont( value.get() );
				$container.css( 'font-family', value.get() );
				$container.find( 'p' ).css( 'font-family', value.get() );
				$container.find( '.tgwc-field-title h3' ).css( 'font-family', 'inherit' );
			}

			value.bind(
				function( newValue ) {
					if ( '' === newValue ) {
						$container.css( 'font-family', 'inherit' );
						$container.find( 'p' ).css( 'font-family', 'inherit' );
						$container.find( '.tgwc-field-title h3' ).css( 'font-family', 'inherit' );
					} else {
						addGoogleFont( newValue );
						$container.css( 'font-family', newValue );
						$container.find( 'p' ).css( 'font-family', newValue );
						$container.find( '.tgwc-field-title h3' ).css( 'font-family', 'inherit' );
					}
				}
			);
		}
	);

	/**
	 * Wrapper: font size.
	 */
	api(
		setting + '[wrapper][font_size]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				$container.css( 'font-size', value.get() + defaultUnit );
			}

			value.bind(
				function( newValue ) {
					$container.css( 'font-size', newValue + defaultUnit );
					$container.find( 'p' ).css( 'font-size', newValue + defaultUnit );
				}
			);
		}
	);

	/**
	 * Wrapper: Background color.
	 */
	api(
		setting + '[wrapper][background_color]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				$container.css( 'background-color', value.get() );
			}

			value.bind(
				function( newValue ) {
					$container.css( 'background-color', newValue );
				}
			);
		}
	);

	/**
	 * Wrapper: Padding.
	 */
	api(
		setting + '[wrapper][padding]',
		function( value ) {
			$previewButtons.click(
				function( e ) {
					var controlValue     = value.get(),
					activeResponseDevice = $( this ).data( 'device' );

					$container.css( 'padding', '' );
					if ( typeof controlValue[ activeResponseDevice ] === undefined ) {
						activeResponseDevice = 'desktop';
					}

					$.each(
						controlValue[ activeResponseDevice ],
						function( prop, val ) {
							$container.css( 'padding-' + prop, val + defaultUnit );
						}
					);
				}
			);

			if ( parentApi.control( value.id ).setting._dirty ) {
				$previewButtons.filter( '.active' ).trigger( 'click' );
			}

			value.bind(
				function( newValue ) {
					var activeResponseDevice = $previewButtons.filter( '.active' ).data( 'device' );

					if ( typeof newValue != 'object' ) {
						newValue = JSON.parse( newValue );
					}

					$.each(
						newValue[ activeResponseDevice ],
						function( prop, val ) {
							$container.css( 'padding-' + prop, val + defaultUnit );
						}
					);
				}
			);
		}
	);

	/**
	 * Wrapper: Margin.
	 */
	api(
		setting + '[wrapper][margin]',
		function( value ) {
			$previewButtons.click(
				function( e ) {
					var controlValue     = value.get(),
					activeResponseDevice = $( this ).data( 'device' );

					$container.css( 'margin', '' );
					if ( typeof controlValue[ activeResponseDevice ] === undefined ) {
						activeResponseDevice = 'desktop';
					}

					$.each(
						controlValue[ activeResponseDevice ],
						function( prop, val ) {
							$container.css( 'margin-' + prop, val + defaultUnit );
						}
					);
				}
			);

			if ( parentApi.control( value.id ).setting._dirty ) {
				$previewButtons.filter( '.active' ).trigger( 'click' );
			}

			value.bind(
				function( newValue ) {
					var activeResponseDevice = $previewButtons.filter( '.active' ).data( 'device' );

					if ( typeof newValue != 'object' ) {
						newValue = JSON.parse( newValue );
					}

					$.each(
						newValue[ activeResponseDevice ],
						function( prop, val ) {
							$container.css( 'margin-' + prop, val + defaultUnit );
						}
					);
				}
			);
		}
	);

	/**
	 * Color: heading color.
	 */
	api(
		setting + '[color][heading]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				$container.find( ':header' ).css( 'color', value.get() );
			}

			value.bind(
				function( newValue ) {
					$container.find( ':header' ).css( 'color', newValue );
				}
			);
		}
	);

	/**
	 * Color: body color.
	 */
	api(
		setting + '[color][body]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				$container.css( 'color', value.get() );
			}

			value.bind(
				function( newValue ) {
					$container.css( 'color', newValue );
				}
			);
		}
	);

	/**
	 * Color: link color.
	 */
	api(
		setting + '[color][link]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				$anchors.css( 'color', value.get() );
			}

			value.bind(
				function( newValue ) {
					$anchors.css( 'color', newValue );
					$anchors.mouseleave(
						function( e ) {
							$( this ).css( 'color', newValue );
						}
					);
				}
			);
		}
	);

	/**
	 * Color: link hover color.
	 */
	api(
		setting + '[color][link_hover]',
		function( value ) {
			value.bind(
				function( newValue ) {
					var linkControl = parentApi.control( setting + '[color][link]' );

					if ( ! linkControl.setting._dirty ) {
						$anchors.mouseleave(
							function( e ) {
								$( this ).css( 'color', '' );
							}
						);
					}

					$anchors.mouseenter(
						function( e ) {
							$( this ).css( 'color', newValue );
						}
					);
				}
			);
		}
	);

	/**
	 * Avatar: Layout Style
	 */
	api(
		setting + '[avatar][layout]',
		function( value ) {
			var align = [ 'left', 'right', 'center', 'vertical' ];
			$avatar.addClass( 'tgwc-user-avatar--' + value.get() + '-aligned' );

			value.bind(
				function( newValue ) {
					$.each(
						align,
						function( index, align ) {
							var avatarClass = 'tgwc-user-avatar--' + align + '-aligned';
							if ( $avatar.hasClass( avatarClass ) ) {
								$avatar.removeClass( avatarClass );
								return false;
							}
						}
					);

					$avatar.addClass( 'tgwc-user-avatar--' + newValue + '-aligned' );
				}
			);
		}
	);

	/**
	 * Avatar: Thumbnail Image Style.
	 */
	api(
		setting + '[avatar][type]',
		function( value ) {
			var type = [ 'square', 'circle' ];
			$avatarType.addClass( 'tgwc-user-avatar-image-wrap--' + value.get() );

			value.bind(
				function( newValue ) {
					$.each(
						type,
						function( index, type ) {
							var avatarClass = 'tgwc-user-avatar-image-wrap--' + type;
							if ( $avatarType.hasClass( avatarClass ) ) {
								$avatarType.removeClass( avatarClass );
								return false;
							}
						}
					);

					$avatarType.addClass( 'tgwc-user-avatar-image-wrap--' + newValue );
				}
			);
		}
	);

	/**
	 * Avatar: Padding.
	 */
	api(
		setting + '[avatar][padding]',
		function( value ) {
			$previewButtons.click(
				function( e ) {
					var controlValue     = value.get(),
					activeResponseDevice = $( this ).data( 'device' );

					$avatar.css( 'padding', '' );
					if ( typeof controlValue[ activeResponseDevice ] === undefined ) {
						activeResponseDevice = 'desktop';
					}

					$.each(
						controlValue[ activeResponseDevice ],
						function( prop, val ) {
							$avatar.css( 'padding-' + prop, val + defaultUnit );
						}
					);
				}
			);

			if ( parentApi.control( value.id ).setting._dirty ) {
				$previewButtons.filter( '.active' ).trigger( 'click' );
			}

			value.bind(
				function( newValue  ) {
					var activeResponseDevice = $previewButtons.filter( '.active' ).data( 'device' );

					if ( typeof newValue != 'object' ) {
						newValue = JSON.parse( newValue );
					}

					$.each(
						newValue[ activeResponseDevice ],
						function( prop, val ) {
							$avatar.css( 'padding-' + prop, val + defaultUnit );
						}
					);
				}
			);
		}
	);

	/**
	 * Navigation -> General: Padding.
	 */
	api(
		setting + '[navigation][general][padding]',
		function( value ) {
			$previewButtons.click(
				function( e ) {
					var controlValue     = value.get(),
					activeResponseDevice = $( this ).data( 'device' );

					$nav.css( 'padding', '' );
					if ( typeof controlValue[ activeResponseDevice ] === undefined ) {
						activeResponseDevice = 'desktop';
					}

					$.each(
						controlValue[ activeResponseDevice ],
						function( prop, val ) {
							$navWrapper.find( 'a' ).css( 'padding-' + prop, val + defaultUnit );
						}
					);
				}
			);

			if ( parentApi.control( value.id ).setting._dirty ) {
				$previewButtons.filter( '.active' ).trigger( 'click' );
			}

			value.bind(
				function( newValue ) {
					var activeResponseDevice = $previewButtons.filter( '.active' ).data( 'device' );

					if ( typeof newValue != 'object' ) {
						newValue = JSON.parse( newValue );
					}

					$.each(
						newValue[ activeResponseDevice ],
						function( prop, val ) {
							$navWrapper.find( 'a' ).css( 'padding-' + prop, val + defaultUnit );
						}
					);
				}
			);
		}
	);

	api(
		setting + '[navigation][general][wrapper_padding]',
		function( value ) {
			$previewButtons.click(
				function( e ) {
					var controlValue     = value.get(),
						activeResponseDevice = $( this ).data( 'device' );

					$nav.css( 'padding', '' );
					if ( typeof controlValue[ activeResponseDevice ] === undefined ) {
						activeResponseDevice = 'desktop';
					}

					$.each(
						controlValue[ activeResponseDevice ],
						function( prop, val ) {
							$nav.css( 'padding-' + prop, val + defaultUnit );
						}
					);
				}
			);

			if ( parentApi.control( value.id ).setting._dirty ) {
				$previewButtons.filter( '.active' ).trigger( 'click' );
			}

			value.bind(
				function( newValue ) {
					var activeResponseDevice = $previewButtons.filter( '.active' ).data( 'device' );

					if ( typeof newValue != 'object' ) {
						newValue = JSON.parse( newValue );
					}

					$.each(
						newValue[ activeResponseDevice ],
						function( prop, val ) {
							$nav.css( 'padding-' + prop, val + defaultUnit );
						}
					);
				}
			);
		}
	);

	api(
		setting + '[navigation][general][wrapper_margin]',
		function( value ) {
			$previewButtons.click(
				function( e ) {
					var controlValue     = value.get(),
						activeResponseDevice = $( this ).data( 'device' );

					$navWrapper.css( 'margin', '' );
					if ( typeof controlValue[ activeResponseDevice ] === undefined ) {
						activeResponseDevice = 'desktop';
					}

					$.each(
						controlValue[ activeResponseDevice ],
						function( prop, val ) {
							$navWrapper.css( 'margin-' + prop, val + defaultUnit );
						}
					);
				}
			);

			if ( parentApi.control( value.id ).setting._dirty ) {
				$previewButtons.filter( '.active' ).trigger( 'click' );
			}

			value.bind(
				function( newValue ) {
					var activeResponseDevice = $previewButtons.filter( '.active' ).data( 'device' );

					if ( typeof newValue != 'object' ) {
						newValue = JSON.parse( newValue );
					}

					$.each(
						newValue[ activeResponseDevice ],
						function( prop, val ) {
							$navWrapper.css( 'margin-' + prop, val + defaultUnit );
						}
					);
				}
			);
		}
	);

	/**
	 * Navigation -> Normal: Text color.
	 */
	api(
		setting + '[navigation][normal][color]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				$navWrapper.find( 'li:not(.is-active) a' ).css( 'color', value.get() );
			}

			value.bind(
				function( newValue  ) {
					$navWrapper.find( 'li:not(.is-active) a' ).css( 'color', newValue );
					$navWrapper.find( 'li:not(.is-active) a' ).mouseleave(
						function( e ) {
							$( this ).css( 'color', newValue );
						}
					);
				}
			);
		}
	);

	/**
	 * Navigation -> Normal: Background color.
	 */
	api(
		setting + '[navigation][normal][background_color]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				$navWrapper.find( 'li:not(.is-active) a' ).css( 'background-color', value.get() );
			}

			value.bind(
				function( newValue  ) {
					$navWrapper.find( 'li:not(.is-active) a' ).css( 'background-color', newValue );
					$navWrapper.find( 'li:not(.is-active) a' ).mouseleave(
						function( e ) {
							$( this ).css( 'background-color', newValue );
						}
					);
				}
			);
		}
	);

	/**
	 * Navigation -> Normal: Border.
	 */
	api(
		setting + '[navigation][normal][border_style]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				$navWrapper.find( 'li:not(.is-active) a' ).css( 'border-style', value.get( 0 ) );
			}

			value.bind(
				function( newValue  ) {
					$navWrapper.find( 'li:not(.is-active) a' ).css( 'border-style', newValue );
					$navWrapper.find( 'li:not(.is-active) a' ).mouseleave(
						function( e ) {
							$( this ).css( 'border-style', newValue );
						}
					);
				}
			);
		}
	);

	/**
	 * Navigation -> Normal: Border width.
	 */
	api(
		setting + '[navigation][normal][border_width]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				if ( typeof value.get() != 'object' ) {
					newValue = JSON.parse( value.get() );
				}

				$.each(
					newValue,
					function( prop, val ) {
						$navWrapper.find( 'li:not(.is-active) a' ).css( 'border-' + prop + '-width', val + defaultUnit );
					}
				);

				$navWrapper.find( 'li:not(.is-active) a' ).mouseleave(
					function( e ) {
						$.each(
							newValue,
							$.proxy(
								function( prop, val ) {
										$( this ).css( 'border-' + prop + '-width', val + 'px' );
								},
								this
							)
						);
					}
				);
			}

			value.bind(
				function( newValue  ) {
					if ( typeof newValue != 'object' ) {
						newValue = JSON.parse( newValue );
					}

					$.each(
						newValue,
						function( prop, val ) {
							$navWrapper.find( 'li:not(.is-active) a' ).css( 'border-' + prop + '-width', val + defaultUnit );
						}
					);

					$navWrapper.find( 'li:not(.is-active) a' ).mouseleave(
						function( e ) {
							$.each(
								newValue,
								$.proxy(
									function( prop, val ) {
										$( this ).css( 'border-' + prop + '-width', val + 'px' );
									},
									this
								)
							);
						}
					);
				}
			);
		}
	);

	/**
	 * Navigation -> Normal: Border color.
	 */
	api(
		setting + '[navigation][normal][border_color]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				$navWrapper.find( 'li:not(.is-active) a' ).css( 'border-color', value.get() );
			}
			value.bind(
				function( newValue  ) {
					$navWrapper.find( 'li:not(.is-active) a' ).css( 'border-color', newValue );
					$navWrapper.find( 'li:not(.is-active) a' ).mouseleave(
						function( e ) {
							$( this ).css( 'border-color', newValue );
						}
					);
				}
			);
		}
	);

	/**
	 * Navigation -> Active: Text color.
	 */
	api(
		setting + '[navigation][active][color]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				$navWrapper.find( '.is-active > a' ).css( 'color', value.get() );
			}

			value.bind(
				function( newValue  ) {
					$navWrapper.find( '.is-active > a' ).css( 'color', newValue );
					$navWrapper.find( '.is-active > a' ).mouseleave(
						function( e ) {
							$( this ).css( 'color', newValue );
						}
					);
				}
			);
		}
	);

	/**
	 * Navigation -> Active: Background color.
	 */
	api(
		setting + '[navigation][active][background_color]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				$navWrapper.find( '.is-active > a' ).css( 'background-color', value.get() );
			}

			value.bind(
				function( newValue  ) {
					$navWrapper.find( '.is-active > a' ).css( 'background-color', newValue );
					$navWrapper.find( '.is-active > a' ).mouseleave(
						function( e ) {
							$( this ).css( 'background-color', newValue );
						}
					);
				}
			);
		}
	);

	/**
	 * Navigation -> Active: Border.
	 */
	api(
		setting + '[navigation][active][border_style]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				$navWrapper.find( '.is-active > a' ).css( 'border-style', value.get( 0 ) );
			}

			value.bind(
				function( newValue  ) {
					$navWrapper.find( '.is-active > a' ).css( 'border-style', newValue );
					$navWrapper.find( '.is-active > a' ).mouseleave(
						function( e ) {
							$( this ).css( 'border-style', newValue );
						}
					);
				}
			);
		}
	);

	/**
	 * Navigation -> Active: Border width.
	 */
	api(
		setting + '[navigation][active][border_width]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				if ( typeof value.get() != 'object' ) {
					newValue = JSON.parse( value.get() );
				}

				$.each(
					newValue,
					function( prop, val ) {
						$navWrapper.find( '.is-active > a' ).css( 'border-' + prop + '-width', val + defaultUnit );
					}
				);

				$navWrapper.find( '.is-active > a' ).mouseleave(
					function( e ) {
						$.each(
							newValue,
							$.proxy(
								function( prop, val ) {
									$( this ).css( 'border-' + prop + '-width', val + 'px' );
								},
								this
							)
						);
					}
				);
			}

			value.bind(
				function( newValue  ) {
					if ( typeof newValue != 'object' ) {
						newValue = JSON.parse( newValue );
					}

					$.each(
						newValue,
						function( prop, val ) {
							$navWrapper.find( '.is-active > a' ).css( 'border-' + prop + '-width', val + defaultUnit );
						}
					);

					$navWrapper.find( '.is-active > a' ).mouseleave(
						function( e ) {
							$.each(
								newValue,
								$.proxy(
									function( prop, val ) {
										$( this ).css( 'border-' + prop + '-width', val + 'px' );
									},
									this
								)
							);
						}
					);
				}
			);
		}
	);

	/**
	 * Navigation -> Active: Border color.
	 */
	api(
		setting + '[navigation][active][border_color]',
		function( value ) {
			if ( parentApi.control( value.id ).setting._dirty ) {
				$navWrapper.find( '.is-active > a' ).css( 'border-color', value.get() );
			}
			value.bind(
				function( newValue  ) {
					$navWrapper.find( '.is-active > a' ).css( 'border-color', newValue );
					$navWrapper.find( '.is-active > a' ).mouseleave(
						function( e ) {
							$( this ).css( 'border-color', newValue );
						}
					);
				}
			);
		}
	);

	/**
	 * Navigation -> Hover: Text color.
	 */
	api(
		setting + '[navigation][hover][color]',
		function( value ) {
			var handler = function( newValue  ) {
				var normalControl = parentApi.control( setting + '[navigation][normal][color]' );

				if ( ! normalControl.setting._dirty ) {
					$navWrapper.find( 'a' ).mouseleave(
						function( e ) {
							$( this ).css( 'color', '' );
						}
					);
				}

				$navWrapper.find( 'a' ).mouseenter(
					function( e ) {
						$( this ).css( 'color', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Navigation -> Hover: Background color.
	 */
	api(
		setting + '[navigation][hover][background_color]',
		function( value ) {
			var handler = function( newValue ) {
				var normalControl = parentApi.control( setting + '[navigation][normal][background_color]' );

				if ( ! normalControl.setting._dirty ) {
					$navWrapper.find( 'a' ).mouseleave(
						function( e ) {
							$( this ).css( 'background-color', '' );
						}
					);
				}

				$navWrapper.find( 'a' ).mouseenter(
					function( e ) {
						$( this ).css( 'background-color', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Navigation -> Hover: Border style.
	 */
	api(
		setting + '[navigation][hover][border_style]',
		function( value ) {
			var handler = function( newValue ) {
				var normalControl = parentApi.control( setting + '[navigation][normal][border_style]' );

				if ( ! normalControl.setting._dirty ) {
					$navWrapper.find( 'a' ).mouseleave(
						function( e ) {
							$( this ).css( 'border-style', '' );
						}
					);
				}

				$navWrapper.find( 'a' ).mouseenter(
					function( e ) {
						$( this ).css( 'border-style', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}
			value.bind( handler );
		}
	);

	/**
	 * Navigation -> Hover: Border width.
	 */
	api(
		setting + '[navigation][hover][border_width]',
		function( value ) {
			var handler = function( newValue ) {
				var normalControl = parentApi.control( setting + '[navigation][normal][border_width]' );

				if ( typeof newValue !== 'object' ) {
					newValue = JSON.parse( newValue );
				}

				if ( ! normalControl.setting._dirty ) {
					$navWrapper.find( 'a' ).mouseleave(
						function( e ) {
							$( this ).css(
								{
									'border-top-width': '',
									'border-right-width': '',
									'border-bottom-width': '',
									'border-left-width': '',
								}
							);
						}
					);
				}

				$navWrapper.find( 'a' ).mouseenter(
					function( e ) {
						var newValue = wp.customize.get()[ setting + '[navigation][hover][border_width]' ];

						if ( typeof newValue !== 'object' ) {
							newValue = JSON.parse( newValue );
						}

						$.each(
							newValue,
							$.proxy(
								function( prop, val ) {
										$( this ).css( 'border-' + prop + '-width', val + 'px' );
								},
								this
							)
						);
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Content: Background Color.
	 */
	api(
		setting + '[content][background_color]',
		function( value ) {
			var $contentWrapper = $container.find( '.woocommerce-MyAccount-content' );
			if ( parentApi.control( value.id ).setting._dirty ) {
				$contentWrapper.css( 'background-color', value.get() );
			}

			value.bind(
				function( newValue ) {
					$contentWrapper.css( 'background-color', newValue );
				}
			);
		}
	);

	/**
	 * Content: Margin.
	 */
	api(
		setting + '[content][margin]',
		function( value ) {
			var $contentWrapper = $container.find( '.woocommerce-MyAccount-content' );
			$previewButtons.click(
				function( e ) {
					var controlValue     = value.get(),
						activeResponseDevice = $( this ).data( 'device' );

					$contentWrapper.css( 'margin', '' );
					if ( typeof controlValue[ activeResponseDevice ] === undefined ) {
						activeResponseDevice = 'desktop';
					}

					$.each(
						controlValue[ activeResponseDevice ],
						function( prop, val ) {
							$contentWrapper.css( 'margin-' + prop, val + defaultUnit );
						}
					);
				}
			);

			if ( parentApi.control( value.id ).setting._dirty ) {
				$previewButtons.filter( '.active' ).trigger( 'click' );
			}

			value.bind(
				function( newValue ) {
					var activeResponseDevice = $previewButtons.filter( '.active' ).data( 'device' );

					if ( typeof newValue != 'object' ) {
						newValue = JSON.parse( newValue );
					}

					$.each(
						newValue[ activeResponseDevice ],
						function( prop, val ) {
							$contentWrapper.css( 'margin-' + prop, val + defaultUnit );
						}
					);
				}
			);
		}
	);

	/**
	 * Content: Padding.
	 */
	api(
		setting + '[content][padding]',
		function( value ) {
			var $contentWrapper = $container.find( '.woocommerce-MyAccount-content' );
			$previewButtons.click(
				function( e ) {
					var controlValue     = value.get(),
						activeResponseDevice = $( this ).data( 'device' );

					$contentWrapper.css( 'padding', '' );
					if ( typeof controlValue[ activeResponseDevice ] === undefined ) {
						activeResponseDevice = 'desktop';
					}

					$.each(
						controlValue[ activeResponseDevice ],
						function( prop, val ) {
							$contentWrapper.css( 'padding-' + prop, val + defaultUnit );
						}
					);
				}
			);

			if ( parentApi.control( value.id ).setting._dirty ) {
				$previewButtons.filter( '.active' ).trigger( 'click' );
			}

			value.bind(
				function( newValue ) {
					var activeResponseDevice = $previewButtons.filter( '.active' ).data( 'device' );

					if ( typeof newValue != 'object' ) {
						newValue = JSON.parse( newValue );
					}

					$.each(
						newValue[ activeResponseDevice ],
						function( prop, val ) {
							$contentWrapper.css( 'padding-' + prop, val + defaultUnit );
						}
					);
				}
			);
		}
	);

	/**
	 * Navigation -> Hover: Border color.
	 */
	api(
		setting + '[navigation][hover][border_color]',
		function( value ) {
			var handler = function( newValue ) {
				var normalControl = parentApi.control( setting + '[navigation][normal][border_color]' );

				if ( ! normalControl.setting._dirty ) {
					$navWrapper.find( 'a' ).mouseleave(
						function( e ) {
							$( this ).css( 'border-color', '' );
						}
					);
				}

				$navWrapper.find( 'a' ).mouseenter(
					function( e ) {
						$( this ).css( 'border-color', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Input Field: General.
	 */
	api(
		setting + '[input_field][general][padding]',
		function( value ) {
			$previewButtons.click(
				function( e ) {
					var controlValue     = value.get(),
					activeResponseDevice = $( this ).data( 'device' );

					$inputs.css( 'padding', '' );
					if ( typeof controlValue[ activeResponseDevice ] === undefined ) {
						activeResponseDevice = 'desktop';
					}

					$.each(
						controlValue[ activeResponseDevice ],
						function( prop, val ) {
							$inputs.css( 'padding-' + prop, val + defaultUnit );
						}
					);
				}
			);

			if ( parentApi.control( value.id ).setting._dirty ) {
				$previewButtons.filter( '.active' ).trigger( 'click' );
			}

			value.bind(
				function( newValue ) {
					var activeResponseDevice = $previewButtons.filter( '.active' ).data( 'device' );

					if ( typeof newValue != 'object' ) {
						newValue = JSON.parse( newValue );
					}

					$.each(
						newValue[ activeResponseDevice ],
						function( prop, val ) {
							$inputs.css( 'padding-' + prop, val + defaultUnit );
						}
					);
				}
			);
		}
	);

	/**
	 * Input Field -> Normal: Text color.
	 */
	api(
		setting + '[input_field][normal][color]',
		function( value ) {
			var handler = function( newValue ) {
				$inputs.css( 'color', newValue );
				$inputs.focusout(
					function( e ) {
						$( this ).css( 'color', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}
			value.bind( handler );
		}
	);

	/**
	 * Input Field -> Normal: Background color.
	 */
	api(
		setting + '[input_field][normal][background_color]',
		function( value ) {
			var handler = function( newValue ) {
				$inputs.css( 'background-color', newValue );
				$inputs.focusout(
					function( e ) {
						$( this ).css( 'background-color', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Input Field -> Normal: Border.
	 */
	api(
		setting + '[input_field][normal][border_style]',
		function( value ) {
			var handler = function( newValue ) {
				$inputs.css( 'border-style', newValue );
				$inputs.focusout(
					function( e ) {
						$( this ).css( 'border-style', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Input Field -> Normal: Border width.
	 */
	api(
		setting + '[input_field][normal][border_width]',
		function( value ) {
			var handler = function( newValue ) {

				if ( typeof newValue != 'object' ) {
					newValue = JSON.parse( newValue );
				}

				$.each(
					newValue,
					function( prop, val ) {
						$inputs.css( 'border-' + prop + '-width', val + defaultUnit );
					}
				);

				$inputs.focusout(
					function( e ) {
						$.each(
							newValue,
							$.proxy(
								function( prop, val ) {
									$( this ).css( 'border-' + prop + '-width', val + 'px' );
								},
								this
							)
						);
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Input Field -> Normal: Border color.
	 */
	api(
		setting + '[input_field][normal][border_color]',
		function( value ) {
			var handler = function( newValue ) {
				$inputs.css( 'border-color', newValue );
				$inputs.focusout(
					function( e ) {
						$( this ).css( 'border-color', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}
			value.bind( handler );
		}
	);

	/**
	 * Input Field -> Focus: Text color.
	 */
	api(
		setting + '[input_field][focus][color]',
		function( value ) {
			var handler = function( newValue ) {
				var normalControl = parentApi.control( setting + '[input_field][normal][color]' );

				if ( ! normalControl.setting._dirty ) {
					$inputs.focusout(
						function( e ) {
							$( this ).css( 'color', '' );
						}
					);
				}

				$inputs.focus(
					function( e ){
						$( this ).css( 'color', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Input Field -> Focus: Background color.
	 */
	api(
		setting + '[input_field][focus][background_color]',
		function( value ) {
			var handler = function( newValue ) {
				var normalControl = parentApi.control( setting + '[input_field][normal][background_color]' );

				if ( ! normalControl.setting._dirty ) {
					$inputs.focusout(
						function( e ) {
							$( this ).css( 'background-color', '' );
						}
					);
				}

				$inputs.focus(
					function( e ){
						$( this ).css( 'background-color', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Input Field -> Focus: Border style.
	 */
	api(
		setting + '[input_field][focus][border_style]',
		function( value ) {
			var handler = function( newValue ) {
				var normalControl = parentApi.control( setting + '[input_field][normal][border_style]' );

				if ( ! normalControl.setting._dirty ) {
					$inputs.focusout(
						function( e ) {
							$( this ).css( 'border-style', '' );
						}
					);
				}

				$inputs.focus(
					function( e ){
						$( this ).css( 'border-style', newValue );
					}
				);
			}

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Input Field -> Focus: Border width.
	 */
	api(
		setting + '[input_field][focus][border_width]',
		function( value ) {
			var handler = function( newValue ) {
				var normalControl = parentApi.control( setting + '[input_field][normal][border_width]' );

				if ( typeof newValue !== 'object' ) {
					newValue = JSON.parse( newValue );
				}

				if ( ! normalControl.setting._dirty ) {
					$inputs.focusout(
						function( e ) {
							$( this ).css(
								{
									'border-top-width': '',
									'border-right-width': '',
									'border-bottom-width': '',
									'border-left-width': '',
								}
							);
						}
					);
				}

				$inputs.focus(
					function( e ) {
						var newValue = wp.customize.get()[ setting + '[input_field][focus][border_width]' ];

						if ( typeof newValue !== 'object' ) {
							newValue = JSON.parse( newValue );
						}

						$.each(
							newValue,
							$.proxy(
								function( prop, val ) {
										$( this ).css( 'border-' + prop + '-width', val + 'px' );
								},
								this
							)
						);
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Input Field -> Focus: Border color.
	 */
	api(
		setting + '[input_field][focus][border_color]',
		function( value ) {
			var handler = function( newValue ) {
				var normalControl = parentApi.control( setting + '[input_field][normal][border_color]' );

				if ( ! normalControl.setting._dirty ) {
					$inputs.focusout(
						function( e ) {
							$( this ).css( 'border-color', '' );
						}
					);
				}

				$inputs.focus(
					function( e ){
						$( this ).css( 'border-color', newValue );
					}
				);
			}

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Buttons -> General: Font Size.
	 */
	api(
		setting + '[button][general][font_size]',
		function( value ) {
			var handler = function( newValue ) {
				$buttons.css( 'font-size', newValue + defaultUnit );
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Buttons -> General: Font Size.
	 */
	api(
		setting + '[button][general][line_height]',
		function( value ) {
			var handler = function( newValue ) {
				$buttons.css( 'line-height', newValue );
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Buttons -> General: Padding.
	 */
	api(
		setting + '[button][general][padding]',
		function( value ) {
			$previewButtons.click(
				function( e ) {
					var controlValue     = control._value,
					activeResponseDevice = $( this ).data( 'device' );

					$buttons.css( 'padding', '' );
					if ( typeof controlValue[ activeResponseDevice ] === undefined ) {
						activeResponseDevice = 'desktop';
					}

					$.each(
						controlValue[ activeResponseDevice ],
						function( prop, val ) {
							$buttons.css( 'padding-' + prop, val + defaultUnit );
						}
					);
				}
			);

			var control = parentApi.control( value.id ).setting;
			if ( control._dirty ) {
				$previewButtons.filter( '.active' ).trigger( 'click' );
			}

			value.bind(
				function( newValue ) {
					var activeResponseDevice = $previewButtons.filter( '.active' ).data( 'device' );

					if ( typeof newValue != 'object' ) {
						newValue = JSON.parse( newValue );
					}

					$.each(
						newValue[ activeResponseDevice ],
						function( prop, val ) {
							$buttons.css( 'padding-' + prop, val + defaultUnit );
						}
					);
				}
			);
		}
	);

	/**
	 * Buttons -> General: Margin.
	 */
	api(
		setting + '[button][general][margin]',
		function( value ) {
			$previewButtons.click(
				function( e ) {
					var controlValue     = control._value;
					activeResponseDevice = $( this ).data( 'device' );

					$buttons.css( 'margin', '' );
					if ( typeof controlValue[ activeResponseDevice ] === undefined ) {
						activeResponseDevice = 'desktop';
					}

					$.each(
						controlValue[ activeResponseDevice ],
						function( prop, val ) {
							$buttons.css( 'margin-' + prop, val + defaultUnit );
						}
					);
				}
			);

			var control = parentApi.control( value.id ).setting;
			if ( control._dirty ) {
				$previewButtons.filter( '.active' ).trigger( 'click' );
			}

			value.bind(
				function( newValue ) {
					var activeResponseDevice = $previewButtons.filter( '.active' ).data( 'device' );

					if ( typeof newValue != 'object' ) {
						newValue = JSON.parse( newValue );
					}

					$.each(
						newValue[ activeResponseDevice ],
						function( prop, val ) {
							$buttons.css( 'margin-' + prop, val + defaultUnit );
						}
					);
				}
			);
		}
	);

	/**
	 * Buttons -> Normal: Text color.
	 */
	api(
		setting + '[button][normal][color]',
		function( value ) {
			var handler = function( newValue ) {
				$buttons.css( 'color', newValue );
				$buttons.mouseleave(
					function( e ) {
						$( this ).css( 'color', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Buttons -> Normal: Background color.
	 */
	api(
		setting + '[button][normal][background_color]',
		function( value ) {
			var handler = function( newValue ) {
				$buttons.css( 'background-color', newValue );
				$buttons.mouseleave(
					function( e ) {
						$( this ).css( 'background-color', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Buttons -> Normal: Border Color.
	 */
	api(
		setting + '[button][normal][border_color]',
		function( value ) {
			var handler = function( newValue ) {
				$buttons.css( 'border-color', newValue );
				$buttons.mouseleave(
					function( e ) {
						$( this ).css( 'border-color', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Buttons -> Normal: Border width.
	 */
	api(
		setting + '[button][normal][border_width]',
		function( value ) {
			var handler = function( newValue ) {
				if ( typeof newValue != 'object' ) {
					newValue = JSON.parse( newValue );
				}

				$.each(
					newValue,
					function( prop, val ) {
						$buttons.css( 'border-' + prop + '-width', val + defaultUnit );
					}
				);

				$buttons.mouseleave(
					function( e ) {
						$.each(
							newValue,
							$.proxy(
								function( prop, val ) {
									$( this ).css( 'border-' + prop + '-width', val + 'px' );
								},
								this
							)
						);
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Buttons -> Normal: Border style.
	 */
	api(
		setting + '[button][normal][border_style]',
		function( value ) {
			var handler = function( newValue ) {
				$buttons.css( 'border-style', newValue );
				$buttons.mouseleave(
					function( e ) {
						$( this ).css( 'border-style', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Button -> Hover: Text color.
	 */
	api(
		setting + '[button][hover][color]',
		function( value ) {
			var handler = function( newValue ) {
				var normalControl = parentApi.control( setting + '[button][normal][color]' );

				if ( ! normalControl.setting._dirty ) {
					$buttons.mouseleave(
						function( e ) {
							$( this ).css( 'color', '' );
						}
					);
				}

				$buttons.mouseenter(
					function( e ){
						$( this ).css( 'color', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Button -> Hover: Background color.
	 */
	api(
		setting + '[button][hover][background_color]',
		function( value ) {
			var handler = function( newValue ) {
				var normalControl = parentApi.control( setting + '[button][normal][background_color]' );

				if ( ! normalControl.setting._dirty ) {
					$buttons.mouseleave(
						function( e ) {
							$( this ).css( 'background-color', '' );
						}
					);
				}

				$buttons.mouseenter(
					function( e ){
						$( this ).css( 'background-color', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Button -> Hover: Border style.
	 */
	api(
		setting + '[button][hover][border_style]',
		function( value ) {
			var handler = function( newValue ) {
				var normalControl = parentApi.control( setting + '[button][normal][border_style]' );

				if ( ! normalControl.setting._dirty ) {
					$buttons.mouseleave(
						function( e ) {
							$( this ).css( 'border-style', '' );
						}
					);
				}

				$buttons.mouseenter(
					function( e ){
						$( this ).css( 'border-style', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Button -> Hover: Border width.
	 */
	api(
		setting + '[button][hover][border_width]',
		function( value ) {
			var handler = function( newValue ) {
				var normalControl = parentApi.control( setting + '[button][normal][border_width]' );

				if ( typeof newValue !== 'object' ) {
					newValue = JSON.parse( newValue );
				}

				if ( ! normalControl.setting._dirty ) {
					$buttons.mouseleave(
						function( e ) {
							$( this ).css(
								{
									'border-top-width': '',
									'border-right-width': '',
									'border-bottom-width': '',
									'border-left-width': '',
								}
							);
						}
					);
				}

				$buttons.mouseenter(
					function( e ) {
						var newValue = wp.customize.get()[ setting + '[button][hover][border_width]' ];

						if ( typeof newValue !== 'object' ) {
							newValue = JSON.parse( newValue );
						}

						$.each(
							newValue,
							$.proxy(
								function( prop, val ) {
										$( this ).css( 'border-' + prop + '-width', val + 'px' );
								},
								this
							)
						);
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

	/**
	 * Button -> Hover: Border color.
	 */
	api(
		setting + '[button][hover][border_color]',
		function( value ) {
			var handler = function( newValue ) {
				var normalControl = parentApi.control( setting + '[button][normal][border_color]' );

				if ( ! normalControl.setting._dirty ) {
					$buttons.mouseleave(
						function( e ) {
							$( this ).css( 'border-color', '' );
						}
					);
				}

				$buttons.mouseenter(
					function( e ) {
						$( this ).css( 'border-color', newValue );
					}
				);
			};

			if ( parentApi.control( value.id ).setting._dirty ) {
				handler( value.get() );
			}

			value.bind( handler );
		}
	);

} )( jQuery, wp.customize, _tgwcCustomizePreviewL10n );
