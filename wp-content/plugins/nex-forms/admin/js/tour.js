'use strict';

jQuery(document).ready(
function()
	{
		
	
		
function end_nf_tours(){
	/* TOURS */
	main_tour.end();
	email_setup_tour.end();
	user_email_setup_tour.end();
	paypal_setup_tour.end();
	pdf_setup_tour.end();
	ftp_setup_tour.end();
	mc_setup_tour.end();
	gr_setup_tour.end();
	form_submit_setup_tour.end();
	hidden_fields_setup_tour.end();
	other_options_setup_tour.end();
	
	/* TUTORIALS */
	tutorial_1.end();
	tutorial_2.end();
	tutorial_3.end();
	tutorial_4.end();
	first_run.end();
	whats_new.end();
	kbsc.end();
}
/* FIRST RUN */


var first_run = new Tour({
		  name: "first-run-01",
		  onStart: function(){ },
		  onEnd: function(){ },
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		  steps: [
		  {
			
			element: "#nex-forms",
			title: "<strong>Welcome to NEX-Forms</strong>",
			content: "We recomend that you first take a Main Tour and then proceed with some Quick Tutorials <a href='#' class='start-button start-tutorial tour-main' data-role='' style='display:block;'><span class='start-border'>Start Tour</span><span class='start-border-2 pulsate_1'></span></a><div class='more_tuts'><h5>Tutorials</h5><a href='#' class='tut-1'>Building a Simple Contact Form</a><a href='#' class='tut-2'>Using Conditional Logic</a><a href='#' class='tut-3'>Using Math Logic</a><a href='#' class='tut-4'>Creating a Multi-Step Form</a></div>",
			template: "<div class='popover tour first-run tutorial-step-1 animated bounceInDown'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			placement: 'bottom',
		  },
		  ]
		}
	);
//first_run.init();
// Start the tour
//first_run.start();

var ks1 = '';
var ks2 = '';
var ks3 = '';
var ks4 = '';
	ks1 += '<div class="">';
	
	
		ks1 += '<div class="ks-code">';
			ks1 += 'CTRL+S';
		ks1 += '</div>';
		ks1 += '<div class="ks-des">';
			ks1 += 'Save.';
		ks1 += '</div>';
		
		ks1 += '<div class="ks-code">';
			ks1 += 'CTRL+Z';
		ks1 += '</div>';
		ks1 += '<div class="ks-des">';
			ks1 += 'Undo last action.';
		ks1 += '</div>';
		
		ks1 += '<div class="ks-code">';
			ks1 += 'CTRL+SHIFT+Z';
		ks1 += '</div>';
		ks1 += '<div class="ks-des">';
			ks1 += 'Redo last undo.';
		ks1 += '</div>';
		
		ks1 += '<div class="ks-code">';
			ks1 += 'CTRL+A';
		ks1 += '</div>';
		ks1 += '<div class="ks-des">';
			ks1 += 'Select all fields in the form.';
		ks1 += '</div>';
		
		ks1 += '<div class="ks-code">';
			ks1 += 'CTRL+SHIFT+A';
		ks1 += '</div>';
		ks1 += '<div class="ks-des">';
			ks1 += 'Deselect all fields in the form.';
		ks1 += '</div>';
		ks1 += '<div class="ks-code">';
			ks1 += 'Esc';
		ks1 += '</div>';
		ks1 += '<div class="ks-des">';
			ks1 += 'Deselect all fields in the form and close all open editing panels and preview.';
		ks1 += '</div>';
	ks1 += '</div>';	
	
	ks2 += '</div>';	
		ks2 += '<div class="ks-head">';
			ks2 += 'Batch/Group Field selections';
		ks2 += '</div>';
		
		
		ks2 += '<div class="ks-code">';
			ks2 += 'Enter';
		ks2 += '</div>';
		ks2 += '<div class="ks-des">';
			ks2 += 'Edit Field Selection.';
		ks2 += '</div>';
		
		ks2 += '<div class="ks-code">';
			ks2 += 'CTRL+C';
		ks2 += '</div>';
		ks2 += '<div class="ks-des">';
			ks2 += 'Copy Field Selection.';
		ks2 += '</div>';
		
		ks2 += '<div class="ks-code">';
			ks2 += 'CTRL+X';
		ks2 += '</div>';
		ks2 += '<div class="ks-des">';
			ks2 += 'Cut Field Selection.';
		ks2 += '</div>';
		
		
		ks2 += '<div class="ks-code">';
			ks2 += 'CTRL+V';
		ks2 += '</div>';
		ks2 += '<div class="ks-des">';
			ks2 += 'Paste copied/cut fields below the current hovered field. Hovering inside a step or grid column will append the field to the grid or step. No hover will append the fields to the outer form container.';
		ks2 += '</div>';
		
		ks2 += '<div class="ks-code">';
			ks2 += 'CTRL+SHIFT+V';
		ks2 += '</div>';
		ks2 += '<div class="ks-des">';
			ks2 += 'Paste Copied/cut fields above the current hovered field. Hovering inside a step or grid column will prepend the field to the grid or step. No hover will prepend the fields to the outer form container. ';
		ks2 += '</div>';
		
		
		ks2 += '<div class="ks-code">';
			ks2 += 'Delete';
		ks2 += '</div>';
		ks2 += '<div class="ks-des">';
			ks2 += 'Delete the field selection.';
		ks2 += '</div>';
		
		
		ks2 += '<div class="ks-code">';
			ks2 += 'Backspace';
		ks2 += '</div>';
		ks2 += '<div class="ks-des">';
			ks2 += 'Delete the field selection.';
		ks2 += '</div>';
		
	ks2 += '</div>';	
	
	
	
	ks3 += '<div>';	
		ks3 += '<div class="ks-head">';
			ks3 += 'Keyboard &amp; mouse CLICK on fields';
		ks3 += '</div>';
		
		ks3 += '<div class="ks-code">';
			ks3 += 'CTRL + LEFT CLICK';
		ks3 += '</div>';
		ks3 += '<div class="ks-des">';
			ks3 += 'Adds a field to a batch selection. If already selected will remove the field from the selection.';
		ks3 += '</div>';
		
		ks3 += '<div class="ks-code">';
			ks3 += 'CTRL+SHIFT + LEFT CLICK';
		ks3 += '</div>';
		ks3 += '<div class="ks-des">';
			ks3 += 'Selects all fields of the same type. For example use this to select all TEXT fields or all HEADINGS, etc. You can then target-edit the FIELD GROUP. ';
		ks3 += '</div>';
		
		ks3 += '<div class="ks-code">';
			ks3 += 'RIGHT CLICK';
		ks3 += '</div>';
		ks3 += '<div class="ks-des">';
			ks3 += 'Right Click on anything in the form container area. The Right click menu includes quick editing options and available actions to take on Single Field, Batch Selections or Field Group selections.';
		ks3 += '</div>';
		
	ks3 += '</div>';

var kbsc = new Tour({
		  name: "kbsc",
		  template: "<div class='popover tour'><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		 steps: [
		  {
			orphan: true,
			title: "Keyboard Shortcuts",
			content: ks1,
		  },
		  {
			orphan: true,
			title: "Keyboard Shortcuts",
			content: ks2,
		  },
		  {
			orphan: true,
			title: "Keyboard Shortcuts",
			content: ks3,
			template: "<div class='popover tour'><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>Finish <span class='fa fa-thumbs-up'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			
		  },
		 /* {
			element: ".nex-forms-container",
			title: "Keyboard Shortcuts",
			content: ks3,
			placement: 'top'
		  },*/
		 /* {
			orphan: true,
			title: "Thats it",
			content: "For more information on email setup and data tags see: <a href='http://basixonline.net/nex-forms-documentation/nex-forms-email-setup/#1' target='_blank'>Docs - Email Notifications</a><br><br><a href='#' class=\"btn btn-default tour-email-setup-user\">Also see: User Email Setup Tour <span class=\"fa fa-arrow-right\"></span></a>",
		  },*/
		  
		]});
jQuery(document).on('click','.kbsc-tut',
		function()
			{
			end_nf_tours();
			kbsc.init();
			kbsc.restart();
			kbsc.goTo(0) 
			}
		);
var whats_new = new Tour({
		  name: "whats-new-04",
		  template: "<div class='popover tour whats-new'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		  {
			element: "#toplevel_page_nex-forms-dashboard",
			title: "What's New?",
			content: "Have a quick look to see what's new and what have changed.",
		  	template: "<div class='popover tour whats-new'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-next' data-role='next'>Check it out <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		  	placement: 'right'
		  },
		  /*{
			element: "a.canvas_view",
			title: "Folded top navigation",
			content: "The main navigation is now folded for less clutter and to a give a better sense of where you currently are in your form design process.",
			placement: 'bottom',
		  },*/
		  {
			element: ".history-tools .do_undo",
			title: "Undo (NEW)",
			content: "You can now undo your LAST action by clicking here or hitting <strong>CTRL+Z</strong>",
			placement: 'bottom'
		  },
		   {
			element: ".history-tools .do_redo",
			title: "Redo (NEW)",
			content: "You can redo your LAST UNDO by clicking here or hitting <strong>CTRL+SHIFT+Z</strong>",
			placement: 'bottom'
		  },
		  {
			element: "li.kbsc-tut",
			title: "Keyboard Shortcuts",
			content: "Find all available keyboard shortcuts here.",
			placement: 'left',
		  },
		  {
			element: ".tool-spacer .form_field.math_logic_slider",
			title: "Math Logic Slider (NEW)",
			content: "Display a range slider for your math calculations.",
			placement: 'bottom',
		  },
		  {
			element: ".multi-step-settings-btn",
			title: "Multi-step Settings (NEW &amp; Moved)",
			content: "You can now find all multistep related settings here. <br><br><strong>NEW</strong> Breadcrumbs/Progress-bar settings are now available!<br><br><strong>NEW</strong> Multistep Timer with tons of settings are now available!<br><br><strong>NEW</strong> Multistep overall settings available!",
			placement: 'right',
		  },	
		   {
			element: ".expand_fullscreen",
			title: "Fullscreen Toggle (Moved)",
			content: "You can now find the Fullscreen toggle here.",
			placement: 'right',
		  },
		   {
			element: ".workspace.success-msg",
			title: "Success Message (Moved &amp; Improved)",
			content: "You can now build your success messsage like you build your form. You now have complete control. NOTE: Includes new Submission Loaders and settings!",
			placement: 'bottom',
		  },
		  {
			element: ".workspace.c-logic",
			title: "Conditional Logic (Moved)",
			content: "Conditional logic view can now be opened from here.",
			placement: 'bottom',
		  },
		  {
			element: ".settings_more_styling_options .fa-palette",
			title: "Overall Styling (move)",
			content: "Overall Styling options can now be opened from here.",
			placement: 'bottom',
		  },
		   {
			element: ".nex-forms-container",
			title: "DragBox Selection (NEW)",
			content: "You can now drag/draw a box over field(s) to multi-select them to <strong>batch</strong> - drag and drop, copy, cut, delete, edit and style!<br><br>Hold CTRL while drawing to add or remove field(s) from the batch selection.",
			placement: 'left',
		  },
		   {
			element: ".nex-forms-container",
			title: "Multi-Field Selection (NEW)",
			content: "You can now hold CTRL to select multiple fields to edit, etc. Click again to remove a field from the selection. RIGHT CLICK on any selected field for batch editing options.",
			placement: 'top',
		  },
		  {
			element: ".nex-forms-container",
			title: "Field Group Selection (NEW)",
			content: "You can now hold CTRL+SHIFT to select all fields of the same type. For example, hold CTRL+SHIFT + LEFT CLICK on a Radio Button field. This will select all Radio Button fields in the form for editing.",
			placement: 'right',
		  },
		   {
			element: ".nex-forms-container",
			title: "Context Menu - right mouse button (NEW)",
			content: "RIGHT CLICK on any field and see available actions and quick edit options.",
			placement: 'top',
		  },
		  
		  {
			orphan: true,
			title: "That's it for the tour!",
			content: "Now you can use the form canvas area like you would your desktop. You will notice tons of improvements throughout the builder and a few hidden surprises!<br><br>Also See: <br><br><a href='#' class='kbsc-tut'>New Keyboard Shortcuts</a><br><a href='#' class='tour-main'>Main Tour</a></div>",
			template: "<div class='popover tour whats-new'><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-next' data-role='next'> <span class='fa fa-check'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			placement: 'bottom',
		  },
		 /* {
			orphan: true,
			title: "Thats it",
			content: "For more information on email setup and data tags see: <a href='http://basixonline.net/nex-forms-documentation/nex-forms-email-setup/#1' target='_blank'>Docs - Email Notifications</a><br><br><a href='#' class=\"btn btn-default tour-email-setup-user\">Also see: User Email Setup Tour <span class=\"fa fa-arrow-right\"></span></a>",
		  },*/
		  
		]});
