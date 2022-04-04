/**
 * Scripts for Bulk Table Editor
 *
 * @package BulkTableEditor/js
 */

var tbl      = '#wbtetable';
var aDefault = '';
var $        = jQuery;
var aColor   = $( 'a' ).css( 'color' );

function checkAll() {

	var radio = $( "input[name='stype']:checked" ).val();
	var view  = $( '#form-gs-view' ).val();
	var table = tbl;

	if ( view === 'ext' ) {
		table = tbl_ext;
	}

	//if checked items before bulk calculate (remove other calculations)
	var chkd = $( table + ' tbody tr input[name="id"]:checked' );
	if ( chkd.length > 0 ) {
		$( table + ' tbody tr input[name="id"]:not(:checked)' ).each( function() {
			if ( this.style.display === '') {
				$(this).prop('checked', false);
				
				if (view === 'prod'){
					setDefaultRowValues(this.form);
				}
			}
		});
		$( '#checkall' ).prop( 'checked', false );
		return 0;
	}

	//bulk calculate
	$( table + ' tbody tr' ).each(
		function(){
			var check = this.children[0].children[0]['id'];
			if ( radio === 'rows' ) {
				if ( this.style.display === '' ) {
					$( check ).prop( 'checked', true );
				} else {
					$( check ).prop( 'checked', false );
					if (view === 'prod' ) {
						setDefaultRowValues( this.children[0].children[0] );
					}
				}
			} else {
				$( check ).prop( 'checked', $( '#checkall' ).prop( 'checked' ) );
			}
		}
	);

}

function checkVisible() {
	var view  = $( '#form-gs-view' ).val();
	var table = tbl;

	if ( view === 'ext' ) {
		table = tbl_ext;
	}

	$( table + ' tbody tr' ).each(
		function() {
			var check = this.children[0].children[0]['id'];
			if ( this.style.display === '' ) {
				$( check ).prop( 'checked', $( '#checkall' ).prop('checked') );
			} else {
				$( check ).prop( 'checked', false );
			}
		}
	);
}

function setDefaultRowValues( obj ) {

	obj['stock'].value         = obj['stock'].defaultValue;
	obj['price'].value         = obj['price'].defaultValue;
	obj['saleprice'].value     = obj['saleprice'].defaultValue;
	obj['salefrom'].value      = obj['salefrom'].defaultValue;
	obj['saleto'].value        = obj['saleto'].defaultValue;
	obj['salefrom_time'].value = obj['salefrom_time'].defaultValue;
	obj['saleto_time'].value   = obj['saleto_time'].defaultValue;
	obj['salepercent'].value   = obj['salepercent'].defaultValue;
}

function sort( column, type ) {

	var view  = $( '#form-gs-view' ).val();
	var table = tbl;

	if ( view === 'ext' ) {
		table = tbl_ext;
	}

	$( table ).tableCalc( 'sortColumn', column, type );
	
	if ( $( '#s' + column ).hasClass( 'fa-sort' ) ) {
		$( '#s' + column ).removeClass( 'fa-sort' ).addClass( 'fa-sort-up' );
		resetSortClass( column );
		return;
	}
	if ( $( '#s' + column ).hasClass( 'fa-sort-up' ) ) {
		$( '#s' + column ).removeClass( 'fa-sort-up' ).addClass( 'fa-sort-down' );
		resetSortClass( column );
		return;
	}
	if ( $( '#s' + column ).hasClass( 'fa-sort-down' ) ) {
		$( '#s' + column ).removeClass( 'fa-sort-down' ).addClass( 'fa-sort-up' );
		resetSortClass( column );
		return;
	}

	function resetSortClass( column ){
		for ( var i = 1; i < 10; i++ ) {
			if ( i != column ) {
				$( '#s' + i ).removeClass( 'fa-sort-down' ).removeClass( 'fa-sort-up' ).addClass( 'fa-sort' );
			}
		}
	}

}

function clearSales() {
	
	var is_checked = false;
	
	$( tbl + ' tbody form' ).each(
		function() {
			if ('' === this.style.display && this['saleprice'].value > 0 ) {
				this['saleprice'].value     = '';
				this['salefrom'].value      = '';
				this['saleto'].value        = '';
				this['salepercent'].value   = '';
				this['salefrom_time'].value = '00:00';
				this['saleto_time'].value   = '23:59';
				this['id'].checked          = true;
				is_checked = true;
			}

		}
	)

	if ( is_checked ) {
		$( '#saveall' ).css( 'color', 'red' );
		$( '#saveall-foot' ).css( 'color', 'red' );
	} else {
		$( '#saveall' ).css( 'color', '' );
		$( '#saveall-foot' ).css( 'color', '' );
	}
}


