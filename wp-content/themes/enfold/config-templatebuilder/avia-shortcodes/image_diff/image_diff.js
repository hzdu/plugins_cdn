/**
 * ALB Shortcode Image Difference frontend and preview iframe
 *
 * @added by guenter
 * @since 5.5
 */
"use strict";

//	global namespace
var avia_js_shortcodes = avia_js_shortcodes || {};
var aviaJS = aviaJS || {};

(function()
{
	if( ! avia_js_shortcodes.aviaImageDiff )
	{
		class scAviaImageDiff
		{
			container = null;		//	container element
			id = '';
			divider = 'vertical';			//	'vertical' | 'horizontal'
			handle = null;
			settings = {};
			wrapperDiv = []
			btnOverlay = [];
			btnBefore = [];
			btnAfter = [];
			imgBefore = [];
			imgAfter = [];
			imgDimension = {};
			mouseCapture = false;
			touchCapture = false;
			touchMoved = false;
			downScreenX = 0;
			downScreenY = 0;
			downClientX = 0;
			downClientY = 0;
			downHandlePos = 0;
			preview = false;

			constructor( container )
			{
				this.container = container;
				this.container.scAviaImageDiff = this;
				this.id = container.getAttribute('id');

				this.handle = container.getElementsByClassName( 'av-image-diff-handle' );
				if( ! this.handle.length )
				{
					return;
				}

				this.handle = this.handle[0];

				this.init();
			}

			init()
			{
				this.settings = JSON.parse( this.container.dataset.image_diff );
				this.wrapperDiv = this.container.getElementsByClassName( 'av-image-diff-wrapper' );
				this.btnOverlay = this.container.getElementsByClassName( 'av-image-diff-overlay' );
				this.btnBefore = this.btnOverlay[0].getElementsByClassName( 'label-before' );
				this.btnAfter = this.btnOverlay[0].getElementsByClassName( 'label-after' );
				this.imgBefore = this.container.getElementsByClassName( 'av-img-before' );
				this.imgAfter = this.container.getElementsByClassName( 'av-img-after' );

				if( ! this.imgBefore.length || ! this.imgAfter.length )
				{
					this.hideHandlerDOM();
					return;
				}

				if( this.container.classList.contains( 'av-handle-horizontal' ) )
				{
					this.divider = 'horizontal';
				}

				this.preview = document.getElementById( 'av-admin-preview' ) != null;

				this.bindEvents();
				this.initialPositionHandler();
			}

			hideHandlerDOM()
			{
				this.handle.style.display = 'none';

				if( this.btnOverlay.length )
				{
					this.btnOverlay[0].style.display = 'none';
				}
			}

			initialPositionHandler()
			{
				let start = ( 'undefined' == typeof this.settings.drag_start ) ? 50 : parseInt( this.settings.drag_start );
				if( isNaN( start ) )
				{
					start = 50;
				}

				let offset = 0;

				this.imgDimension = this.imgBefore[0].getBoundingClientRect();

				if( this.divider == 'horizontal' )
				{
					offset = this.imgDimension.height * ( start / 100.0 );
				}
				else
				{
					offset = this.imgDimension.width  * ( start / 100.0 );
				}

				this.container.classList.add( 'av-initialise' );

				this.adjustDividerFrame( offset );

				let obj = this;

				setTimeout( function()
				{
					obj.container.classList.remove( 'av-initialise' );
				}, 700 );
			}

			adjustDividerFrame( offset )
			{
				const overhead = 5;

				this.container.classList.remove( 'av-handler-at-before', 'av-handler-at-after');

				offset = Math.round( offset );

				if( offset <= 0 )
				{
					offset = 0;
					this.container.classList.add( 'av-handler-at-before' );
				}

				if( this.divider == 'horizontal' )
				{
					if( offset >= ( this.imgDimension.height + overhead ) )
					{
						offset = Math.round( this.imgDimension.height + overhead );
						this.container.classList.add( 'av-handler-at-after' );
					}

					let bottom = this.imgDimension.height - offset;

					this.handle.style.top = offset + 'px';
					this.imgBefore[0].style['clip-path'] = 'inset( 0 0 ' + bottom + 'px 0 )';
					this.imgAfter[0].style['clip-path'] = 'inset( ' + offset + 'px 0 0 0 )';
				}
				else
				{
					if( offset >= ( this.imgDimension.width + overhead ) )
					{
						offset = Math.round( this.imgDimension.width + overhead );
						this.container.classList.add( 'av-handler-at-after' );
					}

					let right = this.imgDimension.width - offset;

					this.handle.style.left = offset + 'px';
					this.imgBefore[0].style['clip-path'] = 'inset( 0 ' + right + 'px 0 0 )';
					this.imgAfter[0].style['clip-path'] = 'inset( 0 0 0 ' + offset + 'px )';
				}
			}

			bindEvents()
			{
				//	jQuery event hack -> see lottie_animation.js
				this.container.onavia_start_animation = ( e ) =>
				{
					const opt = {
								'bubbles':		true,
								'cancelable':	true
							};

					const event = new CustomEvent( 'avia_start_animation', opt );
					this.container.dispatchEvent( event );
				};

				this.container.addEventListener( 'avia_start_animation', this.onAviaStartAnimation.bind( this ) );


				this.handle.addEventListener( 'click', this.onHandleClick.bind( this ) );
				this.handle.addEventListener( 'mousedown', this.onMouseDown.bind( this ) );

				if( this.wrapperDiv.length > 0 )
				{
					this.wrapperDiv[0].addEventListener( 'click', this.onClickWrapper.bind( this ) );
					this.wrapperDiv[0].addEventListener( 'touchstart', this.onTouchStart.bind( this ) );
				}

				if( this.btnBefore.length > 0 )
				{
					this.btnBefore[0].addEventListener( 'click', this.onClickBtnBefore.bind( this ) );
				}

				if( this.btnAfter.length > 0 )
				{
					this.btnAfter[0].addEventListener( 'click', this.onClickBtnAfter.bind( this ) );
				}

				window.addEventListener( 'mousemove', this.onMouseMove.bind( this ) );
				window.addEventListener( 'mouseup', this.onMouseUp.bind( this ) );
				window.addEventListener( 'touchmove', this.onTouchMove.bind( this ) );
				window.addEventListener( 'touchend', this.onTouchEnd.bind( this ) );
				window.addEventListener( 'resize', aviaJS.aviaJSHelpers.debounce( this.onResize.bind( this ), 200 ) );

				if( this.preview )
				{
					this.container.addEventListener( 'animationend', this.onAnimationEnd.bind( this ) );
				}
			}

			onAviaStartAnimation( event )
			{
				if( this.container.classList.contains( 'avia_animation_finished' ) )
				{
					return;
				}

				if( this.preview )
				{
					//	modal preview does not have waypoint script - simulate it
					this.container.classList.add( 'avia_start_animation', 'avia_animation_finished' );
				}

				if( 'undefined' != typeof event )
				{
					this.container.classList.add( 'avia_animation_finished', 'avia_start_delayed_animation' );
				}
			}

			onAnimationEnd( event )
			{
				if( ! this.preview )
				{
					return;
				}

				this.initialPositionHandler();
			}

			onMouseDown( event )
			{
				if( this.touchCapture )
				{
					return;
				}

				event.preventDefault();
				event.stopPropagation();

				this.mouseCapture = true;
				this.container.classList.add( 'av-active-drag' );

				this.downScreenX = event.screenX;
				this.downScreenY = event.screenY;

				if( this.divider == 'horizontal' )
				{
					this.downHandlePos = this.handle.style.top;
				}
				else
				{
					this.downHandlePos = this.handle.style.left;
				}

				this.downHandlePos = parseInt( this.downHandlePos.replace( 'px', '' ) );
			}

			onMouseMove( event )
			{
				if( ! this.mouseCapture )
				{
					return;
				}

				event.preventDefault();
				event.stopPropagation();

				let newPos = 0,
					diff = 0;

				if( this.divider == 'horizontal' )
				{
					diff = event.screenY - this.downScreenY;
				}
				else
				{
					diff = event.screenX - this.downScreenX;
				}

				if( Math.abs( diff ) < 5 )
				{
					return;
				}

				newPos = this.downHandlePos + diff;

				this.adjustDividerFrame( newPos );
			}

			onMouseUp( event )
			{
				if( ! this.mouseCapture )
				{
					return;
				}

				event.preventDefault();
				event.stopPropagation();

				this.mouseCapture = false;
				this.container.classList.remove( 'av-active-drag' );
			}

			onTouchStart( event )
			{
				if( this.mouseCapture )
				{
					return;
				}

				if( ! event.touches.length )
				{
					return;
				}

				event.preventDefault();
				event.stopPropagation();

				if( event.explicitOriginalTarget )
				{
					//	pass click event to button when visible !!!
					if( event.explicitOriginalTarget.classList.contains( 'av-img-diff-label' ) )
					{
						let opacity = window.getComputedStyle( event.explicitOriginalTarget ).getPropertyValue( 'opacity' );

						if( opacity > 0 )
						{
							event.explicitOriginalTarget.dispatchEvent( new MouseEvent( 'click' ) );
							return;
						}
					}
				}

				this.touchCapture = true;
				this.container.classList.add( 'av-active-drag' );

				this.downScreenX = event.touches[0].screenX;
				this.downScreenY = event.touches[0].screenY;
				this.downClientX = event.touches[0].clientX;
				this.downClientY = event.touches[0].clientY;

				if( this.divider == 'horizontal' )
				{
					this.downHandlePos = this.handle.style.top;
				}
				else
				{
					this.downHandlePos = this.handle.style.left;
				}

				this.downHandlePos = parseInt( this.downHandlePos.replace( 'px', '' ) );
			}

			onTouchMove( event )
			{
				if( ! this.touchCapture )
				{
					return;
				}

				event.preventDefault();
				event.stopPropagation();

				let newPos = 0,
					diff = 0;

				if( this.divider == 'horizontal' )
				{
					diff = event.touches[0].screenY - this.downScreenY;
				}
				else
				{
					diff = event.touches[0].screenX - this.downScreenX;
				}

				if( Math.abs( diff ) < 5 )
				{
					return;
				}

				newPos = this.downHandlePos + diff;

				this.adjustDividerFrame( newPos );
				this.touchMoved = true;
			}

			onTouchEnd( event )
			{
				if( ! this.touchCapture )
				{
					return;
				}

				if( ! this.touchMoved )
				{
					let newPos = 0,
						maxCheck = 0,
						rect = this.wrapperDiv[0].getBoundingClientRect();

					if( this.divider == 'horizontal' )
					{
						newPos = this.downClientY - rect.top;
						maxCheck = rect.height;
					}
					else
					{
						newPos = this.downClientX - rect.left;
						maxCheck = rect.width;
					}

					if( newPos < 0 )
					{
						newPos = 0;
					}
					else if( newPos > maxCheck )
					{
						newPos = maxCheck;
					}

					this.adjustDividerFrame( newPos );
				}

				event.preventDefault();
				event.stopPropagation();

				this.touchCapture = false;
				this.touchMoved = false;
				this.container.classList.remove( 'av-active-drag' );
			}

			onResize( event )
			{
				let lastPos = 0,
					lastDim = 0;

				if( this.divider == 'horizontal' )
				{
					lastPos = this.handle.style.top;
					lastDim = this.imgDimension.height;
				}
				else
				{
					lastPos = this.handle.style.left;
					lastDim = this.imgDimension.width;
				}

				lastPos = parseInt( lastPos.replace( 'px', '' ) );

				if( lastPos < 0 )
				{
					lastDim = 0;
				}
				else if( lastDim != 0 )
				{
					lastDim = Math.round( ( lastPos / lastDim ) * 100.0 );
				}

				if( lastDim > 100 )
				{
					lastDim = 100;
				}

				this.settings.drag_start = lastDim;

				this.imgBefore[0].style['clip-path'] = 'inset( 0 0 0 0 )';
				this.imgAfter[0].style['clip-path'] = 'inset( 0 0 0 0 )';

				this.initialPositionHandler();
			}

			onHandleClick( event )
			{
				//	needed to prevent jumping around after mouse move events
				event.preventDefault();
				event.stopPropagation();
			}

			onClickBtnBefore( event )
			{
				event.preventDefault();
				event.stopPropagation();

				this.adjustDividerFrame( 0 );
			}

			onClickBtnAfter( event )
			{
				event.preventDefault();
				event.stopPropagation();

				let newPos = 0;

				if( this.divider == 'horizontal' )
				{
					newPos = this.imgDimension.height;
				}
				else
				{
					newPos = this.imgDimension.width;
				}

				this.adjustDividerFrame( newPos + 15 );
			}

			onClickWrapper( event )
			{
				event.preventDefault();
				event.stopPropagation();

				let newPos = 0;

				if( this.divider == 'horizontal' )
				{
					newPos = event.layerY;
				}
				else
				{
					newPos = event.layerX;
				}

				this.adjustDividerFrame( newPos );
			}

		}

		//	class factory
		avia_js_shortcodes.aviaImageDiff = function( container )
		{
			return new scAviaImageDiff( container );
		};

		aviaJS.aviaPlugins.register( avia_js_shortcodes.aviaImageDiff, '.avia-image-diff-container' );
	}

})();

