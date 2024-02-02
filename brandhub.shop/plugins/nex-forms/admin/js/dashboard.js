'use strict';
var dev = true;
var search_timer = '';
var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
var lineChartData = '';
var form_analytics_chart = '';
var ctx;
var set_context_id = '';
var current_folder = 'all_entries';
var chart_options = { 
					responsive: true,
					legend: {
							display: false,
							},
					tooltips: {
							intersect: false,
							},
					
					plugins: {
						  legend: {
							align : 'start',
							position : 'bottom'
						  }
						}
					
					};


jQuery('div.updated').remove();
jQuery('.update-nag').remove();
jQuery('div.error').remove();
var load_timer;
var run_time = 0;
function load_nf_dashboard(){
	if(jQuery('#nf_dashboard_load').text()=='0')
		{
		load_timer = setTimeout(function(){ 	load_nf_dashboard() }, 500);
		run_time = run_time + 0.5;
		if(run_time==0.5)
			jQuery('.loading_current').text('Initialising styles');
		if(run_time==1.5)
			jQuery('.loading_current').text('Initialising javascript');
		if(run_time==4)
			jQuery('.loading_current').text('Loading chart data');
		if(run_time==5)
			jQuery('.loading_current').text('Loading saved submissions');
		if(run_time==6 && run_time>6)
			jQuery('.loading_current').text('Loading saved Forms');
			
		}	
	else
		{
		clearTimeout(load_timer);
		jQuery('.loading_current').text('Finalising');
		setTimeout( function(){jQuery('.nf_dashboard_loader').fadeOut(); jQuery('.nex_forms_admin_page_wrapper').fadeIn('slow');},1600);
		}
}


jQuery(window).bind('keydown', 
	function(event)
		{
		var entries_focus = true;
		
		
		if ((event.ctrlKey || event.metaKey) && !event.shiftKey)
				{
				switch (String.fromCharCode(event.which).toLowerCase())
					{
					case 'a':
						event.preventDefault();
						if(!jQuery('.wap_nex_forms_entries').hasClass('file_manager'))
						jQuery('.wap_nex_forms_entries tr').addClass('active');
						
						var selection_array = [];
						jQuery('.wap_nex_forms_entries tr.active').each(
							function()
								{
								if(jQuery(this).attr('id'))
								selection_array.push(jQuery(this).attr('id'));
								}
							);
						
						var data =
							{
							action	 						: 'nf_populate_form_entry_dashboard',
							batch							: true,
							selection						: selection_array,
							edit_entry						: 0,
							load_entry						: jQuery('#load_entry').text(),
							};	
						
						jQuery.post
							(
							ajaxurl, data, function(response)
								{	
								jQuery('.form_entry_data').html(response).removeClass('faded');
								}
							);
						
					break;
					}
				}
		
		jQuery('input').each(
			function()
				{
				if(jQuery(this).is(':focus'))
					entries_focus = false;	
				}
			);
		
		if(entries_focus)
			{
			if(event.which=='46' || event.which=='8')
				{
				event.preventDefault();
				NEXForms_run_batch_delete();
				}
			}
		}
);

function NEXForms_reset_entries_menu(){
	
	var data =
		{
		action	 : 'nf_reset_forms_menu',
		do_ajax	 : 1,
		};
	jQuery.post
		(
		ajaxurl, data, function(response)
			{
			jQuery('.left-col').html(response);
			jQuery('.left-col a').removeClass('active');
			jQuery('.left-col li  a.'+ current_folder).addClass('active');
			}
		);
						
}


function NEXForms_restore_entry(){

		var selection_array = [];
		jQuery('.wap_nex_forms_entries tr.active').each(
			function()
				{
				selection_array.push(jQuery(this).attr('id'));
				jQuery(this).remove();
				}
			);
		
	
	var data =
		{
		action	 						: 'nf_entries_restore',
		selection						: selection_array,
		};
	jQuery.post
		(
		ajaxurl, data, function(response)
			{
			NEXForms_reset_entries_menu();
			}
		);
}

function NEXForms_add_entry_star(set_star, record_id){
			
			
	if(!record_id)
		{
		var selection_array = [];
		jQuery('.wap_nex_forms_entries tr.active').each(
			function()
				{
				selection_array.push(jQuery(this).attr('id'));
				
				
				if(set_star)
						{
						jQuery(this).find('.set_starred').removeClass('is_starred');
						jQuery(this).find('.set_starred').addClass('not_starred');
						
						jQuery(this).find('.set_starred').removeClass('fas');
						jQuery(this).find('.set_starred').addClass('far');
						}
					else
						{
						jQuery(this).find('.set_starred').removeClass('not_starred');
						jQuery(this).find('.set_starred').addClass('is_starred');
						
						jQuery(this).find('.set_starred').removeClass('far');
						jQuery(this).find('.set_starred').addClass('fas');
						}
				
				}
			);
		}
	
	var data =
		{
		action	 						: 'nf_entries_set_starred',
		record_id						: record_id,
		selection						: selection_array,
		starred							: set_star
		};
	jQuery.post
		(
		ajaxurl, data, function(response)
			{
			}
		);
}
function NEXForms_mark_as_read(set_status, set_seletion){
	
	var selection_array = [];
	jQuery('.wap_nex_forms_entries tr.active').each(
		function()
			{
			selection_array.push(jQuery(this).attr('id'))
			
			if(set_status==1)
				jQuery(this).find('span.set_viewed').attr('class','set_viewed viewed fas fa-eye');
			else
				jQuery(this).find('span.set_viewed').attr('class','set_viewed not_viewed fas fa-eye-slash');
				
			}
		);
		
	var data =
		{
		action	 						: 'nf_entries_set_read',
		selection						: selection_array,
		read							: set_status
		};
	
	jQuery.post
		(
		ajaxurl, data, function(response)
			{
			NEXForms_reset_entries_menu();
			}
		);
}
function NEXForms_run_batch_delete(){
	
	var selection_array = [];
	jQuery('.wap_nex_forms_entries tr.active').each(
		function()
			{
			selection_array.push(jQuery(this).attr('id'))
			jQuery(this).remove();
			}
		);
	
	
	var data =
		{
		action	 						: 'nf_delete_form_entry',
		table							: 'wap_nex_forms_entries',
		selection						: selection_array,
		_wpnonce						: jQuery('#_wpnonce').text(),
		delete_action					: (jQuery('a.trashed_entries').hasClass('active')) ? 'delete' : 'trash',
		};	
	jQuery.post
		(
		ajaxurl, data, function(response)
			{
			NEXForms_reset_entries_menu();
			}
		);
	
}