function deleteRows() {
	
	var confirm_delete = confirm( $( '#msg-confirm-delete' ).val() );
	
	if ( confirm_delete === true ) {
		var p_count   = 0;
		var rescount  = 0;
		var count     = 0;
		var nonce_val = $( '#_wpnonce' ).val();
		var json_data = { action: 'wbte_delete_table_rows_data', nonce: nonce_val, rows: [] };

		$( tbl + ' tbody form' ).each(
			function() {
				if ( $( this['id'] ).prop( 'checked' ) ) {
					var frm_data = { id: this['id'].value };
					json_data.rows.push( frm_data );
					count++;
					if ( p_count === 1 ) {
						progressBar('start');
					}
					p_count++;
				}
			}
		)

		$( '#a-clear-sales' ).css( 'color', '' );
		$( '#a-delete-rows' ).css( 'color', 'red' );

		if ( count > 0 ) {
			$.ajax(
				{
					type: 'POST',
					url: ajaxurl,
					datatype: 'json',
					data: json_data,
					success: function( response ) {
						console.log( response );
						rescount++;
						if (rescount > 0) {
							var ms = ( p_count >= 100 ) ? 2000 : 500;
							reloadPage( ms );
						}
					},
					error: function( response ){
						console.log( response );
					}
				}
			);
		
			event.preventDefault();
		}
	} 

}

function saveAll() {

	var count         = 0;
	var p_count       = 0;
	var rescount      = 0;
	var nonce_val     = $( '#_wpnonce' ).val();
	var json_data     = { action: 'wbte_update_table_rows_data', nonce: nonce_val, rows: [] };

	//Check if description is changed
	if ( wbte_object.disable_description !== 'yes' ) {
		$( tbl + ' tbody form').each(
			function() {
				var frm    = this;
				var pId    = frm['id'].value;
				var editor = tinymce.get('desc_'+pId);
				if( editor !== null && editor.isDirty() ) {
					frm['id'].checked = true;
				}
			}
		);
	}
	
	$( tbl + ' tbody form input[name="id"]:checked').each(
		function() {
			var frm  = this.form;
			var pId  = frm['id'].value;
			var desc = ( wbte_object.disable_description !== 'yes' ) ? wp.editor.getContent('desc_'+pId) : '';
			
			var frm_data = { id: frm['id'].value,
				stock: frm['stock'].value, price: frm['price'].value,
				saleprice: frm['saleprice'].value, salefrom: frm['salefrom'].value, saleto: frm['saleto'].value,
				salefrom_time: frm['salefrom_time'].value, saleto_time: frm['saleto_time'].value,
				name: frm['product_name'].value, name_update: frm['name_update'].value, description: desc
			};
			if ( custom_col_active && show_sku_home === 'no' ) {
				frm_data['customprice'] = frm['customprice'].value;
			} else if ( show_sku_home === 'yes' ) {
				frm_data['sku'] = frm['sku'].value;
			}
			if ( 'yes' === vendor_active ) {
				frm_data['vendor'] = frm['vendor_selected'].value;
			}
			json_data.rows.push( frm_data );
			count++;
			if ( count === 1 ) {
				jQuery( '#saveall' ).attr( 'disabled', true );
				jQuery( '#saveall_foot' ).attr( 'disabled', true );
			}

			if( count === 80 ) {
				sendJson( ajaxurl, json_data );
				json_data.rows = [];
				count = 0;
				setTimeout(function(){console.log(p_count);},800);
			}
			
			if ( p_count === 1 ) {
				progressBar('start');
			}
			p_count++;
		
		}
	);


	$.ajax(
		{
			type: 'POST',
			url: ajaxurl,
			datatype: 'json',
			data: json_data,
			success: function( response ) {
				console.log( response );
				rescount++;
				if (rescount > 0) {
					jQuery( '#saveall' ).attr( 'disabled', false );
					jQuery( '#saveall_foot' ).attr( 'disabled', false );
					var ms = ( p_count >= 100 ) ? 3000 : 500;
					reloadPage( ms );
				}
			},
			error: function( response ){
				progressBar('stop');
				console.log( response );
			}
		}
	);
	

	event.preventDefault();

};


