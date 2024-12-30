jQuery(function ($) {
    'use strict';


    var PENCIWIDGETS = PENCIWIDGETS || {};
    PENCIWIDGETS.customSidebar = {

        init: function () {
            PENCIWIDGETS.customSidebar.addSidebars();
            PENCIWIDGETS.customSidebar.removeSidebar();
            PENCIWIDGETS.customSidebar.moveFormToTop();
            PENCIWIDGETS.customSidebar.addIconRemoveSidebar();
        },
        moveFormToTop: function () {
            $('#penci-add-custom-sidebar').parent().prependTo($('#widgets-right .sidebars-column-1'));
        },
        addSidebars: function () {
            var idAddCustomSidebar = '#penci-add-custom-sidebar';

            $('#penci-add-custom-sidebar form').submit(function (event) {
                event.preventDefault();

                var $this = $(this),
                    nameVal = $this.find('#penci-add-custom-sidebar-name').val();

                $this.find('input[type="submit"]').attr('disabled', 'disabled');
                $this.closest('#penci-add-custom-sidebar').find('.spinner').addClass('is-active');

                var data = {
                    action: 'soledad_add_sidebar',
                    _nameval: nameVal,
                    _wpnonce: Penci.nonce
                };

                $.post(Penci.ajaxUrl, data, function (r) {
                    $this.closest(idAddCustomSidebar).find('.spinner').removeClass('is-active');

                    $this.find('input[type="submit"]').removeAttr('disabled');

                    if (!r || !r.success) {
                        if (r && r.data) {
                            alert(r.data);
                        } else {
                            alert(Penci.sidebarFails);
                        }
                    } else {
                        PENCIWIDGETS.customSidebar.addSidebars.html_backup = $('#wpbody-content > .wrap').clone();

                        var dataWidget = jQuery(r.data);

                        dataWidget.find('.sidebar-name h2 .spinner').before('<a class="soledad-remove-custom-sidebar" href="#"><span class="notice-dismiss"></span></a>');

                        PENCIWIDGETS.customSidebar.addSidebars.html_backup.find('#widgets-right .sidebars-column-2').append(dataWidget);
                        $(document.body).unbind('click.widgets-toggle');

                        $('#wpbody-content > .wrap').replaceWith(PENCIWIDGETS.customSidebar.addSidebars.html_backup.clone());

                        setTimeout(function () {
                            wpWidgets.init();
                            PENCIWIDGETS.customSidebar.addSidebars();
                            PENCIWIDGETS.customSidebar.rearrangeColumns();

                            PENCIWIDGETS.customSidebar.removeSidebar();
                        }, 100);
                    }
                });
            });
        },
        removeSidebar: function () {
            var titleSidebar = $('#widgets-right .sidebar-soledad-custom-sidebar .sidebar-name h2');
            titleSidebar.on('click', '.soledad-remove-custom-sidebar', function (event) {
                event.preventDefault();
                event.stopPropagation();

                var $this = $(this);

                if (confirm(Penci.cfRemovesidebar)) {

                    $this.addClass('hidden').next('.spinner').addClass('is-active');

                    var data = {
                        action: 'soledad_remove_sidebar',
                        idSidebar: $this.closest('.widgets-sortables').attr('id'),
                        _wpnonce: Penci.nonce
                    };

                    $.post(Penci.ajaxUrl, data, function (r) {
                        if (!r || !r.success) {
                            if (r && r.data) {
                                alert(r.data);
                            } else {
                                alert(Penci.sidebarRemoveFails);
                            }
                            $this.removeClass('hidden').next('.spinner').removeClass('is-active');
                        } else {
                            $this.closest('.sidebar-soledad-custom-sidebar').remove();
                            PENCIWIDGETS.customSidebar.rearrangeColumns();
                        }
                    });
                }

            });

        },
        addIconRemoveSidebar: function () {
            var titleSidebar = $('#widgets-right .sidebar-soledad-custom-sidebar .sidebar-name h2 .spinner');
            titleSidebar.each(function () {
                if (!$(this).prev('.soledad-remove-custom-sidebar').length) {
                    $(this).before('<a class="soledad-remove-custom-sidebar" href="#"><span class="notice-dismiss"></span></a>');
                }
            });
        },
        rearrangeColumns: function () {
            var $left = $('#wpbody-content > .wrap #widgets-right .sidebars-column-1'),
                $right = $('#wpbody-content > .wrap #widgets-right .sidebars-column-2');

            if ($left.children().length - $right.children().length > 2) {
                $left.children().last().prependTo($right);
            } else if ($right.children().length >= $left.children().length) {
                $right.children().first().appendTo($left);
            }
        }
    };

    PENCIWIDGETS.menusettings = function () {
        $('.menu .menu-item.menu-item-depth-0').each(function () {
            var citem = $(this),
                cselect = citem.find('.edit-menu-item-mgstyle'),
                cselect_val = cselect.val();
            if (cselect_val != 'mega-menu') {
                cselect_val = 'cat-menu';
            }
            citem.find('p.penci-mn-settings.' + cselect_val + '-select').addClass('active');

            cselect.on('change', function () {
                var cselectc_val = $(this).val();
                if (cselectc_val != 'mega-menu') {
                    cselectc_val = 'cat-menu';
                }
                citem.find('p.penci-mn-settings').removeClass('active');
                citem.find('p.penci-mn-settings.' + cselectc_val + '-select').addClass('active');
            });

            var pcblock_id = citem.find('.pcblock-select').val(),
                none = citem.find('span.pcajax-none'),
                change = citem.find('span.pcajax-change');
            if (pcblock_id) {
                none.removeClass('active');
                change.addClass('active');
            } else {
                none.addClass('active');
                change.removeClass('active');
            }
        });


        $(document).on('change', '.pcblock-select', function () {
            var id = $(this).find(':selected').data('id'),
                wrapper = $(this).closest('.penci-mn-settings'),
                none = wrapper.find('span.pcajax-none'),
                change = wrapper.find('span.pcajax-change');
            if (id) {
                none.removeClass('active');
                change.addClass('active');

                var link = wrapper.find('.penciblock-edit-link'),
                    idlink = link.attr('data-url') + id;

                link.attr('href', idlink);

            } else {
                none.addClass('active');
                change.removeClass('active');
            }
        });

        $('.color-picker').each(function () {
            var t = $(this),
                id = t.attr('id');

            $('#' + id).wpColorPicker();
        });

        var custom_uploader;

        $(document).on('click', '.penci_menu_bgimg_btn', function (e) {

            e.preventDefault();
            //Extend the wp.media object
            custom_uploader = wp.media.frames.file_frame = wp.media({
                title: 'Select the background image for menu',
                button: {
                    text: 'Upload menu background'
                },
                multiple: false
            });

            // get settings
            var t = $(this),
                item = t.closest('.penci-mn-settings');

            //When a file is selected, grab the URL and set it as the text field's value
            custom_uploader.on('select', function () {
                var attachment = custom_uploader.state().get('selection').first().toJSON();
                $(item).find('.custom_media_id').val(attachment.id);
                $(item).find('.custom_media_image').attr('src', attachment.url);
                $(item).find('.penci_menu_bgimg_btn').html('Change Background Image');
                $(item).find('.penci_menu_bgimg_delete_btn,.pc-mn-image-wrapper').addClass('active');
            });

            //If the uploader object has already been created, reopen the dialog
            if (custom_uploader) {
                custom_uploader.open();
                return;
            }

            //Open the uploader dialog
            custom_uploader.open();
        });

        $(document).on('click', '.penci_menu_bgimg_delete_btn', function (e) {
            var t = $(this),
                item = t.closest('.penci-mn-settings');
            $(item).find('.custom_media_id').val('');
            $(item).find('.custom_media_image').attr('src', '');
            t.removeClass('active');
            $(item).find('.pc-mn-image-wrapper').removeClass('active');
            $(item).find('.penci_menu_bgimg_btn').html('Upload Background Image');
            e.preventDefault();
        });
    }

    PENCIWIDGETS.social_counter = function () {
        $('.penci-social-widget-tabs').each(function () {
            var wrap = $(this),
                sselect = wrap.find('.source-select'),
                cvalue = sselect.find('option:selected').val();
            wrap.find('.widget-title-settings.notes').hide();
            wrap.find('.widget-title-settings.notes.' + cvalue).show();
            wrap.find('.data-source-settings').hide();
            wrap.find('.data-source-settings.' + cvalue).show();

            sselect.on('change', function () {
                var tv = $(this).find(':selected').val();
                wrap.find('.widget-title-settings.notes').hide();
                wrap.find('.widget-title-settings.notes.' + tv).show();
                wrap.find('.data-source-settings').hide();
                wrap.find('.data-source-settings.' + tv).show();
            });

        });
    }

    /* Init functions
     ---------------------------------------------------------------*/
    $(document).ready(function () {
        PENCIWIDGETS.customSidebar.init();
        PENCIWIDGETS.menusettings();
        PENCIWIDGETS.social_counter();
        $(document).on('menu-item-added', function () {
            PENCIWIDGETS.menusettings();
        });
        $(document).on('widget-added widget-updated', function ($control) {
            PENCIWIDGETS.social_counter();
        });
    });
});

