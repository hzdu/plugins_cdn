var wpfd_status = {
  $status: null,
  init: function () {
    if (this.$status === null) {
      this.$status = jQuery('#wpfd_status');
    }
    this.initDragable(this.$status);

    jQuery(document).on('click', '.wpfd_status_header .minimize', this.minimize);
    jQuery(document).on('click', '.wpfd_status_header .maximize', this.maximize);
  },
  initDragable: function (elm) {
    jQuery(elm).draggable({scroll: false, cursor: "move", handle: '.wpfd_status_header'});
  },
  minimize: function () {
    var status = wpfd_status.$status;
    status.hide();
    status.find('.toolbox').removeClass('minimize').addClass('maximize');
    status.draggable('disable');
    status.find('.wpfd_status_body').hide();
    status.css({
      'top': 'auto',
      'left': 'auto',
      'right': '0',
      'bottom': '0',
      'height': '35px',
    });
    status.fadeIn();
  },
  maximize: function () {
    var status = wpfd_status.$status;
    status.hide();
    status.find('.toolbox').removeClass('maximize').addClass('minimize');
    status.draggable('enable');
    status.prop('style', '');
    status.css({
      'right': '41px',
      'bottom': '25px',
    });
    status.find('.wpfd_status_body').show();
    status.fadeIn();
  },
  close: function () {
    if (jQuery('.wpfd_status_body').children().length === 0) {
      wpfd_status.$status.fadeOut();
    }
  },
  addStatusLine: function (message, interval = 5) {
    var statusLine = jQuery('<div class="wpfd_status_line">' + message + '</div>');
    this.$status.find('.wpfd_status_body').append(statusLine);
    setTimeout(function() {
      statusLine.remove();
      if (wpfd_status.$status.find('.wpfd_status_body').children().length === 0) {
        wpfd_status.close();
      }
    }, interval * 1000);
    this.maximize();
    return statusLine;
  },
  progressAdd: function (prgId, fileName, fileCatId, directoryUpload) {
    var file = Wpfd.uploader.getFromUniqueIdentifier(prgId);
    var catIdFromPrgId = prgId.split('|||').slice(0, 1).shift();
    fileCatId = catIdFromPrgId || fileCatId;

    var progress = '<div style="display:none" class="wpfd_progress_block" data-id="' + prgId + '" data-cat-id="' + fileCatId + '">'
      + '<div class="wpfd_progress_fileinfo">'
      + '<span class="wpfd_progress_filename">' + fileName + '</span>'
      + '<span class="wpfd_progress_cancel"></span>'
      + '<span class="wpfd_progress_pause"></span>'
      + '</div>'
      + '<div class="wpfd_progress_full" style="display: block;">'
      + '<div class="wpfd_progress_run" data-w="0" style="width: 0%;"></div>'
      + '</div></div>';
    this.$status.find('.wpfd_status_body').append(progress);
    this.$status.find('.wpfd_progress_block[data-id="' + prgId + '"]').fadeIn();
    this.$status.find('.wpfd_progress_block[data-id="' + prgId + '"] .wpfd_progress_cancel').unbind('click').on('click', this.progressInitCancel);
    this.$status.find('.wpfd_progress_block[data-id="' + prgId + '"] .wpfd_progress_pause').unbind('click').on('click', this.progressInitPause);

    Wpfd.uploader.updateQuery({
      id_category: fileCatId,
    });

    if (!directoryUpload) {
      for (var num = 1; num <= Wpfd.uploader.getOpt('simultaneousUploads'); num++) {
        if (typeof(file.chunks[num - 1]) !== 'undefined') {
          if (file.chunks[num - 1].status() === 'pending' && file.chunks[num - 1].preprocessState === 0) {
            file.chunks[num - 1].send();
          }
        }
      }
    } else {
      setTimeout(function() {
        file.upload();
      }, 3000);
    }


    // Show status box
    this.maximize();

  },
  progressInitCancel: function (e) {
    e.stopPropagation();
    var $this = jQuery(this);
    var progress = $this.parents('.wpfd_progress_block');
    var fileId = progress.data('id');
    var fileCatId = progress.data('cat-id');
    if (typeof(fileId) !== 'undefined') {
      Wpfd.log('progressInitCancel for progress id ' + fileId);
      // Bind
      var file = Wpfd.uploader.getFromUniqueIdentifier(fileId);
      if (file !== false) {
        file.cancel();
        wpfd_status.progressUpdate(fileId, '0%');
      }
      progress.fadeOut('normal', function () {
        jQuery(this).remove();
        wpfd_status.close();
      });

      // todo: modify this to pause all uploading files
      if (Wpfd.uploader.files.length === 0) {
        jQuery('.wpfd_progress_pause.all').fadeOut('normal', function () {
          jQuery(this).remove();
        });
      }

      jQuery.ajax({
        url: wpfdajaxurl + 'task=files.upload',
        method: 'POST',
        dataType: 'json',
        data: {
          id_category: fileCatId,
          deleteChunks: fileId,
        },
        success: function (res, stt) {
          if (res.response === true) {

          }
        },
      });
    }

  },
  progressInitPause: function (e) {
    e.stopPropagation();
    var $this = jQuery(this);
    var progress = $this.parents('.wpfd_progress_block');
    var fileId = progress.data('id');
    if (fileId !== undefined) {
      Wpfd.log('progressInitPause for progress id ' + fileId);
      // Bind
      var file = Wpfd.uploader.getFromUniqueIdentifier(fileId);
      if (file !== false && file.isUploading()) {
        file.abort();
        file.pause(true); // This is very important or paused file will upload after this done
        // Init play button
        $this.addClass('paused');
        wpfd_status.progressUpdate(fileId, Math.floor(file.progress() * 100) + '%');
        $this.unbind('click').on('click', wpfd_status.progressInitContinue);
      }

    }
  },
  progressInitContinue: function (e) {
    e.stopPropagation();
    var $this = jQuery(this);
    var progress = $this.parents('.wpfd_progress_block');
    var fileId = progress.data('id');
    if (fileId !== undefined) {
      Wpfd.log('progressInitContinue for progress id ' + fileId);
      // Bind
      var file = Wpfd.uploader.getFromUniqueIdentifier(fileId);
      Wpfd.log(file.chunks.length);
      if (file !== false && !file.isUploading()) {
        for (var num = 1; num <= Wpfd.uploader.getOpt('simultaneousUploads'); num++) {
          for (var i = 0; i < file.chunks.length; i++) {
            if (file.chunks[i].status() === 'pending' && file.chunks[i].preprocessState === 0) {
              file.chunks[i].send();
              file.pause(false); // This is very important or file will not start after paused!
              break;
            }
          }
        }

        // Init pause button
        $this.removeClass('paused');
        $this.unbind('click').on('click', wpfd_status.progressInitPause);
      }

    }
  },
  progressDone: function (prgId) {
    var progress = jQuery('.wpfd_progress_block[data-id="' + prgId + '"]');
    progress.find('.wpfd_progress_cancel').addClass('uploadDone').unbind('click');
    progress.find('.wpfd_progress_pause').css('visibility', 'hidden');
    progress.find('.wpfd_progress_full').remove();
    setTimeout(function () {
      jQuery('.wpfd_progress_block[data-id="' + prgId + '"]').fadeIn(300).hide(300, function () {
        jQuery(this).remove();
        wpfd_status.close();
      });
    }, 2000);
  },
  progressError: function (prgId) {
    var progress = jQuery('.wpfd_progress_block[data-id="' + prgId + '"]');
    progress.find('.wpfd_progress_cancel').addClass('uploadError').unbind('click');
    progress.find('.wpfd_progress_pause').addClass('paused').unbind('click').on('click', wpfd_status.progressInitContinue);

  },
  progressUpdate: function (prgId, value) {
    jQuery('.wpfd_progress_block[data-id="' + prgId + '"]').find('.wpfd_progress_run').css('width', value);
  },
};

jQuery(document).ready(function ($) {
  wpfd_status.init();
});