function NEXForms_print_form_entry(){
	
	if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) 
					{
					var prtContent = jQuery('form[name="save_form_entry"]').clone();
					prtContent.find('input[type="submit"]').remove();
					prtContent.find('table').removeClass('highlight');
					prtContent.find('.additional_entry_details').removeClass('hidden');
					prtContent.find('table thead').remove();
					var WinPrint = window.open('', '_blank', 'width=834,height=900,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
					
					
					WinPrint.focus();
					
					WinPrint.document.write('<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">');
					WinPrint.document.write('<script src="https://use.fontawesome.com/8e6615244b.js"></script>');
					
					WinPrint.document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.2/css/materialize.min.css">');
					
					WinPrint.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">');
					WinPrint.document.write('<link rel="stylesheet" type="text/css" href="'+ $('#plugins_url').text() +'admin/css/min/print.css"/>')
				
					WinPrint.document.write(prtContent.html());
					WinPrint.document.close();
					
					WinPrint.print();
					//WinPrint.close();
					}
				else
					{
					var prtContent = jQuery('form[name="save_form_entry"]').clone();
					prtContent.find('input[type="submit"]').remove();
					prtContent.find('table').removeClass('highlight');
					prtContent.find('.additional_entry_details').removeClass('hidden');
					prtContent.find('table thead').remove();
					var WinPrint = window.open('', '', 'left=0,top=0,width=834,height=900,toolbar=0,scrollbars=0,status=0');
					
					WinPrint.document.write('<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">');
					WinPrint.document.write('<script src="https://use.fontawesome.com/8e6615244b.js"></script>');
					
					WinPrint.document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.2/css/materialize.min.css">');
					
					WinPrint.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">');
					WinPrint.document.write('<link rel="stylesheet" type="text/css" href="'+ $('#plugins_url').text() +'nf-admin/css/print.css"/>')
				
					WinPrint.document.write(prtContent.html());
					WinPrint.document.close();
					WinPrint.focus();
					WinPrint.print();
					WinPrint.close();	
					}
}

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/*///////////////READY FUNCTION/////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
(function($)
	{
	$(document).ready(function()
		{
		
		
		jQuery(document).on('keyup','input, textarea',
		function()
			{
			var val = jQuery(this).val();
			val = val.replace( /<script[^>]*>/gi, '');
			val = val.replace( /<\/script>/gi, '');
			jQuery(this).val(val)
			}
		);		
			
		jQuery('body').on('click',':not(.nf_context_menu)',
				function()
					{
					jQuery('.nf_context_menu').removeClass('zoomIn');
					jQuery('.nf_context_menu').addClass('zoomOut');
					
					setTimeout(function() {
						jQuery('.nf_context_menu').removeClass('zoomOut');
						jQuery('.nf_context_menu').removeClass('sim_edit');
						jQuery('.nf_context_menu').hide();
					},400);
					}
				);
		
		var set_context_menu_2 = jQuery('.nf_context_menu_2').detach();
		jQuery('#wpwrap').append(set_context_menu_2);
		
		jQuery(document).on('contextmenu','.wap_nex_forms_entries:not(.file_manager) tbody tr',
			function(e)
				{
				if(!dev)
					e.preventDefault();
					
				var isCtrlPressed = e.ctrlKey;
				
				if(isCtrlPressed)
					{
					jQuery(this).addClass('active');
					}
				else
					{
					if(!jQuery(this).hasClass('active'))
						{
						jQuery('.wap_nex_forms_entries tbody tr').removeClass('active')
						jQuery(this).addClass('active');
						}
					}
				jQuery('.restore_record').hide();
				if(jQuery('a.trashed_entries').hasClass('active'))
					{
					jQuery('.restore_record').show();	
					}
				
				set_context_id = jQuery(this).attr('id');
				jQuery('.nf_context_menu').hide();
				jQuery('.nf_context_menu_2').css('top', e.pageY+'px');
				jQuery('.nf_context_menu_2').css('left', (e.pageX-250)+'px');
				jQuery('.nf_context_menu_2').show();
				jQuery('.nf_context_menu_2').addClass('animated_extra_fast');
				jQuery('.nf_context_menu_2').addClass('zoomIn');
				}
			);
		
		
		jQuery(document).on('click','.nf_context_menu_2 ul li, .entry_tools button.do_action',
		function()
			{
			var action = jQuery(this).attr('data-action');
			var sec_action = jQuery(this).attr('data-sec-action');
			
			if(action=='print-form-entry')
				NEXForms_print_form_entry();
			
			if(action=='delete')
				NEXForms_run_batch_delete();
			
			if(action=='mark-read')
				NEXForms_mark_as_read(1,'');
			
			if(action=='mark-unread')
				NEXForms_mark_as_read(0,'');
				
			if(action=='add-star')
				NEXForms_add_entry_star(0, 0)
			if(action=='remove-star')
				NEXForms_add_entry_star(1, 0)
			
			if(action=='restore')
				NEXForms_restore_entry();	
				
			}
		);
		$(document).on('click','.entry_tools .do_action',
			function(e)
				{
				jQuery('.entry_tools .do_action').removeClass('active');
				jQuery(this).addClass('active');
				
				var action = jQuery(this).attr('data-action');
				$('.form_entry_view').hide();
				$('.email_preview').hide();
				
				if(action=='delete')
					{
					$('.form_entry_view').show();
					$('.form_entry_data').html('');
					}
				
				if(action=='view-data')
					$('.form_entry_view').show();
				
				
				
				if(action=='view-admin-email')
					$('.form_entry_admin_email_view').show();
				
				if(action=='view-user-email')
					$('.form_entry_user_email_view').show();
				
				
				}
			);
		
		$(document).on('click','.wap_nex_forms_entries:not(.file_manager) tbody tr td:not(.custom), .edit_form_entry',
			function(e)
				{
				//e.preventDefault();
				var isCtrlPressed = e.ctrlKey;	
				var isShiftPressed = e.shiftKey;

				if($(this).closest('.database_table').hasClass('wap_nex_forms_temp_report'))
					return;	
				
				var row = $(this).closest('tr');	
				
				if($(this).hasClass('edit_form_entry'))
					row = $(this);
				$('.form_entry_data').addClass('faded');

//BATCH SELECTION				
				if(!row.hasClass('edit_form_entry'))
					{
					if(isCtrlPressed)
						{
						if(row.hasClass('active'))
							row.removeClass('active');
						else
							row.addClass('active');
						}
					else if(isShiftPressed)
						{
						var found_selection_down = false;
						var found_selection_up = false;	
						
						row.nextAll('tr').each(function(index, element) {
							if($(this).hasClass('active'))
								found_selection_down = true;
						});
						
						row.prevAll('tr').each(function(index, element) {
							if($(this).hasClass('active'))
								found_selection_up = true;
						});
						if(!found_selection_down)
							{
							row.prevAll('tr').each(function(index, element) {
								if($(this).hasClass('active'))
									return false;
								else
									$(this).addClass('active');
							});
							row.addClass('active');
							}
						
						if(!found_selection_up)
							{
							row.nextAll('tr').each(function(index, element) {
									if($(this).hasClass('active'))
										return false;
									else
										$(this).addClass('active');
								});
							row.addClass('active');	
							}
						}
					else
						{
						$('.wap_nex_forms_entries tr').removeClass('active');
						row.addClass('active');
						//console.log('test3');
						}
					$('.entry_tools button').attr('disabled',false);
					}
				
				var set_batch_selection = false;
				var selection_array = [];
				if($('.wap_nex_forms_entries tr.active').length>1)
					{
					
					set_batch_selection = true;
					$('.wap_nex_forms_entries tr.active').each(
						function()
							{
								selection_array.push($(this).attr('id'))
							}
						);
					}
				else
					{
					selection_array.push(row.attr('id'))	
					}
				var record_id = row.attr('id');
				
				//console.log(set_batch_selection);
				
				if(row.hasClass('edit_form_entry'))
					{
					$('.email_preview').hide();
					$('.form_entry_view').show();
					jQuery('.entry_tools .do_action').removeClass('active');
					jQuery('.entry_tools .do_action.view_form_data').addClass('active');
					}
				
				if(set_batch_selection)
					{
					$('.email_preview').hide();
					$('.form_entry_view').show();
					jQuery('.entry_tools .do_action').removeClass('active');
					jQuery('.entry_tools .do_action.view_form_data').addClass('active');
					
					jQuery('.no_batch').attr('disabled','disabled');
					}
				else
					{
					jQuery('.no_batch').attr('disabled',false);
					}
				
				$('button.edit_form_entry').attr('id',record_id);
				$('button.print_to_pdf').attr('id',record_id);
				
				var data =
					{
					action	 						: 'nf_populate_form_entry_dashboard',
					form_entry_Id					: record_id,
					batch							: set_batch_selection,
					selection						: selection_array,
					load_entry						: jQuery('#load_entry').text(),
					edit_entry						: 0
					};	
				if(row.hasClass('edit_form_entry'))
					{
					data.edit_entry = 1;
					$('.entry_tools button').hide();
					$('.cancel_save_form_entry').show();
					$('button.save_button').show();
					}
				else
					{
					$('.entry_tools button').show();
					$('.cancel_save_form_entry').hide();
					$('button.save_button').hide();
					}
				jQuery.post
					(
					ajaxurl, data, function(response)
						{	
						if(!set_batch_selection)
							{
							jQuery('.admin_email_view').attr('src',jQuery('.admin_url').text() + '/admin.php?page=nex-forms-email-preview&emial-preview=admin&entry_Id='+data.form_entry_Id);
							jQuery('.user_email_view').attr('src',jQuery('.admin_url').text() + '/admin.php?page=nex-forms-email-preview&emial-preview=user&entry_Id='+data.form_entry_Id);
							}
						$('.form_entry_data').html(response).removeClass('faded');
						$('textarea').trigger('autoresize');
						
						$('.materialboxed').materialbox();
						
						if(row.find('span.set_viewed').hasClass('not_viewed'))
							{
							if(!isCtrlPressed && !isShiftPressed)
								{
								row.find('span.set_viewed').attr('class','set_viewed viewed fas fa-eye');
								var get_unread_overall = $('.all_entries .form_entry_unread').text();	
								get_unread_overall = get_unread_overall.replace('(','');
								get_unread_overall = get_unread_overall.replace(')','');
								get_unread_overall = parseInt(get_unread_overall);
								if((get_unread_overall-1)==0)
									$('.all_entries .form_entry_unread').text('');
								else
									$('.all_entries .form_entry_unread').html('&nbsp('+(get_unread_overall-1) + ')');
									
								var get_form_id = row.find('span.the_form_title').attr('data-form-id');
								
								var get_unread_form = $('.form_id_' + get_form_id + ' .form_entry_unread').text();	
								get_unread_form = get_unread_form.replace('(','');
								get_unread_form = get_unread_form.replace(')','');
								get_unread_form = parseInt(get_unread_form);
								if((get_unread_form-1)==0)
									$('.forms_menu .form_id_' + get_form_id + ' .form_entry_unread').text('');
								else
									$('.forms_menu .form_id_' + get_form_id + ' .form_entry_unread').text('('+(get_unread_form-1) + ')');
								}
							}		
						}
					);
				}
			);
		
		
		
		$(document).on('click','th.sortable',
			function(e)
				{
				$(this).closest('.database_table').find('th.sortable').removeClass('sorting');
				
				$(this).addClass('sorting');
				
				if($(this).hasClass('dir_asc'))
					{
					$(this).closest('.database_table').find('input[name="sort_by_direction"]').val('DESC');
					$(this).removeClass('dir_asc');
					}
				else
					{
					$(this).closest('.database_table').find('input[name="sort_by_direction"]').val('ASC');
					$(this).addClass('dir_asc');
					}
				$(this).closest('.database_table').find('input[name="sort_by"]').val(jQuery(this).attr('data-sort-by'));
				
				nf_get_records(0,$(this).closest('.database_table').find('.paging_wrapper'));	
				}
			);
		
		
		 
		$(document).on('click','.filter_button',
			function(e)
				{
				if($(this).hasClass('active'))
					$(this).removeClass('active');
				else
					$(this).addClass('active');
				
				$('li.form_item a.active').parent().trigger('click');
				}
			);
		
		
		if($('.set_entry_id').text()!='0')
			setTimeout(function(){ $('.form_record#'+ $('.set_entry_id').text()).find('td').first().trigger('click'); },300);

			
			
		if($('.set_folder').text()!='0')
			setTimeout(function(){ $('li.form_item a.form_entries_'+ $('.set_folder').text()).trigger('click'); },300);
			
		
		
		
		
		$(document).on('click','li.analytics_item',
			function(e)
				{
				$('li.analytics_item a').removeClass('active');
				$(this).find('a').addClass('active');
				
				nf_print_chart($('.switch_chart.active').attr('data-chart-type'), jQuery(this).attr('data-form-id'));
				}
			);
		
		
		
		
		$(document).on('click','li.reporting_item',
			function(e)
				{
				$('li.reporting_item a').removeClass('active');
				$(this).find('a').addClass('active');
				
				
				$('.report-loader').removeClass('hidden');
				jQuery('select[name="showhide_fields[]"] option').prop('selected',false);
				
				nf_build_report_table(jQuery(this).attr('data-form-id'),'',true);
				}
			);
			
		
		$(document).on('change','select[name="report_form_selection"]',
			function(e)
				{
				if(jQuery(this).val()!=0)
					nf_build_report_table(jQuery(this).val(),'',true);
				}
			);
		
		
		$(document).on('click','li.form_item',
			function(e)
				{
				$('li.form_item a').removeClass('active');
				
				$(this).find('a').addClass('active');
				
				current_folder = $(this).attr('data-folder');
				
				
				
				var additional_params = '[';
				
				//$('.wap_nex_forms_entries').find('input[name="database_table"]').val('wap_nex_forms_entries');
				
				$('#current_form_id').text($(this).attr('data-form-id'));
				
				//$('.wap_nex_forms_entries').find('input[name="header_params"]').val('["Id",{"icon":"fas fa-star","user_func":"NEXForms_starred","user_func_args_1":"Id","user_func_args_2":"wap_nex_forms_entries","set_class":"custom starred","sort_by":"starred"},{"icon":"fas fa-paperclip","user_func":"NEXForms_get_attachment","user_func_args_1":"Id","user_func_args_2":"wap_nex_forms_files"},{"icon":"fas fa-glasses","user_func":"NEXForms_entry_status","user_func_args_1":"Id","user_func_args_2":"wap_nex_forms_entries","set_class":"custom read","sort_by":"viewed"},{"heading":"Form","user_func":"NEXForms_get_title3","user_func_args_1":"nex_forms_Id","user_func_args_2":"wap_nex_forms"},"page",{"heading":"Submitted","user_func":"NEXForms_time_elapsed_string","user_func_args_1":"date_time","user_func_args_2":"wap_nex_forms","sort_by":"date_time"},"date_time"]');
				
				//$('.wap_nex_forms_entries thead').html('<tr><th class="batch-actions"><input id="rs-check-all" name="check-all" value="check-all" type="checkbox"></th><th class="db-table-head  sortable id" data-sort-by="id">id</th><th class="db-table-head custom starred  sortable" data-sort-by="starred"><span class="fas fa-star"></span></th><th class="db-table-head   "><span class="fas fa-paperclip"></span></th><th class="db-table-head custom read  sortable" data-sort-by="viewed"><span class="fas fa-glasses"></span></th><th class="db-table-head  form ">form</th><th class="db-table-head  sortable page" data-sort-by="page">page</th><th class="db-table-head  submitted sortable" data-sort-by="date_time">submitted</th><th class="db-table-head  sortable date_time" data-sort-by="date_time">date time</th></tr>');
				
				if($(this).hasClass('all_entries'))
					{
					additional_params += '{"column":"trashed","operator":"IS","value":"NULL"}';
					}
					
				else if($(this).hasClass('entry_attachment'))
					{
					additional_params += '{"column":"attachments","operator":"=","value":1}, {"column":"trashed","operator":"IS","value":"NULL"}';
					}
				
				else if($(this).hasClass('starred_entries'))
					{
					additional_params += '{"column":"starred","operator":"=","value":1}, {"column":"trashed","operator":"IS","value":"NULL"}';
					}
				
				else if($(this).hasClass('paypal_entries'))
					{
					additional_params += '{"column":"paypal_payment_id","operator":"<>","value":"\'\'"}, {"column":"trashed","operator":"IS","value":"NULL"}';
					}
				
				else if($(this).hasClass('paypal_entries_paid'))
					{
					additional_params += '{"column":"paypal_payment_id","operator":"<>","value":"\'\'"}, {"column":"payment_status","operator":"=","value":"payed"}, {"column":"trashed","operator":"IS","value":"NULL"}';
					}
				
				else if($(this).hasClass('paypal_entries_unpaid'))
					{
					additional_params += '{"column":"paypal_payment_id","operator":"<>","value":"\'\'"}, {"column":"payment_status","operator":"=","value":"failed"}, {"column":"trashed","operator":"IS","value":"NULL"}';
					}
				else if($(this).hasClass('paypal_entries_pending'))
					{
					additional_params += '{"column":"paypal_payment_id","operator":"<>","value":"\'\'"}, {"column":"payment_status","operator":"=","value":"pending"}, {"column":"trashed","operator":"IS","value":"NULL"}';
					}
					
				
				
				else if($(this).hasClass('archived_entries'))
					{

					}
				
				
				else if($(this).hasClass('trashed_entries'))
					{
					additional_params += '{"column":"trashed","operator":"=","value":1}';
					}
				else
					{
					additional_params += '{"column":"nex_forms_Id","operator":"=","value":'+ $(this).attr('data-form-id') +'}, {"column":"trashed","operator":"IS","value":"NULL"}';
					}
				
				
				
				if($('.filter_starred').hasClass('active'))
					{
					additional_params += ',{"column":"starred","operator":"=","value":1}';
					}
				if($('.filter_attachments').hasClass('active'))
					{
					additional_params += ',{"column":"attachments","operator":"=","value":1}';
					}
				/*if($('.filter_read').hasClass('active'))
					{
					additional_params += ',{"column":"viewed","operator":"=","value":"viewed"}';
					}*/
				if($('.filter_unread').hasClass('active'))
					{
					additional_params += ',{"column":"viewed","operator":"IS","value":"NULL"}';
					}
				
				
				
				
				additional_params += ']';
				
				$('.wap_nex_forms_entries').find('input[name="additional_params"]').val(additional_params);
				
				nf_get_records(0,$('.wap_nex_forms_entries').find('.paging_wrapper'),$(this).attr('data-form-id'));
				}
			);
		
		if(jQuery('#demo_site').text()=='yes')
			{
			setTimeout(function(){ $('a.create_new_form').trigger('click'); },200);
			}
		
		
		/*$(document).on('click','li.toplevel_page_nex-forms-dashboard ul li:nth-child(8)',
			function(e)
				{
				e.preventDefault();
				$('li.toplevel_page_nex-forms-dashboard .current').removeClass('current');
				$(this).addClass('current');
				$('.tabs_nf a.add_ons_tab').trigger('click');
				}
			);
		$(document).on('click','.tabs_nf a.add_ons_tab',
			function()
				{
				$('li.toplevel_page_nex-forms-dashboard .current').removeClass('current');
				$('li.toplevel_page_nex-forms-dashboard ul li:nth-child(8)').addClass('current');	
				}
			);
		
		
		$(document).on('click','li.toplevel_page_nex-forms-dashboard ul li:nth-child(7)',
			function(e)
				{
				e.preventDefault();
				$('li.toplevel_page_nex-forms-dashboard .current').removeClass('current');
				$(this).addClass('current');
				$('.tabs_nf a.global_settings_tab').trigger('click');
				}
			);
		$(document).on('click','.tabs_nf a.global_settings_tab',
			function()
				{
				$('li.toplevel_page_nex-forms-dashboard .current').removeClass('current');
				$('li.toplevel_page_nex-forms-dashboard ul li:nth-child(7)').addClass('current');	
				}
			);
		
		
		$(document).on('click','li.toplevel_page_nex-forms-dashboard ul li:nth-child(6)',
			function(e)
				{
				e.preventDefault();
				$('li.toplevel_page_nex-forms-dashboard .current').removeClass('current');
				$(this).addClass('current');
				$('.tabs_nf a.file_uploads_tab').trigger('click');
				}
			);
		$(document).on('click','.tabs_nf a.file_uploads_tab',
			function()
				{
				$('li.toplevel_page_nex-forms-dashboard .current').removeClass('current');
				$('li.toplevel_page_nex-forms-dashboard ul li:nth-child(6)').addClass('current');	
				}
			);
		
		
		
		$(document).on('click','li.toplevel_page_nex-forms-dashboard ul li:nth-child(5)',
			function(e)
				{
				e.preventDefault();
				$('li.toplevel_page_nex-forms-dashboard .current').removeClass('current');
				$(this).addClass('current');
				$('.tabs_nf a.reporting_tab').trigger('click');
				}
			);
		$(document).on('click','.tabs_nf a.reporting_tab',
			function()
				{
				$('li.toplevel_page_nex-forms-dashboard .current').removeClass('current');
				$('li.toplevel_page_nex-forms-dashboard ul li:nth-child(5)').addClass('current');	
				}
			);
		
		
		$(document).on('click','li.toplevel_page_nex-forms-dashboard ul li:nth-child(4)',
			function(e)
				{
				e.preventDefault();
				$('li.toplevel_page_nex-forms-dashboard .current').removeClass('current');
				$(this).addClass('current');
				$('.tabs_nf a.submissions_tab').trigger('click');
				}
			);
		$(document).on('click','.tabs_nf a.submissions_tab',
			function()
				{
				$('li.toplevel_page_nex-forms-dashboard .current').removeClass('current');
				$('li.toplevel_page_nex-forms-dashboard ul li:nth-child(4)').addClass('current');	
				}
			);
		
		
		
		$(document).on('click','li.toplevel_page_nex-forms-dashboard ul li:nth-child(3)',
			function(e)
				{
				e.preventDefault();
				$('li.toplevel_page_nex-forms-dashboard .current').removeClass('current');
				$(this).addClass('current');
				$('.tabs_nf a.forms_tab').trigger('click');
				}
			);
		$(document).on('click','.tabs_nf a.forms_tab',
			function()
				{
				$('li.toplevel_page_nex-forms-dashboard .current').removeClass('current');
				$('li.toplevel_page_nex-forms-dashboard ul li:nth-child(3)').addClass('current');	
				}
			);
		
	
		
		setTimeout(function(){
		$('.tabs_nf li.tab a.active').removeClass('active').trigger('click');
		},500);
		
		*/
		
		
		
		
		$(document).on('click','a.global_settings',
		  function()
		   {
			$('#global_settings .tabs_nf li.tab a.active').removeClass('active').trigger('click');
		   }
		  );
		
		if(document.getElementById("chart_canvas"))
			{
			ctx = document.getElementById("chart_canvas").getContext("2d");

			form_analytics_chart = new Chart(ctx,{
				type: 'line',
				data: lineChartData,
				options: chart_options
			});
			}
		
			
		jQuery('input[name="current_page"]').val('0')
		jQuery('input[name="table_search_term"]').val('')

		$('.carousel').carousel();
		$('.materialbox').materialbox();
		$('.button-collapse').sideNav(
			{
			menuWidth: 300, // Default is 300
			edge: 'right', // Choose the horizontal origin
			closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
			draggable: true // Choose whether you can drag to open on touch screens
			}
		);
        
	 
		$('.modal').modal(
			{
			dismissible: true, // Modal can be dismissed by clicking outside of the modal
			opacity: .8, // Opacity of modal background
			inDuration: 300, // Transition in duration
			outDuration: 200, // Transition out duration (not for bottom modal)
			startingTop: '4%', // Starting top style attribute (not for bottom modal)
			endingTop: '10%', // Ending top style attribute (not for bottom modal)
			ready: function(modal, trigger)
				{ 	// Callback for Modal open. Modal and trigger parameters available.
					// console.log(modal, trigger);
				},
			complete: function() 
				{  
				} // Callback for Modal close
			}
		);
		
		 $('select.material_select').material_select();
    
		//REMOVE UNWANTED STYLESHEETS
			var link_id = '';
			var css_link = '';
			jQuery('head link').each(
				function()
					{
					css_link = jQuery(this);
					link_id = jQuery(this).attr('id');
					jQuery('.unwanted_css_array .unwanted_css').each(
						function()
							{
							if(link_id)
								{
								if(link_id.trim()==jQuery(this).text())
									css_link.attr('href','');
								}
							}
						);
					
					}
				)	
			
			
		
