(function ($) {
    'use strict';

    var dashboard = {};

    dashboard.qodefOnDocumentReady = qodefOnDocumentReady;

    $(document).ready(qodefOnDocumentReady);

    /**
     *  All functions to be called on $(document).ready() should be in qodefImport function
     **/
    function qodefOnDocumentReady() {
        qodefThemeRegistration.init();
	    qodefInitDemosMasonry.init();
	    qodefInitDemoImportPopup.init();
    }

    var qodefImport = {
        importDemo: '',
        importImages: 0,
        counterStep: 0,
        contentCounter: 0,
        totalPercent: 0,
        contentFlag: false,
        allFlag: false,
        contentFinished: false,
        allFinished: false,
        repeatFiles: [],

        init: function () {
            qodefImport.holder = $('.qodef-cd-import-form');

            if (qodefImport.holder.length) {
                qodefImport.holder.each(function () {
                    var qodefImportBtn = $('#qodef-import-demo-data'),
                        importAction = $('.qodef-cd-import-option'),
                        importDemoElement = $('.qodef-import-demo'),
                        confirmMessage = qodefImport.holder.data('confirm-message');

                    qodefImport.populateSinglePage(importAction.val(), importDemoElement.val(), false);

                    importDemoElement.on('change', function (e) {
                        qodefImport.populateSinglePage(importAction.val(), $('.qodef-import-demo').val(), true);
                    });

                    qodefImportBtn.on('click', function (e) {
                        e.preventDefault();
                        qodefImport.reset();
                        qodefImport.importImages = $('.qodef-cd-import-attachments').is(':checked') ? 1 : 0;
                        qodefImport.importDemo = importDemoElement.val();

                        if (confirm(confirmMessage)) {
                            $('.qodef-cd-box-form-section-progress').show();
                            $(this).addClass('qodef-import-demo-data-disabled');
                            $(this).attr("disabled", true);
                            qodefImport.initImportType(importAction.val());
                        }
                    });
                });
            }
        },

        initImportType: function (action) {
            switch (action) {
                case 'widgets':
                    qodefImport.importWidgets();
                    break;
                case 'options':
                    qodefImport.importOptions();
                    break;
                case 'content':
                    qodefImport.contentFlag = true;
                    qodefImport.importContent();
                    break;
                case 'complete':
                    qodefImport.allFlag = true;
                    qodefImport.importAll();
                    break;
                case 'single-page':
                    qodefImport.importSinglePage();
                    break;
            }
        },

        importWidgets: function () {
            var data = {
                action: 'widgets',
                demo: qodefImport.importDemo
            };
            qodefImport.importAjax(data);
        },

        importOptions: function () {
            var data = {
                action: 'options',
                demo: qodefImport.importDemo
            };
            qodefImport.importAjax(data);
        },

        importSettingsPages: function () {
            var data = {
                action: 'settings-page',
                demo: qodefImport.importDemo
            };
            qodefImport.importAjax(data);
        },

        importMenuSettings: function () {
            var data = {
                action: 'menu-settings',
                demo: qodefImport.importDemo
            };
            qodefImport.importAjax(data);
        },

        importRevSlider: function () {
            var data = {
                action: 'rev-slider',
                demo: qodefImport.importDemo
            };
            qodefImport.importAjax(data);
        },
	    importLayerSlider: function () {
            var data = {
                action: 'layer-slider',
                demo: qodefImport.importDemo
            };
            qodefImport.importAjax(data);
        },

        importContent: function () {
            if (qodefImport.contentCounter == 0) {
                qodefImport.importTerms();
            }
            if (qodefImport.contentCounter == 1) {
                qodefImport.importAttachments();
            }
            if ((qodefImport.contentCounter > 1 && qodefImport.contentCounter < 10) && qodefImport.repeatFiles.length) {
                qodefImport.importAttachments(true);
            }
            if (qodefImport.contentCounter == 9) {
                qodefImport.importPosts();
            }
        },

        importAll: function () {

            if (qodefImport.contentCounter < 10) {
                qodefImport.importContent();
            } else {
                qodefImport.contentFinished = true;
            }

            if (qodefImport.contentFinished && !qodefImport.allFinished) {
                qodefImport.importWidgets();
                qodefImport.importOptions();
                qodefImport.importSettingsPages();
                qodefImport.importMenuSettings();
                qodefImport.importRevSlider();
                qodefImport.importLayerSlider();
                qodefImport.allFinished = true;
            }

        },
        importTerms: function () {
            var data = {
                action: 'content',
                xml: 'bridge_content_01.xml',
	            images: qodefImport.importImages
            };
            qodefImport.importAjax(data);
        },
        importPosts: function () {
            var data = {
                action: 'content',
                xml: 'bridge_content_10.xml'
            };
            qodefImport.importAjax(data);
        },

        importSinglePage: function () {
            var postId = $('#import_single_page').val();
            var data = {
                action: 'content',
                xml: 'bridge_content_10.xml',
                post_id: postId
            };
            qodefImport.importAjax(data);
        },

        importAttachments: function (repeat) {
            if (qodefImport.repeatFiles.length && repeat) {
                qodefImport.repeatFiles.forEach(function (index) {
                    var data = {
                        action: 'content',
                        xml: index,
                        images: qodefImport.importImages
                    };
                    qodefImport.importAjax(data);
                });
                qodefImport.repeatFiles = [];

            }

            if (!repeat) {
                for (var i = 2; i < 10; i++) {
                    var xml = i < 10 ? 'bridge_content_0' + i + '.xml' : 'bridge_content_' + i + '.xml';
                    var data = {
                        action: 'content',
                        xml: xml,
                        images: qodefImport.importImages
                    };
                    qodefImport.importAjax(data);
                }
            }
        },

        importAjax: function (options) {
            var defaults = {
                demo: qodefImport.importDemo,
                nonce: $('#qodef_cd_import_nonce').val()
            };
            $.extend(defaults, options);
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
                    action: 'import_action',
                    options: defaults
                },
                success: function (data) {
                    var response = JSON.parse(data);
                    qodefImport.ajaxSuccess(response);
                },
                error: function (data) {
                    var response = JSON.parse(data);
                    qodefImport.ajaxError(response, options);
                }
            });
        },

        importProgress: function () {
            if (!qodefImport.contentFlag && !qodefImport.allFlag) {
                qodefImport.totalPercent = 100;
            } else if (qodefImport.contentFlag) {
	            qodefImport.totalPercent += 10;
            } else if (qodefImport.allFlag) {
                if (qodefImport.contentCounter < 10) {
                    qodefImport.totalPercent += 8;
                } else if (qodefImport.contentCounter == 10) {
                    qodefImport.totalPercent += 16;
                } else {
                    qodefImport.totalPercent += 2;
                }
            }

            $('#qodef-progress-bar').val(qodefImport.totalPercent);
            $('.qodef-cd-progress-percent').html(Math.round(qodefImport.totalPercent) + '%');

            if (qodefImport.totalPercent == 100) {
                $('#qodef-import-demo-data').remove('.qodef-import-demo-data-disabled');
                $('.qodef-cd-import-is-completed').show();

            }
        },

        ajaxSuccess: function (response) {
            if (typeof response.status !== 'undefined' && response.status == 'success') {
                if (qodefImport.contentFlag) {
                    qodefImport.contentCounter++;
                    qodefImport.importContent();
                }
                if (qodefImport.allFlag) {
                    qodefImport.contentCounter++;
                    qodefImport.importAll();
                }
                qodefImport.importProgress();
            } else {
	            $('#qodef-import-demo-data').remove('.qodef-import-demo-data-disabled');
	            $('.qodef-cd-import-went-wrong').show();
            }
        },

        ajaxError: function (response, options) {
	        $('#qodef-import-demo-data').remove('.qodef-import-demo-data-disabled');
	        $('.qodef-cd-import-went-wrong').show();
        },

        reset: function () {
            qodefImport.totalPercent = 0;
            $('#qodef-progress-bar').val(0);
        },

        populateSinglePage: function (value, demo, demoChange) {
            var holder = $('.qodef-cd-box-form-section-dependency'),
                options = {
                    demo: demo,
                    nonce: $('#qodef_cd_import_nonce').val()
                };

            if (value == 'single-page') {
                if (holder.children().length == 0 || demoChange) {

                    $.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: {
                            action: 'populate_single_pages',
                            options: options
                        },
                        success: function (data) {
                            var response = $.parseJSON(data);
                            if (response.status == 'success') {
                                $('.qodef-cd-box-form-section-dependency').html(response.data);
                                var singlePageList = $('select.qodef-cd-import-single-page');
                                holder.show();
                                singlePageList.select2({
                                    dropdownCssClass: "qodef-cd-single-page-selection"
                                });
                            } else {
                                holder.html(response.message);
                                holder.show();
                            }
                        }
                    });
                } else {
                    holder.show();
                }

            } else {
                holder.hide();
            }
        },
    };

    var qodefDemosInstallPluginPerDemo = {
        init: function () {
            $( '.qodef-popup-required-plugins-holder' ).on(
                'click',
                '.qodef-install-plugin-link',
                function ( e ) {
                    e.preventDefault();
                    var link = $( this ),
                        allLinks = $('.qodef-install-plugin-link');

                    allLinks.addClass('qodef-disabled');
                    link.removeClass('qodef-disabled');
                    link.next( '.spinner' ).addClass( 'active' );
                    var requredPlugins = link.closest( '.qodef-popup-required-plugins-holder' ).find( '.qode-required-demo-plugins-list' ).data( 'required-demo-plugins' );
                    var nonce = link.closest( '.qodef-popup-required-plugins-holder' ).find( '#qodef_cd_install_plugins_nonce' );
                    var pluginAction   = 'install';
                    var pluginSlug     = '';

                    if ( typeof link.data( 'plugin-action' ) !== 'undefined' && link.data( 'plugin-action' ) !== '' ) {
                        pluginAction = link.data( 'plugin-action' );
                    }

                    if ( typeof link.data( 'plugin-slug' ) !== 'undefined' && link.data( 'plugin-slug' ) !== '' ) {
                        pluginSlug = link.data( 'plugin-slug' );
                    }

                    jQuery.ajax( {
                        type: 'POST',
                        url: ajaxurl,
                        data: {
                            action: 'install_plugin_per_demo',
                            requredPlugins: requredPlugins,
                            pluginAction: pluginAction,
                            pluginSlug: pluginSlug,
                            nonce: nonce.val()
                        },
                        success: function ( data ) {
                            var response = JSON.parse( data );

                            if ( pluginAction == 'install' ) {
                                if ( response.status == 'success' ) {
                                    link.next( '.spinner' ).removeClass( 'active' );
                                    link.text( response.message );
                                    link.data(
                                        'plugin-action',
                                        'activate'
                                    );
                                }
                            } else {
                                if ( response.status == 'success' ) {
                                    link.next( '.spinner' ).removeClass( 'active' );
                                    link.replaceWith( response.data.html );
                                    link.data(
                                        'plugin-action',
                                        'activate'
                                    );
                                }
                            }

                            allLinks.removeClass('qodef-disabled');
                        },
                        error: function () {

                        }
                    } );
                    return false;
                }
            );
        }
    }

    var qodefThemeRegistration = {
        init: function () {
            qodefThemeRegistration.holder = $('#qode-register-purchase-form');

            if (qodefThemeRegistration.holder.length) {
                qodefThemeRegistration.holder.each(function () {

                    var form = $(this);

                    var qodefRegistrationBtn = $(this).find('#qode-register-purchase-key'),
                        qodefdeRegistrationBtn = $(this).find('#qode-deregister-purchase-key');

                    qodefRegistrationBtn.on('click', function (e) {
                        e.preventDefault();
                        $(this).addClass('qodef-cd-button-disabled');
                        $(this).attr("disabled", true);
                        $(this).siblings('.qodef-cd-button-wait').show();
                        if (qodefThemeRegistration.validateFields(form)) {
                            var post = form.serialize();
                            qodefThemeRegistration.registration(post);
                        } else {
                            $(this).removeClass('qodef-cd-button-disabled');
                            $(this).attr("disabled", false);
                            $(this).siblings('.qodef-cd-button-wait').hide();
                        }

                    });

                    qodefdeRegistrationBtn.on('click', function (e) {
                        $(this).addClass('qodef-cd-button-disabled');
                        $(this).attr("disabled", true);
                        $(this).siblings('.qodef-cd-button-wait').show();
                        e.preventDefault();
                        qodefThemeRegistration.deregistration();
                    });
                });
            }
        },

        registration: function (post) {
            var data = {
                action: 'register',
                post: post
            };
            qodefThemeRegistration.registrationAjax(data);
        },

        deregistration: function () {
            var data = {
                action: 'deregister',
            };
            qodefThemeRegistration.registrationAjax(data);
        },

        validateFields: function (form) {
            if (qodefThemeRegistration.validatePurchaseCode(form) && qodefThemeRegistration.validateEmail(form)) {
                return true
            }
        },

        validateEmail: function (form) {
            var email = form.find("[name='email']");
            var emailVal = email.val();
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

            if (emailVal !== '' && regex.test(emailVal)) {
                email.removeClass('qodef-cd-error-field');
                email.parent().find('.qodef-cd-error-message').remove();
                return true
            } else if (emailVal == '') {
                email.addClass('qodef-cd-error-field');
                qodefThemeRegistration.errorMessage(email.parent().data("empty-field"), email.parent());
            } else if (!regex.test(emailVal)) {
                email.addClass('qodef-cd-error-field');
                qodefThemeRegistration.errorMessage(email.parent().data("invalid-field"), email.parent());
            }
        },

        validatePurchaseCode: function (form) {
            var purchaseCode = form.find("[name='purchase_code']");
            var purchaseCodeVal = purchaseCode.val();

            if (purchaseCodeVal !== '') {
                purchaseCode.removeClass('qodef-cd-error-field');
                purchaseCode.parent().find('.qodef-cd-error-message').remove();
                return true
            } else {
                qodefThemeRegistration.errorMessage(purchaseCode.parent().data("empty-field"), purchaseCode.parent());
                purchaseCode.addClass('qodef-cd-error-field');
            }
        },

        errorMessage: function (message, target) {
            target.find('.qodef-cd-error-message').remove();
            $('<span class="qodef-cd-error-message"></span>').text(message).appendTo(target);
        },

        registrationAjax: function (options) {
            $.ajax({
                type: 'POST',
                url: qodefCoreDashboardGlobalVars.vars.restUrl + qodefCoreDashboardGlobalVars.vars.registrationThemeRoute,
                data: {
                    options: options
                },
                beforeSend: function ( request ) {
                    request.setRequestHeader(
                        'X-WP-Nonce',
                        qodefCoreDashboardGlobalVars.vars.restNonce
                    );
                },
                success: function (response) {
                    if (response.status == 'success') {
                        location.reload();
                    } else if (response.status == 'error' && ((typeof response.data['purchase_code'] !== 'undefined' && response.data['purchase_code'] === false) || (typeof response.data['already_used'] !== 'undefined' && response.data['already_used'] === true))) {
                        qodefThemeRegistration.errorMessage(response.message, $("[name='purchase_code']").parent());
                        $('#qode-register-purchase-key').removeClass('qodef-cd-button-disabled');
                        $('#qode-register-purchase-key').attr("disabled", false);
                        $('#qode-register-purchase-key').siblings('.qodef-cd-button-wait').hide();
                    } else if (response.status == 'error') {
                        alert(response.message);
                    }

                },
                error: function (response) {
                    console.log(response);
                }
            });
        }
    };

	var qodefInitDemosMasonry = {
		init: function () {
			var demosList = $('.qodef-cd-demos-list'),
				filterHolder = $('.qodef-cd-demos-list .qode-demos-filter-holder');

				if (demosList.length) {
					demosList.each(function () {
						var thisDemoList = $(this),
							masonry = thisDemoList.children('.qodef-cd-demos-list-inner');
							masonry.waitForImages(function() {
								masonry.isotope({
									layoutMode: 'fitRows',
									itemSelector: 'article',
									percentPosition: true,
									masonry: {
										gutter: '.qodef-cd-grid-gutter',
										columnWidth: '.qodef-cd-grid-sizer'
									}
								});
								masonry.css('opacity', '1');
							});
						qodefInitDemosMasonry.filter();
					});
				}
		},
		filter: function () {
			$('.qodef-cd-demos-filter').click(function(){
				var thisFilter = $(this),
					filterValue = thisFilter.attr('data-filter');


				thisFilter.parents().find('.qodef-cd-demos-filter').removeClass('qodef-cd-demos-current');
				thisFilter.addClass('qodef-cd-demos-current');
				$('.qodef-cd-demos-list-inner').isotope({filter: filterValue})

			});

			// quick search regex
			var qsRegex;
			var $quicksearch = $('.quicksearch').keyup( debounce( function() {
				$('.qodef-cd-demos-filter').parents().find('.qodef-cd-demos-filter').removeClass('qodef-cd-demos-current');
				qsRegex = new RegExp( $quicksearch.val(), 'gi' );
				$('.qodef-cd-demos-list-inner').isotope({
					filter: function() {
						return qsRegex ? $(this).html().match( qsRegex ) : true;
					}
				});
			}, 200 ) );


			function debounce( fn, threshold ) {
				var timeout;
				threshold = threshold || 100;
				return function debounced() {
					clearTimeout( timeout );
					var args = arguments;
					var _this = this;
					function delayed() {
						fn.apply( _this, args );
					}
					timeout = setTimeout( delayed, threshold );
				};
			}



		}
	}

	var qodefInitDemoImportPopup = {
        init: function () {
            var demoImportLinks = $('.qodef-cd-demo-item-link');

            if( demoImportLinks.length ){
                demoImportLinks.each(function(){
                    var demoImportLink = $(this),
                        demoId = '',
                        originalDemoId = '';

                    if( typeof demoImportLink.data('demo-id') !== 'undefined' && demoImportLink.data('demo-id') !== ''){
                        demoId = demoImportLink.data('demo-id');
                    }

                    if( typeof demoImportLink.data('original-demo-id') !== 'undefined' && demoImportLink.data('original-demo-id') !== ''){
                        originalDemoId = demoImportLink.data('original-demo-id');
                    }

                    demoImportLink.on('click', function(e){
                        e.preventDefault();

                        $.ajax({
                            type: 'POST',
                            url: ajaxurl,
                            data: {
                                action: 'demo_import_popup',
                                demoId: demoId,
                                originalDemoId: originalDemoId
                            },
                            success: function (data) {
                                qodefInitAppendPopup.init(data);
                                qodefImport.init();
                                qodefInitRemovePopup.init();
                                qodefDemosInstallPluginPerDemo.init();
                                qodefInitSwitch();
                            },
                            error: function (data) {
                                // var response = JSON.parse(data);
                                // qodefImport.ajaxError(response, options);
                            }
                        });
                    })
                })
            }
        }
    }

    var qodefInitAppendPopup = {
	    init: function (data) {
            var body = $('body'),
                output = '';

            if( data.length ){
                output += '<div id="qodef-demo-import-popup">';
                output += data;
                output += '</div>';
            }

            if( output.length ){
                body.addClass('qodef-demo-import-popup-opened');
                body.append(output);
            }
        }
    }

    var qodefInitRemovePopup = {
	    init: function () {
            var body = $('body'),
                demoImportPopup = $('#qodef-demo-import-popup'),
                closeButton = demoImportPopup.find('.qodef-import-popup-close');

            if( closeButton.length ){
                closeButton.on('click', function(e){
                    e.preventDefault();
                    demoImportPopup.remove();
                    body.removeClass('qodef-demo-import-popup-opened');
                });
            }

        }
    }

    function qodefInitSwitch() {
        $(".qode-cd-cb-enable").on('click', function () {
            var parent = $(this).parents('.qode-cd-switch');
            $('.qode-cd-cb-disable', parent).removeClass('selected');
            $(this).addClass('selected');
            $('.qodef-cd-import-attachments', parent).attr('checked', true);
        });

        $(".qode-cd-cb-disable").on('click', function () {
            var parent = $(this).parents('.qode-cd-switch');
            $('.qode-cd-cb-enable', parent).removeClass('selected');
            $(this).addClass('selected');
            $('.qodef-cd-import-attachments', parent).attr('checked', false);
        });
    }
})(jQuery);
