/**
 * ALB Shortcode Lottie Animations frontend and preview iframe
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
	if( ! avia_js_shortcodes.aviaLottieAnimation )
	{
		class scAviaLottieAnimation
		{
			container = null;		//	container element
			id = '';
			player = null;
			settings = {};
			loaded = false;
			started = false;
			preview = false;

			constructor( container )
			{
				this.container = container;
				this.container.scAviaLottieAnimation = this;
				this.id = container.getAttribute('id');
				this.loaded = false;
				this.started = false;
				this.preview = document.getElementById( 'av-admin-preview' ) != null;

				//	bind shortcode to element
				this.container.scAviaLottieAnimation = this;

				this.player = this.container.querySelector( 'dotlottie-player' );
				this.settings = JSON.parse( this.player.dataset.av_lottie );

				this.initPlayer();

				/**
				 * hack to catch jQuery custom events (browser events seem to work even when triggered with jQuery)
				 *
				 * https://stackoverflow.com/questions/11132553/how-to-catch-the-jquery-event-trigger
				 * https://stackoverflow.com/questions/36914912/how-to-get-jquery-to-trigger-a-native-custom-event-handler
				 * https://stackoverflow.com/questions/40915156/listen-for-jquery-event-with-vanilla-js
				 */
				this.container.onavia_start_animation = ( e ) =>
				{
					const opt = {
								'bubbles':		true,
								'cancelable':	true
							};

					const event = new CustomEvent( 'avia_start_animation', opt );
					this.container.dispatchEvent( event );
				};

				this.container.addEventListener( 'avia_start_animation', this.avia_start_animation.bind( this ) );
				this.player.addEventListener( 'ready', this.lottie_animation_loaded.bind( this ) );

				//	DOM classes are not set !!
				const obj = this;
				setTimeout( function(){ obj.prepareAnimation(); } );
			}

			initPlayer()
			{
				this.player.__speed = this.settings.speed != '' ? this.settings.speed : 1;
				this.player.__autoplay = false;		//	this.settings.autoplay == 'start_loaded ';
				this.player.__loop = this.settings.loop == '';
				this.player.__hover = this.settings.hover != '';
				this.player.__direction = this.settings.direction != '' ? -1 : 1;
				this.player.__mode = this.settings.mode != '' ? 'bounce' : 'normal';
				this.player.__controls = this.settings.controls != '';

				this.player.__background = this.settings.background =! '' ? this.settings.background : 'transparent';
			}

			prepareAnimation()
			{
				if( this.container.classList.contains( 'avia_start_animation' ) )
				{
					//	container already in viewport - we can start immediatly
					if( this.settings.autoplay != 'no_autoplay' )
					{
						this.settings.autoplay = 'start_loaded';
					}

					this.avia_start_animation();
				}
				else if( this.settings.autoplay == 'start_loaded' || this.settings.lazy_loading == '' || this.preview )
				{
					//	force loading of animation
					this.load_animation();
				}
			}

			avia_start_animation( event )
			{
				if( this.container.classList.contains( 'avia_animation_finished' ) )
				{
					//	make sure to start player when already in viewport
					this.start();
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

				if( this.loaded )
				{
					this.start();
				}
				else
				{
					this.load_animation();
				}
			}

			load_animation()
			{
				if( this.loaded )
				{
					return;
				}

				this.player.load( this.settings.src );
			}

			start()
			{
				this.started = true;
				this.container.classList.add( 'av-lottie-animation-started' );

				this.player.play();
			}

			lottie_animation_loaded( event )
			{
				this.loaded = true;
				this.container.classList.add( 'av-lottie-animation-loaded' );

				if( this.settings.autoplay == 'no_autoplay' )
				{
					return;
				}

				if( this.settings.autoplay == 'start_loaded' || this.preview || this.container.classList.contains( 'avia_start_delayed_animation' ) )
				{
					this.start();
				}

				if( this.container.classList.contains( 'avia_start_animation' ) && this.settings.lazy_loading != '' )
				{
					this.start();
					this.container.classList.add( 'avia_start_delayed_animation' );
				}
			}
		}

		//	class factory
		avia_js_shortcodes.aviaLottieAnimation = function( container )
		{
			return new scAviaLottieAnimation( container );
		};

		aviaJS.aviaPlugins.register( avia_js_shortcodes.aviaLottieAnimation, '.av-lottie-animation-container' );
	}

})();