function saveAllExt() {

	var count         = 0;
	var p_count       = 0;
	var rescount      = 0;
	var nonce_val     = $( '#_wpnonce' ).val();
	var json_data     = { action: 'wbte_update_table_rows_ext_data', nonce: nonce_val, rows: [] };

	//Check if description is changed
	if ( wbte_object.disable_description !== 'yes' ) {
		$( tbl_ext + ' tbody form').each(
			function() {
				var frm    = this;
				var pId    = frm['id'].value;
				var editor = tinymce.get('desc_'+pId);
				if( editor !== null && editor.isDirty() ) {
					frm['id'].checked = true;
				}
			}
		);
	}
	
	$( tbl_ext + ' tbody form input[name="id"]:checked' ).each(
		function() {
		
			var frm  = this.form;
			var pId  = frm['id'].value;
			var desc = ( wbte_object.disable_description !== 'yes' ) ? wp.editor.getContent('desc_'+pId) : '';
			
			var frm_data = { id: frm['id'].value,
				featured: frm['featured'].value, sku: frm['sku'].value,
				backorder: frm['backorder'].value, instock: frm['instock'].value, weight: frm['weight'].value,
				length: frm['_length'].value, width: frm['width'].value, height: frm['height'].value,
				tags: frm['tags'].value, visibility: frm['visibility'].value,
				name: frm['product_name'].value, name_update: frm['name_update'].value,
				product_img: frm['product_img'].value, parent_id: frm['parent_id'].value,
				description: desc
			};
			
			json_data.rows.push( frm_data );
			count++;
			if ( count === 1 ) {
				jQuery( '#saveallExt' ).attr( 'disabled', true );
				jQuery( '#saveall_foot_ext' ).attr( 'disabled', true );
			}

			if( count === 50 ) {
				sendJson( ajaxurl, json_data );
				json_data.rows = [];
				count = 0;
				setTimeout(function(){console.log(p_count);},1000);
			}

			if ( p_count === 1 ) {
				progressBar('start');
				jQuery('.wbte-bulk-images').css('display','none');
			}
			p_count++;

		}
	);

	$.ajax(
		{
			type: 'POST',
			url: ajaxurl,
			datatype: 'json',
			data: json_data,
			success: function( response ) {
				console.log( response );
				rescount++;
				if (rescount > 0) {
					jQuery( '#saveallExt' ).attr( 'disabled', false );
					jQuery( '#saveall_foot_ext' ).attr( 'disabled', false );
					var ms = ( p_count >= 100 ) ? 3000 : 800;
					reloadPage( ms );
				}
			},
			error: function( response ){
				progressBar('stop');
				console.log( response );
				jQuery( '#saveallExt' ).attr( 'disabled', false );
				jQuery( '#saveall_foot_ext' ).attr( 'disabled', false );
				jQuery('.wbte-bulk-images').css('display','block');
			}
		}
	);
	

	event.preventDefault();

};

function sendJson( ajaxurl, json_data ) {

	$.ajax(
		{
			type: 'POST',
			url: ajaxurl,
			datatype: 'json',
			data: json_data,
			success: function( response ) {
				console.log( response );
			},
			error: function( response ){
				console.log( response );
			}
		}
	);

}

function reloadPage( msec ) {

	setTimeout(
		function() {
			location.reload();
		},
		msec
	);

}

function setSalesDate( obj ) {

	if ( ! obj ) {
		return;
	}

	$( tbl + ' tbody form' ).each(
		
		function() {
			if ( obj.id === 'datep_from' ) {
				this[ 'salefrom' ].value = obj.value;
			}
			if ( obj.id === 'datep_to' ) {
				this[ 'saleto' ].value = obj.value;
			}
		}
	);

	$( '#saveall' ).css( 'color', aColor );
	$( '#checkall' ).prop( 'checked', true );

	checkAll();

}

function setSalesTime( obj ) {
	
	if ( ! obj ) {
		return;
	}

	$( tbl + ' tbody form' ).each(
		
		function() {
			if ( obj.id === 'datep_from_time' ) {
				this[ 'salefrom_time' ].value = obj.value;
			}
			if ( obj.id === 'datep_to_time' ) {
				this[ 'saleto_time' ].value = obj.value;
			}
		}
	);

	$( '#saveall' ).css( 'color', aColor );
	$( '#checkall' ).prop( 'checked', true );

	checkAll();
}

function calcChanged( ft ) {

	var tot         = sum_col;
	var is_checkbox = ( this.name === 'id' ) ? true : false;
	var is_inputbox = ( this.type === 'number' || this.type === 'text' || this.type === 'time' || this.type === 'select-one' || this.type === 'textarea' ) ? true : false;
	var ftv         = ( ft === true ) ? true : false;

	if ( ! ftv ) {
		if ( is_checkbox ) {
			$( this ).prop( 'checked', this.checked );
		}

		if ( is_inputbox ) {
			this.form['id'].checked = true;
		}

	} else {
		findSalePricePercent();
	}

	$( '#saveall' ).css( 'color', aColor );

	//Stock and stock value
	wbteCalculateFooterTotals();

}

function wbteCalculateFooterTotals() {
	
	if ( $( tbl + ' tbody tr:visible' ).length > 0 ) {
		var stock_sum = 0;
		var total_sum = 0;
		$( tbl + ' tbody tr:visible' ).each( function() {
			var frm   = this.children[0].children[0];
			var items = frm.elements;
			stock_sum += ( items['stock'].value !== '' ) ? parseInt( items['stock'].value ) : 0;
			total_sum += ( items['totcol'].value !== '' ) ? parseFloat( items['totcol'].value ) : 0;
		});
		$( '#tbl-total-f' ).text( parseFloat( total_sum ).toFixed(2) );
		$( '#tbl-total-s' ).text( stock_sum );
		
	}
}

function extChanged() {

	if ( this.name === 'featured' ) {
		if ( $(this).prop('checked') === true ) {
			$( this ).val( 1 );
		} else {
			$( this ).val( '' );
		}
	}

	if ( this.name !== 'id' ) {
		this.form['id'].checked = true;
	}

}


function changeCalcType( calcType, customCalculation ){

	$( tbl ).tableCalc( 'calculate', calcType, customCalculation );
	calcChanged();

};