whats_new.init();
whats_new.start();
jQuery(document).on('click','.tour-whats-new',
		function()
			{
			end_nf_tours();
			jQuery('a.canvas_view').trigger('click');
			whats_new.init();
			whats_new.restart();
			whats_new.goTo(0) 
			}
		);
/* BUY NOW DEMO */
var demo_popup = new Tour({
		  name: "demo-popup",
		  onStart: function (tour) {jQuery('#nex-forms').addClass('demo-popup');
		  				//jQuery('.upgrade_pro').fadeOut('slow');
		  			},
 		  onEnd: function (tour)
		  			{
						jQuery('#nex-forms').removeClass('demo-popup'); 
						setTimeout(
							function(){run_demo_popup()},60000);
						
						//jQuery('.upgrade_pro').show();
						
					},
		  steps: [
				  {
					element: ".builder-footer",
					title: "SPECIAL OFFER!!!",
					content: "Buy NEX-Forms today and get all 13 add-ons worth $210 for FREE!<strong></strong>!<a href='http://codecanyon.net/item/nexforms-the-ultimate-wordpress-form-builder/7103891?license=regular&open_purchase_for_item_id=7103891&purchasable=source&ref=Basix' target='_blank' class='start-button'><span class='start-border'>Buy Now</span><span class='start-border-2 pulsate_1'></a>",

					//content: "NEX-Forms is currently on sale for 30% LESS - Was $39 now only $27! Dont miss out, offer Ends 1 July!<strong></strong>!<a href='http://codecanyon.net/item/nexforms-the-ultimate-wordpress-form-builder/7103891?license=regular&open_purchase_for_item_id=7103891&purchasable=source&ref=Basix' target='_blank' class='start-button'><span class='start-border'>Buy Now</span><span class='start-border-2 pulsate_1'></a>",
					//content: "<strong>Buy once</strong> and recieve <strong>lifetime FREE</strong> automatic <strong>updates</strong>!<a href='http://codecanyon.net/item/nexforms-the-ultimate-wordpress-form-builder/7103891?license=regular&open_purchase_for_item_id=7103891&purchasable=source&ref=Basix' target='_blank' class='start-button'><span class='start-border'>Buy Now</span><span class='start-border-2 pulsate_1'></a>",
					template: "<div class='popover tour tour-demo-popup animated fadeInUp'><h3 class='popover-title'></h3><div class='popover-content'></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
					placement: 'bottom',
				  },
				]
			}
		);


		
	if(jQuery('#demo_site').text()=='yes')
		{
		run_demo_popup();
		}
		

	function run_demo_popup(){
		setTimeout(
			function(){
				demo_popup.restart();
			}, 30000);
	}

/* TOURS */
	
/* SETUP EMAILS */
	var email_setup_tour = new Tour({
		  name: "email_setup_tour",
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		  {
			element: ".show-admin-email-setup",
			title: "Admin E-Mails",
			content: "Setup your admin email notifications here",
			placement: 'right'
		  },
		  {
			element: ".tut_admin_email_1",
			title: "From Address",
			content: "This is the address where the email is sent from. If you setup confirmation emails then this is the address the user who completed the form will reply to.",
			placement: 'bottom'
		  },
		  {
			element: ".tut_admin_email_2",
			title: "From Name",
			content: "This is the name of the sender (you) and will be displayed in the recipients inbox. Example your company name.",
			placement: 'bottom'
		  },
		  {
			element: ".tut_admin_email_3",
			title: "Recipients",
			content: "Add a comma seperated list of email addresses to whom this admin email will be sent to. <br><br> Example: email1@domain.com, email2@domain.com, email3@domain.com",
			placement: 'bottom'
		  },
		  
		  {
			element: ".tut_admin_email_4",
			title: "BCC",
			content: "Blind Carbon Copy. Same as recipients list but each recipient does not see who else recieved the email.",
			placement: 'bottom'
		  },
		  {
			element: ".tut_admin_email_5",
			title: "Subject",
			content: "This is the subject of the email and will be dislayed in the users inbox.",
			placement: 'bottom'
		  },
		  {
			element: ".tut_admin_email_6",
			title: "Email Attachments",
			content: "If your form includes file uploader fields then you can choose whether to attach these files that the user submits via the form.",
			placement: 'bottom'
		  },
		  {
			element: "#admin_email .mce-edit-area",
			title: "Email Body",
			content: "This is where you construct your admin email body, the actual content of the email that will be sent to the recipients specified above. <br><br>Note: This Editor works the same as the Classic WordPress TinyMCE Page/Post Editor",
			placement: 'top'
		  },
		  
		  {
			element: "#admin_email .mce-flight_shortcodes",
			title: "Form Data Tags",
			content: "Add form Data tags from this button into your email body or any of the above fields, like in the \"Subject\". Data tags are placeholders for the data that is submitted from a field in the form.",
			placement: 'top'
		  },
		  {
			orphan: true,
			title: "End of Tour",
			content: "For more information on email setup and data tags see: <a href='http://basixonline.net/nex-forms-documentation/nex-forms-email-setup/#1' target='_blank'>Docs - Email Notifications</a><br><br><a href='#' class=\"btn btn-default tour-email-setup-user\">Also see: User Email Setup Tour <span class=\"fa fa-arrow-right\"></span></a>",
		  },
		  
		]});
	jQuery(document).on('click','.tour-email-setup',
		function()
			{
			end_nf_tours();
			jQuery('a.email_setup').trigger('click');
			setTimeout(function(){ jQuery('.form_attr_left_menu a.show-admin-email-setup').trigger('click'); },300);
			email_setup_tour.init();
			email_setup_tour.restart();
			email_setup_tour.goTo(0) 
			}
		);
	var user_email_setup_tour = new Tour({
		  name: "user_email_setup_tour",
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		  {
			element: ".show-user-email-setup",
			title: "User E-Mails",
			content: "Setup your user confirmation emails from here.",
			placement: 'right'
		  },
		  {
			element: ".tut_user_email_1",
			title: "Map Recipient Field",
			content: "Map the field from the form that the user will use to enter their email address.<br><br> Note: You need to add an email field and VALIDATE that field to be and email address!",
			placement: 'bottom'
		  },
		  {
			element: ".tut_user_email_2",
			title: "BCC",
			content: "Blind Carbon Copy. Add a comma seperated list of email addresses to whom this user email will be sent other than the email field specified above.",
			placement: 'bottom'
		  },
		  {
			element: ".tut_user_email_3",
			title: "Subject",
			content: "This is the subject of the email and will be dislayed in the users inbox.",
			placement: 'bottom'
		  },
		  {
			element: "#user_email .mce-edit-area",
			title: "Email Body",
			content: "This is where you construct your user confirmation email body, the actual content of the email that will be sent to the user email field specified above. <br><br>Note: This Editor works the same as the Classic WordPress TinyMCE Page/Post Editor",
			placement: 'top'
		  },
		  
		  {
			element: "#user_email .mce-flight_shortcodes",
			title: "Form Data Tags",
			content: "Add form Data tags from this button into your email body or any of the above fields, like in the \"Subject\". Data tags are placeholders for the data that is submitted from a field in the form.",
			placement: 'top'
		  },
		  {
			orphan: true,
			title: "End of Tour",
			content: "For more information on email setup and data tags see: <a href='http://basixonline.net/nex-forms-documentation/nex-forms-email-setup/#2' target='_blank'>Docs - Email Notifications</a><br><br><a href='#' class=\"btn btn-default tour-email-setup\">Also see: Admin Email Setup Tour <span class=\"fa fa-arrow-right\"></span></a>",
		  },
		  
		]});
	jQuery(document).on('click','.tour-email-setup-user',
		function()
			{
			end_nf_tours();
			jQuery('a.email_setup').trigger('click');
			setTimeout(function(){ jQuery('.form_attr_left_menu a.show-user-email-setup').trigger('click'); },300);
			user_email_setup_tour.init();
			user_email_setup_tour.restart();
			user_email_setup_tour.goTo(0) 
			}
		);