/* SORT INTO APROPRIATE FILES */
	
	
	$(document).on('change','select[name="set_record_per_page"]',
		function()
			{
			$(this).closest('.database_table').find('input[name="record_limit"]').val($(this).val());
			nf_get_records(0,$(this).closest('.database_table').find('.paging_wrapper'));
			}
		);
	
	$(document).on('change','select[name="entry_report_id"]',
		function()
			{
			nf_get_records(0,$(this).closest('.database_table').find('.paging_wrapper'),$(this).val());
			}
		);
	$(document).on('change','select[name="form_id"]',
		function()
			{
			nf_get_records(0,$(this).closest('.database_table').find('.paging_wrapper'),'',$(this).val());
			}
		);
	$(document).on('click','a.iz-next-page',
		function()
			{
			
			var get_page = 	 parseInt($(this).closest('.paging_wrapper').find('input[name="current_page"]').val());	
				
			if((get_page+1) >= parseInt($(this).closest('.paging_wrapper').find('span.total-pages').html()))
				 return false;
			
			get_page = get_page+1
			$(this).closest('.paging_wrapper').find('input[name="current_page"]').val(get_page);
			nf_get_records(get_page,$(this).closest('.paging_wrapper'));
			}
		);
	
	$(document).on('blur','input.search_box',
		function()
			{
			
			if($(this).val()=='')
				$(this).parent().parent().removeClass('open');
			}
		);
	
	$(document).on('keyup','input.search_box',
		function()
			{
			clearTimeout(search_timer);
			var input = $(this);
			var val = input.val();
			search_timer = setTimeout(
				function()
					{ 
					nf_get_records(0,input.closest('.dashboard-box').find('.paging_wrapper'));
					}, 
				400);
			}
		);
	
	$(document).on('click','.do_search',
		function()
			{
			if($(this).closest('.search_box').hasClass('open'))
				{
				$(this).closest('.search_box').removeClass('open');
				$(this).closest('.search_box').find('input').val('');
				$(this).closest('.search_box').find('input').trigger('keyup');
				}
			else
				{
				$(this).closest('.search_box').addClass('open');
				$(this).closest('.search_box').find('input').focus();
				}
			}
		);
	
	$(document).on('click','a.iz-prev-page',
		function()
			{
			var get_page = 	 parseInt($(this).closest('.paging_wrapper').find('input[name="current_page"]').val());	
			if(get_page<=0)
				 return false;
			
			get_page = get_page-1
			$(this).closest('.paging_wrapper').find('input[name="current_page"]').val(get_page);
			nf_get_records(get_page,$(this).closest('.paging_wrapper'));
			}
		);
	$(document).on('click','a.iz-first-page',
		function()
			{
			$(this).closest('.paging_wrapper').find('input[name="current_page"]').val(0);
			nf_get_records(0,$(this).closest('.paging_wrapper'));
			}
		);
		
	$(document).on('click','a.iz-last-page',
		function()
			{
			var get_val = parseInt($(this).closest('.paging_wrapper').find('span.total-pages').html())-1;
			$(this).closest('.paging_wrapper').find('input[name="current_page"]').val(get_val);
			nf_get_records(get_val,$(this).closest('.paging_wrapper'));
			}
		);
	
	$(document).on('click','th a span.sortable-column',
		function()
			{
			jQuery('input[name="orderby"]').val(jQuery(this).attr('data-col-name'));
			
			jQuery('th a').removeClass('asc');
			jQuery('th a').removeClass('desc');
			load_form_entries(jQuery('#form_update_id').text());
			
			if(jQuery(this).attr('data-col-order')=='asc')
				{
				jQuery('th.column-'+ jQuery(this).attr('data-col-name') +' a').	removeClass('asc');
				jQuery('th.column-'+ jQuery(this).attr('data-col-name') +' a').	addClass('desc');
				jQuery('th.column-'+ jQuery(this).attr('data-col-name') +' a span.sortable-column').attr('data-col-order','desc');
				}
			else
				{
					
				jQuery('th.column-'+ jQuery(this).attr('data-col-name') +' a').	removeClass('desc');
				jQuery('th.column-'+ jQuery(this).attr('data-col-name') +' a').	addClass('asc');
				jQuery('th.column-'+ jQuery(this).attr('data-col-name') +' a span.sortable-column').attr('data-col-order','asc');
				}
			jQuery('input[name="order"]').val(jQuery(this).attr('data-col-order'));
			}
		);
		
		jQuery('form[name="save_form_entry"]').ajaxForm({
			beforeSubmit: function(formData, jqForm, options) {
			},
		   success : function(responseText, statusText, xhr, $form) {
			   $('.wap_nex_forms_entries tr#'+responseText +' td:not(.custom)').trigger('click');			   
			   Materialize.toast('<span class="fa fa-check"></span>&nbsp;&nbsp;Saved', 2000, 'toast-success');
			   
			   $('.form_entry_view .dashboard-box-header .btn').show();
			   $('button.save_button').hide();
			},
			 error: function(jqXHR, textStatus, errorThrown)
				{
				   console.log(errorThrown)
				}
			});	
				
		
			
		$(document).on('click', '.cancel_save_form_entry',
			function()
				{
				$('.form_record.active td:not(.custom)').trigger('click');
				}
			);
			
		
		
		$(document).on('click','.database_table tbody tr',
			function()
				{
					/*var row = $(this);*/
					/*if(row.hasClass('active'))
						{
						row.removeClass('active');
						}
					else
						{
						row.closest('.database_table').find('tr').removeClass('active');
						row.addClass('active');
						}*/
				}
			);
		
		
		$(document).on('click','.report_table_selection .wap_nex_forms.database_table tbody tr',
			function()
				{
					$('.report-loader').removeClass('hidden');
					jQuery('select[name="showhide_fields[]"] option').prop('selected',false);
					
					nf_build_report_table(jQuery(this).attr('id'),'',true);
				}
			);
		
		/*$(document).on('click','.run_query_2',
			function()
				{
				$('.run_query').trigger('click');
				}
			);*/
		
		$(document).on('click','.run_query',
			function()
				{
				
				//target.find('input[name="is_report"]').val(),
				
				var additional_params = []; 
				
				if($('.clause_container .new_clause').length>0)
					{
					$('.clause_container .new_clause').each(
						function()
							{
							if($(this).find('select[name="column"]').val())
								{
								additional_params.push(
										{
										column:$(this).find('select[name="column"]').val(),
										operator: $(this).find('select[name="operator"]').val(), 
										value: $(this).find('input[name="column_value"]').val()
										}
									);
								}
							}
						);
					}
				
					
				nf_build_report_table(jQuery(this).attr('id'), additional_params);
				
				}
			);
		
		$(document).on('click','.report_table_container .table_title .btn-floating',
			function()
				{
				
				if($('.report_table_container .reporting_controls').hasClass('is_active'))
					{
					$('.report_table_container .reporting_controls').removeClass('is_active');	
					$('.report_table_container .header_text').removeClass('white_txt');
					$(this).removeClass('open');
					}
				else
					{
					$('.report_table_container .reporting_controls').addClass('is_active');
					$('.report_table_container .header_text').addClass('white_txt');	
					$(this).addClass('open');
					}
				}
			);
		
		
		$(document).on('click','.add_new_where_clause2',
			function()
				{
				var clause = $('.clause_replicator').clone();
				clause.removeClass('hidden').removeClass('clause_replicator').addClass('new_clause');
				
				$('.clause_container').append(clause);
				}
			);
		$(document).on('click','.remove_where_clause',
			function()
				{
				$(this).closest('.new_clause').remove();
				
				}
			);

		$(document).on('click','.print_to_pdf',
			function()
				{
				var record_id = $(this).attr('id');
				Materialize.toast('Creating PDF, please wait', 60000, 'loading-pdf');
				var data =
					{
					action	 						: 'nf_print_to_pdf',
					form_entry_Id					: record_id,
					save							: 1,
					ajax							: 1
					};	
				jQuery.post
					(
					ajaxurl, data, function(response)
						{
							
							if(response=='not installed')
								{
								//$('#pfd_creator_not_installed').modal('open');
								$('.toast.loading-pdf').remove();
								Materialize.toast('PDF Creator not installed', 60000, 'loading-pdf');
								}
							else
								{
								$('.toast.loading-pdf').remove();
								window.open(
								  response,
								  '_blank' // <- This is what makes it open in a new window.
								);
							
							setTimeout(function()
								{
								var data2 =
									{
									action	 						: 'nf_delete_pdf',
									form_entry_Id					: record_id,
									};	
								jQuery.post
									(
									ajaxurl, data2, function(response2)
										{
										
										}
									);
								},10000);
							
							
							}
						}
					);
				
				setTimeout(function()
					{
					var data2 =
						{
						action	 						: 'nf_delete_pdf',
						form_entry_Id					: record_id,
						};	
					jQuery.post
						(
						ajaxurl, data2, function(response)
							{
							
							}
						);
					},10000);
						
					
				}
			);
		
		
		$(document).on('click','.print_report_to_pdf',
			function()
				{
				var data =
					{
					action	 : 'nf_print_report_to_pdf',
					};	
				Materialize.toast('Creating PDF, please wait', 60000, 'loading-pdf');
				jQuery.post
					(
					ajaxurl, data, function(response)
						{
							$('.toast.loading-pdf').remove();
							
							if(response=='not installed')
								$('#pfd_creator_not_installed').modal('open');
							else
								{
								window.open(
								  response,
								  '_blank' // <- This is what makes it open in a new window.
								);
							
							
							setTimeout(function()
								{
								var data2 =
									{
									action	 						: 'nf_delete_pdf'
									};	
								jQuery.post
									(
									ajaxurl, data2, function(response2)
										{
										
										}
									);
								},10000);
							
							
							}
						}
					);
				}
			);
		
		
		$(document).on('click','.wap_nex_forms_entries tbody tr td.custom.read',
			function()
				{
					
					//NEXForms_mark_as_read()
				}
			);
		
		$(document).on('click','.wap_nex_forms_entries tbody tr td.custom.starred',
			function()
				{
					var row = $(this).closest('tr');
					var record_id = row.attr('id');
					var starred = ($(this).find('.set_starred').hasClass('not_starred')) ? 0 : 1;
					
					if(starred)
						{
						$(this).find('.set_starred').removeClass('is_starred');
						$(this).find('.set_starred').addClass('not_starred');
						
						$(this).find('.set_starred').removeClass('fas');
						$(this).find('.set_starred').addClass('far');
						}
					else
						{
						$(this).find('.set_starred').removeClass('not_starred');
						$(this).find('.set_starred').addClass('is_starred');
						
						$(this).find('.set_starred').removeClass('far');
						$(this).find('.set_starred').addClass('fas');
						}
					
					NEXForms_add_entry_star(starred,record_id);
				}
			);
		
		
		$(document).on('click','button.save_form_entry',
			function()
				{
				jQuery('form[name="save_form_entry"]').submit();	
				}
			);
		
		$(document).on('click','.batch_entry',
			function(e)
				{
					jQuery('.wap_nex_forms_entries tbody tr#'+ $(this).attr('id') +' td.date_time').trigger('click');
				}
			);
		
		
		
		
		$('.right-col-top').resizable({
					  minHeight: 200
		});
		
		
		/*$('.db-table-head').resizable({
					  minWidth: 100,
					  handles: "w"
		});*/
		
		
		
		jQuery(document).on('click', '.deactivate_license', function(){
				var data =
						{
						action	 :  'deactivate_license',
						_wpnonce : jQuery('#_wpnonce').text(),
						};
					
					jQuery('.deactivate_license').html('<span class="fa fa-spin fa-spinner"></span> Unregistering...')
									
					jQuery.post
						(
						ajaxurl, data, function(response)
							{
							Materialize.toast('Purshase Code unregistered', 2000, 'toast-success')
							setTimeout(function(){ jQuery(location).attr('href',jQuery('#siteurl').text()+'/wp-admin/admin.php?page=nex-forms-dashboard'), 3000});
							}
						);
					}
				);
		
		jQuery(document).on('click', '.verify_purchase_code', function(){
		var data =
				{
				action	:  'get_data' ,
				eu		:	jQuery('#envato_username').val(),
				pc		:	jQuery('#purchase_code').val(),
				rereg   :   false
				};
			if(jQuery(this).hasClass('re-register'))
				data.rereg = true
				
			
			
			jQuery('.verify_purchase_code').html('<span class="fa fa-spin fa-spinner"></span> Verifying')
							
			jQuery.post
				(
				ajaxurl, data, function(response)
					{
					if(strstr(response, 'License Activated'))
						{
						Materialize.toast('Purchase code Registered!', 2000, 'toast-success')
						setTimeout(function(){ jQuery(location).attr('href',jQuery('#siteurl').text()+'/wp-admin/admin.php?page=nex-forms-dashboard'), 3000});
						}
					else if(strstr(response, 'License already in use'))
						{
						jQuery('.show_code_response').html(response);
						jQuery('.verify_purchase_code').html('Re-register').addClass('re-register');
						}
					else
						{
						jQuery('.show_code_response').html(response);
						jQuery('.verify_purchase_code').html('Register');
						}
					}
				);
			}
		);
		
		$(document).on('click','.delete-record',
			function()
				{
				var row = $(this).closest('tr');
				row.css('background','#f3989b');
				var result = confirm("Are you sure you want to delete this record?");
				var table = $(this).attr('data-table');
				var record_id = $(this).attr('id');
				if (result) 
					{
					if($(this).closest('.database_table').hasClass('wap_nex_forms_temp_report'))
						{
						var data =
							{
							action	 						: 'nf_delete_record',
							table							: 'wap_nex_forms_entries ',
							_wpnonce						: jQuery('#_wpnonce').text(),
							Id								: row.find('td.entry_Id').text()
							};	
						jQuery.post(ajaxurl, data, function(response){});
						}
					
					if($(this).closest('.database_table').hasClass('file_manager'))
						{
						var data =
							{
							action	 						: 'nf_delete_file',
							table							: table,
							_wpnonce						: jQuery('#_wpnonce').text(),
							Id								: record_id
							};	
						jQuery.post(ajaxurl, data, function(response){});
						}
					
					var data =
						{
						action	 						: 'nf_delete_record',
						table							: table,
						_wpnonce						: jQuery('#_wpnonce').text(),
						Id								: record_id
						};	
					jQuery.post
						(
						ajaxurl, data, function(response)
							{		
							row.fadeOut('fast','',
								function()
									{
									row.remove();
									Materialize.toast('Record Deleted!', 2000, 'toast-success')
									}
								);
							}
						);
					}
				else
					row.css('background','');
				}
			);
		}
	);

	
	$(document).on('click','.switch_chart',
		function()
			{
			$('#chart_canvas').removeClass('hide_chart');
			if($(this).attr('data-chart-type')=='global')
				$('#chart_canvas').addClass('hide_chart');
			
			$('.switch_chart').removeClass('active');
			$(this).addClass('active');
			nf_print_chart($(this).attr('data-chart-type'), $('.database_table.wap_nex_forms tr.active').attr('id'));
			}
		);
	
	$(document).on('change','select[name="stats_per_form"], select[name="stats_per_year"], select[name="stats_per_month"]',
		function()
			{
			nf_print_chart($('.switch_chart.active').attr('data-chart-type'), $('select[name="stats_per_form"] option:selected').val());
			}
		);
	
	$(document).on('click','.chart-selection .form_record td.Id, .chart-selection .form_record td.title',
		function()
			{
			//$(this).parent().find('.edit_record').trigger('click');
			//$(this).parent().find('.edit_record .fa').trigger('click');
			}
		);
	
	$(document).on('click','.duplicate_record',
		function()
			{
			var elm = jQuery(this);
			var data =
				{
				action	 						: 'nf_duplicate_record',
				table							: 'wap_nex_forms',
				_wpnonce						: jQuery('#_wpnonce').text(),
				Id								: jQuery(this).attr('id')
				};
				
			jQuery.post
				(
				ajaxurl, data, function(response)
					{
					Materialize.toast('Form Duplicated', 2000, 'toast-success');
					elm.closest('.database_table').find('.first-page').trigger('click');
					}
				);
			}
		);
	

	
	
	
})(jQuery);