function calcSpecial( i, o, id ) {

	var sign    = '+';
	var in_val  = Number( $( '#' + id ).val() );
	var in_type = $( '#' + id + '_type option:selected' ).val();

	if ( in_val === 0 && in_type !== 'round_up' && in_type !== 'round_down' && in_type !== 'round_two' ) {

		if ( in_type === 'prev_price' || in_type === 'clear_price' || in_type === 'prev_sale_price' ) {
			wbteFixPrice( in_type );
		}
		$( '#' + id + '_type' ).val( '0' );

		return;
	}

	var calctype = '';

	switch ( in_type ) {
		case '0':
			break;
		case 'up_p':
			sign     = '+';
			calctype = 'percent';
			break;
		case 'up_s_p': //Saleprice
			sign     = '+';
			calctype = 'percent';
			i        = 2; //tablecalc number
			break;
		case 'up_n':
			sign     = '+';
			calctype = 'number';
			break;
		case 'up_s_n': //Saleprice
			sign     = '+';
			calctype = 'number';
			i        = 2;
			break;
		case 'down_p':
			sign     = '-';
			calctype = 'percent';
			break;
		case 'down_s_p': //Saleprice
			sign     = '-';
			calctype = 'percent';
			i        = 2;
			break;
		case 'down_n':
			sign     = '-';
			calctype = 'number';
			break;
		case 'down_s_n': //Saleprice
			sign     = '-';
			calctype = 'number';
			i        = 2;
			break;
		case 'fix_n':
			sign     = '=';
			calctype = 'number';
			break;
		case 'round_up':
			sign     = 'u';
			calctype = 'round';
			break;
		case 'round_down':
			sign     = 'd';
			calctype = 'round';
			break;
		case 'round_two':
			sign     = 't';
			calctype = 'round';
			break;

	}

	$( '#' + id ).val( '' );
	$( '#' + id + '_type' ).val( '0' );

	var percent = 1.0;
	if ( sign === '+' ) {
		percent = percent + in_val / 100;
	} else if ( sign === '-' ) {
		percent = percent - in_val / 100;
	}
	var formula = '(0:' + i + '*' + percent + ')==0:' + o + '';

	if ( calctype === 'number' ) {
		if ( sign === '=' ) {
			var c = o - 2;
			switch(o){
				case 7:
					c = 3;
					break;
				case 8:
					c = 4;
					break;
			}
			formula = '(0:' + c + '*' + 0 + '+' + in_val + ')==0:' + o + '';
		} else {
			formula = '(0:' + i + sign + in_val + ')==0:' + o + '';
		}
	}

	if ( calctype === 'round' ) {
		roundNumbers( o, sign );
	} else {
		$( tbl ).tableCalc( 'calculate', 'c', formula );
	}

	$( tbl ).tableCalc( 'calculate', 'c', '(0:0 * 0:1)' );

	if ( 'sale_price_select' === id ) {
		findSalePricePercent();
	}

	if ( $( tbl + ' tbody tr:visible' ).length > 0 ) {
		$( '#tbl-total-f' ).text( $( tbl ).tableCalc( 'getSum', sum_col ) );
	}

	$( '#saveall' ).css( 'color', aColor );
	$( '#checkall' ).prop( 'checked', true );

	checkAll();

};

function wbteFixPrice( element ) {
	
	//if checked items before bulk calculate - do only caclulations for those
	var chkd     = $( '#wbtetable tbody tr input[name="id"]:checked' );
	var onlyChkd = (chkd.length > 0) ? ' input[name="id"]:checked' : '';

	//editor home
	$( '#wbtetable tbody tr' + onlyChkd ).each(
		function() {
			var is_visible   = this.style.display;
			var frm          = (chkd.length > 0) ? this.form : this.children[0].children[0];
			var frm_elements = frm.elements;

			if ( '' === is_visible ) {

				if ( 'prev_price' === element ) {

					if ( frm_elements['prev_price'].value > 0 ) {
						//Copy prev price
						frm_elements['price'].value = frm_elements['prev_price'].value;
						
						//Changed
						$( frm_elements['id'] ).prop( 'checked', true );
					}

				} else if ( 'clear_price' === element ) {
					
					//Clear price
					frm_elements['price'].value = '';
					
					//Changed
					$( frm_elements['id'] ).prop( 'checked', true );
					
				} else if ( 'prev_sale_price' === element ) {
					
					if ( frm_elements['prev_sale_price'].value > 0 ) {

						//Copy prev sale price
						frm_elements['saleprice'].value = frm_elements['prev_sale_price'].value;
						
						//Changed
						$( frm_elements['id'] ).prop( 'checked', true );

					}
				}

			}
		}
	);

	if ( 'prev_sale_price' === element ) {
		//Calculate sale percent
		findSalePricePercent();
	}
}