/* INTEGRATION TOURS */	
/* SETUP PAYPAL */
	var paypal_setup_tour = new Tour({
		  name: "paypal-setup-tour",
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		 
		  {
			element: ".show_paypal_setup",
			title: "Paypal Setup",
			content: "Setup your paypal setup and checkout items here.",
			placement: 'right'
		  },
		   {
			element: ".paypal_not_installed .message",
			title: "Add-on Not Found!",
			content: "Buy this add-on from <strong>Envato CodeCanyon</strong> or download it from <strong>Envato Elements</strong><br><br>Click on the Buttons below.",
			placement: 'top',
		  	template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		  },
		  {
			element: ".tour_paypal_setup_1",
			title: "Go to Paypal",
			content: "For the form to redirect to PayPal Checkout select <strong>Yes</strong>.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_paypal_setup_2",
			title: "PayPal Environment",
			content: "Select to use a test (Sanbox) or Live Paypal account. Use the sandbox environtment to test your paypal checkout and if all goes to plan switch to live environment.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_paypal_setup_3",
			title: "Client ID",
			content: "Here you enter your PayPal Client ID, see <a href='https://basix.ticksy.com/article/13639/' target='_blank'>Help Article</a>",
			placement: 'bottom'
		  },
		  
		  {
			element: ".tour_paypal_setup_4",
			title: "Client Secret Key",
			content: "Here you enter your PayPal Client Secret key, see <a href='https://basix.ticksy.com/article/13639/' target='_blank'>Help Article</a>",
			placement: 'bottom'
		  },
		  {
			element: ".tour_paypal_setup_5",
			title: "Currency Selection",
			content: "Select the Currency you want to be payed in.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_paypal_setup_6",
			title: "Success Message",
			content: "If the transaction is successful then this is the message the user will come back to.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_paypal_setup_7",
			title: "Failure Message",
			content: "If the transaction is unsuccessful or canceled then this is the message the user will come back to.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_paypal_setup_8",
			title: "Email Alerts",
			content: "Choose when you want to recieve an email. On successful payments, failed payments, before payments takes place or all or any of the above.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_paypal_setup_9",
			title: "Add Paypal Item",
			content: "Click this button to add a new PayPal checkout Item.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_paypal_setup_10",
			title: "PayPal Items List",
			content: "All PayPal Checkout items will be displayed and edited here.",
			placement: 'top'
		  },
		  {
			orphan: true,
			title: "End of Tour",
			content: "For more information on paypal setup see: <a href='#' target='_blank'>Docs - PayPal Setup</a><br><br><a href='#' class=\"btn btn-default tour-pdf-setup\">Also see: PDF Setup <span class=\"fa fa-arrow-right\"></span></a>",
		  },
		  
		]});
	jQuery(document).on('click','.tour-paypal-setup',
		function()
			{
			end_nf_tours();
			jQuery('.top-menu-dropdown a.integration').trigger('click');
			setTimeout(function(){ jQuery('.form_attr_left_menu a.show_paypal_setup').trigger('click'); },300);
			paypal_setup_tour.init();
			paypal_setup_tour.restart();
			paypal_setup_tour.goTo(0) 
			}
		);
		


/* PDF CREATOR SETUP*/
	var pdf_setup_tour = new Tour({
		  name: "pdf-setup-tour",
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		  {
			element: ".show_pdf_setup",
			title: "PDF Creator",
			content: "Create and setup PDF here.",
			placement: 'right'
		  },
		  {
			element: ".pdf_not_installed .message",
			title: "Add-on Not Found!",
			content: "Buy this add-on from <strong>Envato CodeCanyon</strong> or download it from <strong>Envato Elements</strong><br><br>Click on the Buttons below.",
			placement: 'top',
		  	template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		  },
		  {
			element: ".tour_pdf_setup_1",
			title: "PDF Email Attachments",
			content: "Choose to attached this PDF to your User and/or Admin emails.",
			placement: 'bottom'
		  },
		  {
			element: "#pdfcreator .mce-edit-area",
			title: "PDF Body",
			content: "This is where you construct your PDF body (the actual content of the PDF). You can add your own CSS by adding it in a &lt;style&gt;&lt;/style&gt; tag in the \"Text\" view of the editor. Or you can simply use inline CSS on your HTML elements.<br><br>Note: This Editor works the same as the Classic WordPress TinyMCE Page/Post Editor.",
			placement: 'top'
		  },
		  
		  {
			element: "#pdfcreator .mce-flight_shortcodes",
			title: "Form Data Tags",
			content: "Add form Data tags from this button into your PDF body. These tags will be replaced with actual data submitted from these form fields.",
			placement: 'top'
		  },
		 
		  {
			orphan: true,
			title: "End of Tour",
			content: "For more information on PDF setup see: <a href='#' target='_blank'>Docs - PDF Setup</a><br><br><a href='#' class=\"btn btn-default tour-ftp-setup\">Also see: Form to Post Setup <span class=\"fa fa-arrow-right\"></span></a>",
		  },
		  
		]});
	jQuery(document).on('click','.tour-pdf-setup',
		function()
			{
			end_nf_tours();
			jQuery('.top-menu-dropdown a.integration').trigger('click');
			setTimeout(function(){ jQuery('.form_attr_left_menu a.show_pdf_setup').trigger('click'); },300);
			pdf_setup_tour.init();
			pdf_setup_tour.restart();
			pdf_setup_tour.goTo(0) 
			}
		);

/* FORM TO POST PDF */
	var ftp_setup_tour = new Tour({
		  name: "ftp-setup-tour",
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		  {
			element: ".show_ftp_setup",
			title: "Form to Post/Page Setup",
			content: "Form to Post setup is found here.",
			placement: 'right'
		  },
		  {
			element: ".ftp_not_installed .message",
			title: "Add-on Not Found!",
			content: "Buy this add-on from <strong>Envato CodeCanyon</strong> or download it from <strong>Envato Elements</strong><br><br>Click on the Buttons below.",
			placement: 'top',
		  	template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		  },
		  {
			element: ".tour_ftp_setup_1",
			title: "Integrate with Form to Post",
			content: "Select <strong>Yes</strong> to have this form's submissions create posts or pages to the specified settings below.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_ftp_setup_2",
			title: "Set Post Title",
			content: "Select/Map the Field that will be used for the Post/Page's Title",
			placement: 'bottom'
		  },
		  {
			element: ".tour_ftp_setup_3",
			title: "Set Featured Image",
			content: "Select/Map the Field that will be used for the Post/Page's Featured Image. <br><br>Note: This field should be a file/image upload field.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_ftp_setup_4",
			title: "Set Post or Page Type",
			content: "Choose to create Posts or Pages from the form's submissions.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_ftp_setup_5",
			title: "Set Post/Page Status",
			content: "Select what the status of the Post or Page will be upon creation.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_ftp_setup_6",
			title: "Allow Commnets",
			content: "Choose to allow comments for the post or page.",
			placement: 'bottom'
		  },
		  {
			element: "#formtopost .mce-edit-area",
			title: "Post/Page Content",
			content: "This is where you construct the Page/Post content. Note: This Editor works the same as the Classic WordPress TinyMCE Page/Post Editor.",
			placement: 'top'
		  },
		  
		  {
			element: "#formtopost .mce-flight_shortcodes",
			title: "Form Data Tags",
			content: "Add form Data tags from this button into your Page/Post content. These tags will be replaced with actual data submitted from these form fields.",
			placement: 'top'
		  },
		 
		  {
			orphan: true,
			title: "End of Tour",
			content: "For more information on Form to Post setup see: <a href='#' target='_blank'>Docs - Form to Post Setup</a><br><br><a href='#' class=\"btn btn-default tour-mc-setup\">Also see: MailChimp Setup <span class=\"fa fa-arrow-right\"></span></a>",
		  },
		  
		]});	
	jQuery(document).on('click','.tour-ftp-setup',
		function()
			{
			end_nf_tours();
			jQuery('.top-menu-dropdown a.integration').trigger('click');
			setTimeout(function(){ jQuery('.form_attr_left_menu a.show_ftp_setup').trigger('click'); },300);
			ftp_setup_tour.init();
			ftp_setup_tour.restart();
			ftp_setup_tour.goTo(0) 
			}
		);
	

/* MAILCHIMP SETUP */
	var mc_setup_tour = new Tour({
		  name: "mc-setup-tour",
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		  {
			element: ".show_mc_setup",
			title: "MailChimp Setup",
			content: "MailChimp integration setup is found here.",
			placement: 'right'
		  },
		  {
			element: ".mc_not_installed .message",
			title: "Add-on Not Found!",
			content: "Buy this add-on from <strong>Envato CodeCanyon</strong> or download it from <strong>Envato Elements</strong><br><br>Click on the Buttons below.",
			placement: 'top',
		  	template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		  },
		  {
			element: ".tour_mc_setup_1",
			title: "Integrate with Mailchimp",
			content: "Select <strong>Yes</strong> to have this form's submissions added to your MailChimp list specified below.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_mc_setup_2",
			title: "Mailchimp Lists",
			content: "Choose which list this form's submissions will be adding to. ",
			placement: 'bottom'
		  },
		  {
			element: ".tour_mc_setup_3",
			title: "Lists Columns",
			content: "The selected list's columns/fields will be populated here. Map a form field to the corresponding list column.",
			placement: 'bottom'
		  },
		 
		  {
			orphan: true,
			title: "End of Tour",
			content: "For more information on MailChimp setup see: <a href='#' target='_blank'>Docs - MailChimp Setup</a><br><br><a href='#' class=\"btn btn-default tour-gr-setup\">Also see: GetResponse Setup <span class=\"fa fa-arrow-right\"></span></a>",
		  },
		  
		]});	
	jQuery(document).on('click','.tour-mc-setup',
		function()
			{
			end_nf_tours();
			jQuery('.top-menu-dropdown a.integration').trigger('click');
			setTimeout(function(){ jQuery('.form_attr_left_menu a.show_mc_setup').trigger('click'); },300);
			mc_setup_tour.init();
			mc_setup_tour.restart();
			mc_setup_tour.goTo(0) 
			}
		);
		