function nf_print_chart(chart_type, form_id){

	var data = 	
		{
		action	 			: 'nf_print_chart',
		ajax	 			: 1,
		form_id				: (form_id) ? form_id : 0,
		year_selected		: jQuery('select[name="stats_per_year"]').val(),
		month_selected 		: jQuery('select[name="stats_per_month"]').val(),
		chart_type			: chart_type
		};
		
	jQuery('.chart-container').addClass('faded');
	
	jQuery.post
		(
		ajaxurl, data, function(response)
			{
			jQuery('.chart-container .data_set').html(response);
			
			form_analytics_chart.destroy();
			jQuery('.chart-container').removeClass('faded');
			
			form_analytics_chart = new Chart(ctx,{
					type: chart_type,
					data: lineChartData,
					options: chart_options
				});
		}
	);	
}



function nf_get_records(page,target,id,form_id){
	
	var show_fields = '';
	
	var data = 	
		{
		action	 			: 'get_table_records',
		page	 			: page,
		do_ajax				: 1,
		do_action			: target.find('input[name="do_action"]').val(),
		record_limit		: target.find('input[name="record_limit"]').val(),
		show_delete			: target.find('input[name="show_delete"]').val(),
		sort_by				: target.find('input[name="sort_by"]').val(),
		sort_by_direction	: target.find('input[name="sort_by_direction"]').val(),
		additional_params	: target.find('input[name="additional_params"]').val(),
		header_params		: target.find('input[name="header_params"]').val(),
		search_params		: target.find('input[name="search_params"]').val(),
		table				: target.find('input[name="database_table"]').val(),
		is_report			: target.find('input[name="is_report"]').val(),
		search_term			: target.closest('.database_table').find('input[name="table_search_term"]').val(),
		entry_report_id		: (id) ? id : target.closest('.database_table').find('select[name="entry_report_id"]').val(),
		form_id				: (form_id) ? form_id : target.closest('.database_table').find('select[name="form_id"]').val(),
		field_selection		: target.find('input[name="field_selection"]').val(),
		};
	
	
	target.closest('.database_table').find('.saved_records_container').addClass('faded');
	
	jQuery.post
		(
		ajaxurl, data, function(response)
			{
			jQuery('.right-col').removeClass('loading_report');
			target.closest('.database_table').find('tbody.saved_records_container').html(response);
			target.closest('.database_table').find('tbody.saved_records_contianer').html('<tr><td colspan="100"><div class="alert alert-danger">Sorry, you need to activate this plugin to view entry reports. Go to global settings above and follow activation procedure.</strong></td><tr>');
			target.closest('.database_table').find('span.current-page').html(page+1);

			jQuery('#nf_dashboard_load').text('1');
			target.closest('.database_table').find('.saved_records_container').removeClass('faded');
			target.closest('.database_table').find('.database-table-loader').addClass('hidden');
			

			var total_records = target.closest('.database_table').find('.total_table_records').text()
			
			var record_limit = target.find('input[name="record_limit"]').val();
			
			var total_pages = Math.floor((parseFloat(total_records)/record_limit)+1);
		
			var output = '';
			
			output += '<span class="displaying-num"><span class="entry-count">'+ parseInt(total_records) +'</span> items </span>';
			
							
				output += '<span class="pagination-links">';
				output += '<span class="paging-input">';
				output += 'Page <span class="current-page">'+ (page+1) +'</span> of <span class="total-pages">'+ total_pages +'</span><span class="records_per_page"><select name="set_record_per_page"><option value="10" '+ ((record_limit==10) ? 'selected="selected"' : '') +'>10</option><option value="20" '+ ((record_limit==20) ? 'selected="selected"' : '') +'>20</option><option value="50" '+ ((record_limit==50) ? 'selected="selected"' : '') +'>50</option><option value="100" '+ ((record_limit==100) ? 'selected="selected"' : '') +'>100</option><option value="150" '+ ((record_limit==150) ? 'selected="selected"' : '') +'>150</option><option value="300" '+ ((record_limit==300) ? 'selected="selected"' : '') +'>300</option><option value="500" '+ ((record_limit==500) ? 'selected="selected"' : '') +'>500</option><option value="1000" '+ ((record_limit==1000) ? 'selected="selected"' : '') +'>1000</option></select> records p/page</span>';
				if(total_pages>1)
				{
				output += '<a title="Go to the first page" class="first-page iz-first-page btn waves-effect waves-light"><span class="fa fa-angle-double-left"></span></a>';
				output += '<a title="Go to the next page" class="iz-prev-page btn waves-effect waves-light prev-page"><span class="fa fa-angle-left"></span></a>&nbsp;';
				output += '<a title="Go to the next page" class="iz-next-page btn waves-effect waves-light next-page"><span class="fa fa-angle-right"></span></a>';
				output += '<a title="Go to the last page" class="iz-last-page btn waves-effect waves-light last-page"><span class="fa fa-angle-double-right"></span></a></span>';
				}
				
				/*<span class="records_per_page">
							<select name="set_record_per_page">
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="50">50</option>
							<option value="100">100</option>
							<option value="150">150</option>
							<option value="300">300</option>
							<option value="500">500</option>
							<option value="1000">1000</option>
							</select> '.__('records p/page','nex-forms').'</span>*/
			target.closest('.database_table').find('.paging').html(output);	
			 jQuery('select.material_select').material_select();
			 jQuery('.materialboxed').materialbox();
			jQuery('.dropdown-button').dropdown(
					{
					 belowOrigin: true,	
					}
				);
			
			jQuery('[data-toggle="tooltip_bs"]').tooltip_bs(
					{
					delay: 0,
					html:true
					}
				);	
			
			}
		);	
}
function hideSelectedColumns(checkbox) {
 
 
 var index = checkbox.val();
 var table = jQuery('.report_table_container table');
  if(checkbox.attr('checked')!='checked')
   {
   table.find('tr').each(
    function()
     {
	if(jQuery(this).hasClass('reporting_controls'))
		return;	
     jQuery(this).children('td:eq('+index+')').hide();
	 jQuery(this).children('th:eq('+index+')').hide();
    
     }
    );
   }
  else
   {
   table.find('tr').each(
    function()
     {
	if(jQuery(this).hasClass('reporting_controls'))
		return;	
     jQuery(this).children('td:eq('+index+')').show();
	 jQuery(this).children('th:eq('+index+')').show();

     }
    );
   }
}

