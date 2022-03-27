/*!
 * accounting.js v0.4.2, copyright 2014 Open Exchange Rates, MIT license, http://openexchangerates.github.io/accounting.js
 */
(function(p,z){function q(a){return!!(""===a||a&&a.charCodeAt&&a.substr)}function m(a){return u?u(a):"[object Array]"===v.call(a)}function r(a){return"[object Object]"===v.call(a)}function s(a,b){var d,a=a||{},b=b||{};for(d in b)b.hasOwnProperty(d)&&null==a[d]&&(a[d]=b[d]);return a}function j(a,b,d){var c=[],e,h;if(!a)return c;if(w&&a.map===w)return a.map(b,d);for(e=0,h=a.length;e<h;e++)c[e]=b.call(d,a[e],e,a);return c}function n(a,b){a=Math.round(Math.abs(a));return isNaN(a)?b:a}function x(a){var b=c.settings.currency.format;"function"===typeof a&&(a=a());return q(a)&&a.match("%v")?{pos:a,neg:a.replace("-","").replace("%v","-%v"),zero:a}:!a||!a.pos||!a.pos.match("%v")?!q(b)?b:c.settings.currency.format={pos:b,neg:b.replace("%v","-%v"),zero:b}:a}var c={version:"0.4.1",settings:{currency:{symbol:"$",format:"%s%v",decimal:".",thousand:",",precision:2,grouping:3},number:{precision:0,grouping:3,thousand:",",decimal:"."}}},w=Array.prototype.map,u=Array.isArray,v=Object.prototype.toString,o=c.unformat=c.parse=function(a,b){if(m(a))return j(a,function(a){return o(a,b)});a=a||0;if("number"===typeof a)return a;var b=b||".",c=RegExp("[^0-9-"+b+"]",["g"]),c=parseFloat((""+a).replace(/\((.*)\)/,"-$1").replace(c,"").replace(b,"."));return!isNaN(c)?c:0},y=c.toFixed=function(a,b){var b=n(b,c.settings.number.precision),d=Math.pow(10,b);return(Math.round(c.unformat(a)*d)/d).toFixed(b)},t=c.formatNumber=c.format=function(a,b,d,i){if(m(a))return j(a,function(a){return t(a,b,d,i)});var a=o(a),e=s(r(b)?b:{precision:b,thousand:d,decimal:i},c.settings.number),h=n(e.precision),f=0>a?"-":"",g=parseInt(y(Math.abs(a||0),h),10)+"",l=3<g.length?g.length%3:0;return f+(l?g.substr(0,l)+e.thousand:"")+g.substr(l).replace(/(\d{3})(?=\d)/g,"$1"+e.thousand)+(h?e.decimal+y(Math.abs(a),h).split(".")[1]:"")},A=c.formatMoney=function(a,b,d,i,e,h){if(m(a))return j(a,function(a){return A(a,b,d,i,e,h)});var a=o(a),f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format);return(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal))};c.formatColumn=function(a,b,d,i,e,h){if(!a)return[];var f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format),l=g.pos.indexOf("%s")<g.pos.indexOf("%v")?!0:!1,k=0,a=j(a,function(a){if(m(a))return c.formatColumn(a,f);a=o(a);a=(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal));if(a.length>k)k=a.length;return a});return j(a,function(a){return q(a)&&a.length<k?l?a.replace(f.symbol,f.symbol+Array(k-a.length+1).join(" ")):Array(k-a.length+1).join(" ")+a:a})};if("undefined"!==typeof exports){if("undefined"!==typeof module&&module.exports)exports=module.exports=c;exports.accounting=c}else"function"===typeof define&&define.amd?define([],function(){return c}):(c.noConflict=function(a){return function(){p.accounting=a;c.noConflict=z;return c}}(p.accounting),p.accounting=c)})(this);

