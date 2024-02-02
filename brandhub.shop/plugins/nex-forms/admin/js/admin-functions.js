'use strict';
(function($){

	//
	// Private classes
	//

	function CollisionCoords( proto, containment )
	{
		if( ! proto )
		{
			// default if nothing else:
			this.x1 = this.y1 = this.x2 = this.y2 = 0;
			this.proto = null;
		}
		else if( "offset" in proto )
		{
			// used to grab stuff from a jquery object
			// if it has collision-coordinates data, use that
			// otherwise just pull in the offset

			var d = proto.data("jquery-collision-coordinates");
			if( d )
			{
				this.x1 = d.x1;
				this.y1 = d.y1;
				this.x2 = d.x2;
				this.y2 = d.y2;
			}
			else if( containment && containment.length && containment.length >= 4 )
			{
				this.x1 = containment[0];
				this.y1 = containment[1];
				this.x2 = containment[2]+proto.outerWidth(true);
				this.y2 = containment[3]+proto.outerHeight(true);
			}
			else if( proto.parent().length <= 0 )
			{
				this.x1 = parseInt(proto.css("left"  )) || 0;
				this.y1 = parseInt(proto.css("top"   )) || 0;
				this.x2 = parseInt(proto.css("width" )) || 0;
				this.y2 = parseInt(proto.css("height")) || 0;
				this.x2 += this.x1;
				this.x2 += (parseInt(proto.css("margin-left"))||0) + (parseInt(proto.css("border-left"))||0) + (parseInt(proto.css("padding-left"))||0) + 
									 (parseInt(proto.css("padding-right"))||0) + (parseInt(proto.css("border-right"))||0) + (parseInt(proto.css("margin-right"))||0);
				this.y2 += this.y1;
				this.y2 += (parseInt(proto.css("margin-top"))||0) + (parseInt(proto.css("border-top"))||0) + (parseInt(proto.css("padding-top"))||0) + 
									 (parseInt(proto.css("padding-bottom"))||0) + (parseInt(proto.css("border-bottom"))||0) + (parseInt(proto.css("margin-bottom"))||0);
			}
			else
			{
				var o = proto.offset();
				this.x1 = o.left - (parseInt(proto.css("margin-left"))||0); // not also border -- offset starts from inside margin but outside border
				this.y1 = o.top  - (parseInt(proto.css("margin-top" ))||0); // not also border -- offset starts from inside margin but outside border
				this.x2 = this.x1 + proto.outerWidth(true);
				this.y2 = this.y1 + proto.outerHeight(true);
			}
			this.proto = proto;
		}
		else if( "x1" in proto )
		{
			// used to effectively "clone"
			this.x1 = proto.x1;
			this.y1 = proto.y1;
			this.x2 = proto.x2;
			this.y2 = proto.y2;
			this.proto = proto;
		}

		if( "dir" in proto )
		{
			this.dir = proto.dir;
		}
	}
	
	CollisionCoords.prototype.innerContainer = function()
	{
		var clone = new CollisionCoords( this );
		if( this.proto["css"] )
		{
			clone.x1 += parseInt( this.proto.css( "margin-left"  ) ) || 0;
			clone.x1 += parseInt( this.proto.css( "border-left"  ) ) || 0;
			clone.x1 += parseInt( this.proto.css("padding-left"  ) ) || 0;
			clone.x2 -= parseInt( this.proto.css("padding-right" ) ) || 0;
			clone.x2 -= parseInt( this.proto.css( "border-right" ) ) || 0;
			clone.x2 -= parseInt( this.proto.css( "margin-right" ) ) || 0;
			clone.y1 += parseInt( this.proto.css( "margin-top"   ) ) || 0;
			clone.y1 += parseInt( this.proto.css( "border-top"   ) ) || 0;
			clone.y1 += parseInt( this.proto.css("padding-top"   ) ) || 0;
			clone.y2 -= parseInt( this.proto.css("padding-bottom") ) || 0;
			clone.y2 -= parseInt( this.proto.css( "border-bottom") ) || 0;
			clone.y2 -= parseInt( this.proto.css( "margin-bottom") ) || 0;
		}
		return clone;
	}

	CollisionCoords.prototype.move = function( dx, dy )
	{
		this.x1 += dx;
		this.x2 += dx;
		this.y1 += dy;
		this.y2 += dy;
		return this;
	};
	
	CollisionCoords.prototype.update = function( obj )
	{
		if( "x1" in obj ) this.x1 = obj["x1"];
		if( "x2" in obj ) this.x1 = obj["x2"];
		if( "y1" in obj ) this.x1 = obj["y1"];
		if( "y2" in obj ) this.x1 = obj["y2"];
		if( "left" in obj )
		{
			var w = this.x2-this.x1;
			this.x1 = obj["left"];
			this.x2 = this.x1 + w;
		}
		if( "top" in obj )
		{
			var h = this.y2-this.y1;
			this.y1 = obj["top"];
			this.y2 = this.y1 + h;
		}
		if( "offset" in obj )
		{
			var o = obj.offset();
			this.update( o );
			this.x2 = this.x1 + obj.width();
			this.y2 = this.y1 + obj.height();
		}
		if( "dir" in obj ) this.x1 = obj["dir"];
		return this;
	};
	
	CollisionCoords.prototype.width   = function() { return ( this.x2 - this.x1 );     };
	CollisionCoords.prototype.height  = function() { return ( this.y2 - this.y1 );     };
	CollisionCoords.prototype.centerx = function() { return ( this.x1 + this.x2 ) / 2; };
	CollisionCoords.prototype.centery = function() { return ( this.y1 + this.y2 ) / 2; };

	
	CollisionCoords.prototype.toString = function()
	{
		return ( this.proto["get"] ? "#"+this.proto.get(0).id : "" ) + "["+[this.x1,this.y1,this.x2,this.y2].join(",")+"]";
	};
	
	// the big mistake in a lot of collision-detectors,
	// make floating-point arithmetic work for you, not against you:
	CollisionCoords.EPSILON = 0.001;
	
	CollisionCoords.prototype.containsPoint = function( x, y, inclusive )
	{
		if( ! inclusive ) inclusive = false;
		var epsilon = ( inclusive ? -1 : +1 ) * CollisionCoords.EPSILON;
		if( ( x > ( this.x1 + epsilon ) && x < ( this.x2 - epsilon ) ) &&
				( y > ( this.y1 + epsilon ) && y < ( this.y2 - epsilon ) )    )
			return true;
		else
			return false;
	};
	
	CollisionCoords.prototype.overlaps = function( other, inclusive )
	{
		var hit = this._overlaps( other, inclusive );
		if( hit.length > 0 ) return hit;
				hit = other._overlaps( this, inclusive );
		if( hit.length > 0 )
		{
			hit[0].dir = hit[0].dir == "Inside"  ? "Outside" :
									 hit[0].dir == "Outside" ? "Inside"  :
									 hit[0].dir == "N"       ? "S"       :
									 hit[0].dir == "S"       ? "N"       :
									 hit[0].dir == "W"       ? "E"       :
									 hit[0].dir == "E"       ? "W"       :
									 hit[0].dir == "NE"      ? "SW"      :
									 hit[0].dir == "SW"      ? "NE"      :
									 hit[0].dir == "SE"      ? "NW"      :
									 hit[0].dir == "NW"      ? "SE"      :
																						 undefined;
		}
		return hit || [];
	}

	CollisionCoords.prototype._overlaps = function( other, inclusive )
	{
		var c1 = other;
		var c2 = this;
		if( ! inclusive ) inclusive = false;
		var ax = c1.centerx();
		var ay = c1.centery();
		// nine points to check whether they're in e2: e1's four corners, e1's center-sides, and e1's center
		// if center of e1 is within e2, there's some kind of total inclusion
		var points = [ [c1.x1,c1.y1,"SE"], [c1.x2,c1.y1,"SW"], [c1.x2,c1.y2,"NW"], [c1.x1,c1.y2,"NE"], [ax,c1.y1,"S"], [c1.x2,ay,"W"], [ax,c1.y2,"N"], [c1.x1,ay,"E"], [ax,ay,undefined] ];
		var hit    = null;
		var dirs   = { NW:false, N:false, NE:false, E:false, SE:false, S:false, SW:false, W:false };
		for( var i=0; i<points.length; i++ )
		{
			if( this.containsPoint( points[i][0], points[i][1], inclusive ) )
			{
				if( points[i][2] ) dirs[points[i][2]] = true;
				if( hit ) continue; // don't need to make another one - it'll be the same anyways //
				hit = [ new CollisionCoords( { x1: Math.max(c1.x1,c2.x1), y1: Math.max(c1.y1,c2.y1),
																			 x2: Math.min(c1.x2,c2.x2), y2: Math.min(c1.y2,c2.y2), dir: points[i][2]  } ) ];
			}
		}
		if( hit )
		{
			if( dirs["NW"] && dirs["NE"] ) hit[0].dir = "N";
			if( dirs["NE"] && dirs["SE"] ) hit[0].dir = "E";
			if( dirs["SE"] && dirs["SW"] ) hit[0].dir = "S";
			if( dirs["SW"] && dirs["NW"] ) hit[0].dir = "W";
			if( dirs["NW"] && dirs["NE"] &&
					dirs["SE"] && dirs["SW"] ) hit[0].dir = "Outside";
			if( !dirs["NW"] && !dirs["NE"] &&
					!dirs["SE"] && !dirs["SW"] &&
					!dirs["N"] && !dirs["E"] &&
					!dirs["S"] && !dirs["W"] ) hit[0].dir = "Inside";
		}
		return hit || [];
	};
	
	CollisionCoords.prototype._protrusion = function( area, dir, list )
	{
		var o = this.overlaps( new CollisionCoords( area ), false );
		if( o.length <= 0 ) return list;
		o[0].dir = dir;
		list.push( o[0] );
		return list;
	};

	CollisionCoords.prototype.protrusions = function( container )
	{
		var list = [];
		var n    = Number.NEGATIVE_INFINITY;
		var p    = Number.POSITIVE_INFINITY;
		var l    = container.x1;
		var r    = container.x2;
		var t    = container.y1;
		var b    = container.y2;
		list = this._protrusion( { x1:l, y1:n, x2:r, y2:t }, "N" , list );
		list = this._protrusion( { x1:r, y1:n, x2:p, y2:t }, "NE", list );
		list = this._protrusion( { x1:r, y1:t, x2:p, y2:b }, "E" , list );
		list = this._protrusion( { x1:r, y1:b, x2:p, y2:p }, "SE", list );
		list = this._protrusion( { x1:l, y1:b, x2:r, y2:p }, "S" , list );
		list = this._protrusion( { x1:n, y1:b, x2:l, y2:p }, "SW", list );
		list = this._protrusion( { x1:n, y1:t, x2:l, y2:b }, "W" , list );
		list = this._protrusion( { x1:n, y1:n, x2:l, y2:t }, "NW", list );
		return list;
	};
	
	function Collision( targetNode, obstacleNode, overlapCoords, overlapType )
	{
		this.target        = targetNode;
		this.obstacle      = obstacleNode;
		this.overlap       = overlapCoords;
		this.overlapType   = overlapType;
	}
	
	Collision.prototype.distance = function( other )
	{
		var tc = c.target;
		var oc = c.overlap;
		return Math.sqrt( (tc.centerx()-oc.centerx())*(tc.centerx()-oc.centerx()) +
											(tc.centery()-oc.centery())*(tc.centery()-oc.centery())   );
	}

	function CollisionFactory( targets, obstacles, containment )
	{
		this.targets   = targets;
		this.obstacles = obstacles;
		this.collisions = null;
		this.cache      = null;
		if( containment ) this.containment = containment;
		else              this.containment = null;
	}
	
	CollisionFactory.prototype.getCollisions = function( overlapType )
	{
		if( this.collisions !== null ) return this.collisions;
		this.cache = {};
		this.collisions = [];
		// note: doesn't do any dup-detection, so if you ask if something collides with
		// itself, it will!
		if( ! overlapType ) overlapType = "collision";
		if( overlapType != "collision" && overlapType != "protrusion" ) return [];
		var c = [];
		var t = this.targets;  
		var o = this.obstacles;
		for( var ti=0; ti<t.length; ti++ )
		{
			var tc = t[ti];
			for( var oi=0; oi<o.length; oi++ )
			{
				var oc = o[oi];
				var ol = ( (overlapType=="collision") ? tc.overlaps( oc ) : tc.protrusions( oc.innerContainer() ) );
				for( var oli=0; oli<ol.length; oli++ )
				{
					c.push( new Collision( t[ti], o[oi], ol[oli], overlapType ) );
				}
			}
		}
		this.collisions = c;
		return c;
	};

	//
	// Setup
	//
	
	function makeCoordsArray( j )
	{
		return $(j).get().map(function(e,i,a){ return new CollisionCoords( $(e) ); });
	}

	function combineQueries( array )
	{
		var j = $();
		for( var i=0; i<array.length; i++ )
		{
			j=j.add( array[i] );
		}
		return j;
	}

	$.fn.collision = function( selector, options )
	{
		if( ! options ) options = {};
		var mode = "collision";
		var as   = null;
		var cd   = null;
		var od   = null;
		var dd   = null;
		var rel  = "body"; // can be "body" (default), "collider", "obstacle", or a selector
		if( options.mode == "protrusion" ) mode = options.mode;
		if( options.as                   ) as   = options.as;
		if( options.colliderData         ) cd   = options.colliderData;
		if( options.obstacleData         ) od   = options.obstacleData;
		if( options.directionData        ) dd   = options.directionData;
		if( options.relative             ) rel  = options.relative;
		var cf = new CollisionFactory( makeCoordsArray(this), makeCoordsArray(selector) );
		var ov = cf.getCollisions( mode );
		var array;
		// if no "as", then just the jquery object that we collided with
		// but if there's as="<div/>", then make div's out of the overlaps
		if( ! as ) array = $.map( ov, function(e,i,a){ return e.obstacle.proto; } );
		else       array = $.map( ov, function(e,i,a){ var xoff = e.overlap.x1;
		var yoff = e.overlap.y1;
		if( rel && rel != "body" ) 
		{ 
		var r = rel == "collider" ? $(e.target.proto) :
						rel == "obstacle" ? $(e.obstacle.proto) :
																$(rel);
		if( r.length>0 ) 
		{ 
			var roff = r.offset();
			xoff -= roff.left;
			yoff -= roff.top;
		}
		}
		var c = $(as).offset( { left: xoff, top: yoff } )
							 .width(  e.overlap.width() )
							 .height( e.overlap.height() );
		if( cd ) c.data(cd, $(e.target.proto));
		if( od ) c.data(od, $(e.obstacle.proto));
		if( dd && e.overlap.dir ) c.data(dd, e.overlap.dir);
		return c;
		} );
		return combineQueries( array );
	};

})(jQuery);

