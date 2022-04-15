(function($) {
	window.onLoadPPReCaptcha = function () {
		var reCaptchaFields = $('.pp-grecaptcha'),
			widgetID;

		if (reCaptchaFields.length > 0) {
			reCaptchaFields.each(function (i) {
				var self = $(this),
					attrWidget = self.attr('data-widgetid'),
					newID = $(this).attr('id'); // + '-' + i;
				// Avoid re-rendering as it's throwing API error
				if ((typeof attrWidget !== typeof undefined && attrWidget !== false)) {
					return;
				}
				else {
					// Increment ID to avoid conflict with the same form.
					self.attr('id', newID);

					widgetID = grecaptcha.render(newID, {
						sitekey	: self.data('sitekey'),
						theme	: self.data('theme'),
						size	: self.data('validate'),
						callback: function (response) {
							if ( response != '' ) {
								self.attr('data-pp-grecaptcha-response', response);

								// Re-submitting the form after a successful invisible validation.
								if ('invisible' == self.data('validate')) {
									self.closest('.elementor-widget').find('.pp-submit-button').trigger('click');
								}
							}
						}
					});

					self.attr('data-widgetid', widgetID);
				}
			});
		}
	};

	PPRegistrationForm = function( $scope, settings ) {
		this.settings  	= settings;
		this.nodeClass 	= $scope;
		this.i18n  		= settings.i18n;
		this.messages  	= settings.i18n.messages;
		this.form    	= $( this.nodeClass ).find( '.pp-registration-form' );
		this.fields 	= {};
		this.errorCodes = {};

		this._init();
	};

	PPRegistrationForm.prototype = {

		settings	: {},
		nodeClass	: '',
		messages	: {},
		isValid		: true,
		fields		: {},
		errorCodes	: {},

		_init: function()
		{
			if ( this.form.length < 1 ) {
				return;
			}
			this._initFields();
			this._bindErrorCodes();
			this._bindEvents();
			this._initReCaptcha();
		},

		_initReCaptcha: function() {
			var reCaptchaField = this.nodeClass.find( '.pp-grecaptcha' );

			if ( elementorFrontend.isEditMode() && undefined == reCaptchaField.attr( 'data-widgetid' ) ) {
				onLoadPPReCaptcha();
			}
		},

		_initFields: function() {
			this.fields = {
				'user_login': this.form.find( '.pp-rf-field[data-field-type="user_login"]' ),
				'user_email': this.form.find( '.pp-rf-field[data-field-type="user_email"]' ),
				'user_pass': this.form.find( '.pp-rf-field[data-field-type="user_pass"]' ),
				'confirm_user_pass': this.form.find( '.pp-rf-field[data-field-type="confirm_user_pass"]' ),
				'user_url': this.form.find( '.pp-rf-field[data-field-type="user_url"]' ),
				'first_name': this.form.find( '.pp-rf-field[data-field-type="first_name"]' ),
				'last_name': this.form.find( '.pp-rf-field[data-field-type="last_name"]' ),
				'consent': this.form.find( '.pp-rf-field[data-field-type="consent"]' ),
				'recaptcha': this.form.find( '.pp-rf-field[data-field-type="recaptcha"]' ),
			};

			// Bind control.
			Object.keys( this.fields ).forEach( $.proxy( function( fieldName ) {
				if ( 'undefined' !== typeof fieldName ) {
					var field = this.fields[ fieldName ];
					var control = field.find( '.pp-rf-control[name="' + fieldName + '"]' );
					if ( control.length > 0 ) {
						this.fields[ fieldName ].control = control;
					}
				}
			}, this ) );
		},

		_bindErrorCodes: function() {
			this.errorCodes = {
				'empty_email': 'user_email',
				'invalid_email': 'user_email',
				'email_exists': 'user_email',
				'username_wp_error': 'user_login',
				'invalid_username': 'user_login',
				'username_exists': 'user_login',
				'password': 'user_pass',
				'password_mismatch': 'confirm_user_pass',
				'invalid_url': 'user_url',
				'recaptcha_php_ver': 'recaptcha',
				'recaptcha_missing_key': 'recaptcha',
			};
		},

		_bindEvents: function() {
			if ( this.fields.user_pass.find( '.pp-rf-toggle-pw' ).length > 0 ) {
				this.fields.user_pass.find( '.pp-rf-toggle-pw' )
					.on( 'click', $.proxy( this._passwordToggle, this ) );
			}

			if ( this.settings.pws_meter && 'undefined' !== typeof wp.passwordStrength ) {
				this.fields.user_pass.control.on( 'input', $.proxy( this._beginPwsMeter, this ) );
			}

			//$( this.nodeClass + ' .pp-button' ).click( $.proxy( this._submit, this ) );
			this.nodeClass.find( '.pp-button' ).on( 'click', $.proxy( this._submit, this ) );
		},

		_getFieldByCode: function( code ) {
			if ( 'undefined' !== typeof this.errorCodes[ code ] ) {
				var fieldType = this.errorCodes[ code ];
				var field = this.fields[ fieldType ];

				return field;
			}

			return false;
		},

		_getFormData: function() {
			var formData = new FormData( this.nodeClass.find( '.pp-registration-form' )[0] );
			formData.append( 'referrer', location.toString() );

			return formData;
		},

		_passwordToggle: function() {
			var pwField = this.fields.user_pass;
			if ( 'text' === pwField.control.attr( 'type' ) ) {
				pwField.control.attr( 'type', 'password' );
				pwField.find( '.pp-rf-toggle-pw' )
					.attr( 'aria-label', this.i18n.pw_toggle_text.show )
					.find( 'span' )
					.removeClass( 'fa-eye-slash' )
					.addClass( 'fa-eye' );
			} else {
				pwField.control.attr( 'type', 'text' );
				pwField.find( '.pp-rf-toggle-pw' )
					.attr( 'aria-label', this.i18n.pw_toggle_text.hide )
					.find( 'span' )
					.removeClass( 'fa-eye' )
					.addClass( 'fa-eye-slash' );
			}
		},

		_beginPwsMeter: function(e) {
			var password1 	= $(e.target).val(),
				password2 	= false,
				pwsStatus 	= this.fields.user_pass.find( '.pp-rf-pws-status' ),
				blacklist	= wp.passwordStrength.userInputBlacklist();

			if ( this.fields.confirm_user_pass.length > 0 ) {
				//password2 = this.fields.confirm_user_pass.control.val();
			}

			pwsStatus.removeClass( 'short bad good strong' );

			// calculate the password strength.
			var pws = wp.passwordStrength.meter( password1, blacklist, password2 );
			
			switch ( pws ) {
				case 0:
					pwsStatus.addClass( 'short' ).html( pwsL10n.short );
					break;
				case 1:
					pwsStatus.addClass( 'bad' ).html( pwsL10n.bad );
					break;
				case 2:
				case 3:
					pwsStatus.addClass( 'good' ).html( pwsL10n.good );
					break;	
				case 4:
					pwsStatus.addClass( 'strong' ).html( pwsL10n.strong );
					break;
			}

			if ( '' === password1 ) {
				pwsStatus.removeClass( 'short bad good strong' ).html('');
			} else {
				this._removeErrorClass( this.fields.user_pass );
			}
		},

		_submit: function(e) {
			this.isValid 		= true;

			var theForm			= this.form,
				submit	  		= this.nodeClass.find( '.pp-button' ),
				formData		= this._getFormData(),
				reCaptchaField 	= this.nodeClass.find( '.pp-grecaptcha' ),
				reCaptchaValue 	= reCaptchaField.data('pp-grecaptcha-response'),
				ajaxurl	  		= this.settings.ajaxurl,
				email_regex 	= /\S+@\S+\.\S+/,
				postId      	= theForm.closest( '.pp-rf-wrap' ).data( 'post-id' ),
				templateId		= theForm.data( 'template-id' ),
				templateNodeId	= theForm.data( 'template-node-id' ),
				nodeId      	= theForm.closest( '.elementor-widget-pp-registration-form' ).data( 'id' );
				//nodeId      	= theForm.parents( '.elementor-element.elementor-widget' ).last().data( 'id' );

			e.preventDefault();
			// End if button is disabled (sent already)
			if ( submit.hasClass( 'pp-disabled' ) ) {
				return;
			}

			theForm.find('.pp-rf-field').removeClass('pp-rf-field-error');

			// Validate Required.
			var self = this;
			theForm.find('.pp-rf-field.elementor-mark-required').each(function() {
				var field    = $(this),
					name     = field.data( 'field-type' ),
					selector = $(this).find( '[name="' + name + '"]' );

				if ( selector.length > 0 ) {
					if ( 'checkbox' === selector.attr( 'type' ) || 'radio' === selector.attr( 'type' ) ) {
						if ( ! selector.is(':checked') ) {
							self.isValid = false;
							self._addErrorClass( field );
						} else if ( self._fieldHasError( field ) ) {
							self._removeErrorClass( field );
						}
					} else {
						if ( ! selector.val() || '' === selector.val() ) {
							self.isValid = false;
							self._addErrorClass( field );
						} else if ( self._fieldHasError( field ) ) {
							self._removeErrorClass( field );
						}
					}
				}
			});

			// Validate Email
			if ( this.fields.user_email.length > 0 ) {
				var email = this.fields.user_email.find('input[type="email"]'); 
				if ( email.val() === '' ) {
					this.isValid = false;
					this._addErrorClass( this.fields.user_email );
				} else if ( ! email_regex.test( email.val() ) ) {
					this.isValid = false;
					this._removeErrorClass( this.fields.user_email );
					this._addInlineError( this.fields.user_email, this.messages.error.invalid_email );
				} else if ( this._fieldHasError( this.fields.user_email ) ) {
					this._removeErrorClass( this.fields.user_email );
				}
			}

			// Validate password length.
			if ( this.fields.user_pass.length > 0 ) {
				var password = this.fields.user_pass.control;
				if ( '' !== password.val() && password.val().length < this.settings.min_pass_length ) {
					this.isValid = false;
					this._addInlineError( this.fields.user_pass, this.messages.error.password_length );
				}
			}

			// Validate confirm password.
			if ( this.fields.confirm_user_pass.length > 0 ) {
				var confirmPwd = this.fields.confirm_user_pass.find('input[name="confirm_user_pass"]').val();
				var password = this.fields.user_pass.find('input[name="user_pass"]').val();
				if ( '' !== confirmPwd && btoa( confirmPwd ) !== btoa( password ) ) {
					this.isValid = false;
					this._addInlineError( this.fields.confirm_user_pass, this.messages.error.password_mismatch );
				}
			}

			// validate reCAPTCHA
			if ( reCaptchaField.length > 0 && this.isValid ) {
				if ( 'undefined' === typeof reCaptchaValue || reCaptchaValue === false ) {
					if ( 'normal' == reCaptchaField.data( 'validate' ) ) {
						this.isValid = false;
						this._addErrorClass( this.fields.recaptcha );
					} else if ( 'invisible' == reCaptchaField.data( 'validate' ) ) {
						// Invoke the reCAPTCHA check.
						grecaptcha.execute( reCaptchaField.data( 'widgetid' ) );
					}
				} else {
					this._removeErrorClass( this.fields.recaptcha );
				}
			}

			if ( ! this.isValid ) {
				return;
			} else {

				// disable send button
				submit.addClass( 'pp-disabled' );

				if ( reCaptchaField.length > 0 ) {
					formData.append( 'recaptcha', true );
				}
				if ( reCaptchaValue ) {
					formData.append( 'recaptcha_response', reCaptchaValue );
				}

				/* if ( 'undefined' !== typeof templateId ) {
					formData.append( 'template_id', templateId );
					formData.append( 'template_node_id', templateNodeId );
				} */
				formData.append( 'node_id', nodeId );
				formData.append( 'action', 'ppe_register_user' );
				formData.append( 'security', theForm.data('nonce') );
				formData.append( 'post_id', postId );

				$.ajax( {
					url: ajaxurl,
					type: 'POST',
					dataType: 'json',
					data: formData,
					processData: false,
					contentType: false,
					success: $.proxy( this._submitComplete, this ),
					error: this._onError,
				} );
			}
		},

		_submitComplete: function( response ) {
			var noMessage 	= this.nodeClass.find( ' .pp-rf-success-none' );

			// On success show the success message
			if ( typeof response.success !== 'undefined' && response.success === true ) {
				this.nodeClass.find( ' .pp-rf-failed-error' ).fadeOut();
				if ( 'yes' === response.data.auto_login && ( ( 'undefined' === typeof response.data.redirect_url ) || ( '' === response.dataredirect_url ) ) ) {
					window.location.reload();
				} else if ( 'undefined' !== typeof response.data.redirect_url ) {
					window.location.href = response.data.redirect_url;
				} else if ( noMessage.length > 0 ) {
					noMessage.fadeIn();
				} else {
					this.nodeClass.find( '.pp-registration-form' ).hide();
					this.nodeClass.find( '.pp-after-submit-action.pp-rf-success' ).fadeIn();
				}
			} else { // On failure show fail message and re-enable the send button
				$(this.nodeClass).find( '.pp-button' ).removeClass('pp-disabled');
				if ( typeof response.data.message !== 'undefined' ) {
					var error = response.data;
					var field = this._getFieldByCode( error.code );
					var message = 'undefined' !== typeof this.messages.error[ error.code ] ? this.messages.error[ error.code ] : error.message;

					if ( field && field.length > 0 ) {
						this._addInlineError( field, message );
					} else {
						this.nodeClass.find( ' .pp-rf-failed-error').html( message );
						this.nodeClass.find( ' .pp-rf-failed-error').fadeIn();
					}
				} else {
					this.nodeClass.find( ' .pp-rf-failed-error').fadeIn();
				}
				return false;
			}
		},

		_onError: function( xhr, status ) {
			console.log(status);
		},

		_addInlineError: function( field, message ) {
			field.find('.pp-rf-error-inline').remove();
			field.addClass('pp-rf-field-error').append( '<span class="pp-rf-error-inline">' + message + '</span>' );
		},

		_addErrorClass: function( field ) {
			field.addClass( 'pp-rf-validation-error' );
		},

		_removeErrorClass: function( field ) {
			field.removeClass( 'pp-rf-validation-error' );
		},

		_fieldHasError: function( field ) {
			return field.hasClass( 'pp-rf-validation-error' );
		},

	};

})(jQuery);