/* GETRESPONSE SETUP */
	var gr_setup_tour = new Tour({
		  name: "gr-setup-tour",
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		  {
			element: ".show_gr_setup",
			title: "GetResponse Setup",
			content: "GetResponse integration setup is found here.",
			placement: 'right'
		  },
		  {
			element: ".gr_not_installed .message",
			title: "Add-on Not Found!",
			content: "Buy this add-on from <strong>Envato CodeCanyon</strong> or download it from <strong>Envato Elements</strong><br><br>Click on the Buttons below.",
			placement: 'top',
		  	template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		  },
		  {
			element: ".tour_gr_setup_1",
			title: "Integrate with GetResponse",
			content: "Select <strong>Yes</strong> to have this form's submissions added to your GetResponse list specified below.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_gr_setup_2",
			title: "GetResponse Lists",
			content: "Choose which list this form's submissions will be adding to. ",
			placement: 'bottom'
		  },
		  {
			element: ".tour_gr_setup_3",
			title: "Lists Columns",
			content: "The selected list's columns/fields will be populated here. Map a form field to the corresponding list column.",
			placement: 'bottom'
		  },
		 
		  {
			orphan: true,
			title: "End of Tour",
			content: "For more information on GetResponse setup see: <a href='#' target='_blank'>Docs - GetResponse Setup</a><br><br><a href='#' class=\"btn btn-default tour-paypal-setup\">Also see: PayPal Setup <span class=\"fa fa-arrow-right\"></span></a>",
		  },
		  
		]});	
	jQuery(document).on('click','.tour-gr-setup',
		function()
			{
			end_nf_tours();
			jQuery('.top-menu-dropdown a.integration').trigger('click');
			setTimeout(function(){ jQuery('.form_attr_left_menu a.show_gr_setup').trigger('click'); },300);
			gr_setup_tour.init();
			gr_setup_tour.restart();
			gr_setup_tour.goTo(0) 
			}
		);
	


/* FORM OPTIONS TOURS */
/* On Form Submission */
	var form_submit_setup_tour = new Tour({
		  name: "form-submit-setup-tour",
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		  {
			element: ".show_on_submission_options",
			title: "On Form Submit Setup",
			content: "Find your on form submission options here",
			placement: 'right'
		  },
		  {
			element: ".tour_form_submit_setup_1",
			title: "Submission Type",
			content: "Choose between AJAX or Custom submissions. Note, if you choose Custom you should have coding knowledge as you will be required to do the submitted form data processing yourself.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_form_submit_setup_2",
			title: "After Submission",
			content: "Choose whether to show the on-screen message or to redirect the user to your own custom \"Thank You\" page or processing script.",
			placement: 'bottom'
		  },
		  
		   {
			element: ".tour_other_options_setup_4",
			title: "Submission Limit",
			content: "Sets a limit on submissions of this form.",
			placement: 'bottom'
		  },
		  
		   {
			element: ".tour_other_options_setup_5",
			title: "Limit Reached Message",
			content: "Add a message instead of the form when the submission limit is reached. Leave it blank to simply HIDE the form when the limit is reached. NOTE: Only applicable when you have set a submission limit. ",
			placement: 'bottom'
		  },
		  {
			element: ".tour_other_options_setup_16",
			title: "Google Conversion Tracking Code",
			content: "Add your Google conversion code here. Do not use &lt;script&gt; tags, just add your ga code - example: ga(\'send\', \'event\', \'link\', \'click\', \'http://example.com\')",
			placement: 'bottom'
		  },
		  
		  
		  {
			element: ".tour_other_options_setup_17",
			title: "Before Submit JS",
			content: "Add custom javscript to be executed BEFORE a submission. IMPORTANT NOTE: You need to return a boolean, true or false",
			placement: 'top'
		  },
		  
		  {
			element: ".tour_other_options_setup_18",
			title: "After Submit JS",
			content: "Add custom javscript to be executed AFTER a submission. IMPORTANT NOTE: You need to return a boolean, true or false",
			placement: 'top'
		  },
		  
		 
		  {
			orphan: true,
			title: "End of Tour",
			content: "<a href='#' class=\"btn btn-default tour-hidden-fields-setup\">Also see: Hidden Fields Setup <span class=\"fa fa-arrow-right\"></span></a>",
		  },
		  
		]});	
	jQuery(document).on('click','.tour-form-submit-setup',
		function()
			{
			end_nf_tours();
			jQuery('.top-menu-dropdown a.form_options').trigger('click');
			setTimeout(function(){ jQuery('.form_attr_left_menu a.show_on_submission_options').trigger('click'); },300);
			form_submit_setup_tour.init();
			form_submit_setup_tour.restart();
			form_submit_setup_tour.goTo(0) 
			}
		);


/* Hidden Fields */
	var hidden_fields_setup_tour = new Tour({
		  name: "hidden-fields-setup-tour",
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		  {
			element: ".show_hidden_fields",
			title: "Hidden Fields Setup",
			content: "Add hidden Fields to your form here.",
			placement: 'right'
		  },
		  {
			element: ".tour_hidden_fields_setup_1",
			title: "Add a Hidden Field",
			content: "Click this button to add a new hidden field.",
			placement: 'right'
		  },
		  {
			element: ".hidden_fields_setup",
			title: "Hidden Fields List",
			content: "This is where all your form's hidden fields can be found, edited and deleted.",
			placement: 'top'
		  },
		  {
			orphan: true,
			title: "End of Tour",
			content: "For more information on Hidden Fields see: <a href='#' target='_blank'>Docs - Hidden Fields Setup</a><br><br><a href='#' class=\"btn btn-default tour-other-options-setup\">Also see: Other Form Options <span class=\"fa fa-arrow-right\"></span></a>",
		  },
		 
		]});	
	jQuery(document).on('click','.tour-hidden-fields-setup',
		function()
			{
			end_nf_tours();
			jQuery('.top-menu-dropdown a.form_options').trigger('click');
			setTimeout(function(){ jQuery('.form_attr_left_menu a.show_hidden_fields').trigger('click'); },300);
			hidden_fields_setup_tour.init();
			hidden_fields_setup_tour.restart();
			hidden_fields_setup_tour.goTo(0) 
			}
		);
		

/* Other Options */
	var other_options_setup_tour = new Tour({
		  name: "other-options-setup-tour",
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		  {
			element: ".show_file_uploads_options",
			title: "Other Options",
			content: "Find all other form options here.",
			placement: 'right'
		  },
		  {
			element: ".tour_other_options_setup_3",
			title: "Save Form Progress",
			content: "If enabled users can start a form and complete it at a later stage.",
			placement: 'bottom'
		  },
		  {
			element: ".tour_other_options_setup_1",
			title: "File Uploads",
			content: "Choose if you want your submitted files to be uploaded and saved to the server. The uploaded files will be saved in your /wp-uploads folder.",
			placement: 'bottom'
		  },
		  
		  {
			orphan: true,
			title: "End of Tour",
			content: "Also see: <a href='#' class=\"btn btn-default tour-form-submit-setup\">Also see: On Form Submission Setup <span class=\"fa fa-arrow-right\"></span></a>",
		  },
		  
		]});	
	jQuery(document).on('click','.tour-other-options-setup',
		function()
			{
			end_nf_tours();
			jQuery('.top-menu-dropdown a.form_options').trigger('click');
			setTimeout(function(){ jQuery('.form_attr_left_menu a.show_file_uploads_options').trigger('click'); },300);
			other_options_setup_tour.init();
			other_options_setup_tour.restart();
			other_options_setup_tour.goTo(0) 
			}
		);