jQuery(document).ready(
function()
	{
		
	jQuery('input').each( function()
		{
		var val = jQuery(this).val();
		val = val.replace( /<script[^>]*>/gi, '');
		val = val.replace( /<\/script>/gi, '');
		jQuery(this).val(val)
		}
	);		
	jQuery('textarea').each( function()
		{
		var val = jQuery(this).val();
		val = val.replace( /<script[^>]*>/gi, '');
		val = val.replace( /<\/script>/gi, '');
		jQuery(this).val(val)
		}
	);	
		
	jQuery( document ).on( 'click', '.dismiss_nf_notice .notice-dismiss, .dismiss_nf_notice button', function() {
		var data = {
				action: 'dismiss_nf_notice',
		};
		
			jQuery(this).closest('.notice').remove();
			
		jQuery.post( ajaxurl, data, function() {
			
		});
	})
	jQuery(document).on('click','.new-form-sidebar a',
			function()
				{
				jQuery('.new-form-sidebar li').removeClass('active');
				jQuery(this).parent().addClass('active');
				
				jQuery('.new-form-panel').removeClass('active');
				jQuery('.new-form-panel.'+jQuery(this).attr('data-panel')).addClass('active');

				jQuery('#new_form_setup .sub-heading').html(jQuery(this).attr('data-sub-heading'));

				}
			);

		jQuery(document).on('click','.load_template',
			function()
				{
				var get_template = jQuery(this);
				jQuery('.new-form-panel').removeClass('active');
				jQuery('.new-form-panel.ajax_loading').addClass('active');
				var data =
					{
					action	 						: 'load_template',
					template						: get_template.attr('data-template-name'),
					template_dir					: get_template.attr('data-template-dir'),
					};
				jQuery.post
					(
					ajaxurl, data, function(response)
						{
						
						var url = jQuery('.admin_url').text() + 'admin.php?page=nex-forms-builder&open_form=' + response;
						
						if(get_template.attr('data-is-tut')=='true')
							url = jQuery('.admin_url').text() + 'admin.php?page=nex-forms-builder&open_form=' + response +'&tut='+get_template.attr('data-tut-num');
							
						jQuery(location).attr('href',url);
						}
					);
				}
			);
		
		
	jQuery(document).on('click','#upload_form,#upload_form2',
			function()
				{
				jQuery('input[name="form_html"]').trigger('click');
				}
			);
		
	jQuery(document).on('change','input[name="form_html"]',
			function()
				{
				jQuery('#import_form').submit();
				jQuery('input[name="form_name"]').val('');
				jQuery('#nex-forms #form_update_id').text('');
				jQuery('.nex-forms-container').html('');
				jQuery('.open-form').removeClass('active');	
				jQuery('.center_panel').hide();
				}
		)
	if(typeof jQuery({}).ajaxForm == 'function')
		{
		jQuery('#import_form').ajaxForm({
			data: {
			   action: 'do_form_import'
			},
			beforeSubmit: function(formData, jqForm, options) {
				jQuery('div.nex-forms-container').html('<div class="loading"><i class="fa fa-circle-o-notch fa-spin"></i></div>');
				
				jQuery('.new-form-panel').removeClass('active');
				jQuery('.new-form-panel.ajax_loading').addClass('active');
			},
		   success : function(responseText, statusText, xhr, $form) {
			   	
				//console.log(responseText);
					if(!responseText || responseText=='0' || responseText==0)
						{
						jQuery('.ajax_error_response').addClass('active');
						}
					else
						{
						var url = jQuery('.admin_url').text() + 'admin.php?page=nex-forms-builder&open_form=' + responseText;
						jQuery(location).attr('href',url);
						}
					
			},
			 error: function(jqXHR, textStatus, errorThrown)
				{
				console.log(errorThrown)
				}
		});	
		}
	if(typeof jQuery({}).ajaxForm == 'function')
		{
		jQuery('#manual_import_form').ajaxForm({
				data: {
				   action: 'do_form_import',
				   import_type: 'manual'
				},
				beforeSubmit: function(formData, jqForm, options) {
					jQuery('.new-form-panel').removeClass('active');
					jQuery('.new-form-panel.ajax_loading').addClass('active');
				},
			   success : function(responseText, statusText, xhr, $form) {
					
					if(!responseText || responseText=='0' || responseText==0)
						{
						jQuery('.ajax_error_response').addClass('active');
						}
					else
						{
						var url = jQuery('.admin_url').text() + 'admin.php?page=nex-forms-builder&open_form=' + responseText;
						jQuery(location).attr('href',url);
						}
					
				},
				 error: function(jqXHR, textStatus, errorThrown)
					{
					console.log(errorThrown)
					}
			});	
		}
	if(typeof jQuery({}).ajaxForm == 'function')
		{
		jQuery('#new_nex_form').ajaxForm({
				data: {
				   action: 'nf_insert_record',
				   table: 'wap_nex_forms',
				   is_form: 1,
				   is_template: 0
				},
				beforeSubmit: function(formData, jqForm, options) {
					jQuery('.new-form-panel').removeClass('active');
					jQuery('.new-form-panel.ajax_loading').addClass('active');
				},
			   success : function(responseText, statusText, xhr, $form) {
				  
				 jQuery(location).attr('href',jQuery('#siteurl').text()+'/wp-admin/admin.php?page=nex-forms-builder&open_form=' + responseText)
				},
				 error: function(jqXHR, textStatus, errorThrown)
					{
					console.log(errorThrown)
					}
			});	
		}
	jQuery(document).on('click','.create_new_form, .create_new_form_home',
		function()
			{
			jQuery('#new_form_setup').modal('open');
			}
		);
	
	
	/*jQuery(document).on('click','.add-new-column',
		function()
			{
				var column = jQuery(this).closest('.grid_input_holder');
				var column_clone = column.clone();
				var panel = column_clone.find('.panel-body');
				panel.html('');
				
				create_droppable(panel)
				
				column_clone.insertAfter(column);
				
		
			}
		);*/
	jQuery(document).on('click','.add-new-column',
		function()
			{
				
		
				var grid = jQuery(this).closest('.form_field');
				var grid_class = '.id-'+grid.attr('id');
				var column = jQuery(this).closest('.grid_input_holder'+grid_class);
				var column_width = parseInt(column.attr('data-grid-width'));
				var column_class = 'sm';
				
				
				
				
				if(strstr(column.attr('class'),'-xs-'))
					column_class = 'xs';
				if(strstr(column.attr('class'),'-md-'))
					column_class = 'md';
				if(strstr(column.attr('class'),'-lg-'))
					column_class = 'lg';
					
					
				var largest_grid = '';
				var largest_grid_size = 1;
				var current_largest_grid = 0;
				var prev_largest_grid = 0;
				var get_grid_total =0;
				
				grid.find('.grid_input_holder'+grid_class).each(
					function()
						{
						current_largest_grid = parseInt(jQuery(this).attr('data-grid-width'));
						if(current_largest_grid > prev_largest_grid)
							{	
							largest_grid_size = current_largest_grid;	
							prev_largest_grid = current_largest_grid;
							}
						get_grid_total += parseInt(jQuery(this).attr('data-grid-width'));
						}
					);
				
				if(largest_grid_size>1)
					{
					if(column_width==1)
						{
							var column_clone = column.clone();
							var panel = column_clone.find('.panel-body');
							var set_size = largest_grid_size-1;
							largest_grid = grid.find('.grid_input_holder.col-'+column_class+'-'+largest_grid_size+grid_class).first();
							

							if(set_size==1)
								set_size = '1';
							for(var i=0;i<=12;i++)
								largest_grid.removeClass('col-'+column_class+'-'+i);
								
							
								largest_grid.addClass('col-'+column_class+'-'+set_size);
								largest_grid.attr('data-grid-width',set_size);
							
							column_clone.addClass('col-'+column_class+'-1');
							column_clone.attr('data-grid-width','1');
		
							if(jQuery(this).hasClass('blank-column'))
								panel.html('');
							
							//create_droppable(panel)
							column_clone.insertAfter(column);
							
							nf_setup_grid(grid);
							grid.find('.grid').each(
								function()
									{
									nf_setup_grid(jQuery(this));	
									}
								);
							
							
				
						}
					else
						{
					
						for(var i=0;i<=12;i++)
							column.removeClass('col-'+column_class+'-'+i);
						
					
					
						var column_clone = column.clone();
						var panel = column_clone.find('.panel-body');
						
						
					
						if((column_width-1)>0)
							{
							column.addClass('col-'+column_class+'-'+(column_width-1));
							column.attr('data-grid-width',(column_width-1))
							}
						else
							{
							column.addClass('col-'+column_class+'-1');
							column.attr('data-grid-width','1')	
							}
							
						column_clone.addClass('col-'+column_class+'-1');
						column_clone.attr('data-grid-width','1');
	
						if(jQuery(this).hasClass('blank-column'))
							panel.html('');
						
						
						column_clone.insertAfter(column);
						
						nf_setup_grid(grid);
						grid.find('.grid').each(
							function()
								{
								nf_setup_grid(jQuery(this));	
								}
							);
						
						
			
						
						}
					}
					
						
				var panels = jQuery('.form_canvas .panel-body');
				create_droppable(panels)
				
				if(jQuery('.form-canvas-area').hasClass('split_view'))
					{
					setTimeout(function() {nf_save_nex_form('','preview', '') },300);
					}
					
				}
			
		);
	
	jQuery(document).on('click','.delete-column',
		function()
			{
				var grid = jQuery(this).closest('.form_field');
				var column = jQuery(this).closest('.grid_input_holder');
				var column_width = parseInt(column.attr('data-grid-width'));
				
				var column_class = 'sm';
				if(strstr(column.attr('class'),'-xs-'))
					column_class = 'xs';
				if(strstr(column.attr('class'),'-md-'))
					column_class = 'md';
				if(strstr(column.attr('class'),'-lg-'))
					column_class = 'lg';
				
				
				
				
				var grid_num = parseInt(column.attr('data-grid-num'));
				
				
				
				if(grid_num!=0)
					{
					var prev_column = column.prev('.grid_input_holder'); 
					var prev_column_width = parseInt(prev_column.attr('data-grid-width'));
					for(var i=0;i<=12;i++)
						prev_column.removeClass('col-'+column_class+'-'+i);
						
					prev_column.addClass('col-'+column_class+'-'+(prev_column_width+column_width));
					prev_column.attr('data-grid-width',(prev_column_width+column_width))
					}
				else
					{
					var next_column = column.next('.grid_input_holder'); 
					var next_column_width = parseInt(next_column.attr('data-grid-width'));
					for(var i=0;i<=12;i++)
						next_column.removeClass('col-'+column_class+'-'+i);
						
					next_column.addClass('col-'+column_class+'-'+(next_column_width+column_width));
					next_column.attr('data-grid-width',(next_column_width+column_width))	
					}
				
				column.remove();
				
				
				
				nf_setup_grid(grid);
				
				grid.find('.grid').each(
					function()
						{
						nf_setup_grid(jQuery(this));	
						}
					);
				
				if(jQuery('.form-canvas-area').hasClass('split_view'))
					{
					setTimeout(function() {nf_save_nex_form('','preview', '') },300);
					}
		
			}
		);
	
	

	
	jQuery(document).on('mouseenter','.tab-pane',function() {
	    jQuery(this).closest('.step').addClass('over-step');
	});
	jQuery(document).on('mouseleave','.tab-pane',function() {
	   jQuery(this).closest('.step').removeClass('over-step');
	});
	
	
	
	jQuery(document).on('mouseenter','.settings-column-style, .popover',function() {
	  jQuery('.form_canvas').addClass('out-of-focus');
	});
	jQuery(document).on('mouseleave','.settings-column-style, .popover',function() {
	  setTimeout(function(){ jQuery('.form_canvas').removeClass('out-of-focus')}, 1000);
	});
	
	jQuery(document).on('mouseover','.edit_mask',function() {
	  jQuery(this).closest('.form_field').find('.field_settings').toggleClass('over-mask');
	});
	jQuery(document).on('mouseout','.edit_mask',function() {
	  jQuery(this).closest('.form_field').find('.field_settings').toggleClass('over-mask');
	});
	
	
	jQuery(document).on('mouseover','.field_settings .btn.delete',function() {
	  jQuery(this).closest('.form_field').toggleClass('over-delete');
	});
	jQuery(document).on('mouseout','.field_settings .btn.delete',function() {
	  jQuery(this).closest('.form_field').toggleClass('over-delete');
	});
	
	
	jQuery(document).on('mouseenter','.outer-container',function() {
	  jQuery(this).addClass('over-form');
	});
	jQuery(document).on('mouseleave','.outer-container',function() {
	  jQuery(this).removeClass('over-form');
	});
	
	
	jQuery(document).on('mouseover','.delete-column',function() {
	  jQuery(this).closest('.grid_input_holder').find('.panel').toggleClass('over-delete');
	});
	jQuery(document).on('mouseout','.delete-column',function() {
	  jQuery(this).closest('.grid_input_holder').find('.panel').toggleClass('over-delete');
	});
	
	jQuery(document).on('mouseover','.grid_input_holder',function() {
	  jQuery(this).toggleClass('over-column-tools');
	});
	jQuery(document).on('mouseout','.grid_input_holder',function() {
	  jQuery(this).toggleClass('over-column-tools');
	  jQuery('.grid_input_holder').removeClass('over-column-tools');
	});
	
	
	jQuery(document).on('mouseenter','.form-canvas-area .inner-canvas-container:not(.dragging) .form_field:not(.step)',function() {
	  if(jQuery('.form_canvas').hasClass('conditional-logic-opened'))
	  	return;
	  jQuery(this).parents('.form_field').find('.field_settings').addClass('parent-over-field');
	  jQuery(this).find('.field_settings').last().addClass('over-field');
	  jQuery(this).find('.field_settings').last().removeClass('parent-over-field');
	  
	  
	  jQuery(this).parents('.form_field').addClass('set-parent-over-field');
	  jQuery(this).addClass('set-over-field');
	  jQuery(this).removeClass('set-parent-over-field');
	  jQuery('.outer-container').removeClass('over-form');
	  
	});
	
	
	jQuery(document).on('mouseleave','.form-canvas-area .inner-canvas-container:not(.dragging) .form_field',function() {
	  
	  if(jQuery('.form_canvas').hasClass('conditional-logic-opened'))
	  	return;
	  jQuery(this).find('.field_settings').removeClass('over-field');
	  jQuery(this).parent().closest('.form_field').find('.field_settings').removeClass('parent-over-field');
	  
	  jQuery(this).removeClass('set-over-field');
	  jQuery(this).parent().closest('.form_field').removeClass('set-parent-over-field');
	  setTimeout(function(){ jQuery('.outer-container').addClass('over-form');400});
	});
	
	jQuery('div.updated').remove();
	jQuery('.update-nag').remove();
	jQuery('div.error').remove();	
	}
);



