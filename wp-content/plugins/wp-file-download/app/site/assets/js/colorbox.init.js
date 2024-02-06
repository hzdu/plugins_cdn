var wpfdColorboxInit;
var loading;
jQuery(document).ready(function ($) {
    var videoTypes = ['m4a', 'mp4', 'webm', 'ogg', 'ogv', 'flv'];
    var audioTypes = ['mp3', 'wav', 'wma', 'm4a'];
    var imageTypes = ['jpg', 'png', 'gif', 'jpeg', 'jpe', 'bmp', 'ico', 'tiff', 'tif', 'svg', 'svgz'];
    var previewServerTypes = ['ai', 'csv', 'doc', 'docx', 'html', 'json', 'odp', 'ods', 'pdf', 'ppt', 'pptx', 'rtf', 'sketch', 'xd', 'xls', 'xlsx', 'xml', 'jpg', 'png', 'gif', 'jpeg'];
    (wpfdColorboxInit = function () {
        // $('.wpfdlightbox').colorbox({iframe:true, innerWidth:'90%', innerHeight:'90%',maxWidth:'90%',maxHeight:'90%'});
        $('.wpfdlightbox').each(function () {
            var filetype = $(this).data('file-type');
            var previewLink = $(this).prop('href');
            sW = $(window).width();
            sH = $(window).height();
            sR = sW / sH;
            $(this).unbind('click').click(function (e) {
                e.preventDefault();
                fileid = $(this).data('id');
                catid = $(this).data('catid');
                downloadLink = wpfdcolorbox.wpfdajaxurl + 'action=wpfd&task=file.download&wpfd_category_id=' + catid + '&wpfd_file_id=' + fileid + '&preview=1';

                if ($(this).hasClass('wpfd_previewlink')) {
                    var href = jQuery(this).attr('href');
                    // var href = decodeURIComponent(jQuery(this).attr('href'));
                    // href = href.replace('docs.google.com/viewer?url=', '');
                    var extLink = href.replace(/^https?\:\/\//i, '');

                    if (typeof (_gaq) !== 'undefined') {
                        _gaq.push(['_trackEvent', 'WPFD', 'Preview', extLink]);
                    } else if (typeof (ga) !== "undefined") {
                        ga('send', 'event', 'WPFD', 'Preview', extLink);
                    }
                }
                if (typeof fileid == 'string') {
                    while (fileid.indexOf(':') > -1) {
                        fileid = fileid.replace(':', '-');
                    }
                    while (fileid.indexOf('.'+$(this).data('file-type')) > -1) {
                        fileid = fileid.replace(/[^a-zA-Z0-9]+/g, '-');
                    }
                }
                html = '<div class="dropblock">';
                html +=' <a href="#" id="wpfd-dropblock-close"><span class="dashicons dashicons-dismiss"></span></a>';
                if (audioTypes.indexOf(filetype) > -1) { //is audio
                    html += '<audio  class="video-js vjs-default-skin" id="player-' + fileid + '" controls autoplay> ';
                    html += '<source src="' + downloadLink + '" type="audio/' + filetype + '">';
                    html += ' <p class="vjs-no-js">Your browser does not support the <code>audio</code> element.</p></audio>';
                } else if (imageTypes.indexOf(filetype) > -1) { //is image
                    if (previewLink.includes('file.preview') || previewLink.includes('/previews/') || previewLink.includes('/uploads/')) {
                        html += '<div style="display: block; width: 100%; height: 90vh; overflow-y: auto; position: relative">';
                        html += '<img src="' + previewLink + '" class="video-js vjs-default-skin" id="player-' + fileid + '" /> ';
                        if ((previewLink.includes('file.preview') || previewLink.includes('/previews/') || previewLink.includes('/uploads/')) && previewServerTypes.indexOf(filetype) > -1) {
                            if ($(this).parents('.file').length) {
                                // Default, table themes
                                var previewLinkDownload = $(this).parents('.file').find('.wpfd_file_preview_link_download').val();
                                var extensions = $(this).parents('.file').find('.wpfd_file_preview_link_download').data('fileicons');
                                html += '<div class="wpfd_file_preview_download_container images">';
                                html += '<div class="'+ extensions +'"><span class="txt"></span></div>';
                                html += '<a class="title wpfd_downloadlink" href="'+ previewLinkDownload +'" data-id="'+ fileid +'" data-catid="'+ catid +'">'+ wpfdcolorbox.wpfd_download_file_attached_preview +'</a>';
                                html += '</div>';
                            } else if ($(this).parents('.wpfd-single-file').length) {
                                // Single file template
                                var previewLinkDownload = $(this).parents('.wpfd-single-file').find('.wpfd_file_preview_link_download').val();
                                var extensions = $(this).parents('.wpfd-single-file').find('.wpfd_file_preview_link_download').data('fileicons');

                                if (typeof (previewLinkDownload) !== 'undefined') {
                                    html += '<div class="wpfd_file_preview_download_container images">';
                                    html += '<div class="'+ extensions +'"><span class="txt"></span></div>';
                                    html += '<a class="title wpfd_downloadlink" href="'+ previewLinkDownload +'" data-id="'+ fileid +'" data-catid="'+ catid +'">'+ wpfdcolorbox.wpfd_download_file_attached_preview +'</a>';
                                    html += '</div>';
                                }
                            } else {
                                // Others
                                var previewLinkDownload = $(this).parents('.wpfd-download-box').find('.wpfd_file_preview_link_download').val();
                                var extensions = $('.dropblock .filecontent .ext').length ? $('.dropblock .filecontent .ext').attr("class") : 'ext ext-' + filetype + ' ' + wpfdcolorbox.wpfd_file_icon_set;

                                html += '<div class="wpfd_file_preview_download_container images">';
                                html += '<div class="'+ extensions +'"><span class="txt"></span></div>';
                                html += '<a class="title wpfd_downloadlink" href="'+ previewLinkDownload +'" data-id="'+ fileid +'" data-catid="'+ catid +'">'+ wpfdcolorbox.wpfd_download_file_attached_preview +'</a>';
                                html += '</div>';
                            }
                        }
                        html += '</div>'
                    } else {
                        html += '<img src="' + downloadLink + '" class="video-js vjs-default-skin" style="width: 100%; height: 90vh" id="player-' + fileid + '" /> ';
                    }
                } else if (videoTypes.indexOf(filetype) > -1) {
                    html += '<video width="1000" height="1000"  class="video-js vjs-default-skin" id="player-' + fileid + '" controls="controls" preload="auto" autoplay="true">';
                    html += '<p class="vjs-no-js">Your browser does not support the <code>video</code> element.</p>';
                    html += '<source src="' + downloadLink + '" type="video/'+filetype+'">';
                    html += '</video>';
                } else if (previewLink.includes('file.preview') || previewLink.includes('/previews/') || previewLink.includes('/watermark/') || previewLink.includes('/uploads/')) {
                    var previewClass = !previewLink.includes('/uploads/') ? 'wpfd_file_previewer_servers' : '';
                    html += '<div class="' + previewClass + '" style="display: block; width: 100%; height: 90vh; overflow-y: auto; position: relative">';
                    html += '<img src="' + previewLink + '" class="video-js vjs-default-skin" id="player-' + fileid + '" /> ';
                    if ((previewLink.includes('file.preview') || previewLink.includes('/previews/') || previewLink.includes('/uploads/')) && previewServerTypes.indexOf(filetype) > -1) {
                        if ($(this).parents('.file').length) {
                            // Default, table themes
                            var previewLinkDownload = $(this).parents('.file').find('.wpfd_file_preview_link_download').val();
                            var extensions = $(this).parents('.file').find('.wpfd_file_preview_link_download').data('fileicons');
                            html += '<div class="wpfd_file_preview_download_container">';
                            html += '<div class="'+ extensions +'"><span class="txt"></span></div>';
                            html += '<a class="title wpfd_downloadlink" href="'+ previewLinkDownload +'" data-id="'+ fileid +'" data-catid="'+ catid +'">'+ wpfdcolorbox.wpfd_download_file_attached_preview +'</a>';
                            html += '</div>';
                        } else if ($(this).parents('.wpfd-single-file').length) {
                            // Single file template
                            var previewLinkDownload = $(this).parents('.wpfd-single-file').find('.wpfd_file_preview_link_download').val();
                            var extensions = $(this).parents('.wpfd-single-file').find('.wpfd_file_preview_link_download').data('fileicons');
                            if (typeof (previewLinkDownload) !== 'undefined') {
                                html += '<div class="wpfd_file_preview_download_container">';
                                html += '<div class="'+ extensions +'"><span class="txt"></span></div>';
                                html += '<a class="title wpfd_downloadlink" href="'+ previewLinkDownload +'" data-id="'+ fileid +'" data-catid="'+ catid +'">'+ wpfdcolorbox.wpfd_download_file_attached_preview +'</a>';
                                html += '</div>';
                            }
                        } else {
                            // Others
                            var previewLinkDownload = $(this).parents('.wpfd-download-box').find('.wpfd_file_preview_link_download').val();
                            var extensions = $('.dropblock .filecontent .ext').length ? $('.dropblock .filecontent .ext').attr("class") : 'ext ext-' + filetype + ' ' + wpfdcolorbox.wpfd_file_icon_set;

                            html += '<div class="wpfd_file_preview_download_container">';
                            html += '<div class="'+ extensions +'"><span class="txt"></span></div>';
                            html += '<a class="title wpfd_downloadlink" href="'+ previewLinkDownload +'" data-id="'+ fileid +'" data-catid="'+ catid +'">'+ wpfdcolorbox.wpfd_download_file_attached_preview +'</a>';
                            html += '</div>';
                        }
                    }
                    html += '</div>';
                } else { //other type
                    viewlink = $(this).attr('href');
                    //googleViewer = 'https://docs.google.com/viewer?url='+ encodeURIComponent(encodeURI(viewlink))+'&embedded=true';
                    html += '<iframe mozallowfullscreen="true" webkitallowfullscreen="true" allowfullscreen="true" class="cboxIframe"  src="' + viewlink + '" frameborder="0"></iframe>';
                }
                html += '</div>';
                //loader init
                loader = $("#wpfd-box-loading");
                if (loader.length === 0) {
                    $('body').append('<div id="wpfd-box-loading" style="display: none;"><div class="loading"></div></div>');
                    loader = $("#wpfd-box-loading");
                }
                loader.show();

                $(document).unbind('click', '#wpfd-box-loading, .wpfd-loading-close').on('click', '#wpfd-box-loading, .wpfd-loading-close', function () {
                    $("#wpfd-box-loading").remove();
                });

                var timeout = 5000; // After 5s display waiting notify
                // Set time out to display close notification
                loading = setTimeout(function() {
                    var currentLoading = $('#wpfd-box-loading');
                    if (currentLoading.length > 0) {
                        $('.wpfd-loading-status', currentLoading).remove();
                        var status = $('<div class="wpfd-loading-status" style="text-align:center;">' + wpfdcolorboxvars.preview_loading_message + '</div>');
                        currentLoading.append(status);
                    }
                }, timeout);

                //player box init
                pBox = $("#wpfd-box-player");
                if (pBox.length === 0) {
                    $('body').append('<div id="wpfd-box-player" style="display: none;"></div>');
                    pBox = $("#wpfd-box-player");
                }
                pBox.hide();
                pBox.empty();
                pBox.prepend(html);

                $('#wpfd-dropblock-close').click(function(e) {
                    e.preventDefault();
                    pBox.hide();
                    if($("#player-"+fileid).length) {
                        myPlayer = videojs("player-"+fileid);
                        myPlayer.dispose();
                    }
                });

                pBox.click(function (e) {
                    if ($(e.target).is('#wpfd-box-player')) {
                        pBox.hide();
                        if ($("#player-" + fileid).length) {
                            myPlayer = videojs("player-" + fileid);
                            myPlayer.dispose();
                        }
                    }
                    $('#wpfd-box-player').unbind('click.box').bind('click.box', function (e) {
                        if ($(e.target).is('#wpfd-box-player')) {
                            pBox.hide();
                        }
                    });
                });

                //player
                if (imageTypes.indexOf(filetype) > -1 || previewLink.includes('file.preview') || previewLink.includes('/previews/') || previewLink.includes('/uploads/')) { //is image
                    new_img = new Image();
                    new_img.onload = function () {
                        var img_width = this.width,
                            img_heigth = this.height;
                        vR = img_width / img_heigth;
                        if (vR > sR) {
                            new_vW = parseInt(sW * 0.9);
                            new_vH = parseInt(new_vW / vR);
                        } else {
                            new_vH = parseInt(sH * 0.9);
                            new_vW = parseInt(new_vH * vR);
                        }

                        if (new_vW > img_width && new_vH > img_heigth) {
                            new_vW = img_width;
                            new_vH = img_heigth;
                        }

                        // $("#player-" + fileid).css('width', new_vW);
                        // $("#player-" + fileid).css('height', new_vH);
                        $("#player-" + fileid).css('width', '100%');
                        $("#player-" + fileid).css('maxHeight', 'unset');
                        // $("#player-" + fileid).css('height', 'auto');
                        // centerDropblock(fileid, new_vH / 2, new_vW / 2);
                        loader.hide(0, function(){
                            clearTimeout(loading);
                        });
                        pBox.show();
                    }
                    if (previewLink.includes('file.preview') || previewLink.includes('/previews/') || previewLink.includes('/uploads/')) {
                        new_img.src = previewLink;
                    } else {
                        new_img.src = downloadLink;
                    }
                } else if (videoTypes.indexOf(filetype) > -1 || (audioTypes.indexOf(filetype) > -1)) { // video or audio
                    videojs("player-" + fileid, {}, function () {
                        // Player (this) is initialized and ready.
                        var myPlayer = this;
                        if (audioTypes.indexOf(filetype) > -1) { //is audio
                            new_vW = 350;
                            new_vH = 60;
                            myPlayer.dimensions(new_vW, new_vH);
                            // centerDropblock(fileid, new_vH / 2, new_vW / 2);
                            loader.hide(0, function(){
                                clearTimeout(loading);
                            });
                            pBox.show();

                        } else { //is video

                            myPlayer.on('loadedmetadata', function () {

                                var v = document.getElementById('player-' + fileid + '_html5_api');
                                vW = v.videoWidth;
                                vH = v.videoHeight;
                                vR = vW / vH;
                                if (vR > sR) {
                                    new_vW = parseInt(sW * 0.9);
                                    new_vH = parseInt(new_vW / vR);
                                } else {
                                    new_vH = parseInt(sH * 0.9);
                                    new_vW = parseInt(new_vH * vR);
                                }

                                myPlayer.dimensions(new_vW, new_vH);
                                // centerDropblock(fileid, new_vH / 2, new_vW / 2);
                                loader.hide(0, function(){
                                    clearTimeout(loading);
                                });
                                pBox.show();
                            });

                        }

                        //error handling
                        myPlayer.on('error', function () { // error event listener
                            // dispose the old player and its HTML
                            error = myPlayer.error();

                            myPlayer.dispose();
                            pBox.empty();
                            pBox.prepend('<div class="dropblock">' + error.message + '</div>');

                            new_vW = 300;
                            new_vH = 200;
                            var dropblock = pBox.find('.dropblock');
                            dropblock.css('width', new_vW).css('height', new_vH);
                            // dropblock.css('margin-top', (-new_vH / 2) + 'px').css('margin-left', (-new_vW / 2) + 'px');
                            loader.hide(0, function(){
                                clearTimeout(loading);
                            });
                            pBox.show();
                        })
                    });

                } else { //other type => use googler viewer

                    new_vW = sW * 0.9;
                    new_vH = sH * 0.9;
                    var dropblock = pBox.find('.dropblock');
                    dropblock.css('width', new_vW).css('height', new_vH);
                    // dropblock.css('margin-top', (-new_vH / 2) + 'px').css('margin-left', (-new_vW / 2) + 'px');

                    $('.dropblock iframe').on('load', function () {
                        loader.hide(0, function(){
                            clearTimeout(loading);
                        });
                        pBox.show();
                    })
                }

                wpfdDownloadFiles();

                // Display downloaded file(s) below file preview mode
                wpfdPreviewFileDisplayDownloadedFiles();
            });
        });
    })();

    function wpfdPreviewFileDisplayDownloadedFiles() {
        var fileDownload = $('.wpfd-content .file');
        var linkDownload = $('.dropblock .wpfd_downloadlink');
        var user_login_id = wpfdparams.wpfd_user_login_id;

        // Handle download file(s), show downloaded file(s) immediately
        if (linkDownload.length) {
            linkDownload.on('click', function () {
                var fileId = $(this).attr('data-id');
                var isDownloadedFile = localStorage.getItem('wpfd_downloaded_file_' + user_login_id + '_' + fileId);
                if (isDownloadedFile === null) {
                    localStorage.setItem('wpfd_downloaded_file_' + user_login_id + '_' + fileId, 'yes');
                    $(this).parents('.file').addClass('is_downloaded');
                    $('.wpfd-content .file[data-id="'+ fileId +'"]').addClass('is_downloaded');
                    $('.wpfd-content .wpfd-file-link[data-id="'+ fileId +'"]').parents('.file').addClass('is_downloaded');
                    $('.wpfd-content .wpfd-file-link[data-id="'+ fileId +'"]').parents('li.ext').addClass('is_downloaded');
                }
            });
        }

        // Display downloaded files on refresh/reload page
        if (fileDownload.length) {
            fileDownload.each(function () {
                var id = $(this).data('id');
                var isFileDownload = localStorage.getItem('wpfd_downloaded_file_' + user_login_id + '_' + id);
                if (isFileDownload) {
                    $(this).addClass('is_downloaded');
                }
            });
        }
    }

    function wpfdDownloadFiles() {
        $('.wpfd_file_preview_download_container.images .wpfd_downloadlink').on('click', function (event) {
            event.preventDefault();
            var fileId = $(this).data('id');
            var categoryId = $(this).data('catid');
            var cloudType = $(this).data('type') ? $(this).data('type') : 'default';

            if (!fileId || !categoryId) {
                return false;
            }

            window.location.href = wpfdparams.site_url + "?wpfd_action=wpfd_download_file&wpfd_file_id=" + fileId + "&wpfd_category_id=" + categoryId + "&cloudType=" + cloudType;
        });
    }

    centerDropblock = function (fileid, margin_top, margin_left) {

        //re-position dropblock#wpfd-box-player .dropblock
        var dropblock = $("#player-" + fileid).parent('.dropblock');
        dropblock.css('margin-top', (-margin_top) + 'px');
        dropblock.css('margin-left', (-margin_left) + 'px');
        dropblock.css('height', '');
        dropblock.css('width', '');
        dropblock.css('top', '');
        dropblock.css('left', '');
    }
});

jQuery(document).keyup(function (e) {
    if (e.keyCode == 27) { // escape key maps to keycode `27`
        pBox = jQuery("#wpfd-box-player");
        if (pBox.length) {
            pBox.hide();
            if (pBox.find(".video-js").length) {
                var playerId = pBox.find(".video-js").first().attr("id");
                myPlayer = videojs(playerId);
                myPlayer.dispose();
            }
        }
    }
});
