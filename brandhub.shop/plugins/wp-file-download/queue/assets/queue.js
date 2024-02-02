jQuery(document).ready(function($){
  var bar = $('#wp-admin-bar-'+ ju_object_queue.prefix +'-topbar span.' + ju_object_queue.prefix);
  var juQueueHeartbeat = function () {
    // Hook into the heartbeat-send
    $(document).on('heartbeat-send', function (e, data) {
      data['ju_queue_heartbeat'] = 'run_queue';
    });
    // Listen for the custom event "heartbeat-tick" on $(document).
    $(document).on('heartbeat-tick', function (e, result) {
      // Only proceed if our EDD data is present
      if (!result['ju_queue_result']) {
        return false;
      }
      juQueueUpdateStatus(result['ju_queue_result']);
    });
  };
  var juQueueUpdateStatus = function(data) {
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
    try {
      bar.removeClass(ju_object_queue.prefix + '-orange '+ ju_object_queue.prefix +'-green '+ ju_object_queue.prefix +'-gray');
      if (data.queue_length > 0) {
        bar.addClass(ju_object_queue.prefix + '-orange');
      } else {
        bar.addClass(ju_object_queue.prefix + '-green');
      }
      if (parseInt(data.stop) === 1) {
        $('#wp-admin-bar-'+ ju_object_queue.prefix +'-topbar span.' + ju_object_queue.prefix).addClass(ju_object_queue.prefix + '-gray');
      }
      $('.'+ ju_object_queue.prefix +'-queue').html(data.queue_length);
      $('#wp-admin-bar-'+ ju_object_queue.prefix +'-topbar .'+ ju_object_queue.prefix +'-queue').attr('title', data.title);
      $('.ju_queue_status_res').remove();
      $('.ju-status-wrap .ju_queue_status').prepend(data.status_html);
      $(document).trigger('ju_queue_updated_status', data);
      if (parseInt(data.stop) === 1) {
        $('.' + ju_object_queue.prefix + '_stop_queue').find('.dashicons').addClass('dashicons-controls-play').removeClass('dashicons-controls-pause');
        $('.' + ju_object_queue.prefix + '_stop_queue').find('label').text(ju_object_queue.start_label);
      } else {
        $('.' + ju_object_queue.prefix + '_stop_queue').find('.dashicons').addClass('dashicons-controls-pause').removeClass('dashicons-controls-play');
        $('.' + ju_object_queue.prefix + '_stop_queue').find('label').text(ju_object_queue.stop_label);
      }
      if (parseInt(data.queue_length) === 0) {
        $('.' + ju_object_queue.prefix + '_clear_queue').hide();
        $('.' + ju_object_queue.prefix + '_stop_queue').hide();
      } else {
        $('.' + ju_object_queue.prefix + '_clear_queue').show();
        $('.' + ju_object_queue.prefix + '_stop_queue').show();
      }
    } catch(err) {}
  };
  juCheckQueue = function() {
    $.ajax({
      url : ju_object_queue.ajaxurl,
      type : 'POST',
      data : {
        action: ju_object_queue.prefix + '_queue'
      },
      beforeSend : function(){
        bar.addClass(ju_object_queue.prefix + '-querying');
      },
      success : function(data){
        juQueueUpdateStatus(data);
      },
      complete: function(){
        bar.removeClass(ju_object_queue.prefix + '-querying');
      }
    });
  };
  if (ju_object_queue.trigger === 'heartbeat') {
    juQueueHeartbeat();
  } else {
    setTimeout(juCheckQueue, 1000);
    setInterval(juCheckQueue, parseInt(ju_object_queue.queue_ajax_interval) * 1000);
  }

  // Initialize for check queue click
  $('#wp-admin-bar-'+ ju_object_queue.prefix +'-topbar a > span').click(function(e){
    e.preventDefault();
    juCheckQueue();
  });

  $('.' + ju_object_queue.prefix + '_clear_queue').on('click', function () {
    var $this = $(this);
    $.ajax({
      url : ju_object_queue.ajaxurl,
      type : 'POST',
      data : {
        action: ju_object_queue.prefix + '_clear_queue'
      },
      beforeSend : function(){
        $this.addClass('queue_running');
      },
      success : function(data){
        $this.removeClass('queue_running');
      }
    });
  });

  $('.' + ju_object_queue.prefix + '_clear_queue').on('click', function () {
    var $this = $(this);
    $.ajax({
      url : ju_object_queue.ajaxurl,
      type : 'POST',
      data : {
        action: ju_object_queue.prefix + '_clear_queue'
      },
      beforeSend : function(){
        $this.addClass('queue_running');
      },
      success : function(data){
        $this.removeClass('queue_running');
        $('.'+ ju_object_queue.prefix +'-queue').html(0);
        $('#wp-admin-bar-'+ ju_object_queue.prefix +'-topbar span.' + ju_object_queue.prefix).removeClass(ju_object_queue.prefix + '-orange').addClass(ju_object_queue.prefix + '-green');
      }
    });
  });

  $('.' + ju_object_queue.prefix + '_stop_queue').on('click', function () {
    var $this = $(this);
    var icon = $this.find('.dashicons');
    if (icon.hasClass('dashicons-controls-pause')) {
      $('#wp-admin-bar-'+ ju_object_queue.prefix +'-topbar span.' + ju_object_queue.prefix).addClass(ju_object_queue.prefix + '-gray');
      icon.addClass('dashicons-controls-play').removeClass('dashicons-controls-pause');
      $this.find('label').text(ju_object_queue.start_label);
    } else {
      $('#wp-admin-bar-'+ ju_object_queue.prefix +'-topbar span.' + ju_object_queue.prefix).removeClass(ju_object_queue.prefix + '-gray');
      icon.addClass('dashicons-controls-pause').removeClass('dashicons-controls-play');
      $this.find('label').text(ju_object_queue.stop_label);
    }
    $.ajax({
      url : ju_object_queue.ajaxurl,
      type : 'POST',
      data : {
        action: ju_object_queue.prefix + '_stop_queue'
      },
      success : function(data){
        $this.removeClass('queue_running');
      }
    });
  });
});