function nf_duplicate_field(get_field){
			
			jQuery(get_field.find('.form_field.grid-system')).each(
				function()
					{
					jQuery(this).find('.id-'+jQuery(this).attr('id')).removeClass('id-'+jQuery(this).attr('id'));
					}
				);
			
			var duplication = get_field.clone();
			duplication.find('.edit-done').remove();
			duplication.find('.currently_editing_field').removeClass('currently_editing_field');
			duplication.find('.currently_editing_settings').remove();
			duplication.find('.over-field').removeClass('over-field');
			duplication.find('.parent-over-field').removeClass('parent-over-field');
			//duplication.removeClass('set-over-field');
			//duplication.removeClass('parent-over-field');
			if(duplication.hasClass('date') || duplication.hasClass('time'))
				{
				duplication.find('.bootstrap-datetimepicker-widget').remove();
				setup_form_element(duplication);
				}
			if(duplication.hasClass('field_spacer'))
				{
				duplication.find('.ui-resizable-handle').remove();
				duplication.attr('class','form_field field_spacer');
				duplication.find('.field_spacer').resizable({
				  handles: "s",
				  minHeight: 5,
				  resize: function( event, ui ) {
					  duplication.find('.total_px').text(ui.size['height']);
					  }
				});
				}
			if(duplication.hasClass('html_image'))
				{	
				duplication.find('.the-image-container .ui-resizable-handle').remove();
				duplication.find('.the-image-container img').unwrap();
				var image = duplication.find('.the-image-container');
				var width_display = duplication.find('.show-width');
				var height_display = duplication.find('.show-height');
		
				duplication.find('.the-image-container img').resizable({
				  minHeight: 20,
				  minWidth: 20,
				  resize: function( event, ui ) {
					  image.addClass('resizing');
					  image.css('width',ui.size['width']+'px');
					  image.css('height',ui.size['height']+'px');
					  width_display.text(ui.size['width']+'px');
					  height_display.text(ui.size['height']+'px');
					  
					  if(duplication.hasClass('currently_editing'))
						{
						jQuery('#set_image_width').val(ui.size['width']);
						jQuery('#set_image_height').val(ui.size['height']);
						}
					  
					  },
				  stop: function( event, ui ){
					  image.removeClass('resizing');
				  }
				});
				}

			duplication.attr('id','_' + Math.round(Math.random()*99999));
			duplication.find('.form_field').each(
				function()
					{
					jQuery(this).attr('id','_' + Math.round(Math.random()*99999));
					}
				);
			duplication.removeClass('currently_editing');

			
			if(get_field.hasClass('grid-system'))
				{
				
				duplication.find('.id-'+get_field.attr('id')).removeClass('id-'+get_field.attr('id'));
				nf_setup_grid(duplication);
				
				jQuery(duplication.find('.grid-system')).each(
					function()
						{
						nf_setup_grid(jQuery(this));	
						}
					);
					
				jQuery(get_field.find('.grid-system')).each(
					function()
						{
						nf_setup_grid(jQuery(this));		
						}
					);	

				}
	return duplication;
}