function nf_build_report_table(form_id, additional_params, refresh_data){
	
	
	
	/*var show_fields = [];
	jQuery('select[name="showhide_fields[]"] option').each(
			function()
				{
				if(jQuery(this).attr('selected')=='selected')
					show_fields.push(jQuery(this).attr('value'));
				}
			); 
	if(refresh_data)
		show_fields = '';
		*/
	jQuery('.report_table_container').removeClass('hidden');
	jQuery('.report_table_container').find('.database-table-loader').removeClass('hidden');
	//jQuery('.report_table_container').find('.dashboard-box-content').addClass('faded');	
	jQuery('.report_table_container').find('.saved_records_container').addClass('faded');					
	var data =
		{
		action	 						: 'submission_report',
		form_Id							: form_id,
		additional_params				: additional_params,
		table							: 'wap_nex_forms_temp_report',
		field_selection					: (jQuery('select[name="showhide_fields[]"]').val()!='') ? jQuery('select[name="showhide_fields[]"]').val() : '*',
		};	
	
	jQuery.post
		(
		ajaxurl, data, function(response)
			{		
			jQuery('.right-col').addClass('loading_report');
			jQuery('.right-col').html(response);
			
			nf_get_records(0,jQuery('.submission_reporting').find('.paging_wrapper'));
			jQuery('.report_table_container .table_title .btn-floating').trigger('click');
			
			//jQuery('.right-col-top').resizable({
			//});
			
			}
		);	
}