function bulkSetValues( id, the_table ) {
	
	var view      = $( '#form-gs-view' ).val();
	var in_val    = $( '#' + id ).val();
	var in_type   = $( '#' + id + '_type option:selected' ).val();
	var table     = tbl;
	var delimiter = wbte_object.sku_delimiter;

	$( '#' + id ).val( '' );
	$( '#' + id + '_type' ).val( '0' );

	if ( the_table === 'ext' ) {
		table = tbl_ext;
	}
	var is_changed = false;

	//if checked items before bulk calculate - do only caclulations for those
	var chkd     = $( table + ' tbody tr input[name="id"]:checked' );
	var onlyChkd = (chkd.length > 0) ? ' input[name="id"]:checked' : '';

	$( table + ' tbody tr' + onlyChkd ).each(
		function() {
			var is_visible   = this.style.display;
			var frm          = (chkd.length > 0) ? this.form : this.children[0].children[0];
			var frm_elements = frm.elements;

			if ( '' === is_visible ) {

				switch ( id ) {
					case 'featured_select':
						if ( in_type === 'yes' ) {
							$( frm_elements['featured'] ).prop( 'checked', true );
							frm_elements['featured'].value = '1';
						} else {
							$( frm_elements['featured'] ).prop( 'checked', false );
							frm_elements['featured'].value = '';
						}
						break;
					case 'sku_select':
						if ( in_type === 'replace' ) {
							frm_elements['sku'].value = in_val;
						} else if ( in_type === 'add-after' ) {
							frm_elements['sku'].value += in_val; 
						} else if ( in_type === 'add-before' ) {
							frm_elements['sku'].value = in_val + frm_elements['sku'].value;
						} else if ( in_type === 'add-id-after' ) {
							frm_elements['sku'].value += delimiter + frm_elements['id'].value; 
						} else if ( in_type === 'add-id-before' ) {
							frm_elements['sku'].value = frm_elements['id'].value + delimiter + frm_elements['sku'].value;	
						} else if ( in_type === 'add-weight' ) {
							frm_elements['sku'].value += delimiter + frm_elements['weight'].value; 
						} else if ( in_type === 'add-length' ) {
							frm_elements['sku'].value += delimiter + frm_elements['_length'].value;
						} else if ( in_type === 'add-width' ) {
							frm_elements['sku'].value += delimiter + frm_elements['width'].value;
						} else if ( in_type === 'add-height' ) {
							frm_elements['sku'].value += delimiter + frm_elements['height'].value;
						} else if ( in_type === 'clear' ) {
							frm_elements['sku'].value = '';
						} else if ( in_type === 'generate' ) {
							frm_elements['sku'].value = generateSku(frm_elements['product_name'].value, delimiter);
						} else if ( in_type === 'toupper' ) {
							frm_elements['sku'].value = frm_elements['sku'].value.toUpperCase();
						} else if ( in_type === 'tolower' ) {
							frm_elements['sku'].value = frm_elements['sku'].value.toLowerCase();
						}
						break;
					case 'tags_select':
						if ( in_type === 'add' ) {
							if ( frm_elements['tags'].value.trim() === '' ) {
								frm_elements['tags'].value += in_val;
							} else {
								frm_elements['tags'].value += ', ' + in_val;
							}
						} else if ( in_type === 'toupper' ) {
							frm_elements['tags'].value = frm_elements['tags'].value.toUpperCase(); 
						} else if ( in_type === 'tolower' ) {
							frm_elements['tags'].value = frm_elements['tags'].value.toLowerCase(); 
						} else if ( in_type === 'clear' ) {
							frm_elements['tags'].value = ''; 
						} else if ( in_type === 'replace' ) {
							frm_elements['tags'].value = in_val; 
						}
						break;
					case 'weight_select':
						var current = frm_elements['weight'].value || '0';
						frm_elements['weight'].value = getMeasure( in_type, in_val, current );
						break;
					case 'length_select':
						var current = frm_elements['_length'].value || '0';
						frm_elements['_length'].value = getMeasure( in_type, in_val, current );
						break;
					case 'width_select':
						var current = frm_elements['width'].value || '0';
						frm_elements['width'].value = getMeasure( in_type, in_val, current );
						break;
					case 'height_select':
						var current = frm_elements['height'].value || '0';
						frm_elements['height'].value = getMeasure( in_type, in_val, current );
						break;
					case 'backorder_select':
						$( frm_elements['backorder'] ).val(in_type).change();
						break;
					case 'instock_select':
						$( frm_elements['instock'] ).val(in_type).change();
						break;
					case 'visibility_select':
						$( frm_elements['visibility'] ).val(in_type).change();
						break;
					case 'vendor_select':
						$( frm_elements['vendor_selected'] ).val(in_type).change();
						break;	
				}
				
				function getMeasure( type, value, oldvalue ) {
					var retval = 0;
					switch ( type ) {
						case 'fix_n':
							retval = value;
							break;
						case 'up_n':
							retval = eval( parseFloat( oldvalue ) + parseFloat( value ) );
							break;
						case 'down_n':
							retval = eval( parseFloat( oldvalue ) - parseFloat( value ) );
							break;
						case 'clear':
							retval = '';
					}
					return retval;
				}

				function generateSku( name, delimiter ) {
					
					if ( name === undefined || name === '' ) {
						return '';
					}

					var sku_count   = ( parseInt( wbte_object.sku_count ) > 0 ) ? parseInt( wbte_object.sku_count ) : 3;
					var isVariation = name.search(',');
					var nameArr     = ( isVariation === -1 ) ? name.split( ' ' ) : name.split(',');
					var retval      = '';
					if ( nameArr.length > 0 ) {
						for ( var i = 0; i < nameArr.length; i++ ) {
							retval += nameArr[i].trim().substring( 0, sku_count ) + delimiter;
						}
						retval = retval.substring( 0, parseInt(retval.length - 1) );
					} else {
						retval = name.substring( 0, sku_count );
					}
					return retval;
				}

				//Row changed = true
				$( frm_elements['id'] ).prop( 'checked', true );
				is_changed = true;
			} else {
				//Not changed
				$( frm_elements['id'] ).prop( 'checked', false );
			}
		}
	)
	if (is_changed) {
		$( '#checkall' ).prop( 'checked', true );
		checkAll();
	}
	

}