/* MAIN TOUR */	
	var main_tour = new Tour({
		  name: "main-tour",
		  animation:true,
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		 
		  {
			element: ".btn-dashboard",
			title: "Dashboard",
			content: "Takes you back to your NEX-Forms Dashboard.",
			placement: 'bottom',
			
		  },
		  {
			element: ".saved-forms",
			title: "Saved Forms",
			content: "Click here to select and switch forms.",
			placement: 'bottom',
		  },
		  {
			element: ".create_new_form",
			title: "New Form",
			content: "Click here to start a new form, template or form import.",
			placement: 'bottom',
			
		  },
		  {
			element: "#form_name",
			title: "Form Title",
			content: "This is the Title of your form.",
			placement: 'bottom'
		  },
		  {
			element: "a.canvas_view",
			title: "Form Canvas",
			content: "Click here to build and style your form.",
			placement: 'bottom',
		  },
		  {
			element: "li a.email_setup",
			title: "Autoresponders",
			content: "Setup your admin notification emails and user confirmation emails here.",
			placement: 'bottom'
		  },
		  {
			element: "li a.integration",
			title: "Integrate with Add-ons",
			content: "Setup your PayPal, PDF's, Mailchimp, GetResponse and Form to post settings from here.",
			placement: 'bottom'
		  },
		  {
			element: "li a.form_options",
			title: "Extra options",
			content: "Here you will find additional settings like adding hidden form fields, setting submission limits, adding Google conversion code, etc.",
			placement: 'bottom'
		  },
		  {
			element: "li a.embed_options",
			title: "Embedding a form",
			content: "You can find the form's shortcodes here to embed the form into your Page(s), Post(s) or Theme template(s)",
			placement: 'bottom'
		  },
		  
		  
		   {
			element: ".save_nex_form.prime_save",
			title: "Save your form (CTRL+S)",
			content: "When you are done with your form and overall setup then hit this button to save it all. If this button keeps spinning see: <a href='https://basix.ticksy.com/articles/' target='_blank'>Support Articles</a>",
			placement: 'bottom'
		  },
		  {
			element: ".view_test_page",
			title: "Demo Test Page",
			content: "<br>A front-end test page has been created just for you in this backend demo!<br><br> Click on this button after you created <strong>AND SAVED</strong> the form. You can test your form live with email submissions and everything. </br></br>Remember you can download the form you create here to import into your own site!",
			placement: 'bottom'
			},
		   {
			element: ".history-tools .do_undo",
			title: "Undo",
			content: "You can undo your last action by clicking here or hitting CTRL+Z",
			placement: 'bottom'
		  },
		   {
			element: ".history-tools .do_redo",
			title: "Redo",
			content: "You can redo your last UNDO by clicking here or hitting CTRL+SHIFT+Z",
			placement: 'bottom'
		  },
		  {
			element: "li.kbsc-tut",
			title: "Keyboard Shortcuts",
			content: "Find all available keyboard shortcuts here.",
			placement: 'left',
		  },
		  {
			element: ".tutorial-menu",
			title: "Tutorials",
			content: "This menu includes some very usefull interactive tutorials.",
			placement: 'left',
			onShow:function(){ jQuery('.help_menu a.tutorial-menu').parent().find('.aa_menu_2').addClass('open');  },
			onHide:function(){ jQuery('.aa_menu_2').removeClass('open');  }
		  },
		  {
			element: ".tours-menu",
			title: "Backend Tours",
			content: "Here you will find all the tours (like this one) to get familiarized with the NEX-Forms Backend.",
			placement: 'left',
			onShow:function(){ jQuery('.help_menu a.tours-menu').parent().find('.aa_menu_2').addClass('open-2');  },
			onHide:function(){ jQuery('.aa_menu_2').removeClass('open-2');  }
		  },
		   {
			element: ".field-selection-tools",
			title: "Form Fields",
			content: "This is your Fields toolbar. Click on any of these fields and elements to be added to your form.",
			placement: 'left'
		  },
		  {
			element: ".field-selection-tools .grid-system-3",
			title: "Grid System",
			content: "These are preset grids. Add them to your form and drag your fields into the grid columns. After adding it to the form you can resize, add more, or delete grid columns",
			placement: 'bottom'
		  },
		  
		  {
			element: ".multi-step-settings-btn",
			title: "Multi-step Settings",
			content: "Opens settings and styling options for multi-steps and multi-step breadcrumb/progress bar.",
			placement: 'bottom'
		  },
		 {
			element: ".add-step-btn",
			title: "Add a new Multi-step",
			content: "Click this button to add a new step in your form.",
			placement: 'bottom'
		  },
		  {
			element: ".multi-step-stepping",
			title: "Multi-step navigation",
			content: "When you have steps you can switch between steps from here.",
			placement: 'bottom'
		  },
		   {
			element: ".expand_fullscreen",
			title: "Full Screen Mode",
			content: "Enables full screen mode. Click again to leave full screen mode.",
			placement: 'bottom',
			
		  },
		   {
			element: ".workspace_theme_light",
			title: "Light Workspace",
			content: "Click here to make your workspace light (this is the default)",
			placement: 'bottom'
		  },
		  {
			element: ".workspace_theme_dark",
			title: "Dark Workspace",
			content: "Click here to make your workspace dark. This is a good option if you are working with light heading colors, labels, etc so you can see your work better.",
			placement: 'bottom'
		  },
		  
		   {
			element: ".workspace.normal",
			title: "Form Build/Design View",
			content: "This is the default Form building mode and gives you total focus on your form building and designing.",
			placement: 'bottom'
		  },
		   {
			element: ".workspace.success-msg",
			title: "Success Build/Design View",
			content: "Design your on-screen success (after submit) message in this view.",
			placement: 'bottom'
		  },
		   {
			element: ".workspace.c-logic",
			title: "Conditional Logic",
			content: "From here you can add Conditional Logic to your form fields.<br><br>See <a href='' class='tut-2'>Using Conditional Logic Tutorial</a>",
			placement: 'bottom'
		  },
		   {
			element: ".workspace.split",
			title: "Split Mode",
			content: "This mode splits your preview and design in realtime. The preview automatically refreshes as you work.",
			placement: 'bottom'
		  },
		   {
			element: ".workspace.preview",
			title: "Preview Mode",
			content: "This mode gives you the preview of your form.",
			placement: 'bottom'
		  },
		   {
			element: ".set_form_theme",
			title: "Set Form Theme",
			content: "Set your overall form theme from here. <br><br>Requires <a href='https://codecanyon.net/item/form-themes-for-nexforms/10037800?ref=Basix' target='_blank'>Form Themes Add-on for NEX-Forms</a>",
			placement: 'bottom'
		  },
		  {
			element: ".choose_form_theme",
			title: "Set Form Color Scheme",
			content: "Contains all available preset color schemes. <br><br>Requires <a href='https://codecanyon.net/item/form-themes-for-nexforms/10037800?ref=Basix' target='_blank'>Form Themes Add-on for NEX-Forms</a>",
			placement: 'bottom'
		  },
		  {
			element: ".width_input",
			title: "Set Form Width",
			content: "Set your form width in % (percentage) or PX (pixels). We recomend you use % as fixed PX is not Mobile responsive!",
			placement: 'bottom'
		  },
		   {
			element: ".wrapper-bg-color",
			title: "Form Background Color and shadow",
			content: "Sets the background color for your form. Use the buttons to drops a light, or dark, shadow on your form wrapper. Click again to remove the shadow.",
			placement: 'bottom'
		  },
		 
		   {
			element: "#form_padding",
			title: "Form Wrapper Padding",
			content: "Set your overall form padding (top, right , bottom and left) from here. To set individual styling see \"More Styling Options next\"",
			placement: 'bottom'
		  },
		  {
			element: ".settings_more_styling_options .fa-paint-brush",
			title: "More Styling options",
			content: "Opens more styling options for your form and overall fields. Like setting overall field orientation or overall field lable styling, etc. Also includes adding custom CSS.",
			placement: 'bottom'
		  },
		  {
			element: ".nex-forms-container",
			title: "Form Canvas",
			content: "This is the WYSIWYG area where you build, drag, sort and edit your form fields.",
			placement: 'top'
		  },
		  
		  
		  {
			orphan: true,
			title: "End of Tour",
			content: "That concludes the Main Tour. <br><br>See next: <br><br><a href='#' class='tour-email-setup'>Email Setup Tour</a><br><a href='#' class='tour-paypal-setup'>Add-on Integrations Tour</a><br><a href='#' class='tour-form-submit-setup'>Extra Options Tour</a>",
			placement: 'bottom',
		  },
		  
		  
		]});
	jQuery(document).on('click','a.tour-main',
		function()
			{
			end_nf_tours();
			jQuery('a.canvas_view').trigger('click');
			main_tour.init();
			main_tour.start();
			main_tour.restart();
			}
		);	
		
/* TUTORIALS */
function nf_check_form_canvas(){
	
	if(jQuery('.nex-forms-container').find('.form_field').length>1)
		{  
		setTimeout(function(){ 
			jQuery('.start-tutorial').hide();
			jQuery('.tut_clear_form').show();
			jQuery('.new_tut').hide();
		},200);
		} 
	else
		{	
		setTimeout(function(){ 
			jQuery('.start-tutorial').show();
			jQuery('.tut_clear_form').hide();
			jQuery('.new_tut').show();
			
			},200);
		}
}

jQuery(document).on('click','.clear_form, .restart-tutorial',
		function()
			{
			jQuery('.multi-step-stepping').html('');
			jQuery('.show_all_steps').hide();
			jQuery('.btn.workspace.normal').trigger('click');
			jQuery('.nex-forms-container').html('<div class="form_field hidden" id="_ms_current_step"><input class="ms_current_step" value="1" name="ms_current_step" type="hidden"></div>');
			jQuery('.con-logic-column .set_rules').html('');	
			jQuery('.nf_step_breadcrumb').hide();
			end_nf_tours();
			var step = 0;
			if(jQuery(this).hasClass('restart-tutorial'))
				step = 1;
			
			var get_tut = jQuery(this).attr('data-tutorial');
			if(get_tut=='tut-1')
				{
				tutorial_1.restart();
				tutorial_1.goTo(step);
				}
			if(get_tut=='tut-2')
				{
				tutorial_2.restart();
				tutorial_2.goTo(step);
				}
			if(get_tut=='tut-3')
				{
				tutorial_3.restart();
				tutorial_3.goTo(step);
				}
			if(get_tut=='tut-4')
				{
				tutorial_4.restart();
				tutorial_4.goTo(step);
				}
			
			jQuery('#nex-forms').addClass('running-tutorial');
			jQuery('.popover.tour.tour-'+get_tut).addClass('animated').addClass('flipInY');
			}
		);

var current_tut_step = '';
/* TUT 1 - CREATE A CONTACT FORM */		
		
		
		var tutorial_1 = new Tour({
		  name: "tut-1",
		  onStart: function(){ nf_check_form_canvas(); },
		  onEnd: function(){ jQuery('#nex-forms').removeClass('tut-1').removeClass('running-tutorial'); },
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		  {
			orphan: true,
			title: "Tutorial 1 - Simple Contact Form",
			content: "<div class='new_tut'>In this tutorial you will learn how to build a simple contact form.</div><div class='tut_clear_form' style='display:none;'><span class='fa fa-warning pulsate_2'></span>For this tutorial to work you need to clear your form canvas from all fields or create a new blank form and re-start this tutorial.<br></br><a href='#' class='btn btn-default clear_form' data-tutorial='tut-1'>Clear Now</a> <a href='#' class='btn btn-default create_new_form'>New Form</a></div>",
			template: "<div class='popover tour tutorial-step-1 animated fadeInUp'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><a href='#' class='start-button start-tutorial' data-role='next' style='display:block;'><span class='start-border'>Start</span><span class='start-border-2 pulsate_1'></a></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			placement: 'bottom',
			onShow: function(){ nf_check_form_canvas(); },
		  },
		  {
			element: ".tool-section .form_field.name",
			title: "Step 1",
			content: "Add a Name Field",
			placement: 'bottom',
			reflex: true,
		  },
		  {
			element: ".tool-section .form_field.email",
			title: "Step 2",
			content: "Now add an Email field so we can get back to the customer.",
			placement: 'bottom',
			reflex: true,
		  },
		  {
			element: ".tool-section .form_field.Query",
			title: "Step 3",
			content: "Good, now we can add a query field so we can get some feedback from the customer.",
			placement: 'bottom',
			reflex: true,
		  },
		  {
			element: ".tool-section .tool-spacer .form_field.submit-button.the_submit",
			title: "Step 4",
			content: "Thats all we need for now, just add a submit button so the user can send the form.",
			placement: 'bottom',
			reflex: true,
		  },
		  {
			element: ".save_nex_form.prime_save",
			title: "Step 5",
			content: "Lastly, save or <a href='#' class='preview-form'>Preview</a> the Form.",
			placement: 'bottom',
			template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>Finish <span class='fa fa-thumbs-up'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			reflex: true,
		  },
		  {
			orphan: true,
			title: "Tutorial 1 - Complete!",
			content: "<span class='fa fa-check'></span><strong>Well done!</strong></br>You have just created your first Contact Form! <a href='#' class='start-button start-tutorial restart-tutorial' data-tutorial='tut-1' data-role='' style='display:block;'><span class='start-border'>restart</span><span class='start-border-2 pulsate_1'></span></a><div class='more_tuts'><h5>Also See:</h5><a href='#' class='tut-1'>Building a Simple Contact Form</a><a href='#' class='tut-2'>Using Conditional Logic</a><a href='#' class='tut-3'>Using Math Logic</a><a href='#' class='tut-4'>Creating a Multi-Step Form</a></div>",
			template: "<div class='popover tour tutorial-last-step animated bounceInDown'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			placement: 'bottom',
		  },
		]});
		
	jQuery(document).on('click','a.tut-1',
		function()
			{
			end_nf_tours();
			jQuery('a.canvas_view').trigger('click');
			jQuery('#nex-forms').addClass('tut-1').addClass('running-tutorial');
			tutorial_1.init();
			tutorial_1.restart();
			}
		);
		
		