function strstr(haystack, needle, bool) {
    var pos = 0;

    haystack += "";
    pos = haystack.indexOf(needle); if (pos == -1) {
       return false;
    } else {
       return true;
    }
}
       
/* GLOBAL SETTINGS */

'use strict';

jQuery(document).ready(
function()
	{
		
		jQuery(document).on('click','.alert .close',
			function()
				{
				jQuery(this).parent().slideUp('slow')
				}
			);
			
		jQuery(document).on('click','input[name="email_method"]',
			function()
				{
				if(jQuery(this).val()=='smtp')
					jQuery('.smtp_settings').show();
				else
					jQuery('.smtp_settings,.smtp_auth_settings').hide();
				}
			);
		
		jQuery(document).on('click','input[name="smtp_auth"]',
			function()
				{
				if(jQuery(this).val()=='1')
					jQuery('.smtp_auth_settings').show();
				else
					jQuery('.smtp_auth_settings').hide();
				}
			);

		jQuery('#mail_chimp_setup').ajaxForm({
			data: {
			   action: 'save_mc_key'
			},
			beforeSubmit: function(formData, jqForm, options) {
				jQuery('#mail_chimp_setup  button').html('&nbsp;&nbsp;&nbsp;<span class="fa fa-spin fa-spinner"></span>&nbsp;Saving...&nbsp;&nbsp;&nbsp;')
			},
		   success : function(responseText, statusText, xhr, $form) {
			   jQuery('#mail_chimp_setup button').html('&nbsp;&nbsp;&nbsp;Save MailChimp API&nbsp;&nbsp;&nbsp;');
			   Materialize.toast('MailChimp API Saved', 2000, 'toast-success');
			   
			   var data =
					{
					action	 						: 'reload_mc_list',
					reload_mc_list					: 'true',
					};
				jQuery('.mail_chimp_setup').html('<div class="loading">Loading <i class="fa fa-circle-o-notch fa-spin"></i></div>')		
				jQuery.post
					(
					ajaxurl, data, function(response)
						{
						jQuery('.mail_chimp_setup').html(response);
						}
					);
			   
			   
			},
			 error: function(jqXHR, textStatus, errorThrown)
				{
				   console.log(errorThrown)
				}
		});
		
		
		jQuery('#get_response_setup').ajaxForm({
			data: {
			   action: 'save_gr_key'
			},
			beforeSubmit: function(formData, jqForm, options) {
				jQuery('#get_response_setup  button').html('&nbsp;&nbsp;&nbsp;<span class="fa fa-spin fa-spinner"></span>&nbsp;Saving...&nbsp;&nbsp;&nbsp;')
			},
		   success : function(responseText, statusText, xhr, $form) {
			   jQuery('#get_response_setup  button').html('&nbsp;&nbsp;&nbsp;Save GetResponse API&nbsp;&nbsp;&nbsp;');
			   Materialize.toast('GetResponse API Saved', 2000, 'toast-success');
			   
			   var data =
					{
					action	 						: 'reload_gr_list',
					reload_gr_list					: 'true',
					};
				jQuery('.get_response_setup').html('<div class="loading">Loading <i class="fa fa-circle-o-notch fa-spin"></i></div>')		
				jQuery.post
					(
					ajaxurl, data, function(response)
						{
						jQuery('.get_response_setup').html(response);
						}
					);
			   
			   
			},
			 error: function(jqXHR, textStatus, errorThrown)
				{
				   console.log(errorThrown)
				}
		});
		
		
		jQuery('#email_config').ajaxForm({
			data: {
			   action: 'save_email_config'
			},
			beforeSubmit: function(formData, jqForm, options) {
				jQuery('#email_config  button').html('&nbsp;&nbsp;&nbsp;<span class="fa fa-spin fa-spinner"></span>&nbsp;Saving...&nbsp;&nbsp;&nbsp;')
			},
		   success : function(responseText, statusText, xhr, $form) {
			   jQuery('#email_config  button').html('&nbsp;&nbsp;&nbsp;Save Email Setup&nbsp;&nbsp;&nbsp;');
			   Materialize.toast('Email Setup Saved', 2000, 'toast-success');
			   
			},
			 error: function(jqXHR, textStatus, errorThrown)
				{
				   console.log(errorThrown)
				}
		});
		
		
		jQuery('#script_config').ajaxForm({
			data: {
			   action: 'save_script_config'
			},
			beforeSubmit: function(formData, jqForm, options) {
				jQuery('#script_config button').html('&nbsp;&nbsp;&nbsp;<span class="fa fa-spin fa-spinner"></span>&nbsp;Saving...&nbsp;&nbsp;&nbsp;')
			},
		   success : function(responseText, statusText, xhr, $form) {
			   jQuery('#script_config  button').html('&nbsp;&nbsp;&nbsp;Save JS Inclusions&nbsp;&nbsp;&nbsp;');
			   Materialize.toast('JS Includes Saved', 2000, 'toast-success');
			   
			},
			 error: function(jqXHR, textStatus, errorThrown)
				{
				   console.log(errorThrown)
				}
		});
		
		jQuery('#script_config2').ajaxForm({
			data: {
			   action: 'save_script_config2'
			},
			beforeSubmit: function(formData, jqForm, options) {
				jQuery('#script_config button').html('&nbsp;&nbsp;&nbsp;<span class="fa fa-spin fa-spinner"></span>&nbsp;Saving...&nbsp;&nbsp;&nbsp;')
			},
		   success : function(responseText, statusText, xhr, $form) {
			    jQuery('#script_config  button').html('&nbsp;&nbsp;&nbsp;Save JS Inclusions&nbsp;&nbsp;&nbsp;');
			   Materialize.toast('JS Includes Saved', 2000, 'toast-success');
			   
			},
			 error: function(jqXHR, textStatus, errorThrown)
				{
				   console.log(errorThrown)
				}
		});
		
		
		jQuery('#import_form_html').ajaxForm({
			data: {
			   action: 'import_form_html'
			},
			beforeSubmit: function(formData, jqForm, options) {
			},
		   success : function(responseText, statusText, xhr, $form) {
			   
			},
			 error: function(jqXHR, textStatus, errorThrown)
				{
				   console.log(errorThrown)
				}
		});
		
		
		
		jQuery('#style_config').ajaxForm({
			data: {
			   action: 'save_style_config'
			},
			beforeSubmit: function(formData, jqForm, options) {
				jQuery('#style_config button').html('&nbsp;&nbsp;&nbsp;<span class="fa fa-spin fa-spinner"></span>&nbsp;Saving...&nbsp;&nbsp;&nbsp;')
			},
		   success : function(responseText, statusText, xhr, $form) {
			   jQuery('#style_config button').html('&nbsp;&nbsp;&nbsp;Save CSS Inclusions&nbsp;&nbsp;&nbsp;');
			    Materialize.toast('CSS Includes Saved', 2000, 'toast-success');
			   
			},
			 error: function(jqXHR, textStatus, errorThrown)
				{
				   console.log(errorThrown)
				}
		});
		
		
		
		jQuery('#other_config').ajaxForm({
			data: {
			   action: 'save_other_config'
			},
			beforeSubmit: function(formData, jqForm, options) {
				jQuery('#other_config  button').html('&nbsp;&nbsp;&nbsp;<span class="fa fa-spin fa-spinner"></span>&nbsp;Saving...&nbsp;&nbsp;&nbsp;')
			},
		   success : function(responseText, statusText, xhr, $form) {
			  jQuery('#other_config  button').html('&nbsp;&nbsp;&nbsp;Save WP Admin Options&nbsp;&nbsp;&nbsp;');
			  Materialize.toast('Admin option Saved', 2000, 'toast-success');
			   
			},
			 error: function(jqXHR, textStatus, errorThrown)
				{
				   console.log(errorThrown)
				}
		});
		
		jQuery(document).on('click','.send_test_email',
		function()
			{
			var get_btn_text = jQuery('.send_test_email').html();
			jQuery('.send_test_email').html('<span class="fa fa-spinner fa-spin"></span>&nbsp;Sending...');
			var data =
				{
				action			: 'nf_send_test_email',
				email_address  	: jQuery('input[name="test_email_address"]').val()
				};
		jQuery.post
			(
			ajaxurl, data, function(response)
				{
					jQuery('.send_test_email').html('Email Sent')
					Materialize.toast('Email Sent', 2000, 'toast-success');
					setTimeout( function(){ jQuery('.send_test_email').html(get_btn_text); },2000 )
				}
			);
			}
		);
		
	}
); 