function roundNumbers( column, sign ) {

	var table = $( tbl + ' tbody tr' );

	table.each(
		function() {
			var rValue = this.children[column].children[0].value;
			var rOut   = 0;
			switch ( sign ) {
				case 'd':
					rOut = Number(Math.floor(rValue)).toFixed(2);
					break;
				case 'u':
					rOut = Number(Math.ceil(rValue)).toFixed(2);
					break;
				case 't':
					rOut = Number(rValue).toFixed(1);
					break;
			}

			var newValue = Number(rOut).toFixed(2);
			if ( Number(rOut) === 0 ) {
				newValue = '';
			}
			
			this.children[column].children[0].value = newValue;
		}
	)
}

function rowSearch(){

	var view  = $( '#form-gs-view' ).val();
	var input = $( '#product_search' ).val();
	var table = $( tbl + ' tbody tr' );
	var radio = $( "input[name='stype']:checked" ).val();
	var arr   = [];

	//Clear filters
	if( $('#sales_filter option:selected').val() !== '') {
		$('#sales_filter').val('');
	}
	if( $('#tags-filter option:selected').val() !== '') {
		$('#tags-filter').val('');
	}

	if ( view === 'ext' ) {
		table = $( tbl_ext + ' tbody tr' );
	}

	var current_table = (view === 'ext') ? tbl_ext : tbl;
	
	//make sure no checked rows
	if ( input.length > 0 ) {
		$( current_table + ' tbody tr input[name="id"]' ).prop('checked',false);
	}

	if ( radio === 'rows' ) {
		if ( input.length > 0 ) {
			input = input.toLowerCase().replace( ',', '' );
			arr   = input.split( ' ' );
		}
		table.each(
			function() {
				var textValue     = this.children[1].children[0].children[0].value;
				var skuPriceValue = this.children[3].children[0].value;
				var desc          = '';//this.children[1].children[0].children[2].value;
				var sku           = this.children[1].children[0].children[3].children[1].innerText;
				if (textValue.length > 0) {
					var txt   = textValue.toLowerCase();
					sku       = ( sku.length > 5 ) ? sku.toLowerCase().split(':')[1] : ''; 
					var count = 0;
					for( var i = 0; i < arr.length; i++ ) {
						if ( txt.match( arr[i] ) || 
							 skuPriceValue.toLowerCase().match( arr[i] ) || 
							 desc.toLowerCase().match( arr[i] ) || 
							 sku.match( arr[i] )
							 ) {
							count++;
						} 
					}
					if ( count === arr.length ) {
						this.style.display = '';
					} else {
						this.style.display = 'none';
					}
				} 
			}
		)
		
		//Count rows
		wbteCountProducts(current_table);

		//Stock and stock value
		wbteCalculateFooterTotals();
	} 
}

function radioChange() {

	var radio = $( "input[name='stype']:checked" ).val();

	if ( radio === 'rows' ) {
		$( 'form #btnsearch' ).attr( 'disabled', true );
	} else {
		$( 'form #btnsearch' ).attr( 'disabled', false );
	}

}

function rowSearchChange( obj ){

	var searchVal = $(obj).closest('form').find( "input[name='product_search']" ).val();
	var radio     = $(obj).closest('form').find( "input[name='stype']:checked" ).val();

	if ( 'rows' === radio ) {
		$('#wbte-pages').find('a').each(function(){
			var url    = $(this).attr('href');
			var newUrl = url.replace( /\&row_search\=.*/i, '' );
			$(this).attr('href', newUrl + '&row_search='+searchVal);
		});
	}

}

function sortTable( table, order ) {
	
	var sort  = 'asc';
	var tbody = table.find( 'tbody' );
	if ( order !== 'asc' ) {
		sort = '';
	}

    tbody.find('tr').sort(function(a, b) {
		var a1 = a.children[1].children[0].value;
		var b1 = b.children[1].children[0].value;
	
        if ( sort === 'asc' ) {
			return a1.localeCompare(b1);
        } else {
			return b1.localeCompare(a1);
        }
	}).appendTo(tbody);
	
}