/* TUT 2 - USING CONDITIONAL LOGIC */		
		
		
		var tutorial_2 = new Tour({
		  name: "tut-2",
		  onStart: function (tour) {jQuery('#nex-forms').addClass('tut-2')},
 		  onEnd: function (tour) {jQuery('#nex-forms').removeClass('tut-2').removeClass('running-tutorial')},
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		  {
			orphan: true,
			title: "Tutorial 2 - Using Conditional Logic",
			content: "<div class='new_tut'>In this tutorial you will to create a simple contact form and will learn how to apply Conditional Logic to the fields.</div><div class='tut_clear_form' style='display:none;'><span class='fa fa-warning pulsate_2'></span>For this tutorial to work you need to clear your form canvas from all fields or create a new blank form and re-start this tutorial.<br></br><a href='#' class='btn btn-default clear_form' data-tutorial='tut-2'>Clear Now</a> <a href='#' class='btn btn-default create_new_form'>New Form</a></div>",
			template: "<div class='popover tour tutorial-step-1 animated fadeInUp'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><a href='#' class='start-button start-tutorial' data-role='next' style='display:block;'><span class='start-border'>Start</span><span class='start-border-2 pulsate_1'></a><button class='btn btn-default hidden start-tut' data-role='next'>Start Tutorial <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			placement: 'bottom',
			onShow: function(){ nf_check_form_canvas(); },
		  },
		  {
			element: ".tool-section .form_field.name",
			title: "Step 1",
			content: "Add a Name Field",
			placement: 'bottom',
			reflex: true,
		  },
		  {
			element: ".tool-section .form_field.radio-group",
			title: "Step 2",
			content: "Add a Radio Button Field",
			placement: 'bottom',
			reflex: true,
		  },
		  {
			element: ".tool-section .form_field.email",
			title: "Step 3",
			content: "Add an Email field",
			placement: 'bottom',
			reflex: true,
		  },
		  {
			element: ".tool-section .form_field.phone_number",
			title: "Step 4",
			content: "Add a Phone Number field",
			placement: 'bottom',
			reflex: true,
		  },
		  {
			element: ".nex-forms-container .form_field.radio-group",
			title: "Step 5",
			content: "Good, now lets edit the Radio Button field.",
			placement: 'bottom',
			reflex: true,
			onShow: function (tour) {if(current_field){ jQuery('li#label-settings a').trigger('click') } }
		  },
		  {
			element: ".field-settings-column #set_label",
			title: "Step 6",
			content: "Change the <strong>Label Text</strong> setting to<br></br><strong>Contact Method</strong><br><br>Note: This label can be anything but for this tutorial please follow the instructions.",
			placement: 'left',
		  },
		  {
			element: "li#input-settings",
			title: "Step 7",
			content: "Now we want to change the input buttons so we go to the Input Settings for the field.",
			placement: 'top',
		  },
		  {
			element: ".field-settings-column #set_radios",
			title: "Step 8",
			content: "Change the radio buttons to:<br><br><strong>Email<br>Phone</strong><br><br>Note: You can have any number of buttons with any labels but for this tutorial please follow the instructions.",
			placement: 'left',
		  },
		   {
			element: ".workspace.c-logic",
			title: "Step 9",
			content: "Now that your fields are setup we can add some Conditional Logic.",
			placement: 'bottom',
			reflex: true,
		  },
		  {
			element: ".refresh_cl_fields",
			title: "Step 10",
			content: "We added some new fields to the form so we need to hit the <strong>Refresh Fields</strong> button so the fields reflect in the fields selection lists.",
			placement: 'left',
			reflex: true,
		  },
//CL - CREATE RULE 1
		  {
			element: ".add_new_rule.cl-tool-btn",
			title: "Step 11 - Create First Rule",
			content: "Good, now lets create our first rule.",
			placement: 'top',
			reflex: true,
		  },
		  {
			element: ".conditional_logic_wrapper",
			title: "Step 11 - Rule 1",
			content: "For this rule we want to show the <strong>Email</strong> field only when the <strong>Contact Method</strong> field's selected value is equal to the value <strong>Email</strong>",
			placement: 'left',
			template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>Create Rule 1 <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		  },
		  {
			element: ".set_rules .new_rule:first-child select.cl_field",
			title: "Step 11 - Rule trigger field",
			content: "Select <strong>Contact Method</strong> form the list",
			placement: 'top',
		  },
		  {
			element: ".set_rules .new_rule:first-child select[name='field_condition']",
			title: "Step 11 - Trigger field Condition",
			content: "Select <strong>Equal To</strong>",
			placement: 'top',
		  },
		  {
			element: ".set_rules .new_rule:first-child input[name='conditional_value']",
			title: "Step 11 - Trigger field value",
			content: "Enter <strong>Email</strong><br><br>Note: Field values are case sensitive!",
			placement: 'top',
		  },
		  
		  {
			element: ".set_rules .new_rule:first-child select[name='the_action']",
			title: "Step 11 - Action to Take",
			content: "Select <strong>Show</strong>. <br><br>Note that if the condition is false, in this case if the selected value of the <strong>Contact Method</strong> field is not equal to <strong>Email</strong> then this action will be automatically reversed. Meaning a <strong>Shown</strong> field will become <strong>Hidden</strong>, an <strong>Enabled</strong> field will become <strong>Disabled</strong> and vice versa.",
			placement: 'left',
		  },
		  {
			element: ".set_rules .new_rule:first-child select[name='cla_field']",
			title: "Step 11 - Apply action to field",
			content: "Select <strong>Email</strong> under text fields.",
			placement: 'top',
		  },
		  
//CL - CREATE RULE 2		  
		  {
			element: ".add_new_rule.cl-tool-btn",
			title: "Step 12 - Create Second Rule",
			content: "Well done, now lets create a second rule.",
			placement: 'top',
			reflex: true,
		  },
		  {
			element: ".conditional_logic_wrapper",
			title: "Step 12 - Rule 2",
			content: "For this rule we want to show the <strong>Phone</strong> field only when the <strong>Contact Method</strong> field's selected value is equal to the value <strong>Phone</strong>",
			placement: 'left',
			template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>Create Rule 2 <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		  },
		  {
			element: ".set_rules .new_rule:nth-child(2) select.cl_field",
			title: "Step 12 - Rule trigger field",
			content: "Select <strong>Contact Method</strong> form the list",
			placement: 'top',
		  },
		  {
			element: ".set_rules .new_rule:nth-child(2) select[name='field_condition']",
			title: "Step 12 - Trigger field Condition",
			content: "Select <strong>Equal To</strong>",
			placement: 'top',
		  },
		  {
			element: ".set_rules .new_rule:nth-child(2) input[name='conditional_value']",
			title: "Step 12 - Trigger field value",
			content: "Enter <strong>Phone</strong><br><br>Note: Field values are case sensitive!",
			placement: 'top',
		  },
		  
		  {
			element: ".set_rules .new_rule:nth-child(2) select[name='the_action']",
			title: "Step 12 - Action to Take",
			content: "Select <strong>Show</strong>. <br><br>Note that if the condition is false, in this case if the selected value of the <strong>Contact Method</strong> field is not equal to <strong>Phone</strong> then this action will be automatically reversed. Meaning a <strong>Shown</strong> field will become <strong>Hidden</strong>, an <strong>Enabled</strong> field will become <strong>Disabled</strong> and vice versa.",
			placement: 'left',
		  },
		  {
			element: ".set_rules .new_rule:nth-child(2) select[name='cla_field']",
			title: "Step 12 - Apply action to field",
			content: "Select <strong>Phone Number</strong> under text fields.",
			placement: 'top',
		  },
		  {
			orphan: true,
			title: "Logic Setup Complete!",
			content: "Thats it!<br><br> Now lets finish up the form with a Query Field and a Submit Button.",
			template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			placement: 'bottom',
			
		  },
		  {
			element: ".tool-section .form_field.Query",
			title: "Step 13",
			content: "Add a Query Field so the user can supply some information to you...",
			placement: 'right',
			reflex: true,
			onShow: function (tour) {jQuery('.conditional_logic_wrapper #close-settings').trigger('click'); }
		  },
		  {
			element: ".tool-section .tool-spacer .form_field.submit-button.the_submit",
			title: "Step 14",
			content: "...and now add a Submit button so the user can send the form.",
			placement: 'right',
			reflex: true,
		  },
		  {
			element: ".save_nex_form.prime_save",
			title: "Step 15",
			content: "Lastly, save or <a href='#' class='preview-form'>Preview</a> the Form.",
			placement: 'bottom',
			template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>Finish <span class='fa fa-thumbs-up'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			reflex: true,
		  },
		  {
			orphan: true,
			title: "Tutorial 2 - Complete!",
			content: "<span class='fa fa-check'></span><strong>Well done!</strong></br>You have just created your first form that uses Conditional Logic!<a href='#' class='start-button start-tutorial restart-tutorial' data-tutorial='tut-2' data-role='' style='display:block;'><span class='start-border'>restart</span><span class='start-border-2 pulsate_1'></span></a><div class='more_tuts'><h5>Also See:</h5><a href='#' class='tut-1'>Building a Simple Contact Form</a><a href='#' class='tut-2'>Using Conditional Logic</a><a href='#' class='tut-3'>Using Math Logic</a><a href='#' class='tut-4'>Creating a Multi-Step Form</a></div>",
			template: "<div class='popover tour tutorial-last-step'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			placement: 'bottom',
		  },
		]});
		
	jQuery(document).on('click','a.tut-2',
		function()
			{
			end_nf_tours();
			jQuery('a.canvas_view').trigger('click');
			tutorial_2.init();
			tutorial_2.start();
			tutorial_2.restart();
			jQuery('#nex-forms').addClass('tut-2').addClass('running-tutorial');
			}
		);
	
	jQuery(document).on('keyup','.tut-2 #set_label',
		function()
			{
			if(jQuery(this).val()=='Contact Method')
				tutorial_2.goTo(7) 
			}
		);
	jQuery(document).on('click','.tut-2 li#input-settings',
		function()
			{
			tutorial_2.goTo(8);
			}
		);
		
	jQuery(document).on('keyup','.tut-2 #set_radios',
		function()
			{
			if(strstr(jQuery(this).val(),'Email') && strstr(jQuery(this).val(),'Phone'))
				tutorial_2.goTo(9) 
			}
		);
