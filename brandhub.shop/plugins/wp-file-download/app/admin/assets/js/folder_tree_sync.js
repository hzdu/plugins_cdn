(function ($) {
    $(document).ready(function () {
        /**
         * options
         * @type {{root: string, showroot: string, onclick: onclick, oncheck: oncheck, usecheckboxes: boolean, expandSpeed: number, collapseSpeed: number, expandEasing: null, collapseEasing: null, canselect: boolean}}
         */
        var options_sync = {
            'root': '/',
            'showroot': wpfd_admin.label_sync_root_folder,
            'onclick': function (elem, type, file) {},
            'oncheck': function (elem, checked, type, file) {},
            'usecheckboxes': false, //can be true files dirs or false
            'expandSpeed': 500,
            'collapseSpeed': 500,
            'expandEasing': null,
            'collapseEasing': null,
            'canselect': true
        };

        /**
         * Main folder tree of ftp function for sync feature
         */
        var methods_sync = {
            init_sync: function () {
                $thissyncftp = $('#wpfd_foldertree_sync');
                if ($thissyncftp.length === 0) {
                    return;
                }

                if (options_sync.showroot !== '') {
                    $thissyncftp.html('<ul class="jaofiletree"><li class="tree_ftp_root drive directory collapsed selected"><a href="#" data-file="' + options_sync.root + '" data-type="dir">' + options_sync.showroot + '</a></li></ul>');
                }
                openfolder_sync(options_sync.root);
            },
            /**
             * open folder tree by dir name
             * @param dir
             */
            open_sync: function (dir) {
                openfolder_sync(dir);
            },
            /**
             * close folder tree by dir name
             * @param dir
             */
            close_sync: function (dir) {
                closedir_sync(dir);
            },
            getchecked: function () {
                $("#wpfd_foldertree_sync input.ftp_checkbox").unbind('click').bind('click', function () {
                    if ($(this).closest('li').hasClass('folder_disabled')) {
                        return;
                    }
                    $(this).parent().find('span.check').toggleClass('checked');
                    $('#wpfd_foldertree_sync .ftp_checkbox').prop('checked', false);
                    $('#wpfd_foldertree_sync .check').not($(this).parent().find('span.check')).removeClass('checked');
                    var dir = $(this).data('file');
                    if ($(this).parent().find('span.check').hasClass('checked')) {
                        $(this).prop('checked', true).trigger('change');
                        $('.dir_name_ftp').val(wpfd_var.wpfd_root_site + dir);
                    } else {
                        $(this).prop('checked', false).trigger('change');
                        $('.dir_name_ftp').val('');
                    }
                });
            }
        };

        /**
         * open folder tree by dir name
         * @param dir dir name
         * @param callback
         */
        var openfolder_sync = function (dir , callback) {
            if ($thissyncftp.find('a[data-file="' + dir + '"]').parent().hasClass('expanded')) {
                return;
            }

            if ($thissyncftp.find('a[data-file="' + dir + '"]').parent().hasClass('expanded') || $thissyncftp.find('a[data-file="' + dir + '"]').parent().hasClass('wait')) {
                if (typeof callback === 'function')
                    callback();
                return;
            }
            var ret;
            ret = $.ajax({
                url: wpfdajaxurl + "task=category.listdir",
                data: {dir : dir},
                context: $thissyncftp,
                dataType: 'json',
                beforeSend: function () {
                    $('#wpfd_foldertree_sync').find('a[data-file="' + dir + '"]').parent().addClass('wait');
                }
            }).done(function (datas) {
                ret = '<ul class="jaofiletree" style="display: none">';
                for (var ij = 0; ij < datas.length; ij++) {
                    if (datas[ij].type === 'dir') {
                        var classe = 'directory collapsed';
                        if (datas[ij].disable) {
                            classe += ' folder_disabled';
                        } else {
                            classe += ' folder_enabled';
                        }
                        var isdir = '/';
                    } else {
                        classe = 'file ext_' + datas[ij].ext;
                        isdir = '';
                    }
                    ret += '<li class="' + classe + '">';
                    if (!datas[ij].disable) {
                        ret += '<input type="checkbox" class="ftp_checkbox" data-file="' + dir + datas[ij].file + isdir + '" data-type="' + datas[ij].type + '" />';
                    }

                    ret += '<span class="check" data-file="' + dir + datas[ij].file + isdir + '" data-type="' + datas[ij].type + '" ></span>';
                    ret += '<a href="#" data-file="' + dir + datas[ij].file + isdir + '" data-type="' + datas[ij].type + '">' + datas[ij].file + '</a>';
                    ret += '</li>';
                }
                ret += '</ul>';

                $('#wpfd_foldertree_sync').find('a[data-file="' + dir + '"]').parent().removeClass('wait').removeClass('collapsed').addClass('expanded');
                $('#wpfd_foldertree_sync').find('a[data-file="' + dir + '"]').after(ret);
                $('#wpfd_foldertree_sync').find('a[data-file="' + dir + '"]').next().slideDown(options_sync.expandSpeed, options_sync.expandEasing,
                    function () {
                        methods_sync.getchecked();
                        if (typeof callback === 'function')
                            callback();
                    });
                setevents_sync();
            }).done(function () {
                methods_sync.getchecked();
            });

        };

        /**
         * close folder tree by dir name
         * @param dir
         */
        var closedir_sync = function (dir) {
            $thissyncftp.find('a[data-file="' + dir + '"]').next().slideUp(options_sync.collapseSpeed, options_sync.collapseEasing, function () {
                $(this).remove();
            });
            $thissyncftp.find('a[data-file="' + dir + '"]').parent().removeClass('expanded').addClass('collapsed');
            setevents_sync();
        };

        /**
         * init event click to open/close folder tree
         */
        var setevents_sync = function () {
            $thissyncftp = $('#wpfd_foldertree_sync');
            $thissyncftp.find('li a').unbind('click');
            //Bind userdefined function on click an element
            $thissyncftp.find('li a').bind('click', function () {
                options_sync.onclick(this, $(this).attr('data-type'), $(this).attr('data-file'));
                if (options_sync.canselect) {
                    $thissyncftp.find('li').removeClass('selected');
                    $(this).parent().addClass('selected');
                }
                return false;
            });

            //Bind for collapse or expand elements
            $thissyncftp.find('li.directory.collapsed a').bind('click', function () {
                methods_sync.open_sync($(this).attr('data-file'));
                return false;
            });
            $thissyncftp.find('li.directory.expanded a').bind('click', function () {
                methods_sync.close_sync($(this).attr('data-file'));
                return false;
            });
        };

        /**
         * Folder tree function
         */
        methods_sync.init_sync();
    });
})(jQuery);