function wbteCountProducts( wbte_table ) {

	var table    = $( wbte_table + ' tbody tr:visible' );
	var prod     = 0;
	var prod_var = 0;

	table.each(
		function() {
			
			var td = this.children[1].children[0].children[0].type;
			if ( td === 'hidden' ) {
				prod_var++;
			} else {
				prod++;
			}
			
		}
	);

	$('#wbte-prod-count').text( wbte_object.products + ': ' + prod + ' | ' + wbte_object.variations + ': ' + prod_var );
}

function findSalePricePercent() {
	
	var table = $( tbl + ' tbody form' );

	table.each(
		function() {
			calcPercent( this, true );
		}
	);
}

function calcPercent( obj, isForm = false ) {

	var form;

	if ( isForm ) {
		form = obj;
	} else {
		form = obj.form;
	}

	var price      = form['price'].value;
	var sale_price = form['saleprice'].value;

	if ( parseFloat(price) > 0 && parseFloat(sale_price) > 0 ) {
		var percent = eval( ( price - sale_price ) * 100 / price );
		form['salepercent'].value = String( Number( percent ).toFixed(0) ) + '% ';
		if ( percent < 0 ) {
			form['salepercent'].style.color = 'red';
		} else {
			form['salepercent'].style.color = 'black';
		}
	}

}

function progressBar( option ) {
	
	if (option === 'start') {
		$('#wbte-saving').removeClass('wbte-saving').addClass('wbte-saving-show');
		var v = 0;
		
		setInterval(
			function() {
				if ( v > 100) {
					v = 0;
				}
				$('#pbar-saving').val(v);
				v += 5;
			},
			50
		);
	} else {
		$('#wbte-saving').removeClass('wbte-saving-show').addClass('wbte-saving');
	}

}

function openMediaLib( product_id ) {
	
	event.preventDefault();
	var frame;
	var id       = product_id;
	var w_title  = wbte_object.media_lib_title;
	var w_button = wbte_object.media_lib_button;
	
	if ( frame ) {
		frame.open();
		return;
	}

	frame = wp.media.frames.wbte = wp.media({
		title: w_title,
		multiple: false,
		library: {
			type: 'image'
		},
		button: {
			text: w_button
		},
	});

	frame.on( 'select', function() {
		var attachment = frame.state().get('selection').first();
		var url        = attachment.attributes.url;
		jQuery( '#product_img_' + id ).val( attachment.attributes.id );
		jQuery( '#product_img_' + id ).closest('td').find('img').attr( 'src', url );
		jQuery( '#product_img_' + id ).closest('tr').find('input[name="id"]').prop( 'checked', true );
	});

	frame.open();

}

function wbteRemoveThumbnail( id ) {
	$( '#product_img_' + id ).val( '' );
	$( '#product_img_' + id ).closest('td').find('img').attr( 'src', '' );
	$( '#product_img_' + id ).closest('tr').find('input[name="id"]').prop( 'checked', true );
	event.preventDefault();
}

function wbteBulkRemoveImages() {
	
	$( tbl_ext + ' tbody tr' ).each(
		function() {
			var form = this.children[0].children[0];
			var id   = form['product_img'].id;
			if ( this.style.display === '' ) {
				$('#'+id).val('');
				$('#'+id).closest('td').find('img').attr( 'src', '' );
				$('#'+id).closest('tr').find('input[name="id"]').prop( 'checked', true );
			}
		}
	);

}
function wbteBulkSetImages() {
	
	event.preventDefault();
	var frame;
	var txtTitle  = wbte_object.media_lib_title;
	var txtButton = wbte_object.media_lib_button;
	
	if ( frame ) {
		frame.open();
		return;
	}

	frame = wp.media.frames.wbtebulk = wp.media({
		title: txtTitle,
		multiple: false,
		library: {
			type: 'image'
		},
		button: {
			text: txtButton
		},
	});

	frame.on( 'select', function() {
		var attachment = frame.state().get('selection').first();
		var url        = attachment.attributes.url;
		jQuery( tbl_ext + ' tbody tr' ).each(
			function() {
				var form = this.children[0].children[0];
				var id   = form['product_img'].id;
				if ( this.style.display === '' ) {
					jQuery('#'+id).val(attachment.attributes.id);
					jQuery('#'+id).closest('td').find('img').attr( 'src', url );
					jQuery('#'+id).closest('tr').find('input[name="id"]').prop( 'checked', true );
				}
			}
		);
	});

	frame.open();
}

function wbteChangeSearchUrl() {

	var option = $('#sales_filter option:selected').val();

	$('#wbte-pages').find('a').each(function(){
		var url    = $(this).attr('href');
		var newUrl = url.replace( /\&sales_filter\=.*/i, '' ).replace( /\&tags-filter\=.*/i, '' );
		$(this).attr( 'href', newUrl + '&sales_filter=' + option );
	});

	//Set filter for category dropdown
	$('#wbte-cat-select').find('input[name="sales_filter"]').val(option);

}

