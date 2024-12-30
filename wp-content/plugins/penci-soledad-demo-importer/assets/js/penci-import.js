jQuery(document).ready(function ($) {
    "use strict";

    var penci_soledaddi = {
        init: function () {
            this.confirm();

            this.$progress = $('#penci-soledad-demo-import-progress');
            this.$log = $('#penci-soledad-demo-import-log');
            this.$importer = $('#penci-soledad-demo-importer');
            this.$uninstall = $('#penci-soledad-demo-uninstall');
            this.steps = [];

            // Import demo data
            if (this.$importer.length) {
                var installPlugin = penci_soledaddi.$importer.find('input[name="install-plugin"]').val(),
                    includeContent = penci_soledaddi.$importer.find('input[name="include-content"]').val(),
                    includeStyle = penci_soledaddi.$importer.find('input[name="include-style"]').val(),
                    content_only_pages = penci_soledaddi.$importer.find('input[name="content_only_pages"]').val();

                if (installPlugin) {
                    this.steps.push('plugin');
                }
                if (includeContent) {
                    this.steps.push('content');
                }
                if (includeStyle) {
                    this.steps.push('customizer');
                }
                if ('yes' === content_only_pages) {
                    this.steps.push('content_only_pages');
                }
                if (includeContent) {
                    this.steps.push('widgets', 'sliders');
                }

                var $first_item = penci_soledaddi.steps.shift();
                if ('plugin' === $first_item) {
                    this.install_plugin();
                } else if ('customizer' === $first_item) {
                    this.install_only_customize($first_item);
                } else {
                    this.download($first_item);
                }
            } else if (this.$uninstall.length) {
                this.unintall_demo();
            }

        },

        confirm: function () {
            if ($('.penci-uninstall-demo').length) {
                $('.penci-uninstall-demo').on('click', function (e) {
                    var r = confirm("Are you sure?");
                    if (r !== true) {
                        return false;
                    }
                });
            }
            if ($('.penci-install-demo').length) {
                $('.penci-install-demo').on('click', function (e) {

                    var $form = $(this).closest('.demo-selector'),
                        $list = $('.required_plugins_list');

                    $list.find('.list-item').removeClass('active');

                    if ($('.demos-container').hasClass('has-imported')) {
                        alert("You've imported a demo before, let's Uninstall that demo first before import a new demo - because if you import multiple demos together, it will be mixed.");
                        return false;
                    }

                    if ($form.hasClass('req-elementor')) {
                        $list.find('.elementor').addClass('active');
                    }

                    if ($form.hasClass('req-woocommerce')) {
                        $list.find('.woocommerce').addClass('active');
                    }

                    if ($form.hasClass('req-elementor') || $form.hasClass('req-woocommerce')) {
                        $('#penci_required_plugins_btn').trigger('click');
                        return false;
                    }

                    var r = confirm("Are you sure you want to import this demo?");
                    if (r !== true) {
                        return false;
                    }
                });
            }
        },

        install_plugin: function () {
            var $plugins = PenciObject.plugins_required;

            if (!$plugins.length) {
                penci_soledaddi.$progress.find('.spinner').hide();
                return;
            }
            var plugin = $plugins.shift();

            penci_soledaddi.log('Installing ' + plugin + ' the plugin…');

            $.get(
                ajaxurl, {
                    action: 'penci_soledad_install_plugin',
                    plugin: plugin,
                    _wpnonce: penci_soledaddi.$importer.find('input[name="_wpnonce"]').val()
                },
                function (response) {
                    penci_soledaddi.log(response.data);

                    if ($plugins.length) {
                        setTimeout(function () {
                            penci_soledaddi.install_plugin($plugins);
                        }, 1000);
                    } else {
                        penci_soledaddi.download(penci_soledaddi.steps.shift());
                    }
                }
            ).fail(function () {
                penci_soledaddi.log('Failed');
            });
        },

        download: function (type) {
            penci_soledaddi.log('Downloading ' + type + ' file');

            $.get(
                ajaxurl,
                {
                    action: 'penci_soledad_download_file',
                    type: type,
                    demo: penci_soledaddi.$importer.find('input[name="demo"]').val(),
                    _wpnonce: penci_soledaddi.$importer.find('input[name="_wpnonce"]').val()
                },
                function (response) {
                    if (response.success) {
                        penci_soledaddi.import(type);
                    } else {
                        penci_soledaddi.log(response.data);

                        if (penci_soledaddi.steps.length) {
                            penci_soledaddi.download(penci_soledaddi.steps.shift());
                        } else {
                            penci_soledaddi.configTheme();
                        }
                    }
                }
            ).fail(function () {
                penci_soledaddi.log('Failed');
            });
        },
        download_only_pages: function (type) {

            var name_file = type;
            if ('content_only_pages' === type) {
                name_file = 'pages';
            }
            penci_soledaddi.log('Downloading ' + name_file + ' file');

            $.get(
                ajaxurl,
                {
                    action: 'penci_soledad_download_file',
                    type: type,
                    demo: penci_soledaddi.$importer.find('input[name="demo"]').val(),
                    _wpnonce: penci_soledaddi.$importer.find('input[name="_wpnonce"]').val()
                },
                function (response) {
                    if (response.success) {
                        penci_soledaddi.import_only_page(type);
                    } else {
                        penci_soledaddi.log(response.data);

                        if (penci_soledaddi.steps.length) {
                            penci_soledaddi.download_only_pages(penci_soledaddi.steps.shift());
                        }
                    }
                }
            ).fail(function () {
                penci_soledaddi.log('Failed');
            });
        },
        install_only_customize: function (type) {
            penci_soledaddi.log('Downloading ' + type + ' file');
            $.get(
                ajaxurl,
                {
                    action: 'penci_soledad_download_file',
                    type: type,
                    demo: penci_soledaddi.$importer.find('input[name="demo"]').val(),
                    _wpnonce: penci_soledaddi.$importer.find('input[name="_wpnonce"]').val()
                },
                function (response) {
                    if (response.success) {
                        penci_soledaddi.import_customizer(type);

                        if (penci_soledaddi.steps.length) {
                            penci_soledaddi.download_only_pages(penci_soledaddi.steps.shift());
                        }
                    } else {
                        penci_soledaddi.log(response.data);
                    }
                }
            ).fail(function () {
                penci_soledaddi.log('Failed');
            });
        },
        import_customizer: function (type) {
            penci_soledaddi.log('Importing ' + type);

            var data = {
                action: 'penci_soledad_import',
                type: type,
                demo: penci_soledaddi.$importer.find('input[name="demo"]').val(),
                _wpnonce: penci_soledaddi.$importer.find('input[name="_wpnonce"]').val()
            };
            var url = ajaxurl + '?' + $.param(data);
            var evtSource = new EventSource(url);

            evtSource.addEventListener('message', function (message) {
                var data = JSON.parse(message.data);
                switch (data.action) {
                    case 'updateTotal':
                        console.log(data.delta);
                        break;

                    case 'updateDelta':
                        console.log(data.delta);
                        break;

                    case 'complete':
                        evtSource.close();
                        penci_soledaddi.log(type + ' has been imported successfully!');

                        setTimeout(function () {
                            penci_soledaddi.log('Import completed!');
                            penci_soledaddi.$progress.find('.spinner').hide();
                        }, 200);
                        break;
                }
            });

            evtSource.addEventListener('log', function (message) {
                var data = JSON.parse(message.data);
                penci_soledaddi.log(data.message);
            });
        },
        import_only_page: function (type) {

            var name_file = type;
            if ('content_only_pages' === type) {
                name_file = 'pages';
            }

            penci_soledaddi.log('Importing ' + name_file);

            var data = {
                action: 'penci_soledad_import',
                type: type,
                demo: penci_soledaddi.$importer.find('input[name="demo"]').val(),
                _wpnonce: penci_soledaddi.$importer.find('input[name="_wpnonce"]').val()
            };
            var url = ajaxurl + '?' + $.param(data);
            var evtSource = new EventSource(url);

            evtSource.addEventListener('message', function (message) {
                var data = JSON.parse(message.data);
                switch (data.action) {
                    case 'updateTotal':
                        console.log(data.delta);
                        break;

                    case 'updateDelta':
                        console.log(data.delta);
                        break;

                    case 'complete':
                        evtSource.close();
                        penci_soledaddi.log(name_file + ' has been imported successfully!');

                        if (penci_soledaddi.steps.length) {
                            penci_soledaddi.download_only_pages(penci_soledaddi.steps.shift());
                        }

                        break;
                }
            });

            evtSource.addEventListener('log', function (message) {
                var data = JSON.parse(message.data);
                penci_soledaddi.log(data.message);
            });
        },
        import: function (type) {
            penci_soledaddi.log('Importing ' + type);

            var data = {
                action: 'penci_soledad_import',
                type: type,
                demo: penci_soledaddi.$importer.find('input[name="demo"]').val(),
                _wpnonce: penci_soledaddi.$importer.find('input[name="_wpnonce"]').val()
            };
            var url = ajaxurl + '?' + $.param(data);
            var evtSource = new EventSource(url);

            evtSource.addEventListener('message', function (message) {
                var data = JSON.parse(message.data);
                switch (data.action) {
                    case 'updateTotal':
                        console.log(data.delta);
                        break;

                    case 'updateDelta':
                        console.log(data.delta);
                        break;

                    case 'complete':
                        evtSource.close();
                        penci_soledaddi.log(type + ' has been imported successfully!');

                        if (penci_soledaddi.steps.length) {
                            penci_soledaddi.download(penci_soledaddi.steps.shift());
                        } else {
                            penci_soledaddi.configTheme();
                        }

                        break;
                }
            });

            evtSource.addEventListener('log', function (message) {
                var data = JSON.parse(message.data);
                penci_soledaddi.log(data.message);
            });
        },

        configTheme: function () {
            $.get(
                ajaxurl,
                {
                    action: 'penci_soledad_config_theme',
                    demo: penci_soledaddi.$importer.find('input[name="demo"]').val(),
                    _wpnonce: penci_soledaddi.$importer.find('input[name="_wpnonce"]').val()
                },
                function (response) {
                    if (response.success) {
                        penci_soledaddi.generateImages();
                    }

                    penci_soledaddi.log(response.data);
                }
            ).fail(function () {
                penci_soledaddi.log('Failed');
            });
        },

        generateImages: function () {
            $.get(
                ajaxurl,
                {
                    action: 'penci_soledad_get_images',
                    _wpnonce: penci_soledaddi.$importer.find('input[name="_wpnonce"]').val()
                },
                function (response) {
                    if (!response.success) {
                        penci_soledaddi.log(response.data);
                        penci_soledaddi.log('Import completed!');
                        penci_soledaddi.$progress.find('.spinner').hide();
                        return;
                    } else {
                        var ids = response.data;

                        if (!ids.length) {
                            penci_soledaddi.log('Import completed!');
                            penci_soledaddi.$progress.find('.spinner').hide();
                        }

                        penci_soledaddi.log('Starting generate ' + ids.length + ' images');

                        penci_soledaddi.generateSingleImage(ids);
                    }
                }
            );
        },

        generateSingleImage: function (ids) {
            if (!ids.length) {
                penci_soledaddi.log('Import completed!');
                penci_soledaddi.$progress.find('.spinner').hide();
                return;
            }

            var id = ids.shift();

            $.get(
                ajaxurl,
                {
                    action: 'penci_soledad_generate_image',
                    id: id,
                    _wpnonce: penci_soledaddi.$importer.find('input[name="_wpnonce"]').val()
                },
                function (response) {
                    penci_soledaddi.log(response.data + ' (' + ids.length + ' images left)');

                    penci_soledaddi.generateSingleImage(ids);
                }
            );
        },

        unintall_demo: function () {
            penci_soledaddi.log('Uninstalling....');

            $.get(
                ajaxurl, {
                    action: 'penci_soledad_unintall_demo',
                    type: 'unintall_demo',
                    _wpnonce: penci_soledaddi.$uninstall.find('input[name="_wpnonce"]').val()
                },
                function (response) {
                    if (response.success) {
                        penci_soledaddi.log('Unintall Demo completed!');
                        penci_soledaddi.$progress.find('.spinner').hide();
                    } else {
                        penci_soledaddi.log(response.data);
                    }
                }
            ).fail(function () {
                penci_soledaddi.log('Failed');
            });
        },
        log: function (message) {
            penci_soledaddi.$progress.find('.text').text(message);
            penci_soledaddi.$log.prepend('<p>' + message + '</p>');
        }

    };


    penci_soledaddi.init();
});
