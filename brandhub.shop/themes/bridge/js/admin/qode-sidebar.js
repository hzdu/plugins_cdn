
(function($){
	var QodeSidebar = function(){

		this.is_block_widget = $('.widget-liquid-right').length ? false : true;
		this.widget_wrap = $('.widget-liquid-right, .block-editor-writing-flow');
		this.widget_area = $('#widgets-right');
		this.widget_add  = $('#qode-add-widget');

		this.create_form();

		if( this.is_block_widget ) {
			this.add_del_button();
		} else {
			this.add_del_button_legacy();
		}

		this.bind_events();

	};
	
	QodeSidebar.prototype = {

		create_form: function(){
			this.widget_wrap.append(this.widget_add.html());
			this.widget_name = this.widget_wrap.find('input[name="qode-sidebar-widgets"]');
			this.nonce = this.widget_wrap.find('input[name="qode-delete-sidebar"]').val();   
		},

		add_del_button: function(){
			var wrapper = this.widget_wrap.find('[data-widget-area-id*="qode-custom-sidebar-"]');

			if(wrapper.length) {
				wrapper.parents('.wp-block-widget-area').parent().append('<span class="qode-delete-button"></span>');
			}
		},

		add_del_button_legacy: function(){
			var wrapper = this.widget_wrap.find('.sidebar-qode-custom');

			if( wrapper.length ) {
				wrapper.append('<span class="qode-delete-button"></span>');
			}
		},

		bind_events: function(){
			this.widget_wrap.on('click', '.qode-delete-button', $.proxy( this.delete_sidebar, this));

		},

		delete_sidebar: function(e){
			var responseClick = confirm('Are you sure you want to delete this?');
			if (responseClick !== true) {
				return false;
			}

			var widget,
				title,
				widget_name,
				obj = this;

			if( this.is_block_widget ) {
				widget = $(e.currentTarget).parent();
				title = widget.find('[data-widget-area-id*="qode-custom-sidebar-"]');
				widget_name = $.trim(title.data('widget-area-id').replace('qode-custom-sidebar-', ''));
			} else {
				widget = $(e.currentTarget).parents('.widgets-holder-wrap:eq(0)');
				title = widget.find('.sidebar-name h2');
				widget_name = $.trim(title.text());
			}

			$.ajax({
				type: "POST",
				url: window.ajaxurl,
				data: {
					action: 'qode_ajax_delete_custom_sidebar',
					name: widget_name,
					_wpnonce: obj.nonce
				},
				success: function( response ){
					if( response == 'sidebar-deleted' ){
						widget.slideUp(200, function(){
							$('.widget-control-remove', widget).trigger('click'); //delete all widgets inside
							widget.remove();
						});
					}
				}
			});
		}

	};

	$(function()
	{
		setTimeout(function(){
			new QodeSidebar();
		}, 3000);
	});
	
})(jQuery);