(function($){

    "use strict"

    $(document).on( 'svx-fields-on-screen', function() {
		if ( $('#price_commander-option').length>0 ) {
			check_int();
		}
	} );

    $(document).on( 'change', function(e) {
        if (e.target && e.target.matches('.pc-pagination') ) {
            _call_ajax_pagination(e);
        }

        if (e.target && e.target.matches('#pc-operand') ) {
            _call_preview_change(e);
        }

        if (e.target && e.target.matches('#pc-per-page') ) {
            if ( pc.query.posts_per_page !== $('#pc-per-page').val() ) {
                pc.query.paged = 1;
                pc.query.posts_per_page = $('#pc-per-page').val();
                get_products({});
            }
        }

        if (e.target && e.target.matches('#pc-orderby') ) {
            if ( pc.query.orderby !== $('#pc-orderby').val() ) {
                pc.query.paged = 1;
                pc.query.orderby = $('#pc-orderby').val();
                get_products({});
            }
        }

        if ( e.target && e.target.matches('#pc-search') ) {
            _call_search(e);
        }
    } );

    $(document).on( 'keyup', function(e) {
        if (e.target && e.target.matches('#pc-operand') ) {
            _call_preview_change(e);
        }

        if ( $('#pc-change-value').length>0 ) {
            if ( e.keyCode == 27 ) {
                return _close_change_price();
            }
            if ( e.keyCode == 9 || e.keyCode == 13 ) {
                return _call_confirm_change_price(e);
            }
        }

        if (e.target && e.target.matches('#pc-search') ) {
            _call_search(e);
        }
    } );

    $(document).on( 'pc-double-click', function(e) {
        if (e.target && e.target.matches('.pc-price')) {
            return _change_price(e);
        }
    } );

    $(document).on( 'click', function(e) {

        if ( $('#pc-change-value').length>0 ) {
            if (e.target && e.target.matches('.pc-price.pc-active.pc-change-price') || e.target.matches('#pc-change-value') ) {
                $('#pc-change-value').focus();
                return;
            }
    
            if (e.target && !e.target.matches('.pc-price.pc-active.pc-change-price') ) {
                return _call_confirm_change_price(e);
            }
        }
        
        if (e.target && e.target.matches('.pc-price')) {
            if ( editPrice && editPrice.parentNode.dataset.id == e.target.parentNode.dataset.id && editPrice.dataset.type == e.target.dataset.type ) {
                return _change_price(e);
            }

            if ( editPrice === false ) {
                editPrice = e.target;

                setTimeout( function() {
                    editPrice = false;
                }, 500 );
            }
            
            _select_price(e);

            _call_preview_change(e);
        }

        if (e.target && e.target.matches('.pc-checkbox')) {
            _make_command_selection(e);
            
            _call_preview_change(e);
        }

        if (e.target && e.target.matches('#pc-execute-command') ) {
            _call_ajax_execute_command(e,false);
        }

        if (e.target && e.target.matches('#pc-clear-selection') ) {
            _clears();
            
            get_products(false);
        }

        if (e.target && e.target.matches('#pc-reset-operands') ) {
            _reset_operands(e);
        }

        if (e.target && e.target.matches('.pc-schedule') ) {
            _call_schedule(e);
        }

        if (e.target && e.target.matches('#pc-schedule-exit') ) {
            _call_preview_change(e);
        }

        if (e.target && e.target.matches('#pc-schedule-cancel') ) {
            _cancel_scheduled(e);
        }

        if (e.target && e.target.matches('#pc-make-schedule') ) {
            _call_ajax_make_schedule(e);
        }

        if (e.target && e.target.matches('.pc-expand-variations') ) {
            _variations(e);
        }

        if (e.target && e.target.matches('.pc-select-column-regular') ) {
            _select_all_regular(e);
        }

        if (e.target && e.target.matches('.pc-select-column-sale') ) {
            _select_all_sale(e);
        }

        if (e.target && e.target.matches('.pc-select-column-schedule') ) {
            _select_all_schedule(e);
        }

        if (e.target && e.target.matches('.pc-show-column-variations') ) {
            _variations_expand(e);
        }

    });

    var searchInt = false;

    function _clears() {
        pc.execute = {};
        pc.schedule = {};
    }

    function _select_all_regular(e) {
        _clears();

        $.each( pc.products, function(i,o) {
            if ( o.type == 'simple' || o.type == 'variation' ) {
                pc.execute[i] = { _regular_price : true };
            }
        } );

        _variations_expand(e);
    }

    function _select_all_sale(e) {
        _clears();

        $.each( pc.products, function(i,o) {
            if ( o.type == 'simple' || o.type == 'variation' ) {
                pc.execute[i] = { _sale_price : true };
            }
        } );

        _variations_expand(e);
    }

    function _select_all_schedule(e) {
        _clears();

        $.each( pc.products, function(i,o) {
            if ( ( o.type == 'simple' || o.type == 'variation' ) && o._sale_price!=='' ) {
                pc.schedule[i] = { _sale_dates : true };
            }
        } );

        _variations_expand(e);

        setTimeout( function() {
            $.each( pc.schedule, function(i,o) {
                $('.pc-product[data-id="'+i+'"]').addClass('pc-active-picker');
            } );

            var template = wp.template( 'pc-schedule' );

            var tmplData = {
                id : Object.keys(pc.schedule)[0],
                _sale_from :  '',
                _sale_to : '',
            };
    
            var html = template( tmplData );
    
            $('.pc-product.pc-active-picker:first').after( html );
    
            $('#pc-schedule-from, #pc-schedule-to').datepicker( {
                dateFormat: 'yy-mm-dd',
                defaultDate: "+1w",
                minDate: new Date(),
                
                onSelect: function(o) {},
            } );
        }, 500 );
    }

    function _call_search(e) {
        if ( searchInt ) {
            clearTimeout(searchInt);
        }
        
        if ( pc.query.s !== $('#pc-search').val() ) {
            pc.query.paged = 1;
            pc.query.s = $('#pc-search').val();
            
            searchInt = setTimeout( function() {
                get_products({});
            }, 500 );
        }
    }

    function _variations_expand(e) {
        $.each( pc.products, function(i,o) {
            if ( o.type == 'variable' ) {
                pc.parents[i] = true;
            }
        } );

        setTimeout( function() {
            get_products(false);
        }, 250 );
    }

    function _variations(e) {
        if ( e.target.matches('.pc-active') ) {
            delete(pc.parents[e.target.parentNode.dataset.id]);
           
            get_products(false);
        }
        else {
            pc.parents[e.target.parentNode.dataset.id] = true;
            
            get_products(false);
        }
    }

    function _call_preview_change(e) {
        _preview_change();
    }

    function _make_command_selection(e) {
        $('.pc-checkbox').prop('checked',false);
        $(e.target).prop('checked',true);
    }

    function _call_confirm_change_price(e) {
        return _confirm_change_price(e);
    }

    function _confirm_change_price(e) {
        var id = typeof e.target.parentNode.parentNode.dataset.id == "undefined" ? e.target.parentNode.dataset.id : e.target.parentNode.parentNode.dataset.id;
        var type = typeof e.target.parentNode.dataset.type == "undefined" ? e.target.dataset.type : e.target.parentNode.dataset.type;

        if ( $('#pc-change-value').val() == pc.products[id][type] ) {
            return _close_change_price();
        }

        if( confirm('Set price?') ) {
            return _call_change_price(e);
        }

        return _close_change_price();
    }

	function _call_change_price(e) {
		if ( ajaxOn == 'active' ) {
			return false;
		}

        ajaxOn = 'active';

		var settings = {
			'type' : 'change_price',
            'id' : $('.pc-product.pc-change-price').attr('data-id'),
            'price' : $('#pc-change-value').val(),
            'price_type' : $('.pc-product.pc-change-price .pc-price.pc-change-price').attr('data-type'),
		};

        $.when( pc_ajax(settings) ).done( function(p) {
            if ( typeof p.success == 'undefined' || p.success === false ) {
                return;
            } 

            _add_real_change_price(e,parseFloat($('#pc-change-value').val()));
        } );
    }

    function _add_real_change_price(e,v) {
        var price = isNaN(v)?"":v;

        pc.products[$('.pc-product.pc-change-price').attr('data-id')][$('.pc-product.pc-change-price .pc-price.pc-change-price').attr('data-type')] = price;
        get_products(false);
    }

	function _close_change_price() {
        get_products(false);
    }

    function _make_change_price_input(e) {
        var id = e.target.parentNode.dataset.id;
        var type = e.target.dataset.type;

        $(e.target).append('<input id="pc-change-value" type="text" value="'+pc.products[id][type]+'" />');
        $('#pc-change-value').focus();
    }

    function _change_price(e) {
        if (e.target && !e.target.matches('.pc-change-price')) {
            _select_price_remove_class(e,'pc-active');
            
            _select_price_add_class(e,'pc-change-price');

            _make_change_price_input(e);
        }
        else {
            _select_price_remove_class(e,'pc-change-price');
        }
    }

    var editPrice = false;

    function _select_price(e) {
        if ( typeof pc.execute[e.target.parentNode.dataset.id] == 'undefined' ) {
            pc.execute[e.target.parentNode.dataset.id] = {};
        }

        if (e.target && !e.target.matches('.pc-active')) {
            _select_price_add_class(e,'pc-active');

            _add_price_change(e,true);
        }
        else {
            _select_price_remove_class(e,'pc-active');

            _remove_price_change(e,true);
        }
    }

    function _select_price_add_class(e,c) {
        e.target.classList.add(c);
        e.target.parentNode.classList.add(c);
    }

	function _select_price_remove_class(e,c) {
        e.target.classList.remove(c);
        e.target.parentNode.classList.remove(c);
    }

	function _add_price_change(e,v) {
        pc.execute[e.target.parentNode.dataset.id][e.target.dataset.type] = v;
    }

	function _remove_price_change(e,v) {
       delete pc.execute[e.target.parentNode.dataset.id][e.target.dataset.type];

       if ( $.isEmptyObject(pc.execute[e.target.parentNode.dataset.id]) ) {
           delete pc.execute[e.target.parentNode.dataset.id];
       }
    }

	function check_int() {
        build_table();
        
        get_products({});
    }

    function build_table() {
        var template = wp.template( 'pc-commander' );

		var tmplData = {};

		var html = template( tmplData );

        $('#price_commander-option').html( html );
        
        $('.pc-checkbox:first').prop('checked',true);
    }

    _clears();

    function display_pagination(p) {
        pc.pagination = p;

        $('#pc-pagination').empty();

        var pTotal = Math.ceil(p.total/p.posts_per_page);

        if ( pTotal>1 ) {
            var pHTML = '<select class="pc-pagination">';

            for( var i=1; i<=pTotal; i++ ) {
                pHTML += '<option value="'+i+'"'+(p.paged==i?' selected':'')+'>'+(i)+'</option>';
            }
            
            pHTML += '</select>';
            
            $('#pc-pagination').append( pHTML );
        }
        else {
            $('#pc-pagination').append( '<select class="pc-pagination" disabled><option value="1" selected>1</option></select>' );
        }
    }

    pc.parents = {};

    function display_products(p) {
        pc.products = p;

        $('#pc-products').empty();

        var template = wp.template( 'pc-product' );

        var dooo = {};

        $.each( p, function(i,o) {
            var doo = true;

            if ( typeof o.parent !== 'undefined' && o.parent && typeof pc.parents[o.parent] == 'undefined' ) {
                doo = false;
            }

            if ( doo ) {
                var tmplData = {
                    id : i,
                    type : o.type,
                    title : o.title,
                    image : o.image,
                    _price : o._price,
                    _regular_price : [
                        _accounting(o._regular_price),
                        typeof pc.execute[i] == 'undefined' ? '' : typeof pc.execute[i]._regular_price == 'undefined' ? '' : ' pc-active', 
                    ],
                    _sale_price : [
                        _accounting(o._sale_price),
                        typeof pc.execute[i] == 'undefined' ? '' : typeof pc.execute[i]._sale_price == 'undefined' ? '' : ' pc-active',
                    ],
                    _sale_dates: [
                        o._sale_from == null && o._sale_to == null ? '' : ' pc-active',
                        o._sale_from,
                        o._sale_to,
                    ],
                    parent : [
                        typeof o.parent == 'undefined' ? false : o.parent,
                        typeof pc.parents[i] == 'undefined' ? '' : ' pc-active',
                    ],
                };
    
                dooo[o.order] = template( tmplData );
            }
        } );

        var html = '';

        $.each( dooo, function(i,o) {
            html += o;
        } );

        $('#pc-products').append( html );

    }

    function htmlDecode(value) {
        return $("<textarea/>").html(value).text();
    }

    accounting.settings = {
        currency: {
            symbol : htmlDecode(pc.wc[0]),
            format: _get_accounting_format(),
            thousand: pc.wc[2],
            decimal : pc.wc[3],
            precision : pc.wc[4],
        },
        number: {
            thousand: pc.wc[2],
            decimal : pc.wc[3],
            precision : pc.wc[4],
        },
    };

    function _get_accounting_format() {
        switch( pc.wc[1] ) {
            case 'left':
                return '%s%v';
            break;

            case 'left_space':
                return '%s %v';
            break;

            case 'right':
                    return '%v%s';
            break;
            
            case 'right_space':
                return '%v %s';
            break;
            
            default:
            break;
        }
    }

    function _accounting(p) {
        return p==''?'<span class="pc-no-value"></span>':accounting.formatMoney(p);
    }

    function get_products(q) {
        if ( q === false && typeof pc.products !== 'undefined' ) {
            display_products(pc.products);
            display_pagination(pc.pagination);

            return false;
        }

		if ( ajaxOn == 'active' ) {
			return false;
		}

        ajaxOn = 'active';

		var settings = {
			'type' : 'get_products',
			'query' : q,
        };
        
        if ( pc.query.paged > 1 ) {
            settings.query.paged = pc.query.paged;
        }
        
        if ( pc.query.posts_per_page ) {
            settings.query.posts_per_page = pc.query.posts_per_page;
        }
        
        if ( pc.query.s ) {
            settings.query.s = pc.query.s;
        }

        if ( pc.query.orderby ) {
            settings.query.orderby = pc.query.orderby;
        }

        $.when( pc_ajax(settings) ).done( function(m) {
            display_products(m[0]);
            display_pagination(m[1]);
        } );
    }

    function _get_execute_operand() {
        return parseFloat($('#pc-operand').val());
    }
    
    function _execute_command(p) {
        switch ( $('#pc-execute .pc-checkbox:checked').attr('name') ) {
            case 'pc-set' :
                return _get_execute_operand();
            break;

            case 'pc-add' :
                return p+_get_execute_operand();
            break;

            case 'pc-substract' :
                return p-_get_execute_operand();
            break;

            case 'pc-multiply' :
                return p*_get_execute_operand();
            break;

            case 'pc-divide' :
                return p/_get_execute_operand();
            break;

            case 'pc-per-cent-up' :
                return (_get_execute_operand()/100+1)*p;
            break;

            case 'pc-per-cent-down' :
                return (1-_get_execute_operand()/100)*p;
            break;

            default :
            break;
        }
    }

    function _execute(p) {
        if ( isNaN(p) && $('#pc-execute .pc-checkbox:checked').attr('name') !== 'pc-set' ) {
            return '';
        }

        return '<del>'+accounting.formatMoney(p)+'</del> '+accounting.formatMoney(_execute_command(p));
    }

    function _preview_change() {
        display_products(pc.products);

        if ( $('#pc-operand').val() == '' ) {
            return;
        }

        $.each( pc.execute, function(i,o) {
            if ( typeof o._regular_price !== 'undefined' ) {
                $('.pc-product.pc-active[data-id="'+i+'"] .pc-active[data-type="_regular_price"]').html(_execute(parseFloat(pc.products[i]._regular_price)));
            }
            if ( typeof o._sale_price !== 'undefined' ) {
                var r = _execute(parseFloat(pc.products[i]._sale_price));
                r = r == '' ? _execute(parseFloat(pc.products[i]._regular_price)) : r;

                $('.pc-product.pc-active[data-id="'+i+'"] .pc-active[data-type="_sale_price"]').html(r);
            }
        } );

    }

    var ajaxOn = 'notactive';

    function pc_ajax( settings ) {

        $('#pc-products').addClass('pc-ajax');

		var data = {
			action: 'pc_ajax_factory',
			pc: settings
		};

		return $.ajax( {
			type: 'POST',
			url: pc.ajax,
			data: data,
			success: function(response) {
                ajaxOn = 'notactive';

                $('#pc-products').removeClass('pc-ajax');
			},
			error: function() {
				alert( 'AJAX Error!' );
				ajaxOn = 'notactive';
			}
		} );

	}

    pc.query = {
        'paged' : 1,
        'posts_per_page' : 12,
        's' : '',
        'orderby' : 'title',
    };

    function _call_ajax_pagination(e) {
        _clears();

        pc.query.paged = $(e.target).val();

        get_products({});
    }

    function _handle_ajax_execute_command(e,p) {
        if ( typeof p.timeout == 'undefined' ) {
            _clears();

            get_products({});
        }
        else {
            _call_ajax_execute_command(e,p.timeout);
        }
    }

    function _call_ajax_execute_command(e,t) {
		if ( ajaxOn == 'active' ) {
			return false;
        }

        if ( $.isEmptyObject(pc.execute) ) {
            return false;
        }

        ajaxOn = 'active';

		var settings = {
			'type' : 'execute',
        };

        if ( t ) {
            settings.timeout = t;
        }
        else {
            settings.timeout = 0;
            settings.execute = pc.execute;
            settings.operands = [
                $('#pc-execute .pc-checkbox:checked').attr('name'),
                _get_execute_operand(),
            ];
        }

        $.when( pc_ajax(settings) ).done( function(p) {
            if ( typeof p.success == 'undefined' ) {
                return alert('Error');
            }
            
            if ( p.success === false ) {
                console.log(p);
            } 

            _handle_ajax_execute_command(e,p);
        } );
    }

    function _get_sale_date(e,t) {
        if ( typeof pc.products[e.target.parentNode.dataset.id][t] == 'undefined' ) {
            return '';
        }

        if ( pc.products[e.target.parentNode.dataset.id][t] == null ) {
            return '';
        }

        return pc.products[e.target.parentNode.dataset.id][t].date.split(' ')[0];
    }

    function _select_schedule_add_class(e,c) {
        e.target.classList.add(c);

        if ( $('.pc-product.pc-active-picker').length==0 ) {
            e.target.parentNode.classList.add(c);
        }
    }

    function _select_schedule_remove_class(e,c) {
        e.target.classList.remove(c);
        e.target.parentNode.classList.remove(c);
    }

    function _call_schedule_ui(e) {
        _clears();

        _make_schedule_selected(e);

        var template = wp.template( 'pc-schedule' );

        var tmplData = {
            id : e.target.parentNode.dataset.id,
            _sale_from :  _get_sale_date(e,'_sale_from'),
            _sale_to : _get_sale_date(e,'_sale_to'),
        };

        var html = template( tmplData );

        $(e.target).closest('.pc-product').after( html );

        $('#pc-schedule-from, #pc-schedule-to').datepicker( {
            dateFormat: 'yy-mm-dd',
            defaultDate: "+1w",
            minDate: new Date(),
            
            onSelect: function(o) {},
        } );
    }

    function _make_schedule_selected(e) {
        pc.schedule[e.target.parentNode.dataset.id] = {};
        pc.schedule[e.target.parentNode.dataset.id]['_sale_dates'] = true;
        
        _select_schedule_add_class(e,'pc-active-picker');
    }

    function _remove_schedule_selected(e) {
        delete(pc.schedule[e.target.parentNode.dataset.id]);

        _select_schedule_remove_class(e,'pc-active-picker');
    }

    function _select_more_schedules(e) {
        if ( $(e.target).closest('.pc-product').hasClass('pc-active-picker') ) {
            return;
        }

        if ( e.target.matches('.pc-active-picker') ) {
            _remove_schedule_selected(e);
        }
        else {
            _make_schedule_selected(e);
        }

        
    }

    function _call_de_schedule(e) {
        _clears();

        get_products({});
    }

    function _call_schedule(e) {
        if ( $(e.target).prev().text() == '' ) {
            return $(e.target).prev().trigger('pc-double-click');
        }

        if ( $('#pc-schedule').length>0 ) {
            return _select_more_schedules(e);
        }

        $('.pc-product.pc-active, .pc-price.pc-active').removeClass('pc-active');

        $('#pc-schedule').remove();

        _call_schedule_ui(e);
    }

    function _cancel_scheduled(e) {
        $('#pc-schedule-from').val('');
        $('#pc-schedule-to').val('');

        _call_ajax_make_schedule(e);
    }

    function _call_ajax_make_schedule(e,f) {
		if ( ajaxOn == 'active' ) {
			return false;
        }

        if ( $.isEmptyObject( pc.schedule ) ) {
			return false;
		}

        ajaxOn = 'active';

		var settings = {
			'type' : 'schedule_sale',
            'schedule' : [
                pc.schedule,
                $('#pc-schedule-from').val(),
                $('#pc-schedule-to').val(),
            ],
        };

        $.when( pc_ajax(settings) ).done( function(m) {
            _call_de_schedule(e);
        } );

    }

    function _reset_operands(e) {
        $('#pc-operand').val('');
        $('#pc-set').trigger('click');
    }

})(jQuery);