/* PREFERENCES */
'use strict'; 

jQuery(document).ready(
function()
	{
		jQuery(document).on('click','#preferences .alert .close',
			function()
				{
				jQuery(this).parent().slideUp('slow')
				}
			);
		
		jQuery('#field-pref').ajaxForm({
			data: {
			   action: 'save_field_pref'
			},
			beforeSubmit: function(formData, jqForm, options) {
				jQuery('#field-pref button').html('&nbsp;&nbsp;&nbsp;<span class="fa fa-spin fa-spinner"></span>&nbsp;Saving...&nbsp;&nbsp;&nbsp;')
			},
		   success : function(responseText, statusText, xhr, $form) {
			   jQuery('#field-pref button').html('&nbsp;&nbsp;&nbsp;Save Field Preferences&nbsp;&nbsp;&nbsp;');
			    Materialize.toast('Field Preferences Saved', 2000, 'toast-success');
			},
			 error: function(jqXHR, textStatus, errorThrown)
				{
				console.log(errorThrown)
				}
		});
		
		jQuery('#validation-pref').ajaxForm({
			data: {
			   action: 'save_validation_pref'
			},
			beforeSubmit: function(formData, jqForm, options) {
				jQuery('#validation-pref button').html('&nbsp;&nbsp;&nbsp;<span class="fa fa-spin fa-spinner"></span>&nbsp;Saving...&nbsp;&nbsp;&nbsp;')
			},
		   success : function(responseText, statusText, xhr, $form) {
			   jQuery('#validation-pref button').html('&nbsp;&nbsp;&nbsp;Save Validation Preferences&nbsp;&nbsp;&nbsp;');
			  Materialize.toast('Validation Preferences Saved', 2000, 'toast-success');
			   
			},
			 error: function(jqXHR, textStatus, errorThrown)
				{
				console.log(errorThrown)
				}
		});
		
		jQuery('#emails-pref').ajaxForm({
			data: {
			   action: 'save_email_pref'
			},
			beforeSubmit: function(formData, jqForm, options) {
				jQuery('#emails-pref button').html('&nbsp;&nbsp;&nbsp;<span class="fa fa-spin fa-spinner"></span>&nbsp;Saving...&nbsp;&nbsp;&nbsp;')
			},
		   success : function(responseText, statusText, xhr, $form) {
			   jQuery('#emails-pref button').html('&nbsp;&nbsp;&nbsp;Save Email Preferences&nbsp;&nbsp;&nbsp;');
			  Materialize.toast('Email Preferences Saved', 2000, 'toast-success');
			   
			},
			 error: function(jqXHR, textStatus, errorThrown)
				{
				console.log(errorThrown)
				}
		});
		
		jQuery('#other-pref').ajaxForm({
			data: {
			   action: 'save_other_pref'
			},
			beforeSubmit: function(formData, jqForm, options) {
				jQuery('#other-pref button').html('&nbsp;&nbsp;&nbsp;<span class="fa fa-spin fa-spinner"></span>&nbsp;Saving...&nbsp;&nbsp;&nbsp;')
			},
		   success : function(responseText, statusText, xhr, $form) {
			   jQuery('#other-pref button').html('&nbsp;&nbsp;&nbsp;Save Other Preferences&nbsp;&nbsp;&nbsp;');
			   Materialize.toast('Other Preferences Saved', 2000, 'toast-success');
			   
			},
			 error: function(jqXHR, textStatus, errorThrown)
				{
				console.log(errorThrown)
				}
		});
		
		
		
	}
);



