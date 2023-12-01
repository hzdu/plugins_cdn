jQuery(function($){
	var mymodal = new wlm3_modal(
		'#sequential-upgrade-modal', // pointer to mark-up
		{
			before_open : function(event) {
				var tr = $(event.relatedTarget).closest('tr');
				$(this).set_form_data(tr.find('.seq-values').get_form_data());
				$(this).find(':input').change();
				$(this).find(':checked').click();
				
				$('.wlm-datetimepicker').daterangepicker({
					singleDatePicker: true,
					timePicker: true,
					timePickerIncrement: 15,
					showCustomRangeLabel: false,
					startDate: moment(),
					buttonClasses: "btn -default",
					applyClass: "-condensed -success",
					cancelClass: "-condensed -link",
					autoUpdateInput: false,
					drops: 'down',
					opens: 'center',
					locale: {
						format: WLM3VARS.js_datetime_format
					}
				});
				$('.wlm-datetimepicker').on('apply.daterangepicker', function(ev, picker) {
					$(this).val(picker.startDate.format(WLM3VARS.js_datetime_format));
				});

				var levelid = tr.data('level-id');
				var levelname = tr.data('level-name');

				$(':input[name="level_id"]').val(levelid);
				$(this).find('.level-name').text(levelname);

				// hide current level from upgradeTo dropdown
				$(this).find('[name="upgradeTo"] option').attr('disabled', false);
				$(this).find('[name="upgradeTo"] option[value="' + levelid + '"]').attr('disabled', true);
				$(this).find('[name="upgradeTo"]').select2();
			},
			before_close : function() {
				$('.wlm-datetimepicker').data('daterangepicker').remove();
			},
			save_handler : save_settings
		}
	);

	$('.toggle-radio-sched').on('click', function() {
		$('.-sched-options').addClass('d-none');
		$('.-sched-' + $(this).val()).removeClass('d-none');
		$(':input[name="upgradeSchedule"]').val(this.value);
		if(this.value=='after') {
			$(':input[name="upgradeOnDate"]').val('');
		}		
	});
	$('#seq-method').on('change', function() {
		try {
			$('[class*="-show-"').addClass('d-none');
			$('.-show-' + $(this).val().toLowerCase()).removeClass('d-none');
		} catch(e) {}
	});
	sequential_list();
});

var save_settings = function() {
	$this_button = $(this);
	$this_button.closest(".modal-content").save_settings({
	    on_init: function( $me, $data) {
	    	$this_button.disable_button({disable:true, icon:"update"});
	    },
	    on_success: function( $me, $result) {
	    	if ( $result.success ) {
	    		$(".wlm-message-holder").show_message({message:wp.i18n.__( 'Settings Saved.', 'wishlist-member' ), type:$result.msg_type, icon:$result.msg_type});
	    		var fdata = $me.get_form_data();
	    		var ndata = {};
	    		ndata[fdata.level_id] = {}
				$.each([ 'upgradeMethod', 'upgradeTo', 'upgradeSchedule', 'upgradeAfter', 'upgradeAfterPeriod', 'upgradeOnDate', 'upgradeEmailNotification' ], function() {
					if( this == 'upgradeAfter' && fdata[this] === "" ) {
						ndata[fdata.level_id][this] = 0;
					} else {
						ndata[fdata.level_id][this] = fdata[this];
					}
				});
	    		sequential_list(ndata);
				if($this_button.hasClass('-close')) {
					$this_button.closest('.modal').modal('hide');
				}
	    	} else {
	    		$(".wlm-message-holder").show_message({message:$result.msg, type:$result.msg_type, icon:$result.msg_type});
	    	}
	    },
	    on_fail: function( $me, $data) {
	    	alert(WLM3VARS.request_failed);
	    },
	    on_error: function( $me, $error_fields) {
	    	$.each( $error_fields, function( key, obj ) {
  				obj.parent().addClass('has-error');
			});
	    	$this_button.disable_button( {disable:false, icon:"save"} );
	    },
	    on_done: function( $me, $data) {
	    	$this_button.disable_button( {disable:false, icon:"save"} );
	    }
	});
	return false;
}