function run_batch_sim_select(field_obj){
	//console.log('ran batch sim - ' + field_obj.attr('class'));
	if(field_obj.hasClass('icon-select-group'))
		{
		jQuery('.nex-forms-container').find('.icon-select-group').addClass('batch_edit').addClass('batch_edit_sim')
		}
	if(field_obj.hasClass('digital-signature'))
		{
		jQuery('.nex-forms-container').find('.form_field.digital-signature').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('preset_fields'))
		{
		jQuery('.nex-forms-container').find('.form_field.text').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('textarea') || field_obj.hasClass('Query'))
		{
		jQuery('.nex-forms-container').find('.form_field.textarea').addClass('batch_edit').addClass('batch_edit_sim');
		jQuery('.nex-forms-container').find('.form_field.Query').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('text') || field_obj.hasClass('name') || field_obj.hasClass('email') || field_obj.hasClass('phone_number') || field_obj.hasClass('url'))
		{
		jQuery('.nex-forms-container').find('.form_field.text').addClass('batch_edit').addClass('batch_edit_sim');
		jQuery('.nex-forms-container').find('.form_field.name').addClass('batch_edit').addClass('batch_edit_sim');
		jQuery('.nex-forms-container').find('.form_field.email').addClass('batch_edit').addClass('batch_edit_sim');
		jQuery('.nex-forms-container').find('.form_field.phone_number').addClass('batch_edit').addClass('batch_edit_sim');
		jQuery('.nex-forms-container').find('.form_field.url').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('password'))
		{
		jQuery('.nex-forms-container').find('.form_field.password').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('select'))
		{
		jQuery('.nex-forms-container').find('.form_field.select').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('multi-select'))
		{
		jQuery('.nex-forms-container').find('.form_field.multi-select').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('radio-group'))
		{
		jQuery('.nex-forms-container').find('.form_field.radio-group').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('check-group'))
		{
		jQuery('.nex-forms-container').find('.form_field.check-group').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('single-image-select-group'))
		{
		jQuery('.nex-forms-container').find('.form_field.single-image-select-group').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('multi-image-select-group'))
		{
		jQuery('.nex-forms-container').find('.form_field.multi-image-select-group').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('image-choices-field'))
		{
		jQuery('.nex-forms-container').find('.form_field.image-choices-field').addClass('batch_edit').addClass('batch_edit_sim');
		}	
	
	
	if(field_obj.hasClass('slider') || field_obj.hasClass('md-slider'))
		{
		jQuery('.nex-forms-container').find('.form_field.slider').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('touch_spinner'))
		{
		jQuery('.nex-forms-container').find('.form_field.touch_spinner').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('autocomplete'))
		{
		jQuery('.nex-forms-container').find('.form_field.autocomplete').addClass('batch_edit').addClass('batch_edit_sim');
		}	
	if(field_obj.hasClass('tags'))
		{
		jQuery('.nex-forms-container').find('.form_field.tags').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('date') || field_obj.hasClass('md-datepicker') || field_obj.hasClass('jq-datepicker'))
		{
		jQuery('.nex-forms-container').find('.form_field.date').addClass('batch_edit').addClass('batch_edit_sim');
		jQuery('.nex-forms-container').find('.form_field.md-datepicker').addClass('batch_edit').addClass('batch_edit_sim');
		}	
	if(field_obj.hasClass('time') || field_obj.hasClass('md-time-picker') || field_obj.hasClass('jq-time-picker'))
		{
		jQuery('.nex-forms-container').find('.form_field.time').addClass('batch_edit').addClass('batch_edit_sim');
		jQuery('.nex-forms-container').find('.form_field.md-time-picker').addClass('batch_edit').addClass('batch_edit_sim');
		}	
	if(field_obj.hasClass('star-rating'))
		{
		jQuery('.nex-forms-container').find('.form_field.star-rating').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('thumb-rating'))
		{
		jQuery('.nex-forms-container').find('.form_field.thumb-rating').addClass('batch_edit').addClass('batch_edit_sim');
		}	
	if(field_obj.hasClass('smily-rating'))
		{
		jQuery('.nex-forms-container').find('.form_field.smily-rating').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('upload-multi'))
		{
		jQuery('.nex-forms-container').find('.form_field.upload-multi').addClass('batch_edit').addClass('batch_edit_sim');
		}	
	if(field_obj.hasClass('upload-single'))
		{
		jQuery('.nex-forms-container').find('.form_field.upload-single').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('upload-image'))
		{
		jQuery('.nex-forms-container').find('.form_field.upload-image').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('submit-button') || field_obj.hasClass('submit-button-2'))
		{
		jQuery('.nex-forms-container').find('.form_field.submit-button').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('submit-button') || field_obj.hasClass('submit-button-2'))
		{
		jQuery('.nex-forms-container').find('.form_field.submit-button').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('submit-button') || field_obj.hasClass('submit-button-2'))
		{
		jQuery('.nex-forms-container').find('.form_field.submit-button').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('html_image'))
		{
		jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').find('.form_field.html_image').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('heading'))
		{
		jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').find('.form_field.heading').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('math_logic'))
		{
		jQuery('.nex-forms-container').find('.form_field.math_logic').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('paragraph'))
		{
		jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').find('.form_field.paragraph').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('html'))
		{
		jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').find('.form_field.html').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('divider'))
		{
		jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').find('.form_field.divider').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('is_panel'))
		{
		jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').find('.form_field.is_panel').addClass('batch_edit').addClass('batch_edit_sim');
		}
	if(field_obj.hasClass('grid-system'))
		{
		jQuery(jQuery('.form-canvas-area').attr('data-sec-pre-class')+' .inner-canvas-container').find('.form_field.grid-system').addClass('batch_edit').addClass('batch_edit_sim');
		}
	
	
}
function nf_save_state(action){
	
	console.log('State saved - '+ action);
	
	

		if(action=='undo')
			{
			jQuery('.undo').html(jQuery('.nex-forms-container').html());
			var get_state = jQuery('.undo');
			get_state.find('#editing_text').remove();
			get_state.find('.over-field').removeClass('over-field');
			//get_state.find('.batch_edit').removeClass('batch_edit');
			get_state.find('.over-delete').removeClass('over-delete');
			get_state.find('.set-over-field').removeClass('set-over-field');
			get_state.find('.new_item').removeClass('new_item');
			
			get_state.find('.form_field').each(
			function()
				{
				var get_id = jQuery(this).attr('id');	
				jQuery(this).attr('data-id', get_id)
				jQuery(this).removeAttr('id')
				}
			);
			jQuery('.history_action.do_undo').addClass('avialable');
			}
		if(action=='redo')
			{
			jQuery('.redo').html(jQuery('.nex-forms-container').html());
			var get_state = jQuery('.redo');
			get_state.find('#editing_text').remove();
			get_state.find('.over-field').removeClass('over-field');
			//get_state.find('.batch_edit').removeClass('batch_edit');
			get_state.find('.over-delete').removeClass('over-delete');
			get_state.find('.set-over-field').removeClass('set-over-field');
			get_state.find('.new_item').removeClass('new_item');
			
			get_state.find('.form_field').each(
			function()
				{
				var get_id = jQuery(this).attr('id');	
				jQuery(this).attr('data-id', get_id)
				jQuery(this).removeAttr('id')
				}
			);
			jQuery('.history_action.do_redo').addClass('avialable');
			}
}
function unformat_name(input_value){
	if(!input_value)
		return;
	
	//var new_value = input_value;
	var new_value = input_value.replace(/_/g,' ')
	new_value = new_value.replace('[','')
	new_value = new_value.replace(']','')
	
	return new_value;
}
function format_illegal_chars(input_value){
	
	if(!input_value)
		return;
	
	input_value = input_value.toLowerCase();
	input_value = input_value.replace(/<(.|\n)*?>/g, '');
	
	if(input_value=='name' || input_value=='page' || input_value=='post' || input_value=='id')
		input_value = '_'+input_value;
		
	var illigal_chars = '"+=!@#$%^&*()*{};<>,.?~`|/\'';
	
	var new_value ='';
	
    for(var i=0;i<input_value.length;i++)
		{
		if (illigal_chars.indexOf(input_value.charAt(i)) != -1)
			{
			input_value.replace(input_value.charAt(i),'');
			}
		else
			{
			if(input_value.charAt(i)==' ')
			new_value += '_';
			else
			new_value += input_value.charAt(i);
			}
		}
	return new_value;	
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

function short_str(str) {
    //if(str)
    //   return str.substring(0, 30);
    return str;
}

function insertAtCaret(areaId,text) {
    var txtarea = document.getElementById(areaId);
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
    	"ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") { 
    	txtarea.focus();
    	var range = document.selection.createRange();
    	range.moveStart ('character', -txtarea.value.length);
    	strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0,strPos);  
    var back = (txtarea.value).substring(strPos,txtarea.value.length); 
    txtarea.value=front+text+back;
    strPos = strPos + text.length;
    if (br == "ie") { 
    	txtarea.focus();
    	var range = document.selection.createRange();
    	range.moveStart ('character', -txtarea.value.length);
    	range.moveStart ('character', strPos);
    	range.moveEnd ('character', 0);
    	range.select();
    }
    else if (br == "ff") {
    	txtarea.selectionStart = strPos;
    	txtarea.selectionEnd = strPos;
    	txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
} 

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function nf_form_modified(modification){	
	jQuery('.check_save').addClass('not_saved');	
	jQuery('.prime_save').find('.ns').remove();	
	jQuery('.prime_save').append('<span class="ns">*</span>');
}
function isNumber(n) {
   if(n!='')
		return !isNaN(parseFloat(n)) && isFinite(n);
	
	return true;
}


function nf_setup_grid(grid){

				
				
				
				
				
				var grid_parent_class_pre = '.id-'+grid.attr('id');
				grid.find('.grid-width-slider').remove();
				grid.find('.column_tools').remove();
				var column_tools = '';
				column_tools += '<div class="column_tools">';

				if(grid.find('.grid_input_holder'+grid_parent_class_pre).length<=0)
					{
					grid_parent_class_pre = '';	
					}
				else
					{
					
					}
					/*column_tools += '<div class="add-new-column title="Duplicate Column"">';
						column_tools += '<span class="fas fa-copy"></span>';
					column_tools += '</div>';*/
					
					column_tools += '<div class="add-new-column blank-column" title="Add Column">';
						column_tools += '<span class="fas fa-plus"></span>';
					column_tools += '</div>';
					column_tools += '<div class="delete-column" title="Delete Column">';
						column_tools += '<span class="fa fa-minus"></span>';
					column_tools += '</div>';
					
				column_tools += '</div>';
				
				
							
				grid.find('.grid_input_holder'+grid_parent_class_pre).each(
					function(index)
						{
						jQuery(this).append(column_tools);
						var grid_parent_class = 'id-'+jQuery(this).closest('.form_field').attr('id');
						var grid_width = jQuery(this).attr('class');
						
						var col_bs_class = 'sm';
						if(strstr(grid_width,'-xs-'))
							col_bs_class = 'xs';
						if(strstr(grid_width,'-md-'))
							col_bs_class = 'md';
						if(strstr(grid_width,'-lg-'))
							col_bs_class = 'lg';
							
						grid_width = grid_width.replace('nex_prev_steps','');
						grid_width = grid_width.replace('grid_input_holder','');
						grid_width = grid_width.replace('dropped','');
						grid_width = grid_width.replace(grid_parent_class,'');
						grid_width = grid_width.replace('over-column-tools','');
						grid_width = grid_width.replace('col-xs-','');
						grid_width = grid_width.replace('col-sm-','');
						grid_width = grid_width.replace('col-md-','');
						grid_width = grid_width.replace('col-lg-','');
					
						for(var i=12;i>=0;i--)
							grid_width = grid_width.replace('grid-target-'+i,'');
						
					
						jQuery(this).attr('data-grid-width', parseInt(grid_width.trim()));
						jQuery(this).attr('data-grid-num',index);
						
						 
						var set_grid_width = parseInt(grid_width.trim())
						if(set_grid_width<1)
							set_grid_width = 1;
						
						jQuery(this).attr('class','grid_input_holder '+grid_parent_class+'  col-'+ col_bs_class +'-'+ set_grid_width +' grid-target-'+index);
						
						grid.prepend('<div class="grid-width-slider '+grid_parent_class+' grid-'+ index +'" data-grid-target="'+ index +'" data-grid-width="'+ set_grid_width +'" data-col-class="'+ col_bs_class +'"></div>');
							
						}
				);
				
				
				
				grid.find('.grid-width-slider').each(
					function(index)
						{
						var grid_class = '.id-'+jQuery(this).closest('.form_field').attr('id');
						
						
						
						var target_num = parseInt(jQuery(this).attr('data-grid-target'));
						var col_class = (jQuery(this).attr('data-col-class')!='') ? jQuery(this).attr('data-col-class') : 'sm';
						
						var slider_start = 0;
						for(var x=(target_num);x>=0;x--)
							{
							slider_start += parseInt(grid.find('.grid-target-'+x).attr('data-grid-width'));
							}
						var get_grid_total = 0;
						var get_grid_before_total = 0;
						
						var target = '';
						var target_size =  '';
						
						var target_after = '';
						var target_after_size = '';
						
						
						jQuery(this).slider({
								  min: 0,
								  max: 12,
								  value: slider_start,
								  slide: function( event, ui ) {
									  
									  	
										get_grid_total = 0;
										get_grid_before_total = 0;
										for(var x=(target_num);x>=0;x--)
											get_grid_total += parseInt(grid.find('.grid-target-'+x+grid_class).attr('data-grid-width'));
										
										
									  
										target = grid.find('.grid-target-'+(target_num)+grid_class).first();
										target_size =  parseInt(grid.find('.grid-target-'+(target_num)+grid_class).first().attr('data-grid-width'));
										
										target_after = grid.find('.grid-target-'+(target_num+1)+grid_class).first();
										target_after_size =  parseInt(grid.find('.grid-target-'+(target_num+1)+grid_class).first().attr('data-grid-width'));
										
										get_grid_before_total = (get_grid_total-target_size);
										
										
										var set_target_total = (ui.value-get_grid_before_total);
										var set_target_after_total = ((get_grid_total-ui.value)+target_after_size);
										
										
										if((set_target_total)>0 && (set_target_after_total)>0)
										 	{
											for(var i=0;i<=12;i++)
												{
										 		target.removeClass('col-'+col_class+'-'+i);
												target_after.removeClass('col-'+col_class+'-'+i);
												}
											 target.addClass('col-'+col_class+'-'+set_target_total);
											 target_after.addClass('col-'+col_class+'-'+set_target_after_total);
											}
										else
											{
											event.preventDefault();
											}
										
										 },
								stop:function( event, ui )
										{
										grid.find('.grid-width-slider.grid-'+target.attr('data-grid-num')).attr('data-grid-width',(ui.value-get_grid_before_total));
										grid.find('.grid-width-slider.grid-'+(parseInt(target.attr('data-grid-num'))+1)).attr('data-grid-width',((get_grid_total-ui.value)+target_after_size));
										if(target)
											{
											target.attr('data-grid-width',(ui.value-get_grid_before_total));
											target_after.attr('data-grid-width',((get_grid_total-ui.value)+target_after_size))	
											}
										
										if(jQuery('.form-canvas-area').hasClass('split_view'))
											{
											setTimeout(function() {nf_save_nex_form('','preview', '') },300);
											}
										
										}
								});
							}
						);	
}


// JavaScript Document
'use strict';

function reset_logic_gui(){

		jQuery('.show-active-rule').removeClass('show-active-rule');
		jQuery('.over-connector').removeClass('over-connector');
		jQuery('.is_target').removeClass('is_target');
		jQuery('.is_arrow').removeClass('is_arrow');
		for(var i=0;i<1000;i++)
			jQuery('.connect_id_' + i).removeClass('connect_id_' + i);
		jQuery('.nex-forms-container .form_field').each(
			function(index)
				{
				jQuery('.for_rule_'+ jQuery(this).attr('id')).removeClass('for_rule_'+ jQuery(this).attr('id'));
				}
			);							
		
		if(jQuery('.set_rules .new_rule').length>0)
			var cl_rule_array = [];
		else
			var cl_rule_array = '';
		
		var cl_actions_array = [];
		var cl_conditions_array = [];
								
		jQuery('.set_rules .new_rule').each(
			function(index)
				{
				
				var cl_actions_array = [];
				var cl_conditions_array = [];
				
				jQuery(this).find('.get_rule_conditions .the_rule_conditions').each(
					function(index)
						{
						cl_conditions_array.push(
								{
								field_Id: jQuery(this).find('.cl_field option:selected').attr('data-field-id'),
								field_name: jQuery(this).find('.cl_field option:selected').attr('data-field-name'),
								field_type: jQuery(this).find('.cl_field option:selected').attr('data-field-type'),
								condition: jQuery(this).find('select[name="field_condition"]').val(),
								condition_value: jQuery(this).find('input[name="conditional_value"]').val(),
								selected_value: jQuery(this).find('.cl_field').attr('data-selected')
								}
							);
						
						}
					);
					
					jQuery(this).find('.get_rule_actions .the_rule_actions').each(
						function(index)
							{
							
							cl_actions_array.push(
								{
								target_field_Id: jQuery(this).find('select[name="cla_field"] option:selected').attr('data-field-id'),
								target_field_name: jQuery(this).find('select[name="cla_field"] option:selected').attr('data-field-name'),
								target_field_type: jQuery(this).find('select[name="cla_field"] option:selected').attr('data-field-type'),
								do_action: jQuery(this).find('select[name="the_action"]').val(),
								selected_value: jQuery(this).find('select[name="cla_field"]').attr('data-selected'),
								}
							);	
							
							}
						);
					
				
				
				cl_rule_array.push(
						{
						operator: jQuery(this).find('select[name="selector"]').val(),
						reverse_actions: jQuery(this).find('select[name="reverse_actions"] option:selected').val(),
						conditions: cl_conditions_array,
						actions: cl_actions_array
						}
					)
				
				}
			);	
				
				
			var data =
				{
				action	 							: 'get_c_logic_ui',
				conditional_logic_array				: cl_rule_array,
				}
			
			
			jQuery.post
				(
				ajaxurl, data, function(response)
					{
					jQuery('.adv_arrow').remove();
					jQuery('.adv_target').remove();
					jQuery('.cl_arrow').remove();
					jQuery('.con_logic_ui').html('');
					jQuery('.con_logic_ui').html(response);
					logic_interface();
					count_nf_conditions();
					//refresh_cl_fields();
					}
				);
	
}


function refresh_cl_fields(){
		jQuery('select[name="reloaded_fields"]').attr('name','fields_for_conditions');
			jQuery('select[name="cla_field"]').addClass('cla_field');	
				
			jQuery('.refresh_cl_fields').find('.fa').addClass('fa-spin');
			set_c_logic_fields();
			
			
			/*var set_step_selection = '<option value="0">-- Select Step --</option>';
				
				for(var i=1; i <= nf_count_multi_steps(); i++)
					set_step_selection += '<option value="'+ i +'">Step '+ i +'</option>';
				
				jQuery('.cl_current_action_fields_steps').html(set_step_selection);
			*/
			//jQuery('select[name="cla_steps"]').trigger('mouseover');
			jQuery('select[name="cla_field"]').trigger('mouseover');

			jQuery('select[name="fields_for_conditions"]').trigger('mouseover');
			
			jQuery('select[name="cla_field"]').trigger('mouseout');
			jQuery('select[name="fields_for_conditions"]').trigger('mouseout');
	
			setTimeout(function(){jQuery('.refresh_cl_fields').find('.fa').removeClass('fa-spin')},500);
			
		}
jQuery(document).ready(
function()
	{
	
	
	jQuery(document).on('change','select[name="the_action"]',
		function()
			{
			jQuery(this).parent().find('.changeable').removeClass('show_change_value');
			jQuery(this).closest('.input-group').removeClass('steps_only');
			jQuery(this).parent().parent().find('.show_change_value_to').addClass('hidden');
			
			jQuery(this).parent().find('.cl_current_action_fields_container').removeClass('hidden');
			//jQuery(this).parent().parent().find('.cl_current_action_fields_steps').addClass('hidden');
			
			//console.log(jQuery(this).val());
			if(jQuery(this).val()=='change_value')
				{	
				jQuery(this).parent().find('.changeable').addClass('show_change_value');
				jQuery(this).parent().parent().find('.show_change_value_to').removeClass('hidden');
				}
			if(jQuery(this).val()=='skip_to')
				{	
				jQuery(this).closest('.input-group').addClass('steps_only'); ;
				
				/*jQuery(this).parent().find('.cl_current_action_fields_container').addClass('hidden');
				jQuery(this).parent().parent().find('.cl_current_action_fields_steps').removeClass('hidden');
				
				var set_step_selection = '<option value="0">-- Select Step --</option>';
				
				for(var i=1; i <= nf_count_multi_steps(); i++)
					set_step_selection += '<option value="'+ i +'">Step '+ i +'</option>';
				
				jQuery(this).parent().parent().find('.cl_current_action_fields_steps').html(set_step_selection);
				*/
				}
			}
		);
	
	jQuery('.set_rules select').change
	
	jQuery(document).on('change','.set_rules select, .set_rules input',
		function()
			{ 
			reset_logic_gui();
			}
		);
	
	setTimeout(function(){ refresh_cl_fields() }, 3000);
	//setTimeout(function(){ reset_logic_gui() }, 3500);
	//reset_logic_gui();	
	
	/*jQuery(document).on('mouseover','select[name="cla_steps"]',
		function()
			{ 
			
			var set_step_selection = '<option value="0">-- Select Step --</option>';
				
				for(var i=1; i <= nf_count_multi_steps(); i++)
					set_step_selection += '<option data-field-id="'+ jQuery('.nf_multi_step_'+i).attr('id') +'" data-field-name="'+ jQuery('.nf_multi_step_'+i).attr('id') +'" data-field-type="step" value="'+ jQuery('.nf_multi_step_'+i).attr('id') +'**step##' + i + '">Step '+ i +'</option>';
				
				jQuery('.cl_current_action_fields_steps').html(set_step_selection);
			
			//set_c_logic_fields();
			 var select_clone = '';
			var the_select = jQuery(this);
			var get_selected = the_select.attr('data-selected')
			jQuery('select[name="cla_steps"] option').each(
				function()
					{	
					if(jQuery(this).val()==get_selected)
						jQuery(this).attr('selected',true);
					else
						jQuery(this).attr('selected',false);
					}
				);
			jQuery('select[name="cla_steps"] option:selected').trigger('click');
			}
		);*/
		
	jQuery(document).on('mouseover','select[name="fields_for_conditions"]',
		function()
			{ 
			//set_c_logic_fields();
			 var select_clone = '';
			var the_select = jQuery(this);
			var get_selected = (the_select.attr('data-selected')) ? the_select.attr('data-selected') : '0';
			jQuery('select[name="cl_current_fields_container"] option').each(
				function()
					{	
					if(jQuery(this).val()==get_selected)
						jQuery(this).attr('selected',true);
					else
						jQuery(this).attr('selected',false);
					}
				);
			jQuery('select[name="cl_current_fields_container"] option:selected').trigger('click');
			select_clone = jQuery('select[name="cl_current_fields_container"]').clone();
			select_clone.removeClass('hidden').addClass('form-control').addClass('cl_field')
			select_clone.attr('name','reloaded_fields');
			select_clone.attr('data-selected',get_selected)
			the_select.after(select_clone);
			the_select.remove();
			}
		);
	jQuery(document).on('mouseover','.cla_field',
		function()
			{
			
			 var select_clone = '';
			var the_select = jQuery(this);
			var get_selected = (the_select.attr('data-selected')) ? the_select.attr('data-selected') : '0';
			jQuery('select[name="cl_current_action_fields_container"] option').each(
				function()
					{
					if(jQuery(this).val()==get_selected)
						jQuery(this).attr('selected',true);
					else
						jQuery(this).attr('selected',false);
					}
				);
			jQuery('select[name="cl_current_action_fields_container"] option:selected').trigger('click');
			select_clone = jQuery('select[name="cl_current_action_fields_container"]').clone();
			
				select_clone.removeClass('hidden');
				
			select_clone.addClass('form-control')
			select_clone.attr('name','cla_field');
			select_clone.attr('data-selected',get_selected)
			the_select.after(select_clone);
			the_select.remove();
			}
		);
	
	
	
	jQuery(document).on('click','.refresh_cl_fields',
		function()
			{
			refresh_cl_fields();
			}
		);
	
	jQuery(document).on('click','.conditional-logic-btn',
		function()
			{
			setTimeout(function(){ refresh_cl_fields() }, 1000);
			jQuery('.nex-forms-container .form_field').each(
			function(index)
				{
				if(jQuery(this).hasClass('icon-select-group'))
					jQuery(this).prepend('<span class="c_logic_field_type fas fa-check-double"></span>')
				if(jQuery(this).hasClass('digital-signature'))
					jQuery(this).prepend('<span class="c_logic_field_type fas fa-file-signature"></span>')
				if(jQuery(this).hasClass('name'))
					jQuery(this).prepend('<span class="c_logic_field_type fas fa-user"></span>')
				if(jQuery(this).hasClass('email'))
					jQuery(this).prepend('<span class="c_logic_field_type fas fa-envelope"></span>')
				if(jQuery(this).hasClass('phone_number'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-phone"></span>')
				if(jQuery(this).hasClass('url'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-link"></span>')
				if(jQuery(this).hasClass('Query'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-comment"></span>')
				if(jQuery(this).hasClass('text'))
					jQuery(this).prepend('<span class="c_logic_field_type fas fa-text-width"></span>')
				if(jQuery(this).hasClass('textarea'))
					jQuery(this).prepend('<span class="c_logic_field_type fas fa-text-height"></span>')
				if(jQuery(this).hasClass('password'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-key"></span>')
				if(jQuery(this).hasClass('select'))
					jQuery(this).prepend('<span class="c_logic_field_type fas fa-list-ul"></span>')
				if(jQuery(this).hasClass('multi-select'))
					jQuery(this).prepend('<span class="c_logic_field_type fas fa-tasks"></span>')
				if(jQuery(this).hasClass('radio-group'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-dot-circle-o"></span>')
				if(jQuery(this).hasClass('check-group'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-check-square-o"></span>')
				if(jQuery(this).hasClass('image-choices-field'))
					jQuery(this).prepend('<span class="c_logic_field_type fas fa-image"></span>')
				if(jQuery(this).hasClass('slider'))
					jQuery(this).prepend('<span class="c_logic_field_type fas fa-sliders-h"></span>')
				if(jQuery(this).hasClass('touch_spinner'))
					jQuery(this).prepend('<span class="c_logic_field_type fas fa-sort"></span>')
				if(jQuery(this).hasClass('autocomplete'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-pencil"></span>')
				if(jQuery(this).hasClass('tags'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-tag"></span>')
				if(jQuery(this).hasClass('date'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-calendar-o"></span>')
				if(jQuery(this).hasClass('time'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-clock-o"></span>')
				if(jQuery(this).hasClass('star-rating'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-star"></span>')
				if(jQuery(this).hasClass('thumb-rating'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-thumbs-up"></span>')
				if(jQuery(this).hasClass('smily-rating'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-smile-o"></span>')
				if(jQuery(this).hasClass('upload-multi'))
					jQuery(this).prepend('<span class="c_logic_field_type fas fa-reply-all"></span>')
				if(jQuery(this).hasClass('upload-single'))
					jQuery(this).prepend('<span class="c_logic_field_type fas fa-reply"></span>')
				if(jQuery(this).hasClass('upload-image'))
					jQuery(this).prepend('<span class="c_logic_field_type fas fa-file-image"></span>')
				if(jQuery(this).hasClass('submit-button'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-send"></span>')
				if(jQuery(this).hasClass('heading'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-header"></span>');
				if(jQuery(this).hasClass('math_logic'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-calculator"></span>');
				if(jQuery(this).hasClass('html_image'))
					jQuery(this).prepend('<span class="c_logic_field_type far fa-image"></span>');
				if(jQuery(this).hasClass('paragraph'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-align-justify"></span>');
				if(jQuery(this).hasClass('html'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-code"></span>');
				if(jQuery(this).hasClass('is_panel'))
					jQuery(this).prepend('<span class="c_logic_field_type fa fa-window-maximize"></span>');
				}
			);
			
			//jQuery('select[name="cla_field"]').select2();
			//jQuery('select[name="fields_for_conditions"]').select2();
			
			
			
			
			if(jQuery(this).hasClass('active'))
				{
				jQuery('.conditional_logic_wrapper #close-settings').trigger('click');	
				}
			else
				{
				
				/*var data =
					{
					action	 						: 'get_c_logic_ui',
					form_Id							: jQuery('#form_update_id').text(),
					};	
				jQuery.post
					(
					ajaxurl, data, function(response)
						{
						jQuery('.adv_arrow').remove();
						jQuery('.adv_target').remove();
						jQuery('.cl_arrow').remove();
						jQuery('.con_logic_ui').html('');
						jQuery('.con_logic_ui').html(response);
						//logic_interface();
						count_nf_conditions();
						//refresh_cl_fields();
							
						}
					);
					
				*/	
				jQuery('.inner-canvas-container .batch_edit').removeClass('batch_edit_sim');
				jQuery('.inner-canvas-container .batch_edit').removeClass('batch_edit');
				jQuery('.inner-canvas-container').removeClass('active');
				jQuery('.form-canvas-area').removeClass('form-editor-view');
				jQuery('.form-canvas-area').removeClass('msg-editor-view');
				
				jQuery('.form-canvas-area').addClass('form-editor-view');
				jQuery('.inner-msg-canvas').hide();
				jQuery('.inner-form-canvas').show();
				
				jQuery('span.editor-form').show();
				jQuery('span.editor-msg').hide();

				jQuery('.nex-forms-container').addClass('active');
				
				jQuery('.form-canvas-area').attr('data-sec-pre-class','.inner-form-canvas')
				jQuery('.form-canvas-area').removeClass('preview_view');
				jQuery('.form-canvas-area').removeClass('split_view');
				
				jQuery('.view_all_steps').removeClass('view_all_steps');
				jQuery('.conditional_logic_wrapper').addClass('opened');
				jQuery('.conditional-logic-btn').addClass('active');
				jQuery('.form_canvas').addClass('conditional-logic-opened');
				jQuery('.nex_forms_admin_page_wrapper').addClass('conditional-logic-ui');
				jQuery('.overall-settings-column #close-settings').trigger('click');
				jQuery('.field-settings-column #close-settings').trigger('click');
				
				setTimeout(function(){ reset_logic_gui(); },300);
				}
			}
		);
	
	jQuery(document).on('click','.conditional_logic_wrapper #close-settings',
		function()
			{
			jQuery('li.all_steps.current a').trigger('click');
			jQuery('.btn.workspace.c-logic').removeClass('active');
			
			if(jQuery('.btn.workspace.active').length<=0)
			jQuery('.btn.workspace.normal').addClass('active');	
			
			
			jQuery('.conditional-logic-btn').removeClass('active');
			jQuery('.conditional_logic_wrapper').removeClass('opened');
			jQuery('.form_canvas').removeClass('conditional-logic-opened');
			jQuery('.nex_forms_admin_page_wrapper').removeClass('conditional-logic-ui');
			jQuery('.c_logic_field_type').remove();
			}
		);
	
	reset_rule_complexity();
	setTimeout(function(){set_c_logic_fields()},1000);
	jQuery(document).on('change', '.cl_field, select[name="cla_field"]', function()
		{
		jQuery(this).attr('data-selected',jQuery(this).val());
		}
	);
	
	
	jQuery(document).on('change', 'input[name="adv_cl"]', function()
		{
		if(jQuery(this).prop('checked')==true)
			{
			jQuery('.conditional_logic').removeClass('simple_view').addClass('advanced_view');	
			}
		else
			{
			jQuery('.conditional_logic').addClass('simple_view').removeClass('advanced_view');
			
			var count1 = 0;
			var count2 = 0;
			
			reset_rule_complexity();
				
			}
		}
	);
	jQuery(document).on('click', '.add_new_rule', function()
		{
		var new_rule = jQuery('.conditional_logic_clonables .new_rule').clone();
		jQuery('.set_rules').append(new_rule);
		var radio_name =  Math.round(Math.random()*9999);
		
		new_rule.find('.set_rule_conditions').addClass('get_rule_conditions');
		new_rule.find('.set_rule_conditions').removeClass('set_rule_conditions');
		
		new_rule.find('.set_rule_actions').addClass('get_rule_actions');
		new_rule.find('.set_rule_actions').removeClass('set_rule_actions');
		
		new_rule.find('input[type="radio"]').attr('name',radio_name);
		
		
		new_rule.find('select.cl_field').val('0');
		new_rule.find('select[name="cla_field"]').val('0');
		

		jQuery('.conditional_logic_wrapper.settings-column-style .inner').animate(
					{
					scrollTop:10000
					},300
				);
		count_nf_conditions();
		
		if(jQuery('#nex-forms').hasClass('running-tutorial'))
			{
			setTimeout(function() { 
			
					new_rule.find('select[name="the_action"] option[value="0"]').prop('selected',true);	
					new_rule.find('select[name="field_condition"] option[value="0"]').prop('selected',true);
					 
					new_rule.find('select[name="the_action"] option[value="0"]').trigger('click');
					new_rule.find('select[name="field_condition"] option[value="0"]').trigger('click');
					
					new_rule.find('select[name="the_action"]').trigger('change');
					new_rule.find('select[name="field_condition"]').trigger('change');
					
				},200);
			}
		
		}
	);

	jQuery(document).on('click', '.add_condition', function()
		{
		var new_condition = jQuery('.conditional_logic_clonables .set_rule_conditions').clone();
		
		//new_condition.removeClass('set_rule_conditions').addClass('the_rule_conditions');
		
		jQuery(this).parent().find('.get_rule_conditions').append(new_condition);
		}
	);

	
	jQuery(document).on('click', '.add_action', function()
		{
		var new_condition = jQuery('.conditional_logic_clonables .set_rule_actions').clone();
		//new_condition.removeClass('set_rule_actions').addClass('the_rule_actions');
		jQuery(this).parent().find('.get_rule_actions').append(new_condition);
		}
	);

	jQuery(document).on('click', '.delete_action, .delete_condition', function()
		{
		jQuery(this).parent().remove();
		
		reset_rule_complexity();
		reset_logic_gui();
		}
	);
	jQuery(document).on('click', '.delete_rule, .delete_simple_rule', function()
		{
		jQuery(this).closest('.new_rule').remove();
		reset_rule_complexity();
		reset_logic_gui();
		}
	);	
	
	jQuery(document).on('click', '.duplicate_simple_rule', function()
		{
		var the_rule = jQuery(this).closest('.new_rule');
		
		var the_clone = the_rule.clone();
		
		the_clone.insertAfter(the_rule);
		
		reset_rule_complexity();
		//reset_logic_gui();
		}
	);	
	
	
	
	jQuery(document).on('mouseenter','.adv_arrow, .avd_arrows_connector, .adv_target, .avd_targets_connector, .adv_connector, .avd_arrow_condition, .new_rule.advanced_view',function() {
	  var get_rule_connect_id = jQuery(this).attr('data-rule-id');
	  jQuery('.connect_id_'+get_rule_connect_id).addClass('over-connector');
	 
	});
	
	jQuery(document).on('mouseleave','.adv_arrow, .avd_arrows_connector, .adv_target, .avd_targets_connector, .adv_connector, .avd_arrow_condition, .new_rule.advanced_view',function() {
	  var get_rule_connect_id = jQuery(this).attr('data-rule-id');
	  jQuery('.connect_id_'+get_rule_connect_id).removeClass('over-connector');
	 
	});
	
	
	jQuery(document).on('mouseenter','.cl_arrow',function() {
		
		var rule_key = jQuery(this).attr('data-rule-key');
		
		//if(!jQuery('.conditional_logic_wrapper.settings-column-style .inner .for_rule_'+rule_key).is(':visible'))
			//{
		
			var get_offset =  jQuery('.conditional_logic_wrapper.settings-column-style .inner .for_rule_'+rule_key).attr('data-original-offset');
			var get_offset2 =  jQuery('.conditional_logic_wrapper.settings-column-style .inner').offset();
			var set_top = (get_offset - get_offset2.top);
			
			jQuery('.conditional_logic_wrapper.settings-column-style .inner').animate(
					{
					scrollTop:set_top
					},100
				);
			//}
	});
	
	
	
	jQuery(document).on('mouseenter','.adv_arrow, .avd_arrows_connector, .adv_target, .avd_targets_connector, .adv_connector, .avd_arrow_condition',function() {
		
		var rule_key = jQuery(this).attr('data-rule-key');
		
		//if(!jQuery('.conditional_logic_wrapper.settings-column-style .inner .for_rule_'+rule_key).is(':visible'))
			//{
			
			var get_rule_connect_id = jQuery(this).attr('data-rule-id');
	  		jQuery('.connect_id_'+get_rule_connect_id).addClass('over-connector');
			
			
			var get_offset =  jQuery('.conditional_logic_wrapper.settings-column-style .inner .connect_id_'+get_rule_connect_id).attr('data-original-offset');
			var get_offset2 =  jQuery('.conditional_logic_wrapper.settings-column-style .inner').offset();
			var set_top = (get_offset - get_offset2.top);
			
			jQuery('.conditional_logic_wrapper.settings-column-style .inner').animate(
					{
					scrollTop:set_top
					},100
				);
			//}
	});
	
	
	
	
	
	jQuery(document).on('mouseenter','.cl_arrow, .panel.new_rule',function() {
	  var rule_key = jQuery(this).attr('data-rule-key');
	  jQuery('.for_rule_'+rule_key).addClass('show-active-rule');
	  
	});
	jQuery(document).on('mouseleave','.cl_arrow, .panel.new_rule',function() {
	  var rule_key = jQuery(this).attr('data-rule-key');
	  jQuery('.for_rule_'+rule_key).removeClass('show-active-rule');
	});
	
	
	
});

function reset_rule_complexity(){
	jQuery('.set_rules .new_rule').each(
				function()
					{
					var count1 = jQuery(this).find('.delete_condition').length;
					var count2 = jQuery(this).find('.delete_action').length;
					
					if(count1>1 || count2>1)
						jQuery(this).addClass('advanced_view');
					else
						jQuery(this).removeClass('advanced_view');
					}
				);
	count_nf_conditions();
}

function count_nf_conditions(){
	jQuery('.set_rules .new_rule').each(
		function(index)
			{
			jQuery(this).find('.rule_number').text(index+1)
			var get_rule_connect_id = jQuery(this).find('select[name="cla_field"]').attr('data-selected');
			
			
			
			if(get_rule_connect_id)
				{
				var get_offset =  jQuery(this).offset();
				
				jQuery(this).attr('data-original-offset',get_offset.top);
				
				var set_rule_connect_id = get_rule_connect_id.split('**');
				
				jQuery(this).attr('data-rule-key',set_rule_connect_id[0]);
				jQuery(this).addClass('for_rule_'+set_rule_connect_id[0]);
				}
			}
		);
	
	
	jQuery('.set_rules .new_rule.advanced_view').each(
		function(index)
			{
			jQuery(this).attr('data-rule-id',(index+1));
			jQuery(this).addClass('connect_id_'+(index+1));
			
			
			var get_offset =  jQuery(this).offset();
			jQuery(this).attr('data-original-offset',get_offset.top);
			
			}
		);
	
	
}


function set_c_logic_fields(the_select){
	
	var set_current_fields_conditional_logic = '<option value="0">-- Fields --&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>';
	var set_current_action_fields_conditional_logic ='';
	set_current_fields_conditional_logic += '<optgroup label="Text Fields" class="cl_text_fields">';
	//SPACER
	set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	jQuery('div.nex-forms-container div.form_field input[type="text"]').each(
		function()
			{
			
			if(jQuery(this).attr('name')!='multi_step_name' && jQuery(this).attr('name')!='multi_step_icon' && jQuery(this).attr('name')!='multi_step_description' && jQuery(this).attr('name')!='multi_step_time_limit')
				{
				if(jQuery(this).attr('name') && jQuery(this).attr('name')!='undefined')
					{
					if(jQuery(this).closest('.form_field').hasClass('date'))
						set_current_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="date" value="'+ jQuery(this).closest('.form_field').attr('id') +'**date##'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ unformat_name(jQuery(this).attr('name')) +'<br><br></option>';
					else if(jQuery(this).closest('.form_field').hasClass('datetime'))
						set_current_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="datetime" value="'+ jQuery(this).closest('.form_field').attr('id') +'**datetime##'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ unformat_name(jQuery(this).attr('name')) +'<br><br></option>';
					else if(jQuery(this).closest('.form_field').hasClass('time'))
						set_current_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="time"  value="'+ jQuery(this).closest('.form_field').attr('id') +'**time##'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ unformat_name(jQuery(this).attr('name')) +'<br><br></option>';
					else if(jQuery(this).closest('.form_field').hasClass('star-rating'))
						set_current_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="stars"  value="'+ jQuery(this).closest('.form_field').attr('id') +'**hidden##'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ unformat_name(jQuery(this).attr('name')) +'<br><br></option>';
					else
						set_current_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="text"  value="'+ jQuery(this).closest('.form_field').attr('id') +'**text##'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ unformat_name(jQuery(this).attr('name')) +'<br><br></option>';
				
					//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
					}
				
				}
			}
		);	
	jQuery('div.nex-forms-container div.form_field input[type="password"]').each(
		function()
			{
			if(jQuery(this).attr('name')!='undefined')
				{
				set_current_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="hidden"  value="'+ jQuery(this).closest('.form_field').attr('id') +'**password##'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
				//SPACER
				set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
				}
			}
		);	
	set_current_fields_conditional_logic += '</optgroup>';
	
	set_current_fields_conditional_logic += '<optgroup label="Radio Buttons" class="cl_radios">';
	//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	var old_radio = '';
	var new_radio = '';
	
	jQuery('div.nex-forms-container div.form_field input[type="radio"]').each(
		function()
			{
			if(jQuery(this).attr('name')!='undefined')
				{
				old_radio = jQuery(this).attr('name');
				if(old_radio != new_radio){
					set_current_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="radio"  value="'+ jQuery(this).closest('.form_field').attr('id') +'**radio##'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
					//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
				}
				new_radio = old_radio;
				
				}
			
			}
		);	
	set_current_fields_conditional_logic += '</optgroup>';
	
	var old_check = '';
	var new_check = '';
	set_current_fields_conditional_logic += '<optgroup label="Check Boxes" class="cl_checks">';
	//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	jQuery('div.nex-forms-container div.form_field input[type="checkbox"]').each(
		function()
			{
			if(jQuery(this).attr('name')!='undefined')
				{
				old_check = jQuery(this).attr('name');
				if(old_check != new_check)
					{
					set_current_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="checkbox"  value="'+ jQuery(this).closest('.form_field').attr('id') +'**checkbox##'+ jQuery(this).attr('name')  +'">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
					//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
					}
				new_check = old_check;
				
				
				}
			}
		);	
	set_current_fields_conditional_logic += '</optgroup>';
	
	set_current_fields_conditional_logic += '<optgroup label="Selects" class="cl_selects">';
	//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	jQuery('div.nex-forms-container div.form_field select').each(
		function()
			{
			if(jQuery(this).attr('name')!='undefined')
				{
				set_current_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="select"  value="'+ jQuery(this).closest('.form_field').attr('id') +'**select##'+ jQuery(this).attr('name')  +'">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
				
				//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
				}
			}
		);	
	set_current_fields_conditional_logic += '</optgroup>';
	
	set_current_fields_conditional_logic += '<optgroup label="Text Areas" class="cl_textareas">';
	//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	jQuery('div.nex-forms-container div.form_field textarea').each(
		function()
			{
			set_current_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="textarea"  value="'+ jQuery(this).closest('.form_field').attr('id') +'**textarea##'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
			//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
			}
		);	
	set_current_fields_conditional_logic += '</optgroup>';
	
	
	set_current_fields_conditional_logic += '<optgroup label="File Uploaders" class="cl_uploaders">';
	//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	jQuery('div.nex-forms-container div.form_field input[type="file"]').each(
		function()
			{
			if(jQuery(this).attr('name')!='undefined')
				{
				set_current_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="file"  value="'+ jQuery(this).closest('.form_field').attr('id') +'**file##'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
				//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
				}
			}
		);	
	set_current_fields_conditional_logic += '</optgroup>';
	
	set_current_fields_conditional_logic += '<optgroup label="Hidden Fields" class="cl_hidden">';
	//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	
	jQuery('.hidden_fields_setup .hidden_fields .hidden_field').each(
		function()
			{
			set_current_fields_conditional_logic += '<option data-field-id="hidden_field" data-field-name="'+ format_illegal_chars(jQuery(this).find('.hidden_field_name').val())  +'" data-field-type="hidden"  value="hidden_field**hidden##'+ format_illegal_chars(jQuery(this).find('.hidden_field_name').val())  +'">'+ unformat_name(jQuery(this).find('.hidden_field_name').val()) +'</option>';
			//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
			}
		);	
	
	
	
	jQuery('div.nex-forms-container div.form_field input[type="hidden"]').each(
		function()
			{
			if(jQuery(this).attr('name')!='undefined' && jQuery(this).attr('name')!='math_result')
				{
				set_current_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="hidden"  value="'+ jQuery(this).closest('.form_field').attr('id') +'**hidden##'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
				//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
				}
			}
		);	
	set_current_fields_conditional_logic += '</optgroup>';
	
	
	/*set_current_fields_conditional_logic += '<optgroup label="Password Fields" class="cl_radios">';
	jQuery('div.nex-forms-container div.form_field input[type="password"]').each(
		function()
			{
			if(jQuery(this).attr('name')!='undefined')
				{
				set_current_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="hidden"  value="'+ jQuery(this).closest('.form_field').attr('id') +'**password##'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
				}
			}
		);	
	set_current_fields_conditional_logic += '</optgroup>';*/
	
	
	set_current_fields_conditional_logic += '<optgroup label="Math Fields" class="cl_math">';
	//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	jQuery('div.nex-forms-container div.form_field input.set_math_result').each(
		function()
			{
			if(jQuery(this).attr('name')!='undefined' && jQuery(this).attr('name')!='math_result')
				{
				set_current_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).attr('name'))  +'" data-field-type="hidden"  value="'+ jQuery(this).closest('.form_field').attr('id') +'**text##'+ format_illegal_chars(jQuery(this).attr('name'))  +'">'+ unformat_name(jQuery(this).attr('name')) +'</option>';
				//SPACER
					set_current_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
				}
			}
		);	
	set_current_fields_conditional_logic += '</optgroup>';
	
	set_current_action_fields_conditional_logic += '<optgroup label="Buttons" class="cl_buttons">';
	//SPACER
					set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	jQuery('div.nex-forms-container div.form_field.button_fields').each(
		function()
			{
			//if(jQuery(this).find('.the_input_element').hasClass('nex-submit'))
				//set_current_action_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).find('.the_input_element').text())  +'" data-field-type="button"  value="'+ jQuery(this).attr('id') +'**button##button">'+ jQuery(this).find('.the_input_element').text() +'</option>';
			//else
			var button_step = '';
			var button_type = ' [-] ';
			if(jQuery(this).closest('.step').attr('class')!='')
				button_step = jQuery(this).closest('.step').find('input[name="multi_step_name"]').val() +' - ';
			
			if(jQuery(this).find('.the_input_element').hasClass('nex-step'))
				button_type = ' [>] ';
			if(jQuery(this).find('.the_input_element').hasClass('prev-step'))
				button_type = ' [<] ';
				
			if(!jQuery(this).closest('.step').find('input[name="multi_step_name"]').val())
				button_step = '';
			set_current_action_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ format_illegal_chars(jQuery(this).find('.the_input_element').text())  +'" data-field-type="button"  value="'+ jQuery(this).attr('id') +'**button##button">'+ button_step + button_type + jQuery(this).find('.the_input_element').text() +'</option>';
			//SPACER
			set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
			}
		);	
	set_current_action_fields_conditional_logic += '</optgroup>';
	
	set_current_action_fields_conditional_logic += '<optgroup label="Panels" class="cl_panels">';
	//SPACER
					set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	jQuery('div.nex-forms-container div.form_field.is_panel').each(
		function()
			{
			set_current_action_fields_conditional_logic += '<option  data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="panel" data-field-type="panel"   value="'+ jQuery(this).attr('id') +'**panel##panel">'+ short_str(jQuery(this).find('.panel-heading').text()) +'</option>';
			//SPACER
					set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
			}
		);	
	set_current_action_fields_conditional_logic += '</optgroup>';
	
	set_current_action_fields_conditional_logic += '<optgroup label="Headings" class="cl_headings">';
	//SPACER
					set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	jQuery('div.nex-forms-container div.form_field.heading').each(
		function()
			{
			set_current_action_fields_conditional_logic += '<option   data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="heading" data-field-type="heading"   value="'+ jQuery(this).attr('id') +'**heading##heading">'+ short_str(jQuery(this).find('.the_input_element').text()) +'</option>';
			//SPACER
					set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
			}
		);	
	set_current_action_fields_conditional_logic += '</optgroup>';
	
	set_current_action_fields_conditional_logic += '<optgroup label="Images" class="cl_images">';
	//SPACER
					set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	jQuery('div.nex-forms-container div.form_field.html_image').each(
		function()
			{
			var image = jQuery(this).find('img');
			if(image.length>0 && image.attr('alt'))
				set_current_action_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="html" data-field-type="html"  value="'+ jQuery(this).attr('id') +'**image##html">'+ short_str(jQuery(this).find('img').attr('alt')) +'</option>';
			//SPACER
					set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
			}
		);	
	set_current_action_fields_conditional_logic += '</optgroup>';
	
	set_current_action_fields_conditional_logic += '<optgroup label="HTML/Paragraphs" class="cl_paragraphs">';
	//SPACER
					set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	jQuery('div.nex-forms-container div.form_field.html').each(
		function()
			{
			set_current_action_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="html" data-field-type="html"  value="'+ jQuery(this).attr('id') +'**paragraph##html">'+ short_str(jQuery(this).find('.the_input_element').text()) +'</option>';
			//SPACER
					set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
			}
		);	
	jQuery('div.nex-forms-container div.form_field.paragraph').each(
		function()
			{
			set_current_action_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="paragraph" data-field-type="paragraph" value="'+ jQuery(this).attr('id') +'**heading##html">'+ short_str(jQuery(this).find('.the_input_element').text()) +'</option>';
			//SPACER
					set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
			}
		);	
	set_current_action_fields_conditional_logic += '</optgroup>';

	
	
	
	
	
	set_current_action_fields_conditional_logic += '<optgroup label="Steps" class="cl_steps">';
	//SPACER
					set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	jQuery('div.nex-forms-container div.form_field.step').each(
		function(index)
			{
			set_current_action_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).closest('.form_field').attr('id') +'" data-field-name="'+ jQuery(this).attr('data-step-num') +'" data-field-type="step"  value="'+ jQuery(this).attr('id') +'**' + jQuery(this).attr('data-step-num') + '##step">Step '+ (index+1) +' ('+ short_str(jQuery(this).find('input[name="multi_step_name"]').val()) +')</option>';
			//SPACER
					set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
			}
		);		
	set_current_action_fields_conditional_logic += '</optgroup>';
		
	
	set_current_action_fields_conditional_logic += '<optgroup label="Success Message" class="cl_steps">';
	//SPACER
					set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
	jQuery('div.nex-forms-msg-container div.form_field.html').each(
		function()
			{
			set_current_action_fields_conditional_logic += '<option data-field-id="'+ jQuery(this).attr('id') +'" data-field-name="html" data-field-type="html"  value="'+ jQuery(this).attr('id') +'**success_message##html">'+ short_str(jQuery(this).find('.the_input_element').text()) +'</option>';
			//SPACER
					set_current_action_fields_conditional_logic += '<option class="option_spacer" disabled="disabled">&nbsp;</option>';
			}
		);	
	set_current_action_fields_conditional_logic += '</optgroup>';
	
	
	

jQuery('select[name="cl_current_fields_container"]').html(set_current_fields_conditional_logic);
jQuery('select[name="cl_current_action_fields_container"]').html(set_current_fields_conditional_logic + set_current_action_fields_conditional_logic);
}

function nf_get_wp_cats(setting_id){
	var items = '';
	
	jQuery('#wp_categories ul li').each(function()
		{
			items += jQuery(this).find('a').text() + '\n';
		}
	);
	jQuery('#' + setting_id).val(jQuery.trim(items));
	jQuery('#' + setting_id).trigger('change');
}


function logic_interface(){
		
		
		jQuery('.is_target').removeClass('is_target');
		jQuery('.is_arrow').removeClass('is_arrow');
		for(var i=0;i<1000;i++)
			jQuery('.connect_id_' + i).removeClass('connect_id_' + i);
		jQuery('.nex-forms-container .form_field').each(
			function(index)
				{
				jQuery('.for_rule_'+ jQuery(this).attr('id')).removeClass('for_rule_'+ jQuery(this).attr('id'));
				}
			);
		
		
		var set_avd_width = 50;
		var set_right = 217;
		var set_right_panel = -48;
		
		var set_width = 88;
		var set_top = 16;
		var set_left = 100;
		var set_left_panel = -70;
		var set_zindex = 1000000;
		
		var set_top_offset = 0;
		var targets = '';
		var arrow = '';
		jQuery('.the_rule').each(
			function(index)
				{
				arrow = jQuery(this).attr('data-cl-arrow');
				
				targets = JSON.parse( jQuery(this).attr('data-cl-targets') )
				
				
				jQuery.each( targets, function( key, value ) {

					var element_1 = document.getElementById(''+arrow);
					var element_2 = document.getElementById(''+value['target_id']);
					var offset_1 = element_1.getBoundingClientRect();
					var offset_2 = element_2.getBoundingClientRect();
					
					var target_is_step = false;
					if(jQuery('#'+value['target_id']).hasClass('step'))
						target_is_step = true;
					
					var height = (offset_2.top-offset_1.top)-(set_top_offset);
					
					
					if(target_is_step)
						height = height - 15;
					
					var build_arrow = '<div class="cl_arrow '+ ((target_is_step) ? 'step_rule' : '') +'  for_rule_'+ value['target_id']+' from'+ arrow +'" data-rule-key="'+ value['target_id'] +'" data-target="'+value['target_id']+'" style="width: '+ set_width +'px;left: '+ ((jQuery('#'+arrow).closest('.is_panel').attr('class')) ? set_left_panel : set_left)  +'px;top: '+ set_top +'px; height:'+height+'px; z-index:'+set_zindex+'; ">';
					
					var condition = '=';
					
					if(value['condition']=='equal_to')
						condition = '<span class="show_condition is_equal">Is Equal to</span>';
					if(value['condition']=='not_equal_to')
						condition = '<span class="show_condition not_equal">Is NOT Equal to</span>';
					if(value['condition']=='less_than')
						condition = '<span class="show_condition less_than">Is Less than</span>';
					if(value['condition']=='greater_than')
						condition = '<span class="show_condition greater_than">Is Greater than</span>';
					if(value['condition']=='less_equal')
						condition = '<span class="show_condition less_than_equal">Is Less than or Equal to</span>';
					if(value['condition']=='greater_equal')
						condition = '<span class="show_condition less_than_equal">Is Greater than or Equal to</span>';
					
					build_arrow += '<div class="arrow_condition for_rule_'+ value['target_id']+'" data-rule-key="'+ value['target_id'] +'">'+ condition +'<span class="show_value"> '+ ((value['condition_value']) ? value['condition_value'] : 'Empty' )+'</span></div>';
					
						if(value['action']=='show')        
							build_arrow += '<div class="target_action for_rule_'+ value['target_id']+'"><span class="target_action_icon fa fa-eye" title="Show" data-toggle="tooltip_bs" data-placement="top"></span></div>';
						if(value['action']=='hide')
							build_arrow += '<div class="target_action for_rule_'+ value['target_id']+'"><span class="target_action_icon fa fa-eye-slash" title="Hide" data-toggle="tooltip_bs" data-placement="top"></span></div>';
						
						if(value['action']=='enable')
							build_arrow += '<div class="target_action for_rule_'+ value['target_id']+'"><span class="target_action_icon fas fa-user-edit" title="Enable" data-toggle="tooltip_bs" data-placement="top"></span></div>';
						if(value['action']=='disable')
							build_arrow += '<div class="target_action for_rule_'+ value['target_id']+'"><span class="target_action_icon fas fa-user-slash" title="Disable" data-toggle="tooltip_bs" data-placement="top"></span></div>';	
						
						
						if(value['action']=='change_value')
							build_arrow += '<div class="target_action for_rule_'+ value['target_id']+'"><span class="target_action_icon fas fa-exchange-alt" title="Change Value" data-toggle="tooltip_bs" data-placement="top"></span></div>';
							
						if(value['action']=='skip_to')
							build_arrow += '<div class="target_action for_rule_'+ value['target_id']+'"><span class="target_action_icon fas fa-fast-forward" title="Skip to Step" data-toggle="tooltip_bs" data-placement="top"></span></div>';
						
						build_arrow += '<span class="arrow_start fa fa-caret-left animated  infinite for_rule_'+ value['target_id']+'"></span>';
						build_arrow += '<span class="arrow_end fa fa-caret-right animated  infinite for_rule_'+ value['target_id']+'"></span>';
						
						//build_arrow += '<span class="arrow_end fa fa-caret-right animated slideInLeft infinite"></span>';
						
						build_arrow += '</div>';
					
					jQuery('#'+arrow).append(build_arrow);
					
					
					jQuery('#'+arrow).addClass('is_arrow');
					jQuery('#'+arrow).addClass('for_rule_'+ value['target_id']);
					
					jQuery('#'+value['target_id']).addClass('is_target');
					jQuery('#'+value['target_id']).addClass('for_rule_'+ value['target_id']);
					
					
					
					 
					 set_width += 5;
					 set_left -= 5;
					 set_left_panel -= 5;
					 set_zindex  -= 10;
					});

				}
			);
		
		
		
		jQuery('.the_adv_rule').each(
			function(index)
				{
				var rule_id = jQuery(this).attr('data-adv-id');
				
				targets = JSON.parse( jQuery(this).attr('data-cl-targets') )
				
				
					
					
				jQuery.each( targets['arrows'], function( key, value ) {
					
					
					var build_avd_arrow = '<div data-rule-id="'+ rule_id +'" id="' + rule_id + value['arrow_id'] + '" class="connect_id_' + rule_id +' adv_arrow rule_id_'+rule_id+'" style="width: '+ (set_avd_width+(rule_id*5)+5) +'px;right: '+ ((jQuery('#'+value['arrow_id']).closest('.is_panel').attr('class')) ? (set_right_panel+(rule_id*5)) : (set_right+(rule_id*5)))  +'px;top: '+ set_top +'px; height:1px">';
					
				
					var condition = '=';
						
						if(value['condition']=='equal_to')
							condition = '<span class="show_condition is_equal">Is Equal to</span>';
						if(value['condition']=='not_equal_to')
							condition = '<span class="show_condition not_equal">Is NOT Equal to</span>';
						if(value['condition']=='less_than')
							condition = '<span class="show_condition less_than">Is Less than</span>';
						if(value['condition']=='greater_than')
							condition = '<span class="show_condition greater_than">Is Greater than</span>';
						if(value['condition']=='less_equal')
							condition = '<span class="show_condition less_than_equal">Is Less than or Equal to</span>';
						if(value['condition']=='greater_equal')
							condition = '<span class="show_condition less_than_equal">Is Greater than or Equal to</span>';
						
						build_avd_arrow += '<div class="avd_arrow_condition" data-operator="'+ targets['operator'] +'">'+ condition +'  <span class="show_value">'+ ((value['condition_value']) ? value['condition_value'] : 'Empty' )+'</span></div>';	
						
						build_avd_arrow += '<span class="avd_arrow_start fa fa-caret-right animated  infinite"></span>';
						build_avd_arrow += '</div>';
					
					jQuery('#'+value['arrow_id']).addClass('is_arrow');
					jQuery('#'+value['arrow_id']).append(build_avd_arrow).addClass('connect_id_' + rule_id);

					});
					
				jQuery.each( targets['targets'], function( key, value ) {
						
						
						var target_is_step = false;
						if(jQuery('#'+value['target_id']).hasClass('step'))
							target_is_step = true;
						
						var build_avd_target = '<div data-rule-id="'+ rule_id +'" id="' + rule_id + value['target_id'] + '" class="connect_id_' + rule_id +' '+ ((target_is_step) ? 'avd_step_rule' : '') +' adv_target rule_id_'+rule_id+'" style="width: 300px;right: '+ ((jQuery('#'+value['target_id']).closest('.is_panel').attr('class')) ? (set_right_panel+(rule_id*5)) : (set_right+(rule_id*5))) +'px;top: '+ set_top +'px; height:1px">';
						
						
						if(value['action']=='show')
							build_avd_target += '<div class="avd_target_action"><span class="target_action_icon fa fa-eye" title="Show" data-toggle="tooltip_bs" data-placement="top"></span></div>';
						if(value['action']=='hide')
							build_avd_target += '<div class="avd_target_action"><span class="target_action_icon fa fa-eye-slash" title="Hide" data-toggle="tooltip_bs" data-placement="top"></span></div>';
						
						if(value['action']=='enable')
							build_avd_target += '<div class="avd_target_action"><span class="target_action_icon fas fa-user-edit" title="Enable" data-toggle="tooltip_bs" data-placement="top"></span></div>';
						if(value['action']=='disable')
							build_avd_target += '<div class="avd_target_action"><span class="target_action_icon fas fa-user-slash" title="Disable" data-toggle="tooltip_bs" data-placement="top"></span></div>';
						
						if(value['action']=='change_value')
							build_arrow += '<div class="target_action for_rule_'+ value['target_id']+'"><span class="target_action_icon fas fa-exchange-alt" title="Change Value" data-toggle="tooltip_bs" data-placement="top"></span></div>';
							
						if(value['action']=='skip_to')
							build_arrow += '<div class="target_action for_rule_'+ value['target_id']+'"><span class="target_action_icon fas fa-fast-forward" title="Skip to Step" data-toggle="tooltip_bs" data-placement="top"></span></div>';
						
						
						build_avd_target += '</div>';
						
						jQuery('#'+value['target_id']).addClass('is_target');
						jQuery('#'+value['target_id']).append(build_avd_target).addClass('connect_id_' + rule_id);
					});
				set_avd_width += 15;
				
				}
			);	
		
		
		jQuery('.the_adv_rule').each(
			function(index)
				{
				var rule_id = jQuery(this).attr('data-adv-id');
				
				
				
				
				var id_1 = jQuery('.adv_arrow.rule_id_'+rule_id).first().attr('id');
				var id_2 = jQuery('.adv_arrow.rule_id_'+rule_id).last().attr('id');
				
				var element_1 = document.getElementById(''+id_1);
				var element_2 = document.getElementById(''+id_2);
				
				var offset_1 = element_1.getBoundingClientRect();
				var offset_2 = element_2.getBoundingClientRect();
				
				var arrows_height = (offset_2.top-offset_1.top);
				
				
				jQuery('#'+id_1).append('<div data-rule-id="'+ rule_id +'" class="connect_id_' + rule_id +' avd_arrows_connector" id="avd_arrows_connector_'+ rule_id +'" style="width: 1px;right: 0px;top: 0px; height:'+arrows_height+'px"></div>');
				
				
				
				var id_3 = jQuery('.adv_target.rule_id_'+rule_id).first().attr('id');
				var id_4 = jQuery('.adv_target.rule_id_'+rule_id).last().attr('id');
				
				var element_3 = document.getElementById(''+id_3);
				var element_4 = document.getElementById(''+id_4);
				
				var offset_3 = element_3.getBoundingClientRect();
				var offset_4 = element_4.getBoundingClientRect();
				
				var targets_height = (offset_4.top-offset_3.top);
				
				
				jQuery('#'+id_3).append('<div data-rule-id="'+ rule_id +'" class="connect_id_' + rule_id +' avd_targets_connector" id="avd_targets_connector_'+ rule_id +'" style="width: 1px;right: 0px;top: 0px; height:'+targets_height+'px"></div>');
				
				
				
				var id_5 = jQuery('#avd_arrows_connector_'+rule_id).attr('id');
				var id_6 = jQuery('#avd_targets_connector_'+rule_id).attr('id');
				
				var element_5 = document.getElementById(''+id_5);
				var element_6 = document.getElementById(''+id_6);
				
				var offset_5 = element_5.getBoundingClientRect();
				var offset_6 = element_6.getBoundingClientRect();
				
				var adv_connector_height = ((offset_6.top-(arrows_height/2)+(targets_height/2))-(offset_5.top))+1;
				
				var set_operator = jQuery('#'+id_1).find('.avd_arrow_condition').attr('data-operator');

				jQuery('#'+id_1).append('<div data-rule-id="'+ rule_id +'" class="connect_id_' + rule_id +' avd_connector" id="avd_connector_'+ rule_id +'" style="width: 30px;right: -30px;top: '+((arrows_height/2)-1)+'px; height:'+adv_connector_height+'px"><div class="adv_rule_operator">'+ set_operator +'</div></div>');
				
				}
			);
		
		
		
		/*jQuery('[data-toggle="tooltip_bs"]').tooltip_bs(
			{
			delay: 0,
			html:true
			}
		);*/
		
		}