jQuery(document).ready(
function()
	{
	var special_run = new Tour({
		  name: "2023-special-10-11",
		  onStart: function(){ },
		  onEnd: function(){ special_run2.end(); },
		  steps: [
		  {
			orphan: true,
			title: "<strong>SALE NOW ON!!!</strong>",
			content: "<div class='new_tut'>We are celebrating<br><strong><h5>15 000+ Sales!</h5></strong>Buy NEX-Forms Today &amp; get <h5>ALL ADD-ONS FREE!!!</h5><br><span class='do_highlight2'>SAVE $270+!!!</span></div></div>",
			//content: "<div class='new_tut'>NEX-Forms is now selling at<br><span class='do_highlight'>LESS 30%</span><br><strong>+</strong></br><span class='do_highlight'>All Add-ons are FREE!</span></br></br><span class='do_highlight2'>SAVE $300!</span></div>",
			template: "<div class='popover tour tutorial-step-1'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><br><div class='popover-navigation'><a href='https://1.envato.market/6vWmb' target='_blank' class='start-button' style='display:block;'><span class='start-border'>BUY NOW</span><span class='start-border-2 pulsate_1'></a></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button><span class='tip'><strong style='font-weight:bold'>FREE Add-ons Include:<br></strong>Zapier Integration &bull; PayPal PRO &bull; PDF Creator &bull; Digital Signatures &bull; Form Themes &bull; Form to Post/Page &bull; Conditional Content Blocks &bull; Shorcode Processor &bull; PayPal Classic &bull; Super Select Form Fields &bull; MailChimp &bull; MailPoet &bull; Mailster &bull; GetResponse<br><br></span><span class='tip'><strong>IMPORTANT NOTE:</strong> When upgrading to PRO all forms, data, settings, etc will remain unchanged. NO WORK LOSS when you <a href='https://1.envato.market/6vWmb' target='_blank'>upgrade NEX-Forms</a>!</span><em><br>Offer valid for a limited time only!</em></div>",
			//template: "<div class='popover tour tutorial-step-1 animated fadeInUp'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><br><div class='popover-navigation'><a href='http://codecanyon.net/item/nexforms-the-ultimate-wordpress-form-builder/7103891?license=regular&open_purchase_for_item_id=7103891&purchasable=source&ref=Basix' target='_blank' class='start-button' style='display:block;'><span class='start-border'>BUY NOW</span><span class='start-border-2 pulsate_1'></a></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button><em>Offer valid for a limited time only!</em></div>",
			placement: 'top',
			backdrop: true,
			backdropContainer: 'body',
		  },
		  ]
		}
	);
	
	
	var special_run2 = new Tour({
		  name: "2021-special-14",
		  onStart: function(){ },
		  onEnd: function(){ special_run.end(); },
		  steps: [
		  {
			orphan: true,
			title: "<strong>SPECIAL OFFER!</strong>",
			//content: "<div class='new_tut'>We are celebrating<br><strong><h5>10 000 Sales!</h5></strong>Buy NEX-Forms NOW and get <h5>ALL ADD-ONS FREE!!!</h5> <strong>SAVE $210!</strong></div></div>",
			content: "<div class='new_tut'>This is to inform you that<br><strong>NEX-Forms is now selling at<strong><br><span class='do_highlight'>LESS 30%</span><br><strong>+</strong></br><span class='do_highlight'>All Add-ons are FREE!</span></div>",
			template: "<div class='popover tour tutorial-step-1'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><br><div class='popover-navigation'><a href='http://codecanyon.net/item/nexforms-the-ultimate-wordpress-form-builder/7103891?license=regular&open_purchase_for_item_id=7103891&purchasable=source&ref=Basix' target='_blank' class='start-button' style='display:block;'><span class='start-border'>BUY</span><span class='start-border-2 pulsate_1'></a></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button><span class='tip'>Need another license or renew support? NOW is the time!<br> <br><strong>TIP:</strong> Instead of renewing support it\'s better to buy another license. This way you will have:<br>+ Another license at your disposal<br>+ All the add-ons<br>+ New support </span><span class='tip'><strong style='font-weight:bold'>FREE Add-ons Include:<br></strong>PayPal PRO &bull; PDF Creator &bull; Digital Signatures &bull; Form Themes &bull; Form to Post/Page &bull; Conditional Content Blocks &bull; Shorcode Processor &bull; PayPal Classic &bull; Super Select Form Fields &bull; MailChimp &bull; MailPoet &bull; Mailster &bull; GetResponse<br><br><em>Offer valid for a limited time only!</em></span></div>",
			//template: "<div class='popover tour tutorial-step-1 animated fadeInUp'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><br><div class='popover-navigation'><a href='http://codecanyon.net/item/nexforms-the-ultimate-wordpress-form-builder/7103891?license=regular&open_purchase_for_item_id=7103891&purchasable=source&ref=Basix' target='_blank' class='start-button' style='display:block;'><span class='start-border'>BUY NOW</span><span class='start-border-2 pulsate_1'></a></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button><em>Offer valid for a limited time only!</em></div>",
			placement: 'bottom',
			backdrop: true,
			backdropContainer: 'body',
		  },
		  ]
		}
	);
	
	var free_add_ons = new Tour({
		  name: "claim-free-add-ons-02",
		  onStart: function(){ },
		  onEnd: function(){ },
		  steps: [
		  {
			orphan: true,
			title: "<strong>CLAIM FREE ADD-ONS</strong>",
			content: "<div class='new_tut'>You are eligable to get all these add-ons for free! Please go to <a href=\"http://basixonline.net/nex-forms-wordpress-form-builder-demo/nex-forms-free-add-ons-download/\" target=\"_blank\">https://basixonline.net/nex-forms-wordpress-form-builder-demo/nex-forms-free-add-ons-download/</a> with your NEX-Forms Purchase Code to claim your add-ons.</div>",
			template: "<div class='popover tour tutorial-step-1'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><br><div class='popover-navigation'><a href='https://basixonline.net/nex-forms-wordpress-form-builder-demo/nex-forms-free-add-ons-download/' target='_blank' class='start-button' style='display:block;'><span class='start-border'>CLAIM</span><span class='start-border-2 pulsate_1'></a></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			placement: 'bottom',
			backdrop: true,
			backdropContainer: 'body',
		  },
		  ]
		}
	);
	special_run.init();
	special_run.start();

	// Start the tour
	if(jQuery('.set_free_add_ons').text()=='true')
		{
		//free_add_ons.init();
		//free_add_ons.start();
		}
			
	if(jQuery('#currently_viewing').text()=="backend")
		{
		//special_run.init();
		special_run.restart();	
		}
	else
		{
		//special_run2.init();
		//special_run2.start();	
		}
		
	
	
	
	
	
	jQuery(document).on('click','.add_ons_tab',
			function()
				{
				
				if(jQuery('.set_free_add_ons').text()=='true')
					{
					free_add_ons.init();
					free_add_ons.start();
					}
				}
			);

	
	jQuery('[data-toggle="tooltip_bs"]').tooltip_bs(
			{
			delay: 0,
			html:true
			}
		);				
		
});