//RULE 1 STEPPING
	jQuery(document).on('change','.tut-2 .set_rules .new_rule:first-child select.cl_field',
		function()
			{
			var selected_value = jQuery(this).val();
			var get_field = selected_value.split('##');
			if(get_field[1]=='contact_method')
				tutorial_2.goTo(14) 
			}
		);
	jQuery(document).on('change','.tut-2 .set_rules .new_rule:first-child select[name="field_condition"]',
		function()
			{
			if(jQuery(this).val()=='equal_to')
				tutorial_2.goTo(15) 
			}
		);
	jQuery(document).on('keyup','.tut-2 .set_rules .new_rule:first-child input[name="conditional_value"]',
		function()
			{
			if(jQuery(this).val()=='Email')
				tutorial_2.goTo(16) 
			}
		);
	jQuery(document).on('change','.tut-2 .set_rules .new_rule:first-child select[name="the_action"]',
		function()
			{
			if(jQuery(this).val()=='show')
				tutorial_2.goTo(17) 
			}
		);
	jQuery(document).on('change','.tut-2 .set_rules .new_rule:first-child select[name="cla_field"]',
		function()
			{
			var selected_value = jQuery(this).val();
			var get_field = selected_value.split('##');
			if(get_field[1]=='email')
				tutorial_2.goTo(18) 
			}
		);
		
//RULE 2 STEPPING
	jQuery(document).on('change','.set_rules .new_rule:nth-child(2) select.cl_field',
		function()
			{
			var selected_value = jQuery(this).val();
			var get_field = selected_value.split('##');
			if(get_field[1]=='contact_method')
				tutorial_2.goTo(21) 
			}
		);
	jQuery(document).on('change','.tut-2 .set_rules .new_rule:nth-child(2) select[name="field_condition"]',
		function()
			{
			if(jQuery(this).val()=='equal_to')
				tutorial_2.goTo(22) 
			}
		);
	jQuery(document).on('keyup','.tut-2 .set_rules .new_rule:nth-child(2) input[name="conditional_value"]',
		function()
			{
			if(jQuery(this).val()=='Phone')
				tutorial_2.goTo(23) 
			}
		);
	jQuery(document).on('change','.tut-2 .set_rules .new_rule:nth-child(2) select[name="the_action"]',
		function()
			{
			if(jQuery(this).val()=='show')
				tutorial_2.goTo(24) 
			}
		);
	jQuery(document).on('change','.tut-2 .set_rules .new_rule:nth-child(2) select[name="cla_field"]',
		function()
			{
			var selected_value = jQuery(this).val();
			var get_field = selected_value.split('##');
			if(get_field[1]=='phone_number')
				tutorial_2.goTo(25) 
			}
		);
	
	




/* TUT 3- USING MATH LOGIC */		
		
		var tutorial_3 = new Tour({
		  name: "tut-3",
		  onStart: function (tour) {jQuery('#nex-forms').addClass('tut-3')},
 		  onEnd: function (tour) {jQuery('#nex-forms').removeClass('tut-3').removeClass('running-tutorial')},
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		  {
			orphan: true,
			title: "Tutorial 3 - Using Math Logic",
			content: "<div class='new_tut'>In this tutorial you will learn how to use Math Logic.</div><div class='tut_clear_form' style='display:none;'><span class='fa fa-warning pulsate_2'></span>For this tutorial to work you need to clear your form canvas from all fields or create a new blank form and re-start this tutorial.<br></br><a href='#' class='btn btn-default clear_form' data-tutorial='tut-3'>Clear Now</a> <a href='#' class='btn btn-default create_new_form'>New Form</a></div>",
			template: "<div class='popover tour tutorial-step-1 animated fadeInUp'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><a href='#' class='start-button start-tutorial' data-role='next' style='display:block;'><span class='start-border'>Start</span><span class='start-border-2 pulsate_1'></a><button class='btn btn-default hidden start-tut' data-role='next'>Start Tutorial <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			placement: 'bottom',
			onShow: function(){ nf_check_form_canvas(); },
		  },
		  
		  {
			element: ".tool-section .form_field.radio-group",
			title: "Step 1",
			content: "We will start by adding a Radio Button field for <strong>Products</strong>.",
			placement: 'right',
			reflex: true,
			onNext: function (tour) {
				jQuery(".tool-section").animate(
						{
						scrollTop:400
						},20
					);
				}
		  },
		  {
			element: ".tool-section .form_field.touch_spinner",
			title: "Step 2",
			content: "Now lets add a spinner field for the Quantity.",
			placement: 'right',
			reflex: true,
			
		  },
		  {
			element: ".canvas-tools .form_field.math_logic",
			title: "Step 3",
			content: "Finally, add a math field.",
			placement: 'bottom',
			reflex: true,
		  },
		  {
			element: ".nex-forms-container .form_field.radio-group",
			title: "Step 4",
			content: "Good, now lets edit the Radio Button field.",
			placement: 'bottom',
			reflex: true,
			onShow: function (tour) {if(current_field){ jQuery('li#label-settings a').trigger('click') } }
		  },
		  
		  {
			element: ".field-settings-column #set_label",
			title: "Step 5",
			content: "Change the <strong>Label Text</strong> to<br></br><strong>Products</strong><br><br>Note: This label can be anything but for this tutorial please follow the instructions.",
			placement: 'left',
		  },
		  {
			element: "li#input-settings",
			title: "Step 6",
			content: "Now we want to change <strong>Products</strong> selection radios so we go to the Input Settings for the field.",
			placement: 'top',
		  },
		  {
			element: ".field-settings-column #set_radios",
			title: "Step 7",
			content: "Change the radio buttons to:<br><br><strong>50==Product 1<br>100==Product 2<br>150==Product 3<br>200==Product 4</strong><br><br><strong>IMPORTANT!</strong> To have different values to labels you use a double equal ==<br><br>So its <strong>VALUE==LABEL</strong><br><br>Math logic with radios, checks and selects only work with numeric values.<br><br>Note: You can have any number of buttons with any labels and values but for this tutorial please follow the instructions.",
			placement: 'left',

		  },
		  {
			element: ".nex-forms-container .form_field.touch_spinner",
			title: "Step 8",
			content: "Good, now lets edit the Spinner field.",
			placement: 'bottom',
			reflex: true,
			onShow: function (tour) {if(current_field){ jQuery('li#label-settings a').trigger('click') } }
			
		  },
		  {
			element: ".field-settings-column #set_label",
			title: "Step 9",
			content: "Change the <strong>Label Text</strong> to<br></br><strong>Quantity</strong><br><br>Note: This label can be anything but for this tutorial please follow the instructions.",
			placement: 'left',

		  },
		  {
			element: ".nex-forms-container .form_field.math_logic",
			title: "Step 10",
			content: "Now that your fields are all setup we can do the Math Logic bit.<br><br>Edit the Math Logic Field.",
			placement: 'bottom',
			reflex: true,
		  },
		  {
			element: ".field-settings-column #set_heading_text",
			title: "Step 11",
			content: "Here you can use any symbols or words, etc, but you must make sure to leave in (and not change) the <strong>{math_result}</strong> placeholder tag. If this tag is not in this string or the tag is changed then the math will not work! <br><br> Lets Change it to<br><br><strong>Total = ${math_result}</strong>",
			placement: 'left',
		  },
		  {
			element: ".field-settings-column #math-settings",
			title: "Step 12",
			content: "Now we can do the equation and need to click on the Math Logic Settings tab.",
			placement: 'top',
		  },
		  {
			element: ".field-settings-column select[name='math_fields']",
			title: "Step 13",
			content: "We will be multiplying the selected <strong>Products</strong> field value with the <strong>Quantity</strong> field's value.<br><br>Select <strong>Products</strong> from the dropdown.",
			placement: 'left',
			onShow: function (tour) { current_tut_step = '13'; }		
		  },
		  {
			element: "#set_math_logic_equation",
			title: "Step 14",
			content: "The products field data tag has been added to the equation. Add a <strong>*</strong> (for Multiply) after the products data tag so it will end up to look like <strong>{products}*</strong>",
			placement: 'left',
			onShow: function (tour) { current_tut_step = '14'; }
		  },
		  
		  {
			element: ".field-settings-column select[name='math_fields']",
			title: "Step 15",
			content: "Perfect, now select <strong>Quantity</strong> from the dropdown list.",
			placement: 'left',
			onShow: function (tour) { current_tut_step = '15'; }
		  },
		  {
			element: ".field-settings-column #set_math_input_name",
			title: "Step 16",
			content: "<strong>NOTE!</strong> Your math result is stored by default into a hidden field called math_result. If this field name is not changed to something else you can not re-use it and it wont be emailed! So if you need to re-use totals performed by other equations in new equations or you need the calculated value to be emailed to you then you need to change this \"Math Result Name\" to something relevant like for example total_1.<br><br>For this example lets call this field:<br><br><strong>total_price</strong>",
			placement: 'left',
		  },
		  {
			element: ".save_nex_form.prime_save",
			title: "Step 17",
			content: "Thats it! Save or <a href='#' class='preview-form'>Preview</a> the Form.",
			placement: 'bottom',
			template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>Finish <span class='fa fa-thumbs-up'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			reflex: true,
		  },
		  {
			orphan: true,
			title: "Tutorial 3 - Complete!",
			content: "<span class='fa fa-check'></span><strong>Well done!</strong></br>You have just created your first form that uses Math Logic!<a href='#' class='start-button start-tutorial restart-tutorial' data-tutorial='tut-3' data-role='' style='display:block;'><span class='start-border'>restart</span><span class='start-border-2 pulsate_1'></span></a><div class='more_tuts'><h5>Also See:</h5><a href='#' class='tut-1'>Building a Simple Contact Form</a><a href='#' class='tut-2'>Using Conditional Logic</a><a href='#' class='tut-3'>Using Math Logic</a><a href='#' class='tut-4'>Creating a Multi-Step Form</a></div>",
			template: "<div class='popover tour tutorial-last-step'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			placement: 'bottom',
		  },
		]});
		
	jQuery(document).on('click','a.tut-3',
		function()
			{
			end_nf_tours();
			jQuery('a.canvas_view').trigger('click');
			tutorial_3.init();
			tutorial_3.start();
			tutorial_3.restart();
			tutorial_3.goTo(0) ;
			jQuery('#nex-forms').addClass('tut-3').addClass('running-tutorial');
			}
		);
	jQuery(document).on('keyup','.tut-3 #set_label',
		function()
			{
			if(jQuery(this).val()=='Products' && current_field.hasClass('radio-group'))
				tutorial_3.goTo(6) 
			if(jQuery(this).val()=='Quantity' && current_field.hasClass('touch_spinner'))
				tutorial_3.goTo(10)	
			}
		);
	jQuery(document).on('click','.tut-3 li#input-settings',
		function()
			{
			if(current_field.hasClass('radio-group'))
				tutorial_3.goTo(7);
			if(current_field.hasClass('math_logic'))
				tutorial_3.goTo(11);
			}
		);
		
	jQuery(document).on('keyup','.tut-3 #set_radios',
		function()
			{
			if(strstr(jQuery(this).val(),'50==Product 1') && strstr(jQuery(this).val(),'100==Product 2'))
				{
				tutorial_3.goTo(8) 
				jQuery('.tut-3 #set_radios').trigger('blur');
				jQuery('.tut-3 #set_radios').trigger('change');
				}
			}
		);
	jQuery(document).on('keyup','.tut-3 #set_heading_text',
		function()
			{
			if(jQuery(this).val()=='Total = ${math_result}')
				tutorial_3.goTo(12) 
			}
		);
	jQuery(document).on('click','.tut-3 li#math-settings',
		function()
			{
			tutorial_3.goTo(13) 
			}
		);
	
	
	jQuery(document).on('change','.tut-3 select[name="math_fields"]',
		function()
			{
			if(jQuery(this).val()=='{products}' && current_tut_step == '13')
				tutorial_3.goTo(14)
			if(jQuery(this).val()=='{quantity}' && current_tut_step == '15')
				tutorial_3.goTo(16) 
			}
		);
	
	jQuery(document).on('keyup','.tut-3 #set_math_logic_equation',
		function()
			{
			if(jQuery(this).val()=='{products}*' && current_tut_step == '14')
				{
				tutorial_3.goTo(15)
				jQuery('.tut-3 #set_math_logic_equation').trigger('blur');
				jQuery('.tut-3 #set_math_logic_equation').trigger('change');
				}
			}
		);
	
	jQuery(document).on('keyup','.tut-3 #set_math_input_name',
		function()
			{
			if(jQuery(this).val()=='total_price')
				tutorial_3.goTo(17) 
			}
		);