function wbteFilterSales() {

	var option = $('#sales_filter option:selected').val();
	var view   = $( '#form-gs-view' ).val();
	var table  = tbl;

	if ( view === 'ext' ) {
		table = tbl_ext;
	}

	if( $('#tags-filter option:selected').val() !== '') {
		$('#tags-filter').val('');
	}

	$( table + ' tbody tr' ).each(
		function() {
			var form  = this.children[0].children[0];
			var sale  = form['saleprice'].value;

			if ( 'onSale' === option ) {
				if ( sale > 0 ) {
					this.style.display = '';
				} else {
					this.style.display = 'none';
				}
			} else if ( 'noSale' === option ) {
				if ( sale === '' ) {
					this.style.display = '';
				} else {
					this.style.display = 'none';
				}
			} else {
				this.style.display = '';
			}

		}
	);

	wbteChangeSearchUrl();

}

function wbteChangeTagsUrl() {

	var option = $('#tags-filter option:selected').val();

	$('#wbte-pages').find('a').each(function(){
		var url    = $(this).attr('href');
		var newUrl = url.replace( /\&tags-filter\=.*/i, '' ).replace( /\&sales_filter\=.*/i, '' );
		$(this).attr( 'href', newUrl + '&tags-filter=' + option );
	});

}

function wbteFilterTags() {

	var option = $('#tags-filter option:selected').val();
	var view   = $( '#form-gs-view' ).val();
	var table  = tbl;

	if ( view === 'ext' ) {
		table = tbl_ext;
	}

	if( $('#sales_filter option:selected').val() !== '') {
		$('#sales_filter').val('');
	}

	$( table + ' tbody tr' ).each(
		function() {
			var form = this.children[0].children[0];
			var tags = form['tags'].value;
			
			if ( option.length > 0 ) {
				var found = tags.indexOf( option );
				if (found !== -1) {
					this.style.display = '';
				} else {
					this.style.display = 'none';
				}
			} else {
				this.style.display = '';
			}
		}
	);

	wbteChangeTagsUrl();
}

function wbte_hide_desc(id) {
	event.preventDefault();
	$('#wbte_desc_'+id).removeClass('wbte-prod-desc').addClass('wbte-prod-desc-hide');
	$('#btn_desc_'+id).removeClass('btn-desc').addClass('btn-desc-hide');
	$('#wbte_ul_desc_'+id).removeClass('wbte-ul-info').addClass('wbte-ul-info-hide');
}

function wbte_show_desc(id) {
	event.preventDefault();
	var is_visible = ( 'wbte-prod-desc' === $('#wbte_desc_'+id).prop('class') ) ? true : false;
	if ( ! is_visible ) {
		$('#wbte_desc_'+id).removeClass('wbte-prod-desc-hide').addClass('wbte-prod-desc');
		$('#btn_desc_'+id).removeClass('btn-desc-hide').addClass('btn-desc');
		$('#wbte_ul_desc_'+id).removeClass('wbte-ul-info-hide').addClass('wbte-ul-info');
		
		//Add WP Editor
		if ( wbte_object.disable_description !== 'yes' ){
			wp.editor.initialize( 'desc_' + id );
		}

	} else {
		$('#wbte_desc_'+id).removeClass('wbte-prod-desc').addClass('wbte-prod-desc-hide');
		$('#btn_desc_'+id).removeClass('btn-desc').addClass('btn-desc-hide');
		$('#wbte_ul_desc_'+id).removeClass('wbte-ul-info').addClass('wbte-ul-info-hide');
	}
}

function wbte_show_hide_desc() {
	var is_checked = $('#wbte-chk-show-desc').prop('checked');
	if (is_checked) {
		$('table div .wbte-prod-desc-hide').removeClass('wbte-prod-desc-hide').addClass('wbte-prod-desc');
		$('table button[name="btn_desc"]').removeClass('btn-desc-hide').addClass('btn-desc');
		$('table ul').removeClass('wbte-ul-info-hide').addClass('wbte-ul-info');

		//Add WP Editor
		if ( wbte_object.disable_description !== 'yes' ){
			$('table tbody form').each( function() {
				var frm  = this;
				var pId  = frm['id'].value;
				wp.editor.initialize( 'desc_' + pId );
			});
		}

	} else {
		$('table div .wbte-prod-desc').removeClass('wbte-prod-desc').addClass('wbte-prod-desc-hide');
		$('table button[name="btn_desc"]').removeClass('btn-desc').addClass('btn-desc-hide');
		$('table ul').removeClass('wbte-ul-info').addClass('wbte-ul-info-hide');
	}
}

function wbte_reset_table_values() {
	var view  = $( '#form-gs-view' ).val();
	var table = ( 'ext' === view ) ? tbl_ext : tbl;

	$( table + ' tbody form input[name="id"]:checked' ).each( function () {
		$(this.form)[0].reset();
		if ( 'ext' !== view ) {
			this.form['totcol'].value = ( this.form['stock'].value > 0 && this.form['price'].value > 0 ) ? ( parseFloat( this.form['stock'].value ) * parseFloat( this.form['price'].value ) ).toFixed(2) : '';
		}
	});

	$( '#saveall' ).css( 'color', '' );
	$( '#saveall-foot' ).css( 'color', '' );
}