/* TUT 4- CREATING MULISTEPS */
  		  var tutorial_4 = new Tour({
		  name: "tut-4",
		  onStart: function (tour) {jQuery('#nex-forms').addClass('tut-4')},
 		  onEnd: function (tour) {jQuery('#nex-forms').removeClass('tut-4').removeClass('running-tutorial')},
		  template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		
		  steps: [
		  {
			orphan: true,
			title: "Tutorial 4 - Creating Multi-Steps",
			content: "<div class='new_tut'>In this tutorial you will learn how to create a Multi-Step Form. We will split up a contact form into 3 simple steps.</div><div class='tut_clear_form' style='display:none;'><span class='fa fa-warning pulsate_2'></span>For this tutorial to work you need to clear your form canvas from all fields or create a new blank form and re-start this tutorial.<br></br><a href='#' class='btn btn-default clear_form' data-tutorial='tut-4'>Clear Now</a> <a href='#' class='btn btn-default create_new_form'>New Form</a></div>",
			template: "<div class='popover tour tutorial-step-1 animated fadeInUp'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><a href='#' class='start-button start-tutorial' data-role='next' style='display:block;'><span class='start-border'>Start</span><span class='start-border-2 pulsate_1'></a><button class='btn btn-default hidden start-tut' data-role='next'>Start Tutorial <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			placement: 'bottom',
			onShow: function(){ nf_check_form_canvas(); },
		  },
		  {
			element: ".canvas-tools .form_field.step",
			title: "Create Step 1",
			content: "Click on Create Multi-Step",
			placement: 'bottom',
			onShow: function (tour) { current_tut_step = '1'; }
		  },
		  {
			orphan: true,
			title: "Multi-Step 1 Created",
			content: "Your first step is ready and you can now add field(s) into it.<br><br>Notice that your <strong>Next</strong> and <strong>Back</strong> step buttons are automatically added when creating a new step.<br></br>Also note: While you are actively editing a single step the fields will automatically be added to the step.",
			placement: 'bottom',
			template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>NEXT <span class='fa fa-arrow-right'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
		  },
		  {
			element: ".nf_multi_step_1 input[name='multi_step_name']",
			title: "Name Step 1",
			content: "Lets call this step:<br><br><strong>Personal Details</strong>",
			placement: 'right',
		  },
		  {
			element: ".tool-section .form_field.name",
			title: "Add a field to Step 1",
			content: "Lets add a Name Field...",
			placement: 'right',
			reflex: true,
		  },
		  /*{
			element: ".tool-section .form_field.surname",
			title: "Add another field to Step 1",
			content: "...and a Surname (last name) Field",
			placement: 'right',
			reflex: true,
		  },*/
		  
		  {
			element: ".canvas-tools .form_field.step",
			title: "Create Step 2",
			content: "Well done! Your first step is complete.<br><br>Now add a new step by clicking here on this <strong><span class='fa fa-plus'></span></strong>",
			placement: 'right',
			reflex: true,
			onShow: function (tour) { current_tut_step = '5'; }
		  },
		  {
			element: ".nf_multi_step_2 input[name='multi_step_name']",
			title: "Name Step 2",
			content: "Lets call this step:<br><br><strong>Contact Info</strong>",
			placement: 'right',
		  },
		  {
			element: ".tool-section .form_field.email",
			title: "Add a field to Step 2",
			content: "In this step add an Email field...",
			placement: 'right',
			reflex: true,
		  },
		  {
			element: ".tool-section .form_field.phone_number",
			title: "Add another field to Step 2",
			content: "...and a Phone field",
			placement: 'right',
			reflex: true,
		  },
		  
		  {
			element: ".canvas-tools .form_field.step",
			title: "Create Step 3",
			content: "Step 2 done! Add a 3rd step.",
			placement: 'right',
			reflex: true,
			onShow: function (tour) { current_tut_step = '9'; }
		  },
		  {
			element: ".nf_multi_step_3 input[name='multi_step_name']",
			title: "Name Step 3",
			content: "Lets call this step:<br><br><strong>Query</strong>",
			placement: 'right',
		  },
		  {
			element: ".tool-section .form_field.Query",
			title: "Add a Field to Step 3",
			content: "Lets add a Query field for the last step.",
			placement: 'right',
			reflex: true,
		  },
		  {
			element: ".inner-form-canvas .nf_multi_step_3 .nex-step",
			title: "Submit on last Step",
			content: "This is the last step so we want to change the <strong>Next Button</strong> to a <strong>Submit Button</strong>.<br><br>Edit this button.",
			placement: 'right',
		  },
		  {
			element: ".field-settings-column #set_button_val",
			title: "Edit the button",
			content: "Change the Button Text to:<br><br><strong>Submit</strong><br><br>Note: Button text can be anything but for this tutorial please follow the instructions.",
			placement: 'left',
		  },
		  {
			element: ".field-setting .button-type .do-submit",
			title: "Change to Submit",
			content: "Change the Button Type from Next to Submit.",
			placement: 'bottom',
			reflex: true,
		  },
		  
		  {
			element: ".save_nex_form.prime_save",
			title: "Save or Preview",
			content: "Thats it! Save or <a href='#' class='preview-form'>Preview</a> the Form.",
			placement: 'bottom',
			template: "<div class='popover tour'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn btn-default tour-step-back' data-role='prev'><span class='fa fa-arrow-left'></span> PREV </button><button class='btn btn-default tour-step-next' data-role='next'>Finish <span class='fa fa-thumbs-up'></span></button></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			reflex: true,
		  },
		  
		  {
			orphan: true,
			title: "Tutorial 4 - Complete!",
			content: "<span class='fa fa-check'></span><strong>Well done!</strong></br>You have just created your first Multi-step Form!<a href='#' class='start-button start-tutorial restart-tutorial' data-tutorial='tut-4' data-role='' style='display:block;'><span class='start-border'>restart</span><span class='start-border-2 pulsate_1'></span></a><div class='more_tuts'><h5>Also See:</h5><a href='#' class='tut-1'>Building a Simple Contact Form</a><a href='#' class='tut-2'>Using Conditional Logic</a><a href='#' class='tut-3'>Using Math Logic</a><a href='#' class='tut-4'>Creating a Multi-Step Form</a></div>",
			template: "<div class='popover tour tutorial-last-step'><div class='popover-arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'></div><button class='end-tour' data-role='end'><span class='fa fa-close'></span></button></div>",
			placement: 'bottom',
		  },
		  
		  
		]});
		
	jQuery(document).on('click','a.tut-4',
		function()
			{
			end_nf_tours();
			jQuery('a.canvas_view').trigger('click');
			tutorial_4.init();
			tutorial_4.start();
			tutorial_4.restart();
			tutorial_4.goTo(0) ;
			jQuery('#nex-forms').addClass('tut-4').addClass('running-tutorial');
			}
		);
	
	jQuery(document).on('click','.tut-4 .add-step-btn',
		function()
			{
			if(current_tut_step=='1')
				setTimeout(function(){tutorial_4.goTo(2); jQuery('.step').removeClass('tour-tut-4-element');},200); 
			if(current_tut_step=='5')
				setTimeout(function(){tutorial_4.goTo(6); jQuery('.step').removeClass('tour-tut-4-element');},200); 
			if(current_tut_step=='9')
				setTimeout(function(){tutorial_4.goTo(10); jQuery('.step').removeClass('tour-tut-4-element');},200); 
			}
		);
	
	jQuery(document).on('keyup',".tut-4 .nf_multi_step_1 input[name='multi_step_name']",
		function()
			{
			if(jQuery(this).val()=='Personal Details')
				{
				tutorial_4.goTo(4)
				jQuery('.tour-tut-4-element').removeClass('tour-tut-4-element');
				}
			}
		);
	jQuery(document).on('keyup',".tut-4 .nf_multi_step_2 input[name='multi_step_name']",
		function()
			{
			if(jQuery(this).val()=='Contact Info')
				{
				tutorial_4.goTo(7)
				jQuery('.tour-tut-4-element').removeClass('tour-tut-4-element');
				}
			}
		);
	jQuery(document).on('keyup',".tut-4 .nf_multi_step_3 input[name='multi_step_name']",
		function()
			{
			if(jQuery(this).val()=='Query'){
				tutorial_4.goTo(11)
				jQuery('.tour-tut-4-element').removeClass('tour-tut-4-element');
				}
			}
		);
	jQuery(document).on('click','.tut-4 .nf_multi_step_3 .nex_prev_steps .grid_input_holder:last-child .button_fields',
		function()
			{
			setTimeout(function(){tutorial_4.goTo(13);},300); 
			}
		);
	jQuery(document).on('keyup',".tut-4 #set_button_val",
		function()
			{
			if(jQuery(this).val()=='Submit')
				tutorial_4.goTo(14)
			}
		);	
		
		
		
	if(jQuery("#tut_id").text() && jQuery("#tut_id").text()!='0')
		{
		jQuery('a.tut-'+jQuery("#tut_id").text()).trigger('click')
		}	
		
	}
);


